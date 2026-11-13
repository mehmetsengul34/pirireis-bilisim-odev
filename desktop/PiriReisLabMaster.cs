using System;
using System.IO;
using System.Net;
using System.Text;
using System.Drawing;
using System.Windows.Forms;
using System.Diagnostics;
using System.Threading;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;

namespace PiriReisLabMaster
{
    public class MasterApp : ApplicationContext
    {
        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        [DllImport("user32.dll")]
        private static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);
        public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        private static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

        [DllImport("user32.dll")]
        private static extern bool IsWindowVisible(IntPtr hWnd);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

        private const uint WM_SETICON = 0x0080;
        private const int ICON_SMALL = 0;
        private const int ICON_BIG = 1;

        private NotifyIcon trayIcon;
        private ContextMenuStrip trayMenu;
        private Process browserProcess;
        private System.Windows.Forms.Timer processWatchTimer;
        private Icon appIcon = null;
        private string currentServerUrl;
        private const string CLOUD_URL = "https://ogretmenlerodasi.info/labizleme";
        private const string LOCAL_URL = "http://localhost:4000/labizleme";
        private const string DESKTOP_MASTER_KEY = "pirireis-lab-master-secret-2026-auth-token";
        private string configPath;
        private string tokenCachePath;
        private string cachedAuthToken = null;

        public MasterApp()
        {
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)768 | SecurityProtocolType.Tls;
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

            string appData = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "PiriReisLabMaster");
            if (!Directory.Exists(appData)) Directory.CreateDirectory(appData);
            configPath = Path.Combine(appData, "config.txt");
            tokenCachePath = Path.Combine(appData, "token.txt");

            currentServerUrl = CLOUD_URL;
            if (File.Exists(configPath))
            {
                try
                {
                    string saved = File.ReadAllText(configPath).Trim();
                    if (!string.IsNullOrEmpty(saved)) currentServerUrl = saved;
                }
                catch { }
            }

            if (File.Exists(tokenCachePath))
            {
                try
                {
                    string savedToken = File.ReadAllText(tokenCachePath).Trim();
                    if (!string.IsNullOrEmpty(savedToken)) cachedAuthToken = savedToken;
                }
                catch { }
            }

            // Authenticate in background to cache fresh token
            ThreadPool.QueueUserWorkItem(delegate { EnsureAuthToken(false); });

            appIcon = GenerateAppIcon();
            CreateDesktopShortcut(true);
            InitTray();
            LaunchAppWindow();

            processWatchTimer = new System.Windows.Forms.Timer();
            processWatchTimer.Interval = 1500;
            processWatchTimer.Tick += delegate
            {
                if (browserProcess != null && browserProcess.HasExited)
                {
                    browserProcess = null;
                }
                else if (browserProcess != null && appIcon != null)
                {
                    try
                    {
                        if (browserProcess.MainWindowHandle != IntPtr.Zero)
                        {
                            SendMessage(browserProcess.MainWindowHandle, WM_SETICON, (IntPtr)ICON_SMALL, appIcon.Handle);
                            SendMessage(browserProcess.MainWindowHandle, WM_SETICON, (IntPtr)ICON_BIG, appIcon.Handle);
                        }
                    }
                    catch { }
                }
            };
            processWatchTimer.Start();
        }

        private Icon GenerateAppIcon()
        {
            try
            {
                Icon assoc = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
                if (assoc != null) return assoc;
            }
            catch { }
            try
            {
                using (Bitmap bmp = new Bitmap(32, 32))
                {
                    using (Graphics g = Graphics.FromImage(bmp))
                    {
                        g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                        g.Clear(Color.Transparent);
                        using (Brush b = new SolidBrush(Color.FromArgb(14, 165, 233)))
                        {
                            g.FillEllipse(b, 1, 1, 30, 30);
                        }
                        using (Font f = new Font("Segoe UI", 13, FontStyle.Bold))
                        {
                            g.DrawString("P", f, Brushes.White, new PointF(7, 3));
                        }
                    }
                    IntPtr hIcon = bmp.GetHicon();
                    return Icon.FromHandle(hIcon);
                }
            }
            catch
            {
                return SystemIcons.Application;
            }
        }

        private void InitTray()
        {
            trayMenu = new ContextMenuStrip();
            trayMenu.Font = new Font("Segoe UI", 9, FontStyle.Regular);

            ToolStripMenuItem titleItem = new ToolStripMenuItem("Piri Reis Laboratuvar Yonetimi");
            titleItem.Font = new Font("Segoe UI", 9, FontStyle.Bold);
            titleItem.Enabled = false;
            trayMenu.Items.Add(titleItem);
            trayMenu.Items.Add(new ToolStripSeparator());

            trayMenu.Items.Add("🖥️ Yonetim Panelini Ac", null, delegate { LaunchAppWindow(); });
            trayMenu.Items.Add(new ToolStripSeparator());

            trayMenu.Items.Add("🔒 Tum Ekranlari Kilitle (Dikkat Modu)", null, delegate
            {
                SendQuickAction("Tumunu Kilitle", "{\"action\":\"toggleLockAll\",\"lock\":true,\"message\":\"Ogretmen dersi anlatiyor. Lutfen ogretmeninize odaklanin.\"}");
            });

            trayMenu.Items.Add("🔓 Tum Kilitleri Ac", null, delegate
            {
                SendQuickAction("Kilitleri Ac", "{\"action\":\"toggleLockAll\",\"lock\":false}");
            });

            trayMenu.Items.Add(new ToolStripSeparator());

            trayMenu.Items.Add("🧹 Ogrenci Masaustlerini Temizle", null, delegate
            {
                SendQuickAction("Masaustu Temizligi", "{\"action\":\"remoteInstall\",\"installType\":\"powershell\",\"packageName\":\"Masaustu Temizligi\",\"installCommand\":\"$d=[Environment]::GetFolderPath('Desktop'); Get-ChildItem -Path $d -Exclude '*.lnk' -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue\"}");
            });

            trayMenu.Items.Add("🔄 Masaustunu Yenile (Explorer Restart)", null, delegate
            {
                SendQuickAction("Masaustu Yenile", "{\"action\":\"remoteInstall\",\"installType\":\"powershell\",\"packageName\":\"Masaustu Yenile\",\"installCommand\":\"Stop-Process -Name explorer -Force -ErrorAction SilentlyContinue; Start-Sleep -Milliseconds 600; Start-Process explorer.exe\"}");
            });

            trayMenu.Items.Add("🛑 Acik Tarayici ve Oyunlari Kapat", null, delegate
            {
                SendQuickAction("Tarayicilari Kapat", "{\"action\":\"remoteInstall\",\"installType\":\"powershell\",\"packageName\":\"Tarayicilari Kapat\",\"installCommand\":\"Get-Process -Name chrome, msedge, firefox, opera, brave, steam, roblox, discord -ErrorAction SilentlyContinue | Stop-Process -Force\"}");
            });

            trayMenu.Items.Add("🗑️ Cop ve Indirilenleri Temizle", null, delegate
            {
                SendQuickAction("Cop Temizligi", "{\"action\":\"remoteInstall\",\"installType\":\"powershell\",\"packageName\":\"Cop Temizligi\",\"installCommand\":\"$dl=Join-Path $env:USERPROFILE 'Downloads'; if(Test-Path $dl){Get-ChildItem -Path $dl -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue}; Clear-RecycleBin -Force -ErrorAction SilentlyContinue\"}");
            });

            trayMenu.Items.Add(new ToolStripSeparator());

            trayMenu.Items.Add("🔌 Tum Bilgisayarlari Kapat (Shutdown)", null, delegate
            {
                if (MessageBox.Show("Laboratuvardaki tum ogrenci bilgisayarlari kapatilacak. Onayliyor musunuz?", "Piri Reis Lab Yonetimi", MessageBoxButtons.YesNo, MessageBoxIcon.Warning) == DialogResult.Yes)
                {
                    SendQuickAction("Bilgisayarlari Kapat", "{\"action\":\"remoteInstall\",\"installType\":\"powershell\",\"packageName\":\"Bilgisayarlari Kapat\",\"installCommand\":\"shutdown.exe /s /f /t 10 /c 'Ogretmen laboratuvar bilgisayarlarini kapatti.'\"}");
                }
            });

            trayMenu.Items.Add(new ToolStripSeparator());

            ToolStripMenuItem serverMenu = new ToolStripMenuItem("🌐 Baglanti Sunucusu");
            ToolStripMenuItem cloudItem = new ToolStripMenuItem("Bulut: ogretmenlerodasi.info", null, delegate
            {
                currentServerUrl = CLOUD_URL;
                SaveConfig(currentServerUrl);
                LaunchAppWindow(true);
            });
            ToolStripMenuItem localItem = new ToolStripMenuItem("Yerel Ag: Localhost (4000)", null, delegate
            {
                currentServerUrl = LOCAL_URL;
                SaveConfig(currentServerUrl);
                LaunchAppWindow(true);
            });
            ToolStripMenuItem customItem = new ToolStripMenuItem("Ozel IP Gir...", null, delegate
            {
                string ip = PromptInput("Laboratuvar Sunucu IP Adresini Girin (Orn: 192.168.23.244):", "192.168.23.244");
                if (!string.IsNullOrEmpty(ip))
                {
                    currentServerUrl = "http://" + ip.Trim() + ":4000/labizleme";
                    SaveConfig(currentServerUrl);
                    LaunchAppWindow(true);
                }
            });
            serverMenu.DropDownItems.Add(cloudItem);
            serverMenu.DropDownItems.Add(localItem);
            serverMenu.DropDownItems.Add(customItem);
            trayMenu.Items.Add(serverMenu);

            trayMenu.Items.Add("📌 Masaustune Kisayol Olustur", null, delegate
            {
                CreateDesktopShortcut(true);
                MessageBox.Show("Masaustune 'Piri Reis Laboratuvar Yonetimi' kisayolu olusturuldu!", "Basarili", MessageBoxButtons.OK, MessageBoxIcon.Information);
            });

            trayMenu.Items.Add(new ToolStripSeparator());
            trayMenu.Items.Add("❌ Cikis", null, delegate { ExitApp(); });

            trayIcon = new NotifyIcon();
            trayIcon.Icon = appIcon ?? GenerateAppIcon();
            trayIcon.Text = "Piri Reis Laboratuvar Yonetimi";
            trayIcon.ContextMenuStrip = trayMenu;
            trayIcon.Visible = true;
            trayIcon.DoubleClick += delegate { LaunchAppWindow(); };
        }

        private void SaveConfig(string url)
        {
            try { File.WriteAllText(configPath, url); } catch { }
        }

        private string PromptInput(string text, string defaultVal)
        {
            Form prompt = new Form()
            {
                Width = 420,
                Height = 160,
                FormBorderStyle = FormBorderStyle.FixedDialog,
                Text = "Sunucu Adresi",
                StartPosition = FormStartPosition.CenterScreen,
                MaximizeBox = false,
                MinimizeBox = false,
                BackColor = Color.FromArgb(24, 24, 27)
            };
            Label textLabel = new Label() { Left = 20, Top = 15, Width = 360, ForeColor = Color.White, Text = text, Font = new Font("Segoe UI", 9) };
            TextBox textBox = new TextBox() { Left = 20, Top = 45, Width = 360, Text = defaultVal, Font = new Font("Segoe UI", 10) };
            Button confirmation = new Button() { Text = "Tamam", Left = 280, Width = 100, Top = 80, DialogResult = DialogResult.OK, BackColor = Color.FromArgb(14, 165, 233), ForeColor = Color.White, FlatStyle = FlatStyle.Flat };
            prompt.Controls.Add(textLabel);
            prompt.Controls.Add(textBox);
            prompt.Controls.Add(confirmation);
            prompt.AcceptButton = confirmation;
            return prompt.ShowDialog() == DialogResult.OK ? textBox.Text : "";
        }

        private string FindBrowserExecutable()
        {
            string[] paths = new string[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft\\Edge\\Application\\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft\\Edge\\Application\\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Microsoft\\Edge\\Application\\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Google\\Chrome\\Application\\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Google\\Chrome\\Application\\chrome.exe")
            };
            foreach (string p in paths)
            {
                if (File.Exists(p)) return p;
            }
            return null;
        }

        private void MaximizeAppWindow()
        {
            try
            {
                EnumWindows(delegate(IntPtr hWnd, IntPtr lParam)
                {
                    if (IsWindowVisible(hWnd))
                    {
                        StringBuilder sb = new StringBuilder(256);
                        GetWindowText(hWnd, sb, 256);
                        string title = sb.ToString();
                        if (title.Contains("Piri Reis") || title.Contains("Lab Master") || title.Contains("Torbalı") || title.Contains("ogretmenlerodasi.info") || title.Contains("Laboratuvar"))
                        {
                            ShowWindow(hWnd, 3); // 3 = SW_MAXIMIZE (Tam Ekran)
                            SetForegroundWindow(hWnd);
                            if (appIcon != null)
                            {
                                try
                                {
                                    SendMessage(hWnd, WM_SETICON, (IntPtr)ICON_SMALL, appIcon.Handle);
                                    SendMessage(hWnd, WM_SETICON, (IntPtr)ICON_BIG, appIcon.Handle);
                                }
                                catch { }
                            }
                        }
                    }
                    return true;
                }, IntPtr.Zero);
            }
            catch { }
        }

        private void LaunchAppWindow(bool forceNew = false)
        {
            try
            {
                if (!forceNew)
                {
                    MaximizeAppWindow();
                }

                string browserExe = FindBrowserExecutable();
                string userDataDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "PiriReisLabMaster\\BrowserProfile");

                if (!string.IsNullOrEmpty(browserExe))
                {
                    string args = "--app=\"" + currentServerUrl + "\" --user-data-dir=\"" + userDataDir + "\" --start-maximized --enable-features=OverlayScrollbar";
                    ProcessStartInfo psi = new ProcessStartInfo(browserExe, args);
                    psi.UseShellExecute = false;
                    browserProcess = Process.Start(psi);

                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        try
                        {
                            for (int i = 0; i < 20; i++)
                            {
                                Thread.Sleep(250);
                                MaximizeAppWindow();
                            }
                        }
                        catch { }
                    });
                }
                else
                {
                    Process.Start(currentServerUrl);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Uygulama penceresi acilamadi: " + ex.Message, "Hata", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void EnsureAuthToken(bool forceRefresh)
        {
            if (!forceRefresh && !string.IsNullOrEmpty(cachedAuthToken)) return;
            try
            {
                string loginUrl = (currentServerUrl.Contains("localhost") || currentServerUrl.Contains(":4000"))
                    ? "http://localhost:4000/api/labizleme/login"
                    : "https://pirireis-api-v3ku.onrender.com/api/labizleme/login";

                HttpWebRequest lReq = (HttpWebRequest)WebRequest.Create(loginUrl);
                lReq.Method = "POST";
                lReq.ContentType = "application/json; charset=utf-8";
                lReq.Timeout = 5000;
                lReq.Headers.Add("X-Master-App-Key", DESKTOP_MASTER_KEY);
                byte[] payload = Encoding.UTF8.GetBytes("{\"username\":\"pirireis\",\"password\":\"20262027\"}");
                lReq.ContentLength = payload.Length;
                using (Stream s = lReq.GetRequestStream()) s.Write(payload, 0, payload.Length);
                using (HttpWebResponse resp = (HttpWebResponse)lReq.GetResponse())
                {
                    using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                    {
                        string json = sr.ReadToEnd();
                        Match m = Regex.Match(json, "\"token\"\\s*:\\s*\"([^\"]+)\"");
                        if (m.Success)
                        {
                            cachedAuthToken = m.Groups[1].Value;
                            try { File.WriteAllText(tokenCachePath, cachedAuthToken); } catch { }
                        }
                    }
                }
            }
            catch { }
        }

        private void SendQuickAction(string actionName, string jsonPayload)
        {
            ThreadPool.QueueUserWorkItem(delegate
            {
                for (int attempt = 0; attempt < 2; attempt++)
                {
                    try
                    {
                        EnsureAuthToken(attempt > 0);

                        string apiUrl = (currentServerUrl.Contains("localhost") || currentServerUrl.Contains(":4000"))
                            ? "http://localhost:4000/api/labizleme/action"
                            : "https://pirireis-api-v3ku.onrender.com/api/labizleme/action";

                        HttpWebRequest req = (HttpWebRequest)WebRequest.Create(apiUrl);
                        req.Method = "POST";
                        req.ContentType = "application/json; charset=utf-8";
                        req.Timeout = 7000;
                        req.Headers.Add("X-Master-App-Key", DESKTOP_MASTER_KEY);

                        string tokenToSend = !string.IsNullOrEmpty(cachedAuthToken) ? cachedAuthToken : DESKTOP_MASTER_KEY;
                        req.Headers.Add("Authorization", "Bearer " + tokenToSend);

                        byte[] data = Encoding.UTF8.GetBytes(jsonPayload);
                        req.ContentLength = data.Length;
                        using (Stream s = req.GetRequestStream())
                        {
                            s.Write(data, 0, data.Length);
                        }
                        using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                        {
                            trayIcon.ShowBalloonTip(2500, "Piri Reis Lab Yonetimi", "Komut basariyla iletildi: " + actionName, ToolTipIcon.Info);
                            return;
                        }
                    }
                    catch (WebException wex)
                    {
                        HttpWebResponse httpResp = wex.Response as HttpWebResponse;
                        if (attempt == 0 && httpResp != null && httpResp.StatusCode == HttpStatusCode.Unauthorized)
                        {
                            cachedAuthToken = null;
                            continue;
                        }

                        string msg = wex.Message;
                        try
                        {
                            if (wex.Response != null)
                            {
                                using (StreamReader sr = new StreamReader(wex.Response.GetResponseStream()))
                                {
                                    string body = sr.ReadToEnd();
                                    if (!string.IsNullOrEmpty(body)) msg = body;
                                }
                            }
                        }
                        catch { }
                        trayIcon.ShowBalloonTip(3500, "Komut Hatasi (" + actionName + ")", msg, ToolTipIcon.Warning);
                        break;
                    }
                    catch (Exception ex)
                    {
                        trayIcon.ShowBalloonTip(3500, "Komut Hatasi", ex.Message, ToolTipIcon.Warning);
                        break;
                    }
                }
            });
        }

        private void CreateDesktopShortcut(bool overwrite = false)
        {
            try
            {
                string desktop = Environment.GetFolderPath(Environment.SpecialFolder.DesktopDirectory);
                string lnkPath = Path.Combine(desktop, "Piri Reis Laboratuvar Yonetimi.lnk");

                string appData = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "PiriReisLabMaster");
                if (!Directory.Exists(appData)) Directory.CreateDirectory(appData);
                string installedExe = Path.Combine(appData, "PiriReisLabMaster.exe");
                string currentExe = Application.ExecutablePath;

                if (!string.Equals(currentExe, installedExe, StringComparison.OrdinalIgnoreCase))
                {
                    try
                    {
                        File.Copy(currentExe, installedExe, true);
                    }
                    catch { }
                }

                string targetExe = File.Exists(installedExe) ? installedExe : currentExe;

                Type shellType = Type.GetTypeFromProgID("WScript.Shell");
                if (shellType != null)
                {
                    dynamic shell = Activator.CreateInstance(shellType);
                    dynamic shortcut = shell.CreateShortcut(lnkPath);
                    shortcut.TargetPath = targetExe;
                    shortcut.WorkingDirectory = Path.GetDirectoryName(targetExe);
                    shortcut.IconLocation = targetExe + ",0";
                    shortcut.Description = "Piri Reis Bilisim Laboratuvari Yonetim ve Izleme Masasi";
                    shortcut.Save();
                }
            }
            catch { }
        }

        private void ExitApp()
        {
            if (trayIcon != null)
            {
                trayIcon.Visible = false;
                trayIcon.Dispose();
            }
            if (processWatchTimer != null) processWatchTimer.Stop();
            Application.Exit();
        }

        [STAThread]
        public static void Main(string[] args)
        {
            bool isNew;
            using (Mutex mutex = new Mutex(true, "Global\\PiriReisLabMasterAppMutex", out isNew))
            {
                if (!isNew)
                {
                    return;
                }
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new MasterApp());
            }
        }
    }
}
