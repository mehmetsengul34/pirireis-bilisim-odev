// ============================================================
//  Piri Reis Lab Dağıtım Hizmeti (PiriReisLabDeploy)
//
//  GÖRÜNÜR bir Windows hizmetidir (sistemde Hizmetler listesinde "PiriReisLabDeploy"
//  adıyla görünür). Tek işi: öğretmen panosundan onaylanmış, sunucuya yüklenmiş ve
//  SHA-256 ile doğrulanan bir KURULUM DOSYASINI indirip sessizce çalıştırmaktır.
//
//  GÜVENLİK İLKELERİ (bilerek dar kapsam):
//   - Yalnızca "install_verified" tipli iş çalıştırılır.
//   - İndirme adresi yalnızca yapılandırılan sunucudaki /api/labizleme/installers/ olabilir.
//   - İndirilen dosyanın SHA-256'sı, panonun verdiği beklenen değerle birebir eşleşmeli;
//     eşleşmezse dosya SİLİNİR ve kurulum yapılmaz.
//   - Yalnızca .exe / .msi kurulum dosyası çalıştırılır. Keyfi komut, PowerShell,
//     winget veya ajan öz-güncellemesi YOKTUR.
//   - TLS doğrulaması normaldir (sertifika atlatma yok).
//   - Her adım %ProgramData%\PiriReisLabIzleme\deploy.log dosyasına yazılır.
//
//  Yapılandırma: %ProgramData%\PiriReisLabIzleme\deploy.config (satır satır KEY=VALUE)
//     ApiBase=https://ogretmenlerodasi.info
//     Token=<LABIZLE_DEPLOY_TOKEN ile aynı; sunucuda tanımlıysa zorunlu>
// ============================================================
using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.ServiceProcess;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;

namespace PiriReisLabDeploy
{
    public class DeployService : ServiceBase
    {
        private Thread worker;
        private volatile bool running = false;
        private string apiBase = "https://ogretmenlerodasi.info";
        private string token = "";
        private readonly string machine = Environment.MachineName;
        private readonly string appDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "PiriReisLabIzleme");
        private string logPath, installersDir;
        private string lastJobId = "";

        public DeployService()
        {
            this.ServiceName = "PiriReisLabDeploy";
            this.CanStop = true;
            this.CanShutdown = true;
        }

        protected override void OnStart(string[] args)
        {
            LoadConfig();
            running = true;
            worker = new Thread(Loop) { IsBackground = true };
            worker.Start();
            Log("Hizmet başladı. Makine=" + machine + " ApiBase=" + apiBase);
        }

        protected override void OnStop() { running = false; Log("Hizmet durduruldu."); }
        protected override void OnShutdown() { running = false; }

        private void LoadConfig()
        {
            try { if (!Directory.Exists(appDir)) Directory.CreateDirectory(appDir); } catch { }
            logPath = Path.Combine(appDir, "deploy.log");
            installersDir = Path.Combine(appDir, "indirilen");
            try { if (!Directory.Exists(installersDir)) Directory.CreateDirectory(installersDir); } catch { }
            try
            {
                string cfg = Path.Combine(appDir, "deploy.config");
                if (File.Exists(cfg))
                {
                    foreach (string line in File.ReadAllLines(cfg))
                    {
                        int i = line.IndexOf('=');
                        if (i <= 0) continue;
                        string k = line.Substring(0, i).Trim();
                        string v = line.Substring(i + 1).Trim();
                        if (k.Equals("ApiBase", StringComparison.OrdinalIgnoreCase) && v.Length > 0) apiBase = v.TrimEnd('/');
                        else if (k.Equals("Token", StringComparison.OrdinalIgnoreCase)) token = v;
                    }
                }
            }
            catch (Exception e) { Log("Yapılandırma okunamadı: " + e.Message); }
        }

        private void Log(string msg)
        {
            try { File.AppendAllText(logPath, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "  " + msg + "\r\n", Encoding.UTF8); }
            catch { }
        }

        private void Loop()
        {
            while (running)
            {
                try { PollOnce(); }
                catch (Exception e) { Log("Döngü hatası: " + e.Message); }
                for (int i = 0; i < 50 && running; i++) Thread.Sleep(100); // ~5 sn
            }
        }

        private string Http(string method, string url, string body, out int code)
        {
            code = 0;
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.Method = method;
            req.Timeout = 30000; req.ReadWriteTimeout = 60000;
            req.Proxy = null; req.KeepAlive = false;
            if (!string.IsNullOrEmpty(token)) req.Headers.Add("X-Deploy-Token", token);
            if (body != null)
            {
                req.ContentType = "application/json; charset=utf-8";
                byte[] b = Encoding.UTF8.GetBytes(body);
                req.ContentLength = b.Length;
                using (Stream s = req.GetRequestStream()) s.Write(b, 0, b.Length);
            }
            try
            {
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                {
                    code = (int)resp.StatusCode;
                    using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                        return sr.ReadToEnd();
                }
            }
            catch (WebException we)
            {
                if (we.Response is HttpWebResponse) code = (int)((HttpWebResponse)we.Response).StatusCode;
                return null;
            }
        }

        private static string J(string json, string key)
        {
            if (string.IsNullOrEmpty(json)) return null;
            Match m = Regex.Match(json, "\"" + key + "\"\\s*:\\s*\"((?:\\\\.|[^\"\\\\])*)\"");
            if (!m.Success) return null;
            try { return Regex.Unescape(m.Groups[1].Value); } catch { return m.Groups[1].Value; }
        }

        private void Report(string id, string status, string message)
        {
            string body = "{\"machine\":\"" + Esc(machine) + "\",\"id\":\"" + Esc(id) + "\",\"status\":\""
                + Esc(status) + "\",\"message\":\"" + Esc(message) + "\"}";
            int code; Http("POST", apiBase + "/api/labizleme/deploy-status", body, out code);
            Log("Durum: " + status + " - " + message);
        }

        private static string Esc(string s)
        {
            if (s == null) return "";
            return s.Replace("\\", "\\\\").Replace("\"", "\\\"").Replace("\r", " ").Replace("\n", " ");
        }

        private void PollOnce()
        {
            int code;
            string resp = Http("GET", apiBase + "/api/labizleme/deploy-job/" + Uri.EscapeDataString(machine), null, out code);
            if (string.IsNullOrEmpty(resp) || resp.IndexOf("\"job\"", StringComparison.Ordinal) < 0) return;
            if (resp.IndexOf("\"job\":null", StringComparison.Ordinal) >= 0 || resp.IndexOf("\"job\": null", StringComparison.Ordinal) >= 0) return;

            string type = J(resp, "type");
            string id = J(resp, "id");
            string url = J(resp, "url");
            string fileName = J(resp, "fileName");
            string sha = (J(resp, "sha256") ?? "").ToLowerInvariant();
            string args = J(resp, "args") ?? "";

            if (type != "install_verified") { Log("Bilinmeyen iş tipi yok sayıldı: " + type); return; }
            if (id == lastJobId) return;
            lastJobId = id;

            // Güvenlik kontrolleri
            if (string.IsNullOrEmpty(url) || !url.StartsWith("/api/labizleme/installers/"))
            { Report(id, "error", "Geçersiz indirme adresi."); return; }
            if (sha.Length != 64 || !Regex.IsMatch(sha, "^[0-9a-f]{64}$"))
            { Report(id, "error", "Geçersiz SHA-256."); return; }
            string ext = Path.GetExtension(fileName ?? "").ToLowerInvariant();
            if (ext != ".exe" && ext != ".msi")
            { Report(id, "error", "Yalnızca .exe/.msi dağıtılabilir."); return; }

            string safeName = Path.GetFileName(fileName);
            string local = Path.Combine(installersDir, safeName);
            Report(id, "downloading", "İndiriliyor: " + safeName);
            try
            {
                using (WebClient wc = new WebClient())
                {
                    if (!string.IsNullOrEmpty(token)) wc.Headers.Add("X-Deploy-Token", token);
                    wc.DownloadFile(apiBase + url, local);
                }
            }
            catch (Exception e) { Report(id, "error", "İndirme hatası: " + e.Message); return; }

            // SHA-256 doğrula
            string actual;
            using (var sha256 = SHA256.Create())
            using (var fs = File.OpenRead(local))
                actual = BitConverter.ToString(sha256.ComputeHash(fs)).Replace("-", "").ToLowerInvariant();
            if (actual != sha)
            {
                try { File.Delete(local); } catch { }
                Report(id, "error", "SHA-256 uyuşmadı; dosya silindi (güvenlik).");
                Log("SHA uyuşmazlık: beklenen=" + sha + " gelen=" + actual);
                return;
            }

            // Kurulum dosyası olarak çalıştır (keyfi komut YOK)
            Report(id, "installing", "Kuruluyor: " + safeName);
            try
            {
                ProcessStartInfo psi;
                if (ext == ".msi")
                    psi = new ProcessStartInfo("msiexec.exe", "/i \"" + local + "\" " + args);
                else
                    psi = new ProcessStartInfo(local, args);
                psi.UseShellExecute = false;
                psi.CreateNoWindow = true;
                psi.WindowStyle = ProcessWindowStyle.Hidden;
                using (Process p = Process.Start(psi))
                {
                    p.WaitForExit(15 * 60 * 1000); // en çok 15 dk
                    int exit = p.HasExited ? p.ExitCode : -1;
                    if (exit == 0 || exit == 3010) // 3010 = yeniden başlatma gerekli
                        Report(id, "success", "Kurulum tamamlandı (çıkış kodu " + exit + ").");
                    else
                        Report(id, "error", "Kurulum çıkış kodu " + exit + ".");
                }
            }
            catch (Exception e) { Report(id, "error", "Çalıştırma hatası: " + e.Message); }
            finally { try { File.Delete(local); } catch { } }
        }

        public static void Main(string[] cmdArgs)
        {
            if (cmdArgs != null && cmdArgs.Length > 0 &&
                (cmdArgs[0] == "--console" || cmdArgs[0] == "/console"))
            {
                // Test için konsolda çalıştır
                DeployService s = new DeployService();
                s.LoadConfig();
                s.running = true;
                Console.WriteLine("Konsol modu. Çıkmak için Enter.");
                Thread t = new Thread(s.Loop) { IsBackground = true };
                t.Start();
                Console.ReadLine();
                s.running = false;
                return;
            }
            ServiceBase.Run(new DeployService());
        }
    }
}
