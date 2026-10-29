# -*- coding: utf-8 -*-
"""
TYT (Temel Yeterlilik Testi) Soru Üretim Motoru (MEB / ÖSYM Standartları)
Branşlar:
1. Türkçe
2. Temel Matematik
3. Geometri
4. Fizik
5. Kimya
6. Biyoloji
7. Tarih
8. Coğrafya
9. Felsefe
10. Din Kültürü ve Ahlak Bilgisi

Standart:
- 5 seçenek (A, B, C, D, E).
- KaTeX formülleri $ ... $ biçiminde.
- Altı çizili sözcüklerde <u>...</u> etiketi zorunlu.
- Şıklarda 'ulaşılamaz' veya yapay meta çeldirici bulunmaz.
- Bilişsel Düzey: Hatırlama, Kavrama, Uygulama, Analiz / Muhakeme.
"""

import random
import math
from typing import Dict, Any, List

def format_tyt_options(correct_text: str, distractors: List[str]) -> Dict[str, Any]:
    """TYT için 5 seçenek (A, B, C, D, E) oluşturur."""
    letters = ["A", "B", "C", "D", "E"]
    corr_idx = random.randint(0, 4)
    clean_dist = [d for d in distractors if "ulaşılamaz" not in str(d).lower()][:4]
    
    fillers = [
        "Kavramsal derinliğe sahip metinler dönemsel koşullarla doğrudan ilişkilidir.",
        "Sanatsal ve kültürel üretim çağın gereksinimlerinden bağımsız ele alınamaz.",
        "Bireysel deneyimler toplumsal değerlerin oluşumunda tek belirleyici unsurdur.",
        "Bilimsel ve felsefi gelişmeler toplumsal ilerlemenin temel itici gücüdür.",
        "Sistematik yaklaşımlar analitik muhakemenin ön koşuludur."
    ]
    f_idx = 0
    while len(clean_dist) < 4:
        cand = fillers[f_idx % len(fillers)]
        f_idx += 1
        if cand not in clean_dist and cand != correct_text:
            clean_dist.append(cand)
            
    random.shuffle(clean_dist)
    
    opts = {}
    d_ptr = 0
    for i, letter in enumerate(letters):
        key = f"option_{letter.lower()}"
        if i == corr_idx:
            opts[key] = correct_text
        else:
            opts[key] = clean_dist[d_ptr]
            d_ptr += 1
            
    opts["correct_option"] = letters[corr_idx]
    return opts


# ================= 1. TYT TÜRKÇE =================

def gen_tyt_turkce(index: int) -> Dict[str, Any]:
    archetype = index % 7
    
    if archetype == 0:
        # Paragrafta Ana Düşünce
        themes = [
            ("Edebi Dil", "Bir şairin büyüklüğü, dili gündelik konuşmanın sıradanlığından kurtarıp ona yeni çağrışım alanları açabilme yeteneğinde gizlidir. Kelimeleri sözlük anlamlarına hapseden bir yazar, okuyucunun muhayyilesini asla harekete geçiremez.", "Şiirsel ve sanatsal değer, dile kazandırılan özgün çağrışımlar ve çok katmanlı anlam zenginliğiyle ölçülür.", [
                "Şairler eserlerini herkesin kolayca anlayabileceği yalın bir dille oluşturmalıdır.",
                "Sözlük anlamının dışına çıkan metinler okuyucuda anlamsal kargaşaya yol açar.",
                "Edebi metinlerin başarısı yalnızca kelime dağarcığının genişliğine bağlıdır.",
                "Gündelik konuşma dili edebiyatın yegane zenginlik kaynağıdır."
            ]),
            ("Roman ve Gerçeklik", "Roman bir ayna gibi sokakta gezdirilse de o aynayı tutan elin estetik tercihleri gerçekliği yeniden biçimlendirir. Dolayısıyla en katı realist yazar dahi dünyayı olduğu gibi değil, kendi duyarlılık süzgecinden geçirerek anlatır.", "Romandaki gerçeklik, yazarın öznel algısı ve sanatsal yorumuyla yeniden inşa edilmiş bir kurgudur.", [
                "Realist romanlarda yazarın kişisel duyarlılığı ve yorumu kesinlikle yer almaz.",
                "Kurgusal metinler toplumsal olayları belgesel niteliğinde aktarmalıdır.",
                "Sanatçının özgünlüğü gerçek hayatı birebir kopyalama başarısına dayanır.",
                "Okuyucu romanı okurken yazarın dünya görüşünü doğrudan benimsemelidir."
            ])
        ]
        t = themes[index % len(themes)]
        q_text = f"**Paragraf:**\n\"{t[1]}\"\n\nBu parçada yazarın **asıl anlatmak istediği düşünce (ana fikir)** aşağıdakilerden hangisidir?"
        opts = format_tyt_options(t[2], t[3])
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Türkçe",
            "topic": "Paragrafta Anlam",
            "subtopic": "Ana Düşünce ve Vurgulanan Yargı",
            "learning_outcome_code": "T.TYT.1.2",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"Yazarın savunduğu temel argüman: {t[2]}",
            **opts
        }

    elif archetype == 1:
        # Altı Çizili Sözcük / Söz Öbeği
        phrases = [
            ("kabuğuna çekilmek", "dış dünya ve toplumsal ilişkilerden soyutlanıp kendi içine kapanmak", "büyük bir borcun altına girmek", "yeni bir işe cesaretle atılmak", "fiziksel olarak sakatlanmak", "ailesiyle sorunlar yaşamak"),
            ("zamanın eleğinden geçmek", "kalıcılığını kanıtlayıp çağlar boyu değerini koruyabilmek", "güncel olayları günü gününe takip etmek", "hızlıca unutulup gitmek", "tarihi eserleri restore etmek", "zamanı boşa harcamak"),
            ("kendi sesini bulmak", "taklitçilikten kurtulup kendine özgü ve taklit edilemez bir üslup yakalamak", "yüksek sesle şiir okumak", "geleneksel tarzı aynen sürdürmek", "toplumun beklentilerine göre yazmak", "eleştirmenlerin beğenisini kazanmak")
        ]
        p = phrases[index % len(phrases)]
        q_text = f"Sanat hayatının ilk yıllarında ustalara öykünen yazar, son eserlerinde artık <u>{p[0]}</u> başarısını göstermiştir.\n\nBu cümledeki altı çizili sözün cümleye kattığı anlam aşağıdakilerden hangisidir?"
        opts = format_tyt_options(p[1], [p[2], p[3], p[4], p[5]])
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Türkçe",
            "topic": "Sözcükte Anlam",
            "subtopic": "Söz Öbeklerinde Anlam",
            "learning_outcome_code": "T.TYT.1.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"'{p[0]}' ifadesi cümlede mecazen '{p[1]}' durumunu karşılar.",
            **opts
        }

    elif archetype == 2:
        # Ses Bilgisi
        sounds = [
            ("Ayrılık", "Ünlü Düşmesi (ayır-ılık)", ["Ünsüz Benzeşmesi", "Ünlü Daralması", "Ünsüz Türemesi", "Büyük Ünlü Uyumu Bozulması"]),
            ("Kitapçı", "Ünsüz Benzeşmesi (kitap-cı -> kitapçı)", ["Ünlü Düşmesi", "Ünsüz Yumuşaması", "Ünlü Daralması", "Ünsüz Düşmesi"]),
            ("Ağacın", "Ünsüz Yumuşaması (ağaç-ın -> ağacın)", ["Ünsüz Benzeşmesi", "Ünlü Türemesi", "Ünsüz Türemesi", "Ünlü Düşmesi"]),
            ("Söylüyor", "Ünlü Daralması (söyle-yor -> söylüyor)", ["Ünsüz Yumuşaması", "Ünsüz Benzeşmesi", "Ünlü Düşmesi", "Kaynaştırma Ünsüzü"])
        ]
        s = sounds[index % len(sounds)]
        q_text = f"\"Sonbaharda dökülen sarı yapraklar, derin bir <u>{s[0].lower()}</u> hissi uyandırıyordu.\"\n\nBu cümledeki altı çizili sözcükte görülen **ses olayı** aşağıdakilerden hangisidir?"
        corr = s[1].split(" (")[0]
        opts = format_tyt_options(corr, s[2])
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Türkçe",
            "topic": "Ses Bilgisi",
            "subtopic": "Ses Olayları ve Kuralları",
            "learning_outcome_code": "T.TYT.2.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"'{s[0]}' sözcüğünde {s[1]} kuralı gerçekleşmiştir.",
            **opts
        }

    elif archetype == 3:
        # Sözcük Türleri: Sıfat, Zamir, Zarf, Edat, Bağlaç
        q_text = "\"<u>Yalnız</u> taş duvar olmaz.\" atasözündeki altı çizili sözcüğün türü ile;\n\"Bu zor günlerde <u>yalnız</u> sana güveniyorum.\"\ncümlesindeki altı çizili sözcüğün **türleri** sırasıyla hangisinde doğru verilmiştir?"
        corr = "Sıfat — Edat (İlgeç)"
        dist = [
            "Zarf — Bağlaç",
            "İsim — Sıfat",
            "Zarf — Edat (İlgeç)",
            "Sıfat — Bağlaç"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Türkçe",
            "topic": "Dil Bilgisi",
            "subtopic": "Sözcük Türleri (Sıfat, Edat, Zarf)",
            "learning_outcome_code": "T.TYT.2.3",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "İlkinde ismi nitelediği için Niteleme Sıfatı; ikincisinde 'sadece' anlamında kullanıldığı için Edat (İlgeç)'tir.",
            **opts
        }

    elif archetype == 4:
        # Yazım Kuralları: 'de' ve 'ki' Bağlaçları
        q_text = "Aşağıdaki cümlelerin hangisinde **yazım yanlışı** yapılmıştır?"
        corr = "Sende bizimle toplantıya gelseydin bu kararları birlikte tartışırdık."
        dist = [
            "Evde ki hesap çarşıya uymayınca bütçeyi yeniden planlamak zorunda kaldık.",
            "Yarınki sınav için kütüphanede sabaha kadar çalıştılar.",
            "Oysaki her şey tam da planladığımız gibi ilerliyordu.",
            "Türk Dil Kurumunun son yayımladığı kılavuzu incelediniz mi?"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Türkçe",
            "topic": "Yazım Kuralları",
            "subtopic": "Bağlaç Olan 'de/da' ve 'ki'nin Yazımı",
            "learning_outcome_code": "T.TYT.2.5",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Cümledeki 'de' bağlaçtır ve 'Sen de bizimle...' şeklinde ayrı yazılmalıdır.",
            **opts
        }

    elif archetype == 5:
        # Cümlenin Ögeleri
        q_text = "\"Sanatçı, çocukluğunun en güzel anılarını biriktirdiği o sahil kasabasını romanında büyüleyici bir dille tasvir etmiştir.\"\n\nBu cümlenin **ögelerinin dizilişi** aşağıdakilerin hangisinde sırasıyla doğru verilmiştir?"
        corr = "Özne — Belirtili Nesne — Yer Tamlayıcısı (Dolaylı Tümleç) — Zarf Tamlayıcısı — Yüklem"
        dist = [
            "Özne — Zarf Tamlayıcısı — Belirtili Nesne — Yüklem",
            "Özne — Belirtili Nesne — Zarf Tamlayıcısı — Yüklem",
            "Belirtisiz Nesne — Özne — Yer Tamlayıcısı — Yüklem",
            "Özne — Yer Tamlayıcısı — Belirtili Nesne — Zarf Tamlayıcısı — Yüklem"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Türkçe",
            "topic": "Cümlenin Ögeleri",
            "subtopic": "Öge Dizilişi ve Çözümlemesi",
            "learning_outcome_code": "T.TYT.2.4",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Tasvir etmiştir (Yüklem), Kim? Sanatçı (Özne), Neyi? o sahil kasabasını (Belirtili Nesne), Nerede? romanında (Yer Tamlayıcısı), Nasıl? büyüleyici bir dille (Zarf Tamlayıcısı).",
            **opts
        }

    else:
        # Noktalama İşaretleri: Kesme İşareti ve Noktalı Virgül
        q_text = "Türkiye'de [ ] özellikle edebiyat, felsefe ve sanat alanında yetkinleşmiş isimler [ ] genç kuşaklara yol göstermeli [ ] onların estetik beğenilerini geliştirmelidir [ ]\n\nBu parçada yay ayraçla gösterilen yerlere sırasıyla hangi noktalama işaretleri getirilmelidir?"
        corr = ", (Virgül) — ; (Noktalı Virgül) — , (Virgül) — . (Nokta)"
        dist = [
            "; (Noktalı Virgül) — , (Virgül) — ; (Noktalı Virgül) — . (Nokta)",
            ", (Virgül) — , (Virgül) — ; (Noktalı Virgül) — . (Nokta)",
            ". (Nokta) — : (İki Nokta) — , (Virgül) — . (Nokta)",
            ", (Virgül) — : (İki Nokta) — ; (Noktalı Virgül) — ! (Ünlem)"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Türkçe",
            "topic": "Noktalama İşaretleri",
            "subtopic": "Noktalı Virgül ve Virgül Kullanımı",
            "learning_outcome_code": "T.TYT.2.6",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Ögeleri arasında virgül bulunan sıralı cümleleri birbirinden ayırmak için noktalı virgül kullanılır.",
            **opts
        }


# ================= 2. TYT TEMEL MATEMATİK =================

def gen_tyt_matematik(index: int) -> Dict[str, Any]:
    archetype = index % 8
    
    if archetype == 0:
        # Yeni Nesil Problemler: Yaş Problemleri
        diff = random.choice([4, 6, 8, 10])
        ratio = random.choice([2, 3])
        # Bir babanın yaşı oğlunun yaşının 3 katıdır. diff yıl sonra babanın yaşı...
        son_age = random.randint(8, 15)
        father_age = son_age * 3
        q_text = f"Bir babanın şimdiki yaşı, oğlunun şimdiki yaşının $3$ katıdır. ${diff}$ yıl sonra babanın yaşı, oğlunun yaşının $2$ katından ${father_age + diff - 2*(son_age + diff)}$ fazla olacaktır.\n\nBuna göre babanın **şimdiki yaşı** kaçtır?"
        corr = f"${father_age}$"
        dist = [f"${father_age - 3}$", f"${father_age + 6}$", f"${father_age - 6}$", f"${father_age + 9}$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Temel Matematik",
            "topic": "Problemler",
            "subtopic": "Yaş Problemleri",
            "learning_outcome_code": "MAT.TYT.3.2",
            "cognitive_domain": "Uygulama / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"Oğul $x = {son_age}$, Baba $3x = {father_age}$ yaşındadır.",
            **opts
        }

    elif archetype == 1:
        # Hız - Hareket Problemleri
        v1 = random.choice([60, 70, 80])
        v2 = random.choice([80, 90, 100])
        t_hours = random.choice([2, 3, 4])
        distance = (v1 + v2) * t_hours
        q_text = f"Aralarında ${distance}$ km mesafe bulunan iki şehirden aynı anda birbirlerine doğru hareket eden iki aracın hızları saatte ${v1}$ km ve ${v2}$ km'dir.\n\nBu iki araç hareket ettikten **kaç saat sonra** karşılaşırlar?"
        corr = f"${t_hours}$ saat"
        dist = [f"${t_hours + 1}$ saat", f"${max(1, t_hours - 1)}$ saat", f"${t_hours + 2}$ saat", f"${t_hours + 0.5}$ saat"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Temel Matematik",
            "topic": "Problemler",
            "subtopic": "Hız ve Hareket Problemleri",
            "learning_outcome_code": "MAT.TYT.3.3",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Zıt yönlü harekette $x = (V_1 + V_2) \\cdot t \\implies {distance} = ({v1} + {v2}) \\cdot t \\implies t = {t_hours}$ saattir.",
            **opts
        }

    elif archetype == 2:
        # Yüzde - Kâr - Zarar Problemleri
        cost = random.choice([200, 300, 400, 500])
        profit_pct = random.choice([20, 25, 30, 40])
        sale_price = int(cost * (1 + profit_pct / 100))
        discount_pct = 10
        final_price = int(sale_price * (1 - discount_pct / 100))
        net_profit = final_price - cost
        q_text = f"Maliyeti ${cost}$ TL olan bir ürün, etiket fiyatı üzerinden %{profit_pct} kârla satışa sunulmuştur. Daha sonra etiket fiyatı üzerinden %{discount_pct} indirim yapılmıştır.\n\nBuna göre bu ürünün indirimli satışından elde edilen **net kâr kaç TL'dir**?"
        corr = f"${net_profit}$ TL"
        dist = [f"${net_profit + 12}$ TL", f"${net_profit - 8}$ TL", f"${net_profit + 20}$ TL", f"${cost * profit_pct // 100}$ TL"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Temel Matematik",
            "topic": "Problemler",
            "subtopic": "Yüzde, Kâr ve Zarar Problemleri",
            "learning_outcome_code": "MAT.TYT.3.4",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Etiket fiyatı = ${cost} \\times {1 + profit_pct/100:.2f} = {sale_price}$ TL. İndirimli fiyat = ${sale_price} \\times 0.90 = {final_price}$ TL. Net kâr = ${final_price} - {cost} = {net_profit}$ TL.",
            **opts
        }

    elif archetype == 3:
        # Fonksiyonlar
        a_coeff = random.choice([2, 3, 4])
        b_const = random.choice([1, -2, 3, -4, 5])
        x_val = random.randint(2, 5)
        fx_val = a_coeff * x_val + b_const
        q_text = f"Gerçel sayılar kümesinde tanımlı $f(x) = {a_coeff}x + ({b_const})$ fonksiyonu veriliyor.\n\nBuna göre $f({x_val}) + f(1)$ işleminin sonucu kaçtır?"
        f1_val = a_coeff * 1 + b_const
        total = fx_val + f1_val
        corr = f"${total}$"
        dist = [f"${total + 3}$", f"${total - 2}$", f"${total + 5}$", f"${total - 4}$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Temel Matematik",
            "topic": "Fonksiyonlar",
            "subtopic": "Doğrusal Fonksiyonlar ve Değer Bulma",
            "learning_outcome_code": "MAT.TYT.4.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"$f({x_val}) = {fx_val}$, $f(1) = {f1_val}$. Toplamları = ${total}$'dir.",
            **opts
        }

    elif archetype == 4:
        # Mutlak Değer
        c_val = random.randint(3, 7)
        q_text = f"$|2x - 4| \\le {2*c_val}$ eşitsizliğini sağlayan $x$ tam sayılarının **toplamı kaçtır**?"
        # -2c <= 2x - 4 <= 2c => 4 - 2c <= 2x <= 4 + 2c => 2 - c <= x <= 2 + c
        # simetrik olduğu için ortalama 2, eleman sayısı (2c + 1)
        tot_sum = 2 * (2 * c_val + 1)
        corr = f"${tot_sum}$"
        dist = [f"${tot_sum - 4}$", f"${tot_sum + 6}$", f"${c_val * 2}$", f"${0}$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Temel Matematik",
            "topic": "Denklemler ve Eşitsizlikler",
            "subtopic": "Mutlak Değerli Eşitsizlikler",
            "learning_outcome_code": "MAT.TYT.2.3",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Eşitsizlik ${2-c_val} \\le x \\le {2+c_val}$ aralığıdır. Ortanca terim $2$ olup toplam ${tot_sum}$'dir.",
            **opts
        }

    elif archetype == 5:
        # Kümeler
        sa = random.randint(8, 14)
        sb = random.randint(10, 16)
        inter = random.randint(3, 6)
        union = sa + sb - inter
        q_text = f"$A$ ve $B$ iki küme olmak üzere;\n$s(A) = {sa}$, $s(B) = {sb}$ ve $s(A \\cap B) = {inter}$\n\nolduğuna göre $s(A \\cup B)$ kümesinin eleman sayısı kaçtır?"
        corr = f"${union}$"
        dist = [f"${union + 2}$", f"${sa + sb}$", f"${union - 3}$", f"${sa - inter}$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Temel Matematik",
            "topic": "Kümeler",
            "subtopic": "Küme İşlemleri ve Birleşim Formülü",
            "learning_outcome_code": "MAT.TYT.1.5",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"$s(A \\cup B) = s(A) + s(B) - s(A \\cap B) = {sa} + {sb} - {inter} = {union}$'dur.",
            **opts
        }

    elif archetype == 6:
        # Basamak Kavramı
        q_text = "İki basamaklı bir $AB$ doğal sayısının rakamları toplamı $11$'dir. Rakamlarının yerleri değiştirildiğinde elde edilen $BA$ sayısı, $AB$ sayısından $27$ fazla olmaktadır.\n\nBuna göre $A \\times B$ çarpımı kaçtır?"
        # BA - AB = 9(B - A) = 27 => B - A = 3. A + B = 11 => 2B = 14 => B = 7, A = 4. AB = 47. 4 * 7 = 28.
        corr = "$28$"
        dist = ["$24$", "$30$", "$32$", "$18$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Temel Matematik",
            "topic": "Temel Kavramlar",
            "subtopic": "Basamak Kavramı ve Sayı Çözümleme",
            "learning_outcome_code": "MAT.TYT.1.2",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "$10B + A - (10A + B) = 9(B - A) = 27 \\implies B - A = 3$. $B + A = 11$ ile çözüldüğünde $B = 7, A = 4$ bulunur. Çarpım $4 \\times 7 = 28$'dir.",
            **opts
        }

    else:
        # Sayma ve Olasılık
        q_text = "$5$ evli çiftin bulunduğu bir gruptan rastgele $2$ kişi seçiliyor.\n\nSeçilen bu iki kişinin **birbiriyle evli bir çift olma olasılığı** kaçtır?"
        # Toplam 10 kişi. C(10, 2) = 45. 5 çift var => 5 / 45 = 1/9.
        corr = "$\\frac{1}{9}$"
        dist = ["$\\frac{1}{5}$", "$\\frac{1}{10}$", "$\\frac{2}{9}$", "$\\frac{1}{45}$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Temel Matematik",
            "topic": "Sayma ve Olasılık",
            "subtopic": "Kombinasyon ve Olasılık Hesabı",
            "learning_outcome_code": "MAT.TYT.5.2",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Toplam durum sayısı $\\binom{10}{2} = 45$'tir. İstenen durum evli $5$ çiftten birini seçmektir (5 durum). Olasılık $\\frac{5}{45} = \\frac{1}{9}$'dur.",
            **opts
        }


# ================= 3. TYT GEOMETRİ =================

def gen_tyt_geometri(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # Üçgende Açı
        a_deg = random.choice([40, 50, 70, 80])
        # İkizkenar üçgende tepe açısı A ise taban açıları (180 - A) / 2
        base_deg = (180 - a_deg) // 2
        q_text = f"Bir $ABC$ ikizkenar üçgeninde $|AB| = |AC|$ olup tepe açısının ölçüsü $m(\\widehat{{BAC}}) = {a_deg}^\\circ$'dir.\n\nBuna göre taban açılarından biri olan $m(\\widehat{{ABC}})$ **kaç derecedir**?"
        corr = f"${base_deg}^\\circ$"
        dist = [f"${base_deg + 10}^\\circ$", f"${base_deg - 10}^\\circ$", f"${a_deg}^\\circ$", f"${180 - base_deg}^\\circ$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Geometri",
            "topic": "Üçgende Açılar",
            "subtopic": "İkizkenar Üçgen Açı Bağıntıları",
            "learning_outcome_code": "GEO.TYT.1.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"İç açılar toplamı $180^\\circ$'dir. $180 - {a_deg} = {180 - a_deg}$. İkizkenar olduğundan taban açıları $\\frac{{{180 - a_deg}}}{{2}} = {base_deg}^\\circ$'dir.",
            **opts
        }

    elif archetype == 1:
        # Özel Üçgenler ve Pisagor
        base = random.choice([6, 8, 12])
        height = random.choice([8, 15, 16])
        hypo = int(math.hypot(base, height))
        q_text = f"Bir $ABC$ dik üçgeninde $[AB] \\perp [BC]$ olup $|AB| = {base}$ cm ve $|BC| = {height}$ cm'dir.\n\nBuna göre hipotenüs uzunluğu $|AC|$ **kaç santimetredir**?"
        corr = f"${hypo}$ cm"
        dist = [f"${hypo + 2}$ cm", f"${hypo - 1}$ cm", f"${base + height}$ cm", f"${hypo + 4}$ cm"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Geometri",
            "topic": "Özel Üçgenler",
            "subtopic": "Dik Üçgen ve Pisagor Bağıntısı",
            "learning_outcome_code": "GEO.TYT.1.4",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"$|AC|^2 = {base}^2 + {height}^2 = {base**2 + height**2} = {hypo}^2 \\implies |AC| = {hypo}$ cm.",
            **opts
        }

    elif archetype == 2:
        # Çokgenler: Düzgün Çokgen Açıları
        n_side = random.choice([5, 6, 8])
        ext_angle = 360 // n_side
        int_angle = 180 - ext_angle
        names = {5: "beşgenin", 6: "altıgenin", 8: "sekizgenin"}
        q_text = f"Bir düzgün {names[n_side]} bir **iç açısının ölçüsü** kaç derecedir?"
        corr = f"${int_angle}^\\circ$"
        dist = [f"${ext_angle}^\\circ$", f"${int_angle - 15}^\\circ$", f"${int_angle + 12}^\\circ$", f"${360 // (n_side - 1)}^\\circ$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Geometri",
            "topic": "Çokgenler ve Dörtgenler",
            "subtopic": "Düzgün Çokgenlerin İç ve Dış Açıları",
            "learning_outcome_code": "GEO.TYT.2.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Dış açı $\\alpha = \\frac{{360^\\circ}}{{{n_side}}} = {ext_angle}^\\circ$. İç açı $= 180 - {ext_angle} = {int_angle}^\\circ$'dir.",
            **opts
        }

    elif archetype == 3:
        # Çemberde Uzunluk ve Alan
        r = random.choice([3, 4, 6, 7])
        area = f"${r**2}\\pi$"
        q_text = f"Yarıçap uzunluğu $r = {r}$ cm olan bir dairenin **alanı kaç santimetrekaredir**?"
        corr = f"${r**2}\\pi\\text{{ cm}}^2$"
        dist = [f"${2*r}\\pi\\text{{ cm}}^2$", f"${(r+1)**2}\\pi\\text{{ cm}}^2$", f"${r**2}\\text{{ cm}}^2$", f"${4*r**2}\\pi\\text{{ cm}}^2$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Geometri",
            "topic": "Çember ve Daire",
            "subtopic": "Dairenin Alanı",
            "learning_outcome_code": "GEO.TYT.3.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Alan formülü $A = \\pi r^2 = \\pi \\cdot {r}^2 = {r**2}\\pi\\text{{ cm}}^2$.",
            **opts
        }

    else:
        # Katı Cisimler: Silindirin Hacmi
        r_cyl = random.choice([2, 3, 4])
        h_cyl = random.choice([5, 6, 8, 10])
        vol = (r_cyl**2) * h_cyl
        q_text = f"Taban yarıçapı $r = {r_cyl}$ cm ve yüksekliği $h = {h_cyl}$ cm olan dik dairesel bir silindirin **hacmi kaç $\\pi\\text{{ cm}}^3$'tür**?"
        corr = f"${vol}\\pi$"
        dist = [f"${vol // 2}\\pi$", f"${vol * 2}\\pi$", f"${2 * r_cyl * h_cyl}\\pi$", f"${(r_cyl + h_cyl)**2}\\pi$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Geometri",
            "topic": "Katı Cisimler",
            "subtopic": "Silindir ve Hacim Hesabı",
            "learning_outcome_code": "GEO.TYT.4.1",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"$V = \\pi r^2 h = \\pi \\cdot {r_cyl}^2 \\cdot {h_cyl} = {vol}\\pi\\text{{ cm}}^3$.",
            **opts
        }


# ================= 4. TYT FİZİK =================

def gen_tyt_fizik(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # Elektrik Devreleri ve Ohm Kanunu
        v = random.choice([12, 24, 36, 48])
        r = random.choice([2, 3, 4, 6])
        i = v // r
        q_text = f"İç direnci önemsenmeyen ${v}$ Volt potansiyel farkına sahip bir üretece $R = {r}\\,\\Omega$'luk direnç bağlanmıştır.\n\nBuna göre devreden geçen **akım şiddeti kaç Amperdir**?"
        corr = f"${i}$ A"
        dist = [f"${i + 2}$ A", f"${max(1, i - 1)}$ A", f"${v * r}$ A", f"${i * 2}$ A"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Fizik",
            "topic": "Elektrik ve Manyetizma",
            "subtopic": "Elektrik Akımı ve Ohm Yasası",
            "learning_outcome_code": "FİZ.TYT.3.1",
            "cognitive_domain": "Uygulama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Ohm Yasası: $V = I \\cdot R \\implies I = \\frac{{V}}{{R}} = \\frac{{{v}}}{{{r}}} = {i}$ Amper.",
            **opts
        }

    elif archetype == 1:
        # Newton'ın Hareket Yasaları
        m = random.choice([2, 4, 5, 10])
        f = random.choice([20, 30, 40, 50])
        a = f // m
        q_text = f"Sürtünmesiz yatay bir düzlemde durmakta olan $m = {m}$ kg kütleli bir cisme yatay doğrultuda $F = {f}$ N büyüklüğünde sabit bir kuvvet uygulanmaktadır.\n\nBuna göre cismin kazanacağı **ivme kaç $\\text{{m/s}}^2$'dir**?"
        corr = f"${a}\\text{{ m/s}}^2$"
        dist = [f"${a + 2}\\text{{ m/s}}^2$", f"${max(1, a - 2)}\\text{{ m/s}}^2$", f"${m * f}\\text{{ m/s}}^2$", f"${a // 2}\\text{{ m/s}}^2$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Fizik",
            "topic": "Kuvvet ve Hareket",
            "subtopic": "Newton'ın Temel Prensibi",
            "learning_outcome_code": "FİZ.TYT.2.2",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"$F_{{net}} = m \\cdot a \\implies a = \\frac{{F}}{{m}} = \\frac{{{f}}}{{{m}}} = {a}\\text{{ m/s}}^2$.",
            **opts
        }

    elif archetype == 2:
        # Sıvıların Kaldırma Kuvveti
        q_text = "Birbirine karışmayan $d$ ve $2d$ özkütleli sıvılar bulunan bir kapta, özkütlesi $1.5d$ olan homojen bir katı cisim serbest bırakılıyor.\n\nCismin sıvı içerisindeki denge durumu aşağıdakilerden hangisi gibi olur?"
        corr = "İki sıvının ayrılma yüzeyinde, hacminin yarısı üstte yarısı altta kalacak şekilde asılı kalır."
        dist = [
            "Kabın tabanına batar.",
            "En üstte tamamen $d$ özkütleli sıvının yüzeyinde yüzer.",
            "Sıvıların sıcaklığına bağlı olarak sürekli aşağı yukarı hareket eder.",
            "Tümüyle $2d$ sıvısının içine batarak tabana değer."
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Fizik",
            "topic": "Madde ve Özellikleri",
            "subtopic": "Sıvıların Kaldırma Kuvveti ve Özkütle",
            "learning_outcome_code": "FİZ.TYT.1.4",
            "cognitive_domain": "Kavrama / Analiz",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Cismin özkütlesi $1.5d$, $d$ ile $2d$ arasındadır. Bu nedenle tam arayüzeyde dengelenir.",
            **opts
        }

    elif archetype == 3:
        # Isı ve Sıcaklık
        q_text = "Isıca yalıtılmış bir kapta sıcaklıkları farklı iki sıvı karıştırılıyor.\n\nIsıl denge sağlandığında bu sıvılar için aşağıdakilerden hangisi **kesinlikle eşit** olur?"
        corr = "Son Sıcaklıkları"
        dist = ["İç Enerjileri", "Isı Sığaları", "Öz Isıları", "Kütleleri"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Fizik",
            "topic": "Isı ve Sıcaklık",
            "subtopic": "Isıl Denge ve Karışımlar",
            "learning_outcome_code": "FİZ.TYT.4.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Isıl dengede sistemdeki tüm maddelerin sıcaklıkları eşitlenir ($T_{denge}$).",
            **opts
        }

    else:
        # Optik: Işığın Kırılması
        q_text = "Az yoğun ortamdan çok yoğun ortama (örneğin havadan suya) normalle dar bir açı yaparak geçen tek renkli ışık ışını ile ilgili;\nI. Hızı azalır.\nII. Frekansı değişmez.\nIII. Normale yaklaşarak kırılır.\n\nyargılarından hangileri **doğrudur**?"
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve III", "II ve III", "Yalnız III"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Fizik",
            "topic": "Optik",
            "subtopic": "Kırılma ve Işık Hızı",
            "learning_outcome_code": "FİZ.TYT.5.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Çok yoğun ortamda ışığın hızı azalır ($v = c/n$), kaynağa bağlı olan frekans değişmez, normale yaklaşarak kırılır.",
            **opts
        }


# ================= 5. TYT KİMYA =================

def gen_tyt_kimya(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # Periyodik Sistem ve Atom Numarası
        elements = [
            ("Sodyum (Na, Z=11)", "3. periyot 1A grubu alkali metalidir.", ["2. periyot 7A halojenidir.", "Soygazdır.", "Geçiş metalidir.", "Ametaldir."]),
            ("Klor (Cl, Z=17)", "3. periyot 7A grubu halojenidir.", ["Alkali metaldir.", "Toprak alkali metalidir.", "Soygazdır.", "Yarı metaldir."]),
            ("Argon (Ar, Z=18)", "3. periyot 8A grubu soygazıdır (asal gaz).", ["1A grubu metalidir.", "Halojendir.", "Aktif bir ametaldir.", "Kalkojendir."])
        ]
        el = elements[index % len(elements)]
        q_text = f"Temel hal elektron dizilimi yazılan **{el[0]}** elementi ile ilgili aşağıdaki ifadelerden hangisi **doğrudur**?"
        opts = format_tyt_options(el[1], el[2])
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Kimya",
            "topic": "Atom ve Periyodik Sistem",
            "subtopic": "Periyodik Cetvelde Yer Bulma",
            "learning_outcome_code": "KİM.TYT.1.3",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"{el[0]} için katman dizilimi incelendiğinde {el[1]}",
            **opts
        }

    elif archetype == 1:
        # Mol Kavramı
        moles = random.choice([0.5, 1.5, 2.0])
        # H2O (MA = 18)
        mass = moles * 18
        q_text = f"${moles}$ mol saf $H_2O$ (su) bileşiği kaç gramdır? ($H: 1$, $O: 16$ g/mol)"
        corr = f"${mass:.1f}$ g" if mass % 1 != 0 else f"${int(mass)}$ g"
        dist = [f"${mass + 9}$ g", f"${mass - 5}$ g", f"${mass * 2}$ g", f"${18}$ g"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Kimya",
            "topic": "Kimyasal Hesaplamalar",
            "subtopic": "Mol Kütlesi ve Gram İlişkisi",
            "learning_outcome_code": "KİM.TYT.3.1",
            "cognitive_domain": "Uygulama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"$M_A(H_2O) = 2 \\times 1 + 16 = 18$ g/mol. $m = n \\cdot M_A = {moles} \\times 18 = {mass}$ gram.",
            **opts
        }

    elif archetype == 2:
        # Kimyasal Türler Arası Etkileşimler
        q_text = "Aşağıdaki bileşik veya moleküllerin hangisinde moleküller arasında **Hidrojen Bağı** bulunur?"
        corr = "$H_2O$ (Su)"
        dist = ["$CH_4$ (Metan)", "$CO_2$ (Karbondioksit)", "$HCl$ (Hidroklorik Asit)", "$O_2$ (Oksijen Gazı)"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Kimya",
            "topic": "Kimyasal Türler Arası Etkileşimler",
            "subtopic": "Zayıf Etkileşimler ve Hidrojen Bağı",
            "learning_outcome_code": "KİM.TYT.2.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Hidrojen atomunun $F, O, N$ elektronegatif atomlarına doğrudan bağlı olduğu moleküller arasında hidrojen bağı kurulur.",
            **opts
        }

    elif archetype == 3:
        # Karışımlar ve Ayırma Yöntemleri
        q_text = "Birbiri içinde homojen karışan ve kaynama noktaları birbirinden farklı iki sıvının (örneğin etil alkol ve su karışımı) ayrılmasında en uygun yöntem hangisidir?"
        corr = "Ayrımsal Damıtma"
        dist = ["Süzme", "Ayırma Hunisi", "Diyaliz", "Basit Kristallendirme"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Kimya",
            "topic": "Karışımlar",
            "subtopic": "Kaynama Noktası Farkı ile Ayırma",
            "learning_outcome_code": "KİM.TYT.4.3",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Sıvı-sıvı homojen karışımlarda kaynama noktası farkından yararlanılarak ayrımsal damıtma yapılır.",
            **opts
        }

    else:
        # Asitler, Bazlar ve Tuzlar
        q_text = "Oda koşullarında ($25^\\circ\\text{C}$) hazırlanan sulu çözeltilerde $pH < 7$ olan çözeltilerle ilgili;\nI. Tadı ekşidir.\nII. $Zn, Fe, Al$ gibi aktif metallerle tepkimeye girerek $H_2$ gazı açığa çıkarır.\nIII. Kırmızı turnusol kağıdını maviye çevirir.\n\nyargılarından hangileri **doğrudur**?"
        corr = "I ve II"
        dist = ["Yalnız I", "I ve III", "Yalnız III", "I, II ve III"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Kimya",
            "topic": "Asitler, Bazlar ve Tuzlar",
            "subtopic": "Asitlerin Genel Özellikleri",
            "learning_outcome_code": "KİM.TYT.5.1",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Asitler turnusolu kırmızıya çevirir (III yanlıştır, bazlar maviye çevirir). I ve II doğrudur.",
            **opts
        }


# ================= 6. TYT BİYOLOJİ =================

def gen_tyt_biyoloji(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # Hücre Organelleri
        organelles = [
            ("Mitokondri", "Oksijenli solunum ile ATP (hücresel enerji) üretir.", ["Hücre içi sindirimi sağlar.", "Protein sentezini gerçekleştirir.", "Fotosentez yapar.", "Hücre bölünmesini başlatır."]),
            ("Kloroplast", "Işık enerjisini kullanarak inorganik maddelerden organik besin (glikoz) üretir.", ["Hücre içi madde taşınmasını sağlar.", "Katalaz enzimi içerir.", "ATP tüketmeden solunum yapar.", "Sentrozom görevi görür."]),
            ("Ribozom", "Tüm canlı hücrelerde bulunan zarsız organel olup protein sentezini yürütür.", ["Steroit hormon üretir.", "Glikolipit sentezler.", "Lizozom enzimi depolar.", "İğ ipliklerini oluşturur."])
        ]
        org = organelles[index % len(organelles)]
        q_text = f"Ökaryot bir hücrede bulunan **{org[0]}** organelinin temel hücresel görevi aşağıdakilerden hangisidir?"
        opts = format_tyt_options(org[1], org[2])
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Biyoloji",
            "topic": "Hücre ve Organelleri",
            "subtopic": "Zarlı ve Zarsız Organeller",
            "learning_outcome_code": "BİY.TYT.1.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"{org[0]} organeli: {org[1]}",
            **opts
        }

    elif archetype == 1:
        # Hücre Bölünmeleri: Mitoz ve Mayoz
        q_text = "Mayoz bölünmeyi mitoz bölünmeden ayıran ve yavru hücrelerde genetik çeşitlilik (varyasyon) sağlayan temel olay hangisidir?"
        corr = "Krossing-over (parça değişimi) ve homolog kromozomların rastgele kutuplara çekilmesi"
        dist = [
            "İğ ipliklerinin sentrozomlar tarafından oluşturulması",
            "DNA replikasyonunun interfaz evresinde gerçekleşmesi",
            "Sitokinezin boğumlanma ile tamamlanması",
            "Karyokinezin (çekirdek bölünmesi) meydana gelmesi"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Biyoloji",
            "topic": "Hücre Bölünmeleri",
            "subtopic": "Mayoz Bölünme ve Genetik Çeşitlilik",
            "learning_outcome_code": "BİY.TYT.3.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Homolog kromozomların rastgele dizilimi ve mayoz I profazındaki krossing-over çeşitliliğin ana kaynağıdır.",
            **opts
        }

    elif archetype == 2:
        # Kalıtım ve Soyağacı
        q_text = "Otozomal çekinik (resesif) bir özelliği fenotipinde gösteren bir dişi bireyin genotipi ile ilgili aşağıdaki ifadelerden hangisi **kesinlikle doğrudur**?"
        corr = "Homozigot çekiniktir ($aa$) ve bu alellerden birini annesinden, diğerini babasından almıştır."
        dist = [
            "Heterozigot genotiptedir ($Aa$).",
            "Babası bu özelliği fenotipinde kesinlikle göstermek zorundadır.",
            "Tüm erkek çocukları bu özelliği fenotipinde göstermek zorundadır.",
            "Annesi kesinlikle homozigot baskındır."
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Biyoloji",
            "topic": "Kalıtımın Genel İlkeleri",
            "subtopic": "Otozomal Çekinik Kalıtım",
            "learning_outcome_code": "BİY.TYT.4.1",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Çekinik özellik sadece homozigot durumda ($aa$) fenotipe yansır; biri anneden biri babadan gelir.",
            **opts
        }

    elif archetype == 3:
        # Canlıların Sınıflandırılması
        q_text = "Aşağıdaki canlı gruplarından hangisi **prokaryot** hücre yapısına sahiptir?"
        corr = "Bakteriler ve Arkeler"
        dist = ["Mantarlar ve Bitkiler", "Protistler ve Hayvanlar", "Algler ve Mayalar", "Omurgalı Hayvanlar"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Biyoloji",
            "topic": "Canlılar Dünyası",
            "subtopic": "Canlıların Sınıflandırılması",
            "learning_outcome_code": "BİY.TYT.2.1",
            "cognitive_domain": "Hatırlama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Zarla çevrili çekirdek ve organeli olmayan tek hücreli canlılar Bakteriler ve Arkelerdir.",
            **opts
        }

    else:
        # Ekosistem Ekolojisi: Besin Piramidi
        q_text = "Kara ekosisteminde bir besin piramidinde üreticilerden son tüketicilere doğru gidildikçe;\nI. Biyokütle (toplam canlı ağırlığı)\nII. Biyolojik birikim (zehirli madde derişimi)\nIII. Aktarılan enerji miktarı\n\nniceliklerinden hangileri **azalır**?"
        corr = "I ve III"
        dist = ["Yalnız I", "Yalnız II", "II ve III", "I, II ve III"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Biyoloji",
            "topic": "Ekosistem Ekolojisi",
            "subtopic": "Besin Piramidinde Enerji ve Madde Akışı",
            "learning_outcome_code": "BİY.TYT.5.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Üst basamaklara çıktıkça biyokütle ve aktarılan enerji (%10 kuralı) azalır; zehirli biyolojik birikim ise artar.",
            **opts
        }


# ================= 7. TYT TARİH =================

def gen_tyt_tarih(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # İlk Türk Devletleri: Kut ve Kurultay
        q_text = "İlk Türk devletlerinde hükümdara yönetme yetkisinin Gök Tengri tarafından verildiğine inanılan ve 'Kut' olarak adlandırılan anlayış;\nI. Hükümdar ailesinin tüm erkek üyelerinin tahtta hak iddia etmesi\nII. Taht kavgalarının ve iç karışıklıkların artması\nIII. Devletlerin kısa sürede parçalanıp yıkılması\n\nsonuçlarından hangilerine **zemin hazırlamıştır**?"
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "II ve III", "Yalnız III"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Tarih",
            "topic": "İlk ve Orta Çağlarda Türk Dünyası",
            "subtopic": "Devlet Yönetimi ve Kut Anlayışı",
            "learning_outcome_code": "TAR.TYT.1.2",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Kut inancı hanedanın ortak malı anlayışını doğurmuş, taht kavgalarını körükleyerek devletlerin ömrünü kısaltmıştır.",
            **opts
        }

    elif archetype == 1:
        # Osmanlı Devleti: İskan ve İstimalet
        q_text = "Osmanlı Devleti'nin Rumeli ve Balkanlar'da fethettiği topraklarda kalıcılığı sağlamak için uyguladığı;\n- Anadolu'dan getirdiği Türkmenleri fethettiği bölgelere yerleştirme (**İskân**)\n- Yerel halkın diline, dinine ve geleneklerine saygı gösterip hoşgörüyle yaklaşma (**İstimâlet**)\n\npolitikalarının ortak amacı aşağıdakilerden hangisidir?"
        corr = "Fethin kalıcı olmasını sağlamak ve bölgeyi huzur içinde elde tutmak"
        dist = [
            "Avrupa'da Hristiyan birliğini yeniden kurmak",
            "Gaza ve cihat anlayışını tamamen terk etmek",
            "Tüm Balkan halklarını zorla Müslümanlaştırmak",
            "Merkezi otoriteyi eyalet valilerine devretmek"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Tarih",
            "topic": "Beylikten Devlete Osmanlı Siyaseti",
            "subtopic": "İskân ve İstimalet Politikası",
            "learning_outcome_code": "TAR.TYT.2.3",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "İskân ve adaletli istimâlet politikası Balkanlar'daki hâkimiyetin yüzyıllarca sürmesini sağlamıştır.",
            **opts
        }

    elif archetype == 2:
        # Tımar Sistemi
        q_text = "Osmanlı Devleti'nde Tımar sisteminin sağladığı faydalar arasında aşağıdakilerden hangisi **yer almaz**?"
        corr = "Hazineye doğrudan yüklü miktarda sıcak nakit para girişi sağlanması"
        dist = [
            "Devletin hazinesinden para çıkmadan büyük bir atlı ordu (tımarlı sipahi) beslenmesi",
            "Tarımsal üretimin denetlenmesi ve üretimde sürekliliğin sağlanması",
            "Kırsal bölgelerde asayiş ve güvenliğin tesis edilmesi",
            "Vergilerin yerinde toplanarak bürokratik masrafların azaltılması"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Tarih",
            "topic": "Devletleşme Sürecinde Osmanlı",
            "subtopic": "Tımar Sistemi ve Faydaları",
            "learning_outcome_code": "TAR.TYT.2.5",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Tımar sisteminde vergiler nakit olarak başkente gelmez; yerinde askere ve hizmete harcanır. Sıcak nakit iltizam ile toplanırdı.",
            **opts
        }

    elif archetype == 3:
        # Tanzimat ve Islahat Fermanları
        q_text = "1839 yılında ilan edilen Tanzimat Fermanı'nda yer alan 'Padişah da dahil olmak üzere herkesin kanun önünde eşit sayılacağı' hükmü Osmanlı tarihinde öncelikle hangi ilkenin kabul edildiğini gösterir?"
        corr = "Kanun Üstünlüğü ve Hukuk Devleti Anlayışı"
        dist = [
            "Teokratik Devlet Düzeni",
            "Sosyalist Mülkiyet Rejimi",
            "Mutlak Monarşinin Güçlenmesi",
            "Feodal Derebeylik Sistemi"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Tarih",
            "topic": "Değişim Çağında Avrupa ve Osmanlı",
            "subtopic": "Tanzimat Fermanı ve Kanun Üstünlüğü",
            "learning_outcome_code": "TAR.TYT.3.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Padişahın kendi yetkilerini kanun gücüyle sınırlandırması hukukun üstünlüğüne geçiştir.",
            **opts
        }

    else:
        # Millî Mücadele: Kongreler
        q_text = "Amasya Genelgesi'nde yer alan \"Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.\" maddesi Türk inkılabının öncelikle hangi yönünü ortaya koymuştur?"
        corr = "Millî egemenliğe dayalı yeni bir devletin kurulacağının ilk sinyali"
        dist = [
            "Manda rejimine boyun eğileceği",
            "Saltanat şurasının kararlarına bağlı kalınacağı",
            "Düzenli ordunun dağıtılacağı",
            "Bölgesel kurtuluş yollarının deneneceği"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Tarih",
            "topic": "Millî Mücadele",
            "subtopic": "Amasya Genelgesi ve İhtilal Beyannamesi",
            "learning_outcome_code": "TAR.TYT.4.1",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Milletin kendi kararını vermesi, padişah iradesinin yerine halk iradesinin geçeceğinin kanıtıdır.",
            **opts
        }


# ================= 8. TYT COĞRAFYA =================

def gen_tyt_cografya(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # Harita Bilgisi ve İzohipsler
        q_text = "Bir topoğrafya haritasında eş yükselti (izohips) eğrilerinin birbirine **çok yaklaştığı (sıklaştığı)** bir bölge için aşağıdakilerden hangisi kesinlikle söylenebilir?"
        corr = "Arazide eğim fazladır ve akarsuyun akış hızı/aşındırma gücü yüksektir."
        dist = [
            "Arazi tamamen düz bir ovadır.",
            "Deniz seviyesinden yüksekliği sıfırdır.",
            "Bölgede kesinlikle krater gölü bulunur.",
            "Kalıcı kar sınırının altındadır."
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Coğrafya",
            "topic": "Harita Bilgisi",
            "subtopic": "İzohipsler ve Yeryüzü Şekilleri",
            "learning_outcome_code": "COĞ.TYT.1.3",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "İzohipslerin sıklaşması eğimin dikleştiğini gösterir. Eğimli arazide akarsu hızlı akar ve aşındırma artar.",
            **opts
        }

    elif archetype == 1:
        # İklim Tipleri: Akdeniz İklimi
        q_text = "\"Yazları sıcak ve kurak, kışları ılık ve yağışlı; doğal bitki örtüsü kızılçam ormanları ve tahrip edildiği yerlerde bodur çalılardan oluşan maki...\"\n\nYukarıda özellikleri verilen **iklim tipi** aşağıdakilerden hangisidir?"
        corr = "Akdeniz İklimi"
        dist = ["Karadeniz İklimi", "Karasal İklim", "Muson İklimi", "Tundra İklimi"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Coğrafya",
            "topic": "İklim Bilgisi",
            "subtopic": "Büyük İklim Tipleri ve Bitki Örtüsü",
            "learning_outcome_code": "COĞ.TYT.2.4",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Kış ılıklığı, kış yağışları ve maki bitki örtüsü Akdeniz ikliminin karakteristik özelliğidir.",
            **opts
        }

    elif archetype == 2:
        # Levha Tektoniği ve Doğal Afetler: Deprem
        q_text = "Dünya üzerinde aktif volkanların, jeotermal sıcak su kaynaklarının ve şiddetli deprem kuşaklarının birbirleriyle büyük paralellik göstermesinin temel nedeni nedir?"
        corr = "Levha sınırları boyunca yer kabuğunun kırıklı ve hareketli fay hatlarına sahip olması"
        dist = [
            "Tüm bu bölgelerin Ekvator çizgisine yakın konumda bulunması",
            "Bölgedeki okyanus akıntılarının sıcaklık dengesini bozması",
            "Aşırı yağışların toprak kaymalarını tetiklemesi",
            "Bölgede yüksek sıradağların rüzgarı engellemesi"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Coğrafya",
            "topic": "Yerin Şekillenmesi",
            "subtopic": "Levha Tektoniği ve Fay Hatları",
            "learning_outcome_code": "COĞ.TYT.3.1",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Levha sınırları yer kabuğunun zayıf zonlarıdır; deprem, volkanizma ve jeotermal bu sınırlarda yoğunlaşır.",
            **opts
        }

    elif archetype == 3:
        # Nüfus Piramitleri
        q_text = "Tabanı daralan bir nüfus piramidine sahip olan gelişmiş bir ülke için aşağıdakilerden hangisi **kesinlikle söylenebilir**?"
        corr = "Doğum oranları azalmakta ve yaşlı nüfus oranı artmaktadır."
        dist = [
            "Çocuk işçi oranı hızla yükselmektedir.",
            "Tarımsal nüfus yoğunluğu çok yüksektir.",
            "Ortalama yaşam süresi kısalmaktadır.",
            "Okur-yazar oranı dünya ortalamasının altındadır."
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Coğrafya",
            "topic": "Nüfus ve Yerleşme",
            "subtopic": "Nüfus Piramitleri ve Demografi",
            "learning_outcome_code": "COĞ.TYT.4.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Piramit tabanının daralması doğum oranlarının gerilediğini, tavanın genişliği ise yaşlı nüfusun fazlalığını gösterir.",
            **opts
        }

    else:
        # Dış Kuvvetler: Akarsu Aşınım ve Birikim
        q_text = "Bir akarsuyun denize döküldüğü kıyıda **delta ovası** oluşturabilmesi için aşağıdakilerden hangisi **gerekli bir koşul değildir**?"
        corr = "Kıyıda güçlü gelgit (gelgit genliği) ve sert dalga akıntılarının bulunması"
        dist = [
            "Akarsuyun bol miktarda alüvyon taşıması",
            "Kıyının sığ (kıta sahanlığının geniş) olması",
            "Kıyıda güçlü akıntıların bulunmaması",
            "Havzanın erozyona açık kayaçlardan oluşması"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Coğrafya",
            "topic": "Dış Kuvvetler",
            "subtopic": "Akarsu Biriktirme Şekilleri (Delta Ovaları)",
            "learning_outcome_code": "COĞ.TYT.3.3",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Güçlü gelgit ve akıntılar alüvyonların birikmesini engelleyip açık denize sürükler; haliç oluşturur, delta oluşumunu bozar.",
            **opts
        }


# ================= 9. TYT FELSEFE =================

def gen_tyt_felsefe(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # Epistemoloji: Bilgi Felsefesi
        currents = [
            ("Rasyonalizm (Akılcılık)", "Doğru bilginin kaynağı yalnızca akıldır; duyular aldatıcıdır (Descartes, Platon, Sokrates)."),
            ("Empirizm (Deneycilik)", "İnsan zihni doğuştan boş bir levhadır (tabula rasa); tüm bilgiler duyum ve deneyimle kazanılır (John Locke, David Hume)."),
            ("Kritisizm (Eleştiricilik)", "Görüsüz kavramlar boş, kavramsız görüler kördür; bilgi hem deneyden hem akıldan beslenir (Immanuel Kant).")
        ]
        c = currents[index % len(currents)]
        q_text = f"\"{c[1]}\"\n\nBu görüşü savunan epistemolojik **felsefi akım** aşağıdakilerden hangisidir?"
        corr = c[0].split(" (")[0]
        dist = ["Pozitivizm", "Entüisyonizm", "Pragmatizm", "Septisizm"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Felsefe",
            "topic": "Bilgi Felsefesi (Epistemoloji)",
            "subtopic": "Doğru Bilginin Kaynağı ve İmkânı",
            "learning_outcome_code": "FEL.TYT.2.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Verilen açıklama doğrudan {c[0]} akımının temel tezidir.",
            **opts
        }

    elif archetype == 1:
        # Ontoloji: Varlık Felsefesi
        q_text = "Descartes, evrende birbirinden bağımsız iki tözün olduğunu; bunlardan birinin 'düşünen töz' (ruh), diğerinin ise 'yer kaplayan töz' (madde) olduğunu savunur.\n\nDescartes'ın bu varlık anlayışı felsefede hangi kavramla adlandırılır?"
        corr = "Düalizm (İkicilik)"
        dist = ["Monizm (Tekçilik)", "Plüralizm (Çokçuluk)", "Materyalizm (Maddecilik)", "Nihilizm (Hiççilik)"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Felsefe",
            "topic": "Varlık Felsefesi (Ontoloji)",
            "subtopic": "Varlığın Mahiyeti ve Töz Problemi",
            "learning_outcome_code": "FEL.TYT.1.3",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Ruh ve maddeyi iki ayrı bağımsız töz kabul eden anlayış Düalizm'dir.",
            **opts
        }

    elif archetype == 2:
        # Etik: Kant'ın Ödev Ahlakı
        q_text = "Kant'a göre bir eylemin ahlaki değerini belirleyen şey, onun doğuracağı sonuçlar veya sağlayacağı fayda değil; yalnızca 'ödev duygusuyla' ve iyi niyetle yapılmış olmasıdır.\n\nKant'ın bu etik yaklaşımı aşağıdakilerden hangisiyle adlandırılır?"
        corr = "Ödev Ahlakı (Deontoloji)"
        dist = ["Hedonizm (Hazcılık)", "Faydacılık (Utilitarizm)", "Egoizm (Bencillik)", "Anarşizm"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Felsefe",
            "topic": "Ahlak Felsefesi (Etik)",
            "subtopic": "Kant'ın Ödev Ahlakı ve Koşulsuz Buyruk",
            "learning_outcome_code": "FEL.TYT.3.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Kant menfaat ve sonuca değil, niyet ve evrensel ödev ahlakına dayanır.",
            **opts
        }

    elif archetype == 3:
        # Siyaset Felsefesi: Ütopyalar ve Devlet
        q_text = "Thomas Hobbes, insanların doğa durumunda 'İnsan insanın kurdudur (Homo homini lupus)' ilkesiyle bir kaos yaşadığını ve can güvenliğini sağlamak için haklarını tek bir egemene devrederek devleti oluşturduklarını savunur.\n\nHobbes'a göre devletin varoluş temeli aşağıdakilerden hangisidir?"
        corr = "Toplum Sözleşmesi ve Güvenlik İhtiyacı"
        dist = [
            "İlahi buyrukların yeryüzünde icra edilmesi",
            "Sınıfsız ve devletsiz komünal yaşam",
            "Doğanın dengesine müdahale edilmemesi",
            "Yöneticilerin aristokratik üstünlüğü"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Felsefe",
            "topic": "Siyaset Felsefesi",
            "subtopic": "Devletin Doğuşu ve Toplum Sözleşmesi",
            "learning_outcome_code": "FEL.TYT.4.1",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Hobbes devleti kaostan kurtulmak için akılla yapılan bir toplum sözleşmesi olarak tanımlar.",
            **opts
        }

    else:
        # Felsefi Düşüncenin Özellikleri
        q_text = "Felsefi düşünce; eleştirel, sorgulayıcı, refleksif (düşünce üzerine düşünme), yığılan (kümülatif) fakat bilim gibi kesin doğrularla ilerlemeyen bir yapıya sahiptir.\n\nBuna göre aşağıdakilerden hangisi felsefi bilginin **özellikleri arasında yer almaz**?"
        corr = "Deney ve gözlemle kesin olarak ispatlanıp bitmiş/değişmez doğrular sunması"
        dist = [
            "Kendi üzerine dönük (refleksif) bir akıl yürütme olması",
            "Sorgulayıcı ve şüpheci bir tutumla hareket etmesi",
            "Bütüncül ve evrensel sorulara cevap araması",
            "Mantıksal tutarlılık taşıması"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Felsefe",
            "topic": "Felsefeyi Tanıma",
            "subtopic": "Felsefi Düşüncenin Nitelikleri",
            "learning_outcome_code": "FEL.TYT.1.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Felsefede kesin ve nihai deney kanıtları yoktur; sorgulama ve akıl yürütme süreklidir.",
            **opts
        }


# ================= 10. TYT DİN KÜLTÜRÜ VE AHLAK BİLGİSİ =================

def gen_tyt_din(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # İslam ve Bilgi: Selim Akıl, Sadık Haber, Salim Duyular
        q_text = "İslam düşüncesinde bağlayıcı ve doğru bilgiye (yakîn) ulaşmayı sağlayan üç temel bilgi kaynağı hangi seçenekte eksiksiz verilmiştir?"
        corr = "Selim Akıl, Sadık Haber (Vahiy) ve Salim Duyular"
        dist = [
            "Sezgiler, Rüyalar ve Kehanetler",
            "Mitoloji, Efsaneler ve Falcılık",
            "Sadece Deney ve Gözlem Verileri",
            "Gelenekler ve Toplumsal Kabuller"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "İslam ve Bilgi",
            "subtopic": "İslam'da Bilgi Kaynakları",
            "learning_outcome_code": "DİN.TYT.1.1",
            "cognitive_domain": "Hatırlama / Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "İslam epistemolojisinde üç kaynak esastır: Salim duyular, selim akıl ve vahiy (sadık haber).",
            **opts
        }

    elif archetype == 1:
        # Ahlak: Kul Hakkı ve Adalet
        q_text = "\"Ölçtüğünüz zaman tastamam ölçün ve doğru teraziyle tartın. Bu hem daha hayırlıdır hem de neticesi bakımından daha güzeldir.\" (İsrâ Suresi, 35)\n\nBu ayet-i kerimede bireysel ve toplumsal hayatta öncelikle hangi ilkeye dikkat çekilmektedir?"
        corr = "Kul hakkının gözetilmesi, ticari dürüstlük ve ekonomik adalet"
        dist = [
            "Yalnızca ibadetlerde huşunun korunması",
            "Dünya hayatından tamamen el etek çekilmesi",
            "Sadece zenginlerin ticarete atılması",
            "Geleneksel ticaret kurallarının korunması"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Ahlak ve Değerler",
            "subtopic": "İslam Ahlakı ve Kul Hakkı",
            "learning_outcome_code": "DİN.TYT.2.3",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Ölçü ve tartıda dürüstlük doğrudan kul hakkı ve adaletle ilgilidir.",
            **opts
        }

    elif archetype == 2:
        # İtikadi ve Ameli Mezhepler
        q_text = "İslam düşünce tarihinde inanç (itikad) alanında ortaya çıkan iki büyük Ehl-i Sünnet mezhebi hangisinde doğru verilmiştir?"
        corr = "Maturidilik ve Eş'arilik"
        dist = [
            "Hanefilik ve Şafilik",
            "Malikilik ve Hanbelilik",
            "Cebriye ve Mutezile",
            "Caferilik ve Zeydilik"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "İslam Düşüncesinde Yorumlar",
            "subtopic": "İtikadi ve Fıkhi Mezhepler",
            "learning_outcome_code": "DİN.TYT.3.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "İtikatta Maturidilik ve Eş'arilik; amelde/fıkıhta Hanefilik, Şafilik, Malikilik ve Hanbelilik esastır.",
            **opts
        }

    elif archetype == 3:
        # Din ve Çevre Ahlakı
        q_text = "\"Göğü O yükseltti ve dengeyi O koydu. Sakın dengede haddi aşmayın!\" (Rahmân Suresi, 7-8)\n\nBu ayet küresel dünyada yaşanan sorunlardan hangisine yönelik ilahi bir uyarıdır?"
        corr = "Çevre kirliliği, ekolojik dengenin tahribi ve doğal kaynakların israf edilmesi"
        dist = [
            "Uzay araştırmalarının yetersizliği",
            "Sanat ve edebiyatın gerilemesi",
            "Felsefi tartışmaların artması",
            "Şehirleşme oranlarının düşmesi"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Din ve Hayat",
            "subtopic": "İslam ve Çevre Ahlakı",
            "learning_outcome_code": "DİN.TYT.4.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Ayet ekolojik dengenin korunmasını ve ifrat/israftan kaçınılmasını emreder.",
            **opts
        }

    else:
        # Tasavvufi Yorumlar ve Gönül Coğrafyası
        q_text = "Horasan ve Türkistan'da yetişip talebelerini Anadolu ve Balkanlar'a göndererek İslamiyet'in yayılmasına ve 'Divan-ı Hikmet' eseriyle Türk tasavvufunun mayalanmasına öncülük eden mutasavvıf kimdir?"
        corr = "Hoca Ahmed Yesevi"
        dist = ["Mevlana Celaleddin-i Rumi", "Yunus Emre", "Hacı Bektaş-ı Veli", "Ahi Evran"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT",
            "grade_level": "9-10. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Din, Kültür ve Medeniyet",
            "subtopic": "Gönül Coğrafyamızın Öncüleri",
            "learning_outcome_code": "DİN.TYT.3.4",
            "cognitive_domain": "Hatırlama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Pîr-i Türkistan olarak bilinen Hoca Ahmed Yesevi'nin en önemli eseri Divan-ı Hikmet'tir.",
            **opts
        }


# ================= ANA TYT SÖZLÜĞÜ VE ÜRETİCİ =================

TYT_DISPATCHER = {
    "Türkçe": gen_tyt_turkce,
    "Temel Matematik": gen_tyt_matematik,
    "Geometri": gen_tyt_geometri,
    "Fizik": gen_tyt_fizik,
    "Kimya": gen_tyt_kimya,
    "Biyoloji": gen_tyt_biyoloji,
    "Tarih": gen_tyt_tarih,
    "Coğrafya": gen_tyt_cografya,
    "Felsefe": gen_tyt_felsefe,
    "Din Kültürü ve Ahlak Bilgisi": gen_tyt_din,
}

def generate_tyt_question(subject: str, index: int) -> Dict[str, Any]:
    func = TYT_DISPATCHER.get(subject, gen_tyt_turkce)
    return func(index)
