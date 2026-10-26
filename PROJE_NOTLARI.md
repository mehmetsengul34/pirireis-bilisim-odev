# ⚓ Piri Reis Bilişim Ödev ve Takip Portalı — Proje Durumu ve Devam Notları

> **Tarih:** 26 Ekim 2026  
> **GitHub Deposu:** `mehmetsengul34/pirireis-bilisim-odev` (Branch: `main`)  
> **Canlı Yayın (Vercel):** https://pirireis-bilisim-odev.vercel.app | https://ogretmenlerodasi.info  
> **API Sunucusu (Render):** https://pirireis-api.onrender.com

---

## 📌 Son Yapılan Geliştirmeler (26 Ekim 2026)

### 1. Veri Kaybı Sorununun Tespiti ve Kalıcı Çözümü (Verilerin Silinme Sebebi):
- **Sorunun Nedeni:**  
  Render.com ücretsiz (free) katmanında çalışan web servisleri 15 dakika boyunca istek almadığında uyku moduna (spin-down) geçer. Render'ın ücretsiz konteyner diskleri **geçicidir (ephemeral)**. Konteyner her uyandığında veya yeniden başladığında yerel diskteki `lms.db` SQLite veritabanı sıfırlanıyor ve sadece başlangıçtaki varsayılan tohum veriler kalıyordu. Ayrıca backend kodunda Master kullanıcının tüm sınıfları listelemesinde öğretmen filtresi kısıtı vardı.
- **Uygulanan Çözüm:**  
  1. `backend/app/database.py` dosyasına dinamik `DATABASE_URL` (PostgreSQL) desteği eklendi. Bulut ortamında (Render/Supabase/Neon) PostgreSQL bağlantısı otomatik kullanılırken yerelde SQLite ile kesintisiz çalışma sağlandı (`psycopg2-binary` eklendi).
  2. `render.yaml` yapılandırmasına kalıcı Render PostgreSQL veritabanı (`pirireis-db`) eklendi.
  3. `classrooms.py` ve `assignments.py` uç noktalarında Master öğretmen (`pirireis`) için filtreler genişletildi; tüm okuldaki sınıfları ve öğretmenleri eksiksiz görebilmesi ve yönetebilmesi sağlandı.

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
