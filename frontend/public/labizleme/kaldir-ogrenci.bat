@echo off
setlocal
chcp 65001 >nul
title Piri Reis Lab Izleme - Kaldirma

:: Seffaf ogrenci istemcisini tamamen kaldirir. Yonetici olarak calistirin.

echo.
echo  Piri Reis Lab Izleme - Ogrenci istemcisi kaldiriliyor...
echo.

net session >nul 2>&1
if not "%errorLevel%"=="0" (
    echo  [HATA] Yonetici olarak calistirin.
    pause
    exit /b 1
)

set "INSTALL_DIR=%ProgramData%\PiriReisLabIzleme"
set "TASK=PiriReisLabIzleme"
set "SVC=PiriReisLabDeploy"

echo  - Calisan uygulama durduruluyor...
taskkill /f /im PiriReisLabIzleme.exe >nul 2>&1

echo  - Dagitim hizmeti durduruluyor ve siliniyor...
sc stop "%SVC%" >nul 2>&1
taskkill /f /im PiriReisLabDeploy.exe >nul 2>&1
sc delete "%SVC%" >nul 2>&1

echo  - Otomatik baslatma gorevi siliniyor...
schtasks /delete /tn "%TASK%" /f >nul 2>&1
reg delete "HKLM\Software\Microsoft\Windows\CurrentVersion\Run" /v "PiriReisLabIzleme" /f >nul 2>&1

echo  - Dosyalar siliniyor...
if exist "%INSTALL_DIR%" rmdir /s /q "%INSTALL_DIR%"

echo.
echo  Kaldirma tamamlandi.
echo.
pause
endlocal
