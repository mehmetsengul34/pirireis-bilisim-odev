@echo off
title Piri Reis MTAL - Bilisim LMS Baslatici

echo ========================================================
echo  Torbali Piri Reis MTAL - Bilisim Teknolojileri
echo  Odev ve Sinif Takip Sistemi Baslatiliyor...
echo ========================================================

set "PROJ_DIR=%~dp0"

echo [1/2] FastAPI Backend Sunucusu Baslatiliyor (Port 8000)...
start "Piri Reis LMS - Backend" cmd /k "cd /d %PROJ_DIR%backend && .venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"

echo [2/2] Vite React Arayuzu Baslatiliyor (Port 5173)...
start "Piri Reis LMS - Frontend" cmd /k "cd /d %PROJ_DIR%frontend && npm.cmd run dev"

ping 127.0.0.1 -n 4 > nul
echo Tarayici aciliyor: http://localhost:5173
start http://localhost:5173

echo ========================================================
echo Sistem Baslatildi!
echo Master Ogretmen: pirireis / 20262027
echo Ogrenci Girisi:  ogrenci / 123
echo Canli Surum:    https://pirireis-bilisim-odev.vercel.app
echo ========================================================

