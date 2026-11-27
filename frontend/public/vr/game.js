/* ============================================================
   İzmir Torbalı BİLSEM — VR Duyu & Dil Atölyesi Oyun Mantığı
   Yenilikler & Düzeltmeler:
   - "/vr" (eğik çizgisiz) ve "/vr/" yollarında kesintisiz çalışan ses/betik taban yolu.
   - Başlangıç ("Başla") perdesi kaldırıldı; doğrudan kategori menüsü ve 3D sahne açılır.
   - 3 Öğrenme Modu: Klasik (Görsel+Yazı), Dinleme (Sesi Dinle → Görseli Seç), Okuma (Yalnızca İngilizce Yazı).
   - VR Başlık İçi Tam Kontrol: 3D Kategori Seçimi, 3D Tekrar Dinle / Kategoriler / Mod düğmeleri!
   - Renk kartlarında Stroop renk çakışması giderildi.
   - Mobil dikey ekranda 2×2 3D kart dizilimi ve 2×2 cevap çubuğu.
   - Seri (🔥), puan, yıldız derecesi ve 3D kutlama efektleri.
   ============================================================ */
(function () {
  "use strict";

  // "/vr", "/vr/", "/vr/index.html" ve yerel sunucu "/" yollarının tamamında doğru taban yolu
  const BASE_DIR = window.__VR_BASE || (function () {
    const p = location.pathname;
    if (p.endsWith("/")) return p;
    if (/\.[a-z0-9]+$/i.test(p)) return p.replace(/[^/]*$/, "");
    return p + "/";
  })();
  const AUDIO_BASE = BASE_DIR + "audio/";

  // ---------- İlerleme ve İstatistik Kaydı ----------
  const STORE_KEY = "vr_lang_progress_v2";
  const LEGACY_KEY = "vr_lang_progress_v1";
  const Progress = {
    data: { cats: {}, score: 0 },
    load() {
      try {
        const raw = JSON.parse(localStorage.getItem(STORE_KEY));
        if (raw && raw.cats) {
          this.data = raw;
          return;
        }
        const old = JSON.parse(localStorage.getItem(LEGACY_KEY));
        if (old && typeof old === "object") {
          this.data = { cats: old, score: 0 };
        }
      } catch (e) {
        this.data = { cats: {}, score: 0 };
      }
    },
    save() {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch (e) {}
    },
    done(cat) { return new Set(this.data.cats[cat] || []); },
    mark(cat, id, points) {
      const set = this.done(cat);
      set.add(id);
      this.data.cats[cat] = [...set];
      this.data.score = (this.data.score || 0) + (points || 10);
      this.save();
    },
    resetCat(cat) {
      delete this.data.cats[cat];
      this.save();
    },
    resetAll() {
      this.data = { cats: {}, score: 0 };
      this.save();
    }
  };

  // ---------- Ses Motoru (MP3 + Web Speech TTS + WebAudio Efekt) ----------
  const Sound = {
    ctx: null, muted: false, cache: new Map(), voice: null, rewardToggle: false,
    synth: ("speechSynthesis" in window) ? window.speechSynthesis : null,
    init() {
      if (!this.ctx) {
        try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
      this.pickVoice();
    },
    pickVoice() {
      if (!this.synth || this.voice) return;
      const vs = this.synth.getVoices();
      this.voice = vs.find(v => v.lang && v.lang.toLowerCase().startsWith("en-us")) ||
                   vs.find(v => v.lang && v.lang.toLowerCase().startsWith("en-gb")) ||
                   vs.find(v => v.lang && v.lang.toLowerCase().startsWith("en")) || null;
    },
    toggleMute() {
      this.muted = !this.muted;
      if (this.muted && this.synth) this.synth.cancel();
      return this.muted;
    },
    speak(word, onEnd) {
      if (this.muted || !word) { if (onEnd) onEnd(); return; }
      this.init();
      if (word.hasMp3 === false) {
        this.tts(word.en, onEnd);
        return;
      }
      const url = AUDIO_BASE + encodeURIComponent(word.id) + ".mp3";
      let a = this.cache.get(url);
      if (!a) { a = new Audio(url); this.cache.set(url, a); }
      try { a.currentTime = 0; } catch (e) {}
      a.volume = 1;
      const p = a.play();
      if (p && p.then) {
        p.then(() => { if (onEnd) a.onended = onEnd; })
         .catch(() => this.tts(word.en, onEnd));
      } else {
        this.tts(word.en, onEnd);
      }
    },
    tts(text, onEnd) {
      if (this.muted || !this.synth || !text) { if (onEnd) onEnd(); return; }
      try {
        this.synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US"; u.rate = 0.86; u.pitch = 1.04;
        if (this.voice) u.voice = this.voice;
        if (onEnd) u.onend = onEnd;
        this.synth.speak(u);
      } catch (e) { if (onEnd) onEnd(); }
    },
    reward(name) {
      if (this.muted) return;
      this.init();
      const file = name === "awesome" ? ((this.rewardToggle = !this.rewardToggle) ? "awesome" : "correct") : name;
      const url = AUDIO_BASE + file + ".mp3";
      let a = this.cache.get(url);
      if (!a) { a = new Audio(url); this.cache.set(url, a); }
      try { a.currentTime = 0; } catch (e) {}
      a.volume = 0.95;
      const p = a.play();
      if (p && p.catch) p.catch(() => (name === "try_again" ? this.buzz() : this.chime()));
    },
    chime() {
      if (this.muted || !this.ctx) return;
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = "triangle"; o.frequency.value = f;
        const t = this.ctx.currentTime + i * 0.085;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.32, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
        o.connect(g).connect(this.ctx.destination);
        o.start(t); o.stop(t + 0.26);
      });
    },
    buzz() {
      if (this.muted || !this.ctx) return;
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = "sawtooth"; o.frequency.value = 195;
      const t = this.ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.20);
      o.connect(g).connect(this.ctx.destination);
      o.start(t); o.stop(t + 0.22);
    }
  };
  if (Sound.synth) Sound.synth.onvoiceschanged = () => Sound.pickVoice();

  // ---------- Canvas Yardımcıları (Stroop Çakışmasız Modern Kartlar) ----------
  function roundRect(x, px, py, w, h, r) {
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
  }

  const MODES = [
    { key: "classic", label: "📘 Klasik", desc: "Görsel + Yazı + Ses" },
    { key: "listen",  label: "🎧 Dinle & Bul", desc: "Sesi Dinle → Resmi Seç" },
    { key: "read",    label: "✍️ Okuma", desc: "Türkçe → İngilizce Yazı" }
  ];

  // Nötr koyu lacivert kart yüzeyi + uyumlu çerçeve (renk kelimelerinde Stroop etkisi yaratmaz!)
  const CARD_ACCENTS = ["#38bdf8", "#a78bfa", "#34d399", "#fbbf24", "#f472b6", "#2dd4bf"];

  function makeFaceCanvas(opts) {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 640;
    const x = c.getContext("2d");

    const grad = x.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, "#1e293b");
    grad.addColorStop(1, "#0f172a");
    x.fillStyle = grad;
    roundRect(x, 10, 10, c.width - 20, c.height - 20, 44);
    x.fill();

    // Üst parıltı şeridi
    const borderCol = opts.accent || "#38bdf8";
    x.lineWidth = 10;
    x.strokeStyle = borderCol;
    roundRect(x, 10, 10, c.width - 20, c.height - 20, 44);
    x.stroke();

    if (opts.badge) {
      x.fillStyle = "rgba(255,255,255,0.10)";
      roundRect(x, 34, 32, 84, 54, 18);
      x.fill();
      x.fillStyle = "#cbd5e1";
      x.font = "bold 32px 'Segoe UI',sans-serif";
      x.textAlign = "center"; x.textBaseline = "middle";
      x.fillText(opts.badge, 76, 60);
    }

    x.textAlign = "center"; x.textBaseline = "middle";

    if (opts.onlyText) {
      // Okuma modu: ortada büyük ve net İngilizce kelime
      x.fillStyle = "rgba(56, 189, 248, 0.10)";
      x.beginPath(); x.arc(c.width / 2, 260, 130, 0, Math.PI * 2); x.fill();
      x.fillStyle = "#38bdf8";
      x.font = "bold 76px 'Segoe UI Emoji',sans-serif";
      x.fillText("🔤", c.width / 2, 210);
      x.fillStyle = "#ffffff";
      x.font = "bold 78px 'Trebuchet MS','Segoe UI',sans-serif";
      x.fillText(opts.label || "", c.width / 2, 395, 452);
    } else if (opts.onlyEmoji) {
      // Dinleme modu: ortada büyük görsel/emoji, yazı kopyası yok!
      if (opts.swatch) {
        x.fillStyle = opts.swatch;
        x.beginPath(); x.arc(c.width / 2, 310, 138, 0, Math.PI * 2); x.fill();
        x.lineWidth = 8; x.strokeStyle = "rgba(255,255,255,0.65)"; x.stroke();
      } else {
        x.font = "270px 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif";
        x.fillText(opts.emoji || "❓", c.width / 2, 315);
      }
      x.fillStyle = "#94a3b8";
      x.font = "bold 38px 'Trebuchet MS','Segoe UI',sans-serif";
      x.fillText("🔊 Seç", c.width / 2, 548);
    } else {
      // Klasik mod veya 3D kategori kartı
      if (opts.swatch) {
        x.fillStyle = opts.swatch;
        x.beginPath(); x.arc(c.width / 2, 255, 115, 0, Math.PI * 2); x.fill();
        x.lineWidth = 8; x.strokeStyle = "rgba(255,255,255,0.65)"; x.stroke();
      } else {
        x.font = "235px 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif";
        x.fillText(opts.emoji || "❓", c.width / 2, 255);
      }
      x.fillStyle = "#ffffff";
      x.font = opts.subLabel ? "bold 52px 'Trebuchet MS','Segoe UI',sans-serif" : "bold 68px 'Trebuchet MS','Segoe UI',sans-serif";
      x.fillText(opts.label || "", c.width / 2, opts.subLabel ? 485 : 525, 456);
      if (opts.subLabel) {
        x.fillStyle = borderCol;
        x.font = "bold 36px 'Trebuchet MS','Segoe UI',sans-serif";
        x.fillText(opts.subLabel, c.width / 2, 558, 440);
      }
    }
    return c;
  }

  function makeActionPillCanvas(text, accent) {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 144;
    const x = c.getContext("2d");
    x.fillStyle = "rgba(15, 23, 42, 0.92)";
    roundRect(x, 6, 6, c.width - 12, c.height - 12, 38); x.fill();
    x.lineWidth = 6; x.strokeStyle = accent || "#38bdf8";
    roundRect(x, 6, 6, c.width - 12, c.height - 12, 38); x.stroke();
    x.fillStyle = "#f8fafc";
    x.font = "bold 46px 'Segoe UI Emoji','Trebuchet MS','Segoe UI',sans-serif";
    x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText(text, c.width / 2, c.height / 2 + 2, 476);
    return c;
  }

  // ---------- A-Frame 3D Bileşenleri ----------
  if (window.AFRAME) {
    AFRAME.registerComponent("quiz-card", {
      init() {
        this.el.classList.add("card", "clickable");
        this.el.setAttribute("geometry", "primitive: plane; width: 0.72; height: 0.90");
        this.el.setAttribute("material", "shader: flat; side: double; transparent: true");
        this.el.addEventListener("click", () => {
          const action = this.el.dataset.action;
          const id = this.el.dataset.wordId;
          if (action === "cat" && id) window.VRGame.selectCategoryFrom3D(id);
          else if (action === "replay-cat") window.VRGame.replayCurrentCategory();
          else if (action === "go-menu") window.VRGame.openMenu();
          else if (id) window.VRGame.choose(id, this.el);
        });
        this.el.addEventListener("mouseenter", () => this.el.setAttribute("scale", "1.08 1.08 1.08"));
        this.el.addEventListener("mouseleave", () => this.el.setAttribute("scale", "1 1 1"));
      },
      setCustomFace(opts) {
        const canvas = makeFaceCanvas(opts);
        const tex = new THREE.CanvasTexture(canvas);
        if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
        const mesh = this.el.getObject3D("mesh");
        if (mesh) {
          if (mesh.material.map) mesh.material.map.dispose();
          mesh.material.map = tex;
          mesh.material.color.set("#ffffff");
          mesh.material.needsUpdate = true;
        }
        this.el.dataset.wordId = opts.id || "";
        this.el.dataset.action = opts.action || "answer";
        this.el.setAttribute("scale", "1 1 1");
      },
      flash(ok) {
        const mesh = this.el.getObject3D("mesh");
        if (!mesh) return;
        mesh.material.color.set(ok ? "#22c55e" : "#ef4444");
        setTimeout(() => mesh.material.color.set("#ffffff"), 440);
      }
    });

    AFRAME.registerComponent("vr-action-btn", {
      schema: { label: { type: "string", default: "" }, accent: { type: "string", default: "#38bdf8" }, cmd: { type: "string", default: "" } },
      init() {
        this.el.classList.add("card", "clickable");
        this.el.setAttribute("geometry", "primitive: plane; width: 0.62; height: 0.175");
        this.el.setAttribute("material", "shader: flat; side: double; transparent: true");
        this.el.addEventListener("click", () => {
          if (window.VRGame) window.VRGame.handle3DCommand(this.data.cmd);
        });
        this.el.addEventListener("mouseenter", () => this.el.setAttribute("scale", "1.07 1.07 1.07"));
        this.el.addEventListener("mouseleave", () => this.el.setAttribute("scale", "1 1 1"));
        this.redraw();
      },
      update() { this.redraw(); },
      redraw() {
        const canvas = makeActionPillCanvas(this.data.label, this.data.accent);
        const tex = new THREE.CanvasTexture(canvas);
        if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
        const mesh = this.el.getObject3D("mesh");
        if (mesh) {
          if (mesh.material.map) mesh.material.map.dispose();
          mesh.material.map = tex;
          mesh.material.needsUpdate = true;
        }
      }
    });

    AFRAME.registerComponent("quiz-banner", {
      init() {
        this.el.setAttribute("geometry", "primitive: plane; width: 2.35; height: 0.62");
        this.el.setAttribute("material", "shader: flat; transparent: true");
      },
      setBanner(topLine, mainLine, subLine) {
        const c = document.createElement("canvas");
        c.width = 1024; c.height = 280;
        const x = c.getContext("2d");
        x.fillStyle = "rgba(15, 23, 42, 0.90)";
        roundRect(x, 4, 4, c.width - 8, c.height - 8, 42); x.fill();
        x.lineWidth = 6; x.strokeStyle = "rgba(56, 189, 248, 0.75)";
        roundRect(x, 4, 4, c.width - 8, c.height - 8, 42); x.stroke();
        x.textAlign = "center"; x.textBaseline = "middle";
        x.fillStyle = "#38bdf8"; x.font = "bold 40px 'Trebuchet MS','Segoe UI',sans-serif";
        x.fillText(topLine || "", c.width / 2, 62, 960);
        x.fillStyle = "#ffffff"; x.font = "bold 104px 'Trebuchet MS','Segoe UI',sans-serif";
        x.fillText(mainLine || "", c.width / 2, subLine ? 156 : 172, 960);
        if (subLine) {
          x.fillStyle = "#fbbf24"; x.font = "bold 34px 'Trebuchet MS','Segoe UI',sans-serif";
          x.fillText(subLine, c.width / 2, 236, 940);
        }
        const tex = new THREE.CanvasTexture(c);
        if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
        const mesh = this.el.getObject3D("mesh");
        if (mesh) {
          if (mesh.material.map) mesh.material.map.dispose();
          mesh.material.map = tex;
          mesh.material.needsUpdate = true;
        }
      }
    });
  }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- Oyun Durumu ve Akışı ----------
  const Game = {
    state: "menu",              // 'menu' | 'play' | 'complete'
    modeIdx: 0,                 // 0: classic, 1: listen, 2: read
    cat: null,
    pool: [],
    allWords: [],
    currentOptions: [],
    target: null,
    locked: false,
    sessionTotal: 10,
    sessionDone: 0,
    mistakesThisRound: 0,
    firstTryCount: 0,
    streak: 0,
    cards: [],
    catCards3D: [],
    banner: null,
    actionBar3D: null,
    inVR: false,

    mode() { return MODES[this.modeIdx].key; },

    cycleMode() {
      this.modeIdx = (this.modeIdx + 1) % MODES.length;
      UI.updateModeButtons();
      if (this.actionBar3D) {
        const mBtn = document.getElementById("vr-btn-mode");
        if (mBtn) mBtn.setAttribute("vr-action-btn", "label", MODES[this.modeIdx].label);
      }
      if (this.state === "play" && this.target && this.currentOptions.length) {
        this.renderOptions(this.currentOptions);
        UI.setPrompt(this.target);
        if (this.mode() === "listen") Sound.speak(this.target);
      }
    },

    layout3DCards() {
      const isPortrait = !this.inVR && (window.innerWidth / Math.max(1, window.innerHeight)) < 0.86;
      const playPositions = isPortrait
        ? ["-0.44 1.66 -2.45", "0.44 1.66 -2.45", "-0.44 0.86 -2.45", "0.44 0.86 -2.45"]
        : ["-1.26 1.44 -2.25", "-0.42 1.44 -2.25", "0.42 1.44 -2.25", "1.26 1.44 -2.25"];
      const playScale = isPortrait ? "0.86 0.86 0.86" : "1 1 1";

      this.cards.forEach((c, i) => {
        if (!c) return;
        c.setAttribute("position", playPositions[i]);
        c.dataset.baseScale = playScale;
        c.setAttribute("scale", playScale);
      });

      if (this.banner) {
        this.banner.setAttribute("position", isPortrait ? "0 2.34 -2.55" : "0 2.24 -2.35");
        this.banner.setAttribute("scale", isPortrait ? "0.74 0.74 0.74" : "1 1 1");
      }
      if (this.actionBar3D) {
        this.actionBar3D.setAttribute("position", isPortrait ? "0 0.28 -2.35" : "0 0.76 -2.15");
      }
    },

    render3DCategoryMenu() {
      // VR başlık içindeyken gözlüğü çıkarmadan 6 kategoriden birini doğrudan seçebilme
      this.cards.forEach(c => c && c.setAttribute("visible", false));
      if (this.actionBar3D) this.actionBar3D.setAttribute("visible", false);
      if (this.banner && this.banner.components["quiz-banner"]) {
        this.banner.components["quiz-banner"].setBanner(
          "İZMİR TORBALI BİLSEM • VR DİL ATÖLYESİ",
          "Kategori Seç",
          "Puan: " + (Progress.data.score || 0) + "  •  Mod: " + MODES[this.modeIdx].label
        );
      }
      this.catCards3D.forEach((el, idx) => {
        const cat = window.VR_CATEGORIES[idx];
        if (!el || !cat) return;
        const total = window.VR_WORDS.filter(w => w.cat === cat.key).length;
        const done = Progress.done(cat.key).size;
        el.setAttribute("visible", true);
        if (el.components["quiz-card"]) {
          el.components["quiz-card"].setCustomFace({
            id: cat.key,
            action: "cat",
            emoji: cat.emoji,
            label: cat.label.split(" ")[0],
            subLabel: done + " / " + total,
            accent: cat.accent
          });
        }
      });
    },

    hide3DCategoryMenu() {
      this.catCards3D.forEach(el => el && el.setAttribute("visible", false));
    },

    selectCategoryFrom3D(catKey) {
      Sound.init();
      this.start(catKey);
    },

    openMenu() {
      this.state = "menu";
      this.locked = false;
      UI.hideComplete();
      if (this.inVR) {
        UI.hideAll2D();
      } else {
        UI.showMenu();
      }
      this.render3DCategoryMenu();
    },

    start(catKey) {
      this.cat = catKey;
      this.state = "play";
      this.hide3DCategoryMenu();
      if (this.actionBar3D) this.actionBar3D.setAttribute("visible", true);

      const all = window.VR_WORDS.filter(w => w.cat === catKey);
      const done = Progress.done(catKey);
      const remaining = all.filter(w => !done.has(w.id));
      // Kategori daha önce tamamlanmışsa yeni oturum 0/10'dan sayar (eski takılı kalma hatası giderildi)
      this.isReplayRun = remaining.length === 0;
      this.pool = remaining.length > 0 ? remaining.slice() : all.slice();
      this.allWords = all;
      this.sessionTotal = this.pool.length;
      this.sessionDone = 0;
      this.firstTryCount = 0;

      this.layout3DCards();
      if (this.inVR) UI.hideAll2D();
      else UI.showGame();
      UI.updateProgress();
      this.nextRound();
    },

    replayCurrentCategory() {
      if (!this.cat) return this.openMenu();
      Progress.resetCat(this.cat);
      this.start(this.cat);
    },

    nextRound() {
      this.locked = false;
      this.mistakesThisRound = 0;
      if (this.pool.length === 0) return this.finishCategory();

      this.target = this.pool[Math.floor(Math.random() * this.pool.length)];
      const others = shuffle(this.allWords.filter(w => w.id !== this.target.id)).slice(0, 3);
      this.currentOptions = shuffle([this.target, ...others]);
      this.renderOptions(this.currentOptions);
      UI.setPrompt(this.target);
      setTimeout(() => Sound.speak(this.target), 280);
    },

    renderOptions(options) {
      const m = this.mode();
      this.cards.forEach((card, i) => {
        const w = options[i];
        if (w && card && card.components["quiz-card"]) {
          card.components["quiz-card"].setCustomFace({
            id: w.id,
            action: "answer",
            emoji: w.emoji,
            swatch: w.swatch || null,
            label: w.en,
            badge: String(i + 1),
            accent: CARD_ACCENTS[i % CARD_ACCENTS.length],
            onlyEmoji: m === "listen",
            onlyText: m === "read"
          });
        }
        if (card) card.setAttribute("visible", !!w);
      });

      if (this.banner && this.banner.components["quiz-banner"]) {
        if (m === "listen") {
          this.banner.components["quiz-banner"].setBanner(
            "🎧 DİNLE VE DOĞRU GÖRSELİ SEÇ",
            "🔊 Dinle...",
            "Seri: 🔥 " + this.streak + "  •  " + (this.sessionDone + 1) + " / " + this.sessionTotal
          );
        } else {
          this.banner.components["quiz-banner"].setBanner(
            m === "read" ? "✍️ TÜRKÇESİ VERİLEN KELİMEYİ OKU & SEÇ" : "📘 İNGİLİZCESİ HANGİSİ?",
            this.target.tr,
            "Seri: 🔥 " + this.streak + "  •  " + (this.sessionDone + 1) + " / " + this.sessionTotal
          );
        }
      }
      UI.renderButtons(options, m);
    },

    choose(id, cardEl) {
      if (this.locked || this.state !== "play" || !this.target) return;
      Sound.init();
      this.locked = true;
      const ok = id === this.target.id;

      if (ok) {
        const firstTry = this.mistakesThisRound === 0;
        if (firstTry) this.firstTryCount++;
        this.streak++;
        this.sessionDone++;
        const pts = firstTry ? (10 + Math.min(10, this.streak * 2)) : 5;

        Sound.reward("awesome");
        Progress.mark(this.cat, this.target.id, pts);
        this.pool = this.pool.filter(w => w.id !== this.target.id);

        const targetCard = cardEl || this.cards.find(c => c && c.dataset.wordId === id);
        if (targetCard && targetCard.components["quiz-card"]) targetCard.components["quiz-card"].flash(true);

        UI.flashButton(id, true);
        UI.updateProgress();
        UI.toast("Harika! ⭐ " + this.target.en.toUpperCase() + " = " + this.target.tr + " (+" + pts + ")");
        this.spawnCelebrationBurst();
        setTimeout(() => this.nextRound(), 980);
      } else {
        this.mistakesThisRound++;
        this.streak = 0;
        Sound.reward("try_again");
        const wrongCard = cardEl || this.cards.find(c => c && c.dataset.wordId === id);
        if (wrongCard && wrongCard.components["quiz-card"]) wrongCard.components["quiz-card"].flash(false);
        UI.flashButton(id, false);
        UI.updateProgress();
        UI.toast("Tekrar dene 🤔 Tekrar dinleyebilirsin (🔁)");
        setTimeout(() => { this.locked = false; }, 320);
      }
    },

    finishCategory() {
      this.state = "complete";
      const catObj = window.VR_CATEGORIES.find(c => c.key === this.cat) || { label: "" };
      const ratio = this.sessionTotal ? (this.firstTryCount / this.sessionTotal) : 1;
      const stars = ratio >= 0.85 ? "⭐⭐⭐" : (ratio >= 0.55 ? "⭐⭐" : "⭐");

      Sound.reward("completed");
      this.spawnCelebrationBurst();

      // 3D sahnede de tamamlama kartlarını göster (VR başlık içinde kesintisiz devam)
      this.cards.forEach((c, idx) => {
        if (!c) return;
        if (idx === 1 && c.components["quiz-card"]) {
          c.setAttribute("visible", true);
          c.components["quiz-card"].setCustomFace({
            id: "again", action: "replay-cat", emoji: "🔄", label: "Tekrar Oyna", subLabel: catObj.label, accent: "#fbbf24"
          });
        } else if (idx === 2 && c.components["quiz-card"]) {
          c.setAttribute("visible", true);
          c.components["quiz-card"].setCustomFace({
            id: "menu", action: "go-menu", emoji: "🏠", label: "Kategoriler", subLabel: "6 Grup", accent: "#38bdf8"
          });
        } else {
          c.setAttribute("visible", false);
        }
      });

      if (this.banner && this.banner.components["quiz-banner"]) {
        this.banner.components["quiz-banner"].setBanner(
          "🏆 TEBRİKLER! KATEGORİ TAMAMLANDI",
          stars + "  " + this.firstTryCount + "/" + this.sessionTotal,
          "Toplam Puan: " + (Progress.data.score || 0)
        );
      }

      if (!this.inVR) {
        UI.showComplete(catObj.label, stars, this.firstTryCount, this.sessionTotal);
      }
    },

    handle3DCommand(cmd) {
      Sound.init();
      if (cmd === "replay") this.replay();
      else if (cmd === "menu") this.openMenu();
      else if (cmd === "mode") this.cycleMode();
    },

    replay() {
      Sound.init();
      if (this.target) Sound.speak(this.target);
    },

    spawnCelebrationBurst() {
      const container = document.getElementById("fx-root");
      if (!container || !window.AFRAME) return;
      const colors = ["#fbbf24", "#38bdf8", "#34d399", "#f472b6", "#a78bfa"];
      for (let i = 0; i < 12; i++) {
        const p = document.createElement("a-sphere");
        const x = (Math.random() - 0.5) * 2.2;
        const y = 1.1 + Math.random() * 1.1;
        const z = -2.1 + (Math.random() - 0.5) * 0.4;
        const tx = x + (Math.random() - 0.5) * 0.9;
        const ty = y + 0.6 + Math.random() * 0.6;
        p.setAttribute("radius", "0.035");
        p.setAttribute("color", colors[i % colors.length]);
        p.setAttribute("shader", "flat");
        p.setAttribute("position", `${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}`);
        p.setAttribute("animation__move", `property: position; to: ${tx.toFixed(2)} ${ty.toFixed(2)} ${z.toFixed(2)}; dur: 850; easing: easeOutQuad`);
        p.setAttribute("animation__scale", "property: scale; to: 0.01 0.01 0.01; dur: 850; easing: easeInQuad");
        container.appendChild(p);
        setTimeout(() => { if (p.parentNode) p.parentNode.removeChild(p); }, 900);
      }
    }
  };

  // ---------- 2D Arayüz ----------
  const UI = {
    el(id) { return document.getElementById(id); },

    buildMenu() {
      const grid = this.el("cat-grid");
      if (!grid) return;
      grid.innerHTML = "";
      let totalLearned = 0;
      let totalWords = window.VR_WORDS.length;

      window.VR_CATEGORIES.forEach(c => {
        const total = window.VR_WORDS.filter(w => w.cat === c.key).length;
        const done = Progress.done(c.key).size;
        totalLearned += done;
        const pct = total ? Math.round((done / total) * 100) : 0;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "cat-card";
        b.style.setProperty("--cat-accent", c.accent || "#38bdf8");
        b.innerHTML = `
          <span class="cat-emoji">${c.emoji}</span>
          <span class="cat-name">${c.label}</span>
          <div class="cat-bar"><div class="cat-bar-fill" style="width:${pct}%"></div></div>
          <span class="cat-prog">${done === total ? "✅ " : ""}${done} / ${total} kelime</span>
        `;
        b.addEventListener("click", () => { Sound.init(); Game.start(c.key); });
        grid.appendChild(b);
      });

      const summary = this.el("menu-summary");
      if (summary) {
        summary.textContent = `Öğrenilen: ${totalLearned} / ${totalWords} kelime  •  Toplam Puan: ⭐ ${Progress.data.score || 0}`;
      }
      this.updateModeButtons();
    },

    updateModeButtons() {
      document.querySelectorAll(".mode-pill").forEach((btn, idx) => {
        btn.classList.toggle("active", idx === Game.modeIdx);
      });
      const hudMode = this.el("btn-mode");
      if (hudMode) {
        hudMode.textContent = MODES[Game.modeIdx].label.split(" ")[0];
        hudMode.title = "Mod Değiştir (" + MODES[Game.modeIdx].label + ")";
      }
    },

    hideAll2D() {
      this.el("menu").style.display = "none";
      this.el("game-hud").style.display = "none";
      this.el("complete").style.display = "none";
      this.el("guide").style.display = "none";
    },

    showMenu() {
      this.hideToast();
      this.el("complete").style.display = "none";
      this.el("game-hud").style.display = "none";
      this.el("menu").style.display = "grid";
      this.buildMenu();
    },

    showGame() {
      this.el("menu").style.display = "none";
      this.el("complete").style.display = "none";
      this.el("game-hud").style.display = "flex";
      this.updateModeButtons();
    },

    hideComplete() {
      this.el("complete").style.display = "none";
    },

    showComplete(label, stars, firstTry, total) {
      // Toast ile tamamlama modalının üst üste binmesi hatası giderildi
      this.hideToast();
      this.el("game-hud").style.display = "none";
      this.el("complete-stars").textContent = stars;
      this.el("complete-text").textContent = `${label} grubunu tamamladın! İlk denemede ${firstTry}/${total} doğru • Toplam Puan: ${Progress.data.score || 0}`;
      this.el("complete").style.display = "grid";
    },

    setPrompt(word) {
      const m = Game.mode();
      if (m === "listen") {
        this.el("prompt-tr").textContent = "🔊 Sesi Dinle";
        this.el("prompt-sub").textContent = "Duyduğun İngilizce kelimenin resmini seç (🔁 tekrar)";
      } else if (m === "read") {
        this.el("prompt-tr").textContent = word.tr;
        this.el("prompt-sub").textContent = "Doğru İngilizce yazılışı seç";
      } else {
        this.el("prompt-tr").textContent = word.tr;
        this.el("prompt-sub").textContent = "İngilizcesini dinle ve doğru kartı seç";
      }
    },

    renderButtons(options, modeKey) {
      const bar = this.el("answer-bar");
      bar.innerHTML = "";
      options.forEach((w, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ans";
        b.dataset.id = w.id;
        if (modeKey === "read") {
          b.innerHTML = `<span class="ans-key">${idx + 1}</span><span class="ans-word only-word">${w.en}</span>`;
        } else if (modeKey === "listen") {
          const visual = w.swatch
            ? `<span class="ans-swatch" style="background:${w.swatch}"></span>`
            : `<span class="ans-emoji">${w.emoji}</span>`;
          b.innerHTML = `<span class="ans-key">${idx + 1}</span>${visual}`;
        } else {
          const visual = w.swatch
            ? `<span class="ans-swatch" style="background:${w.swatch}"></span>`
            : `<span class="ans-emoji">${w.emoji}</span>`;
          b.innerHTML = `<span class="ans-key">${idx + 1}</span>${visual}<span class="ans-word">${w.en}</span>`;
        }
        b.addEventListener("click", () => Game.choose(w.id, null));
        bar.appendChild(b);
      });
    },

    flashButton(id, ok) {
      const b = document.querySelector(`.ans[data-id="${CSS.escape(id)}"]`);
      if (b) {
        b.classList.add(ok ? "ok" : "no");
        setTimeout(() => b.classList.remove("ok", "no"), 440);
      }
    },

    updateProgress() {
      const total = Game.sessionTotal || 10;
      const done = Game.sessionDone || 0;
      const pct = total ? Math.round((done / total) * 100) : 0;
      this.el("prog-fill").style.width = pct + "%";
      this.el("prog-label").textContent = `${done}/${total}`;
      const streakEl = this.el("streak-chip");
      if (streakEl) streakEl.textContent = `🔥 ${Game.streak}  •  ⭐ ${Progress.data.score || 0}`;
    },

    hideToast() {
      clearTimeout(this._tt);
      const t = this.el("toast");
      if (t) t.classList.remove("show");
    },

    toast(msg) {
      const t = this.el("toast");
      if (!t) return;
      t.textContent = msg;
      t.classList.add("show");
      clearTimeout(this._tt);
      this._tt = setTimeout(() => t.classList.remove("show"), 1350);
    }
  };

  // ---------- Başlatma (Başlangıç perdesi olmadan doğrudan hazır!) ----------
  function setupVRButton(scene) {
    const vrBtn = UI.el("btn-enter-vr");
    const hudVrBtn = UI.el("btn-hud-vr");
    const buttons = [vrBtn, hudVrBtn].filter(Boolean);
    if (!scene || !buttons.length) return;

    const checkSupport = async () => {
      let supported = false;
      if (navigator.xr && navigator.xr.isSessionSupported) {
        try { supported = await navigator.xr.isSessionSupported("immersive-vr"); } catch (e) {}
      }
      buttons.forEach(b => {
        if (supported) {
          b.disabled = false;
          if (b === vrBtn) b.textContent = "🥽 VR Gözlüğe Geç (Quest 3)";
        } else {
          if (b === vrBtn) {
            b.disabled = true;
            b.textContent = "🖥️ 3D Web Modu Aktif (VR Başlık Yok)";
          } else {
            b.style.display = "none";
          }
        }
      });
    };
    checkSupport();

    buttons.forEach(b => {
      b.addEventListener("click", () => {
        Sound.init();
        if (scene.is("vr-mode")) scene.exitVR();
        else scene.enterVR();
      });
    });
  }

  function boot() {
    Progress.load();
    Game.cards = [0, 1, 2, 3].map(i => document.getElementById("card-" + i));
    Game.catCards3D = [0, 1, 2, 3, 4, 5].map(i => document.getElementById("cat3d-" + i));
    Game.banner = document.getElementById("banner");
    Game.actionBar3D = document.getElementById("vr-action-bar");

    // Mod seçici butonları
    const modeWrap = UI.el("mode-selector");
    if (modeWrap) {
      MODES.forEach((m, idx) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "mode-pill" + (idx === 0 ? " active" : "");
        b.innerHTML = `<strong>${m.label}</strong><span>${m.desc}</span>`;
        b.addEventListener("click", () => {
          Sound.init();
          Game.modeIdx = idx;
          UI.updateModeButtons();
          Game.render3DCategoryMenu();
        });
        modeWrap.appendChild(b);
      });
    }

    UI.el("btn-sound").addEventListener("click", (e) => {
      Sound.init();
      const m = Sound.toggleMute();
      e.currentTarget.textContent = m ? "🔇" : "🔊";
    });
    UI.el("btn-mode").addEventListener("click", () => { Sound.init(); Game.cycleMode(); });
    UI.el("btn-home").addEventListener("click", () => Game.openMenu());
    UI.el("btn-replay").addEventListener("click", () => Game.replay());
    UI.el("btn-guide").addEventListener("click", () => { UI.el("guide").style.display = "grid"; });
    UI.el("guide-close").addEventListener("click", () => { UI.el("guide").style.display = "none"; });
    UI.el("btn-reset-all").addEventListener("click", () => {
      Progress.resetAll();
      UI.buildMenu();
      Game.render3DCategoryMenu();
      UI.toast("İlerleme sıfırlandı ✨");
    });

    UI.el("complete-menu").addEventListener("click", () => Game.openMenu());
    UI.el("complete-again").addEventListener("click", () => {
      UI.hideComplete();
      Game.replayCurrentCategory();
    });

    // Klavye kısayolları (Masaüstü ve Akıllı Tahta kolaylığı: 1-4 seçim, R/Boşluk tekrar dinle, Esc menü)
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.key === "Escape") {
        if (UI.el("guide").style.display === "grid") { UI.el("guide").style.display = "none"; return; }
        if (Game.state !== "menu") Game.openMenu();
        return;
      }
      if (Game.state !== "play") return;
      const idx = ["1", "2", "3", "4"].indexOf(e.key);
      if (idx >= 0 && Game.currentOptions[idx]) {
        Game.choose(Game.currentOptions[idx].id, null);
        return;
      }
      if (e.code === "Space" || e.key.toLowerCase() === "r") {
        if (document.activeElement && document.activeElement.tagName === "BUTTON") document.activeElement.blur();
        e.preventDefault();
        Game.replay();
      }
    });

    window.addEventListener("resize", () => Game.layout3DCards());

    const scene = document.getElementById("scene");
    if (scene) {
      setupVRButton(scene);
      scene.addEventListener("enter-vr", () => {
        Sound.init();
        Game.inVR = true;
        Game.layout3DCards();
        UI.hideAll2D();
        if (Game.state === "menu") Game.render3DCategoryMenu();
      });
      scene.addEventListener("exit-vr", () => {
        Game.inVR = false;
        Game.layout3DCards();
        if (Game.state === "play") UI.showGame();
        else Game.openMenu();
      });
      if (scene.hasLoaded) {
        Game.layout3DCards();
        Game.render3DCategoryMenu();
      } else {
        scene.addEventListener("loaded", () => {
          Game.layout3DCards();
          Game.render3DCategoryMenu();
        });
      }
    }

    // Doğrudan kategori ekranını aç ("Başla" ara ekranı yok!)
    UI.showMenu();
  }

  window.VRGame = Game;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
