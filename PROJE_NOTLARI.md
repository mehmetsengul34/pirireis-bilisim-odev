# ⚓ Piri Reis Bilişim Ödev ve Takip Portalı — Proje Durumu ve Devam Notları

> **Tarih:** 27 Ekim 2026  
> **GitHub Deposu:** `mehmetsengul34/pirireis-bilisim-odev` (Branch: `main`)  
> **Canlı Yayın (Vercel):** https://pirireis-bilisim-odev.vercel.app | https://ogretmenlerodasi.info  
> **API Sunucusu (Render):** https://pirireis-api.onrender.com

---

## 📌 Son Yapılan Geliştirmeler (27-28 Ekim 2026)

### 1. Veri Kaybı Sorununun Kök Nedenleri ve Kalıcı Düzeltmeler:
- **Kök Neden 1: Render Ephemeral Container ve Eksik DATABASE_URL:**
  Canlı sunucu (Render `pirireis-api`), `render.yaml` dosyasını Blueprint olarak başlatılmadığı için dikkate almamış ve `DATABASE_URL` ortam değişkeni tanımlı olmadığından kod yerel SQLite (`lms.db`) kullanmaya devam etmiştir. Render ücretsiz katmanı 15 dakika boyunca HTTP isteği almadığında uyku moduna (spin-down) geçer ve konteyner diski geçici (ephemeral) olduğu için her uyandığında boş `lms.db` oluşturur.
- **Kök Neden 2: Kod İçi Tehlikeli Kullanıcı Temizliği:**
  `main.py` dosyasındaki eski tohumlama kodunda `username == "ogretmen"` olan kullanıcının her sunucu açılışında silinip sınıflarının devredildiği tespit edildi ve bu kod güvenli hale getirildi.
- **Kök Neden 3: Master Sınıf Açarken Öğretmen Atama Eksikliği:**
  Master kullanıcı sınıf açarken sorumlu öğretmen seçemiyordu, tüm sınıflar Master'a atanıyordu. Yeni açılan öğretmenler sisteme giriş yaptığında sınıfları göremiyor ve silindi sanıyordu. `ClassroomCreate` şemasına `teacher_id` ve `teacher_name` desteği eklendi.
- **Uygulanan Kalıcı Çözümler:**
  1. **SQLAlchemy 2.0 PostgreSQL Driver ve Bağlantı Çözümü:**
     - `database.py` içinde `DATABASE_URL` hem `postgres://` hem de `postgresql://` için `postgresql+psycopg2://` protokolüne standardize edildi. `psycopg2-binary` kütüphanesiyle tam uyum sağlandı ve `ModuleNotFoundError: No module named 'psycopg'` hatası giderildi.
     - Bulut veritabanına bağlanılamaması veya çevrimdışı çalışma durumunda sistemin çökmesini engelleyen akıllı yerel SQLite (`lms.db`) geri dönüş (fallback) mekanizması entegre edildi.
  2. **Çoklu Öğretmen Ödev ve Notlandırma Yetki Matrisi:**
     - Öğretmenlerin hem bizzat açtıkları ödevleri hem de sorumlu oldukları sınıflara tanımlanan ödevleri eksiksiz görebilmeleri, inceleyebilmeleri ve notlandırabilmeleri sağlandı (`assignments.py` ve `submissions.py`).
  3. **Tek Tıkla Tam Yedekleme & Geri Yükleme (JSON Backup/Restore Engine):**
     - Master paneline `/api/system/backup` ve `/api/system/restore` entegre edildi.
     - Tüm öğretmenler, sınıflar, öğrenciler ve ödevler tek tıkla şifreli JSON formatında bilgisayara indirilebilir veya geri yüklenebilir.
  4. **Veritabanı Sağlık & Kalıcılık Teşhisi:**
     - Master paneline ve `/api/health` uç noktasına aktif veritabanı durumu (PostgreSQL Kalıcı mı yoksa SQLite Geçici mi) canlı rozet olarak eklendi.
  5. **Bağlantı Havuzu (Connection Pool) Optimizasyonu:**
     - `database.py` içine `pool_recycle=300` ve `pool_pre_ping=True` eklenerek Neon, Supabase ve Render bağlantı kopmaları önlendi.

### 2. Karanlık Tema (Dark Mode) Desteği:
- Hem **Öğretmen / Yönetici Paneli** hem de **Öğrenci Portalı** ve **Giriş Ekranı** için eksiksiz karanlık tema geliştirildi.
- Üst gezinti çubuğuna (Navbar) ve Giriş ekranına Güneş / Ay ikonlu hızlı geçiş butonu eklendi.
- Kullanıcının tema tercihi `localStorage` üzerinde saklanmakta ve sistem temasıyla otomatik senkronize olmaktadır.
- Tailwind CSS `darkMode: 'class'` ile tüm kartlar, tablolar, form alanları ve diyalog pencereleri karanlık moda uyarlandı.

### 3. e-Okul PDF Dosyası ile Otomatik Toplu Öğrenci Ekleme:
- Sınıf yönetim modalına **"PDF ile Toplu Öğrenci Ekle (e-Okul)"** sekmesi eklendi.
- Öğretmen e-Okul'dan indirdiği sınıf listesi PDF'ini yüklediğinde:
  - Öğrencilerin **Adı Soyadı** ve **Okul Numarası** `pypdf` kütüphanesiyle otomatik olarak taranır.
  - **Kullanıcı Adı:** `Okul No + Ad` bitişik ve Türkçe karakterlerden arındırılmış küçük harfle oluşturulur (Örn: `1042ahmet`, `583zeynep`).
  - **Standart Şifre:** Otomatik olarak `1234` tanımlanır.
  - Öğrenciler anında sınıfa kaydedilir.
  - Öğretmen için oluşturulan tüm kullanıcı adı ve şifre listesini tek tıkla kopyalama seçeneği sunulur.

---

## 🔑 Varsayılan Giriş Bilgileri

- **Master Öğretmen (Yönetici):** `pirireis` / `20262027`
- **Örnek Öğrenci:** `ogrenci` / `123`
- **PDF ile Eklenen Öğrenciler:** `[OkulNo][Ad]` (Örn: `1042ahmet`) / Standart Şifre: `1234`
