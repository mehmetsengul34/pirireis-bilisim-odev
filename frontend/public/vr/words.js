// ============================================================
//  İzmir Torbalı BİLSEM — VR Duyu & Dil Atölyesi Kelime Veri Seti
//  6 Kategori × 10 Kelime = 60 Kelime
//  hasMp3: true olanlar /vr/audio/<id>.mp3 dosyasını çalar,
//          false olanlar doğrudan tarayıcı İngilizce seslendirmesini (TTS) kullanır.
// ============================================================

window.VR_CATEGORIES = [
  { key: "animals", label: "Hayvanlar",              emoji: "🐾", accent: "#38bdf8" },
  { key: "colors",  label: "Renkler ve Şekiller",    emoji: "🎨", accent: "#f472b6" },
  { key: "school",  label: "Okul ve Araçlar",        emoji: "🎒", accent: "#fbbf24" },
  { key: "fruits",  label: "Meyveler ve Yiyecekler", emoji: "🍎", accent: "#34d399" },
  { key: "science", label: "Bilim ve Sanat",         emoji: "🔬", accent: "#a78bfa" },
  { key: "nature",  label: "Doğa ve Gökyüzü",        emoji: "🌍", accent: "#2dd4bf" }
];

window.VR_WORDS = [
  // --- Hayvanlar (MP3 mevcut) ---
  { id: "cat",        en: "cat",        tr: "kedi",       emoji: "🐱", cat: "animals", hasMp3: true },
  { id: "dog",        en: "dog",        tr: "köpek",      emoji: "🐶", cat: "animals", hasMp3: true },
  { id: "elephant",   en: "elephant",   tr: "fil",        emoji: "🐘", cat: "animals", hasMp3: true },
  { id: "lion",       en: "lion",       tr: "aslan",      emoji: "🦁", cat: "animals", hasMp3: true },
  { id: "rabbit",     en: "rabbit",     tr: "tavşan",     emoji: "🐰", cat: "animals", hasMp3: true },
  { id: "dolphin",    en: "dolphin",    tr: "yunus",      emoji: "🐬", cat: "animals", hasMp3: true },
  { id: "monkey",     en: "monkey",     tr: "maymun",     emoji: "🐵", cat: "animals", hasMp3: true },
  { id: "penguin",    en: "penguin",    tr: "penguen",    emoji: "🐧", cat: "animals", hasMp3: true },
  { id: "giraffe",    en: "giraffe",    tr: "zürafa",     emoji: "🦒", cat: "animals", hasMp3: true },
  { id: "panda",      en: "panda",      tr: "panda",      emoji: "🐼", cat: "animals", hasMp3: true },

  // --- Renkler ve Şekiller (MP3 mevcut, Stroop çakışmasız kendi renk tonuyla) ---
  { id: "red",        en: "red",        tr: "kırmızı",    emoji: "🔴", cat: "colors",  hasMp3: true, swatch: "#dc2626" },
  { id: "blue",       en: "blue",       tr: "mavi",       emoji: "🔵", cat: "colors",  hasMp3: true, swatch: "#2563eb" },
  { id: "green",      en: "green",      tr: "yeşil",      emoji: "🟢", cat: "colors",  hasMp3: true, swatch: "#16a34a" },
  { id: "yellow",     en: "yellow",     tr: "sarı",       emoji: "🟡", cat: "colors",  hasMp3: true, swatch: "#eab308" },
  { id: "orange",     en: "orange",     tr: "turuncu",    emoji: "🟠", cat: "colors",  hasMp3: true, swatch: "#ea580c" },
  { id: "purple",     en: "purple",     tr: "mor",        emoji: "🟣", cat: "colors",  hasMp3: true, swatch: "#9333ea" },
  { id: "pink",       en: "pink",       tr: "pembe",      emoji: "💗", cat: "colors",  hasMp3: true, swatch: "#db2777" },
  { id: "white",      en: "white",      tr: "beyaz",      emoji: "⚪", cat: "colors",  hasMp3: true, swatch: "#e2e8f0" },
  { id: "star",       en: "star",       tr: "yıldız",     emoji: "⭐", cat: "colors",  hasMp3: true, swatch: "#f59e0b" },
  { id: "heart",      en: "heart",      tr: "kalp",       emoji: "❤️", cat: "colors",  hasMp3: true, swatch: "#e11d48" },

  // --- Okul ve Araçlar (MP3 mevcut) ---
  { id: "book",       en: "book",       tr: "kitap",      emoji: "📖", cat: "school",  hasMp3: true },
  { id: "pencil",     en: "pencil",     tr: "kalem",      emoji: "✏️", cat: "school",  hasMp3: true },
  { id: "backpack",   en: "backpack",   tr: "çanta",      emoji: "🎒", cat: "school",  hasMp3: true },
  { id: "clock",      en: "clock",      tr: "saat",       emoji: "🕐", cat: "school",  hasMp3: true },
  { id: "telescope",  en: "telescope",  tr: "teleskop",   emoji: "🔭", cat: "school",  hasMp3: true },
  { id: "scissors",   en: "scissors",   tr: "makas",      emoji: "✂️", cat: "school",  hasMp3: true },
  { id: "ruler",      en: "ruler",      tr: "cetvel",     emoji: "📏", cat: "school",  hasMp3: true },
  { id: "globe",      en: "globe",      tr: "küre",       emoji: "🌐", cat: "school",  hasMp3: true },
  { id: "computer",   en: "computer",   tr: "bilgisayar", emoji: "💻", cat: "school",  hasMp3: true },
  { id: "paintbrush", en: "paintbrush", tr: "fırça",      emoji: "🖌️", cat: "school",  hasMp3: true },

  // --- Meyveler ve Yiyecekler (MP3 mevcut) ---
  { id: "apple",        en: "apple",      tr: "elma",     emoji: "🍎", cat: "fruits",  hasMp3: true },
  { id: "banana",       en: "banana",     tr: "muz",      emoji: "🍌", cat: "fruits",  hasMp3: true },
  { id: "strawberry",   en: "strawberry", tr: "çilek",    emoji: "🍓", cat: "fruits",  hasMp3: true },
  { id: "watermelon",   en: "watermelon", tr: "karpuz",   emoji: "🍉", cat: "fruits",  hasMp3: true },
  { id: "grape",        en: "grape",      tr: "üzüm",     emoji: "🍇", cat: "fruits",  hasMp3: true },
  { id: "orange_fruit", en: "orange",     tr: "portakal", emoji: "🍊", cat: "fruits",  hasMp3: true },
  { id: "lemon",        en: "lemon",      tr: "limon",    emoji: "🍋", cat: "fruits",  hasMp3: true },
  { id: "cherry",       en: "cherry",     tr: "kiraz",    emoji: "🍒", cat: "fruits",  hasMp3: true },
  { id: "pineapple",    en: "pineapple",  tr: "ananas",   emoji: "🍍", cat: "fruits",  hasMp3: true },
  { id: "peach",        en: "peach",      tr: "şeftali",  emoji: "🍑", cat: "fruits",  hasMp3: true },

  // --- Bilim ve Sanat (MP3 mevcut) ---
  { id: "microscope", en: "microscope", tr: "mikroskop",  emoji: "🔬", cat: "science", hasMp3: true },
  { id: "robot",      en: "robot",      tr: "robot",      emoji: "🤖", cat: "science", hasMp3: true },
  { id: "rocket",     en: "rocket",     tr: "roket",      emoji: "🚀", cat: "science", hasMp3: true },
  { id: "planet",     en: "planet",     tr: "gezegen",    emoji: "🪐", cat: "science", hasMp3: true },
  { id: "palette",    en: "palette",    tr: "palet",      emoji: "🎨", cat: "science", hasMp3: true },
  { id: "chemistry",  en: "chemistry",  tr: "kimya",      emoji: "⚗️", cat: "science", hasMp3: true },
  { id: "atom",       en: "atom",       tr: "atom",       emoji: "⚛️", cat: "science", hasMp3: true },
  { id: "magnet",     en: "magnet",     tr: "mıknatıs",   emoji: "🧲", cat: "science", hasMp3: true },
  { id: "dna",        en: "dna",        tr: "DNA",        emoji: "🧬", cat: "science", hasMp3: true },
  { id: "satellite",  en: "satellite",  tr: "uydu",       emoji: "🛰️", cat: "science", hasMp3: true },

  // --- Doğa ve Gökyüzü (Yeni kategori - Web Speech İngilizce seslendirme ile) ---
  { id: "sun",        en: "sun",        tr: "güneş",      emoji: "☀️", cat: "nature",  hasMp3: false },
  { id: "moon",       en: "moon",       tr: "ay",         emoji: "🌙", cat: "nature",  hasMp3: false },
  { id: "rainbow",    en: "rainbow",    tr: "gökkuşağı",  emoji: "🌈", cat: "nature",  hasMp3: false },
  { id: "cloud",      en: "cloud",      tr: "bulut",      emoji: "☁️", cat: "nature",  hasMp3: false },
  { id: "tree",       en: "tree",       tr: "ağaç",       emoji: "🌳", cat: "nature",  hasMp3: false },
  { id: "flower",     en: "flower",     tr: "çiçek",      emoji: "🌻", cat: "nature",  hasMp3: false },
  { id: "mountain",   en: "mountain",   tr: "dağ",        emoji: "🏔️", cat: "nature",  hasMp3: false },
  { id: "ocean",      en: "ocean",      tr: "okyanus",    emoji: "🌊", cat: "nature",  hasMp3: false },
  { id: "snowflake",  en: "snowflake",  tr: "kar tanesi", emoji: "❄️", cat: "nature",  hasMp3: false },
  { id: "fire",       en: "fire",       tr: "ateş",       emoji: "🔥", cat: "nature",  hasMp3: false }
];
