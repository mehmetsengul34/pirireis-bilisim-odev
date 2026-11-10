@echo off
chcp 65001 >nul
echo [Piri Reis Laboratuvar Yonetimi Masaustu Kisayolu Olusturuluyor...]

set "EXE_PATH=%~dp0PiriReisLabMaster.exe"
set "DESKTOP_DIR=%USERPROFILE%\Desktop"
set "LNK_PATH=%DESKTOP_DIR%\Piri Reis Laboratuvar Yonetimi.lnk"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "$wsh = New-Object -ComObject WScript.Shell; " ^
    "$shortcut = $wsh.CreateShortcut('%LNK_PATH%'); " ^
    "$shortcut.TargetPath = '%EXE_PATH%'; " ^
    "$shortcut.WorkingDirectory = '%~dp0'; " ^
    "$shortcut.Description = 'Piri Reis Bilisim Laboratuvari Yonetim ve Izleme Masasi'; " ^
    "$shortcut.Save()"

if exist "%LNK_PATH%" (
    echo [BASARILI] Masaustunuze 'Piri Reis Laboratuvar Yonetimi' kisayolu eklendi!
) else (
    echo [HATA] Kisayol olusturulamadi.
)
pause
