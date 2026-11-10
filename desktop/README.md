# Piri Reis Laboratuvar Yönetimi - Windows Masaüstü Uygulaması

Bu klasör, `https://ogretmenlerodasi.info/labizleme` web tabanlı laboratuvar yönetim masasını **bağımsız bir Windows Masaüstü Uygulaması** haline getiren iki farklı çözüm sunar:

---

## 🚀 1. Çözüm: Hafif ve Bağımsız Native EXE (`PiriReisLabMaster.exe`) - ÖNERİLEN ⭐

- **Dosya Boyutu:** Yalnızca **18 KB** (Kurulum gerektirmez, taşınabilir tek dosya).
- **Altyapı:** Windows'un dahili modern Edge Chromium motorunu bağımsız uygulama modunda (`--app=...`) kullanır.
- **Özellikler:**
  - 🖥️ Tarayıcı adres çubuğu veya sekmeleri olmadan tam ekran / bağımsız pencere olarak açılır.
  - 🔔 **Sistem Tepsisi (System Tray):** Görev çubuğunda saatin yanına yerleşir, sağ tık menüsünden:
    - 🔒 Tüm Ekranları Kilitle (Dikkat Modu)
    - 🔓 Tüm Kilitleri Aç
    - 🧹 Öğrenci Masaüstlerini Temizle
    - 🛑 Açık Tarayıcı ve Oyunları Kapat
    - 🔌 Tüm Bilgisayarları Kapat (Shutdown)
    - 🌐 Bulut veya Yerel Ağ Sunucusu Seçimi
  - 📌 **Masaüstü Kısayolu:** Masaüstünüze otomatik olarak `Piri Reis Laboratuvar Yonetimi.lnk` kısayolu ekler.
  - 🛠️ **Yeniden Derleme:** `Derle.bat` dosyasına çift tıklayarak C# kaynak kodunu (`PiriReisLabMaster.cs`) 1 saniyede derleyebilirsiniz.

### Nasıl Kullanılır?
1. `PiriReisLabMaster.exe` dosyasına çift tıklayın.
2. Uygulama bağımsız bir masaüstü penceresi olarak açılır ve sistem tepsisine yerleşir.
3. Dilerseniz `Masaustune-Kisayol-Olustur.bat` dosyasına çift tıklayarak masaüstünüze kısayol oluşturabilirsiniz.

---

## ⚡ 2. Çözüm: Electron Tabanlı Masaüstü Uygulaması

Geliştiriciler ve Electron ortamında çalıştırmak isteyenler için:

### Gereksinimler:
- Node.js (v18 veya üzeri)

### Çalıştırma:
```bash
cd desktop
npm install
npm start
```

### Windows Kurulum Paketi (.exe Installer) Üretme:
```bash
npm run dist
```
`dist/` klasörü altında Windows için bağımsız kurulum dosyası (.exe) oluşturulur.
