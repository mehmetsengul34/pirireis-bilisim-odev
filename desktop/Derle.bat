@echo off
chcp 65001 >nul
echo [Piri Reis Laboratuvar Yonetimi Masaustu Uygulamasi Derleniyor...]
set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC_EXE%" set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe"

"%CSC_EXE%" /nologo /target:winexe /out:"%~dp0PiriReisLabMaster.exe" /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll "%~dp0PiriReisLabMaster.cs"

if %ERRORLEVEL% equ 0 (
    echo [BASARILI] PiriReisLabMaster.exe basariyla olusturuldu!
) else (
    echo [HATA] Derleme basarisiz oldu. Hata kodu: %ERRORLEVEL%
)
pause
