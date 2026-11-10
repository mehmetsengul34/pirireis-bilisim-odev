import time
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Request, Response
from pydantic import BaseModel

router = APIRouter(prefix="/api/labizleme", tags=["labizleme"])

# In-memory classroom & student state on the cloud backend
students: Dict[str, Dict[str, Any]] = {}
arp_devices_cache: List[Dict[str, str]] = []
arp_last_updated: float = 0.0

classroom_state: Dict[str, Any] = {
    "lockAll": False,
    "lockMessage": "Öğretmen dersi anlatıyor. Lütfen ekranınıza değil öğretmeninize odaklanın.",
    "teacherStreamActive": False,
    "teacherFrame": None,
    "announcement": None,
    "openUrlCommand": None,
}


class FramePayload(BaseModel):
    id: Optional[str] = None
    deskNo: Optional[str] = None
    studentName: Optional[str] = None
    name: Optional[str] = None
    frame: Optional[str] = None
    resolution: Optional[str] = None
    handRaised: Optional[bool] = None
    sharingActive: Optional[bool] = None
    clientType: Optional[str] = None
    localIp: Optional[str] = None
    mac: Optional[str] = None


class ActionPayload(BaseModel):
    action: str
    lock: Optional[bool] = None
    message: Optional[str] = None
    studentId: Optional[str] = None
    url: Optional[str] = None
    active: Optional[bool] = None
    frame: Optional[str] = None


class ArpSyncPayload(BaseModel):
    teacherIp: Optional[str] = None
    hostname: Optional[str] = None
    devices: List[Dict[str, str]] = []


@router.get("/state")
def get_lab_state(request: Request, response: Response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, proxy-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"

    now = time.time() * 1000.0
    stale_keys = []
    for key, st in list(students.items()):
        age = now - st.get("lastSeen", 0)
        frame_age = now - st.get("lastFrameAt", 0)
        if frame_age > 5000:
            st["frame"] = None
            st["sharingActive"] = False
        if age > 6000:
            st["online"] = False
            st["frame"] = None
            st["sharingActive"] = False
        if age > 60000:
            stale_keys.append(key)

    for k in stale_keys:
        students.pop(k, None)

    return {
        "teacherIp": "ogretmenlerodasi.info/labizleme",
        "port": 443,
        "hostname": "CLOUD-LAB-MASTER",
        "serverTime": time.strftime("%H:%M:%S"),
        "arpDevices": arp_devices_cache,
        "arpLastUpdated": arp_last_updated,
        "classroomState": {
            "lockAll": classroom_state["lockAll"],
            "lockMessage": classroom_state["lockMessage"],
            "teacherStreamActive": classroom_state["teacherStreamActive"],
            "announcement": classroom_state["announcement"],
            "openUrlCommand": classroom_state["openUrlCommand"],
        },
        "students": list(students.values()),
    }


@router.post("/frame")
def post_student_frame(payload: FramePayload, request: Request):
    forwarded = request.headers.get("x-forwarded-for", "")
    client_ip = (
        payload.localIp
        or (forwarded.split(",")[0].strip() if forwarded else "")
        or (request.client.host if request.client else "Bilinmiyor")
    )
    student_id = payload.id or client_ip
    existing = students.get(student_id, {})

    desk_no = payload.deskNo or existing.get("deskNo") or "PC"
    student_name = payload.studentName or existing.get("studentName") or "Öğrenci"

    now_ms = time.time() * 1000.0
    now_str = time.strftime("%H:%M:%S")
    has_new_frame = isinstance(payload.frame, str) and len(payload.frame) > 20
    is_native = payload.clientType == "native"

    last_native_at = now_ms if (is_native and has_new_frame) else existing.get("lastNativeFrameAt", 0)
    native_active = (now_ms - last_native_at) < 5000
    prev_frame_age = now_ms - existing.get("lastFrameAt", 0)

    if has_new_frame:
        active_frame = payload.frame
        last_frame_at = now_ms
        frame_time_str = now_str
        sharing_active = True
    elif native_active:
        active_frame = existing.get("frame")
        last_frame_at = existing.get("lastFrameAt", 0)
        frame_time_str = existing.get("frameTimeStr", "")
        sharing_active = True
    elif payload.sharingActive is False:
        active_frame = None
        last_frame_at = existing.get("lastFrameAt", 0)
        frame_time_str = existing.get("frameTimeStr", "")
        sharing_active = False
    else:
        active_frame = existing.get("frame") if prev_frame_age < 4500 else None
        last_frame_at = existing.get("lastFrameAt", 0)
        frame_time_str = existing.get("frameTimeStr", "")
        sharing_active = bool(active_frame is not None)

    updated = {
        "id": student_id,
        "deskNo": desk_no,
        "studentName": student_name,
        "name": payload.name or f"{desk_no} ({student_name})",
        "ip": client_ip,
        "mac": payload.mac or existing.get("mac") or "",
        "frame": active_frame,
        "lastFrameAt": last_frame_at,
        "lastNativeFrameAt": last_native_at,
        "frameTimeStr": frame_time_str,
        "sharingActive": sharing_active,
        "clientType": "native" if native_active else (payload.clientType or existing.get("clientType") or "web"),
        "resolution": payload.resolution or existing.get("resolution") or "",
        "handRaised": bool(payload.handRaised) if payload.handRaised is not None else bool(existing.get("handRaised", False)),
        "locked": existing.get("locked", False),
        "privateMessage": existing.get("privateMessage", None),
        "online": True,
        "firstSeen": existing.get("firstSeen") or now_str,
        "lastSeen": now_ms,
    }
    students[student_id] = updated

    return {
        "ok": True,
        "nativeAgentActive": native_active,
        "locked": bool(classroom_state["lockAll"] or updated["locked"]),
        "lockMessage": classroom_state["lockMessage"],
        "teacherStreamActive": classroom_state["teacherStreamActive"],
        "teacherFrame": classroom_state["teacherFrame"] if classroom_state["teacherStreamActive"] else None,
        "announcement": updated["privateMessage"] or classroom_state["announcement"],
        "openUrlCommand": classroom_state["openUrlCommand"],
    }


@router.post("/action")
def post_teacher_action(payload: ActionPayload):
    action = payload.action
    now_str = time.strftime("%H:%M:%S")

    if action == "toggleLockAll":
        classroom_state["lockAll"] = bool(payload.lock)
        if payload.message:
            classroom_state["lockMessage"] = payload.message
    elif action == "toggleLockStudent":
        if payload.studentId and payload.studentId in students:
            students[payload.studentId]["locked"] = bool(payload.lock)
    elif action == "announce":
        if payload.message:
            classroom_state["announcement"] = {"message": payload.message, "timestamp": now_str}
        else:
            classroom_state["announcement"] = None
            for st in students.values():
                st["privateMessage"] = None
    elif action == "privateMessage":
        if payload.studentId and payload.studentId in students:
            students[payload.studentId]["privateMessage"] = (
                {"message": f"[Özel Mesaj] {payload.message}", "timestamp": now_str}
                if payload.message
                else None
            )
    elif action == "openUrl":
        classroom_state["openUrlCommand"] = (
            {"id": str(int(time.time() * 1000)), "url": payload.url, "timestamp": int(time.time() * 1000)}
            if payload.url
            else None
        )
    elif action == "teacherScreen":
        classroom_state["teacherStreamActive"] = bool(payload.active)
        classroom_state["teacherFrame"] = payload.frame if payload.active else None
    elif action == "clearHand":
        if payload.studentId and payload.studentId in students:
            students[payload.studentId]["handRaised"] = False
    elif action == "clearOffline":
        for k in list(students.keys()):
            if not students[k].get("online") or not students[k].get("frame"):
                students.pop(k, None)

    return {"ok": True, "classroomState": classroom_state}


@router.post("/arp")
def sync_local_arp(payload: ArpSyncPayload):
    global arp_devices_cache, arp_last_updated
    arp_devices_cache = payload.devices or []
    arp_last_updated = time.time() * 1000.0
    return {"ok": True, "count": len(arp_devices_cache)}


BAT_CONTENT = r"""@echo off
chcp 65001 >nul
title Torbali Piri Reis Ticaret MTAL - LanSchool Ogrenci Servisi Kurulumu

set "INSTALL_DIR=%LOCALAPPDATA%\PiriReisLabService"
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"

set "CS_FILE=%INSTALL_DIR%\LabAgent.cs"
set "EXE_FILE=%INSTALL_DIR%\PiriReisLabHost.exe"
set "GUARD_FILE=%INSTALL_DIR%\PiriReisLabGuard.exe"
set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "VBS_STARTUP=%STARTUP_DIR%\PiriReisLabAgent.vbs"

:: Mevcut calisan eski surecleri durdur (guncelleme yapabilmek icin)
taskkill /f /im PiriReisLabHost.exe >nul 2>&1
taskkill /f /im PiriReisLabGuard.exe >nul 2>&1
taskkill /f /im WindowsAudioHost.exe >nul 2>&1
taskkill /f /im wscript.exe >nul 2>&1

:: C# Kaynak Kodunu Cikar (45. satirdan itibaren)
more +45 "%~f0" > "%CS_FILE%"

:: Windows'un Dahili .NET Derleyicisi (csc.exe) ile Penceresiz WinExe Olarak Derle
set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if not exist "%CSC_EXE%" set "CSC_EXE=%SystemRoot%\Microsoft.NET\Framework\v4.0.30319\csc.exe"

"%CSC_EXE%" /nologo /target:winexe /out:"%EXE_FILE%" /r:System.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll "%CS_FILE%" >nul 2>&1

:: Bilgisayar Her Acildiginda Otomatik Baslamasi Icin Kalicilik Noktalari
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.Run chr^(34^) ^& "%EXE_FILE%" ^& chr^(34^), 0, False
) > "%VBS_STARTUP%"

reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "PiriReisLabService" /t REG_SZ /d "\"%EXE_FILE%\"" /f >nul 2>&1
schtasks /create /tn "PiriReisLabAgent" /tr "\"%EXE_FILE%\"" /sc onlogon /f >nul 2>&1

:: Masaustunde eski kisayol varsa yeni arka plan servisine yonlendir
set "SHORTCUT_PATH=%USERPROFILE%\Desktop\Lab Ekran Paylasimi.lnk"
if exist "%SHORTCUT_PATH%" del /f /q "%SHORTCUT_PATH%" >nul 2>&1

:: Servisi Hemen Arka Planda (LanSchool Modunda Gorunmez Olarak) Baslat
start "" "%EXE_FILE%"
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

namespace PiriReisLabService
{
    public class LabAgentForm : Form
    {
        private Label lockLabel;
        private PictureBox demoPic;
        private NotifyIcon trayIcon;
        private ToolStripMenuItem handMenuItem;
        private System.Windows.Forms.Timer captureTimer;
        private System.Windows.Forms.Timer topMostTimer;
        private bool isLocked = false;
        private bool isDemoActive = false;
        private bool handRaised = false;
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

            this.Text = "Piri Reis MTAL - LanSchool Ogrenci Servisi";
            this.FormBorderStyle = FormBorderStyle.None;
            this.WindowState = FormWindowState.Minimized;
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

            SetupTrayIcon();

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

        private void SetupTrayIcon()
        {
            try
            {
                ContextMenuStrip menu = new ContextMenuStrip();
                ToolStripMenuItem statusItem = new ToolStripMenuItem("Torbali Piri Reis MTAL - Sinif Izleme Aktif (" + deskNo + ")");
                statusItem.Enabled = false;
                menu.Items.Add(statusItem);
                menu.Items.Add(new ToolStripSeparator());

                handMenuItem = new ToolStripMenuItem("Soz Iste / Yardim Iste");
                handMenuItem.Click += delegate
                {
                    handRaised = !handRaised;
                    handMenuItem.Text = handRaised ? "Soz Istegi Gonderildi (Iptal Et)" : "Soz Iste / Yardim Iste";
                };
                menu.Items.Add(handMenuItem);

                trayIcon = new NotifyIcon();
                trayIcon.Icon = SystemIcons.Shield;
                trayIcon.Text = "Piri Reis MTAL - Sinif Izleme Servisi (" + deskNo + ")";
                trayIcon.ContextMenuStrip = menu;
                trayIcon.Visible = true;
            }
            catch { }
        }

        protected override CreateParams CreateParams
        {
            get
            {
                CreateParams cp = base.CreateParams;
                cp.ExStyle |= 0x80; // WS_EX_TOOLWINDOW
                return cp;
            }
        }

        protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
        {
            if ((keyData & Keys.Alt) == Keys.Alt || (keyData & Keys.Control) == Keys.Control || keyData == Keys.Escape)
            {
                if (isLocked || isDemoActive) return true;
            }
            return base.ProcessCmdKey(ref msg, keyData);
        }

        private void OnTopMostTick(object sender, EventArgs e)
        {
            if (isLocked || isDemoActive)
            {
                if (this.WindowState != FormWindowState.Maximized)
                {
                    this.WindowState = FormWindowState.Maximized;
                }
                this.TopMost = true;
                this.BringToFront();
                this.Activate();
            }
        }

        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            if (e.CloseReason != CloseReason.WindowsShutDown)
            {
                e.Cancel = true;
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
                    + "\"handRaised\":" + (handRaised ? "true" : "false") + ","
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
                this.Opacity = 1;
                this.WindowState = FormWindowState.Maximized;
                this.BringToFront();
                this.Activate();
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
                this.Opacity = 1;
                this.WindowState = FormWindowState.Maximized;
                this.BringToFront();
            }
            else
            {
                if (isLocked || isDemoActive)
                {
                    isLocked = false;
                    isDemoActive = false;
                    lockLabel.Visible = false;
                    demoPic.Visible = false;
                    this.Opacity = 0;
                    this.WindowState = FormWindowState.Minimized;
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
                            Thread.Sleep(1500);
                        }
                    });
                }
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new LabAgentForm());
                return;
            }

            bool createdNew;
            using (Mutex mutex = new Mutex(true, "Global\\PiriReisLabWatchdogMutex", out createdNew))
            {
                if (!createdNew) return;
                string exePath = Application.ExecutablePath;
                string dir = Path.GetDirectoryName(exePath);
                string workerExe = Path.Combine(dir, "PiriReisLabGuard.exe");
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
                    Thread.Sleep(500);
                }
            }
        }
    }
}
"""


@router.get("/ogrenci-istemci.bat")
def download_student_bat():
    content = BAT_CONTENT.replace("\r\n", "\n").replace("\n", "\r\n")
    return Response(
        content=content.encode("utf-8"),
        media_type="application/octet-stream",
        headers={"Content-Disposition": 'attachment; filename="ogrenci-istemci.bat"'},
    )
