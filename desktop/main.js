const { app, BrowserWindow, Menu, Tray, nativeImage, session, dialog } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;
let isQuitting = false;

const CLOUD_URL = 'https://ogretmenlerodasi.info/labizleme';
const LOCAL_URL = 'http://localhost:4000/labizleme';
let targetUrl = CLOUD_URL;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 950,
    minWidth: 1024,
    minHeight: 700,
    title: 'Piri Reis Bilişim - Laboratuvar Yönetimi ve Canlı İzleme',
    backgroundColor: '#09090b',
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Enable seamless screen capture without prompts
  session.defaultSession.setDisplayMediaRequestHandler((request, callback) => {
    session.defaultSession.getDesktopCapturerSources({ types: ['screen'] }).then((sources) => {
      if (sources.length > 0) {
        callback({ video: sources[0] });
      } else {
        callback({});
      }
    });
  });

  mainWindow.loadURL(targetUrl);

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      if (tray) {
        tray.displayBalloon({
          title: 'Piri Reis Laboratuvar Yönetimi',
          content: 'Uygulama arka planda sistem tepsisinde çalışmaya devam ediyor.'
        });
      }
    }
  });

  buildMenu();
  buildTray();
}

function buildMenu() {
  const template = [
    {
      label: 'Görünüm',
      submenu: [
        { label: 'Yenile', accelerator: 'Ctrl+R', click: () => mainWindow && mainWindow.reload() },
        { label: 'Zorla Yenile', accelerator: 'Ctrl+Shift+R', click: () => mainWindow && mainWindow.webContents.reloadIgnoringCache() },
        { type: 'separator' },
        { label: 'Tam Ekran', accelerator: 'F11', click: () => mainWindow && mainWindow.setFullScreen(!mainWindow.isFullScreen()) },
        { label: 'Geliştirici Araçları', accelerator: 'F12', click: () => mainWindow && mainWindow.webContents.toggleDevTools() }
      ]
    },
    {
      label: 'Bağlantı & Sunucu',
      submenu: [
        {
          label: '🌐 Bulut Sunucu (ogretmenlerodasi.info)',
          type: 'radio',
          checked: targetUrl === CLOUD_URL,
          click: () => switchServer(CLOUD_URL)
        },
        {
          label: '🏠 Yerel Ağ (Localhost :4000)',
          type: 'radio',
          checked: targetUrl === LOCAL_URL,
          click: () => switchServer(LOCAL_URL)
        },
        {
          label: '🔗 Özel Sunucu IP Adresi...',
          click: async () => {
            // Can reload with custom IP
            switchServer(CLOUD_URL);
          }
        }
      ]
    },
    {
      label: 'Hızlı Eylemler',
      submenu: [
        { label: '🔒 Tüm Ekranları Kilitle', click: () => sendAction({ action: 'toggleLockAll', lock: true }) },
        { label: '🔓 Tüm Kilitleri Aç', click: () => sendAction({ action: 'toggleLockAll', lock: false }) },
        { type: 'separator' },
        { label: '🧹 Masaüstlerini Temizle', click: () => sendBatchAction('clean_desktop', 'Masaüstü Temizliği') },
        { label: '🛑 Açık Tarayıcıları Kapat', click: () => sendBatchAction('kill_browsers', 'Tarayıcıları Kapat') },
        { label: '🔌 Bilgisayarları Kapat', click: () => sendBatchAction('shutdown', 'Bilgisayarları Kapat') }
      ]
    },
    {
      label: 'Yardım',
      submenu: [
        {
          label: 'Hakkında',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Piri Reis MTAL Laboratuvar Yönetimi',
              message: 'Piri Reis MTAL Bilişim Teknolojileri Laboratuvar Yönetim & Canlı İzleme Masası\nSürüm 1.0 (Windows Masaüstü Uygulaması)'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function buildTray() {
  if (tray) return;

  const icon = nativeImage.createFromBuffer(createDefaultIconBuffer());
  tray = new Tray(icon);
  tray.setToolTip('Piri Reis Laboratuvar Yönetimi');

  const contextMenu = Menu.buildFromTemplate([
    { label: '🖥️ Yönetim Panelini Aç', click: () => { mainWindow.show(); mainWindow.focus(); } },
    { type: 'separator' },
    { label: '🔒 Tüm Ekranları Kilitle', click: () => sendAction({ action: 'toggleLockAll', lock: true }) },
    { label: '🔓 Tüm Kilitleri Aç', click: () => sendAction({ action: 'toggleLockAll', lock: false }) },
    { label: '🧹 Masaüstlerini Temizle', click: () => sendBatchAction('clean_desktop', 'Masaüstü Temizliği') },
    { label: '🔌 Bilgisayarları Kapat', click: () => sendBatchAction('shutdown', 'Bilgisayarları Kapat') },
    { type: 'separator' },
    {
      label: '❌ Çıkış',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

function switchServer(url) {
  targetUrl = url;
  if (mainWindow) {
    mainWindow.loadURL(targetUrl);
  }
}

function sendAction(payload) {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      if (typeof sendTeacherAction === 'function') {
        sendTeacherAction(${JSON.stringify(payload)});
      }
    `);
  }
}

function sendBatchAction(actionKey, actionTitle) {
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      if (typeof runBatchAction === 'function') {
        runBatchAction('${actionKey}', '${actionTitle}');
      }
    `);
  }
}

function createDefaultIconBuffer() {
  // 16x16 RGBA buffer with a cyan circle
  const size = 16;
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - 7.5;
      const dy = y - 7.5;
      if (dx * dx + dy * dy <= 49) {
        buf[idx] = 14;     // R
        buf[idx + 1] = 165; // G
        buf[idx + 2] = 233; // B
        buf[idx + 3] = 255; // A
      }
    }
  }
  return buf;
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('before-quit', () => {
  isQuitting = true;
});
