# Torbalı Piri Reis MTAL - Bilişim Teknolojileri Ödev ve Takip Portalı

Bu proje, **Torbalı Piri Reis Mesleki ve Teknik Anadolu Lisesi Bilişim Teknolojileri Alanı** için özel olarak geliştirilmiş modern, çift portallı (Öğretmen ve Öğrenci) bir Ödev ve Sınıf Yönetim Sistemidir.

---

## 🚀 Hızlı Başlangıç

Projeyi tek tıkla çalıştırmak için ana dizindeki `baslat.bat` dosyasına çift tıklayabilirsiniz.

Veya terminalden ayrı ayrı başlatmak isterseniz:

### 1. Backend (FastAPI + SQLite)
```bash
cd backend
.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```
- API Dokümantasyonu (Swagger): `http://localhost:8000/docs`

### 2. Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm.cmd run dev
```
- Kullanıcı Arayüzü: `http://localhost:5173`

---

## 🔐 Yapılandırma ve Giriş Hesapları

Gizli bilgiler (veritabanı adresi, API anahtarları, şifreler) **koda veya GitHub'a yazılmaz**.

1. `backend/.env.example` dosyasını `backend/.env` olarak kopyalayın ve değerleri doldurun.
2. Render / sunucu ortamında aynı değerleri **Environment** sekmesinden girin.

| Değişken | Açıklama |
| :--- | :--- |
| `DATABASE_URL` | PostgreSQL bağlantı adresi (boşsa yerel SQLite) |
| `SECRET_KEY` | Oturum (JWT) imzalama anahtarı — uzun ve rastgele olmalı |
| `GEMINI_API_KEY` | Yapay zekâ soru üretimi için Google Gemini anahtarı |
| `LAB_TEACHER_PASS` | İlk kurulumda oluşturulan `pirireis` yönetici hesabının şifresi |
| `LAB_DESKTOP_MASTER_KEY` | Masaüstü Lab uygulaması anahtarı (isteğe bağlı) |
| `CORS_ORIGINS` | İzin verilen web adresleri (virgülle ayrılmış) |

- **Yönetici hesabı:** `pirireis` — şifre `LAB_TEACHER_PASS` ile belirlenir. Tanımlı değilse ilk açılışta rastgele bir şifre üretilip sunucu loguna yazılır.
- **Öğrenciler:** Öğretmen panelinden veya e-Okul PDF'i ile eklenir; ilk girişten sonra öğrencilerin şifrelerini değiştirmesi önerilir.

> **Not:** Öğretmenler ve öğrenciler üst menüdeki **"Şifre Değiştir"** seçeneği ile şifrelerini güncelleyebilir (en az 6 karakter).

---

## 🌟 Sistem Özellikleri

### 👨‍🏫 Öğretmen Portalı
1. **Sınıf Yönetimi:**
   - Yeni sınıf / şube açma (9, 10, 11, 12. Sınıf seviyeleri ve açıklamaları).
   - Sınıf listesini ve her sınıftaki öğrenci sayısını görme.
2. **Öğrenci Hesabı Tanımlama:**
   - İstediğiniz sınıfa öğrenci ekleme.
   - Her öğrenci için **Ad Soyad**, **Okul Numarası**, **Kullanıcı Adı** ve **Giriş Şifresi** belirleme.
3. **Ödev Gönderme:**
   - Seçilen sınıfa başlık, açıklama yönergesi ve son teslim tarihi ile ödev atama.
   - Ödeve kaynak / şablon dosya (PDF, ZIP, kod vb.) ekleyebilme.
4. **Ödev İnceleme ve Puanlama:**
   - Öğrencilerin yüklediği ödev dosyalarını tek tıkla indirme ve inceleme.
   - Öğrencinin yazdığı teslim notunu okuma.
   - **0-100 arası puanlama** yapabilme.
   - **Öğretmen Görüşü / Yorumu** yazıp anında öğrenciye iletebilme.

### 🎓 Öğrenci Portalı
1. **Ders & Ödev Akışı:**
   - Kayıtlı olduğu sınıflara ait aktif ödevleri ve son teslim tarihlerini görme.
   - Öğretmenin eklediği ödev dosyasını/kaynağını indirme.
2. **Ödev Teslim Etme:**
   - Yaptığı çalışmayı (ZIP, PDF, proje dosyaları, görseller) sisteme yükleme.
   - Öğretmene teslimat notu iletebilme.
   - Dilediğinde teslim ettiği ödevi güncelleyebilme.
3. **Puan ve Öğretmen Görüşü:**
   - İncelenen ödevin **puanını (örn: 95/100)** görme.
   - Öğretmenin ödeve özel yazdığı **değerlendirme görüşünü ve tavsiyelerini** okuma.

---

## 🎨 Tasarım ve Logo Kimliği
- **Okul Logosu:** Piri Reis'in rüzgâr gülü / pusula simgesi ile Bilişim Teknolojileri devre ve mikroyonga yollarının harmanlandığı özel vektörel (SVG) tasarım.
- **Tema:** Derin gece mavisi, siber turkuaz ve altın sarısı navigasyon detaylarıyla modern karanlık mod arayüzü.
