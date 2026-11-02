# -*- coding: utf-8 -*-
"""
Torbalı Piri Reis MTAL Bilişim Teknolojileri Alanı
Bilişim Dersleri, Yıllık Plan & Ders Materyali Yapay Zekası Servisi
- Yıllık Plan PDF/Metin Ayrıştırma & 36 Haftalık Müfredat Analizi
- MEB Ders Modülleri İndeksleme & Metin Çıkarımı (pypdf)
- Akademik Takvimden Güncel Ders Haftası Tespiti (Örn: Kasım 2. hafta -> 8. Hafta)
- Gemini AI & Akıllı Prosedürel Bilişim Müfredat Motoru
-python-pptx ile 16:9 Geniş Ekran Bilişim Sunusu (.pptx) Üretimi
"""

import os
import re
import json
import time
import uuid
import datetime
from typing import List, Dict, Any, Optional, Tuple

import httpx
import pypdf
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

# ================= 1. AKADEMİK TAKVİM & HAFTA HESAPLAYICI =================

MEB_DEFAULT_START_DATE = datetime.date(2026, 9, 14) # MEB 2026-2027 Eğitim Öğretim Yılı Açılışı (14 Eylül 2026 Pazartesi)

def calculate_academic_week(start_date: Optional[datetime.date] = None, target_date: Optional[datetime.date] = None) -> Dict[str, Any]:
    """
    Belirtilen başlangıç tarihine (varsayılan 14 Eylül 2026) göre güncel tarihin
    kaçıncı eğitim-öğretim haftasına denk geldiğini hesaplar.
    """
    s_date = start_date or MEB_DEFAULT_START_DATE
    if isinstance(s_date, datetime.datetime):
        s_date = s_date.date()
        
    t_date = target_date or datetime.date(2026, 11, 2) # Sistem tarihi
    try:
        now_local = datetime.datetime.now().date()
        # Eğer yerel tarih 2026 yılındaysa onu kullan, değilse simülasyon tarihini baz al
        if now_local.year == 2026:
            t_date = now_local
    except Exception:
        pass

    # Pazartesiye hizala
    s_monday = s_date - datetime.timedelta(days=s_date.weekday())
    t_monday = t_date - datetime.timedelta(days=t_date.weekday())

    delta_days = (t_monday - s_monday).days
    raw_week = (delta_days // 7) + 1

    # 1 ile 36 hafta arasına sınırla
    clamped_week = max(1, min(36, raw_week))

    cur_week_monday = s_monday + datetime.timedelta(weeks=clamped_week - 1)
    cur_week_friday = cur_week_monday + datetime.timedelta(days=4)

    months_tr = {
        1: "Ocak", 2: "Şubat", 3: "Mart", 4: "Nisan", 5: "Mayıs", 6: "Haziran",
        7: "Temmuz", 8: "Ağustos", 9: "Eylül", 10: "Ekim", 11: "Kasım", 12: "Aralık"
    }

    if cur_week_monday.month == cur_week_friday.month:
        date_range_str = f"{cur_week_monday.day} - {cur_week_friday.day} {months_tr[cur_week_friday.month]} {cur_week_friday.year}"
    else:
        date_range_str = f"{cur_week_monday.day} {months_tr[cur_week_monday.month]} - {cur_week_friday.day} {months_tr[cur_week_friday.month]} {cur_week_friday.year}"

    return {
        "current_week": clamped_week,
        "total_weeks": 36,
        "start_of_week": cur_week_monday.strftime("%d.%m.%Y"),
        "end_of_week": cur_week_friday.strftime("%d.%m.%Y"),
        "date_range_str": date_range_str,
        "academic_year": "2026-2027",
        "is_fall_term": clamped_week <= 18
    }

# ================= 2. DOSYA VE METİN AYRIŞTIRICI (PDF / TXT) =================

def extract_text_from_file(file_path: str, filename: str) -> Tuple[str, int]:
    """
    Yüklenen PDF veya metin dosyasından temizlenmiş metni ve sayfa sayısını çeker.
    """
    ext = os.path.splitext(filename)[1].lower()
    text = ""
    pages = 1

    if not os.path.exists(file_path):
        return "", 0

    if ext == ".pdf":
        try:
            reader = pypdf.PdfReader(file_path)
            pages = len(reader.pages)
            extracted_parts = []
            for i, p in enumerate(reader.pages):
                pt = p.extract_text()
                if pt:
                    extracted_parts.append(f"--- SAYFA {i+1} ---\n" + pt)
            text = "\n".join(extracted_parts)
        except Exception as err:
            text = f"PDF ayrıştırılırken hata oluştu: {err}"
    else:
        # Metin tabanlı dosya (txt, csv, json, md)
        for enc in ["utf-8", "utf-8-sig", "cp1254", "iso-8859-9", "latin-1"]:
            try:
                with open(file_path, "r", encoding=enc) as f:
                    text = f.read()
                break
            except Exception:
                continue

    return text.strip(), pages

# ================= 3. BİLİŞİM MÜFREDAT VE YILLIK PLAN HAZIR ŞABLONLARI =================

STARTER_CURRICULUMS = {
    "mobil_uygulama": {
        "name": "Mobil Uygulama Geliştirme (Android Studio & Java)",
        "grade_level": "11. Sınıf",
        "description": "Android Studio ile Activity yaşam döngüsü, ConstraintLayout, Intent, Material Components, SQLite ve REST API veri akışı.",
        "weeks": [
            {"week": 1, "topic": "Mobil Uygulama Geliştirmeye Giriş & Android Ekosistemi", "outcomes": "Android Studio ve SDK kurulumu, emülatör yapılandırması"},
            {"week": 2, "topic": "Android Proje Mimarisi & Gradle Yapısı", "outcomes": "Manifest, java ve res klasörlerinin analizi, build.gradle yönetimi"},
            {"week": 3, "topic": "XML ile Arayüz Tasarımı: LinearLayout & RelativeLayout", "outcomes": "Bileşen hizalama, padding, margin ve layout_weight kavramları"},
            {"week": 4, "topic": "Modern Arayüz: ConstraintLayout & Constraints Mantığı", "outcomes": "Yatay ve dikey zincirler, guidelines ve responsive mobil tasarım"},
            {"week": 5, "topic": "Temel UI Bileşenleri: TextView, EditText, Button", "outcomes": "Kullanıcıdan veri alma, tıklama olayları (setOnClickListener)"},
            {"week": 6, "topic": "Görsel & Seçim Bileşenleri: ImageView, CheckBox, RadioButton", "outcomes": "Resim kaynakları yönetimi ve çoklu seçim mantığının kodlanması"},
            {"week": 7, "topic": "Modern Material Components & TextInputLayout", "outcomes": "Şifre gizleme/gösterme, dinamik hata gösterimi ve görsel tasarım"},
            {"week": 8, "topic": "Modern Giriş (Login) Ekranı & Form Doğrulama (Validation)", "outcomes": "E-posta ve şifre kuralları, Patterns.EMAIL_ADDRESS ile doğrulama, Toast ve Snackbar"},
            {"week": 9, "topic": "Sayfalar Arası Geçiş: Intent & Veri Taşıma (Bundle)", "outcomes": "Explicit intent, putExtra ile parametre gönderme ve getExtras karşılama"},
            {"week": 10, "topic": "Activity Yaşam Döngüsü (onCreate, onStart, onResume, onPause, onDestroy)", "outcomes": "Uygulama durum geçişlerini yönetme ve durum kaydetme (savedInstanceState)"},
            {"week": 11, "topic": "Örtük Geçişler (Implicit Intent) & Sistem Eylemleri", "outcomes": "Tarayıcı açma, arama yapma ve harita konumu tetikleme"},
            {"week": 12, "topic": "Liste Bileşenleri: ListView & ArrayAdapter", "outcomes": "Basit veri dizilerini liste halinde ekranda gösterme ve item click dinleme"},
            {"week": 13, "topic": "Gelişmiş Liste: RecyclerView Mimarisi & Adapter Sınıfı", "outcomes": "ViewHolder deseni ile performanslı liste mimarisi oluşturma"},
            {"week": 14, "topic": "RecyclerView & Özel Kart Tasarımı (CardView)", "outcomes": "Özel model sınıfları ve zengin liste kartlarının tasarlanması"},
            {"week": 15, "topic": "Menü Mimarisi: OptionsMenu & PopupMenu", "outcomes": "Toolbar entegrasyonu ve menü öğesi tıklama kontrolleri"},
            {"week": 16, "topic": "Diyalog Pencereleri: AlertDialog & Custom Dialog", "outcomes": "Onay kutuları, silme uyarıları ve özel form pencereleri"},
            {"week": 17, "topic": "1. Dönem Performans & Portfolyo Proje Değerlendirmesi", "outcomes": "Öğrenci mobil projelerinin atölyede canlı sunumu ve kod incelemesi"},
            {"week": 18, "topic": "1. Dönem Genel Tekrar & Hata Ayıklama (Logcat / Debugger)", "outcomes": "Breakpoint kullanımı, Log.d/Log.e ile log analizi"},
            {"week": 19, "topic": "Veri Saklama 1: SharedPreferences (Ayar ve Oturum Saklama)", "outcomes": "Beni hatırla, karanlık mod ayarı ve küçük anahtar-değer çiftleri"},
            {"week": 20, "topic": "Veri Saklama 2: SQLite Veritabanına Giriş & SQLiteOpenHelper", "outcomes": "Yerel tablo oluşturma, onCreate ve onUpgrade fonksiyonları"},
            {"week": 21, "topic": "SQLite CRUD Operasyonları: Insert & Select (Kayıt Ekleme ve Listeleme)", "outcomes": "ContentValues kullanımı ve Cursor ile verileri gezme"},
            {"week": 22, "topic": "SQLite CRUD Operasyonları: Update & Delete (Güncelleme ve Silme)", "outcomes": "Veri filtreleme ve dinamik arayüz güncellemesi"},
            {"week": 23, "topic": "Modern Veritabanı: Android Room Persistence Library", "outcomes": "Entity, DAO ve AppDatabase yapıları ile modern veri katmanı"},
            {"week": 24, "topic": "Fragment Mimarisi & BottomNavigationView", "outcomes": "Tek activity çok fragment yapısı ve sekme gezintisi"},
            {"week": 25, "topic": "Arka Plan İşlemleri & Thread Mantığı", "outcomes": "UI Thread kilitlemeden uzun süren işlemleri yönetme"},
            {"week": 26, "topic": "Ağ İletişimi: Volley / Retrofit Kütüphaneleri", "outcomes": "İnternet izni ve HTTP GET istekleri ile JSON verisi çekme"},
            {"week": 27, "topic": "JSON Veri Ayrıştırma & GSON Entegrasyonu", "outcomes": "Hava durumu veya döviz kuru API verisini modellerle eşleme"},
            {"week": 28, "topic": "Bildirim Yönetimi (NotificationManager & Channels)", "outcomes": "Android 8+ bildirim kanalları ve yerel push bildirimleri oluşturma"},
            {"week": 29, "topic": "Sensörler & Konum Hizmetleri (GPS / LocationManager)", "outcomes": "Cihaz ivmeölçer ve GPS koordinatlarını okuma"},
            {"week": 30, "topic": "Kamera & Galeri İzinleri (Runtime Permissions)", "outcomes": "Fotoğraf çekme ve galeriden resim seçip ImageView'e aktarma"},
            {"week": 31, "topic": "Google Firebase Entegrasyonu & Firebase Auth", "outcomes": "Bulut tabanlı e-posta/şifre kullanıcı oturum açma"},
            {"week": 32, "topic": "Firebase Firestore / Realtime Database", "outcomes": "Bulutta anlık veri senkronizasyonu ve mesajlaşma mantığı"},
            {"week": 33, "topic": "Uygulama İçi Güvenlik & ProGuard / R8 Obfuscation", "outcomes": "APK boyut küçültme ve kod güvenliği sağlama"},
            {"week": 34, "topic": "APK & AAB Çıktısı Alma: İmzalı Paketleme (Signed Bundle)", "outcomes": "Keystore anahtarı oluşturma ve Google Play yükleme gereksinimleri"},
            {"week": 35, "topic": "Yıl Sonu Bilişim Sergisi & Mobil Proje Sunumları", "outcomes": "Öğrenci mobil uygulamalarının okul panosunda ve atölyede sergilenmesi"},
            {"week": 36, "topic": "Yıl Sonu Değerlendirmesi & Bilişim Sektör Kariyer Rehberliği", "outcomes": "GitHub portfolyosu hazırlama, staj ve iş imkanları değerlendirmesi"}
        ]
    },
    "web_programlama": {
        "name": "Web Tabanlı Uygulama Geliştirme (HTML, CSS, JS & React)",
        "grade_level": "11. Sınıf",
        "description": "Modern web arayüzleri, CSS Grid/Flexbox, JavaScript DOM olayları, Asenkron API istekleri ve React bileşen mimarisi.",
        "weeks": [
            {"week": 1, "topic": "Web Teknolojilerine Giriş & İnternet Protokolleri", "outcomes": "HTTP/HTTPS, DNS, istemci-sunucu mimarisi"},
            {"week": 2, "topic": "Semantik HTML5 & Sayfa İskeleti Oluşturma", "outcomes": "header, nav, main, section, footer etiketleri ve SEO"},
            {"week": 3, "topic": "CSS3 Temelleri: Seçiciler, Renkler ve Kutu Modeli (Box Model)", "outcomes": "margin, border, padding, content hiyerarşisi"},
            {"week": 4, "topic": "Modern CSS Düzenleri 1: Flexbox ile Esnek Arayüz", "outcomes": "justify-content, align-items ve responsive menü tasarımı"},
            {"week": 5, "topic": "Modern CSS Düzenleri 2: CSS Grid Sistemi", "outcomes": "grid-template-columns, grid gap ve karmaşık dashboard iskeletleri"},
            {"week": 6, "topic": "Duyarlı (Responsive) Tasarım & Medya Sorguları (Media Queries)", "outcomes": "Mobil, tablet ve masaüstü uyumlu responsive kırılma noktaları"},
            {"week": 7, "topic": "Tailwind CSS ile Hızlı Stil Geliştirme", "outcomes": "Utility-first CSS mantığı, dark mode ve modern bileşenler"},
            {"week": 8, "topic": "JavaScript Temelleri: Değişkenler (let/const), Veri Tipleri ve Fonksiyonlar", "outcomes": "Modern ES6+ sözdizimi, arrow functions ve scope kuralları"},
            {"week": 9, "topic": "JavaScript DOM Manipülasyonu & Olay Yönetimi (addEventListener)", "outcomes": "Sayfadaki elementleri seçme, dinamik içerik ve sınıf değiştirme"},
            {"week": 10, "topic": "Diziler, Nesneler ve Modern Dizi Metotları (map, filter, reduce)", "outcomes": "Veri listeleri üzerinde filtreleme ve arama işlemleri"}
        ]
    },
    "nesne_tabanli": {
        "name": "Nesne Tabanlı Programlama (C# / Python)",
        "grade_level": "10. Sınıf",
        "description": "Sınıf ve nesne kavramları, kapsülleme, kalıtım, çok biçimlilik, soyutlama ve temiz kod prensipleri.",
        "weeks": [
            {"week": 1, "topic": "Programlamaya Giriş & Geliştirme Ortamının Hazırlanması", "outcomes": "IDE kurulumu, temel konsol girdi/çıktı işlemleri"},
            {"week": 2, "topic": "Veri Tipleri, Değişkenler ve Tip Dönüşümleri", "outcomes": "İlkel tipler, referans tipler ve tip güvenliği"},
            {"week": 3, "topic": "Operatörler ve Koşullu İfadeler (if-else, switch-case)", "outcomes": "Mantıksal karar yapıları ve akış kontrolü"},
            {"week": 4, "topic": "Döngüler (for, while, foreach) ve Dizi Kavramı", "outcomes": "Tek ve çift boyutlu diziler üzerinde döngü kurma"},
            {"week": 5, "topic": "Metotlar ve Fonksiyonel Tasarım", "outcomes": "Parametre aktarımı, geri dönüş değerleri ve aşırı yükleme (overloading)"},
            {"week": 6, "topic": "Nesne Tabanlı Programlamaya Giriş: Sınıf (Class) ve Nesne (Object)", "outcomes": "Gerçek dünya nesnelerini kod ortamında modelleme"},
            {"week": 7, "topic": "Kurucu Fonksiyonlar (Constructors) ve 'this' / 'self' Kavramı", "outcomes": "Nesne başlatma adımları ve bellek yönetimi"},
            {"week": 8, "topic": "Kapsülleme (Encapsulation) & Erişim Belirleyiciler (Access Modifiers)", "outcomes": "private, public, protected ve getter/setter özellikleri"}
        ]
    }
}

def parse_annual_plan_text(raw_text: str, course_name: str = "") -> List[Dict[str, Any]]:
    """
    Öğretmenin yüklediği yıllık plan metnini (veya PDF'ten çekilen ham metni)
    hafta hafta analiz edip yapılandırılmış 36 haftalık listeye dönüştürür.
    """
    if not raw_text or len(raw_text.strip()) < 50:
        # Metin yoksa veya çok kısaysa ders ismine en yakın şablonu getir
        lower_c = course_name.lower()
        if "mobil" in lower_c or "android" in lower_c:
            return STARTER_CURRICULUMS["mobil_uygulama"]["weeks"]
        elif "web" in lower_c or "tasarım" in lower_c or "react" in lower_c:
            base = STARTER_CURRICULUMS["web_programlama"]["weeks"]
            # 36 haftaya tamamla
            return pad_weeks_to_36(base, "Web Tabanlı Uygulama Geliştirme")
        elif "nesne" in lower_c or "c#" in lower_c or "python" in lower_c:
            base = STARTER_CURRICULUMS["nesne_tabanli"]["weeks"]
            return pad_weeks_to_36(base, "Nesne Tabanlı Programlama")
        else:
            return STARTER_CURRICULUMS["mobil_uygulama"]["weeks"]

    # Regex ile hafta bloklarını yakala
    # Örnek: "1. HAFTA", "Hafta 1:", "1.Hafta", "14-18 Eylül"
    pattern = re.compile(
        r'(?:(?:\b|^)(\d{1,2})\s*[\.\:\-]?\s*Hafta|(?:Hafta\s*(\d{1,2})))\s*[:\-–]?\s*([^\n\r]+)',
        re.IGNORECASE
    )

    matches = pattern.findall(raw_text)
    parsed_weeks = []
    seen_weeks = set()

    for m in matches:
        w_num_str = m[0] or m[1]
        try:
            w_num = int(w_num_str)
            if 1 <= w_num <= 36 and w_num not in seen_weeks:
                seen_weeks.add(w_num)
                topic = m[2].strip()
                # Ekstra gereksiz kelimeleri temizle
                topic = re.sub(r'^(?:Konu|Ünite|Kazanım)\s*[:\-–]?\s*', '', topic, flags=re.IGNORECASE)
                parsed_weeks.append({
                    "week": w_num,
                    "topic": topic[:120] if topic else f"{w_num}. Hafta Bilişim Konusu",
                    "outcomes": f"{w_num}. Hafta MEB Bilişim ders kazanımları ve uygulama hedefleri."
                })
        except Exception:
            continue

    parsed_weeks.sort(key=lambda x: x["week"])

    # Eğer en az 10 hafta yakaladıysa eksikleri doldurup döndür
    if len(parsed_weeks) >= 8:
        return pad_weeks_to_36(parsed_weeks, course_name or "Bilişim Teknolojileri")

    # Satır satır alternatif ayrıştırma
    lines = [l.strip() for l in raw_text.splitlines() if len(l.strip()) > 5]
    alt_weeks = []
    week_counter = 1
    for line in lines:
        if re.search(r'(?:giriş|mimar|tasarım|bileşen|fonksiyon|döngü|sınıf|veritabanı|sql|api|proje|arayüz|kod)', line, re.IGNORECASE):
            alt_weeks.append({
                "week": week_counter,
                "topic": line[:120],
                "outcomes": f"{week_counter}. Hafta uygulama ve öğrenme hedefleri."
            })
            week_counter += 1
            if week_counter > 36:
                break

    if len(alt_weeks) >= 5:
        return pad_weeks_to_36(alt_weeks, course_name or "Bilişim Teknolojileri")

    # Yeterli ayrışmadıysa hazır şablona yönlendir
    return STARTER_CURRICULUMS["mobil_uygulama"]["weeks"]

def pad_weeks_to_36(existing_weeks: List[Dict[str, Any]], subject_title: str) -> List[Dict[str, Any]]:
    """Hafta listesini 36 haftaya eksiksiz tamamlar."""
    week_map = {w["week"]: w for w in existing_weeks}
    result = []
    for i in range(1, 37):
        if i in week_map:
            result.append(week_map[i])
        else:
            result.append({
                "week": i,
                "topic": f"{subject_title} - {i}. Hafta İleri Düzey Laboratuvar & Proje Uygulaması",
                "outcomes": f"{i}. Hafta bilişim becerilerini pekiştirme, kodlama ve atölye değerlendirmesi."
            })
    return result

# ================= 4. GEMINI AI MATERYAL & KOD & SUNUM MOTORU =================

async def generate_weekly_bilisim_material(
    course_name: str,
    grade_level: str,
    week_number: int,
    topic: str,
    outcomes: str,
    module_summaries: str = "",
    custom_prompt: Optional[str] = None,
    api_key: Optional[str] = None
) -> Dict[str, Any]:
    """
    Seçilen haftanın Bilişim dersi için:
    1. Derste Kullanılacak Çalışır Kod ve Örnekleri (Kod editörü standardında)
    2. Adım Adım Laboratuvar / Bilgisayar Uygulaması (Atölye Çalışması)
    3. Öğretmen Ders Akış Kılavuzu & Tahta Planı
    4. Sınıf İçi Pekiştirme Soruları (Mini Quiz)
    5. 16:9 Geniş Ekran Sunum Slayt Mimarisi
    çıktılarını Gemini AI ile (veya yüksek kaliteli prosedürel motorla) üretir.
    """
    key = api_key or os.getenv("GEMINI_API_KEY")

    prompt = f"""Sen Türkiye'nin en deneyimli Mesleki ve Teknik Anadolu Lisesi (MTAL) Bilişim Teknolojileri Alan Şefi ve Yazılım Mühendisisin.
Ders Adı: {course_name}
Sınıf Düzeyi: {grade_level}
Hafta Numarası: {week_number}. Hafta
Haftanın Konusu: {topic}
MEB Kazanımları: {outcomes}
Ders Modülü Bağlamı: {module_summaries[:2000] if module_summaries else "Genel MEB Bilişim Müfredatı"}

GÖREVİN:
Öğretmenin bu hafta laboratuvarda/derste doğrudan ekrana yansıtacağı, öğrencilere kodlatacağı ve sunacağı EKSİKSİZ ders materyal paketini hazırla.

JSON ÇIKTISI ŞU STANDARTTA OLMALIDIR (SADECE GEÇERLİ JSON DÖNDÜR):
{{
  "topic": "{topic}",
  "subtopics": ["Alt Konu 1", "Alt Konu 2", "Alt Konu 3", "Alt Konu 4"],
  "learning_outcomes": [
    "Öğrenci {topic} konusunun temel mimarisini ve mantığını açıklar.",
    "Bileşenleri ve kod bloklarını laboratuvar ortamında hatasız yazar.",
    "Yaygın sözdizimi ve mantık hatalarını tespit edip giderir."
  ],
  "teaching_guide": {{
    "duration_min": 80,
    "timeline": [
      {{"time": "0-10 dk", "phase": "Giriş & Motivasyon", "activity": "Günün konusunu gerçek hayat mobil/web uygulamalarından örneklerle tahtada tartışma."}},
      {{"time": "10-30 dk", "phase": "Projeksiyon Anlatımı & Canlı Kodlama", "activity": "Öğretmenin projeksiyonda kodları adım adım yazarak öğrencilere göstermesi."}},
      {{"time": "30-70 dk", "phase": "Laboratuvar & Bilgisayar Uygulaması", "activity": "Öğrencilerin kendi bilgisayarlarında verilen görevi birebir kodlaması, öğretmenin rehberliği."}},
      {{"time": "70-80 dk", "phase": "Soru-Cevap & Kod İnceleme", "activity": "Seçilen öğrenci projelerinin tahtaya yansıtılması ve mini pekiştirme sorularının çözümü."}}
    ],
    "board_notes": "Tahtaya çizilecek blok diyagram veya mimari şema açıklaması.",
    "teacher_tips": "Öğretmene pratik atölye ipucu: Öğrencilerin en çok noktalı virgül, kütüphane importu veya ID eşleşmesinde yapacağı hatalara dikkat çekin."
  }},
  "code_examples": [
    {{
      "title": "1. Temel Örnek: Giriş ve Başlatma Kodu",
      "language": "java",
      "code": "// Açıklamalı, temiz ve çalıştırılabilir kod örneği...",
      "explanation": "Bu kod bloğu bileşenin tanımlanması ve başlatılması işlemlerini gerçekleştirir.",
      "common_mistakes": "Bileşenin başlatılmadan çağrılması durumunda NullPointerException hatası oluşabilir."
    }},
    {{
      "title": "2. Uygulama & Olay Yönetimi (Event Handling)",
      "language": "java",
      "code": "// Olay yakalama ve aksiyon üretme kodu...",
      "explanation": "Kullanıcı etkileşimini dinleyip gerekli fonksiyonları tetikler.",
      "common_mistakes": "Listener fonksiyonunda UI thread'i kilitleyecek ağır döngüler çalıştırmayınız."
    }}
  ],
  "lab_exercises": {{
    "title": "Öğrenci Laboratuvar Görevi: Atölye Uygulama Senaryosu",
    "scenario": "Öğrencilerin kendi bilgisayarlarında gerçekleştireceği gerçekçi bir senaryo...",
    "steps": [
      "1. Adım: Geliştirme ortamında yeni projeyi veya çalışma dosyasını oluşturun.",
      "2. Adım: Arayüz elemanlarını uygun parametrelerle konumlandırın.",
      "3. Adım: Gerekli kod bloklarını yazarak veri doğrulama mantığını ekleyin.",
      "4. Adım: Emülatör veya yerel sunucuda test ederek çalıştığını doğrulayın."
    ],
    "expected_output": "Doğru veri girildiğinde başarılı bildirim gösterilmeli, hatalı veri girildiğinde kırmızı uyarı verilmelidir."
  }},
  "quiz_questions": [
    {{
      "question": "{topic} konusu ile ilgili teknik ve pedagojik çoktan seçmeli soru...",
      "options": ["A) Yanlış şık", "B) Doğru yanıt şıkkı", "C) Çeldirici şık", "D) Başka çeldirici"],
      "correct_answer": "B",
      "explanation": "Doğru yanıt B'dir çünkü konunun mimari gereği bu şekilde çalışır."
    }}
  ],
  "slides": [
    {{
      "slide_type": "title",
      "badge": "HAFTA {week_number}",
      "category": "{course_name.upper()}",
      "title": "{topic}",
      "subtitle": "Kavramsal Mimari, Kod Örnekleri ve Laboratuvar Uygulaması",
      "bullets": [
        "Temel Prensipler ve Bileşen Mimarisi",
        "Modern Kodlama Standartları ve Sözdizimi",
        "Canlı Laboratuvar Uygulaması ve Senaryosu",
        "Hata Ayıklama ve Sık Yapılan Yanılgılar"
      ]
    }},
    {{
      "slide_type": "outcomes",
      "badge": "KAZANIMLAR",
      "category": "DERSİN ÖĞRENME HEDEFLERİ",
      "title": "Haftanın Öğrenci Kazanımları",
      "bullets": [
        "1. {topic} konusunun temel teorik mantığını kavrayabilme.",
        "2. Gerekli kütüphane ve modülleri projeye dahil edebilme.",
        "3. Verilen senaryoya uygun kodlama mantığını bağımsız oluşturabilme.",
        "4. Karşılaşılan çalışma zamanı hatalarını bağımsız giderebilme."
      ]
    }},
    {{
      "slide_type": "theory",
      "badge": "MİMARİ & KAVRAMLAR",
      "category": "TEORİK BİLGİ",
      "title": "Temel Çalışma Mantığı ve Mimarisi",
      "bullets": [
        "Bileşenin Görevi: Sistemin temel yapı taşlarından biridir ve veri akışını düzenler.",
        "Yaşam Döngüsü: Sistem belleğinde başlatılma, çalışma ve sonlandırılma aşamalarından geçer.",
        "Verimlilik & Performans: Kaynak tüketimini optimize eden temiz kodlama yaklaşımı esastır."
      ]
    }},
    {{
      "slide_type": "code",
      "badge": "CANLI KODLAMA",
      "category": "KOD İNCELEME",
      "title": "Örnek Kod İncelemesi & Sözdizimi",
      "code_snippet": "// Derste tahtaya yazılacak veya projeksiyonda incelenecek temel kod bloğu",
      "bullets": [
        "Önemli Satır 1: Başlatma işlemi doğru parametrelerle gerçekleştirilmelidir.",
        "Önemli Satır 2: Olay tetiklendiğinde kullanıcıya anlık geri bildirim verilir."
      ]
    }},
    {{
      "slide_type": "lab",
      "badge": "ATÖLYE UYGULAMASI",
      "category": "LABORATUVAR GÖREVİ",
      "title": "Öğrenci Bilgisayar Uygulaması",
      "bullets": [
        "Adım 1: Yeni çalışma alanınızı açıp proje dosyanızı hazırlayın.",
        "Adım 2: Belirtilen bileşenleri ekleyip özelliklerini düzenleyin.",
        "Adım 3: Test kodunu çalıştırıp çıktıyı öğretmene gösterin."
      ]
    }},
    {{
      "slide_type": "pitfalls",
      "badge": "HATA AYIKLAMA",
      "category": "SIK YAPILAN HATALAR",
      "title": "Öğrencilerin En Çok Yaptığı Hatalar",
      "bullets": [
        "Hata 1: Tanımlanmamış değişken veya ID kullanımı (Çözüm: İsimleri dikkatle kontrol edin).",
        "Hata 2: Kütüphane / namespace importlarının eksik bırakılması.",
        "Hata 3: Veri tiplerinin uyumsuz atanması."
      ]
    }},
    {{
      "slide_type": "summary",
      "badge": "ÖZET & DEĞERLENDİRME",
      "category": "DERS SONU",
      "title": "Ders Özeti ve Gelecek Haftaya Bakış",
      "bullets": [
        "Bugün {topic} konusunu teorik ve uygulamalı olarak tamamladık.",
        "Gelecek hafta bir sonraki modül olan ileri düzey konulara geçeceğiz.",
        "Laboratuvar ödevinizi sisteme yüklemeyi unutmayınız!"
      ]
    }}
  ]
}}
"""
    if custom_prompt:
        prompt += f"\n\nÖĞRETMENİN ÖZEL DERS NOTU: {custom_prompt}\n"

    # Gemini API Çağrısı
    if key:
        models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash", "gemini-flash-latest"]
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": 0.7,
                "topP": 0.9,
                "responseMimeType": "application/json"
            }
        }
        async with httpx.AsyncClient(timeout=40.0) as client:
            for model_name in models:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
                    res = await client.post(url, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates and "content" in candidates[0] and "parts" in candidates[0]["content"]:
                            raw = candidates[0]["content"]["parts"][0]["text"].strip()
                            if raw.startswith("```"):
                                raw = re.sub(r"^```(?:json)?", "", raw)
                                raw = re.sub(r"```$", "", raw).strip()
                            parsed = json.loads(raw)
                            if isinstance(parsed, dict) and "slides" in parsed:
                                return parsed
                except Exception as ex:
                    print(f"[Bilisim AI] {model_name} çağrısında istisna: {ex}")

    # Fallback / Yüksek Kaliteli Akıllı Prosedürel Üretici
    return generate_procedural_bilisim_material(course_name, grade_level, week_number, topic, outcomes)

# ================= 5. YÜKSEK KALİTELİ PROSEDÜREL BİLİŞİM MOTORU =================

def generate_procedural_bilisim_material(
    course_name: str,
    grade_level: str,
    week_number: int,
    topic: str,
    outcomes: str
) -> Dict[str, Any]:
    """
    İnternet veya API kesintilerinde bile öğretmenin elini hiçbir zaman boş bırakmayan,
    MEB Bilişim standartlarına %100 uyumlu zengin materyal üreteci.
    """
    is_mobile = "mobil" in course_name.lower() or "android" in course_name.lower()
    is_web = "web" in course_name.lower() or "tasarım" in course_name.lower() or "html" in course_name.lower()

    if is_mobile:
        lang = "java"
        sample_code_1 = """// 1. Arayüz Bileşenini Bağlama ve Başlatma
EditText etUsername = findViewById(R.id.etUsername);
EditText etPassword = findViewById(R.id.etPassword);
MaterialButton btnSubmit = findViewById(R.id.btnSubmit);

// Şifre Giriş Alanı Yapılandırması
etPassword.setTransformationMethod(new PasswordTransformationMethod());"""
        sample_code_2 = """// 2. Buton Tıklama Olayı ve Form Doğrulama (Validation)
btnSubmit.setOnClickListener(v -> {
    String username = etUsername.getText().toString().trim();
    String password = etPassword.getText().toString().trim();

    if (username.isEmpty()) {
        etUsername.setError("Kullanıcı adı boş bırakılamaz!");
        etUsername.requestFocus();
        return;
    }

    if (password.length() < 6) {
        etPassword.setError("Şifre en az 6 karakter olmalıdır!");
        etPassword.requestFocus();
        return;
    }

    // Başarılı Giriş: Sonraki Sayfaya Geçiş (Intent)
    Intent intent = new Intent(MainActivity.this, DashboardActivity.class);
    intent.putExtra("EXTRA_USER", username);
    startActivity(intent);
    Toast.makeText(this, "Hoş geldiniz, " + username, Toast.LENGTH_SHORT).show();
});"""
    elif is_web:
        lang = "javascript"
        sample_code_1 = """// 1. DOM Elementlerini Seçme
const loginForm = document.querySelector('#loginForm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const statusBox = document.querySelector('#statusMessage');"""
        sample_code_2 = """// 2. Form Gönderme Olayı ve E-posta Kontrolü
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const pass = passwordInput.value.trim();

    // Regex ile E-Posta Format Kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        statusBox.textContent = 'Lütfen geçerli bir kurumsal e-posta giriniz!';
        statusBox.className = 'text-red-500 font-bold';
        return;
    }

    statusBox.textContent = 'Giriş başarılı! Yönlendiriliyorsunuz...';
    statusBox.className = 'text-green-500 font-bold';
});"""
    else:
        lang = "csharp"
        sample_code_1 = """// 1. Sınıf Tanımlama ve Kapsülleme (Encapsulation)
public class Ogrenci
{
    private string _adSoyad;
    public int OkulNo { get; set; }

    public string AdSoyad
    {
        get { return _adSoyad; }
        set 
        { 
            if (!string.IsNullOrWhiteSpace(value))
                _adSoyad = value.Trim();
            else
                throw new ArgumentException("Ad soyad boş olamaz!");
        }
    }
}"""
        sample_code_2 = """// 2. Nesne Üretme ve Metot Çağırma
static void Main(string[] args)
{
    Ogrenci ogr = new Ogrenci();
    ogr.AdSoyad = "Ahmet Yılmaz";
    ogr.OkulNo = 1042;

    Console.WriteLine($"Kayıt Başarılı: {ogr.AdSoyad} - No: {ogr.OkulNo}");
}"""

    return {
        "topic": topic,
        "subtopics": [
            f"{topic} Mimarisi ve Temelleri",
            "Bileşen Yapısı ve Özellikleri",
            "Olay Yönetimi ve Fonksiyonel Kodlama",
            "Laboratuvar Uygulaması & Test Adımları"
        ],
        "learning_outcomes": [
            f"Öğrenci {topic} konusunun kuramsal ilkelerini ve işlevini kavrar.",
            "Geliştirme ortamında ilgili kod yapılarını hatasız yazar ve çalıştırır.",
            "Kullanıcı etkileşimlerini yöneterek yazılımı test eder.",
            "Yaygın sözdizimi ve mantık hatalarını bağımsız tespit eder."
        ],
        "teaching_guide": {
            "duration_min": 80,
            "timeline": [
                {"time": "0-10 dk", "phase": "Giriş & Motivasyon", "activity": f"Günün konusu olan '{topic}' hakkında günlük hayat yazılımlarından örnekler vererek ilgi uyandırma."},
                {"time": "10-30 dk", "phase": "Projeksiyonda Canlı Kodlama", "activity": "Öğretmenin projeksiyonda kodları adım adım yazıp çalışma mantığını tahtada açıklaması."},
                {"time": "30-70 dk", "phase": "Laboratuvar Atölye Uygulaması", "activity": "Tüm öğrencilerin bilgisayarlarında verilen laboratuvar görevini adım adım kodlaması."},
                {"time": "70-80 dk", "phase": "Değerlendirme & Pekiştirme", "activity": "Öğrenci ekranlarının incelenmesi, pekiştirme soruları ve ders özeti."}
            ],
            "board_notes": f"1. {topic} Genel Blok Şeması\n2. Temel Fonksiyon ve Metot İmzaları\n3. Veri Akış Yönü ve Yaşam Döngüsü",
            "teacher_tips": "Öğretmene Tavsiye: Öğrencilerin en sık karşılaştığı yazım hatalarına ve kütüphane import eksikliklerine dersin başında özellikle vurgu yapınız."
        },
        "code_examples": [
            {
                "title": f"1. Temel Örnek: {topic} Başlatma & Tanımlama",
                "language": lang,
                "code": sample_code_1,
                "explanation": "Bu kod bloğu bileşenin projeye dahil edilmesini, bellek tahsisini ve başlangıç parametrelerini düzenler.",
                "common_mistakes": "Bileşen nesnesinin başlatılmadan (initialize edilmeden) kullanılması durumunda çalışma zamanı hatası (Runtime Exception) alınır."
            },
            {
                "title": f"2. Uygulama Örneği: {topic} Olay Yönetimi ve Doğrulama",
                "language": lang,
                "code": sample_code_2,
                "explanation": "Kullanıcı aksiyonlarını dinler, verileri doğrular ve başarılı koşulda akışı bir sonraki adıma iletir.",
                "common_mistakes": "Koşullu kontrollerde boş değer (null veya empty) kontrolünün unutulması programın çökmesine yol açabilir."
            }
        ],
        "lab_exercises": {
            "title": f"Öğrenci Laboratuvar Görevi: {topic} Uygulaması",
            "scenario": f"Torbalı Piri Reis MTAL Bilişim Laboratuvarında '{topic}' konusunu içeren fonksiyonel bir modül geliştirilecektir.",
            "steps": [
                "1. Adım: IDE ortamında yeni proje veya modül sayfasını açın.",
                "2. Adım: Arayüz ve mantık bileşenlerini örnekte gösterildiği gibi tanımlayın.",
                "3. Adım: Olay dinleyici fonksiyonu ekleyerek veri doğrulamalarını kodlayın.",
                "4. Adım: Hatalı ve doğru verilerle sistemi test edip ekran çıktısını öğretmene onaylatın."
            ],
            "expected_output": "Doğru veri girişinde sistem onay vermeli, eksik veya hatalı girişte kullanıcıya yönlendirici hata mesajı sunmalıdır."
        },
        "quiz_questions": [
            {
                "question": f"{topic} konusunda kullanılan temel yapı ve bileşenlerin en önemli işlevi aşağıdakilerden hangisidir?",
                "options": [
                    "A) Yalnızca grafik kartının hızını artırmak",
                    "B) Kullanıcı verilerini güvenle almak, işlemek ve doğru akışa yönlendirmek",
                    "C) Bilgisayarın işletim sistemini yeniden başlatmak",
                    "D) Kod dosyasını otomatik olarak internete yüklemek"
                ],
                "correct_answer": "B",
                "explanation": "Bilişim ve yazılım mimarisinde bileşenler kullanıcı ile sistem arasındaki veri akışını ve kontrolleri düzenlemek için kullanılır."
            },
            {
                "question": f"Aşağıdakilerden hangisi '{topic}' uygulanırken oluşabilecek en yaygın çalışma zamanı hatasıdır?",
                "options": [
                    "A) Başlatılmamış (null) referans üzerinden metot çağırma hatası",
                    "B) Ekran parlaklığının düşmesi",
                    "C) Klavye tuşlarının yer değiştirmesi",
                    "D) Dosya adının çok uzun olması"
                ],
                "correct_answer": "A",
                "explanation": "Yazılım geliştirmede nesne başlatılmadan çağrıldığında NullPointerException veya benzeri nesne referans hatası meydana gelir."
            }
        ],
        "slides": [
            {
                "slide_type": "title",
                "badge": f"HAFTA {week_number}",
                "category": f"{course_name.upper()} • {grade_level.upper()}",
                "title": topic,
                "subtitle": "Kavramsal Mimari, Kod Örnekleri ve Laboratuvar Uygulaması",
                "bullets": [
                    "Temel Mimari & Bileşen Yapısı",
                    "Canlı Kod İncelemesi ve Sözdizimi",
                    "Atölye Bilgisayar Uygulaması",
                    "Hata Ayıklama & Çözüm Teknikleri"
                ]
            },
            {
                "slide_type": "outcomes",
                "badge": "KAZANIMLAR",
                "category": "DERSİN ÖĞRENME HEDEFLERİ",
                "title": "Haftanın Öğrenci Kazanımları",
                "bullets": [
                    f"1. {topic} konusunun temel ilkelerini kavrayabilme.",
                    "2. Gerekli kod yapılarını geliştirme ortamında hatasız yazabilme.",
                    "3. Kullanıcı etkileşimlerini ve veri akışını doğru kurgulayabilme.",
                    "4. Çalışma zamanı hatalarını bağımsız olarak ayıklayabilme."
                ]
            },
            {
                "slide_type": "theory",
                "badge": "MİMARİ & KAVRAMLAR",
                "category": "TEORİK BİLGİ",
                "title": f"{topic} Temel Çalışma Mantığı",
                "bullets": [
                    "Bileşenin Görevi: Sistemin temel yapı taşlarından biridir ve veri akışını yönetir.",
                    "İşlem Sırası: Girdi Alma -> Doğrulama (Validation) -> Mantıksal İşlem -> Kullanıcı Bildirimi.",
                    "Performans Standardı: Belleği verimli kullanan ve arayüzü kilitlemeyen temiz kod yaklaşımı esastır."
                ]
            },
            {
                "slide_type": "code",
                "badge": "CANLI KODLAMA",
                "category": "KOD İNCELEME",
                "title": "Canlı Kod İncelemesi & Sözdizimi",
                "code_snippet": sample_code_2,
                "bullets": [
                    "Önemli Nokta 1: Veri doğrulaması (Validation) her zaman işlemden önce yapılmalıdır.",
                    "Önemli Nokta 2: Kullanıcıya anlaşılır ve yönlendirici hata mesajları sunulmalıdır."
                ]
            },
            {
                "slide_type": "lab",
                "badge": "ATÖLYE UYGULAMASI",
                "category": "LABORATUVAR GÖREVİ",
                "title": "Bilgisayar Başında Laboratuvar Görevi",
                "bullets": [
                    "Adım 1: IDE ortamında yeni çalışma sayfasını açın.",
                    "Adım 2: Gerekli arayüz ve kod bloklarını eksiksiz tamamlayın.",
                    "Adım 3: En az 2 farklı test senaryosu ile uygulamanızı çalıştırın.",
                    "Adım 4: Ekran çıktısını öğretmene göstererek puanınızı alın."
                ]
            },
            {
                "slide_type": "pitfalls",
                "badge": "HATA AYIKLAMA",
                "category": "SIK YAPILAN HATALAR",
                "title": "Öğrencilerin En Çok Yaptığı Hatalar",
                "bullets": [
                    "Hata 1: Değişken ve bileşen ID isimlerinin yanlış yazılması.",
                    "Hata 2: Giriş alanlarının boş bırakılma durumunun (isEmpty) kontrol edilmemesi.",
                    "Hata 3: Gerekli kütüphane veya paketlerin sayfaya dahil edilmemesi."
                ]
            },
            {
                "slide_type": "summary",
                "badge": "ÖZET",
                "category": "DERS SONU",
                "title": "Ders Özeti & Gelecek Haftaya Bakış",
                "bullets": [
                    f"Bugün '{topic}' konusunu teorik ve uygulamalı olarak başarıyla işledik.",
                    "Gelecek hafta bir sonraki konunun ileri düzey pratiklerine geçeceğiz.",
                    "Yaptığınız çalışmaları kaydetmeyi ve öğretmen portalına yüklemeyi unutmayınız!"
                ]
            }
        ]
    }

# ================= 6. PYTHON-PPTX İLE 16:9 POWERPOINT SUNUMU ÜRETİCİ =================

def build_pptx_presentation(
    material_data: Dict[str, Any],
    course_name: str,
    week_number: int,
    output_path: str
) -> str:
    """
    python-pptx kullanarak Torbalı Piri Reis MTAL Bilişim Teknolojileri
    özel kurumsal karanlık temalı (16:9 geniş ekran) profesyonel sunum oluşturur.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Renk Paleti (Piri Reis MTAL Bilişim Kurumsal)
    COLOR_BG = RGBColor(11, 19, 43)        # #0B132B Koyu Gece Mavisi
    COLOR_CARD = RGBColor(28, 37, 65)      # #1C2541 Slate Kart Rengi
    COLOR_BORDER = RGBColor(58, 80, 107)   # #3A506B Kart Sınır Rengi
    COLOR_CODE_BG = RGBColor(15, 23, 42)   # #0F172A Kod Terminali Koyu Gri

    COLOR_PRIMARY = RGBColor(76, 201, 240) # #4CC9F0 Siber Turkuaz
    COLOR_GOLD = RGBColor(251, 191, 36)    # #FBBF24 Altın Sarısı
    COLOR_GREEN = RGBColor(52, 211, 153)   # #34D399 Nane Yeşili
    COLOR_MAGENTA = RGBColor(247, 37, 133) # #F72585 Magenta

    COLOR_TEXT_WHITE = RGBColor(255, 255, 255)
    COLOR_TEXT_LIGHT = RGBColor(226, 232, 240)
    COLOR_TEXT_MUTED = RGBColor(148, 163, 184)
    COLOR_TEXT_CODE = RGBColor(186, 230, 253)

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.color.rgb = COLOR_BG
        return bg

    def add_header(slide, badge_text, title_text, category_text):
        # Üst Vurgu Çizgisi
        bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.08))
        bar.fill.solid()
        bar.fill.fore_color.rgb = COLOR_PRIMARY
        bar.line.fill.background()

        # Kategori Yazısı
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.35), Inches(8.5), Inches(0.3))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        tf_cat.margin_left = tf_cat.margin_top = tf_cat.margin_right = tf_cat.margin_bottom = 0
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = str(category_text or course_name).upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_PRIMARY
        p_cat.font.name = "Segoe UI"

        # Ana Başlık
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.68), Inches(9.5), Inches(0.6))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        tf_title.margin_left = tf_title.margin_top = tf_title.margin_right = tf_title.margin_bottom = 0
        p_title = tf_title.paragraphs[0]
        p_title.text = str(title_text)[:65]
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_TEXT_WHITE
        p_title.font.name = "Segoe UI"

        # Sağ Rozet
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.5), Inches(0.45), Inches(2.0), Inches(0.45))
        badge.fill.solid()
        badge.fill.fore_color.rgb = COLOR_CARD
        badge.line.color.rgb = COLOR_PRIMARY
        badge.line.width = Pt(1.2)
        tf_b = badge.text_frame
        tf_b.margin_left = tf_b.margin_top = tf_b.margin_right = tf_b.margin_bottom = 0
        p_b = tf_b.paragraphs[0]
        p_b.alignment = PP_ALIGN.CENTER
        p_b.text = str(badge_text or f"HAFTA {week_number}")
        p_b.font.size = Pt(11)
        p_b.font.bold = True
        p_b.font.color.rgb = COLOR_PRIMARY
        p_b.font.name = "Segoe UI"

    def create_card(slide, left, top, width, height, title="", title_color=COLOR_PRIMARY, bg_color=COLOR_CARD, border_color=COLOR_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1)

        if title:
            t_box = slide.shapes.add_textbox(Inches(left + 0.25), Inches(top + 0.2), Inches(width - 0.5), Inches(0.4))
            tf = t_box.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = title_color
            p.font.name = "Segoe UI"

        return card

    slides_list = material_data.get("slides", [])
    topic_text = material_data.get("topic", f"{week_number}. Hafta Dersi")

    # 1. SLAYT: KAPAK
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    top_glow = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.15))
    top_glow.fill.solid()
    top_glow.fill.fore_color.rgb = COLOR_PRIMARY
    top_glow.line.fill.background()

    t_box = s1.shapes.add_textbox(Inches(1.2), Inches(1.5), Inches(10.9), Inches(2.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True

    p0 = tf1.paragraphs[0]
    p0.text = f"{course_name.upper()} • {week_number}. HAFTA DERSİ"
    p0.font.size = Pt(13)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_PRIMARY
    p0.font.name = "Segoe UI"
    p0.space_after = Pt(10)

    p1 = tf1.add_paragraph()
    p1.text = topic_text
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_TEXT_WHITE
    p1.font.name = "Segoe UI"
    p1.space_after = Pt(8)

    p2 = tf1.add_paragraph()
    p2.text = "Kavramsal Mimari, Kod Örnekleri ve Laboratuvar Uygulaması"
    p2.font.size = Pt(17)
    p2.font.color.rgb = COLOR_GOLD
    p2.font.name = "Segoe UI"

    # Kapakta 4 Özet Kartı
    pills = [
        ("📐 Mimari ve Teori", "Temel prensipler ve çalışma mantığı"),
        ("💻 Canlı Kodlama", "Çalıştırılabilir kodlar ve sözdizimi"),
        ("⚡ Atölye Uygulaması", "Bilgisayar başında öğrenci görevi"),
        ("🛡️ Hata Ayıklama", "Sık yapılan hatalar ve ipuçları")
    ]
    for i, (ptitle, pdesc) in enumerate(pills):
        cx = 1.2 + (i * 2.8)
        c = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(cx), Inches(4.2), Inches(2.6), Inches(1.8))
        c.fill.solid()
        c.fill.fore_color.rgb = COLOR_CARD
        c.line.color.rgb = COLOR_PRIMARY if i == 0 else COLOR_BORDER
        c.line.width = Pt(1.2)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_top = Inches(0.2)
        ctf.margin_left = ctf.margin_right = Inches(0.2)
        cp0 = ctf.paragraphs[0]
        cp0.text = ptitle
        cp0.font.size = Pt(13)
        cp0.font.bold = True
        cp0.font.color.rgb = COLOR_PRIMARY
        cp0.font.name = "Segoe UI"
        cp0.space_after = Pt(6)
        cp1 = ctf.add_paragraph()
        cp1.text = pdesc
        cp1.font.size = Pt(10)
        cp1.font.color.rgb = COLOR_TEXT_LIGHT
        cp1.font.name = "Segoe UI"

    foot = s1.shapes.add_textbox(Inches(1.2), Inches(6.5), Inches(10.9), Inches(0.5))
    ftf = foot.text_frame
    fp = ftf.paragraphs[0]
    fp.text = "Torbalı Piri Reis MTAL Bilişim Teknolojileri Alanı | Akıllı Ders ve Laboratuvar Sistemi"
    fp.font.size = Pt(11)
    fp.font.color.rgb = COLOR_TEXT_MUTED
    fp.font.name = "Segoe UI"

    # Diğer Slaytlar
    for s_idx, slide_data in enumerate(slides_list[1:], start=2):
        s = prs.slides.add_slide(blank_layout)
        set_slide_background(s)

        badge = slide_data.get("badge", f"SAYFA {s_idx}")
        stitle = slide_data.get("title", topic_text)
        scat = slide_data.get("category", course_name)
        add_header(s, badge, stitle, scat)

        stype = slide_data.get("slide_type", "theory")
        code_snip = slide_data.get("code_snippet")
        bullets = slide_data.get("bullets", [])

        if code_snip or stype == "code":
            # Sol Taraf: Kod Terminali
            create_card(s, 0.8, 1.4, 6.6, 5.3, "💻 Canlı Kodlama & Terminal", COLOR_PRIMARY, COLOR_CODE_BG)
            c_box = s.shapes.add_textbox(Inches(1.0), Inches(2.0), Inches(6.2), Inches(4.5))
            ctf = c_box.text_frame
            ctf.word_wrap = True
            cp = ctf.paragraphs[0]
            cp.text = code_snip if code_snip else "// Kod örneği inceleniyor..."
            cp.font.size = Pt(10)
            cp.font.name = "Consolas"
            cp.font.color.rgb = COLOR_TEXT_CODE

            # Sağ Taraf: Açıklama Kartı
            create_card(s, 7.6, 1.4, 4.9, 5.3, "📋 Kod Açıklamaları & Kurallar", COLOR_GOLD)
            r_box = s.shapes.add_textbox(Inches(7.8), Inches(2.0), Inches(4.5), Inches(4.5))
            rtf = r_box.text_frame
            rtf.word_wrap = True
            for b_idx, bullet in enumerate(bullets):
                bp = rtf.add_paragraph() if b_idx > 0 else rtf.paragraphs[0]
                bp.text = f"• {bullet}"
                bp.font.size = Pt(12)
                bp.font.color.rgb = COLOR_TEXT_LIGHT
                bp.font.name = "Segoe UI"
                bp.space_after = Pt(8)

        else:
            # İki Kartlı Düzen (Sol ve Sağ Kart)
            mid = len(bullets) // 2
            left_bullets = bullets[:mid] if mid > 0 else bullets
            right_bullets = bullets[mid:] if mid > 0 else []

            create_card(s, 0.8, 1.4, 5.6, 5.3, "📌 Temel Kavramlar & Maddeler", COLOR_PRIMARY)
            l_box = s.shapes.add_textbox(Inches(1.05), Inches(2.0), Inches(5.1), Inches(4.5))
            ltf = l_box.text_frame
            ltf.word_wrap = True
            for b_idx, b in enumerate(left_bullets):
                bp = ltf.add_paragraph() if b_idx > 0 else ltf.paragraphs[0]
                bp.text = f"• {b}"
                bp.font.size = Pt(12.5)
                bp.font.color.rgb = COLOR_TEXT_LIGHT
                bp.font.name = "Segoe UI"
                bp.space_after = Pt(10)

            create_card(s, 6.8, 1.4, 5.7, 5.3, "⚡ Dikkat Edilecek Noktalar & Uygulama", COLOR_GREEN)
            r_box = s.shapes.add_textbox(Inches(7.05), Inches(2.0), Inches(5.2), Inches(4.5))
            rtf = r_box.text_frame
            rtf.word_wrap = True
            if right_bullets:
                for b_idx, b in enumerate(right_bullets):
                    bp = rtf.add_paragraph() if b_idx > 0 else rtf.paragraphs[0]
                    bp.text = f"• {b}"
                    bp.font.size = Pt(12.5)
                    bp.font.color.rgb = COLOR_TEXT_LIGHT
                    bp.font.name = "Segoe UI"
                    bp.space_after = Pt(10)
            else:
                p_extra = rtf.paragraphs[0]
                p_extra.text = "• Laboratuvar ortamında adımları sırayla takip ediniz.\n\n• Kodlarınızı yazdıktan sonra emülatörde veya sunucuda test ediniz.\n\n• Sorularınız için ders esnasında öğretmenden destek alınız."
                p_extra.font.size = Pt(12)
                p_extra.font.color.rgb = COLOR_TEXT_MUTED
                p_extra.font.name = "Segoe UI"

    prs.save(output_path)
    return output_path
