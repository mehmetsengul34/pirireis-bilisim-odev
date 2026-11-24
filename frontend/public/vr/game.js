/* ============================================================
   Ritim Adası Dil Atölyesi — Oyun Mantığı (okunur kaynak)
   Nasıl oynanır: Yönergede bir Türkçe kelime gösterilir ve İngilizcesi
   seslendirilir. Oyuncu, önündeki 4 karttan doğru olanı seçer.
   - Quest 3: karta bakarak (gaze) ya da kumanda ışınıyla seçer.
   - Bilgisayar: fareyle karta tıklar.
   - Tablet/telefon: alttaki butonlara dokunur (çoklu dokunuş gerekmez).
   İlerleme tarayıcıda (localStorage) saklanır; kaldığı yerden devam eder.
   Ses yolu, sayfanın bulunduğu klasöre göre otomatik belirlenir (taşınabilir).
   ============================================================ */
(function () {
  "use strict";

  // ---------- Ses dosyalarının taban yolu (taşınabilir) ----------
  // /vr/ içinde de, başka bir yolda da doğru çalışsın diye konumdan türetilir.
  const DIR = location.pathname.replace(/[^/]*$/, ""); // sonda "/" ile biter
  const AUDIO_BASE = DIR + "audio/";

  // ---------- İlerleme kaydı ----------
  const STORE_KEY = "vr_lang_progress_v1";
  const Progress = {
    data: {},
    load() {
      try { this.data = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
      catch (e) { this.data = {}; }
    },
    done(cat) { return new Set(this.data[cat] || []); },
    mark(cat, id) {
      const set = this.done(cat); set.add(id);
      this.data[cat] = [...set];
      try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch (e) {}
    },
    resetCat(cat) {
      delete this.data[cat];
      try { localStorage.setItem(STORE_KEY, JSON.stringify(this.data)); } catch (e) {}
    },
  };

  // ---------- Ses motoru: mp3 + seslendirme yedeği + ödül sesleri ----------
  const Sound = {
    ctx: null, muted: false, cache: new Map(), voice: null,
    synth: ("speechSynthesis" in window) ? window.speechSynthesis : null,
    init() {
      if (!this.ctx) {
        try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
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
    // Bir kelimeyi seslendirir: önce mp3, olmazsa tarayıcı seslendirmesi
    speak(word, onEnd) {
      if (this.muted) { if (onEnd) onEnd(); return; }
      this.init();
      const url = AUDIO_BASE + encodeURIComponent(word.id) + ".mp3";
      let a = this.cache.get(url);
      if (!a) { a = new Audio(url); this.cache.set(url, a); }
      a.currentTime = 0; a.volume = 1;
      const p = a.play();
      if (p && p.then) {
        p.then(() => { if (onEnd) a.onended = onEnd; })
         .catch(() => this.tts(word.en, onEnd));   // mp3 yoksa seslendirmeye düş
      }
    },
    tts(text, onEnd) {
      if (this.muted || !this.synth || !text) { if (onEnd) onEnd(); return; }
      try {
        this.synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-US"; u.rate = 0.85; u.pitch = 1.05;
        if (this.voice) u.voice = this.voice;
        if (onEnd) u.onend = onEnd;
        this.synth.speak(u);
      } catch (e) { if (onEnd) onEnd(); }
    },
    reward(name) {
      if (this.muted) return;
      this.init();
      const url = AUDIO_BASE + name + ".mp3";
      let a = this.cache.get(url);
      if (!a) { a = new Audio(url); this.cache.set(url, a); }
      a.currentTime = 0; a.volume = 1;
      const p = a.play();
      if (p && p.catch) p.catch(() => this.chime());
    },
    // mp3 yoksa kısa bir başarı tonu
    chime() {
      if (this.muted || !this.ctx) return;
      [523, 659, 784].forEach((f, i) => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        const t = this.ctx.currentTime + i * 0.09;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.4, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        o.connect(g).connect(this.ctx.destination);
        o.start(t); o.stop(t + 0.28);
      });
    },
  };
  if (Sound.synth) Sound.synth.onvoiceschanged = () => Sound.pickVoice();

  // ---------- Kart yüzeyi: emoji + kelimeyi canvas'a çizip doku yapar ----------
  // (A-Frame varsayılan yazı tipi Türkçe/emoji glifi içermeyebildiği için canvas kullanılır.)
  function makeFaceCanvas(emoji, label, bg) {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 640;
    const x = c.getContext("2d");
    // arka plan
    x.fillStyle = bg || "#1e1b4b";
    roundRect(x, 8, 8, c.width - 16, c.height - 16, 42); x.fill();
    x.lineWidth = 10; x.strokeStyle = "rgba(255,255,255,.25)";
    roundRect(x, 8, 8, c.width - 16, c.height - 16, 42); x.stroke();
    // emoji
    x.textAlign = "center"; x.textBaseline = "middle";
    x.font = "260px 'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif";
    x.fillText(emoji || "❓", c.width / 2, 280);
    // etiket
    x.fillStyle = "#ffffff";
    x.font = "bold 70px 'Trebuchet MS',sans-serif";
    x.fillText(label || "", c.width / 2, 540);
    return c;
  }
  function roundRect(x, px, py, w, h, r) {
    x.beginPath();
    x.moveTo(px + r, py);
    x.arcTo(px + w, py, px + w, py + h, r);
    x.arcTo(px + w, py + h, px, py + h, r);
    x.arcTo(px, py + h, px, py, r);
    x.arcTo(px, py, px + w, py, r);
    x.closePath();
  }

  // ---------- A-Frame bileşeni: tek bir kart ----------
  if (window.AFRAME) {
    AFRAME.registerComponent("quiz-card", {
      init() {
        this.texture = null;
        this.el.classList.add("card");
        this.el.setAttribute("geometry", "primitive: plane; width: 0.72; height: 0.9");
        this.el.setAttribute("material", "shader: flat; side: double; transparent: true");
        // Seçim: tıklama / gaze / kumanda ışını hepsi "click" üretir
        this.el.addEventListener("click", () => {
          if (this.el.dataset.wordId) window.VRGame.choose(this.el.dataset.wordId, this.el);
        });
        this.el.addEventListener("mouseenter", () => this.el.setAttribute("scale", "1.08 1.08 1.08"));
        this.el.addEventListener("mouseleave", () => this.el.setAttribute("scale", "1 1 1"));
      },
      setFace(word, bg) {
        const canvas = makeFaceCanvas(word.emoji, word.en, bg);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        const mesh = this.el.getObject3D("mesh");
        if (mesh) { mesh.material.map = tex; mesh.material.needsUpdate = true; }
        this.el.dataset.wordId = word.id;
        this.el.setAttribute("scale", "1 1 1");
      },
      flash(ok) {
        const mesh = this.el.getObject3D("mesh");
        if (!mesh) return;
        mesh.material.color.set(ok ? "#22c55e" : "#ef4444");
        setTimeout(() => mesh.material.color.set("#ffffff"), 450);
      },
    });

    // Yönerge afişi (Türkçe) — yine canvas doku
    AFRAME.registerComponent("quiz-banner", {
      init() {
        this.el.setAttribute("geometry", "primitive: plane; width: 2.2; height: 0.6");
        this.el.setAttribute("material", "shader: flat; transparent: true");
      },
      setText(tr) {
        const c = document.createElement("canvas");
        c.width = 1024; c.height = 280;
        const x = c.getContext("2d");
        x.fillStyle = "rgba(15,23,42,.85)";
        roundRect(x, 0, 0, c.width, c.height, 40); x.fill();
        x.lineWidth = 6; x.strokeStyle = "rgba(56,189,248,.7)";
        roundRect(x, 3, 3, c.width - 6, c.height - 6, 40); x.stroke();
        x.textAlign = "center"; x.textBaseline = "middle";
        x.fillStyle = "#38bdf8"; x.font = "bold 46px 'Trebuchet MS',sans-serif";
        x.fillText("Hangisi?  →", c.width / 2, 70);
        x.fillStyle = "#fff"; x.font = "bold 120px 'Trebuchet MS',sans-serif";
        x.fillText(tr, c.width / 2, 180);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        const mesh = this.el.getObject3D("mesh");
        if (mesh) { mesh.material.map = tex; mesh.material.needsUpdate = true; }
      },
    });
  }

  // ---------- Oyun durumu ve akışı ----------
  const CARD_BG = ["#4338ca", "#be123c", "#047857", "#b45309"];
  const Game = {
    cat: null, pool: [], target: null, locked: false,
    cards: [], banner: null,

    start(catKey) {
      this.cat = catKey;
      const all = window.VR_WORDS.filter(w => w.cat === catKey);
      const done = Progress.done(catKey);
      // Önce öğrenilmemiş kelimeler; hepsi bitmişse baştan
      this.pool = all.filter(w => !done.has(w.id));
      if (this.pool.length === 0) this.pool = all.slice();
      this.allWords = all;
      UI.showGame();
      this.nextRound();
    },

    nextRound() {
      this.locked = false;
      if (this.pool.length === 0) return UI.showComplete(this.cat);
      // Hedef kelime
      this.target = this.pool[Math.floor(Math.random() * this.pool.length)];
      // Seçenekler: hedef + aynı kategoriden 3 çeldirici
      const others = shuffle(this.allWords.filter(w => w.id !== this.target.id)).slice(0, 3);
      const options = shuffle([this.target, ...others]);
      this.renderOptions(options);
      UI.setPrompt(this.target);
      // Yönergeyi seslendir (kısa gecikmeyle)
      setTimeout(() => Sound.speak(this.target), 350);
    },

    renderOptions(options) {
      // 3D kartlar
      this.cards.forEach((card, i) => {
        const w = options[i];
        if (w && card.components["quiz-card"]) card.components["quiz-card"].setFace(w, CARD_BG[i]);
        card.setAttribute("visible", !!w);
      });
      if (this.banner && this.banner.components["quiz-banner"])
        this.banner.components["quiz-banner"].setText(this.target.tr);
      // 2D butonlar (tablet/telefon/masaüstü)
      UI.renderButtons(options);
    },

    choose(id, cardEl) {
      if (this.locked) return;
      this.locked = true;
      const ok = id === this.target.id;
      if (ok) {
        Sound.reward("awesome");
        Progress.mark(this.cat, this.target.id);
        this.pool = this.pool.filter(w => w.id !== this.target.id);
        if (cardEl && cardEl.components["quiz-card"]) cardEl.components["quiz-card"].flash(true);
        UI.flashButton(id, true);
        UI.updateProgress(this.cat);
        UI.toast("Aferin! ⭐ " + this.target.en.toUpperCase());
        setTimeout(() => this.nextRound(), 1100);
      } else {
        Sound.reward("try_again");
        if (cardEl && cardEl.components["quiz-card"]) cardEl.components["quiz-card"].flash(false);
        UI.flashButton(id, false);
        UI.toast("Tekrar dene 🤔");
        this.locked = false; // yanlışta tekrar seçebilsin
      }
    },

    replay() { if (this.target) Sound.speak(this.target); },
  };

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ---------- 2D Arayüz (menü, HUD, butonlar, rehber) ----------
  const UI = {
    el(id) { return document.getElementById(id); },
    buildMenu() {
      const grid = this.el("cat-grid");
      grid.innerHTML = "";
      window.VR_CATEGORIES.forEach(c => {
        const total = window.VR_WORDS.filter(w => w.cat === c.key).length;
        const done = Progress.done(c.key).size;
        const b = document.createElement("button");
        b.className = "cat-card";
        b.innerHTML = `<span class="cat-emoji">${c.emoji}</span><span class="cat-name">${c.label}</span>
                       <span class="cat-prog">${done}/${total}</span>`;
        b.addEventListener("click", () => { Sound.init(); Game.start(c.key); });
        grid.appendChild(b);
      });
    },
    showMenu() { this.el("menu").style.display = "grid"; this.el("game-hud").style.display = "none"; this.buildMenu(); },
    showGame() { this.el("menu").style.display = "none"; this.el("game-hud").style.display = "flex"; this.updateProgress(Game.cat); },
    showComplete(cat) {
      const label = (window.VR_CATEGORIES.find(c => c.key === cat) || {}).label || "";
      Sound.reward("completed");
      this.toast("🎉 " + label + " tamamlandı!");
      this.el("complete").style.display = "grid";
      this.el("complete-text").textContent = label + " kategorisini bitirdin! 🏆";
    },
    setPrompt(word) {
      this.el("prompt-tr").textContent = word.tr;
      this.el("prompt-sub").textContent = "İngilizcesini seç";
    },
    renderButtons(options) {
      const bar = this.el("answer-bar");
      bar.innerHTML = "";
      options.forEach(w => {
        const b = document.createElement("button");
        b.className = "ans"; b.dataset.id = w.id;
        b.innerHTML = `<span class="ans-emoji">${w.emoji}</span><span class="ans-word">${w.en}</span>`;
        b.addEventListener("pointerdown", (e) => { e.preventDefault(); Game.choose(w.id, null); });
        bar.appendChild(b);
      });
    },
    flashButton(id, ok) {
      const b = document.querySelector(`.ans[data-id="${CSS.escape(id)}"]`);
      if (b) { b.classList.add(ok ? "ok" : "no"); setTimeout(() => b.classList.remove("ok", "no"), 450); }
    },
    updateProgress(cat) {
      const total = window.VR_WORDS.filter(w => w.cat === cat).length;
      const done = Progress.done(cat).size;
      const pct = total ? Math.round((done / total) * 100) : 0;
      this.el("prog-fill").style.width = pct + "%";
      this.el("prog-label").textContent = done + "/" + total;
    },
    toast(msg) {
      const t = this.el("toast");
      t.textContent = msg; t.classList.add("show");
      clearTimeout(this._tt); this._tt = setTimeout(() => t.classList.remove("show"), 1400);
    },
  };

  // ---------- Başlatma ----------
  function boot() {
    Progress.load();
    // 3D kart ve afiş düğümlerini bul
    Game.cards = [0, 1, 2, 3].map(i => document.getElementById("card-" + i));
    Game.banner = document.getElementById("banner");

    UI.buildMenu();

    // Düğmeler
    UI.el("btn-sound").addEventListener("click", (e) => {
      const m = Sound.toggleMute();
      e.currentTarget.textContent = m ? "🔇" : "🔊";
    });
    UI.el("btn-home").addEventListener("click", () => UI.showMenu());
    UI.el("btn-replay").addEventListener("click", () => Game.replay());
    UI.el("btn-guide").addEventListener("click", () => UI.el("guide").style.display = "grid");
    UI.el("guide-close").addEventListener("click", () => UI.el("guide").style.display = "none");
    UI.el("complete-menu").addEventListener("click", () => { UI.el("complete").style.display = "none"; UI.showMenu(); });
    UI.el("complete-again").addEventListener("click", () => {
      UI.el("complete").style.display = "none"; Progress.resetCat(Game.cat); Game.start(Game.cat);
    });

    // İlk dokunuş: sesi aç ve menüyü göster
    UI.el("start-btn").addEventListener("click", () => {
      Sound.init();
      UI.el("start").style.display = "none";
      UI.showMenu();
    });
    const scene = document.querySelector("a-scene");
    if (scene) scene.addEventListener("enter-vr", () => Sound.init());
  }

  // Dışarıdan erişim (kartların click olayı için)
  window.VRGame = Game;

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
