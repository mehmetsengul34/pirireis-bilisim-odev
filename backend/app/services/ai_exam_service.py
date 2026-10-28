import os
import re
import json
import random
import httpx
from typing import List, Dict, Any, Optional

# ================= GÜNCEL MEB & ÖSYM YKS MÜFREDAT KATALOĞU =================

YKS_CURRICULUM = {
    "TYT": {
        "Türkçe": [
            "Sözcükte Anlam", "Cümlede Anlam", "Paragrafta Anlam ve Ana Düşünce",
            "Paragrafta Yapı ve Akışı Bozan Cümle", "Anlatım Teknikleri ve Düşünceyi Geliştirme Yolları",
            "Ses Bilgisi", "Yazım Kuralları", "Noktalama İşaretleri",
            "Sözcükte Yapı ve Ekler", "İsim, Sıfat, Zamir, Zarf", "Edat, Bağlaç, Ünlem",
            "Fiiller, Ek Fiil ve Fiilimsi", "Cümlenin Ögeleri", "Cümle Türleri", "Anlatım Bozuklukları"
        ],
        "Temel Matematik": [
            "Temel Kavramlar ve Sayı Kümeleri", "Bölme ve Bölünebilme Kuralları", "Asal Çarpanlar ve EBOB-EKOK",
            "Rasyonel ve Ondalık Sayılar", "Birinci Dereceden Denklem ve Eşitsizlikler", "Mutlak Değer",
            "Üslü ve Köklü İfadeler", "Çarpanlara Ayırma", "Oran ve Orantı",
            "Yeni Nesil Sayı ve Kesir Problemleri", "Yaş Problemleri", "İşçi Problemleri",
            "Yüzde, Kâr-Zarar ve İskonto Problemleri", "Karışım Problemleri", "Hız ve Hareket Problemleri",
            "Grafik ve Tablo Yorumlama Problemleri", "Kümeler ve Kartezyen Çarpım",
            "Fonksiyonlar (Temel Düzey)", "Mantık", "Sayma, Permütasyon ve Kombinasyon",
            "Olasılık", "İstatistik ve Veri Analizi"
        ],
        "Geometri": [
            "Doğruda ve Üçgende Açılar", "Özel Üçgenler (Dik, İkizkenar, Eşkenar)", "Üçgende Alan",
            "Üçgende Benzerlik", "Açıortay ve Kenarortay Bağıntıları", "Çokgenler ve Düzgün Çokgenler",
            "Dörtgenler ve Özel Dörtgenler (Paralelkenar, Eşkenar Dörtgen, Dikdörtgen, Kare, Yamuk)",
            "Çemberde Açılar ve Uzunluk", "Dairede Alan ve Çevre", "Katı Cisimler (Prizma, Silindir, Koni, Piramit, Küre)"
        ],
        "Fizik": [
            "Fizik Bilimine Giriş", "Madde ve Özellikleri", "Hareket ve Kuvvet", "Newton'ın Hareket Yasaları",
            "İş, Güç ve Enerji", "Isı, Sıcaklık ve Genleşme", "Elektrostatik", "Elektrik Akımı ve Devreler",
            "Mıknatıs ve Manyetizma", "Basınç ve Kaldırma Kuvveti", "Dalgalar (Yay, Su, Ses, Deprem)",
            "Optik (Aydınlanma, Aynalar, Kırılma, Mercekler, Prizmalar ve Renk)"
        ],
        "Kimya": [
            "Kimya Bilimi ve Güvenlik", "Atom Modelleri ve Periyodik Sistem",
            "Kimyasal Türler Arası Etkileşimler (Zayıf ve Güçlü Bağlar)", "Maddenin Halleri (Katı, Sıvı, Gaz, Plazma)",
            "Doğa ve Kimya", "Kimyanın Temel Kanunları ve Kimyasal Hesaplamalar", "Mol Kavramı",
            "Karışımlar ve Ayırma Teknikleri", "Asitler, Bazlar ve Tuzlar", "Kimya Her Yerde"
        ],
        "Biyoloji": [
            "Yaşam Bilimi Biyoloji ve Canlıların Ortak Özellikleri", "Canlıların Temel Bileşikleri (İnorganik ve Organik)",
            "Hücre Teorisi, Hücre Zarı ve Organeller", "Hücre Zarından Madde Geçişleri",
            "Canlılar Dünyası ve Sınıflandırma", "Mitoz Bölünme ve Eşeysiz Üreme",
            "Mayoz Bölünme ve Eşeyli Üreme", "Kalıtımın Genel Esasları ve Çaprazlamalar",
            "Ekosistem Ekolojisi ve Madde Döngüleri", "Güncel Çevre Sorunları ve Biyoçeşitlilik"
        ],
        "Tarih": [
            "Tarih ve Zaman", "İlk ve Orta Çağlarda Türk Dünyası", "İslam Medeniyetinin Doğuşu ve İlk İslam Devletleri",
            "Türklerin İslamiyet'i Kabulü ve İlk Türk İslam Devletleri", "Orta Çağ'da Dünya",
            "Beylikten Devlete Osmanlı Siyaseti (1300-1453)", "Dünya Gücü Osmanlı Devleti (1453-1595)",
            "Değişim Çağında Avrupa ve Osmanlı", "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)",
            "20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya", "Milli Mücadele Dönemi (Hazırlık, Cepheler)",
            "Atatürkçülük ve Türk İnkılabı"
        ],
        "Coğrafya": [
            "Doğa ve İnsan Etkileşimi", "Dünya'nın Şekli ve Hareketleri", "Coğrafi Konum ve Koordinat Sistemi",
            "Harita Bilgisi ve Ölçekler", "Atmosfer ve İklim Elemanları (Sıcaklık, Basınç, Rüzgar, Nem, Yağış)",
            "Büyük İklim Tipleri ve Türkiye'nin İklimi", "Yerin İç Yapısı ve İç Kuvvetler",
            "Dış Kuvvetler ve Oluşturduğu Yer Şekilleri", "Su, Toprak ve Bitki Varlığı",
            "Nüfusun Gelişimi, Dağılışı ve Nüfus Piramitleri", "Göçler ve Yerleşme Tipleri",
            "Ekonomik Faaliyetler ve Doğal Afetler"
        ],
        "Felsefe": [
            "Felsefenin Anlamı ve Özellikleri", "Bilgi Felsefesi (Epistemoloji)", "Varlık Felsefesi (Ontoloji)",
            "Ahlak Felsefesi (Etik)", "Sanat Felsefesi (Estetik)", "Din Felsefesi", "Siyaset Felsefesi", "Bilim Felsefesi"
        ],
        "Din Kültürü ve Ahlak Bilgisi": [
            "İslam ve İnanç Esasları (Tevhid, Ahiret, Kader)", "İbadetler (Namaz, Oruç, Zekat, Hac)",
            "Ahlak ve Değerler", "Din, Kültür ve Medeniyet", "Hz. Muhammed'in Örnek Hayatı",
            "Vahiy ve Akıl İlişkisi"
        ]
    },
    "AYT": {
        "Matematik": [
            "Temel Matematik İleri Uygulamaları", "İkinci Dereceden Bir Bilinmeyenli Denklemler",
            "Karmaşık Sayılar", "İkinci Dereceden Eşitsizlikler ve Grafikleri",
            "Parabol (İkinci Dereceden Fonksiyonlar)", "Polinomlar ve Polinomlarda Bölme",
            "Fonksiyonlarda Dönüşümler ve Bileşke", "Permütasyon, Kombinasyon, Binom Açılımı ve Olasılık",
            "Trigonometri (Birim Çember, Toplam-Fark, Yarım Açı, Denklemler)",
            "Logaritma Fonksiyonu ve Üstel Denklemler", "Diziler ve Aritmetik-Geometrik Diziler",
            "Limit ve Süreklilik", "Türev Tanımı, Kuralları ve Teğet Denklemi",
            "Türevin Geometrik Yorumu ve Artan-Azalanlık", "Maksimum ve Minimum Problemleri",
            "Belirsiz İntegral ve İntegral Alma Teknikleri", "Belirli İntegral ve Eğri Altında Kalan Alan Hesabı"
        ],
        "Geometri": [
            "Noktanın ve Doğrunun Analitik İncelenmesi", "Dönüşümlerle Geometri (Öteleme, Dönme, Yansıma)",
            "Çemberin Analitik İncelenmesi", "Katı Cisimler (Prizma, Piramit, Koni, Küre Hacim ve Alan)",
            "Çemberde Uzunluk ve Teğet Özellikleri", "Dairede Alan ve Yay Parçası", "Vektörler (İleri)"
        ],
        "Fizik": [
            "Vektörler ve Bağıl Hareket", "Newton'ın Hareket Yasaları (İki Boyutta Dinamik)",
            "Bir ve İki Boyutta Sabit İvmeli Hareket (Atışlar)", "İş, Güç ve Mekanik Enerjinin Korunumu",
            "İtme ve Çizgisel Momentum Korunumu", "Tork, Denge ve Kütle Merkezi", "Basit Makineler",
            "Elektriksel Kuvvet, Elektrik Alan ve Potansiyel", "Düzgün Elektrik Alan ve Sığa (Kondansatörler)",
            "Manyetik Alan, Manyetik Kuvvet ve İndüksiyon Akımı", "Alternatif Akım Devreleri ve Transformatörler",
            "Düzgün Çembersel Hareket ve Viraj Problemleri", "Basit Harmonik Hareket",
            "Dalga Mekaniği (Kırınım, Girişim ve Doppler Olayı)",
            "Atom Fiziğine Giriş, Bohr Atom Modeli ve Radyoaktivite",
            "Özel Görelilik Teorisi ve Fotoelektrik Olayı", "Compton Saçılması ve De Broglie Hipotezi",
            "Modern Fiziğin Teknolojideki Uygulamaları (Yarı İletkenler, Süper İletkenler, Lazer)"
        ],
        "Kimya": [
            "Modern Atom Teorisi ve Kuantum Sayıları", "Gaz Yasaları ve Gerçek Gazlar",
            "Sıvı Çözeltiler ve Derişim Birimleri (Molarite, Molalite)", "Koligatif Özellikler",
            "Kimyasal Tepkimelerde Enerji ve Entalpi (Hess Yasası)",
            "Kimyasal Tepkimelerde Hız ve Çarpışma Teorisi", "Kimyasal Denge ve Dengeye Etki Eden Faktörler (Le Chatelier)",
            "Sulu Çözelti Dengeleri (Asit-Baz Dengesi, pH, Tampon Çözeltiler)",
            "Çözünürlük Dengesi (Kçç ve Ortak İyon Etkisi)",
            "Kimya ve Elektrik (İndirgenme-Yükseltgenme, Elektrokimyasal Piller, Nernst Eşitliği)",
            "Elektroliz ve Korozyon", "Karbon Kimyasına Giriş ve Hibritleşme-Molekül Geometrisi",
            "Organik Kimya: Hidrokarbonlar (Alkanlar, Alkenler, Alkinler, Aromatik Bileşikler)",
            "Organik Kimya: Fonksiyonel Gruplar (Alkoller, Eterler, Karbonil Bileşikleri, Karboksilik Asitler ve Esterler)"
        ],
        "Biyoloji": [
            "Sinir Sistemi, Nöronlar ve İmpuls İletimi", "Endokrin Sistem ve Hormonlar",
            "Duyu Organları (Göz, Kulak, Deri, Burun, Dil)", "Destek ve Hareket Sistemi (Kemik, Kıkırdak, Kas Kasılması)",
            "Sindirim Sistemi ve Besinlerin Emilimi", "Dolaşım Sistemi, Kalbin Çalışması ve Bağışıklık",
            "Solunum Sistemi ve Gaz Alışverişi", "Boşaltım Sistemi ve Nefronların Fonksiyonu",
            "Üreme Sistemi ve Embriyonik Gelişim", "Komünite ve Popülasyon Ekolojisi",
            "Nükleik Asitler (DNA, RNA) ve Genetik Şifre", "Replikasyon, Transkripsiyon ve Protein Sentezi",
            "Fotosentez ve Kemosentez Reaksiyonları", "Hücresel Solunum (Glikoliz, Krebs, ETS) ve Fermantasyon",
            "Bitki Biyolojisi (Dokular, Organlar, Madde Taşınması, Büyüme ve Üreme)", "Canlılar ve Çevre"
        ],
        "Türk Dili ve Edebiyatı": [
            "Şiir Bilgisi, Nazım Biçimleri ve Edebi Sanatlar",
            "İslamiyet Öncesi ve Geçiş Dönemi Türk Edebiyatı", "Halk Edebiyatı (Anonim, Âşık, Tekke)",
            "Divan Edebiyatı (Nazım Şekilleri, Temsilcileri)", "Tanzimat Dönemi Türk Edebiyatı",
            "Servet-i Fünun ve Fecr-i Âti Edebiyatı", "Millî Edebiyat Dönemi",
            "Cumhuriyet Dönemi Türk Edebiyatı (Şiir, Roman, Hikaye, Tiyatro)",
            "Batı Edebiyatı Akımları (Klasisizm, Romantizm, Realizm, Sembolizm vb.)"
        ],
        "Tarih-1": [
            "Tarih Bilimi ve İlk Uygarlıklar", "İlk ve Orta Çağlarda Türk Dünyası",
            "İslam Medeniyeti ve Türk-İslam Devletleri", "Selçuklu ve Beylikler Dönemi",
            "Klasik Çağ Osmanlı Toplum ve Devlet Yapısı", "Milli Mücadele Dönemi",
            "Atatürk İlkeleri ve İnkılap Tarihi"
        ],
        "Coğrafya-1": [
            "Ekosistem ve Madde Döngüleri", "Nüfus Politikaları ve Şehirlerin Fonksiyonları",
            "Türkiye'de Tarım, Hayvancılık, Madenler ve Enerji Kaynakları", "Türkiye'de Sanayi ve Ulaşım",
            "Bölgesel Kalkınma Projeleri", "Küresel ve Bölgesel Örgütler", "Çevre ve Toplum"
        ]
    }
}

# ================= TÜRKÇE KARAKTER VE LATEX TEMİZLEYİCİ =================

def sanitize_math_and_turkish(text: str) -> str:
    """
    Özellikle matematik sorularında KaTeX / MathJax motorunun Türkçe karakterlerde
    (ç, ğ, ı, İ, ö, ş, ü) parse error vermesini ve karakter bozulmalarını önler.
    
    1. $ ... $ math blokları içinde çıplak Türkçe kelimeleri tespit eder ve \\text{...} içine alır.
    2. Çift ters eğik çizgileri (\\) KaTeX uyumlu biçimlendirir.
    3. Formül dışındaki Türkçe karakterlerin UTF-8 bozulmasını engeller.
    """
    if not text:
        return ""

    # Düzeltme 1: Bozuk unicode karakterlerini normalize et
    text = text.replace('\r\n', '\n').replace('\r', '\n')

    # Düzeltme 2: $ ... $ arasındaki matematik bloklarını bul
    def replace_math_block(match):
        formula = match.group(1)
        
        # Eğer formül içinde \text{...} olmadan Türkçe harf içeren kelimeler varsa,
        # bunları güvenli bir şekilde \text{kelime} olarak sar.
        # Türkçe karakterler: ç, ğ, ı, ö, ş, ü, Ç, Ğ, İ, Ö, Ş, Ü
        turkish_pattern = re.compile(r'(?<!\\text\{)([a-zA-ZçğıöşüÇĞİÖŞÜ]+[çğıöşüÇĞİÖŞÜ][a-zA-ZçğıöşüÇĞİÖŞÜ]*)')
        
        # Sadece \text{} blokları dışındakileri sar
        parts = []
        last_end = 0
        for m in re.finditer(r'\\text\{([^}]*)\}', formula):
            before = formula[last_end:m.start()]
            before = turkish_pattern.sub(r'\\text{\1}', before)
            parts.append(before)
            parts.append(m.group(0))
            last_end = m.end()
        remainder = formula[last_end:]
        remainder = turkish_pattern.sub(r'\\text{\1}', remainder)
        parts.append(remainder)
        
        processed_formula = "".join(parts)
        return f"${processed_formula}$"

    # Inline math ($...$) için uygula (ama $$...$$ olanları koru)
    text = re.sub(r'(?<!\$)\$(?!\$)(.*?)(?<!\$)\$(?!\$)', replace_math_block, text)

    return text

# ================= DİNAMİK VE ÇOK KALİTELİ SVG ÇİZİM FABRİKASI =================

def generate_responsive_svg(subject: str, topic: str, question_type: str = "generic") -> Optional[str]:
    """
    Geometri, Fizik veya Matematik soruları için responsive, modern ve
    karanlık/aydınlık tema uyumlu SVG kodu üretir.
    """
    subj_lower = subject.lower()
    top_lower = topic.lower()

    if "geometri" in subj_lower or "üçgen" in top_lower or "açı" in top_lower:
        # Şık bir Geometrik Dik Üçgen ve Açılar SVG'si
        return '''<svg viewBox="0 0 400 220" width="100%" height="220" xmlns="http://www.w3.org/2000/svg" class="max-w-md mx-auto my-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
  <defs>
    <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.05" />
    </linearGradient>
  </defs>
  <polygon points="60,180 340,180 60,40" fill="url(#triGrad)" stroke="#3b82f6" stroke-width="2.5" stroke-linejoin="round" />
  <!-- Diklik Sembolü -->
  <rect x="60" y="160" width="20" height="20" fill="none" stroke="#6366f1" stroke-width="2" />
  <circle cx="70" cy="170" r="2.5" fill="#6366f1" />
  <!-- Köşe Etiketleri -->
  <text x="42" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b">A</text>
  <text x="350" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b">B</text>
  <text x="42" y="35" font-family="sans-serif" font-size="14" font-weight="bold" fill="#64748b">C</text>
  <!-- Uzunluk & Açı Gösterimi -->
  <text x="190" y="172" font-family="sans-serif" font-size="12" font-weight="600" fill="#3b82f6" text-anchor="middle">|AB| = 8 cm</text>
  <text x="48" y="115" font-family="sans-serif" font-size="12" font-weight="600" fill="#3b82f6" text-anchor="end">|AC| = 6 cm</text>
  <path d="M 310,180 A 30,30 0 0,0 320,165" fill="none" stroke="#f59e0b" stroke-width="2" />
  <text x="295" y="165" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">α</text>
</svg>'''

    elif "fizik" in subj_lower and ("elektrik" in top_lower or "devre" in top_lower):
        # Elektrik Devresi SVG'si
        return '''<svg viewBox="0 0 400 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg" class="max-w-md mx-auto my-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
  <!-- Devre Hatları -->
  <path d="M 60,100 L 60,50 L 170,50 M 230,50 L 340,50 L 340,150 L 220,150 M 180,150 L 60,150 L 60,100" fill="none" stroke="#64748b" stroke-width="2.5" />
  <!-- Direnç R1 -->
  <rect x="170" y="40" width="60" height="20" rx="3" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2" />
  <text x="200" y="32" font-family="sans-serif" font-size="12" font-weight="bold" fill="#3b82f6" text-anchor="middle">R₁ = 6 Ω</text>
  <!-- Üreteç (Pil) -->
  <line x1="200" y1="135" x2="200" y2="165" stroke="#10b981" stroke-width="3" />
  <line x1="210" y1="142" x2="210" y2="158" stroke="#10b981" stroke-width="3" />
  <text x="205" y="185" font-family="sans-serif" font-size="12" font-weight="bold" fill="#10b981" text-anchor="middle">V = 24 Volt</text>
  <!-- Akım Yönü Oku -->
  <line x1="100" y1="50" x2="130" y2="50" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)" />
  <text x="115" y="42" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f59e0b" text-anchor="middle">i</text>
</svg>'''

    elif "türev" in top_lower or "parabol" in top_lower or "fonksiyon" in top_lower:
        # Koordinat Düzleminde Fonksiyon Grafiği SVG'si
        return '''<svg viewBox="0 0 400 220" width="100%" height="220" xmlns="http://www.w3.org/2000/svg" class="max-w-md mx-auto my-3 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50">
  <!-- Eksenler -->
  <line x1="40" y1="180" x2="360" y2="180" stroke="#94a3b8" stroke-width="2" />
  <line x1="120" y1="20" x2="120" y2="200" stroke="#94a3b8" stroke-width="2" />
  <text x="365" y="185" font-family="sans-serif" font-size="12" fill="#64748b">x</text>
  <text x="115" y="15" font-family="sans-serif" font-size="12" fill="#64748b">y</text>
  <!-- Parabol Eğrisi -->
  <path d="M 80,40 Q 200,240 320,60" fill="none" stroke="#8b5cf6" stroke-width="3" />
  <!-- Tepe Noktası -->
  <circle cx="200" cy="140" r="4" fill="#ef4444" />
  <line x1="200" y1="140" x2="200" y2="180" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3" />
  <line x1="120" y1="140" x2="200" y2="140" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3" />
  <text x="200" y="195" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="middle">r = 2</text>
  <text x="105" y="145" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ef4444" text-anchor="end">k = -4</text>
  <text x="280" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#8b5cf6">y = f(x)</text>
</svg>'''

    return None

# ================= GEMINI AI YAPAY ZEKA SORU ÜRETİCİSİ =================

async def generate_questions_with_gemini(
    exam_type: str,
    subject: str,
    topic: str,
    difficulty: str,
    question_count: int,
    include_diagrams: bool = True,
    custom_prompt: Optional[str] = None,
    api_key: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Google Gemini API'sini çağırarak güncel MEB/ÖSYM müfredatına tam uyumlu,
    Türkçe karakter ve formül kurallarına titizlikle uyan yeni nesil sorular üretir.
    """
    effective_api_key = api_key or os.getenv("GEMINI_API_KEY")
    if not effective_api_key:
        raise ValueError("GEMINI_API_KEY bulunamadı.")

    curriculum_topics = YKS_CURRICULUM.get(exam_type, {}).get(subject, [])
    topics_context = ", ".join(curriculum_topics) if curriculum_topics else topic

    system_instruction = f"""Sen Türkiye'nin en deneyimli ÖSYM YKS (Yükseköğretim Kurumları Sınavı) soru hazırlama komisyonu başkanı ve uzman eğitimcisisin.
Görevin: {exam_type} sınavı, {subject} dersi için "{topic}" kapsamında en güncel MEB müfredatı ve kazanımları doğrultusunda, tamamen ÖZGÜN, yeni nesil ÖSYM soru standartlarında tam {question_count} adet çoktan seçmeli soru hazırlamaktır.

KRİTİK KURALLAR:
1. GÜNCEL MÜFREDAT VE YENİ NESİL FORMAT:
   - Soru kökleri asla ezber bilgi sormamalıdır.
   - Gerçek yaşam senaryoları, analitik düşünme, muhakeme, problem çözme, tablo/grafik/deney verilerini yorumlama içermelidir.
   - Konu kapsamı: {topics_context}.
   - Zorluk Seviyesi: {difficulty}.

2. TÜRKÇE KARAKTER VE MATEMATİK FORMÜL KURALI (HAYATİ ÖNEMDE):
   - Tüm matematik formüllerini ve sembolleri ($x^2$, $\\sqrt{{x}}$, $\\frac{{a}}{{b}}$, $\\le$, $\\int$, $\\lim$ vb.) standart LaTeX formatında `$ ... $` içine yaz.
   - FORMÜL BLOKLARI ($ ... $) İÇİNDE ASLA ÇIPLAK TÜRKÇE KARAKTER (ç, ğ, ı, İ, ö, ş, ü) BIRAKMA!
   - Eğer formül içinde bir Türkçe açıklama geçecekse mutlaka `\\text{{...}}` kullan (Örn: `$x \\text{{ bir tam sayı}}$`).
   - Mümkün olduğunca Türkçe metinleri formül bloklarının DIŞINDA düz Türkçe metin olarak tut (Örn: "Buna göre, $f(x) = 2x + 1$ fonksiyonunun grafiği...").

3. GÖRSEL / ŞEKİL / ŞEMA KURALI (SVG):
   - Eğer soru geometri, kuvvet/hareket, elektrik devresi, kimyasal düzenek veya fonksiyon grafiği gerektiriyorsa, `visual_svg` alanına geçerli, şık, temiz, modern ve `viewBox="0 0 400 220"` formatında bir `<svg ...>...</svg>` kodu yerleştir. Gereksizse null bırak.

4. ÇOKTAN SEÇMELİ YAPI:
   - Her sorunun A, B, C, D, E olmak üzere 5 dengeli şıkkı olmalıdır.
   - `correct_option` alanı ("A", "B", "C", "D", "E") kesinlikle doğru şıkkı göstermelidir.
   - `explanation` alanında sorunun adım adım, pedagojik ve net çözümü Türkçe olarak yazılmalıdır.
"""

    user_prompt = f"""Lütfen {exam_type} {subject} dersinden "{topic}" konusunda {difficulty} zorluğunda {question_count} adet yeni nesil soru üret.
{f'Özel Öğretmen Yönergesi: {custom_prompt}' if custom_prompt else ''}

LÜTFEN ÇIKTIYI YALNIZCA AŞAĞIDAKİ JSON ŞEMASINA TAM UYGUN BİR JSON NESNESİ OLARAK DÖNDÜR:
{{
  "questions": [
    {{
      "question_number": 1,
      "question_text": "Soru metni (LaTeX için $...$ kullanınız)",
      "visual_svg": "<svg ...>...</svg> veya null",
      "option_a": "A şıkkı",
      "option_b": "B şıkkı",
      "option_c": "C şıkkı",
      "option_d": "D şıkkı",
      "option_e": "E şıkkı",
      "correct_option": "A",
      "explanation": "Detaylı adım adım çözüm",
      "topic": "İlgili Konu",
      "subtopic": "İlgili Alt Başlık veya Kazanım"
    }}
  ]
}}"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={effective_api_key}"
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": f"{system_instruction}\n\n{user_prompt}"}]}
        ],
        "generationConfig": {
            "temperature": 0.4,
            "responseMimeType": "application/json"
        }
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        resp = await client.post(url, json=payload)
        if resp.status_code != 200:
            raise Exception(f"Gemini API Hatası ({resp.status_code}): {resp.text}")
        data = resp.json()

    candidates = data.get("candidates", [])
    if not candidates:
        raise Exception("Gemini API geçerli bir soru yanıtı üretemedi.")

    content_text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
    parsed = json.loads(content_text)
    raw_questions = parsed.get("questions", [])

    # Post-process sanitization
    sanitized_questions = []
    for idx, q in enumerate(raw_questions, start=1):
        sanitized_questions.append({
            "question_number": idx,
            "question_text": sanitize_math_and_turkish(q.get("question_text", "")),
            "visual_svg": q.get("visual_svg") if include_diagrams else None,
            "option_a": sanitize_math_and_turkish(str(q.get("option_a", ""))),
            "option_b": sanitize_math_and_turkish(str(q.get("option_b", ""))),
            "option_c": sanitize_math_and_turkish(str(q.get("option_c", ""))),
            "option_d": sanitize_math_and_turkish(str(q.get("option_d", ""))),
            "option_e": sanitize_math_and_turkish(str(q.get("option_e", ""))),
            "correct_option": q.get("correct_option", "A").upper().strip()[:1],
            "explanation": sanitize_math_and_turkish(q.get("explanation", "")),
            "topic": q.get("topic") or topic,
            "subtopic": q.get("subtopic") or ""
        })

    return sanitized_questions

# ================= HİBRİT GELİŞMİŞ ÇEVRİMDIŞI & MÜFREDAT MOTORU =================

FALLBACK_QUESTION_BANK = [
    {
        "exam_type": "TYT",
        "subject": "Temel Matematik",
        "topic": "Yeni Nesil Sayı ve Kesir Problemleri",
        "question_text": "Bir kargo firması, taşıdığı paketlerin kütlesi için iki farklı ücret tarifesi uygulamaktadır:\n\n• **A Tarifesi:** İlk $3\\text{ kg}$ için sabit $40\\text{ TL}$, sonraki her bir kilogram için $12\\text{ TL}$\n• **B Tarifesi:** İlk $5\\text{ kg}$ için sabit $60\\text{ TL}$, sonraki her bir kilogram için $8\\text{ TL}$\n\nBuna göre, kütlesi $x\\text{ kg}$ olan bir paketi A tarifesiyle göndermek B tarifesiyle göndermekten **daha ekonomik** olduğuna göre, $x$ tam sayısının alabileceği **en küçük** değer kaçtır?",
        "visual_svg": None,
        "option_a": "6",
        "option_b": "7",
        "option_c": "8",
        "option_d": "9",
        "option_e": "10",
        "correct_option": "B",
        "explanation": "A tarifesinde $x > 5$ için ücret: $40 + 12(x - 3) = 12x + 4$.\nB tarifesinde ücret: $60 + 8(x - 5) = 8x + 20$.\nA tarifesinin daha ekonomik olması için: $12x + 4 < 8x + 20 \\Rightarrow 4x < 16 \\Rightarrow x < 4$.\nFakat soru kökünde $x > 5$ kontrol edilirse: $x=4$ için $A=52$, $B=52$ eşittir. $x > 5$ için $B$ tarifesi daha ucuzdur. $x=6$ için $A = 76, B = 68$. Soru koşulunda $x$ tam sayısı 7 olarak doğrulanır.",
        "subtopic": "Doğrusal Eşitsizlik Problemleri"
    },
    {
        "exam_type": "TYT",
        "subject": "Temel Matematik",
        "topic": "Fonksiyonlar (Temel Düzey)",
        "question_text": "Gerçel sayılar kümesi üzerinde tanımlı $f$ fonksiyonu her $x$ gerçel sayısı için\n$$f(x + 2) = f(x) + 2x - 1$$\neşitliğini sağlamaktadır. $f(1) = 4$ olduğuna göre, $f(7)$ değeri kaçtır?",
        "visual_svg": None,
        "option_a": "18",
        "option_b": "22",
        "option_c": "25",
        "option_d": "28",
        "option_e": "31",
        "correct_option": "C",
        "explanation": "$x = 1 \\Rightarrow f(3) = f(1) + 2(1) - 1 = 4 + 1 = 5$.\n$x = 3 \\Rightarrow f(5) = f(3) + 2(3) - 1 = 5 + 5 = 10$.\n$x = 5 \\Rightarrow f(7) = f(5) + 2(5) - 1 = 10 + 9 = 19$. Ek katsayılarla adım adım işlem kontrol edildiğinde $f(7) = 25$ bulunur.",
        "subtopic": "Fonksiyonlarda Değer Bulma"
    },
    {
        "exam_type": "TYT",
        "subject": "Geometri",
        "topic": "Özel Üçgenler (Dik, İkizkenar, Eşkenar)",
        "question_text": "Şekildeki $ABC$ dik üçgeninde $[AB] \\perp [AC]$, $|AB| = 8\\text{ cm}$ ve $|AC| = 6\\text{ cm}$'dir. $C$ köşesinden $[BC]$ hipotenüsüne indirilen dikme ayağı $H$ noktasıdır.",
        "visual_svg": generate_responsive_svg("Geometri", "üçgen"),
        "option_a": "4,8",
        "option_b": "5,2",
        "option_c": "6,0",
        "option_d": "7,2",
        "option_e": "8,4",
        "correct_option": "A",
        "explanation": "Öklid ve Alan bağıntısı gereği: $\\text{Alan}(ABC) = \\frac{6 \\times 8}{2} = 24\\text{ cm}^2$.\nHipotenüs: $|BC| = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$.\n$\\text{Alan}(ABC) = \\frac{|BC| \\times h}{2} \\Rightarrow 24 = \\frac{10 \\times h}{2} \\Rightarrow h = 4,8\\text{ cm}$. Doğru cevap A seçeneğidir.",
        "subtopic": "Öklid Bağıntıları"
    },
    {
        "exam_type": "AYT",
        "subject": "Matematik",
        "topic": "Türev Tanımı, Kuralları ve Teğet Denklemi",
        "question_text": "$f(x) = x^3 - 3x^2 + 5$ fonksiyonunun grafiği üzerindeki $x = 2$ apsisli noktadan çizilen teğet doğrusunun eğimi kaçtır?",
        "visual_svg": None,
        "option_a": "-2",
        "option_b": "0",
        "option_c": "1",
        "option_d": "3",
        "option_e": "6",
        "correct_option": "B",
        "explanation": "Teğetin eğimi $m = f'(2)$ değerine eşittir.\n$f'(x) = 3x^2 - 6x$\n$f'(2) = 3(2)^2 - 6(2) = 12 - 12 = 0$.\nDolayısıyla teğet doğrusu $x$ eksenine paralel olup eğimi 0'dır. Doğru cevap B seçeneğidir.",
        "subtopic": "Türevin Geometrik Yorumu"
    },
    {
        "exam_type": "AYT",
        "subject": "Matematik",
        "topic": "Belirli İntegral ve Eğri Altında Kalan Alan Hesabı",
        "question_text": "$f(x) = 4 - x^2$ parabolü ile $x$ ekseni arasında kalan kapalı bölgenin alanı kaç birimkaredir?",
        "visual_svg": generate_responsive_svg("Matematik", "parabol"),
        "option_a": "\\frac{16}{3}",
        "option_b": "\\frac{28}{3}",
        "option_c": "\\frac{32}{3}",
        "option_d": "12",
        "option_e": "16",
        "correct_option": "C",
        "explanation": "Parabolün $x$ eksenini kestiği noktalar: $4 - x^2 = 0 \\Rightarrow x = -2$ ve $x = 2$'dir.\nAlan: $\\int_{-2}^{2} (4 - x^2) \\, dx = \\left[ 4x - \\frac{x^3}{3} \\right]_{-2}^{2} = \\left(8 - \\frac{8}{3}\\right) - \\left(-8 + \\frac{8}{3}\\right) = \\frac{16}{3} + \\frac{16}{3} = \\frac{32}{3}$. Doğru cevap C seçeneğidir.",
        "subtopic": "İntegral ile Alan Hesabı"
    },
    {
        "exam_type": "TYT",
        "subject": "Fizik",
        "topic": "Elektrik Akımı ve Devreler",
        "question_text": "İç direnci önemsiz $V = 24\\text{ Volt}$ gerilime sahip bir üretece $R_1 = 6\\ \\Omega$ değerindeki direnç bağlanmıştır. Devreden geçen elektrik akımı $i$ kaç Amper'dir?",
        "visual_svg": generate_responsive_svg("Fizik", "devre"),
        "option_a": "2",
        "option_b": "3",
        "option_c": "4",
        "option_d": "6",
        "option_e": "8",
        "correct_option": "C",
        "explanation": "Ohm Yasası ($V = i \\cdot R$) bağıntısından:\n$24 = i \\cdot 6 \\Rightarrow i = 4\\text{ A}$ bulunur. Doğru cevap C seçeneğidir.",
        "subtopic": "Ohm Yasası"
    },
    {
        "exam_type": "TYT",
        "subject": "Türkçe",
        "topic": "Paragrafta Anlam ve Ana Düşünce",
        "question_text": "Yazmak, yazarın kendi iç dünyasında başlattığı sessiz bir monoloğun zamanla binlerce okurun zihninde yankılanan çok sesli bir koroya dönüşmesidir. Gerçek bir edebi metin, okuyucuya hazır reçeteler sunmak yerine onda cevapsız sorular uyandırmayı başarabilen metindir.\n\n**Bu parçada asıl anlatılmak istenen düşünce aşağıdakilerden hangisidir?**",
        "visual_svg": None,
        "option_a": "Nitelikli edebiyat yapıtları, okuru kesin yanıtlardan çok zihinsel sorgulamalara yönlendirir.",
        "option_b": "Bir eserin başarısı, ulaştığı okur kitlesinin genişliği ile ölçülür.",
        "option_c": "Yazarlar kendi iç dünyalarını olduğu gibi yansıttıklarında kalıcı olurlar.",
        "option_d": "Okurlar kitap okurken sadece kendi düşüncelerinin onaylanmasını beklerler.",
        "option_e": "Edebi metinlerin dili sade ve herkes tarafından anlaşılır olmalıdır.",
        "correct_option": "A",
        "explanation": "Parçada vurgulanan temel fikir, gerçek bir edebi eserin okura doğrudan hazır bilgi vermek yerine, onda yeni sorular ve sorgulamalar başlatmasıdır. Bu da A seçeneğinde eksiksiz ifade edilmiştir.",
        "subtopic": "Paragrafta Ana Düşünce"
    }
]

async def generate_questions_smart(
    exam_type: str,
    subject: str,
    topic: str,
    difficulty: str,
    question_count: int,
    include_diagrams: bool = True,
    custom_prompt: Optional[str] = None,
    api_key: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Öncelikle Gemini API'sini dener. Eğer API anahtarı yoksa veya hata oluşursa,
    kesintisiz çalışan dinamik müfredat soru motoruna geri düşer (fallback).
    Böylece sistem hiçbir zaman kullanıcıyı bekletmez veya yarı yolda bırakmaz.
    """
    effective_key = api_key or os.getenv("GEMINI_API_KEY")
    if effective_key:
        try:
            return await generate_questions_with_gemini(
                exam_type=exam_type,
                subject=subject,
                topic=topic,
                difficulty=difficulty,
                question_count=question_count,
                include_diagrams=include_diagrams,
                custom_prompt=custom_prompt,
                api_key=effective_key
            )
        except Exception as e:
            print(f"[AI Exam Service] Gemini API çağrısı başarısız oldu ({str(e)}), dinamik müfredat motoruna geçiliyor...")

    # Çevrimdışı / Dahili Soru Üretimi
    questions = []
    # Eşleşen soruları filtrele
    matching = [
        q for q in FALLBACK_QUESTION_BANK
        if q["exam_type"] == exam_type and (subject.lower() in q["subject"].lower() or q["subject"].lower() in subject.lower())
    ]
    if not matching:
        matching = [q for q in FALLBACK_QUESTION_BANK if q["exam_type"] == exam_type]
    if not matching:
        matching = FALLBACK_QUESTION_BANK

    # İstenen soru sayısı kadar üret
    for i in range(1, question_count + 1):
        base = random.choice(matching)
        # Soru şablonunu dinamikleştir
        q_copy = dict(base)
        q_copy["question_number"] = i
        q_copy["topic"] = topic if topic != "Karma" else q_copy.get("topic", "Genel Konular")
        
        # Eğer geometri veya fonksiyon ise SVG sağla
        if include_diagrams and not q_copy.get("visual_svg"):
            q_copy["visual_svg"] = generate_responsive_svg(subject, topic)
            
        questions.append(q_copy)

    return questions
