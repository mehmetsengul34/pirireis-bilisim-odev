# ⚓ Piri Reis Bilişim Ödev ve Takip Portalı — Proje Durumu ve Devam Notları

> **Tarih:** 23 Ekim 2026  
> **GitHub Deposu:** `mehmetsengul34/pirireis-bilisim-odev` (Branch: `main`)  
> **Canlı Yayın (Vercel):** https://pirireis-bilisim-odev.vercel.app | https://ogretmenlerodasi.info  
> **API Sunucusu (Render):** https://pirireis-api.onrender.com

---

## 📌 Yapılan Geliştirmeler

1. **Şifre Değiştirme Modülü:**
   - Öğretmen ve öğrenciler için üst menüye şifre değiştirme seçeneği eklendi (`ChangePasswordModal.jsx`).
   - Backend uç noktası: `POST /api/auth/change-password`

2. **Hızlı Test Girişlerinin Kaldırılması:**
   - Anasayfadaki butonlar kaldırıldı, sadece normal giriş formu bırakıldı.

3. **Master Öğretmen ve Yetkilendirme:**
   - **Kullanıcı Adı:** `pirireis`
   - **Şifre:** `20262027`
   - Sadece bu kullanıcı yeni öğretmen hesabı açabilir / silebilir.
   - Açılan öğretmenler kendi sınıflarını ve öğrencilerini tanımlayabilir.

4. **`ogretmen` Hesabının Temizlenmesi:**
   - Eski sınıflar `pirireis` hesabına aktarıldı.
   - `ogretmen` kullanıcısı veritabanından kalıcı olarak silindi.

---

## 📋 Tamamlanan İşlemler ve Doğrulama

1. Render.com üzerinde `pirireis-api` servisi otomatik olarak en güncel commit (`8b8842e`) ile deploy oldu.
2. Startup seed işlemi başarıyla tamamlandı:
   - `ogretmen` hesabı canlı sunucudan tamamen temizlendi (artık 401 Unauthorized veriyor).
   - `pirireis` / `20262027` master yönetici hesabı canlı sunucuda aktif ve doğrulandı.
   - `ogrenci` / `123` öğrenci hesabı canlı sunucuda aktif ve doğrulandı.
   - Master öğretmen yetkilendirmesi (`/api/auth/teachers`) canlı ortamda çalışıyor.

