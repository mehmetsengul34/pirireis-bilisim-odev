@echo off
chcp 65001 > nul
title Torbalı Piri Reis MTAL - Bilişim LMS Başlatıcı

echo ========================================================
echo  Torbalı Piri Reis MTAL - Bilişim Teknolojileri Alanı
echo  Ödev ve Sınıf Takip Sistemi Başlatılıyor...
echo ========================================================

cd /d "%~dp0"

:: Backend Başlat
echo [1/2] FastAPI Backend Sunucusu Başlatılıyor (Port 8000)...
start "Piri Reis LMS - Backend" cmd /k "cd /d "%~dp0backend" && .venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

:: Frontend Başlat
echo [2/2] Vite React Arayüzü Başlatılıyor (Port 5173)...
start "Piri Reis LMS - Frontend" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

timeout /t 3 > nul
echo Tarayıcı açılıyor: http://localhost:5173
start http://localhost:5173

echo ========================================================
echo Sistem Başlatıldı!
echo Master Öğretmen: pirireis / 20262027
echo Öğrenci Girişi:   ogrenci / 123
echo ========================================================
