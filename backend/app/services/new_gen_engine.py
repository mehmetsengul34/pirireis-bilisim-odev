# -*- coding: utf-8 -*-
"""
Yeni Nesil Soru Üretim Motoru (Gemini)

Eski akıştaki sorunlar ve bu motorun çözümü:
1. Tüm sorular tek istekte, 35 sn süre sınırıyla isteniyordu; çağrı sık sık zaman aşımına
   düşüp sessizce şablon sorulara dönülüyordu.
   -> Sorular küçük partiler (varsayılan 4) halinde, sınırlı paralellikle ve uzun süre
      sınırıyla istenir.
2. Modele hiç örnek yeni nesil soru gösterilmiyordu.
   -> Yerleşik özgün örnekler ve öğretmenin yüklediği PDF'lerden ayrıştırılan soru
      blokları istemde örnek olarak verilir.
3. "Yeni nesil" yalnızca sıfatlarla tarif ediliyordu.
   -> Model soruyu parçalar halinde üretir: bağlam + veri tablosu / öncüller + kök.
      Veri kaynağı olmayan veya bağlamı zayıf sorular yerel olarak elenir.
4. Üretilen sorunun cevabı hiç kontrol edilmiyordu.
   -> Ayrı bir Gemini çağrısı soruları cevap anahtarını görmeden çözer. Cevabı
      tutmayan veya tek adımlık bilgi sorusu olarak işaretlenen sorular elenir.

Ortam değişkenleri (hepsi isteğe bağlı):
- GEMINI_MODELS             : Üretim için virgülle ayrılmış model listesi (sırayla denenir)
- GEMINI_VERIFY_MODELS      : Doğrulama için model listesi (verilmezse GEMINI_MODELS)
- GEMINI_BATCH_SIZE         : Parti başına soru sayısı (varsayılan 4)
- GEMINI_MAX_CONCURRENCY    : Aynı anda çalışan parti sayısı (varsayılan 3)
- GEMINI_TIMEOUT_SECONDS    : Tek çağrı süre sınırı (varsayılan 120)
- GEMINI_VERIFY             : "0" verilirse doğrulama adımı atlanır
"""

import asyncio
import json
import os
import re
import time
import uuid
from typing import Any, Dict, List, Optional, Tuple

import httpx

from app.services.new_gen_examples import pick_examples

DEFAULT_MODELS = [
    "gemini-3.8-flash",
    "gemini-3.6-flash",
    "gemini-3-flash-preview",
    "gemini-flash-latest",
]

SOURCE_GEMINI = "gemini"
SOURCE_TEMPLATE = "sablon"


def _env_list(name: str, default: List[str]) -> List[str]:
    raw = os.getenv(name, "").strip()
    if not raw:
        return list(default)
    return [m.strip() for m in raw.split(",") if m.strip()]


def _env_int(name: str, default: int, lo: int, hi: int) -> int:
    try:
        return max(lo, min(hi, int(os.getenv(name, default))))
    except (TypeError, ValueError):
        return default


def generation_models() -> List[str]:
    return _env_list("GEMINI_MODELS", DEFAULT_MODELS)


def verification_models() -> List[str]:
    return _env_list("GEMINI_VERIFY_MODELS", generation_models())


def batch_size() -> int:
    return _env_int("GEMINI_BATCH_SIZE", 4, 1, 10)


def max_concurrency() -> int:
    return _env_int("GEMINI_MAX_CONCURRENCY", 3, 1, 8)


def call_timeout() -> float:
    return float(_env_int("GEMINI_TIMEOUT_SECONDS", 120, 20, 600))


def verification_enabled() -> bool:
    return os.getenv("GEMINI_VERIFY", "1").strip() not in ("0", "false", "False", "no")


# ================= ÖĞRETMEN PDF'LERİNDEN SORU BLOĞU AYRIŞTIRMA =================

_QUESTION_START = re.compile(r"(?m)^\s*(\d{1,3})\s*[\.\)]\s+(?=\S)")


def extract_question_blocks(text: str, max_blocks: int = 2, min_len: int = 220, max_len: int = 1400) -> List[str]:
    """
    PDF'ten çıkarılmış ham metni soru numaralarına göre bloklara ayırır ve
    yeni nesil soruya benzeyen (yeterince uzun, soru işareti ve şık içeren) blokları döndürür.
    Uzun ve veri içeren bloklar önceliklidir.
    """
    if not text:
        return []
    starts = [m.start() for m in _QUESTION_START.finditer(text)]
    if not starts:
        return []
    starts.append(len(text))
    blocks = []
    for i in range(len(starts) - 1):
        block = text[starts[i]:starts[i + 1]].strip()
        if len(block) < min_len:
            continue
        if "?" not in block:
            continue
        if not re.search(r"(?m)^\s*[A-E]\s*[\)\.]", block):
            continue
        block = re.sub(r"[ \t]+", " ", block)
        block = re.sub(r"\n{3,}", "\n\n", block)
        blocks.append(block[:max_len])

    def richness(b: str) -> int:
        score = len(b)
        if re.search(r"\b(tablo|grafik|şekil|deney|veri)\b", b, re.IGNORECASE):
            score += 600
        if re.search(r"(?m)^\s*(I|II|III|IV)\s*[\.\)]", b):
            score += 400
        return score

    blocks.sort(key=richness, reverse=True)
    return blocks[:max_blocks]


# ================= İSTEM (PROMPT) OLUŞTURMA =================

NEW_GEN_SPEC = """YENİ NESİL SORU TANIMI (BUNA KESİNLİKLE UY):
Yeni nesil soru, bilgiyi ezberden sormaz; öğrencinin verilen bir durumu okuyup veriyi yorumlayarak çok adımlı akıl yürütmesini ister. Her soru şu parçalardan oluşur:
1. "baglam": Gerçek yaşamdan, bir deneyden, bir metinden veya bir olaydan oluşan özgün durum (veri tablosu/öncül varsa en az 20, yoksa en az 60 kelime; en fazla 160 kelime). Sorunun çözümü bu bağlamı okumadan yapılamamalıdır.
2. Veri kaynağı (en az biri ZORUNLU):
   - "veri_tablosu": Markdown tablo (ilk satır başlık, ikinci satır |---|---|). Sayısal ve sözel tüm derslerde kullanılabilir (deney sonuçları, istatistik, kronoloji, iklim verisi, anket sonuçları vb.).
   - "onculler": I, II, III biçiminde sorgulanacak 2-4 yargı (dizi olarak, numarasız yaz).
   - Sayısal derslerde geometri/devre/grafik gerekiyorsa "visual_svg" (aşağıdaki kurallara uygun).
3. "soru_koku": Bağlama ve veriye dayanan, tek bir doğru cevabı olan kök. "Buna göre", "hangileri doğrudur", "kesinlikle söylenebilir", "ulaşılabilir" gibi muhakeme kalıpları tercih et.
4. Çözüm en az 2 mantıksal adım gerektirmeli ("adim_sayisi" >= 2). Tek bir formülü veya tanımı hatırlatmakla çözülen soru YASAKTIR.
5. Çeldiriciler rastgele değil; her biri gerçek bir öğrenci yanılgısını temsil etmeli ve "celdirici_analizi" içinde açıklanmalı.
6. Tüm sayısal sonuçları kendin adım adım hesapla; yalnızca BİR seçenek doğru olmalı. Emin olmadığın veri veya tarihî/bilimsel bilgi kullanma.
7. Resmî kazanım kodunu bilmiyorsan uydurma; "kazanim" alanına sınıf/ders ve kazanım adını yaz (örn. "TYT Fizik - Elektrik Devreleri")."""

FORMAT_RULES = """BİÇİM KURALLARI:
- Matematik ifadeleri $ ... $ içinde LaTeX olarak yazılır; derece için $30^\\circ$.
- Türkçe karakterleri doğrudan yaz (ç, ğ, ı, İ, ö, ş, ü).
- "Altı çizili" ifadesi geçiyorsa hedef sözcük <u>...</u> içine alınır.
- Ana düşünce / en kapsamlı yargı sorularında "metinden ulaşılamaz" türü geçersiz şık yazma.
- "visual_svg": Yalnızca sayısal derslerde ve şekil gerçekten gerekiyorsa viewBox'lı, temiz inline SVG; aksi halde null. Sözel derslerde her zaman null (veri için tablo kullan).
- Çıktı YALNIZCA geçerli bir JSON dizisidir; açıklama, markdown kod bloğu yazma."""


def _output_schema_hint(is_lgs: bool) -> str:
    letters = "A, B, C, D" if is_lgs else "A, B, C, D, E"
    return (
        "Her eleman şu alanlara sahip bir JSON nesnesidir: "
        "baglam (string), veri_tablosu (string veya null), onculler (string dizisi veya null), "
        f"soru_koku (string), secenekler (nesne; anahtarlar tam olarak {letters}), dogru_cevap (harf), "
        "cozum (adım adım string), celdirici_analizi (nesne; her harf için yanılgı açıklaması), "
        "kazanim (string), bilissel_duzey ('Kavrama' | 'Uygulama' | 'Analiz / Muhakeme' | 'Üst Düzey Akıl Yürütme'), "
        "alt_konu (string), adim_sayisi (tam sayı), visual_svg (string veya null)."
    )


def build_generation_prompt(
    exam_type: str,
    subject: str,
    topic: str,
    difficulty: str,
    count: int,
    verbal: bool,
    custom_prompt: Optional[str] = None,
    training_guidelines: Optional[str] = None,
    teacher_examples: Optional[List[str]] = None,
    avoid_stems: Optional[List[str]] = None,
) -> Tuple[str, str]:
    """(system_instruction, user_message) döndürür."""
    is_lgs = str(exam_type).upper() == "LGS"
    commission = (
        "MEB 8. Sınıf LGS Soru Hazırlama Komisyonu" if is_lgs
        else f"ÖSYM YKS ({exam_type}) Soru Hazırlama Komisyonu"
    )
    opt_rule = (
        "LGS soruları 4 seçeneklidir (A, B, C, D); E seçeneği YOKTUR." if is_lgs
        else "TYT/AYT soruları 5 seçeneklidir (A, B, C, D, E)."
    )

    examples = pick_examples(exam_type, verbal, limit=2)
    examples_json = json.dumps(examples, ensure_ascii=False, indent=1)

    system = f"""Sen {commission} üyesi deneyimli bir soru yazarısın. Görevin, {exam_type} sınavına uygun, özgün ve yeni nesil çoktan seçmeli sorular yazmaktır.

{NEW_GEN_SPEC}

{FORMAT_RULES}

SEÇENEK KURALI: {opt_rule}

ÇIKTI ŞEMASI: {_output_schema_hint(is_lgs)}

AŞAĞIDAKİ ÖRNEKLER İSTENEN KALİTE VE BİÇİMİ GÖSTERİR. Konularını veya sayılarını KOPYALAMA; yalnızca yapı, derinlik ve üslup için örnek al. (Örneklerin şık sayısı farklıysa yukarıdaki seçenek kuralına uy.)
{examples_json}"""

    if teacher_examples:
        joined = "\n\n---\n\n".join(teacher_examples)
        system += f"""

ÖĞRETMENİN YÜKLEDİĞİ GERÇEK SINAV KİTAPÇIKLARINDAN ALINMIŞ ÖRNEK SORULAR (PDF'ten çıkarıldığı için tablo ve şekiller bozulmuş olabilir). Bunları ASLA kopyalama; soru derinliği, uzunluğu ve dil üslubu için rehber al:
{joined}"""

    if training_guidelines:
        system += f"""

ÖĞRETMEN DOKÜMANLARINDAN ÇIKARILAN ÜSLUP NOTLARI:
{training_guidelines}"""

    user = (
        f"Sınav: {exam_type}\nDers: {subject}\nKonu: {topic}\nZorluk: {difficulty}\n"
        f"Bu ders ve konu için birbirinden tamamen farklı bağlamlara sahip {count} adet yeni nesil soru yaz. "
        f"Her soru farklı bir alt beceriyi veya durumu ölçsün.\n"
        f"Oturum kodu: {time.time():.0f}-{uuid.uuid4().hex[:6]}"
    )
    if topic and topic != "Karma":
        user += f"\nTüm sorular '{topic}' konusunun kazanımları içinde kalmalıdır."
    if avoid_stems:
        short = [s[:160].replace("\n", " ") for s in avoid_stems[:12]]
        user += "\nŞu bağlamlara benzeyen soru YAZMA (daha önce üretildi):\n- " + "\n- ".join(short)
    if custom_prompt:
        user += f"\nÖğretmenin özel notu: {custom_prompt}"
    return system, user


# ================= GEMINI ÇAĞRISI =================

def _strip_code_fence(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?", "", raw)
        raw = re.sub(r"```$", "", raw)
    return raw.strip()


def _extract_text(data: Dict[str, Any]) -> Optional[str]:
    cands = data.get("candidates") or []
    if not cands:
        return None
    parts = (cands[0].get("content") or {}).get("parts") or []
    texts = [p.get("text", "") for p in parts if isinstance(p, dict) and not p.get("thought")]
    text = "".join(texts).strip()
    return text or None


async def call_gemini_json(
    client: httpx.AsyncClient,
    api_key: str,
    system: str,
    user: str,
    models: List[str],
    temperature: float,
    log: List[str],
) -> Tuple[Optional[Any], Optional[str]]:
    """Modelleri sırayla dener; ilk geçerli JSON yanıtını (parsed, model_adı) olarak döndürür."""
    payload = {
        "systemInstruction": {"parts": [{"text": system}]},
        "contents": [{"role": "user", "parts": [{"text": user}]}],
        "generationConfig": {
            "temperature": temperature,
            "topP": 0.95,
            "responseMimeType": "application/json",
        },
    }
    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
        started = time.monotonic()
        try:
            res = await client.post(url, json=payload, headers={"x-goog-api-key": api_key})
        except httpx.TimeoutException:
            log.append(f"{model}: zaman aşımı ({call_timeout():.0f} sn)")
            continue
        except httpx.HTTPError as e:
            log.append(f"{model}: bağlantı hatası ({type(e).__name__})")
            continue
        elapsed = time.monotonic() - started
        if res.status_code != 200:
            detail = ""
            try:
                detail = (res.json().get("error") or {}).get("message", "")[:160]
            except Exception:
                pass
            log.append(f"{model}: HTTP {res.status_code} {detail}".strip())
            continue
        try:
            text = _extract_text(res.json())
            if not text:
                log.append(f"{model}: boş yanıt")
                continue
            parsed = json.loads(_strip_code_fence(text))
            log.append(f"{model}: yanıt alındı ({elapsed:.0f} sn)")
            return parsed, model
        except (json.JSONDecodeError, ValueError) as e:
            log.append(f"{model}: JSON çözümlenemedi ({e})")
            continue
    return None, None


# ================= YAPISAL DÖNÜŞÜM VE YEREL DENETİM =================

def _clean_table(table: Optional[str]) -> Optional[str]:
    if not table or not isinstance(table, str):
        return None
    lines = [ln.strip() for ln in table.strip().splitlines() if ln.strip()]
    lines = [ln for ln in lines if ln.startswith("|")]
    if len(lines) < 3:
        return None
    if not re.match(r"^\|\s*:?-{2,}", lines[1]):
        lines.insert(1, "|" + "---|" * max(1, lines[0].count("|") - 1))
    return "\n".join(lines)


def assemble_question_text(item: Dict[str, Any]) -> str:
    parts = []
    baglam = str(item.get("baglam") or "").strip()
    if baglam:
        parts.append(baglam)
    table = _clean_table(item.get("veri_tablosu"))
    if table:
        parts.append(table)
    onculler = item.get("onculler")
    if isinstance(onculler, list) and onculler:
        roman = ["I", "II", "III", "IV", "V"]
        lines = []
        for i, o in enumerate(onculler[:5]):
            o = re.sub(r"^\s*(I{1,3}|IV|V)\s*[\.\)]\s*", "", str(o)).strip()
            lines.append(f"{roman[i]}. {o}")
        parts.append("\n".join(lines))
    kok = str(item.get("soru_koku") or "").strip()
    if kok:
        parts.append(kok)
    return "\n\n".join(parts)


def local_quality_issues(item: Dict[str, Any], is_lgs: bool) -> List[str]:
    """Modele gerek kalmadan yakalanabilen yapısal sorunlar. Boş liste = geçti."""
    issues = []
    letters = ["A", "B", "C", "D"] if is_lgs else ["A", "B", "C", "D", "E"]
    opts = item.get("secenekler") or {}
    if not isinstance(opts, dict):
        return ["seçenekler nesne değil"]
    vals = [str(opts.get(k) or "").strip() for k in letters]
    if any(not v for v in vals):
        issues.append("eksik seçenek")
    if len(set(v.lower() for v in vals)) < len(vals):
        issues.append("tekrarlanan seçenek")
    ans = str(item.get("dogru_cevap") or "").strip().upper()[:1]
    if ans not in letters:
        issues.append(f"geçersiz doğru cevap '{ans}'")
    baglam = str(item.get("baglam") or "").strip()
    kok = str(item.get("soru_koku") or "").strip()
    if not kok:
        issues.append("soru kökü yok")
    has_table = _clean_table(item.get("veri_tablosu")) is not None
    has_premises = isinstance(item.get("onculler"), list) and len(item.get("onculler")) >= 2
    has_svg = bool(item.get("visual_svg"))
    words = len(baglam.split())
    has_data = has_table or has_premises or has_svg
    if has_data and words < 8:
        issues.append(f"bağlam çok kısa ({words} kelime)")
    if not has_data:
        if words < 60:
            issues.append(f"veri kaynağı (tablo, öncül veya şekil) yok ve bağlam çok kısa ({words} kelime)")
    try:
        if int(item.get("adim_sayisi") or 0) < 2:
            issues.append("tek adımlık soru")
    except (TypeError, ValueError):
        pass
    return issues


def to_legacy_schema(item: Dict[str, Any], is_lgs: bool, topic: str) -> Dict[str, Any]:
    """Yeni yapılı soruyu uygulamanın mevcut soru biçimine çevirir."""
    opts = item.get("secenekler") or {}
    ans = str(item.get("dogru_cevap") or "A").strip().upper()[:1]
    celdirici = item.get("celdirici_analizi")
    if isinstance(celdirici, dict):
        celdirici = json.dumps(celdirici, ensure_ascii=False)
    q = {
        "question_text": assemble_question_text(item),
        "option_a": str(opts.get("A") or ""),
        "option_b": str(opts.get("B") or ""),
        "option_c": str(opts.get("C") or ""),
        "option_d": str(opts.get("D") or ""),
        "option_e": None if is_lgs else str(opts.get("E") or ""),
        "correct_answer": ans,
        "correct_option": ans,
        "explanation": str(item.get("cozum") or ""),
        "learning_outcome_code": str(item.get("kazanim") or "")[:100] or None,
        "cognitive_domain": str(item.get("bilissel_duzey") or "Analiz / Muhakeme")[:100],
        "distractor_analysis": celdirici,
        "topic": topic,
        "subtopic": str(item.get("alt_konu") or "")[:150] or None,
        "visual_svg": item.get("visual_svg") or None,
        "source": SOURCE_GEMINI,
    }
    return q


# ================= BAĞIMSIZ ÇÖZÜMLE DOĞRULAMA =================

VERIFY_SYSTEM = """Sen deneyimli bir ölçme-değerlendirme uzmanı ve konu öğretmenisin. Sana cevap anahtarı OLMADAN çoktan seçmeli sorular verilecek.
Her soruyu kendin adım adım çöz ve şu alanlarla bir JSON dizisi döndür:
- id: sorunun id değeri
- cevap: senin bulduğun doğru seçenek harfi (birden fazla doğru seçenek varsa veya hiçbiri doğru değilse "X")
- yeni_nesil: soru bağlam/veri okuyup çok adımlı akıl yürütme gerektiriyorsa true; tek bir bilgi, tanım veya formülü hatırlamakla çözülüyorsa false
- sorun: soruda bilimsel/tarihî hata, eksik veri, çelişki veya belirsizlik varsa kısa açıklama; yoksa null
Yalnızca JSON dizisi döndür."""


async def verify_questions(
    client: httpx.AsyncClient,
    api_key: str,
    questions: List[Dict[str, Any]],
    log: List[str],
) -> Optional[Dict[int, Dict[str, Any]]]:
    """Soruları cevap anahtarı olmadan çözdürür. Başarısız olursa None döner."""
    payload_items = []
    for i, q in enumerate(questions):
        opts = {k.upper(): q.get(f"option_{k}") for k in "abcde" if q.get(f"option_{k}")}
        payload_items.append({"id": i, "soru": q.get("question_text", ""), "secenekler": opts})
    user = json.dumps(payload_items, ensure_ascii=False)
    parsed, model = await call_gemini_json(
        client, api_key, VERIFY_SYSTEM, user, verification_models(), temperature=0.1, log=log
    )
    if parsed is None:
        return None
    if isinstance(parsed, dict):
        parsed = parsed.get("sonuclar") or parsed.get("results") or [parsed]
    out: Dict[int, Dict[str, Any]] = {}
    for r in parsed if isinstance(parsed, list) else []:
        try:
            out[int(r.get("id"))] = r
        except (TypeError, ValueError, AttributeError):
            continue
    return out


def apply_verification(
    questions: List[Dict[str, Any]], results: Optional[Dict[int, Dict[str, Any]]]
) -> Tuple[List[Dict[str, Any]], List[str]]:
    """Doğrulama sonucuna göre soruları kabul eder veya eler. (kabul_edilenler, ret_nedenleri)"""
    accepted, rejected = [], []
    for i, q in enumerate(questions):
        if results is None:
            q["verified"] = False
            q["quality_review"] = "Gemini ile üretildi; doğrulama çağrısı yapılamadı (öğretmen kontrolü önerilir)."
            accepted.append(q)
            continue
        r = results.get(i)
        if not r:
            q["verified"] = False
            q["quality_review"] = "Gemini ile üretildi; doğrulama yanıtında bu soru yoktu (öğretmen kontrolü önerilir)."
            accepted.append(q)
            continue
        solved = str(r.get("cevap") or "").strip().upper()[:1]
        expected = str(q.get("correct_option") or "").upper()
        problem = r.get("sorun")
        if solved != expected:
            rejected.append(f"cevap uyuşmadı (anahtar {expected}, bağımsız çözüm {solved or '?'})")
            continue
        if r.get("yeni_nesil") is False:
            rejected.append("doğrulayıcı tek adımlık bilgi sorusu buldu")
            continue
        if problem and str(problem).strip().lower() not in ("null", "none", "yok", ""):
            rejected.append(f"doğrulayıcı sorun buldu: {str(problem)[:120]}")
            continue
        q["verified"] = True
        q["quality_review"] = "Gemini ile üretildi ve cevap anahtarı görülmeden bağımsız çözümle doğrulandı."
        accepted.append(q)
    return accepted, rejected


# ================= ANA AKIŞ =================

async def generate_new_gen_questions(
    exam_type: str,
    subject: str,
    topic: str,
    difficulty: str,
    question_count: int,
    api_key: str,
    verbal: bool,
    custom_prompt: Optional[str] = None,
    training_guidelines: Optional[str] = None,
    teacher_examples: Optional[List[str]] = None,
    avoid_texts: Optional[List[str]] = None,
    max_rounds: int = 2,
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Yeni nesil soruları küçük partiler halinde üretir, yerel denetimden ve bağımsız
    çözüm doğrulamasından geçirir. (sorular, rapor) döndürür.
    Rapor, öğretmene gösterilecek özet bilgileri içerir.
    """
    is_lgs = str(exam_type).upper() == "LGS"
    log: List[str] = []
    report: Dict[str, Any] = {
        "requested": question_count,
        "generated_raw": 0,
        "rejected_local": 0,
        "rejected_verification": 0,
        "verified": 0,
        "unverified": 0,
        "models_used": [],
        "rejection_reasons": [],
        "log": log,
    }
    accepted: List[Dict[str, Any]] = []
    produced_stems: List[str] = list(avoid_texts or [])[-12:]
    sem = asyncio.Semaphore(max_concurrency())
    bsize = batch_size()

    async def run_batch(client: httpx.AsyncClient, n: int) -> List[Dict[str, Any]]:
        async with sem:
            system, user = build_generation_prompt(
                exam_type, subject, topic, difficulty, n, verbal,
                custom_prompt=custom_prompt,
                training_guidelines=training_guidelines,
                teacher_examples=teacher_examples,
                avoid_stems=produced_stems,
            )
            parsed, model = await call_gemini_json(
                client, api_key, system, user, generation_models(), temperature=0.8, log=log
            )
            if parsed is None:
                return []
            if model and model not in report["models_used"]:
                report["models_used"].append(model)
            if isinstance(parsed, dict):
                parsed = parsed.get("sorular") or parsed.get("questions") or [parsed]
            if not isinstance(parsed, list):
                return []
            report["generated_raw"] += len(parsed)
            good = []
            for item in parsed:
                if not isinstance(item, dict):
                    continue
                issues = local_quality_issues(item, is_lgs)
                if issues:
                    report["rejected_local"] += 1
                    report["rejection_reasons"].append("yapı: " + ", ".join(issues))
                    continue
                good.append(to_legacy_schema(item, is_lgs, topic))
            if not good:
                return []
            if verification_enabled():
                results = await verify_questions(client, api_key, good, log)
                ok, rej = apply_verification(good, results)
                report["rejected_verification"] += len(rej)
                report["rejection_reasons"].extend("doğrulama: " + r for r in rej)
                return ok
            for q in good:
                q["verified"] = False
                q["quality_review"] = "Gemini ile üretildi; doğrulama kapalı."
            return good

    timeout = httpx.Timeout(call_timeout(), connect=15.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        for round_idx in range(max_rounds):
            missing = question_count - len(accepted)
            if missing <= 0:
                break
            # Elenecekleri telafi etmek için ikinci turda biraz fazla iste
            want = missing if round_idx == 0 else min(missing + 2, missing * 2)
            sizes = [bsize] * (want // bsize) + ([want % bsize] if want % bsize else [])
            results = await asyncio.gather(*(run_batch(client, n) for n in sizes), return_exceptions=True)
            got_any = False
            for res in results:
                if isinstance(res, Exception):
                    log.append(f"parti hatası: {type(res).__name__}: {res}")
                    continue
                for q in res:
                    got_any = True
                    accepted.append(q)
                    produced_stems.append(q.get("question_text", ""))
            if not got_any and round_idx == 0 and report["generated_raw"] == 0:
                # Hiçbir model yanıt vermediyse ikinci turu deneme (anahtar/kota sorunu olabilir)
                break

    accepted = accepted[:question_count] if len(accepted) > question_count else accepted
    report["verified"] = sum(1 for q in accepted if q.get("verified"))
    report["unverified"] = sum(1 for q in accepted if not q.get("verified"))
    report["rejection_reasons"] = report["rejection_reasons"][:20]
    for line in log:
        print(f"[NewGenEngine] {line}")
    return accepted, report
