@echo off
setlocal EnableDelayedExpansion
chcp 65001 >nul
title Piri Reis Lab Izleme - Seffaf Ogrenci Kurulumu

:: ============================================================
::  Piri Reis Lab Izleme - SEFFAF ogrenci istemcisi kurulumu
::
::  Bu betik BILEREK seffaftir. Eski "WinSystemService" betiginin
::  aksine SUNLARI YAPMAZ:
::    - Kendini Windows sistem sureci gibi gizlemez (gercek ad: PiriReisLabIzleme)
::    - Dosyalari gizli/sistem yapmaz (attrib ile saklama yok)
::    - SmartScreen / Internet Bolgesi uyarilarini bastirmaz
::    - UAC atlatmaz, gizli PowerShell/winget ile program kurmaz
::    - Uzaktan komut calistiran bir arka kapi kurmaz
::
::  SUNLARI yapar (hepsi gorunur):
::    - Kaynaktan (PiriReisLabIzleme.cs) uygulamayi derler
::    - Makine genelinde %ProgramData%\PiriReisLabIzleme klasorune kurar
::    - Her kullanici oturum acinca calisacak GORUNUR bir Gorev Zamanlayici
::      gorevi olusturur (Gorev Zamanlayici'da "PiriReisLabIzleme" adiyla gorunur)
::    - Ogrenci ekraninda surekli "izleniyorsunuz" bildirimi gosterir
::
::  Yonetici olarak calistirilmalidir (makine geneli kurulum icin).
:: ============================================================

echo.
echo ===============================================================
echo   Piri Reis Lab Izleme - Seffaf Ogrenci Istemcisi Kurulumu
echo ===============================================================
echo.
echo  Bu bilgisayara, ders sirasinda ogretmenin ekrani gorebilmesi
echo  icin SEFFAF bir izleme istemcisi kurulacaktir. Ogrenciye
echo  izlendigi acikca bildirilir; uygulama gizlenmez.
echo.

:: --- Yonetici hakki kontrolu ---
net session >nul 2>&1
if not "%errorLevel%"=="0" (
    echo  [HATA] Bu betik yonetici olarak calistirilmalidir.
    echo         Sag tiklayip "Yonetici olarak calistir" secin.
    echo.
    pause
    exit /b 1
)

set "SRC=%~dp0PiriReisLabIzleme.cs"
set "SVC_SRC=%~dp0PiriReisLabDeployService.cs"
set "ICON=%~dp0labmaster.ico"
set "INSTALL_DIR=%ProgramData%\PiriReisLabIzleme"
set "EXE=%INSTALL_DIR%\PiriReisLabIzleme.exe"
set "SVC_EXE=%INSTALL_DIR%\PiriReisLabDeploy.exe"
set "TASK=PiriReisLabIzleme"
set "SVC=PiriReisLabDeploy"
set "API_BASE=https://pirireis-api-v3ku.onrender.com"

if not exist "%SRC%" (
    echo  [HATA] Kaynak dosya bulunamadi: %SRC%
    echo         PiriReisLabIzleme.cs bu betikle ayni klasorde olmali.
    echo.
    pause
    exit /b 1
)

:: --- .NET derleyicisini bul (sistemde hazir gelir) ---
set "CSC=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC%" set "CSC=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe"
if not exist "%CSC%" (
    echo  [HATA] .NET Framework derleyicisi (csc.exe) bulunamadi.
    echo         Windows ile birlikte gelir; eksikse .NET Framework 4.x kurun.
    echo.
    pause
    exit /b 1
)

echo  [1/4] Kurulum klasoru hazirlaniyor: %INSTALL_DIR%
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
if exist "%ICON%" copy /y "%ICON%" "%INSTALL_DIR%\labmaster.ico" >nul

echo  [2/4] Uygulama kaynaktan derleniyor...
"%CSC%" /nologo /target:winexe /optimize+ /out:"%EXE%" ^
    /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll ^
    "%SRC%"
if not exist "%EXE%" (
    echo  [HATA] Derleme basarisiz oldu.
    echo.
    pause
    exit /b 1
)
echo         Tamam: %EXE%

echo  [3/4] Otomatik baslatma gorevi olusturuluyor (gorunur)...
:: Mevcut gorevi temizle, sonra her kullanici oturum acinca calisacak gorev kur.
schtasks /delete /tn "%TASK%" /f >nul 2>&1
schtasks /create /tn "%TASK%" /tr "\"%EXE%\"" /sc onlogon /rl limited /f >nul
if "%errorLevel%"=="0" (
    echo         Gorev olusturuldu: "%TASK%" ^(Gorev Zamanlayici'da gorunur^)
) else (
    echo  [UYARI] Gorev olusturulamadi; kayit defteri ile deneniyor...
    reg add "HKLM\Software\Microsoft\Windows\CurrentVersion\Run" /v "PiriReisLabIzleme" /t REG_SZ /d "\"%EXE%\"" /f >nul
)

echo  [4/6] Dagitim hizmeti derleniyor (gorunur Windows hizmeti)...
:: Yalnizca dogrulanmis (hash eslesmeli) kurulum dosyasini calistirir. Keyfi komut yok.
if exist "%SVC_SRC%" (
    "%CSC%" /nologo /target:exe /optimize+ /out:"%SVC_EXE%" ^
        /r:System.dll /r:System.ServiceProcess.dll "%SVC_SRC%"
)
if exist "%SVC_EXE%" (
    echo         Tamam: %SVC_EXE%
    echo  [5/6] Hizmet yapilandiriliyor ve kaydediliyor...
    :: deploy.config: API adresi (ve sunucuda LABIZLE_DEPLOY_TOKEN tanimliysa ayni token)
    > "%INSTALL_DIR%\deploy.config" echo ApiBase=%API_BASE%
    set /p DEPTOKEN="        Sunucu dagitim anahtari (LABIZLE_DEPLOY_TOKEN) - yoksa bos birakin: "
    if not "!DEPTOKEN!"=="" >> "%INSTALL_DIR%\deploy.config" echo Token=!DEPTOKEN!
    sc stop "%SVC%" >nul 2>&1
    sc delete "%SVC%" >nul 2>&1
    sc create "%SVC%" binPath= "\"%SVC_EXE%\"" start= auto obj= LocalSystem DisplayName= "Piri Reis Lab Dagitim Hizmeti" >nul
    sc description "%SVC%" "Ogretmen panosundan onaylanmis, SHA-256 dogrulanmis kurulum dosyalarini calistirir. Gorunur hizmet." >nul
    sc start "%SVC%" >nul 2>&1
    echo         Hizmet kuruldu ve baslatildi: "%SVC%" ^(Hizmetler listesinde gorunur^)
) else (
    echo  [UYARI] Dagitim hizmeti derlenemedi; yalnizca izleme kuruldu.
    echo          Program dagitimi icin PDQ Deploy / GPO kullanabilirsiniz.
)

echo  [6/6] Izleme uygulamasi baslatiliyor...
schtasks /run /tn "%TASK%" >nul 2>&1
if not "%errorLevel%"=="0" start "" "%EXE%"

echo.
echo ===============================================================
echo   Kurulum tamamlandi.
echo.
echo   - Izleme uygulamasi: %EXE%  (Gorev Zamanlayici ^> "%TASK%")
echo   - Dagitim hizmeti   : %SVC_EXE%  (Hizmetler ^> "%SVC%")
echo   - Ogrenci ekraninda surekli izleme bildirimi gorunur.
echo   - Hizmet yalnizca panodan onaylanan, hash dogrulanan kurulum
echo     dosyasini calistirir; keyfi komut CALISTIRMAZ.
echo.
echo   Kaldirmak icin: kaldir-ogrenci.bat (ayni klasorde)
echo ===============================================================
echo.
pause
endlocal
