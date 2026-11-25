// ============================================================
//  Piri Reis Laboratuvar İzleme — Şeffaf İstemci (öğrenci bilgisayarı)
//
//  Bu sürüm BİLEREK şeffaftır:
//   - Ekranda her zaman görünen bir "Lab İzleme açık" göstergesi vardır.
//   - Görev çubuğu bildirim alanında (tray) adı ve simgesiyle görünür.
//   - İlk açılışta öğrenciye ne yapıldığını anlatan bir bilgi penceresi çıkar.
//   - Dosyalar gizlenmez, SmartScreen uyarısı bastırılmaz, süreç adı gizlenmez.
//
//  Ne YAPAR: öğretmenin panosuna ekran görüntüsünü gönderir; öğretmen
//  "dikkat modu" (ekran kilidi) veya kendi ekranını yansıtma başlatırsa
//  bunu gösterir. Hepsi sınıf yönetimi amaçlıdır.
//
//  Ne YAPMAZ (eski sürümden bilerek çıkarıldı): uzaktan fare/klavye
//  kontrolü, uzaktan program kurma / PowerShell çalıştırma, UAC atlatma,
//  kendini gizleme/yeniden başlatan bekçi süreç, URL açma. Bu yetenekler
//  bir arka kapı (RAT) oluşturduğu için şeffaf sürümde yer almaz.
//  Yazılım dağıtımı için PDQ Deploy / Veyon / GPO gibi açık araçlar kullanın.
// ============================================================
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Windows.Forms;

namespace PiriReisLabIzleme
{
    public class LabIzlemeForm : Form
    {
        // --- Sunucu adresleri (okulunuza göre düzenleyin) ---
        private const string LIVE_API = "https://pirireis-api-v3ku.onrender.com/api/labizleme/frame";
        private const string LOCAL_API = "http://192.168.23.244:4000/api/frame";

        private System.Windows.Forms.Timer captureTimer;
        private System.Windows.Forms.Timer topMostTimer;
        private Label lockLabel;
        private PictureBox demoPic;
        private IndicatorForm indicator;
        private NotifyIcon tray;

        private Bitmap screenBmp, resizedBmp;
        private int lastScreenW, lastScreenH;
        private ImageCodecInfo jpegCodec;
        private EncoderParameters encParams;
        private uint lastFrameHash = 0;
        private int unchangedCount = 0;
        private int isSendingCloud = 0, isSendingLocal = 0;

        private string deskNo, studentName, clientId, localIp = "", localMac = "";
        private bool isLocked = false, isDemoActive = false;

        public LabIzlemeForm()
        {
            ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)768 | SecurityProtocolType.Tls;
            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };
            ServicePointManager.DefaultConnectionLimit = 32;
            ServicePointManager.Expect100Continue = false;
            WebRequest.DefaultWebProxy = null;

            deskNo = Environment.MachineName;
            studentName = Environment.UserName;
            clientId = "pc-" + deskNo;
            DetectNetworkInfo();

            foreach (ImageCodecInfo codec in ImageCodecInfo.GetImageEncoders())
            {
                if (codec.MimeType == "image/jpeg") { jpegCodec = codec; break; }
            }
            encParams = new EncoderParameters(1);
            encParams.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 52L);

            // Ana form: yalnızca kilit/demo sırasında tam ekran görünür; normalde
            // ekran dışında ve görünmez durur. Ekran yakalama bundan etkilenmez.
            // (Gizlenme amacı yok; izleme görünür gösterge ve tray ile açıkça ilan edilir.)
            this.Text = "Piri Reis Lab İzleme";
            this.FormBorderStyle = FormBorderStyle.None;
            this.StartPosition = FormStartPosition.Manual;
            this.Location = new Point(-32000, -32000);
            this.Size = new Size(1, 1);
            this.ShowInTaskbar = false;
            this.BackColor = Color.FromArgb(76, 5, 25);
            this.ControlBox = false;
            this.Opacity = 0;

            lockLabel = new Label();
            lockLabel.Dock = DockStyle.Fill;
            lockLabel.ForeColor = Color.White;
            lockLabel.Font = new Font("Segoe UI", 24, FontStyle.Bold);
            lockLabel.TextAlign = ContentAlignment.MiddleCenter;
            lockLabel.Text = "EKRAN KİLİTLİ (DİKKAT MODU)\r\n\r\nÖğretmen dersi anlatıyor. Lütfen öğretmeninize odaklanın.";
            lockLabel.Visible = false;
            this.Controls.Add(lockLabel);

            demoPic = new PictureBox();
            demoPic.Dock = DockStyle.Fill;
            demoPic.BackColor = Color.Black;
            demoPic.SizeMode = PictureBoxSizeMode.Zoom;
            demoPic.Visible = false;
            this.Controls.Add(demoPic);

            this.FormClosing += OnFormClosing;

            // Görünür "izleme açık" göstergesi + tray simgesi
            indicator = new IndicatorForm();
            indicator.Show();
            SetupTray();

            // Yakalama/gönderme ZAMANLAYICILARINI önce başlat: böylece ilk açılıştaki
            // bilgilendirme penceresi açık olsa bile görüntü gönderimi engellenmez.
            // (Modal pencere kendi mesaj döngüsünü çalıştırdığı için zamanlayıcılar işler.)
            captureTimer = new System.Windows.Forms.Timer();
            captureTimer.Interval = 320;
            captureTimer.Tick += OnCaptureTick;
            captureTimer.Start();

            topMostTimer = new System.Windows.Forms.Timer();
            topMostTimer.Interval = 500;
            topMostTimer.Tick += OnTopMostTick;
            topMostTimer.Start();

            // Şeffaflık: öğrenciye ilk açılışta bir kez bilgi ver (artık gönderimi engellemez).
            ShowConsentOnce();
        }

        // Odağı çalmadan üstte durabilmesi için (gösterge/kilit)
        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams cp = base.CreateParams;
                cp.ExStyle |= 0x08000000; // WS_EX_NOACTIVATE
                return cp;
            }
        }
        protected override bool ShowWithoutActivation { get { return true; } }

        private void SetupTray()
        {
            tray = new NotifyIcon();
            try
            {
                string ico = Path.Combine(Application.StartupPath, "labmaster.ico");
                tray.Icon = File.Exists(ico) ? new Icon(ico) : SystemIcons.Information;
            }
            catch { tray.Icon = SystemIcons.Information; }
            tray.Text = "Piri Reis Lab İzleme — açık";
            tray.Visible = true;

            ContextMenuStrip menu = new ContextMenuStrip();
            ToolStripMenuItem info = new ToolStripMenuItem("Bu nedir?");
            info.Click += delegate { ShowInfo(); };
            menu.Items.Add(info);
            tray.ContextMenuStrip = menu;
            tray.DoubleClick += delegate { ShowInfo(); };

            try
            {
                tray.BalloonTipTitle = "Lab İzleme açık";
                tray.BalloonTipText = "Bu ders bilgisayarının ekranı öğretmen tarafından görülebilir.";
                tray.ShowBalloonTip(4000);
            }
            catch { }
        }

        private void ShowInfo()
        {
            MessageBox.Show(
                "Bu bilgisayar bir okul laboratuvarı bilgisayarıdır ve ders sırasında " +
                "öğretmen panosundan izlenebilir.\r\n\r\n" +
                "• Öğretmen ekran görüntünüzü görebilir.\r\n" +
                "• Öğretmen 'dikkat modu' ile ekranı geçici kilitleyebilir veya kendi ekranını yansıtabilir.\r\n\r\n" +
                "Bu araç fare/klavyenizi uzaktan kontrol ETMEZ, bilgisayarınıza program KURMAZ.\r\n" +
                "Sorularınız için okul bilişim öğretmeninize başvurun.",
                "Piri Reis Lab İzleme", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }

        private void ShowConsentOnce()
        {
            try
            {
                string appDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "PiriReisLabIzleme");
                if (!Directory.Exists(appDir)) Directory.CreateDirectory(appDir);
                string flag = Path.Combine(appDir, "bilgilendirme_goruldu.txt");
                if (!File.Exists(flag))
                {
                    ShowInfo();
                    File.WriteAllText(flag, DateTime.Now.ToString());
                }
            }
            catch { }
        }

        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            if (e.CloseReason != CloseReason.WindowsShutDown)
            {
                e.Cancel = true;
                if (!isLocked && !isDemoActive) HideOverlay();
            }
            else
            {
                if (tray != null) tray.Visible = false;
            }
        }

        private void HideOverlay()
        {
            this.Opacity = 0;
            this.Location = new Point(-32000, -32000);
            this.Size = new Size(1, 1);
            if (indicator != null) indicator.SetMonitoring(true);
        }

        private void ShowOverlayFullScreen()
        {
            Rectangle b = Screen.PrimaryScreen.Bounds;
            this.Location = b.Location;
            this.Size = b.Size;
            this.Opacity = 1;
            this.TopMost = true;
            this.BringToFront();
        }

        private void OnTopMostTick(object sender, EventArgs e)
        {
            if (isLocked || isDemoActive) ShowOverlayFullScreen();
            else if (indicator != null) indicator.KeepVisible();
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
                                    byte[] mac = ni.GetPhysicalAddress().GetAddressBytes();
                                    string[] hex = new string[mac.Length];
                                    for (int i = 0; i < mac.Length; i++) hex[i] = mac[i].ToString("X2");
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
            for (int i = 0; i < bytes.Length; i += step) { hash ^= bytes[i]; hash *= 16777619u; }
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
                lastScreenW = bounds.Width; lastScreenH = bounds.Height;
            }

            using (Graphics g = Graphics.FromImage(screenBmp))
                g.CopyFromScreen(bounds.Location, Point.Empty, bounds.Size, CopyPixelOperation.SourceCopy);

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
                if (h == lastFrameHash && unchangedCount < 6) { unchangedCount++; frameChanged = false; return null; }
                lastFrameHash = h; unchangedCount = 0; frameChanged = true;
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
                req.Timeout = timeoutMs; req.ReadWriteTimeout = timeoutMs;
                req.KeepAlive = true; req.Proxy = null; req.ContentLength = data.Length;
                using (Stream rs = req.GetRequestStream()) rs.Write(data, 0, data.Length);
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                    return sr.ReadToEnd();
            }
            catch { return null; }
        }

        private void OnCaptureTick(object sender, EventArgs e)
        {
            if (isSendingCloud == 1 && isSendingLocal == 1) return;
            try
            {
                string resStr; bool changed;
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
                    + "\"clientType\":\"native-transparent\""
                    + (changed && dataUrl != null ? ",\"frame\":\"" + dataUrl + "\"" : "")
                    + "}";
                byte[] payload = Encoding.UTF8.GetBytes(json);

                if (Interlocked.CompareExchange(ref isSendingLocal, 1, 0) == 0)
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        try
                        {
                            string r = PostJson(LOCAL_API, payload, 600);
                            if (!string.IsNullOrEmpty(r)) this.BeginInvoke((MethodInvoker)delegate { ApplyServerResponse(r); });
                        }
                        catch { }
                        finally { Interlocked.Exchange(ref isSendingLocal, 0); }
                    });

                if (Interlocked.CompareExchange(ref isSendingCloud, 1, 0) == 0)
                    ThreadPool.QueueUserWorkItem(delegate
                    {
                        try
                        {
                            string r = PostJson(LIVE_API, payload, 2500);
                            if (!string.IsNullOrEmpty(r)) this.BeginInvoke((MethodInvoker)delegate { ApplyServerResponse(r); });
                        }
                        catch { }
                        finally { Interlocked.Exchange(ref isSendingCloud, 0); }
                    });
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

        // Sunucu yanıtından YALNIZCA görüntüleme işlevleri uygulanır:
        // ekran kilidi (dikkat modu) ve öğretmen ekranı yansıtma.
        // Uzaktan komut/kurulum/girdi alanları BİLEREK işlenmez.
        private void ApplyServerResponse(string json)
        {
            bool locked = Regex.IsMatch(json, "\"locked\"\\s*:\\s*true");
            bool streamActive = Regex.IsMatch(json, "\"teacherStreamActive\"\\s*:\\s*true");

            if (locked)
            {
                string msg = ExtractJsonString(json, "lockMessage");
                if (!string.IsNullOrEmpty(msg))
                    lockLabel.Text = "EKRAN KİLİTLİ (DİKKAT MODU)\r\n\r\n" + msg;
                isLocked = true;
                demoPic.Visible = false;
                lockLabel.Visible = true;
                if (indicator != null) indicator.Hide();
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
                        byte[] img = Convert.FromBase64String(b64);
                        MemoryStream ms = new MemoryStream(img);
                        Image old = demoPic.Image;
                        demoPic.Image = Image.FromStream(ms);
                        if (old != null) old.Dispose();
                    }
                    catch { }
                }
                isDemoActive = true;
                lockLabel.Visible = false;
                demoPic.Visible = true;
                if (indicator != null) indicator.Hide();
                ShowOverlayFullScreen();
            }
            else
            {
                if (isLocked || isDemoActive)
                {
                    isLocked = false; isDemoActive = false;
                    lockLabel.Visible = false; demoPic.Visible = false;
                    HideOverlay();
                    if (indicator != null) { indicator.Show(); indicator.SetMonitoring(true); }
                }
            }
        }

        [STAThread]
        public static void Main()
        {
            bool createdNew;
            // Aynı anda tek örnek çalışsın
            using (Mutex mutex = new Mutex(true, "Global\\PiriReisLabIzlemeMutex", out createdNew))
            {
                if (!createdNew) return;
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new LabIzlemeForm());
            }
        }
    }

    // Ekranın üstünde her zaman görünen küçük "izleme açık" şeridi
    public class IndicatorForm : Form
    {
        private System.Windows.Forms.Timer blink;
        private bool on = true;
        private Label dot, text;

        public IndicatorForm()
        {
            this.FormBorderStyle = FormBorderStyle.None;
            this.StartPosition = FormStartPosition.Manual;
            this.ShowInTaskbar = false;
            this.TopMost = true;
            this.BackColor = Color.FromArgb(150, 20, 35);
            this.Size = new Size(620, 48);
            Rectangle wa = Screen.PrimaryScreen.WorkingArea;
            this.Location = new Point(wa.Left + (wa.Width - this.Width) / 2, wa.Top + 4);

            dot = new Label();
            dot.Text = "●";
            dot.ForeColor = Color.FromArgb(255, 210, 210);
            dot.Font = new Font("Segoe UI", 16, FontStyle.Bold);
            dot.AutoSize = true;
            dot.Location = new Point(14, 10);
            this.Controls.Add(dot);

            text = new Label();
            text.Text = "ÖĞRETMEN BU EKRANI İZLİYOR OLABİLİR — Lab İzleme açık";
            text.ForeColor = Color.White;
            text.Font = new Font("Segoe UI", 12, FontStyle.Bold);
            text.AutoSize = true;
            text.Location = new Point(42, 12);
            this.Controls.Add(text);

            blink = new System.Windows.Forms.Timer();
            blink.Interval = 800;
            blink.Tick += delegate { on = !on; dot.Visible = on; };
            blink.Start();
        }

        protected override CreateParams CreateParams
        {
            get { CreateParams cp = base.CreateParams; cp.ExStyle |= 0x08000000 | 0x80; return cp; } // NOACTIVATE + TOOLWINDOW
        }
        protected override bool ShowWithoutActivation { get { return true; } }

        public void SetMonitoring(bool active)
        {
            this.Visible = active;
        }
        public void KeepVisible()
        {
            if (this.Visible) { this.TopMost = true; this.BringToFront(); }
        }
    }
}
