// ============================================================
//  Ritim Adası Dil Atölyesi — Kelime Veri Seti
//  id  : /vr/audio/<id>.mp3 dosyasının adıyla aynı (İngilizce seslendirme)
//  en  : İngilizce kelime (kartta yazılır)
//  tr  : Türkçe karşılığı (yönergede gösterilir)
//  emoji: kartın görseli (ayrı resim dosyası gerekmez)
//  cat : kategori anahtarı
//  Not: Bu dosya okunabilir kaynaktır; yeni kelime eklemek için bir satır ekleyin
//       ve aynı ada sahip bir .mp3'ü /vr/audio/ içine koyun (yoksa sistem otomatik
//       olarak tarayıcının İngilizce seslendirmesini kullanır).
// ============================================================

window.VR_CATEGORIES = [
  { key: "animals", label: "Hayvanlar",            emoji: "🐾" },
  { key: "colors",  label: "Renkler ve Şekiller",  emoji: "🎨" },
  { key: "school",  label: "Okul ve Araçlar",      emoji: "🎒" },
  { key: "fruits",  label: "Meyveler ve Yiyecekler",emoji: "🍎" },
  { key: "science", label: "Bilim ve Sanat",       emoji: "🔬" },
];

window.VR_WORDS = [
  // --- Hayvanlar ---
  { id: "cat",        en: "cat",        tr: "kedi",       emoji: "🐱", cat: "animals" },
  { id: "dog",        en: "dog",        tr: "köpek",      emoji: "🐶", cat: "animals" },
  { id: "elephant",   en: "elephant",   tr: "fil",        emoji: "🐘", cat: "animals" },
  { id: "lion",       en: "lion",       tr: "aslan",      emoji: "🦁", cat: "animals" },
  { id: "rabbit",     en: "rabbit",     tr: "tavşan",     emoji: "🐰", cat: "animals" },
  { id: "dolphin",    en: "dolphin",    tr: "yunus",      emoji: "🐬", cat: "animals" },
  { id: "monkey",     en: "monkey",     tr: "maymun",     emoji: "🐵", cat: "animals" },
  { id: "penguin",    en: "penguin",    tr: "penguen",    emoji: "🐧", cat: "animals" },
  { id: "giraffe",    en: "giraffe",    tr: "zürafa",     emoji: "🦒", cat: "animals" },
  { id: "panda",      en: "panda",      tr: "panda",      emoji: "🐼", cat: "animals" },

  // --- Renkler ve Şekiller ---
  { id: "red",        en: "red",        tr: "kırmızı",    emoji: "🔴", cat: "colors" },
  { id: "blue",       en: "blue",       tr: "mavi",       emoji: "🔵", cat: "colors" },
  { id: "green",      en: "green",      tr: "yeşil",      emoji: "🟢", cat: "colors" },
  { id: "yellow",     en: "yellow",     tr: "sarı",       emoji: "🟡", cat: "colors" },
  { id: "orange",     en: "orange",     tr: "turuncu",    emoji: "🟠", cat: "colors" },
  { id: "purple",     en: "purple",     tr: "mor",        emoji: "🟣", cat: "colors" },
  { id: "pink",       en: "pink",       tr: "pembe",      emoji: "💗", cat: "colors" },
  { id: "white",      en: "white",      tr: "beyaz",      emoji: "⚪", cat: "colors" },
  { id: "star",       en: "star",       tr: "yıldız",     emoji: "⭐", cat: "colors" },
  { id: "heart",      en: "heart",      tr: "kalp",       emoji: "❤️", cat: "colors" },

  // --- Okul ve Araçlar ---
  { id: "book",       en: "book",       tr: "kitap",      emoji: "📖", cat: "school" },
  { id: "pencil",     en: "pencil",     tr: "kalem",      emoji: "✏️", cat: "school" },
  { id: "backpack",   en: "backpack",   tr: "çanta",      emoji: "🎒", cat: "school" },
  { id: "clock",      en: "clock",      tr: "saat",       emoji: "🕐", cat: "school" },
  { id: "telescope",  en: "telescope",  tr: "teleskop",   emoji: "🔭", cat: "school" },
  { id: "scissors",   en: "scissors",   tr: "makas",      emoji: "✂️", cat: "school" },
  { id: "ruler",      en: "ruler",      tr: "cetvel",     emoji: "📏", cat: "school" },
  { id: "globe",      en: "globe",      tr: "küre",       emoji: "🌐", cat: "school" },
  { id: "computer",   en: "computer",   tr: "bilgisayar", emoji: "💻", cat: "school" },
  { id: "paintbrush", en: "paintbrush", tr: "fırça",      emoji: "🖌️", cat: "school" },

  // --- Meyveler ve Yiyecekler ---
  { id: "apple",        en: "apple",      tr: "elma",     emoji: "🍎", cat: "fruits" },
  { id: "banana",       en: "banana",     tr: "muz",      emoji: "🍌", cat: "fruits" },
  { id: "strawberry",   en: "strawberry", tr: "çilek",    emoji: "🍓", cat: "fruits" },
  { id: "watermelon",   en: "watermelon", tr: "karpuz",   emoji: "🍉", cat: "fruits" },
  { id: "grape",        en: "grape",      tr: "üzüm",     emoji: "🍇", cat: "fruits" },
  { id: "orange_fruit", en: "orange",     tr: "portakal", emoji: "🍊", cat: "fruits" },
  { id: "lemon",        en: "lemon",      tr: "limon",    emoji: "🍋", cat: "fruits" },
  { id: "cherry",       en: "cherry",     tr: "kiraz",    emoji: "🍒", cat: "fruits" },
  { id: "pineapple",    en: "pineapple",  tr: "ananas",   emoji: "🍍", cat: "fruits" },
  { id: "peach",        en: "peach",      tr: "şeftali",  emoji: "🍑", cat: "fruits" },

  // --- Bilim ve Sanat ---
  { id: "microscope", en: "microscope", tr: "mikroskop",  emoji: "🔬", cat: "science" },
  { id: "robot",      en: "robot",      tr: "robot",      emoji: "🤖", cat: "science" },
  { id: "rocket",     en: "rocket",     tr: "roket",      emoji: "🚀", cat: "science" },
  { id: "planet",     en: "planet",     tr: "gezegen",    emoji: "🪐", cat: "science" },
  { id: "palette",    en: "palette",    tr: "palet",      emoji: "🎨", cat: "science" },
  { id: "chemistry",  en: "chemistry",  tr: "kimya",      emoji: "⚗️", cat: "science" },
  { id: "atom",       en: "atom",       tr: "atom",       emoji: "⚛️", cat: "science" },
  { id: "magnet",     en: "magnet",     tr: "mıknatıs",   emoji: "🧲", cat: "science" },
  { id: "dna",        en: "dna",        tr: "DNA",        emoji: "🧬", cat: "science" },
  { id: "satellite",  en: "satellite",  tr: "uydu",       emoji: "🛰️", cat: "science" },
];
