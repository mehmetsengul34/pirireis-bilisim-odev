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

import docx
from docx.shared import Inches as DocxInches, Pt as DocxPt, RGBColor as DocxRGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

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

# ================= 2. DOSYA VE METİN AYRIŞTIRICI (PDF / DOCX / XLSX / TXT) =================

def extract_text_from_file(file_path: str, filename: str) -> Tuple[str, int]:
    """
    Yüklenen PDF, Word (.docx), Excel (.xlsx) veya metin dosyasından temizlenmiş metni ve sayfa sayısını çeker.
    PostgreSQL NUL byte (\x00) ve ikili (binary) karakter hatalarını kesin olarak önler.
    """
    import zipfile
    import xml.etree.ElementTree as ET

    ext = os.path.splitext(filename)[1].lower()
    text = ""
    pages = 1

    if not os.path.exists(file_path):
        return "", 0

    if ext == ".pdf":
        try:
            reader = pypdf.PdfReader(file_path)
            pages = len(reader.pages) or 1
            extracted_parts = []
            for i, p in enumerate(reader.pages):
                try:
                    pt = p.extract_text()
                    if pt:
                        extracted_parts.append(f"--- SAYFA {i+1} ---\n" + pt)
                except Exception:
                    continue
            text = "\n".join(extracted_parts)
        except Exception as err:
            text = f"PDF ayrıştırılırken hata oluştu: {err}"

    elif ext in [".docx", ".docm"]:
        try:
            with zipfile.ZipFile(file_path, "r") as z:
                if "word/document.xml" in z.namelist():
                    xml_content = z.read("word/document.xml")
                    tree = ET.fromstring(xml_content)
                    texts = []
                    for elem in tree.iter():
                        if elem.tag.endswith("}t") and elem.text:
                            texts.append(elem.text)
                        elif elem.tag.endswith("}p"):
                            texts.append("\n")
                    text = "".join(texts)
                    pages = max(1, len(text) // 2500)
        except Exception as err:
            text = f"Word belgesi ayrıştırılırken hata oluştu: {err}"

    elif ext in [".xlsx", ".xlsm"]:
        try:
            with zipfile.ZipFile(file_path, "r") as z:
                texts = []
                # 1. Paylaşılan metinler (sharedStrings)
                if "xl/sharedStrings.xml" in z.namelist():
                    tree = ET.fromstring(z.read("xl/sharedStrings.xml"))
                    for elem in tree.iter():
                        if elem.tag.endswith("}t") and elem.text:
                            texts.append(elem.text)

                # 2. Hücre içerikleri (sheet1.xml vb.)
                for name in z.namelist():
                    if name.startswith("xl/worksheets/sheet") and name.endswith(".xml"):
                        try:
                            stree = ET.fromstring(z.read(name))
                            for selem in stree.iter():
                                if selem.tag.endswith("}v") and selem.text and len(selem.text) > 1:
                                    texts.append(selem.text)
                        except Exception:
                            continue

                text = "\n".join(texts)
                pages = max(1, len(texts) // 40)
        except Exception as err:
            text = f"Excel tablosu ayrıştırılırken hata oluştu: {err}"

    else:
        # Metin tabanlı dosya (txt, csv, json, md)
        for enc in ["utf-8", "utf-8-sig", "cp1254", "iso-8859-9", "latin-1"]:
            try:
                with open(file_path, "r", encoding=enc, errors="ignore") as f:
                    text = f.read()
                break
            except Exception:
                continue

    # KESİN GÜVENLİK: PostgreSQL TEXT/VARCHAR sütunları için NUL (0x00) baytlarını temizle!
    clean_text = text.replace("\x00", "").strip()
    return clean_text, max(1, pages)

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
    },
    "grafik_canlandirma": {
        "name": "Grafik ve Canlandırma",
        "grade_level": "11. Sınıf",
        "description": "Görüntü işleme programları, temel komutlar, boyut ve çözünürlük, katmanlar (layers), filtreler, biçimli yazılar, eylemler (actions) ve web arayüz tasarımı.",
        "weeks": [
            {"week": 1, "topic": "Görüntü İşleme Programlarına Giriş & Kurulum", "outcomes": "Görüntü işleme programlarının kurulumunu yapar, arayüzü tanır.", "dates": "14-18 Eylül"},
            {"week": 2, "topic": "Temel Komutlar & Araç Paleti (Seçme, Kırpma, Yazı, Boyama)", "outcomes": "Temel komutları ve araç çubuğundaki araçları gruplandırır.", "dates": "21-25 Eylül"},
            {"week": 3, "topic": "Boyut ve Çözünürlük Ayarları (DPI, Piksel & Baskı Boyutu)", "outcomes": "Dosya boyutunu ve çözünürlük ayarlarını amaca uygun düzenler.", "dates": "28 Eylül - 2 Ekim"},
            {"week": 4, "topic": "Boyut ve Çözünürlük Uygulamaları & Genel Tekrar", "outcomes": "Görsel boyutlandırma kriterlerini pekiştirir.", "dates": "5-9 Ekim"},
            {"week": 5, "topic": "Seçili Alan Oluşturma & Renk/Ton/Kontrast Ayarları", "outcomes": "Lasso, Marquee ve Magic Wand ile alan seçip ton ve kontrast ayarlar.", "dates": "12-16 Ekim"},
            {"week": 6, "topic": "Katmanlar (Layers) Mimarisi & Katman Özellikleri", "outcomes": "Katman sıralama, bağlama, opaklık ve harmanlama modlarını uygular.", "dates": "19-23 Ekim"},
            {"week": 7, "topic": "Filtreler Galerisi & Görsel Efektler", "outcomes": "Görsellere sanatsal ve dinamik filtre efektleri uygular.", "dates": "26-30 Ekim"},
            {"week": 8, "topic": "Filtreler ile Görsel İyileştirme & Atölye Uygulaması", "outcomes": "Bulanıklaştırma, keskinleştirme ve gürültü giderme işlemlerini yapar.", "dates": "2-6 Kasım"},
            {"week": 9, "topic": "Biçimli Tipografi & Yazı Efektleri Tasarımı", "outcomes": "Tipografik araçlarla afiş ve banner başlıkları tasarlar.", "dates": "9-13 Kasım"},
            {"week": 10, "topic": "Otomasyon & Eylemler (Actions) Paneli", "outcomes": "Tekrarlayan işleri eylemler paneli ile otomatikleştirir.", "dates": "23-27 Kasım"},
            {"week": 11, "topic": "Web Arayüz Tasarımı & Dilimleme (Slice Tool)", "outcomes": "Web arayüz bileşenlerini dilimleyip web formatında dışa aktarır.", "dates": "30 Kasım - 4 Aralık"}
        ]
    }
}

def normalize_turkish(text: str) -> str:
    """Türkçe karakterleri ve büyük/küçük harf varyasyonlarını aramalar için standartlaştırır."""
    if not text:
        return ""
    mapping = {
        'İ': 'i', 'I': 'i', 'ı': 'i', 'i': 'i',
        'Ğ': 'g', 'ğ': 'g',
        'Ü': 'u', 'ü': 'u',
        'Ş': 's', 'ş': 's',
        'Ö': 'o', 'ö': 'o',
        'Ç': 'c', 'ç': 'c',
    }
    res = text
    for tr_char, norm_char in mapping.items():
        res = res.replace(tr_char, norm_char)
    return res.lower()

def detect_course_info_from_plan(filename: str, raw_text: str) -> Dict[str, str]:
    """
    Yüklenen belgenin başlığından veya dosya adından dersin adını, sınıf seviyesini ve yılını tespit eder.
    Örn: 'GRAFİK VE CANLANDIRMA (2026-2027).docx' -> 'Grafik ve Canlandırma' (11. Sınıf)
    """
    detected_name = ""
    grade = "11. Sınıf"
    year = "2026-2027"

    norm_text = normalize_turkish(raw_text or "")
    norm_fn = normalize_turkish(filename or "")

    # 1. Metin veya dosya adı içinde sınıf tespiti
    grade_match = re.search(r'([0-9]{1,2})\s*[\.\-]?\s*sinif', norm_text)
    if grade_match:
        grade = f"{grade_match.group(1)}. Sınıf"
    else:
        fn_grade = re.search(r'([0-9]{1,2})\s*[\.\-]?\s*sinif', norm_fn)
        if fn_grade:
            grade = f"{fn_grade.group(1)}. Sınıf"

    # 2. Metin içinde yıl tespiti
    year_match = re.search(r'(20[2-3][0-9]\s*[-–/]\s*20[2-3][0-9])', raw_text or "")
    if year_match:
        year = year_match.group(1).replace("/", "-").strip()

    # 3. Metin içinde '... DERSİ ÜNİTELENDİRİLMİŞ' veya 'DERSİN ADI: ...' tespiti
    m_course = re.search(
        r'(?:ALANI|DALI)?\s*(?:[0-9]{1,2}\.\s*SINIF)?\s*([A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,50}?)\s*DERS[Iİ]\s*ÜN[Iİ]TELEND[Iİ]R[Iİ]LM[Iİ]',
        raw_text or "",
        re.IGNORECASE
    )
    if m_course:
        raw_detected = m_course.group(1).strip()
        raw_detected = re.sub(r'^(?:YAZILIM GELİŞTİRME|BİLİŞİM TEKNOLOJİLERİ|ALANI|DALI)\s*', '', raw_detected, flags=re.IGNORECASE).strip()
        if len(raw_detected) >= 3:
            detected_name = raw_detected

    if not detected_name:
        m_name = re.search(r'DERS[Iİ]N\s*ADI\s*[:\-–]?\s*([^\n\r]+)', raw_text or "", re.IGNORECASE)
        if m_name:
            candidate = m_name.group(1).strip()
            if len(candidate) >= 3 and len(candidate) <= 60:
                detected_name = candidate

    # 4. Dosya adından ders adı çıkarma
    if not detected_name or len(detected_name) < 3:
        clean_fn = os.path.splitext(filename or "")[0]
        clean_fn = re.sub(r'\(\s*[0-9\-\s/]+\s*\)', '', clean_fn)
        clean_fn = re.sub(r'(?:yıllık|dersi|planı|ünitelendirilmiş|meb|mtal)', '', clean_fn, flags=re.IGNORECASE).strip()
        clean_fn = re.sub(r'^[0-9\.\-\_\s]+', '', clean_fn).strip()
        if len(clean_fn) >= 3:
            detected_name = clean_fn

    # Bilinen anahtar kelimelere göre normalize etme
    norm_detected = normalize_turkish(detected_name)
    if "grafik" in norm_detected and ("canlandir" in norm_detected or "animasyon" in norm_detected or len(norm_detected) < 30):
        final_name = "Grafik ve Canlandırma"
    elif "mobil" in norm_detected or "android" in norm_detected:
        final_name = "Mobil Uygulama Geliştirme (Android Studio & Java)"
    elif "web" in norm_detected:
        final_name = "Web Tabanlı Uygulama Geliştirme (React & JS)"
    elif "nesne" in norm_detected or "python" in norm_detected or "c#" in norm_detected:
        final_name = "Nesne Tabanlı Programlama (C# / Python)"
    elif "robotik" in norm_detected or "kodlama" in norm_detected or "arduino" in norm_detected:
        final_name = "Robotik ve Kodlama"
    elif "veri" in norm_detected and "taban" in norm_detected:
        final_name = "Veri Tabanı Yönetimi (SQL)"
    elif "ag" in norm_detected or "network" in norm_detected or "anahtarlama" in norm_detected:
        final_name = "Ağ Sistemleri ve Yönlendirme"
    elif "siber" in norm_detected or "guvenlik" in norm_detected:
        final_name = "Siber Güvenlik Temelleri"
    elif "yapay" in norm_detected:
        final_name = "Yapay Zeka ve Makine Öğrenmesi"
    elif detected_name:
        words = [w.capitalize() for w in detected_name.strip().split()]
        final_name = " ".join(words) if words else "Bilişim Teknolojileri Dersi"
    else:
        final_name = "Bilişim Teknolojileri Dersi"

    return {
        "name": final_name,
        "grade_level": grade,
        "academic_year": year
    }

def parse_annual_plan_text(raw_text: str, course_name: str = "") -> List[Dict[str, Any]]:
    """
    Öğretmenin yüklediği yıllık plan metnini (PDF/Word/Excel/TXT)
    MEB takvim tarihleri ve ünite tabloları üzerinden hafta hafta analiz eder.
    """
    if not raw_text or len(raw_text.strip()) < 50:
        lower_c = course_name.lower()
        if "grafik" in lower_c:
            base = STARTER_CURRICULUMS["grafik_canlandirma"]["weeks"]
            return pad_weeks_to_36(base, "Grafik ve Canlandırma")
        elif "mobil" in lower_c or "android" in lower_c:
            return STARTER_CURRICULUMS["mobil_uygulama"]["weeks"]
        elif "web" in lower_c:
            base = STARTER_CURRICULUMS["web_programlama"]["weeks"]
            return pad_weeks_to_36(base, "Web Tabanlı Uygulama")
        elif "nesne" in lower_c:
            base = STARTER_CURRICULUMS["nesne_tabanli"]["weeks"]
            return pad_weeks_to_36(base, "Nesne Tabanlı Programlama")
        else:
            return STARTER_CURRICULUMS["mobil_uygulama"]["weeks"]

    lines = [l.strip() for l in raw_text.splitlines() if l.strip()]

    # 1. YÖNTEM: MEB Tablo Tarih Blokları (Örn: 14-18 Eylül, 21-25 Eylül, 2-6 Kasım...)
    date_regex = re.compile(
        r'^\s*(\d{1,2}\s*[\-–]\s*\d{1,2}\s+(?:Eylül|Ekim|Kasım|Aralık|Ocak|Şubat|Mart|Nisan|Mayıs|Haziran)'
        r'(?:\s*[\-–]\s*\d{1,2}\s+(?:Eylül|Ekim|Kasım|Aralık|Ocak|Şubat|Mart|Nisan|Mayıs|Haziran))?)\s*$',
        re.IGNORECASE
    )

    date_matches = []
    for idx, line in enumerate(lines):
        if date_regex.match(line):
            date_matches.append((idx, line))

    if len(date_matches) >= 8:
        table_weeks = []
        for i in range(len(date_matches)):
            start_idx, date_str = date_matches[i]
            end_idx = date_matches[i + 1][0] if i + 1 < len(date_matches) else min(len(lines), start_idx + 12)
            block = lines[start_idx + 1:end_idx]

            topic_cand = ""
            outcome_cand = ""
            for bline in block:
                if bline.isdigit() and len(bline) <= 2:
                    continue
                if re.search(r'(?:[0-9]\.[0-9]|öğrenme birimi|ünite|konu)', bline, re.IGNORECASE):
                    if not topic_cand:
                        topic_cand = bline
                elif re.search(r'(?:yapar|açıklar|uygular|kodlar|gruplandırır|düzenler|hazırlar|belirler|tanımlar|kazanım)', bline, re.IGNORECASE):
                    if not outcome_cand:
                        outcome_cand = bline
                elif not topic_cand and len(bline) > 10 and not re.search(r'(?:anlatım|soru-cevap|bilgisayar|projeksiyon)', bline, re.IGNORECASE):
                    topic_cand = bline

            if not topic_cand and outcome_cand:
                topic_cand = outcome_cand
            elif not topic_cand:
                topic_cand = f"{i + 1}. Hafta Bilişim ve Uygulama Konusu"

            topic_cand = re.sub(r'^[0-9\.\-\s]+', '', topic_cand).strip()[:120]
            if not outcome_cand:
                outcome_cand = f"{i + 1}. Hafta ({date_str}) MEB kazanım ve öğrenme hedefleri."

            table_weeks.append({
                "week": i + 1,
                "topic": topic_cand,
                "outcomes": outcome_cand[:200],
                "dates": date_str
            })

        if len(table_weeks) >= 8:
            return pad_weeks_to_36(table_weeks, course_name or "Bilişim Teknolojileri")

    # 2. YÖNTEM: "Hafta 1", "1. Hafta" Regex Taraması
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
                topic = re.sub(r'^(?:Konu|Ünite|Kazanım)\s*[:\-–]?\s*', '', topic, flags=re.IGNORECASE)
                parsed_weeks.append({
                    "week": w_num,
                    "topic": topic[:120] if topic else f"{w_num}. Hafta Bilişim Konusu",
                    "outcomes": f"{w_num}. Hafta MEB Bilişim ders kazanımları ve uygulama hedefleri."
                })
        except Exception:
            continue

    if len(parsed_weeks) >= 8:
        parsed_weeks.sort(key=lambda x: x["week"])
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
                                fallback_mat = generate_procedural_bilisim_material(course_name, grade_level, week_number, topic, outcomes)
                                if not parsed.get("unit_questions"):
                                    parsed["unit_questions"] = fallback_mat.get("unit_questions", [])
                                if not parsed.get("daily_plan"):
                                    parsed["daily_plan"] = fallback_mat.get("daily_plan", {})
                                if isinstance(parsed.get("teaching_guide"), dict):
                                    if not parsed["teaching_guide"].get("daily_plan"):
                                        parsed["teaching_guide"]["daily_plan"] = parsed.get("daily_plan")
                                    if not parsed["teaching_guide"].get("unit_questions"):
                                        parsed["teaching_guide"]["unit_questions"] = parsed.get("unit_questions")
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
    is_graphic = "grafik" in course_name.lower() or "canlandir" in course_name.lower() or "tasarim" in course_name.lower() or "photoshop" in course_name.lower()
    is_mobile = "mobil" in course_name.lower() or "android" in course_name.lower() or "flutter" in course_name.lower()
    is_web = "web" in course_name.lower() or "tasarım" in course_name.lower() or "html" in course_name.lower() or "react" in course_name.lower() or "javascript" in course_name.lower()

    if is_graphic:
        lang = "tasarim_grafik"
        sample_code_1 = f"""// 1. ADIM: Katman Hazırlığı ve Akıllı Nesneye (Smart Object) Dönüştürme
// - Görseli çalışma alanına aktarın (Dosya -> Aç veya Ctrl+O).
// - Arka Plan (Background) katmanının kilit ikonuna tıklayarak 'Katman 0' yapın.
// - Katmana sağ tıklayın ve 'Convert to Smart Object' (Akıllı Nesne) seçeneğini işaretleyin.
//   (Böylece pikseller bozulmaz ve filtreler sonradan düzenlenebilir 'Akıllı Filtre' kalır).
// - Araç Çubuğundan 'Quick Selection Tool' (Hızlı Seçim Aracı - W) veya 'Pen Tool' (P) seçin.
// - '{topic}' sınırlarını hassas şekilde belirleyin."""

        sample_code_2 = f"""// 2. ADIM: Ton, Kontrast Histogram Dengeleme ve Katman Maskeleme
// - Menü Çubuğundan: Layer -> New Adjustment Layer -> Curves (Eğriler) seçin.
// - RGB Eğrisinde hafif bir 'S-Eğrisi' oluşturarak açık tonları parlatıp gölgeleri derinleştirin.
// - Menü: Layer -> New Adjustment Layer -> Levels (Düzeyler) ile histogramın sol ve sağ uçlarını kırpma sınırına yaklaştırın.
// - Seçili alana Katman Maskesi (Layer Mask) ekleyin.
// - Siyah yumuşak uçlu fırça (B) ile istenmeyen kenarları silin; beyaz fırça ile eksik alanları geri getirin.
// - Feather: 1.5 px yumuşatma vererek kompozisyonu sonlandırın."""

        unit_questions = [
            {
                "question": "1. Photoshop ve grafik yazılımlarında 'Akıllı Nesne' (Smart Object) kullanmanın tahribatsız düzenleme (non-destructive editing) açısından faydası nedir?",
                "answer": "Cevap: Akıllı nesneler orijinal piksel ve çözünürlük verisini güvenle saklar. Görsel defalarca küçültülüp büyütüldüğünde veya filtrelere maruz kaldığında pikselleşme ve kalite kaybı yaşanmaz. Tüm filtreler istenildiği an değiştirilebilir 'Akıllı Filtre' olarak kalır."
            },
            {
                "question": "2. Seçili bir alanda kenar yumuşatma (Feather) ve sınır genişletme (Expand/Contract) işlemlerinin amacı nedir?",
                "answer": "Cevap: Feather, seçili alanın kenar piksellerini arka planla kademeli olarak harmanlar. Kenarlardaki sert ve testere dişli yapay geçişleri engeller; montajın doğal görünmesini sağlar."
            },
            {
                "question": "3. Dijital canlandırma ve ekran sunumlarında görsel renk modu neden CMYK yerine RGB olmalıdır?",
                "answer": "Cevap: RGB ışık temelli bir renk uzayıdır; monitörler, mobil ekranlar ve projeksiyon cihazları doğrudan kırmızı, yeşil, mavi ışık kombinasyonuyla görüntü üretir. CMYK matbaa baskı pigmentleri içindir ve ekranda soluk/mat renk hatalarına yol açar."
            }
        ]
    elif is_mobile:
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

        unit_questions = [
            {
                "question": "1. Android Activity yaşam döngüsünde onCreate(), onPause() ve onResume() metotlarının görevleri nelerdir?",
                "answer": "Cevap: onCreate() Activity ilk açıldığında arayüzü ve değişkenleri bağlar. onPause() kullanıcı başka bir pencereye geçtiğinde çalışarak sistem kaynaklarını korur. onResume() ise Activity tekrar ön plana geldiğinde kullanıcı etkileşimini sürdürür."
            },
            {
                "question": "2. Android'de Explicit (Belirgin) Intent ile Implicit (Örtük) Intent arasındaki fark nedir?",
                "answer": "Cevap: Explicit Intent, uygulama içerisindeki belirli bir Activity sınıfını doğrudan açar. Implicit Intent ise sistemdeki diğer uygulamaları (Harita, Kamera, Tarayıcı) tetiklemek için bir eylem (Action) bildirir."
            },
            {
                "question": "3. UI Thread (Ana İş Parçacığı) üzerinde ağır veritabanı veya ağ işlemleri yürütülürse ne olur?",
                "answer": "Cevap: Arayüz kilitlenir ve sistem 5 saniye içinde ANR (Application Not Responding) hatası vererek uygulamayı zorla kapatır. Ağ ve veritabanı sorguları arka plan thread'lerinde (Coroutine/Thread) çalıştırılmalıdır."
            }
        ]
    elif is_web:
        lang = "javascript"
        sample_code_1 = """// 1. DOM Elementlerini Seçme ve Başlatma
const loginForm = document.querySelector('#loginForm');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const statusBox = document.querySelector('#statusMessage');"""
        sample_code_2 = r"""// 2. Form Gönderme Olayı ve E-posta Kontrolü
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

        unit_questions = [
            {
                "question": "1. DOM nedir ve form işlemlerinde e.preventDefault() çağrısının temel amacı nedir?",
                "answer": "Cevap: DOM (Document Object Model), HTML sayfasının nesne tabanlı yapısıdır. e.preventDefault(), form submit edildiğinde tarayıcının sayfayı yeniden yüklemesini engeller; böylece veriler kesintisiz olarak JavaScript ile işlenir."
            },
            {
                "question": "2. Modern web tasarımlarında CSS Flexbox ile CSS Grid arasındaki temel kullanım farkı nedir?",
                "answer": "Cevap: Flexbox tek boyutlu (satır VEYA sütun) akışlar ve hizalamalar için idealdir. CSS Grid ise iki boyutlu (satırlar VE sütunlar birlikte) karmaşık şablon yerleşimleri için kullanılır."
            },
            {
                "question": "3. Asenkron JavaScript (Fetch / Async-Await) işlemlerinde try-catch bloklarının kullanılmasının önemi nedir?",
                "answer": "Cevap: Sunucudan yanıt gelmediğinde veya HTTP 500/404 hatası döndüğünde uygulamanın çökmesini engeller; kullanıcıya hatayı nezaketle bildirerek güvenli akış sağlar."
            }
        ]
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

        unit_questions = [
            {
                "question": "1. Kapsülleme (Encapsulation) ilkesi nedir ve Private değişkenlere Public Property ile erişmenin temel nedeni nedir?",
                "answer": "Cevap: Kapsülleme, nesnenin iç verilerini dış müdahalelerden korur. Property blokları ile verilere erişirken değer doğrulaması (validation) yapılır ve tutarsız veri girişleri önlenir."
            },
            {
                "question": "2. Kalıtım (Inheritance) ve Polimorfizm (Çok Biçimlilik) nesne tabanlı projelerde kod tekrarını nasıl önler?",
                "answer": "Cevap: Ortak özellik ve metotlar tek bir ata sınıfta tanımlanır. Alt sınıflar bu metotları miras alarak gerektiğinde 'override' eder; böylece aynı kod blokları tekrar yazılmaz."
            },
            {
                "question": "3. Bellek yönetiminde Değer Tipleri (Stack) ile Referans Tipleri (Heap) arasındaki fark nedir?",
                "answer": "Cevap: Değer tipleri (int, bool, struct) Stack bellekte saklanır ve hızlıdır. Referans tipleri (class, string, array) ise asıl veriyi Heap'te saklar ve Stack'te yalnızca adres referansı tutar."
            }
        ]

    daily_plan = {
        "duration_min": 80,
        "school_name": "T.C. Millî Eğitim Bakanlığı - Torbalı Piri Reis MTAL",
        "area_field": "Bilişim Teknolojileri Alanı / Yazılım Geliştirme",
        "course_name": course_name,
        "grade_level": grade_level,
        "week_number": week_number,
        "learning_unit": f"{week_number}. Öğrenme Birimi",
        "topic": topic,
        "learning_outcomes": [
            f"Öğrenci {topic} konusunun temel kuramsal ilkelerini ve işlevini açıklar.",
            f"Geliştirme / tasarım ortamında {topic} kazanımlarına uygun adımları hatasız uygular.",
            "Kullanıcı etkileşimlerini, bileşen sınırlarını ve veri akışını doğru yapılandırır.",
            "Yaygın sözdizimi, mantık veya tasarım hatalarını bağımsız olarak ayıklar ve giderir."
        ],
        "methods_techniques": "Anlatım, Projeksiyon ile Canlı Kodlama/Tasarım Gösterimi, Bireysel Laboratuvar Çalışması, Problem Çözme, Soru-Cevap.",
        "tools_materials": "Bilişim Teknolojileri Laboratuvarı, Bilgisayarlar, Projeksiyon / Akıllı Tahta, Geliştirme Ortamı (IDE) / Tasarım Yazılımı, MEB Bilişim Ders Modülü, Yıllık Plan.",
        "process": {
            "attention_motivation": f"Gerçek hayat sektör projelerinden '{topic}' ile ilgili çarpıcı bir problem veya örnek sunularak öğrencilerin derse dikkati çekilir.",
            "instruction_presentation": f"Öğretmen projeksiyondan '{topic}' konusunun teorik mimarisini, sözdizimi ve çalışma kurallarını canlı olarak açıklar.",
            "application_practice": f"Tüm öğrenciler laboratuvarda kendi bilgisayarlarında '{topic}' uygulamasını birebir kodlar/tasarlar. Öğretmen bilgisayarlar arasında dolaşarak takılan öğrencilere rehberlik eder.",
            "evaluation_summary": f"Dersin kazanımları özetlenir, öğrenci çalışmaları incelenir ve MEB modülü ünite sonu değerlendirme soruları çözülerek pekiştirme sağlanır."
        },
        "topic_example": {
            "title": f"Haftanın Kazanım Örneği: {topic}",
            "scenario": f"Torbalı Piri Reis MTAL laboratuvarında '{topic}' kazanımlarını pekiştiren fonksiyonel çalışma.",
            "language": lang,
            "code_or_steps": sample_code_1 + "\n\n" + sample_code_2,
            "pedagogical_explanation": "Kazanımlara dayalı adım adım uygulama izahatı ve çalışma mantığı.",
            "common_pitfalls": "Öğrencilerin dikkat etmesi gereken kritik hata noktaları ve çözümleri."
        },
        "unit_questions": unit_questions
    }

    return {
        "topic": topic,
        "daily_plan": daily_plan,
        "unit_questions": unit_questions,
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
            "teacher_tips": "Öğretmene Tavsiye: Öğrencilerin en sık karşılaştığı yazım hatalarına ve kütüphane import eksikliklerine dersin başında özellikle vurgu yapınız.",
            "daily_plan": daily_plan,
            "unit_questions": unit_questions
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

# ================= 7. GÜNLÜK DERS PLANI VE KONU ÖRNEĞİ (.DOCX) MOTORU =================

def set_cell_background(cell, fill_hex: str):
    """Word tablosu hücresine arka plan rengi verir."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def build_docx_daily_plan(
    material_data: Dict[str, Any],
    course_name: str,
    grade_level: str,
    week_number: int,
    output_path: str
) -> str:
    """
    Seçilen haftanın ders içeriğini resmî MEB Günlük Ders Planı standardında
    şık, profesyonel bir Microsoft Word (.docx) belgesi olarak üretir.
    """
    doc = docx.Document()

    for section in doc.sections:
        section.top_margin = DocxInches(0.75)
        section.bottom_margin = DocxInches(0.75)
        section.left_margin = DocxInches(0.8)
        section.right_margin = DocxInches(0.8)

    topic = material_data.get("topic", f"{week_number}. Hafta Konusu")
    outcomes = material_data.get("learning_outcomes", [])
    if isinstance(outcomes, str):
        try:
            outcomes = json.loads(outcomes)
        except Exception:
            outcomes = [outcomes]

    guide = material_data.get("teaching_guide", {})
    if isinstance(guide, str):
        try:
            guide = json.loads(guide)
        except Exception:
            guide = {}

    daily_plan = guide.get("daily_plan") or material_data.get("daily_plan") or {}
    code_examples = material_data.get("code_examples", [])
    if isinstance(code_examples, str):
        try:
            code_examples = json.loads(code_examples)
        except Exception:
            code_examples = []

    unit_questions = material_data.get("unit_questions") or guide.get("unit_questions") or []
    if isinstance(unit_questions, str):
        try:
            unit_questions = json.loads(unit_questions)
        except Exception:
            unit_questions = []

    # 1. Başlık Alanı
    header_p = doc.add_paragraph()
    header_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hr1 = header_p.add_run("T.C.\nMİLLÎ EĞİTİM BAKANLIĞI\n")
    hr1.font.bold = True
    hr1.font.size = DocxPt(11)
    hr1.font.color.rgb = DocxRGBColor(71, 85, 105)

    hr2 = header_p.add_run("TORBALI PİRİ REİS MESLEKİ VE TEKNİK ANADOLU LİSESİ\n")
    hr2.font.bold = True
    hr2.font.size = DocxPt(12)
    hr2.font.color.rgb = DocxRGBColor(15, 23, 42)

    hr3 = header_p.add_run("BİLİŞİM TEKNOLOJİLERİ ALANI GÜNLÜK DERS PLANI\n")
    hr3.font.bold = True
    hr3.font.size = DocxPt(13)
    hr3.font.color.rgb = DocxRGBColor(14, 116, 144)

    # 2. Ders Bilgileri Tablosu
    info_table = doc.add_table(rows=4, cols=4)
    info_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    info_table.autofit = False

    labels = [
        [("Dersin Adı:", course_name), ("Sınıf Seviyesi:", grade_level)],
        [("Eğitim Yılı:", "2026-2027"), ("Dersin Süresi:", "80 Dakika (2 Ders Saati)")],
        [("Alan / Dal:", "Bilişim Teknolojileri / Yazılım"), ("Ders Haftası:", f"{week_number}. Hafta")],
        [("Öğrenme Birimi:", topic), ("Konu Başlığı:", topic)]
    ]

    for row_idx, row_data in enumerate(labels):
        col_offset = 0
        for label_text, val_text in row_data:
            c_lbl = info_table.rows[row_idx].cells[col_offset]
            c_val = info_table.rows[row_idx].cells[col_offset + 1]
            set_cell_background(c_lbl, "F1F5F9")

            p_lbl = c_lbl.paragraphs[0]
            r_l = p_lbl.add_run(label_text)
            r_l.font.bold = True
            r_l.font.size = DocxPt(9.5)
            r_l.font.color.rgb = DocxRGBColor(30, 41, 59)

            p_val = c_val.paragraphs[0]
            r_v = p_val.add_run(str(val_text))
            r_v.font.size = DocxPt(9.5)
            r_v.font.color.rgb = DocxRGBColor(15, 23, 42)

            col_offset += 2

    doc.add_paragraph()

    # Bölüm 1: MEB Kazanımları
    h1 = doc.add_heading("I. MEB DERS KAZANIMLARI VE ÖĞRENME HEDEFLERİ", level=2)
    h1.paragraph_format.space_before = DocxPt(8)
    h1.paragraph_format.space_after = DocxPt(4)
    for out in outcomes:
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = DocxPt(3)
        r = p.add_run(str(out))
        r.font.size = DocxPt(10)

    # Bölüm 2: Yöntem, Teknik, Araç ve Gereçler
    h2 = doc.add_heading("II. YÖNTEM, TEKNİK, ARAÇ VE GEREÇLER", level=2)
    h2.paragraph_format.space_before = DocxPt(8)
    h2.paragraph_format.space_after = DocxPt(4)
    p_methods = doc.add_paragraph()
    r_m_title = p_methods.add_run("• Kullanılan Yöntem ve Teknikler: ")
    r_m_title.font.bold = True
    r_m_title.font.size = DocxPt(10)
    r_m_body = p_methods.add_run(daily_plan.get("methods_techniques", "Anlatım, Projeksiyon ile Canlı Kodlama/Uygulama Gösterimi, Bireysel Bilgisayar Uygulaması, Problem Çözme, Soru-Cevap."))
    r_m_body.font.size = DocxPt(10)

    p_tools = doc.add_paragraph()
    r_t_title = p_tools.add_run("• Araç ve Gereçler: ")
    r_t_title.font.bold = True
    r_t_title.font.size = DocxPt(10)
    r_t_body = p_tools.add_run(daily_plan.get("tools_materials", "Bilişim Teknolojileri Laboratuvarı, Bilgisayarlar, Projeksiyon / Akıllı Tahta, Entegre Geliştirme Ortamı (IDE) / Tasarım Yazılımı, MEB Bilişim Ders Modülü, Yıllık Müfredat Planı."))
    r_t_body.font.size = DocxPt(10)

    # Bölüm 3: Dersin İşlenişi ve Pedagojik Süreç (80 Dk)
    h3 = doc.add_heading("III. DERSİN İŞLENİŞİ VE PEDAGOJİK SÜREÇ (80 DAKİKA)", level=2)
    h3.paragraph_format.space_before = DocxPt(8)
    h3.paragraph_format.space_after = DocxPt(4)

    proc = daily_plan.get("process", {})
    steps = [
        ("1. Dikkati Çekme ve Güdüleme (10 Dk)", proc.get("attention_motivation", f"Gerçek hayat sektör yazılımlarından ve bilişim dünyasından '{topic}' ile ilgili çarpıcı bir problem/örnek sunularak öğrencilerin ilgisi çekilir.")),
        ("2. Keşfetme & Projeksiyon Anlatımı (20 Dk)", proc.get("instruction_presentation", f"Öğretmen projeksiyonda '{topic}' konusunun teorik ilkelerini, sözdizimi kurallarını ve çalışma mantığını canlı gösterimle adım adım açıklar.")),
        ("3. Derinleşme & Bilgisayar Uygulaması (35 Dk)", proc.get("application_practice", f"Tüm öğrenciler laboratuvarda kendi bilgisayarlarında verilen görevi birebir kodlar/tasarlar. Öğretmen bilgisayarlar arasında dolaşarak takılan öğrencilere bireysel rehberlik sağlar.")),
        ("4. Değerlendirme & Gelecek Haftaya Bakış (15 Dk)", proc.get("evaluation_summary", f"Dersin kazanımları sınıfça özetlenir, öğrenci çalışmaları incelenir ve modül ünite sonu değerlendirme soruları çözülerek pekiştirme sağlanır."))
    ]

    for st_title, st_desc in steps:
        p = doc.add_paragraph()
        p.paragraph_format.space_after = DocxPt(4)
        r_st = p.add_run(f"• {st_title}: ")
        r_st.font.bold = True
        r_st.font.size = DocxPt(10)
        r_st.font.color.rgb = DocxRGBColor(15, 23, 42)
        r_desc = p.add_run(st_desc)
        r_desc.font.size = DocxPt(9.5)

    # Bölüm 4: Haftanın Kazanım Odaklı Çalışır Konu Örneği
    h4 = doc.add_heading("IV. HAFTANIN KAZANIM ODAKLI ÇALIŞIR KONU ÖRNEĞİ", level=2)
    h4.paragraph_format.space_before = DocxPt(8)
    h4.paragraph_format.space_after = DocxPt(4)

    if code_examples:
        for ex in code_examples:
            p_ex_title = doc.add_paragraph()
            r_ex_t = p_ex_title.add_run(ex.get("title", f"Konu Örneği: {topic}"))
            r_ex_t.font.bold = True
            r_ex_t.font.size = DocxPt(10.5)
            r_ex_t.font.color.rgb = DocxRGBColor(14, 116, 144)

            code_text = ex.get("code", "")
            if code_text:
                tbl_code = doc.add_table(rows=1, cols=1)
                tbl_code.alignment = WD_TABLE_ALIGNMENT.CENTER
                set_cell_background(tbl_code.rows[0].cells[0], "F8FAFC")
                p_c = tbl_code.rows[0].cells[0].paragraphs[0]
                p_c.paragraph_format.space_before = DocxPt(3)
                p_c.paragraph_format.space_after = DocxPt(3)
                r_c = p_c.add_run(code_text)
                r_c.font.name = "Consolas"
                r_c.font.size = DocxPt(8.5)
                r_c.font.color.rgb = DocxRGBColor(30, 41, 59)

            if ex.get("explanation"):
                p_exp = doc.add_paragraph()
                r_exp_lbl = p_exp.add_run("Pedagojik İnceleme: ")
                r_exp_lbl.font.bold = True
                r_exp_lbl.font.size = DocxPt(9.5)
                r_exp = p_exp.add_run(ex.get("explanation"))
                r_exp.font.size = DocxPt(9.5)

            if ex.get("common_mistakes"):
                p_mst = doc.add_paragraph()
                r_mst_lbl = p_mst.add_run("Sık Yapılan Hatalar & Çözüm: ")
                r_mst_lbl.font.bold = True
                r_mst_lbl.font.size = DocxPt(9.5)
                r_mst_lbl.font.color.rgb = DocxRGBColor(220, 38, 38)
                r_mst = p_mst.add_run(ex.get("common_mistakes"))
                r_mst.font.size = DocxPt(9.5)

    # Bölüm 5: Modül Ünite Sonu Soruları ve Cevapları
    h5 = doc.add_heading("V. MEB DERS MODÜLÜ ÜNİTE SONU DEĞERLENDİRME SORULARI VE ÇÖZÜMLERİ", level=2)
    h5.paragraph_format.space_before = DocxPt(8)
    h5.paragraph_format.space_after = DocxPt(4)

    if unit_questions:
        for q_idx, uq in enumerate(unit_questions, start=1):
            q_txt = uq.get("question", f"Soru {q_idx}")
            a_txt = uq.get("answer", "Çözüm ve açıklama...")

            tbl_q = doc.add_table(rows=2, cols=1)
            tbl_q.alignment = WD_TABLE_ALIGNMENT.CENTER
            set_cell_background(tbl_q.rows[0].cells[0], "F1F5F9")
            set_cell_background(tbl_q.rows[1].cells[0], "FFFFFF")

            pq = tbl_q.rows[0].cells[0].paragraphs[0]
            rq = pq.add_run(f"❓ {q_txt}")
            rq.font.bold = True
            rq.font.size = DocxPt(9.5)
            rq.font.color.rgb = DocxRGBColor(15, 23, 42)

            pa = tbl_q.rows[1].cells[0].paragraphs[0]
            ra_lbl = pa.add_run("✓ Cevap / Çözüm: ")
            ra_lbl.font.bold = True
            ra_lbl.font.size = DocxPt(9.5)
            ra_lbl.font.color.rgb = DocxRGBColor(16, 185, 129)
            ra = pa.add_run(a_txt)
            ra.font.size = DocxPt(9.5)
            ra.font.color.rgb = DocxRGBColor(30, 41, 59)

            doc.add_paragraph()

    # Bölüm 6: İmza ve Onay Alanı
    doc.add_paragraph()
    sig_table = doc.add_table(rows=3, cols=2)
    sig_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    sig_table.rows[0].cells[0].paragraphs[0].add_run("Ders Öğretmeni").font.bold = True
    sig_table.rows[0].cells[0].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    sig_table.rows[0].cells[1].paragraphs[0].add_run("Bilişim Teknolojileri Alan Şefi").font.bold = True
    sig_table.rows[0].cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

    sig_table.rows[1].cells[0].paragraphs[0].add_run("İmza: .......................................").alignment = WD_ALIGN_PARAGRAPH.CENTER
    sig_table.rows[1].cells[1].paragraphs[0].add_run("UYGUNDUR / İmza: .......................................").alignment = WD_ALIGN_PARAGRAPH.CENTER

    sig_table.rows[2].cells[0].paragraphs[0].add_run("Tarih: ..... / ..... / 2026").alignment = WD_ALIGN_PARAGRAPH.CENTER
    sig_table.rows[2].cells[1].paragraphs[0].add_run("Tarih: ..... / ..... / 2026").alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.save(output_path)
    return output_path

def build_docx_topic_example(
    material_data: Dict[str, Any],
    course_name: str,
    grade_level: str,
    week_number: int,
    output_path: str
) -> str:
    """
    Seçilen haftanın kazanım odaklı konu örneği, çalışır kodları ve modül ünite sonu sorularını
    öğretmen ve öğrencilerin doğrudan indirip inceleyebileceği Word (.docx) belgesi olarak üretir.
    """
    doc = docx.Document()

    for section in doc.sections:
        section.top_margin = DocxInches(0.75)
        section.bottom_margin = DocxInches(0.75)
        section.left_margin = DocxInches(0.8)
        section.right_margin = DocxInches(0.8)

    topic = material_data.get("topic", f"{week_number}. Hafta Konusu")
    outcomes = material_data.get("learning_outcomes", [])
    if isinstance(outcomes, str):
        try:
            outcomes = json.loads(outcomes)
        except Exception:
            outcomes = [outcomes]

    code_examples = material_data.get("code_examples", [])
    if isinstance(code_examples, str):
        try:
            code_examples = json.loads(code_examples)
        except Exception:
            code_examples = []

    guide = material_data.get("teaching_guide", {})
    if isinstance(guide, str):
        try:
            guide = json.loads(guide)
        except Exception:
            guide = {}

    unit_questions = material_data.get("unit_questions") or guide.get("unit_questions") or []
    if isinstance(unit_questions, str):
        try:
            unit_questions = json.loads(unit_questions)
        except Exception:
            unit_questions = []

    # Başlık
    hp = doc.add_paragraph()
    hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    hr1 = hp.add_run("TORBALI PİRİ REİS MESLEKİ VE TEKNİK ANADOLU LİSESİ\nBİLİŞİM TEKNOLOJİLERİ ALANI\n")
    hr1.font.bold = True
    hr1.font.size = DocxPt(11)
    hr1.font.color.rgb = DocxRGBColor(71, 85, 105)

    hr2 = hp.add_run(f"{course_name.upper()}\n{week_number}. HAFTA KONU ANLATIMI, ÇALIŞIR ÖRNEKLER VE MODÜL SORU ÇÖZÜMLERİ\n")
    hr2.font.bold = True
    hr2.font.size = DocxPt(13)
    hr2.font.color.rgb = DocxRGBColor(14, 116, 144)

    # 1. Konu ve Kazanımlar
    doc.add_heading("📌 Haftanın Konusu ve MEB Kazanımları", level=2)
    p_top = doc.add_paragraph()
    r_tp = p_top.add_run(f"Konu: {topic} ({grade_level})")
    r_tp.font.bold = True
    r_tp.font.size = DocxPt(10.5)

    for out in outcomes:
        p = doc.add_paragraph(style='List Bullet')
        p.add_run(str(out)).font.size = DocxPt(10)

    # 2. Çalışır Kod ve Uygulama Örnekleri
    doc.add_heading("💻 Kazanım Odaklı Çalışır Kod ve Uygulama Örnekleri", level=2)
    for ex in code_examples:
        p_t = doc.add_paragraph()
        r_t = p_t.add_run(ex.get("title", "Konu Örneği"))
        r_t.font.bold = True
        r_t.font.size = DocxPt(11)
        r_t.font.color.rgb = DocxRGBColor(14, 116, 144)

        code_text = ex.get("code", "")
        if code_text:
            tbl_c = doc.add_table(rows=1, cols=1)
            tbl_c.alignment = WD_TABLE_ALIGNMENT.CENTER
            set_cell_background(tbl_c.rows[0].cells[0], "F8FAFC")
            pc = tbl_c.rows[0].cells[0].paragraphs[0]
            rc = pc.add_run(code_text)
            rc.font.name = "Consolas"
            rc.font.size = DocxPt(9)

        if ex.get("explanation"):
            pe = doc.add_paragraph()
            pe.add_run("Açıklama: ").font.bold = True
            pe.add_run(ex.get("explanation")).font.size = DocxPt(9.5)

        if ex.get("common_mistakes"):
            pm = doc.add_paragraph()
            pm.add_run("Dikkat Edilecek Noktalar: ").font.bold = True
            pm.add_run(ex.get("common_mistakes")).font.size = DocxPt(9.5)

    # 3. Modül Ünite Sonu Değerlendirme Soruları ve Çözümleri
    doc.add_heading("📝 MEB Ders Modülü Ünite Sonu Soruları ve Çözümleri", level=2)
    for q_idx, uq in enumerate(unit_questions, start=1):
        q_txt = uq.get("question", f"Soru {q_idx}")
        a_txt = uq.get("answer", "Cevap...")

        tbl_q = doc.add_table(rows=2, cols=1)
        tbl_q.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_cell_background(tbl_q.rows[0].cells[0], "F1F5F9")
        set_cell_background(tbl_q.rows[1].cells[0], "FFFFFF")

        pq = tbl_q.rows[0].cells[0].paragraphs[0]
        rq = pq.add_run(f"Soru {q_idx}: {q_txt}")
        rq.font.bold = True
        rq.font.size = DocxPt(10)

        pa = tbl_q.rows[1].cells[0].paragraphs[0]
        ra_lbl = pa.add_run("Çözüm & Cevap: ")
        ra_lbl.font.bold = True
        ra_lbl.font.size = DocxPt(9.5)
        ra_lbl.font.color.rgb = DocxRGBColor(16, 185, 129)
        pa.add_run(a_txt).font.size = DocxPt(9.5)

        doc.add_paragraph()

    doc.save(output_path)
    return output_path
