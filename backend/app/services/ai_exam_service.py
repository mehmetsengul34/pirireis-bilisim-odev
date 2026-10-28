# -*- coding: utf-8 -*-
"""
AI Destekli YKS Sınav ve Soru Üretim Servisi (MEB & ÖSYM Müfredat Uyumluluğu)
- TYT & AYT Güncel Müfredat Kataloğu
- Çift Katmanlı Üretim: Gemini API + Zengin Prosedürel Soru Motoru (Her ders için 10+ özgün üreteç)
- Tam Benzersizlik Güvencesi: Soru metinleri ve çeldiriciler için Jaccard benzerlik filtresi (Tekrarlayan soru engelleme)
- KaTeX Matematik ve Türkçe Karakter Koruma
- Dinamik SVG Görsel Çizici (Elektrik Devresi, Geometri Üçgeni, Parabol Fonksiyonu)
"""

import os
import re
import json
import random
import math
import httpx
from typing import List, Dict, Any, Optional, Set

# ================= GÜNCEL MEB & ÖSYM YKS MÜFREDAT KATALOĞU =================

YKS_CURRICULUM = {
    "TYT": {
        "Temel Matematik": [
            "Temel Kavramlar ve Sayı Kümeleri", "Bölme ve Bölünebilme Kuralları", "Asal Çarpanlar ve EBOB-EKOK",
            "Rasyonel ve Ondalık Sayılar", "Birinci Dereceden Denklem ve Eşitsizlikler", "Mutlak Değer",
            "Üslü ve Köklü İfadeler", "Çarpanlara Ayırma", "Oran ve Orantı",
            "Yeni Nesil Sayı ve Kesir Problemleri", "Yaş Problemleri", "İşçi Problemleri",
            "Yüzde, Kâr-Zarar ve İskonto Problemleri", "Karışım Problemleri", "Hız ve Hareket Problemleri",
            "Grafik ve Tablo Yorumlama Problemleri", "Kümeler ve Kartezyen Çarpım",
            "Fonksiyonlar (Temel Düzey)", "Mantık", "Sayma, Permütasyon ve Kombinasyon",
            "Olasılık", "İstatistik ve Veri Analizi"
        ],
        "Türkçe": [
            "Sözcükte Anlam", "Cümlede Anlam", "Paragrafta Anlam ve Ana Düşünce",
            "Paragrafta Yapı ve Akışı Bozan Cümle", "Anlatım Teknikleri ve Düşünceyi Geliştirme Yolları",
            "Ses Bilgisi", "Yazım Kuralları", "Noktalama İşaretleri",
            "Sözcükte Yapı ve Ekler", "İsim, Sıfat, Zamir, Zarf", "Edat, Bağlaç, Ünlem",
            "Fiiller, Ek Fiil ve Fiilimsi", "Cümlenin Ögeleri", "Cümle Türleri", "Anlatım Bozuklukları"
        ],
        "Geometri": [
            "Doğruda ve Üçgende Açılar", "Özel Üçgenler (Dik, İkizkenar, Eşkenar)", "Üçgende Alan",
            "Üçgende Benzerlik", "Açıortay ve Kenarortay Bağıntıları", "Çokgenler ve Düzgün Çokgenler",
            "Dörtgenler ve Özel Dörtgenler (Paralelkenar, Eşkenar Dörtgen, Dikdörtgen, Kare, Yamuk)",
            "Çemberde Açılar ve Uzunluk", "Dairede Alan ve Çevre", "Katı Cisimler (Prizma, Silindir, Koni, Piramit, Küre)"
        ],
        "Fizik": [
            "Fizik Bilimine Giriş", "Madde ve Özellikleri", "Hareket ve Kuvvet", "Newton'ın Hareket Yasaları",
            "İş, Güç ve Enerji", "Isı, Sıcaklık ve Genleşme", "Elektrostatik", "Elektrik Akımı ve Devreler",
            "Mıknatıs ve Manyetizma", "Basınç ve Kaldırma Kuvveti", "Dalgalar (Yay, Su, Ses, Deprem)",
            "Optik (Aydınlanma, Aynalar, Kırılma, Mercekler, Prizmalar ve Renk)"
        ],
        "Kimya": [
            "Kimya Bilimi", "Atom ve Periyodik Sistem", "Kimyasal Türler Arası Etkileşimler",
            "Maddenin Halleri (Katı, Sıvı, Gaz, Plazma)", "Doğa ve Kimya", "Kimyanın Temel Kanunları",
            "Mol Kavramı", "Kimyasal Tepkime Denklemleri ve Hesaplamalar", "Karışımlar ve Ayırma Yöntemleri",
            "Asitler, Bazlar ve Tuzlar", "Kimya Her Yerde"
        ],
        "Biyoloji": [
            "Yaşam Bilimi Biyoloji", "Canlıların Temel Bileşenleri", "Hücre ve Organelleri",
            "Hücre Zarından Madde Geçişleri", "Canlılar Dünyası ve Sınıflandırma", "Mitoz Bölünme ve Eşeysiz Üreme",
            "Mayoz Bölünme ve Eşeyli Üreme", "Kalıtımın Genel İlkeleri (Mendel Genetiği)",
            "Ekosistem Ekolojisi ve Güncel Çevre Sorunları"
        ],
        "Tarih": [
            "Tarih ve Zaman", "İlk ve Orta Çağlarda Türk Dünyası", "İslam Medeniyetinin Doğuşu",
            "Türklerin İslamiyet'i Kabulü ve İlk Türk İslam Devletleri", "Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiye'si",
            "Beylikten Devlete Osmanlı Siyaseti", "Dünya Gücü Osmanlı (1453-1595)",
            "Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti", "Değişim Çağında Avrupa ve Osmanlı",
            "Uluslararası İlişkilerde Denge Stratejisi (1774-1914)", "XX. Yüzyıl Başlarında Osmanlı Devleti ve Dünya",
            "Milli Mücadele (Kurtuluş Savaşı)", "Atatürkçülük ve Türk İnkılabı"
        ],
        "Coğrafya": [
            "Doğa ve İnsan", "Dünya'nın Şekli ve Hareketleri", "Coğrafi Konum ve Koordinat Sistemi",
            "Harita Bilgisi ve Ölçekler", "Atmosfer, Hava Durumu ve İklim", "Türkiye'nin İklimi",
            "Yerin Şekillenmesi ve İç Kuvvetler", "Dış Kuvvetler", "Nüfus ve Yerleşme",
            "Ekonomik Faaliyetler", "Bölgeler ve Ülkeler", "Çevre ve Toplum (Doğal Afetler)"
        ],
        "Felsefe": [
            "Felsefeyi Tanıma", "Felsefe ile Düşünme", "Varlık Felsefesi (Ontoloji)",
            "Bilgi Felsefesi (Epistemoloji)", "Ahlak Felsefesi (Etik)", "Sanat Felsefesi (Estetik)",
            "Din Felsefesi", "Siyaset Felsefesi", "Bilim Felsefesi"
        ],
        "Din Kültürü": [
            "İslam ve İnanç Esasları", "İslam ve İbadetler", "Ahlak ve Değerler",
            "Allah İnsan İlişkisi", "Hz. Muhammed ve Gençlik", "İslam Düşüncesinde Tasavvufi Yorumlar",
            "Güncel Dini Meseleler", "İslam ve Barış"
        ]
    },
    "AYT": {
        "Matematik": [
            "Fonksiyonlar ve Fonksiyonlarda Uygulamalar", "İkinci Dereceden Denklemler ve Karmaşık Sayılar",
            "Parabol (İkinci Dereceden Fonksiyon Grafikleri)", "İkinci Dereceden Eşitsizlikler",
            "Trigonometri (Toplam-Fark, İki Kat Açı, Denklemler)", "Üstel ve Logaritmik Fonksiyonlar",
            "Diziler ve Aritmetik-Geometrik Diziler", "Limit ve Süreklilik",
            "Türev (Türevin Anlamı, Geometrik Yorum, Ekstremum Noktalar, Artan-Azalanlık)",
            "İntegral (Belirsiz İntegral, Belirli İntegral ve Alan Hesabı)",
            "Sayma, Permütasyon, Kombinasyon, Binom ve Olasılık"
        ],
        "Geometri": [
            "Üçgenler ve İleri Geometri Bağıntıları", "Dörtgenler ve Çokgenler", "Çember ve Daire Analitiği",
            "Doğrunun Analitik İncelenmesi", "Çemberin Analitik İncelenmesi",
            "Dönüşüm Geometrisi (Öteleme, Dönme, Yansıma)", "Katı Cisimler (Silindir, Koni, Küre Hacim ve Yüzey Analizi)"
        ],
        "Fizik": [
            "Vektörler ve Bağıl Hareket", "Newton'ın Hareket Yasaları (İki Boyutta Hareket)", "Bir Boyutta Sabit İvmeli Hareket",
            "İki Boyutta Hareket (Atışlar)", "İş, Güç ve Enerji II", "İtme ve Çizgisel Momentum",
            "Tork, Denge ve Kütle Merkezi", "Basit Makineler", "Elektriksel Kuvvet ve Elektriksel Alan",
            "Elektriksel Potansiyel ve İş", "Düzgün Elektrik Alan ve Sığaçlar", "Manyetizma ve Elektromanyetik İndüksiyon",
            "Alternatif Akım ve Transformatörler", "Düzgün Çembersel Hareket", "Dönerek Öteleme ve Açısal Momentum",
            "Basit Harmonik Hareket", "Dalga Mekaniği (Kırınım, Girişim ve Doppler)",
            "Atom Fiziğine Giriş ve Radyoaktivite", "Modern Fizik ve Modern Fiziğin Teknolojideki Uygulamaları"
        ],
        "Kimya": [
            "Modern Atom Teorisi ve Kuantum Sayıları", "Gazlar (İdeal Gaz Yasası ve Gerçek Gazlar)",
            "Sıvı Çözeltiler ve Derişim Birimleri (Molarite, Molalite, Koligatif Özellikler)",
            "Kimyasal Tepkimelerde Enerji ve Entalpi", "Kimyasal Tepkimelerde Hız ve Mekanizmalar",
            "Kimyasal Denge ve Dengeye Etki Eden Faktörler (Le Chatelier)",
            "Sulu Çözelti Dengeleri (Asit-Baz Dengesi, Tampon Çözeltiler, KÇÇ Çözünürlük Dengesi)",
            "Kimya ve Elektrik (Redoks, Aktiflik, Galvanik Piller, Nernst Eşitliği, Elektroliz)",
            "Karbon Kimyasına Giriş (Hibritleşme, Molekül Geometrisi)",
            "Organik Bileşikler (Hidrokarbonlar, Alkoller, Eterler, Karbonil Bileşikleri, Karboksilik Asitler)"
        ],
        "Biyoloji": [
            "Sinir Sistemi ve Duyu Organları", "Endokrin Sistem (Hormonlar)", "Destek ve Hareket Sistemi",
            "Sindirim Sistemi", "Dolaşım ve Bağışıklık Sistemi", "Solunum Sistemi",
            "Boşaltım Sistemi (Üriner Sistem)", "Üreme Sistemi ve Embriyonik Gelişim",
            "Komünite Ekolojisi ve Popülasyon Ekolojisi", "Genden Proteine (DNA, RNA, Replikasyon ve Protein Sentezi)",
            "Canlılarda Enerji Dönüşümleri (Fotosentez, Kemosentez ve Hücresel Solunum)",
            "Bitki Biyolojisi (Bitkisel Dokular, Organlar, Taşıma ve Üreme)", "Canlılar ve Çevre"
        ],
        "Edebiyat": [
            "Giriş ve Edebi Metinler", "Şiir Bilgisi (Nazım Birimi, Ölçü, Uyak, Redif, Söz Sanatları)",
            "İslamiyet Öncesi ve Geçiş Dönemi Türk Edebiyatı", "Halk Edebiyatı (Anonim, Âşık, Dini-Tasavvufi)",
            "Divan Edebiyatı (Nazım Biçimleri, Şairler ve Nesir)", "Tanzimat Edebiyatı (I. ve II. Dönem)",
            "Servet-i Fünun ve Fecr-i Âti Edebiyatı", "Millî Edebiyat Dönemi",
            "Cumhuriyet Dönemi Türk Şiiri", "Cumhuriyet Dönemi Roman ve Hikâyesi",
            "Cumhuriyet Dönemi Tiyatrosu ve Öğretici Metinler", "Edebi Akımlar (Klasisizm, Romantizm, Realizm vb.)"
        ],
        "Tarih": [
            "Tarih Metodolojisi", "Uygarlıkların Doğuşu ve İlk Çağ", "İlk ve Orta Çağ Türk Devletleri",
            "İslam Tarihi ve Medeniyeti", "Büyük Selçuklu ve Türkiye Selçukluları",
            "Osmanlı Kuruluş, Yükselme ve Duraklama Dönemleri", "XVIII. Yüzyıl Islahatları ve Denge Siyaseti",
            "En Uzun Yüzyıl (XIX. Yüzyıl Dağılma Dönemi)", "I. Dünya Savaşı ve Osmanlı Devleti",
            "Milli Mücadele Hazırlık, Muharebeler ve Antlaşmalar", "Atatürk İlkeleri ve İnkılap Tarihi",
            "İki Savaş Arasındaki Dönemde Dünya ve Türkiye", "II. Dünya Savaşı ve Soğuk Savaş Dönemi"
        ],
        "Coğrafya": [
            "Doğal Sistemler ve Biyoçeşitlilik", "Ekosistemin Unsurları ve Madde Döngüleri",
            "Nüfus Politikaları ve Şehirlerin Fonksiyonları", "Türkiye'de Tarım, Hayvancılık, Madenler ve Enerji",
            "Türkiye'de Sanayi, Ulaşım ve Ticaret", "Küresel Ticaret ve Turizm",
            "Kültür Bölgeleri ve Türk Kültürü", "Uluslararası Örgütler ve Jeopolitik Konum",
            "Çevre Kirliliği ve Doğal Kaynakların Sürdürülebilirliği"
        ]
    }
}

# ================= FORMÜL VE TÜRKÇE KARAKTER TEMİZLEME MOTORU =================

def sanitize_math_and_turkish(text: str, is_option: bool = False) -> str:
    if not text:
        return ""
    text = str(text).replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r'\\\\(?=[a-zA-Z])', r'\\', text)

    trimmed = text.strip()
    
    # 1. Eğer açıkça bir şık ise veya çok kısa salt matematik ifadesi ise:
    # (Örn: '93^\circ', '74\pi', '\sqrt{3}/2', 'x^2 - 4x + 4', '30°', 'x²', 'x³')
    if is_option or (len(trimmed) < 45 and not any(p in trimmed for p in ['?', '!', ':', 'dir.', 'tir.', 'dır.', 'tır.'])):
        has_math = bool(re.search(r'[\\\^_²³°√π±≤≥≠÷×]|\b(cm|m|mm|km)\^[23]\b|\b[a-zA-Z]\^[0-9]', trimmed, re.IGNORECASE))
        words = re.findall(r'[a-zA-ZçğıöşüÇĞİÖŞÜ]{3,}', trimmed)
        if not (trimmed.startswith("$") and trimmed.endswith("$")) and has_math and len(words) <= 1:
            trimmed = f"${trimmed}$"
            text = trimmed

    # 2. $...$ blokları içindeki formül temizliği
    def fix_math_block(match):
        inner = match.group(1).strip()
        inner = inner.replace("²", "^{2}").replace("³", "^{3}").replace("⁴", "^{4}").replace("⁰", "^{0}")
        inner = inner.replace("°", "^{\\circ}")
        inner = re.sub(r'\^\\circ(?!\w)', r'^{\\circ}', inner)
        inner = re.sub(r'\^0\b', r'^{\\circ}', inner)
        inner = re.sub(r'\^\{\^\{\\circ\}\}', r'^{\\circ}', inner)
        inner = re.sub(r'√([0-9a-zA-Z]+)', r'\\sqrt{\1}', inner)
        inner = re.sub(r'(?<=[a-zA-Z0-9])\s*([+\-*/=><])\s*(?=[a-zA-Z0-9])', r' \1 ', inner)
        inner = re.sub(r'\s+', ' ', inner)
        return f"${inner}$"

    text = re.sub(r'\$([^\$]+)\$', fix_math_block, text)

    # 3. $ dışında kalmış derece, pi, birim kare/küp kalıplarını $...$ ile sar:
    text = re.sub(r'(?<!\$)\b([0-9]+)\s*\^\\circ\b(?!\$)', r'$\1^{\\circ}$', text)
    text = re.sub(r'(?<!\$)\b([0-9]+)\s*\^\{\\circ\}\b(?!\$)', r'$\1^{\\circ}$', text)
    text = re.sub(r'(?<!\$)\b([0-9]+)\s*\\circ\b(?!\$)', r'$\1^{\\circ}$', text)
    text = re.sub(r'(?<!\$)\b([0-9]+)\s*°(?!\$)', r'$\1^{\\circ}$', text)
    text = re.sub(r'(?<!\$)\b([0-9]+)\s*\\pi\b(?!\$)', r'$\1\\pi$', text)
    text = re.sub(r'(?<!\$)\b(cm|m|mm|km|dm)\s*\^2\b(?!\$)', r'$\text{\1}^2$', text, flags=re.IGNORECASE)
    text = re.sub(r'(?<!\$)\b(cm|m|mm|km|dm)\s*\^3\b(?!\$)', r'$\text{\1}^3$', text, flags=re.IGNORECASE)
    text = re.sub(r'(?<!\$)\b(cm|m|mm|km|dm)²\b(?!\$)', r'$\text{\1}^2$', text, flags=re.IGNORECASE)
    text = re.sub(r'(?<!\$)\b(cm|m|mm|km|dm)³\b(?!\$)', r'$\text{\1}^3$', text, flags=re.IGNORECASE)
    text = re.sub(r'(?<![\$\w])([a-zA-Z])\s*\^\s*([0-9]+)(?![\$\w])', r'$\1^{\2}$', text)

    return text.strip()

# ================= BENZERSİZLİK VE METİN KARŞILAŞTIRMA =================

def are_questions_too_similar(q1_text: str, q2_text: str) -> bool:
    t1 = q1_text.strip()
    t2 = q2_text.strip()
    if t1 == t2:
        return True
    
    n1 = re.sub(r'\s+', '', t1.lower())
    n2 = re.sub(r'\s+', '', t2.lower())
    if n1 == n2:
        return True

    w1 = set(re.findall(r'\w+', t1.lower()))
    w2 = set(re.findall(r'\w+', t2.lower()))
    if not w1 or not w2:
        return False
    inter = len(w1.intersection(w2))
    union = len(w1.union(w2))
    return (inter / union) >= 0.85

def make_distractors(correct_val: Any, diffs: List[int] = None) -> List[Any]:
    if isinstance(correct_val, (int, float)):
        diffs = diffs or [-3, -1, 1, 2, 4, 5, -2, 6, -4, 8, -5]
        random.shuffle(diffs)
        dist = set()
        for d in diffs:
            cand = correct_val + d
            if cand != correct_val and cand > 0:
                dist.add(cand)
            if len(dist) == 4:
                break
        while len(dist) < 4:
            cand = correct_val + random.randint(3, 15)
            if cand != correct_val:
                dist.add(cand)
        return list(dist)[:4]
    return ["1", "2", "3", "4"]

def format_options(correct_str: str, distractors: List[str]) -> Dict[str, Any]:
    letters = ["A", "B", "C", "D", "E"]
    correct_idx = random.randint(0, 4)
    shuffled_distractors = list(distractors[:4])
    while len(shuffled_distractors) < 4:
        shuffled_distractors.append("Bu yargıya metinden ulaşılamaz.")
    random.shuffle(shuffled_distractors)

    opts = {}
    d_ptr = 0
    for i, letter in enumerate(letters):
        if i == correct_idx:
            raw_val = str(correct_str)
        else:
            raw_val = str(shuffled_distractors[d_ptr])
            d_ptr += 1

        opts[f"option_{letter.lower()}"] = sanitize_math_and_turkish(raw_val, is_option=True)

    opts["correct_option"] = letters[correct_idx]
    opts["correct_answer"] = letters[correct_idx]
    return opts

# ================= DİNAMİK VEKTÖREL SVG GÖRSEL ÜRETEÇLERİ =================

def generate_dynamic_triangle_svg(a: int, b: int, c: int, label: str = "ABC Üçgeni") -> str:
    return f"""<svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:440px; margin:auto; display:block;">
  <defs>
    <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0.10"/>
    </linearGradient>
  </defs>
  <polygon points="60,200 340,200 60,50" fill="url(#triGrad)" stroke="#38bdf8" stroke-width="3" stroke-linejoin="round"/>
  <rect x="60" y="180" width="20" height="20" fill="none" stroke="#f43f5e" stroke-width="2"/>
  <circle cx="70" cy="190" r="2.5" fill="#f43f5e"/>
  <circle cx="60" cy="50" r="5" fill="#38bdf8"/>
  <circle cx="60" cy="200" r="5" fill="#38bdf8"/>
  <circle cx="340" cy="200" r="5" fill="#38bdf8"/>
  <text x="45" y="45" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold">A</text>
  <text x="45" y="215" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold">B</text>
  <text x="350" y="215" fill="#f8fafc" font-size="15" font-family="sans-serif" font-weight="bold">C</text>
  <text x="25" y="130" fill="#fbbf24" font-size="14" font-family="sans-serif" font-weight="bold">c = {c}</text>
  <text x="190" y="225" fill="#fbbf24" font-size="14" font-family="sans-serif" font-weight="bold">a = {a}</text>
  <text x="210" y="115" fill="#34d399" font-size="14" font-family="sans-serif" font-weight="bold">b = {b}</text>
  <text x="140" y="30" fill="#94a3b8" font-size="13" font-family="sans-serif">{label}</text>
</svg>"""

def generate_dynamic_circuit_svg(v: int, r1: int, r2: int, r3: int) -> str:
    return f"""<svg viewBox="0 0 460 220" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:480px; margin:auto; display:block;">
  <rect x="50" y="40" width="360" height="140" fill="none" stroke="#64748b" stroke-width="2.5" rx="6"/>
  <line x1="200" y1="40" x2="260" y2="40" stroke="#0f172a" stroke-width="8"/>
  <rect x="200" y="30" width="60" height="20" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>
  <text x="215" y="45" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold">R₁={r1}Ω</text>
  <line x1="200" y1="180" x2="260" y2="180" stroke="#0f172a" stroke-width="8"/>
  <rect x="200" y="170" width="60" height="20" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>
  <text x="215" y="185" fill="#38bdf8" font-size="12" font-family="sans-serif" font-weight="bold">R₂={r2}Ω</text>
  <line x1="410" y1="85" x2="410" y2="135" stroke="#0f172a" stroke-width="8"/>
  <rect x="395" y="90" width="30" height="40" fill="#1e293b" stroke="#a855f7" stroke-width="2" rx="4"/>
  <text x="375" y="115" fill="#c084fc" font-size="11" font-family="sans-serif" font-weight="bold">R₃={r3}Ω</text>
  <line x1="50" y1="90" x2="50" y2="130" stroke="#0f172a" stroke-width="8"/>
  <line x1="38" y1="100" x2="62" y2="100" stroke="#f43f5e" stroke-width="3"/>
  <line x1="44" y1="120" x2="56" y2="120" stroke="#f43f5e" stroke-width="1.5"/>
  <text x="12" y="115" fill="#f43f5e" font-size="13" font-family="sans-serif" font-weight="bold">V={v}V</text>
  <circle cx="120" cy="40" r="14" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
  <text x="115" y="45" fill="#fbbf24" font-size="13" font-family="sans-serif" font-weight="bold">A</text>
  <text x="140" y="25" fill="#94a3b8" font-size="11" font-family="sans-serif">Ana Kol Akımı (i)</text>
</svg>"""

def generate_dynamic_parabola_svg(a: int, b: int, c: int, r: float, k: float) -> str:
    return f"""<svg viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:420px; margin:auto; display:block;">
  <line x1="40" y1="170" x2="350" y2="170" stroke="#475569" stroke-width="2"/>
  <line x1="190" y1="20" x2="190" y2="200" stroke="#475569" stroke-width="2"/>
  <polygon points="350,170 342,166 342,174" fill="#475569"/>
  <polygon points="190,20 186,28 194,28" fill="#475569"/>
  <text x="355" y="174" fill="#94a3b8" font-size="12" font-family="sans-serif">x</text>
  <text x="182" y="15" fill="#94a3b8" font-size="12" font-family="sans-serif">y</text>
  <path d="M 80,185 Q 190,40 300,185" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="190" cy="65" r="5" fill="#f43f5e"/>
  <text x="198" y="65" fill="#f43f5e" font-size="12" font-family="sans-serif" font-weight="bold">T(r={r:.0f}, k={k:.0f})</text>
  <text x="70" y="208" fill="#34d399" font-size="12" font-family="sans-serif">f(x) = {a}x² + {b}x + {c}</text>
</svg>"""

# ================= TEMEL MATEMATİK & AYT MATEMATİK ÜRETEÇLERİ =================

def q_ebob_ekok() -> Dict[str, Any]:
    a = random.choice([24, 36, 48, 60, 72, 84])
    b = random.choice([30, 45, 60, 90, 105, 120])
    while a == b:
        b = random.choice([30, 45, 60, 90, 105, 120])
    ebob = math.gcd(a, b)
    kare_sayisi = (a // ebob) * (b // ebob)
    opts = format_options(f"{kare_sayisi}", [f"{kare_sayisi + d}" for d in make_distractors(kare_sayisi)])
    return {
        "question_text": f"Eni ${a}\\text{{ m}}$ ve boyu ${b}\\text{{ m}}$ olan dikdörtgen biçimindeki bir arsa, hiç parça artmayacak şekilde eş büyüklükte kare parsellere ayrılacaktır. Buna göre, bu arsa **en az kaç parselden** oluşur?",
        "visual_svg": None,
        "explanation": f"Arsanın kenarları $EBOB({a}, {b}) = {ebob}\\text{{ m}}$ olan karelere ayrılır. Parsel sayısı = $({a}/{ebob}) \\times ({b}/{ebob}) = {a//ebob} \\times {b//ebob} = {kare_sayisi}$ bulunur.",
        "topic": "Asal Çarpanlar ve EBOB-EKOK",
        "subtopic": "Bölme ve Parselleme Problemleri",
        **opts
    }

def q_age_problem() -> Dict[str, Any]:
    b_age = random.choice([36, 40, 42, 45, 48, 50])
    diff = random.choice([24, 26, 28, 30])
    c_age = b_age - diff
    ratio = random.choice([2, 3])
    x = b_age - ratio * c_age
    opts = format_options(f"{abs(x)}", [f"{abs(x) + d}" for d in make_distractors(abs(x), [1, 2, 3, -1, -2, 4])])
    tense = "kaç yıl önce" if x > 0 else "kaç yıl sonra"
    return {
        "question_text": f"Bir babanın bugünkü yaşı ${b_age}$, çocuğunun bugünkü yaşı ise ${c_age}$'dir. Buna göre, babanın yaşının çocuğunun yaşının **${ratio}$ katı** olduğu zaman dilimi ile ilgili durum nedir ({tense})?",
        "visual_svg": None,
        "explanation": f"Denklem: ${b_age} - x = {ratio} \\cdot ({c_age} - x) \\implies {b_age} - x = {ratio*c_age} - {ratio}x \\implies {ratio-1}x = {ratio*c_age - b_age} \\implies x = {abs(x)}$.",
        "topic": "Yaş Problemleri",
        "subtopic": "Doğrusal Denklem Kurma",
        **opts
    }

def q_percentage_profit() -> Dict[str, Any]:
    cost = random.choice([200, 300, 400, 500, 800])
    kar_oran = random.choice([20, 25, 30, 40, 50])
    etiket = int(cost * (1 + kar_oran / 100))
    indirim_oran = random.choice([10, 15, 20])
    satis = int(etiket * (1 - indirim_oran / 100))
    net_kar = satis - cost
    opts = format_options(f"{net_kar}", [f"{net_kar + d}" for d in make_distractors(net_kar)])
    return {
        "question_text": f"Maliyeti ${cost}\\text{{ TL}}$ olan bir ürün, yüzde ${kar_oran}$ kâr ile etiketlendirildikten sonra etiket fiyatı üzerinden yüzde ${indirim_oran}$ indirimle satılmıştır. Bu satıştan elde edilen **net kâr kaç TL**'dir?",
        "visual_svg": None,
        "explanation": f"Etiket fiyatı = ${cost} \\times {1 + kar_oran/100:.2f} = {etiket}\\text{{ TL}}$. İndirimli satış = ${etiket} \\times {1 - indirim_oran/100:.2f} = {satis}\\text{{ TL}}$. Net kâr = ${satis} - {cost} = {net_kar}\\text{{ TL}}$.",
        "topic": "Yüzde, Kâr-Zarar ve İskonto Problemleri",
        "subtopic": "Etiket ve İndirim Hesabı",
        **opts
    }

def q_speed_motion() -> Dict[str, Any]:
    v1 = random.choice([60, 70, 80, 90])
    v2 = random.choice([40, 50, 60, 70])
    t = random.choice([2, 3, 4, 5])
    distance = (v1 + v2) * t
    opts = format_options(f"{t}", [f"{t + d}" for d in [-1, 1, 2, -2, 3] if t + d > 0][:4])
    return {
        "question_text": f"Aralarında ${distance}\\text{{ km}}$ mesafe bulunan iki şehirden hızları saatte ${v1}\\text{{ km}}$ ve ${v2}\\text{{ km}}$ olan iki araç aynı anda birbirlerine doğru harekete geçiyor. Bu iki araç hareketlerinden **kaç saat sonra karşılaşırlar**?",
        "visual_svg": None,
        "explanation": f"Zıt yönlü hareket formülü: $x = (V_1 + V_2) \\cdot t \\implies {distance} = ({v1} + {v2}) \\cdot t \\implies t = {distance} / {v1+v2} = {t}\\text{{ saat}}$.",
        "topic": "Hız ve Hareket Problemleri",
        "subtopic": "Zıt Yönlü Karşılaşma",
        **opts
    }

def q_cargo_tariff() -> Dict[str, Any]:
    sabit = random.choice([40, 50, 60])
    kg_ucret = random.choice([6, 8, 10, 12])
    agirlik = random.choice([5, 7, 9, 12, 15])
    toplam = sabit + (agirlik - 2) * kg_ucret
    opts = format_options(f"{toplam}", [f"{toplam + d}" for d in make_distractors(toplam)])
    return {
        "question_text": f"Bir kargo şirketi $2\\text{{ kg}}$'a kadar olan paketler için sabit ${sabit}\\text{{ TL}}$, $2\\text{{ kg}}$'ın üzerindeki her bir ilave kilogram için ise ${kg_ucret}\\text{{ TL}}$ ücret almaktadır. Buna göre, bu kargo şirketi ile gönderilen **${agirlik}\\text{{ kg}}$'lık bir paketin taşıma ücreti kaç TL** olur?",
        "visual_svg": None,
        "explanation": f"Formül: Ücret = ${sabit} + ({agirlik} - 2) \\times {kg_ucret} = {sabit} + {agirlik-2} \\times {kg_ucret} = {toplam}\\text{{ TL}}$ olarak bulunur.",
        "topic": "Yeni Nesil Sayı ve Kesir Problemleri",
        "subtopic": "Parçalı Doğrusal Fonksiyon Modelleme",
        **opts
    }

def q_function() -> Dict[str, Any]:
    m = random.choice([2, 3, 4, 5])
    n = random.choice([1, 2, 3, 4, 5])
    val = random.choice([2, 3, 4])
    f_val = m * val - n
    g_val = 2 * f_val + 1
    opts = format_options(f"{g_val}", [f"{g_val + d}" for d in make_distractors(g_val)])
    return {
        "question_text": f"Gerçek sayılar kümesinde tanımlı $f(x) = {m}x - {n}$ ve $g(x) = 2x + 1$ fonksiyonları veriliyor. Buna göre, $(g \\circ f)({val})$ bileşke fonksiyonunun değeri **kaçtır**?",
        "visual_svg": None,
        "explanation": f"Önce $f({val}) = {m}\\cdot({val}) - {n} = {f_val}$ hesaplanır. Ardından $g({f_val}) = 2\\cdot({f_val}) + 1 = {g_val}$ bulunur.",
        "topic": "Fonksiyonlar (Temel Düzey)",
        "subtopic": "Bileşke Fonksiyon",
        **opts
    }

def q_parabola_max() -> Dict[str, Any]:
    r = random.choice([2, 3, 4, 5])
    k = random.choice([12, 16, 20, 25, 36])
    c = k - (r ** 2)
    b = 2 * r
    opts = format_options(f"{k}", [f"{k + d}" for d in make_distractors(k)])
    svg = generate_dynamic_parabola_svg(-1, b, c, float(r), float(k))
    return {
        "question_text": f"Bir fabrikada üretilen bir ürünün $x$ adet satılması durumunda elde edilen kâr fonksiyonu $f(x) = -x^2 + {b}x + {c}$ olarak modellenmiştir. Buna göre, bu fabrikada elde edilebilecek **en yüksek kâr kaç TL**'dir?",
        "visual_svg": svg,
        "explanation": f"Tepe noktası apsisi $r = -b / (2a) = -{b} / (2 \\cdot (-1)) = {r}$. Maksimum kâr tepe noktası ordinatıdır: $k = f({r}) = -({r})^2 + {b}\\cdot({r}) + {c} = {k}$ bulunur.",
        "topic": "Parabol (İkinci Dereceden Fonksiyon Grafikleri)",
        "subtopic": "Tepe Noktası ve Ekstremum Değer",
        **opts
    }

def q_derivative_tangent() -> Dict[str, Any]:
    a = random.choice([1, 2, 3])
    x0 = random.choice([1, 2, 3])
    slope = 2 * a * x0
    opts = format_options(f"{slope}", [f"{slope + d}" for d in make_distractors(slope)])
    return {
        "question_text": f"$f(x) = {a}x^2 - 3x + 5$ eğrisine üzerindeki $x = {x0}$ apsisli noktadan çizilen **teğetin eğimi kaçtır**?",
        "visual_svg": None,
        "explanation": f"Eğrinin türevi: $f'(x) = {2*a}x - 3$. Nokta türevde yerine konarak eğim hesaplanır.",
        "topic": "Türev (Türevin Anlamı, Geometrik Yorum)",
        "subtopic": "Teğet Eğimi",
        **opts
    }

def q_integral_area() -> Dict[str, Any]:
    m = random.choice([2, 3, 4])
    correct = f"{m**3}/3"
    distractors = [f"{(m**3)+1}/3", f"{(m**3)-1}/3", f"{m**2}", f"{(m**3)*2}/3"]
    opts = format_options(correct, distractors)
    return {
        "question_text": f"$f(x) = x^2$ parabolü, $x = 0$ ve $x = {m}$ doğruları ile $x$-ekseni arasında kalan kapalı bölgenin **alanı kaç birimkaredir**?",
        "visual_svg": None,
        "explanation": f"Alan integrali: $A = \\int_0^{{{m}}} x^2 dx = [\\frac{{x^3}}{{3}}]_0^{{{m}}} = \\frac{{{m**3}}}{{3}} = {correct}$ birimkaredir.",
        "topic": "İntegral (Belirli İntegral ve Alan Hesabı)",
        "subtopic": "Eğri Altında Kalan Alan",
        **opts
    }

def q_combinations() -> Dict[str, Any]:
    n = random.choice([6, 7, 8])
    r = random.choice([2, 3])
    ans = math.comb(n, r)
    opts = format_options(f"{ans}", [f"{ans + d}" for d in make_distractors(ans)])
    return {
        "question_text": f"${n}$ kişilik bir öğrenci grubundan ${r}$ kişilik bir temsilci heyeti seçilecektir. Buna göre, bu heyet **kaç farklı şekilde oluşturulabilir**?",
        "visual_svg": None,
        "explanation": f"Kombinasyon: $C({n}, {r}) = \\frac{{{n}!}}{{{r}!({n}-{r})!}} = {ans}$ farklı şekilde seçilebilir.",
        "topic": "Sayma, Permütasyon ve Kombinasyon",
        "subtopic": "Grup ve Heyet Seçimi",
        **opts
    }

def q_probability_dice() -> Dict[str, Any]:
    target_sum = random.choice([7, 8, 9])
    ways = {7: 6, 8: 5, 9: 4}[target_sum]
    ans_str = f"{ways}/36"
    distractors = [f"{ways+1}/36", f"{ways-1}/36", f"{ways+2}/36", f"{(ways*2)}/36"]
    opts = format_options(ans_str, distractors)
    return {
        "question_text": f"Havaya atılan iki hilesiz zarın üst yüzüne gelen sayıların **toplamının ${target_sum}$ olma olasılığı** kaçtır?",
        "visual_svg": None,
        "explanation": f"Örnek uzay boyutu $6 \\times 6 = 36$'dır. Toplamı ${target_sum}$ olan durum sayısı ${ways}$ olduğundan olasılık $\\frac{{{ways}}}{{36}}$'dır.",
        "topic": "Olasılık",
        "subtopic": "Zar Deneyleri",
        **opts
    }

def q_logarithm() -> Dict[str, Any]:
    base = random.choice([2, 3, 5])
    power = random.choice([3, 4, 5])
    num = base ** power
    opts = format_options(f"{power}", [f"{power + d}" for d in [-2, -1, 1, 2, 3] if power + d > 0][:4])
    return {
        "question_text": f"$\\log_{{{base}}}({num})$ ifadesinin eşiti **kaçtır**?",
        "visual_svg": None,
        "explanation": f"Logaritma tanımı: ${base}^x = {num} = {base}^{{{power}}} \\implies x = {power}$ bulunur.",
        "topic": "Üstel ve Logaritmik Fonksiyonlar",
        "subtopic": "Logaritma Tanımı ve Özellikleri",
        **opts
    }

def q_trigonometry() -> Dict[str, Any]:
    angles = [(30, "1/2"), (45, "\\sqrt{2}/2"), (60, "\\sqrt{3}/2")]
    deg, sin_val = random.choice(angles)
    all_vals = ["1/2", "\\sqrt{2}/2", "\\sqrt{3}/2", "\\sqrt{3}/3", "1"]
    distractors = [v for v in all_vals if v != sin_val]
    opts = format_options(f"${sin_val}$", [f"${d}$" for d in distractors[:4]])
    return {
        "question_text": f"$\\sin({deg}^\\circ)$ değerinin eşiti aşağıdakilerden **hangisidir**?",
        "visual_svg": None,
        "explanation": f"Özel açı trigonometrik oranları tablosundan $\\sin({deg}^\\circ) = {sin_val}$ olarak bilinir.",
        "topic": "Trigonometri",
        "subtopic": "Özel Açıların Trigonometrik Değerleri",
        **opts
    }

def q_polynomial() -> Dict[str, Any]:
    root = random.choice([2, 3, -1])
    remainder = random.choice([5, 7, 11, 13])
    opts = format_options(f"{remainder}", [f"{remainder + d}" for d in make_distractors(remainder)])
    return {
        "question_text": f"$P(x) = x^3 - 2x^2 + kx + 1$ polinomunun $x - {root}$ ile bölümünden kalan ${remainder}$ olduğuna göre, $P({root})$ değeri **kaçtır**?",
        "visual_svg": None,
        "explanation": f"Polinom kalan teoremine göre bir $P(x)$ polinomunun $x - a$ ile bölümünden kalan doğrudan $P(a)$ değerine eşittir. Dolayısıyla $P({root}) = {remainder}$ olur.",
        "topic": "Polinomlar",
        "subtopic": "Polinomlarda Kalan Teoremi",
        **opts
    }

def q_limit() -> Dict[str, Any]:
    a = random.choice([2, 3, 4, 5])
    ans = 2 * a
    opts = format_options(f"{ans}", [f"{ans + d}" for d in make_distractors(ans)])
    return {
        "question_text": f"$\\lim_{{x \\to {a}}} \\frac{{x^2 - {a**2}}}{{x - {a}}}$ limitinin değeri **kaçtır**?",
        "visual_svg": None,
        "explanation": f"Doğrudan $x={a}$ yazıldığında 0/0 belirsizliği oluşur. Sadeleştirme ile limit $2a = {ans}$ bulunur.",
        "topic": "Limit ve Süreklilik",
        "subtopic": "0/0 Belirsizliği ve Sadeleştirme",
        **opts
    }

# ================= GEOMETRİ ÜRETEÇLERİ =================

def q_geometry_triangle() -> Dict[str, Any]:
    triples = [(3, 4, 5), (6, 8, 10), (5, 12, 13), (8, 15, 17), (7, 24, 25), (9, 12, 15)]
    c, a, b = random.choice(triples)
    svg = generate_dynamic_triangle_svg(a, b, c, "ABC Dik Üçgeni (B Açısı 90°)")
    opts = format_options(f"{b}", [f"{b + d}" for d in [-3, -1, 1, 2, 4] if b + d > 0][:4])
    return {
        "question_text": f"Şekildeki $ABC$ dik üçgeninde $[AB] \\perp [BC]$, $|AB| = {c}\\text{{ cm}}$ ve $|BC| = {a}\\text{{ cm}}$ olarak verilmiştir. Buna göre, hipotenüs uzunluğu $|AC| = b$ **kaç cm**'dir?",
        "visual_svg": svg,
        "explanation": f"Pisagor teoremine göre: $|AC|^2 = |AB|^2 + |BC|^2 \\implies b = {b}\\text{{ cm}}$ bulunur.",
        "topic": "Özel Üçgenler (Dik, İkizkenar, Eşkenar)",
        "subtopic": "Pisagor Bağıntısı ve Hipotenüs",
        **opts
    }

def q_geometry_pythagoras_euclid() -> Dict[str, Any]:
    p, k, h = 4, 9, 6
    opts = format_options(f"{h}", [f"{h + d}" for d in [-2, -1, 1, 2, 3] if h + d > 0][:4])
    return {
        "question_text": f"Bir $ABC$ dik üçgeninde hipotenüse ait $[AH]$ yüksekliği çizilmiştir. Hipotenüs üzerinde ayrılan parçalar $|BH| = {p}\\text{{ cm}}$ ve $|HC| = {k}\\text{{ cm}}$ olduğuna göre, **yükseklik $|AH| = h$ kaç cm**'dir?",
        "visual_svg": None,
        "explanation": f"Öklid yükseklik bağıntısı: $h^2 = p \\cdot k \\implies h^2 = {p} \\cdot {k} = {p*k} \\implies h = {h}\\text{{ cm}}$ bulunur.",
        "topic": "Özel Üçgenler (Dik, İkizkenar, Eşkenar)",
        "subtopic": "Öklid Bağıntıları",
        **opts
    }

def q_geometry_circle() -> Dict[str, Any]:
    r = random.choice([3, 4, 5, 6, 7])
    area = r * r
    opts = format_options(f"${area}\\pi$", [f"${area + d}\\pi$" for d in make_distractors(area)])
    return {
        "question_text": f"Yarıçapı $r = {r}\\text{{ cm}}$ olan bir dairenin **alanı kaç $\\pi\\text{{ cm}}^2$**'dir?",
        "visual_svg": None,
        "explanation": f"Dairenin alanı formülü: $A = \\pi r^2 = \\pi \\cdot {r}^2 = {area}\\pi\\text{{ cm}}^2$ olur.",
        "topic": "Dairede Alan ve Çevre",
        "subtopic": "Daire Alan Formülü",
        **opts
    }

def q_geometry_analytic() -> Dict[str, Any]:
    x1, y1 = 1, 2
    dx, dy = 3, 4
    x2, y2 = x1 + dx, y1 + dy
    dist = int(math.hypot(dx, dy))
    opts = format_options(f"{dist}", [f"{dist + d}" for d in [-3, -1, 1, 2, 4] if dist + d > 0][:4])
    return {
        "question_text": f"Analitik düzlemde $A({x1}, {y1})$ ve $B({x2}, {y2})$ noktaları arasındaki **uzaklık kaç birimdir**?",
        "visual_svg": None,
        "explanation": f"İki nokta arası uzaklık: $d = \\sqrt{{(x_2-x_1)^2 + (y_2-y_1)^2}} = {dist}$ birimdir.",
        "topic": "Doğrunun Analitik İncelenmesi",
        "subtopic": "İki Nokta Arası Uzaklık",
        **opts
    }

def q_geometry_polygon() -> Dict[str, Any]:
    n = random.choice([5, 6, 8, 10])
    interior = ((n - 2) * 180) // n
    opts = format_options(f"${interior}^\\circ$", [f"${interior + d}^\\circ$" for d in [-30, -15, 15, 20, -10]])
    return {
        "question_text": f"Düzgün bir **${n}$'genin bir iç açısının ölçüsü kaç derecedir**?",
        "visual_svg": None,
        "explanation": f"İç açı = $(n - 2) \\times 180^\\circ / n = {interior}^\\circ$ bulunur.",
        "topic": "Çokgenler ve Düzgün Çokgenler",
        "subtopic": "Düzgün Çokgen İç Açı Hesabı",
        **opts
    }

def q_geometry_solid() -> Dict[str, Any]:
    r = random.choice([2, 3, 4])
    h = random.choice([5, 8, 10])
    vol = (r ** 2) * h
    opts = format_options(f"${vol}\\pi$", [f"${vol + d}\\pi$" for d in make_distractors(vol)])
    return {
        "question_text": f"Taban yarıçapı $r = {r}\\text{{ cm}}$ ve yüksekliği $h = {h}\\text{{ cm}}$ olan dik dairesel bir silindirin **hacmi kaç $\\pi\\text{{ cm}}^3$**'tür?",
        "visual_svg": None,
        "explanation": f"Silindir hacmi: $V = \\pi r^2 h = \\pi \\cdot {r}^2 \\cdot {h} = {vol}\\pi\\text{{ cm}}^3$ bulunur.",
        "topic": "Katı Cisimler (Prizma, Silindir, Koni, Piramit, Küre)",
        "subtopic": "Silindir Hacim Formülü",
        **opts
    }

# ================= FİZİK ÜRETEÇLERİ =================

def q_physics_circuit() -> Dict[str, Any]:
    r1 = random.choice([2, 4, 6])
    r2 = random.choice([3, 6, 12])
    r3 = random.choice([2, 4, 5])
    reş = r1 + r2 + r3
    v = random.choice([24, 36, 48, 60, 72])
    v = reş * (v // reş)
    if v == 0: v = reş * 2
    i = v // reş
    svg = generate_dynamic_circuit_svg(v, r1, r2, r3)
    opts = format_options(f"{i}", [f"{i + d}" for d in [-2, -1, 1, 2, 3] if i + d > 0][:4])
    return {
        "question_text": f"İç direnci önemsiz $V = {v}\\text{{ Volt}}$ gerilime sahip bir üretece, direnç değerleri $R_1 = {r1}\\ \\Omega$, $R_2 = {r2}\\ \\Omega$ ve $R_3 = {r3}\\ \\Omega$ olan üç direnç seri bağlanmıştır. Buna göre, devredeki **ana kol akımı kaç Amperdir**?",
        "visual_svg": svg,
        "explanation": f"Seri bağlı devrelerde eşdeğer direnç $R_{{eş}} = {reş}\\ \\Omega$ olur. Ohm Kanunu gereği $I = V / R_{{eş}} = {v} / {reş} = {i}\\text{{ A}}$ hesaplanır.",
        "topic": "Elektrik Akımı ve Devreler",
        "subtopic": "Ohm Kanunu ve Seri Bağlama",
        **opts
    }

def q_physics_newton() -> Dict[str, Any]:
    m = random.choice([2, 3, 4, 5])
    a = random.choice([2, 3, 4])
    f_net = m * a
    k = 0.2
    g = 10
    f_sürtünme = int(k * m * g)
    f_uygulanan = f_net + f_sürtünme
    opts = format_options(f"{a}", [f"{a + d}" for d in [-2, -1, 1, 2, 3] if a + d > 0][:4])
    return {
        "question_text": f"Yatay sürtünmeli bir zeminde durmakta olan $m = {m}\\text{{ kg}}$ kütleli bir cisme $F = {f_uygulanan}\\text{{ N}}$ büyüklüğünde yatay bir kuvvet uygulanmaktadır. Zemin ile cisim arasındaki sürtünme katsayısı $k = 0.2$ olduğuna göre, cismin **ivmesi kaç $\\text{{m/s}}^2$** olur? ($g = 10\\text{{ m/s}}^2$ alınız.)",
        "visual_svg": None,
        "explanation": f"Net kuvvet $F_{{net}} = F - f_s = {f_uygulanan} - {f_sürtünme} = {f_net}\\text{{ N}}$. İvme: $a = F_{{net}} / m = {f_net} / {m} = {a}\\text{{ m/s}}^2$ bulunur.",
        "topic": "Newton'ın Hareket Yasaları",
        "subtopic": "Sürtünmeli Yüzeyde İvme Hesabı",
        **opts
    }

def q_physics_optics() -> Dict[str, Any]:
    opts = format_options("Işın normale yaklaşarak kırılır ve hızı azalır.", [
        "Işın normalden uzaklaşarak kırılır ve hızı artar.",
        "Işının hızı ve doğrultusu kesinlikle değişmez.",
        "Işın tam yansıma yaparak geldiği ortama geri döner.",
        "Işının sadece frekansı değişir, dalga boyu sabit kalır."
    ])
    return {
        "question_text": "Kırılma indisi küçük olan az yoğun bir ortamdan (örneğin hava), kırılma indisi büyük olan çok yoğun bir ortama (örneğin cam) normale belirli bir dar açıyla gönderilen tek renkli bir ışık ışını için aşağıdakilerden **hangisi doğrudur**?",
        "visual_svg": None,
        "explanation": "Snell Kanununa göre az yoğun ortamdan çok yoğun ortama geçen ışın normale yaklaşarak kırılır. Ortamın kırıcılık indisi arttıkça ışığın ortamdaki yayılma sürati ($v = c/n$) azalır.",
        "topic": "Optik (Aydınlanma, Aynalar, Kırılma)",
        "subtopic": "Işığın Kırılması ve Yayılma Hızı",
        **opts
    }

def q_physics_thermodynamics() -> Dict[str, Any]:
    m = random.choice([100, 200, 300, 500])
    delta_t = random.choice([10, 20, 30, 40])
    q = m * 1 * delta_t
    opts = format_options(f"{q}", [f"{q + d}" for d in make_distractors(q, [100, 200, -200, 500, -500])])
    return {
        "question_text": f"Özısısı $c = 1\\text{{ cal/g}}^\\circ\\text{{C}}$ olan ${m}\\text{{ gram}}$ suyun sıcaklığını ${delta_t}^\\circ\\text{{C}}$ artırmak için sisteme verilmesi gereken **ısı enerjisi kaç kaloridir**?",
        "visual_svg": None,
        "explanation": f"Isı formülü: $Q = m \\cdot c \\cdot \\Delta T \\implies Q = {m} \\cdot 1 \\cdot {delta_t} = {q}\\text{{ kalori}}$ olarak hesaplanır.",
        "topic": "Isı, Sıcaklık ve Genleşme",
        "subtopic": "Özısı ve Sıcaklık Değişimi",
        **opts
    }

def q_physics_waves() -> Dict[str, Any]:
    f = random.choice([5, 10, 20, 50])
    lam = random.choice([2, 4, 5, 8])
    v = f * lam
    opts = format_options(f"{v}", [f"{v + d}" for d in make_distractors(v)])
    return {
        "question_text": f"Homojen ve gergin bir tel üzerinde periyodik dalgalar üreten bir kaynağın frekansı $f = {f}\\text{{ Hz}}$ ve üretilen dalgaların dalga boyu $\\lambda = {lam}\\text{{ m}}$'dir. Buna göre, bu dalgaların **yayılma hızı kaç m/s**'dir?",
        "visual_svg": None,
        "explanation": f"Dalga hızı formülü: $v = \\lambda \\cdot f \\implies v = {lam} \\cdot {f} = {v}\\text{{ m/s}}$ bulunur.",
        "topic": "Dalgalar (Yay, Su, Ses, Deprem)",
        "subtopic": "Dalga Hızı ve Frekans İlişkisi",
        **opts
    }

def q_physics_energy() -> Dict[str, Any]:
    h = random.choice([5, 20])
    g = 10
    v = int(math.isqrt(2 * g * h))
    opts = format_options(f"{v}", [f"{v + d}" for d in [-3, -2, 1, 2, 4] if v + d > 0][:4])
    return {
        "question_text": f"Sürtünmelerin önemsenmediği bir ortamda bir cisim ${h}\\text{{ metre}}$ yükseklikten serbest bırakılıyor. Cismin **yere çarpma hızı kaç m/s**'dir? ($g = 10\\text{{ m/s}}^2$)",
        "visual_svg": None,
        "explanation": f"Mekanik enerjinin korunumu: $mgh = \\frac{{1}}{{2}}mv^2 \\implies v = \\sqrt{{2gh}} = \\sqrt{{2 \\cdot 10 \\cdot {h}}} = {v}\\text{{ m/s}}$ bulunur.",
        "topic": "İş, Güç ve Enerji",
        "subtopic": "Mekanik Enerjinin Korunumu",
        **opts
    }

def q_physics_buoyancy() -> Dict[str, Any]:
    opts = format_options("Sıvının özkütlesi cismin özkütlesine eşittir ($d_{sıvı} = d_{cisim}$).", [
        "Sıvının özkütlesi cismin özkütlesinden kesinlikle küçüktür.",
        "Cisme etki eden kaldırma kuvveti cismin ağırlığından daha büyüktür.",
        "Cismin batan hacmi toplam hacminden daha küçüktür.",
        "Cisme hiçbir kaldırma kuvveti etki etmemektedir."
    ])
    return {
        "question_text": "Homojen bir katı cisim, bir sıvı içerisine bırakıldığında tabana değmeden tamamen sıvı içerisinde asılı kalarak dengeleniyor. Buna göre cisim ve sıvı için **hangisi kesinlikle doğrudur**?",
        "visual_svg": None,
        "explanation": "Bir cisim sıvı içerisinde tamamen batmış halde dengede (askıda) kalıyorsa kaldırma kuvveti ağırlığa eşittir ($F_k = G$) ve cismin özkütlesi sıvınınkine eşittir ($d_c = d_s$).",
        "topic": "Basınç ve Kaldırma Kuvveti",
        "subtopic": "Sıvılarda Askıda Kalma Dengesi",
        **opts
    }

# ================= KİMYA ÜRETEÇLERİ =================

def q_chemistry_mole() -> Dict[str, Any]:
    n = random.choice([0.5, 1.5, 2.0, 2.5])
    m = n * 16
    v_nko = n * 22.4
    opts = format_options(f"{v_nko:.1f}", [f"{(v_nko + d):.1f}" for d in [-11.2, 5.6, -5.6, 11.2, 22.4] if v_nko + d > 0][:4])
    return {
        "question_text": f"${m:.1f}\\text{{ gram}}$ $CH_4$ (metan) gazı normal koşullar altında (NKÖ) **kaç litre hacim kaplar**? ($C: 12\\text{{ g/mol}}$, $H: 1\\text{{ g/mol}}$)",
        "visual_svg": None,
        "explanation": f"Mol sayısı $n = m / M_A = {m:.1f} / 16 = {n}\\text{{ mol}}$. NKÖ'de $V = {n} \\times 22.4 = {v_nko:.1f}\\text{{ Litre}}$ olur.",
        "topic": "Mol Kavramı",
        "subtopic": "NKÖ Hacim ve Mol İlişkisi",
        **opts
    }

def q_chemistry_molarity() -> Dict[str, Any]:
    n_mol = random.choice([0.2, 0.4, 0.5, 1.0])
    v_litre = random.choice([0.5, 1.0, 2.0])
    molarite = n_mol / v_litre
    opts = format_options(f"{molarite:.2f}", [f"{(molarite + d):.2f}" for d in [-0.2, 0.1, 0.2, -0.1, 0.5] if molarite + d > 0][:4])
    return {
        "question_text": f"${n_mol}\\text{{ mol}}$ $NaOH$ katısı saf suda çözülerek hacmi ${v_litre}\\text{{ L}}$ olan bir sulu çözelti hazırlanıyor. Bu çözeltinin **molar derişimi (molaritesi) kaç M**'dir?",
        "visual_svg": None,
        "explanation": f"Molarite formülü: $M = n / V \\implies M = {n_mol} / {v_litre} = {molarite:.2f}\\text{{ M}}$ bulunur.",
        "topic": "Sıvı Çözeltiler ve Derişim Birimleri",
        "subtopic": "Molarite Hesabı",
        **opts
    }

def q_chemistry_gas_laws() -> Dict[str, Any]:
    p1 = random.choice([1, 2, 3])
    v1 = random.choice([6, 8, 12])
    v2 = random.choice([2, 3, 4])
    p2 = (p1 * v1) / v2
    opts = format_options(f"{p2:.1f}", [f"{(p2 + d):.1f}" for d in [-2.0, 1.0, 2.0, -1.0, 3.0] if p2 + d > 0][:4])
    return {
        "question_text": f"Sabit sıcaklıkta kapalı bir kapta bulunan ideal bir gazın basıncı ${p1}\\text{{ atm}}$ iken hacmi ${v1}\\text{{ L}}$'dir. Gazın hacmi aynı sıcaklıkta ${v2}\\text{{ L}}$'ye düşürülürse son **basıncı kaç atm** olur?",
        "visual_svg": None,
        "explanation": f"Boyle Yasası ($T, n$ sabit): $P_1 \\cdot V_1 = P_2 \\cdot V_2 \\implies P_2 = {p2:.1f}\\text{{ atm}}$ bulunur.",
        "topic": "Gazlar (İdeal Gaz Yasası)",
        "subtopic": "Boyle Yasası Basınç-Hacim",
        **opts
    }

def q_chemistry_acid_base() -> Dict[str, Any]:
    ph = random.choice([2, 3, 4])
    poh = 14 - ph
    opts = format_options(f"{poh}", [f"{poh + d}" for d in [-2, -1, 1, 2, 3] if 0 < poh + d <= 14][:4])
    return {
        "question_text": f"$25^\\circ\\text{{C}}$ sıcaklıkta hazırlanan bir sulu çözeltinin hidrojen iyonu derişimi $[H^+] = 10^{{-{ph}}}\\text{{ M}}$ olduğuna göre, bu çözeltinin **pOH değeri kaçtır**?",
        "visual_svg": None,
        "explanation": f"$pH = -\\log[H^+] = {ph}$. $25^\\circ\\text{{C}}$'de $pH + pOH = 14 \\implies pOH = 14 - {ph} = {poh}$ bulunur.",
        "topic": "Asitler, Bazlar ve Tuzlar",
        "subtopic": "pH ve pOH Bağıntısı",
        **opts
    }

def q_chemistry_periodic_table() -> Dict[str, Any]:
    opts = format_options("Atom yarıçapı azalır, birinci iyonlaşma enerjisi genellikle artar.", [
        "Atom yarıçapı artar, elektronegatiflik azalır.",
        "Değerlik elektron sayısı azalır, metalik özellik artar.",
        "Hem atom yarıçapı hem de iyonlaşma enerjisi azalır.",
        "Çekirdek yükü azalır, ametalik aktiflik düşer."
    ])
    return {
        "question_text": "Periyodik cetvelde aynı periyotta **soldan sağa doğru gidildikçe** atom yarıçapı ve birinci iyonlaşma enerjisi değişimi için aşağıdakilerden hangisi doğrudur?",
        "visual_svg": None,
        "explanation": "Aynı periyotta soldan sağa gidildikçe çekirdek yükü (proton sayısı) artar, elektronlar çekirdek tarafından daha güçlü çekildiğinden atom yarıçapı azalır. Bu nedenle birinci iyonlaşma enerjisi genellikle artar.",
        "topic": "Atom ve Periyodik Sistem",
        "subtopic": "Periyodik Özelliklerin Değişimi",
        **opts
    }

# ================= BİYOLOJİ ÜRETEÇLERİ =================

def q_biology_genetics() -> Dict[str, Any]:
    opts = format_options("%25", ["%50", "%75", "%0", "%100"])
    return {
        "question_text": "Heterozigot kahverengi gözlü ($Aa$) anne ile heterozigot kahverengi gözlü ($Aa$) babanın doğacak çocuklarının **mavi gözlü ($aa$) olma olasılığı yüzde kaçtır**? (Kahverengi göz geni mavi göz genine baskındır.)",
        "visual_svg": None,
        "explanation": "Monohibrit çaprazlama: $Aa \\times Aa \\implies 1/4\\ AA, 2/4\\ Aa, 1/4\\ aa$. Çekinik fenotip ($aa$) oranı 1/4 yani %25'tir.",
        "topic": "Kalıtımın Genel İlkeleri",
        "subtopic": "Monohibrit Çaprazlama ve Olasılık",
        **opts
    }

def q_biology_cell_division() -> Dict[str, Any]:
    opts = format_options("Mayoz I bölünmesinde homolog kromozomların rastgele ayrılması ve krossing-over", [
        "Mitoz bölünmenin anafaz evresinde kardeş kromatitlerin ayrılması",
        "İnterfaz evresinde DNA'nın kendini hatasız eşlemesi (replikasyon)",
        "Sitoplazma bölünmesinin boğumlanarak gerçekleşmesi",
        "Çekirdek zarının profaz evresinde eriyerek kaybolması"
    ])
    return {
        "question_text": "Eşeyli üreyen canlılarda tür içi **genetik çeşitliliğin (varyasyonun)** ortaya çıkmasını sağlayan en temel hücresel mekanizma aşağıdakilerden hangisidir?",
        "visual_svg": None,
        "explanation": "Mayoz bölünmenin Profaz I evresinde meydana gelen krossing-over ve Anafaz I'de homolog kromozomların rastgele dağılması genetik çeşitliliğin temel kaynaklarıdır.",
        "topic": "Mayoz Bölünme ve Eşeyli Üreme",
        "subtopic": "Genetik Varyasyon ve Krossing-over",
        **opts
    }

def q_biology_ecology() -> Dict[str, Any]:
    opts = format_options("Üst trofik düzeylere çıkıldıkça dokularda biriken zehirli madde miktarı (biyolojik birikim) artar.", [
        "Üreticilerden son tüketicilere doğru toplam biyokütle sürekli artar.",
        "Her basamakta enerjinin %90'ı bir üst basamağa aktarılır.",
        "Trofik düzeyler yükseldikçe canlıların vücut büyüklüğü daima küçülür.",
        "Ayrıştırıcılar (saprofitler) sadece besin piramidinin en alt basamağında yer alır."
    ])
    return {
        "question_text": "Karasal bir besin piramidinde üreticilerden son tüketicilere doğru gidildikçe meydana gelen değişimlerle ilgili **hangisi doğrudur**?",
        "visual_svg": None,
        "explanation": "Besin piramidinde yukarı doğru çıkıldıkça biyolojik birikim (ağır metaller, pestisitler) artar; aktarılan enerji her düzeyde yaklaşık %10 ile sınırlıdır.",
        "topic": "Ekosistem Ekolojisi",
        "subtopic": "Besin Zinciri ve Biyolojik Birikim",
        **opts
    }

def q_biology_photosynthesis() -> Dict[str, Any]:
    opts = format_options("Işıktan bağımsız evrede (Calvin döngüsü) $CO_2$ harcanarak glikoz sentezlenir.", [
        "Işığa bağımlı evrede $CO_2$ doğrudan atmosfere verilir.",
        "Glikoliz reaksiyonları sadece kloroplast organelinde gerçekleşir.",
        "Fotoliz olayı kloroplastın stromasında meydana gelir.",
        "Oksijen gazı ışıktan bağımsız tepkimelerde açığa çıkar."
    ])
    return {
        "question_text": "Ökaryot bir bitki hücresinde gerçekleşen **fotosentez tepkimeleri** ile ilgili aşağıdaki ifadelerden hangisi doğrudur?",
        "visual_svg": None,
        "explanation": "Fotosentezin Calvin döngüsü stromada gerçekleşir ve $CO_2$ harcanarak glikoz üretilir.",
        "topic": "Canlılarda Enerji Dönüşümleri",
        "subtopic": "Fotosentez Evreleri",
        **opts
    }

def q_biology_dna_protein() -> Dict[str, Any]:
    opts = format_options("mRNA üzerindeki kodonlar ile tRNA üzerindeki antikodonlar arasında geçici hidrojen bağları kurulur.", [
        "Protein sentezinde DNA doğrudan ribozomun aktif merkezine bağlanır.",
        "Bir amino asit daima sadece tek bir kodon çeşidi ile şifrelenebilir.",
        "Transkripsiyon işlemi sitoplazmadaki ribozomlarda tamamlanır.",
        "Tüm kodonlar mutlaka bir amino asit karşılığına sahiptir."
    ])
    return {
        "question_text": "Hücrede gerçekleşen **translasyon (protein sentezi)** süreci ile ilgili aşağıdaki bilgilerden hangisi doğrudur?",
        "visual_svg": None,
        "explanation": "Translasyon sırasında ribozomda mRNA'daki 3'lü nükleotit dizileri (kodon) ile uygun tRNA'ların (antikodon) eşleşmesi geçici hidrojen bağlarıyla sağlanır.",
        "topic": "Genden Proteine",
        "subtopic": "Protein Sentezi ve Kodon-Antikodon",
        **opts
    }

# ================= TÜRKÇE & EDEBİYAT ÜRETEÇLERİ =================

TURKISH_READINGS = [
    (
        "Teknolojinin sunduğu sonsuz bilgi akışı, bireylerin derinlemesine düşünme ve odaklanma becerilerini zamanla aşındırmaktadır. Eskiden saatlerce bir kitabın dünyasına dalıp giden insan, bugün birkaç saniyelik görsel uyarıcıların peşinden koşan sabırsız bir izleyiciye dönüşmüştür. Bu yüzeysellik, sanatsal yaratıcılıktan felsefi sorgulamalara kadar her alanı derinden etkilemektedir.",
        "Dijital hız ve bilgi bombardımanı insanın derinlikli odaklanma yeteneğini zayıflatmaktadır.",
        ["Teknoloji sayesinde insanların okuma ve anlama hızı katlanarak artmıştır.", "Görsel uyarıcılar felsefi yaratıcılığı zenginleştiren en önemli unsurdur.", "Geleneksel kitaplar dijital çağın getirdiği gereksinimleri karşılamaktan uzaktır."],
        "Paragrafta teknolojinin hızının derin düşünmeyi ve sabırlı odaklanmayı zedelediği ana düşünce olarak vurgulanmıştır."
    ),
    (
        "Sanatçı, çağına tanıklık eden ama onun dar sınırlarına hapsolmayan kişidir. Bir romancı veya şair, yaşadığı dönemin toplumsal çalkantılarını eserine nakşederken evrensel insanlık durumunu ıskalarsa, eseri yarınlara kalamaz. Çünkü kalıcılık, yerelden yola çıkıp evrensel değerlerle buluşabilme ustalığıdır.",
        "Sanat eserinin kalıcılığı, yerel olayları evrensel insanlık temalarıyla harmanlamasına bağlıdır.",
        ["Sanatçı yalnızca kendi çağının modasına ve beklentilerine uygun eser üretmelidir.", "Evrensel temaları işleyen yazarlar toplumsal gerçeklikten kopuk kalırlar.", "Kalıcı olmanın tek koşulu soyut ve anlaşılmaz bir dil kullanmaktır."],
        "Yazar, yerellikten evrenselliğe uzanabilen yapıtların zamana direnebileceğini belirtmektedir."
    ),
    (
        "Eleştiri, bir edebiyat eserini yargılayıp mahkûm etme kürsüsü değil; aksine okur ile metin arasında köprü kurma sanatıdır. Yetkin bir eleştirmen, yazarın kurduğu dünyayı didik didik ederken onun gizli estetik katmanlarını gün ışığına çıkarır. Böylece okur, metnin yüzeyinde göremediği zenginlikleri keşfeder.",
        "Eleştirinin temel gayesi, eserin derinliklerini açığa çıkararak okurun alımlamasını zenginleştirmektir.",
        ["Eleştirmen eserin zayıf yönlerini cezalandırmakla görevli bir hakemdir.", "İyi bir metin hiçbir eleştiriye ve rehberliğe ihtiyaç duymadan anlaşılır.", "Eleştiri yazıları edebi eserlerin özgünlüğünü kısıtlayan bir engeldir."],
        "Paragrafta eleştirinin okur ile metin arasındaki zenginleştirici köprü işlevi ele alınmıştır."
    ),
    (
        "Mimari yapılar, taş ve harçtan ibaret fiziki varlıklar değil; bir toplumun hayat tasavvurunun, inanç sisteminin ve tabiatla kurduğu ilişkinin mekâna yansımasıdır. Osmanlı cami ve külliyelerine baktığınızda yalnızca ibadet mekânı değil; aşevi, medrese ve şifahane ile bütünleşmiş bir merhamet medeniyeti görürsünüz.",
        "Mimari eserler inşa edildikleri toplumun kültürel, ahlaki ve zihinsel kodlarını yansıtır.",
        ["Tarihi yapıların dayanıklılığı kullanılan malzemenin cinsine bağlıdır.", "Mimarlık sadece estetik kaygılarla üretilen pratikten ibarettir.", "Geleneksel mimarinin günümüz kent yaşamına uygulanması imkânsızdır."],
        "Paragrafta mimarinin bir toplumun değerler sistemini somutlaştırdığı vurgulanmıştır."
    )
]

def q_turkish_reading() -> Dict[str, Any]:
    item = random.choice(TURKISH_READINGS)
    opts = format_options(item[1], item[2])
    return {
        "question_text": f"**Paragraf:**\n\"{item[0]}\"\n\nBu parçadan çıkarılabilecek **en kapsamlı yargı (ana düşünce)** aşağıdakilerden hangisidir?",
        "visual_svg": None,
        "explanation": item[3],
        "topic": "Paragrafta Anlam ve Ana Düşünce",
        "subtopic": "Ana Fikir Çıkarımı",
        **opts
    }

def q_turkish_spelling() -> Dict[str, Any]:
    opts = format_options("Herkes bu akşamki toplantıda ardı ardına söz alarak fikirlerini beyan etti.", [
        "Herkez bu akşam ki toplantıda ard arda söz alarak fikirlerini beyan etti.",
        "Herkes bu akşamki toplantı da ard arda söz alarak fikirlerini beyan etti.",
        "Herkez bu akşamki toplantıda ardı ardına söz alarak fikirlerini beyan etti.",
        "Herkes bu akşam ki toplantıda ardı ardına söz alarak fikirlerini beyan etti."
    ])
    return {
        "question_text": "Aşağıdaki cümlelerin hangisinde **yazım kurallarına tamamen uyulmuştur**?",
        "visual_svg": None,
        "explanation": "'Herkes' 's' ile yazılır. Sıfat yapan '-ki' bitişik yazılır ('akşamki toplantı'). İkileme olan 'ardı ardına' ayrı yazılır.",
        "topic": "Yazım Kuralları",
        "subtopic": "Bağlaçlar, Ekler ve İkilemelerin Yazımı",
        **opts
    }

def q_turkish_punctuation() -> Dict[str, Any]:
    opts = format_options("Noktalı virgül (;)", [
        "İki nokta (:)",
        "Üç nokta (...)",
        "Kısa çizgi (-)",
        "Soru işareti (?)"
    ])
    return {
        "question_text": "\"At ölür, meydan kalır [ ] yiğit ölür, şan kalır.\" cümlesinde yay ayraçla gösterilen yere **hangi noktalama işareti getirilmelidir**?",
        "visual_svg": None,
        "explanation": "Ögeleri arasında virgül bulunan sıralı cümleleri birbirinden ayırmak için noktalı virgül (;) kullanılır.",
        "topic": "Noktalama İşaretleri",
        "subtopic": "Sıralı Cümlelerde Noktalı Virgül",
        **opts
    }

def q_turkish_sound_events() -> Dict[str, Any]:
    opts = format_options("Ünlü düşmesi", [
        "Ünsüz türemesi",
        "Ünlü daralması",
        "Büyük ünlü uyumu bozulması",
        "Dudak ünsüzü benzeşmesi"
    ])
    return {
        "question_text": "\"Akıl\" sözcüğü \"aklım\", \"omuz\" sözcüğü \"omzu\", \"şehir\" sözcüğü \"şehre\" şeklinde kullanıldığında meydana gelen **ses olayı hangisidir**?",
        "visual_svg": None,
        "explanation": "İki heceli bazı sözcükler ünlüyle başlayan bir ek aldıklarında ikinci hecedeki dar ünlü düşer. Bu ses olayına ünlü düşmesi denir.",
        "topic": "Ses Bilgisi",
        "subtopic": "Ünlü Düşmesi (Hece Düşmesi)",
        **opts
    }

def q_literature_divan() -> Dict[str, Any]:
    opts = format_options("Gazel", ["Kaside", "Mesnevi", "Rubai", "Tuyuğ"])
    return {
        "question_text": "Divan edebiyatında aşk, şarap, kadın ve güzellik temalarını işleyen, beyit sayısı genellikle 5-15 arasında değişen ve ilk beytine 'matla', son beytine 'makta' adı verilen nazım biçimi **aşağıdakilerden hangisidir**?",
        "visual_svg": None,
        "explanation": "Belirtilen özellikler Divan şiirinin en yaygın lirik nazım şekli olan 'Gazel'e aittir.",
        "topic": "Divan Edebiyatı",
        "subtopic": "Nazım Biçimleri (Gazel)",
        **opts
    }

# ================= SOSYAL BİLİMLER (TARİH, COĞRAFYA, FELSEFE, DİN) ÜRETEÇLERİ =================

def q_history_early_turks() -> Dict[str, Any]:
    opts = format_options("Kut inancı ve veraset belirsizliği nedeniyle hanedan üyeleri arasında taht kavgalarının yaşanması", [
        "Tarıma dayalı yerleşik bir feodal düzenin kurulamamış olması",
        "Devlet işlerinin Kurultay adı verilen danışma meclisinde görüşülmesi",
        "Ordu teşkilatında onlu sistemin uygulanması",
        "İpek Yolu ticaretinin denetim altına alınamaması"
    ])
    return {
        "question_text": "İlk ve Orta Çağ Türk devletlerinde hükümdarlık yetkisinin Gök Tengri tarafından hanedana verildiğine inanılan **'kut anlayışı'nın yol açtığı en temel siyasi sonuç** aşağıdakilerden hangisidir?",
        "visual_svg": None,
        "explanation": "Kut inancına göre hükümdarlık kanı hanedanın tüm erkek üyelerine geçerdi. Belirli bir veraset kanununun olmaması sık sık taht kavgalarına yol açmıştır.",
        "topic": "İlk ve Orta Çağlarda Türk Dünyası",
        "subtopic": "Kut Anlayışı ve Veraset Sistemi",
        **opts
    }

def q_history_ottoman() -> Dict[str, Any]:
    opts = format_options("İstimâlet (hoşgörü) ve İskân politikası", [
        "Devşirme sisteminin tamamen kaldırılması",
        "Kapitülasyonların tüm Avrupa ülkelerine yayılması",
        "Sancağa çıkma uygulamasının terk edilmesi",
        "Yeniçeri Ocağı'nın kapatılması"
    ])
    return {
        "question_text": "Osmanlı Devleti'nin Balkanlar'da fethettiği topraklarda kalıcılık sağlamasında ve yerel halkın devlete bağlılığını artırmasında **en etkili olan strateji hangisidir**?",
        "visual_svg": None,
        "explanation": "Osmanlı Devleti fethettiği Balkan topraklarında yerli halkın dinine ve geleneklerine saygı gösteren 'İstimâlet' ve Anadolu'dan aileleri yerleştiren 'İskân' politikasını uygulamıştır.",
        "topic": "Dünya Gücü Osmanlı",
        "subtopic": "Balkanlarda İskan ve İstimalet",
        **opts
    }

def q_history_republic() -> Dict[str, Any]:
    opts = format_options("Misak-ı Milli sınırları büyük oranda kabul edilmiş, kapitülasyonlar kesin olarak kaldırılmıştır.", [
        "Boğazların kontrolü tamamen yabancı bir komisyona bırakılmıştır.",
        "Türkiye savaş tazminatı olarak Musul ve Kerkük'ü tazminat olarak almıştır.",
        "Hatay meselesi derhal Türkiye lehine çözüme kavuşturulmuştur.",
        "Osmanlı borçlarının tamamı silinerek ödeme yapılmamıştır."
    ])
    return {
        "question_text": "24 Temmuz 1923'te imzalanan **Lozan Barış Antlaşması'nın Türk milleti açısından en önemli kazanımlarından biri** aşağıdakilerden hangisidir?",
        "visual_svg": None,
        "explanation": "Lozan Antlaşması ile Türkiye Cumhuriyeti bağımsız bir devlet olarak tanınmış ve kapitülasyonlar tamamen kaldırılmıştır.",
        "topic": "Milli Mücadele (Kurtuluş Savaşı)",
        "subtopic": "Lozan Barış Antlaşması ve Kapitülasyonlar",
        **opts
    }

def q_geography_climate() -> Dict[str, Any]:
    opts = format_options("Akdeniz İklimi", [
        "Karadeniz İklimi",
        "Sert Karasal İklim",
        "Muson İklimi",
        "Tundra İklimi"
    ])
    return {
        "question_text": "\"Yazları sıcak ve kurak, kışları ılık ve yağışlı geçen; doğal bitki örtüsü zeytin, defne gibi kısa bodur ağaçlardan oluşan maki olan iklim tipi\" **aşağıdakilerden hangisidir**?",
        "visual_svg": None,
        "explanation": "Yazları sıcak ve kurak, kışları ılık ve yağışlı iklim karakteri ile maki bitki örtüsü Akdeniz ikliminin en belirgin özelliğidir.",
        "topic": "Atmosfer, Hava Durumu ve İklim",
        "subtopic": "Türkiye'de ve Dünyada İklim Tipleri",
        **opts
    }

def q_geography_coordinates() -> Dict[str, Any]:
    diff_meridian = random.choice([15, 30, 45])
    diff_hours = diff_meridian // 15
    opts = format_options(f"{diff_hours} saat ileri", [
        f"{diff_hours} saat geri",
        f"{diff_hours * 2} saat ileri",
        f"{diff_hours * 2} saat geri",
        "Aynı saattedir"
    ])
    return {
        "question_text": f"Aynı paralel üzerinde bulunan ve aralarında ${diff_meridian}^\\circ$ boylam farkı olan iki merkezden daha doğuda olan merkezde yerel saat batıdakine göre **nasıl bir farklılık gösterir**?",
        "visual_svg": None,
        "explanation": f"Doğudaki merkezlerde yerel saat daima ileridir. Her $15^\\circ$ boylam 1 saat zaman farkına denk geldiğinden ${diff_meridian}^\\circ$ fark ${diff_hours}$ saat ileri zaman demektir.",
        "topic": "Coğrafi Konum ve Koordinat Sistemi",
        "subtopic": "Yerel Saat Hesaplamaları",
        **opts
    }

def q_philosophy() -> Dict[str, Any]:
    opts = format_options("Rasyonalizm (Akılcılık)", [
        "Empirizm (Deneycilik)",
        "Kritisizm (Eleştiricilik)",
        "Entüisyonizm (Sezgicilik)",
        "Nihilizm (Hiççilik)"
    ])
    return {
        "question_text": "\"Doğru bilginin kaynağı duyulardan değil, doğuştan zihinde var olan akıl ve düşünme ilkelerinden gelir.\" görüşünü savunan felsefi epistemoloji akımı **hangisidir**?",
        "visual_svg": None,
        "explanation": "Doğru bilginin akıl ve mantık yoluyla doğuştan elde edildiğini öne süren akım Rasyonalizmdir.",
        "topic": "Bilgi Felsefesi (Epistemoloji)",
        "subtopic": "Bilginin Kaynağı Akımları",
        **opts
    }

def q_religion() -> Dict[str, Any]:
    opts = format_options("Zekât", ["Hac", "Kelime-i Şehadet", "Namaz", "Oruç"])
    return {
        "question_text": "İslam dininde dinen zengin sayılan Müslümanların, sahip oldukları nisap miktarı mal veya paralarının yılda bir kez belirli bir oranını (genellikle kırkta birini) ihtiyaç sahiplerine vermesi farz olan ibadet **hangisidir**?",
        "visual_svg": None,
        "explanation": "Maddi yardımlaşmayı ve toplumsal adaleti pekiştiren, yılda bir kez nisap miktarı mala sahip olanların verdiği farz ibadet Zekât'tır.",
        "topic": "İslam ve İbadetler",
        "subtopic": "Paylaşma ve Zekat İbadeti",
        **opts
    }

# ================= AKILLI SORU HAVUZU VE GÖREVLENDİRİCİ =================

MATH_GENERATOR_REGISTRY = [
    q_cargo_tariff, q_function, q_parabola_max, q_derivative_tangent,
    q_integral_area, q_age_problem, q_percentage_profit, q_speed_motion,
    q_combinations, q_probability_dice, q_ebob_ekok, q_logarithm,
    q_trigonometry, q_polynomial, q_limit
]

GEOMETRY_GENERATOR_REGISTRY = [
    q_geometry_triangle, q_geometry_pythagoras_euclid, q_geometry_circle,
    q_geometry_analytic, q_geometry_polygon, q_geometry_solid
]

PHYSICS_GENERATOR_REGISTRY = [
    q_physics_circuit, q_physics_newton, q_physics_optics,
    q_physics_thermodynamics, q_physics_waves, q_physics_energy,
    q_physics_buoyancy
]

CHEMISTRY_GENERATOR_REGISTRY = [
    q_chemistry_mole, q_chemistry_molarity, q_chemistry_gas_laws,
    q_chemistry_acid_base, q_chemistry_periodic_table
]

BIOLOGY_GENERATOR_REGISTRY = [
    q_biology_genetics, q_biology_cell_division, q_biology_ecology,
    q_biology_photosynthesis, q_biology_dna_protein
]

TURKISH_GENERATOR_REGISTRY = [
    q_turkish_reading, q_turkish_spelling, q_turkish_punctuation,
    q_turkish_sound_events, q_literature_divan
]


def q_history_seljuk() -> Dict[str, Any]:
    opts = format_options("Malazgirt Meydan Muharebesi (1071)", [
        "Dandanakan Savaşı (1040)",
        "Pasinler Savaşı (1048)",
        "Katvan Savaşı (1141)",
        "Yassıçemen Savaşı (1230)"
    ])
    return {
        "question_text": "Büyük Selçuklu Hükümdarı Sultan Alparslan'ın Bizans İmparatoru Romen Diyojen'i mağlup ederek **'Anadolu'nun kapılarını Türklere kesin olarak açtığı'** tarihi zafer hangisidir?",
        "visual_svg": None,
        "explanation": "1071 Malazgirt Zaferi ile Bizans'ın Anadolu'daki direnci kırılmış ve Anadolu'nun fethi ile Türkleşme süreci hız kazanmıştır.",
        "topic": "Selçuklu Türkiyesi",
        "subtopic": "Malazgirt Zaferi ve Anadolu",
        **opts
    }

def q_history_inkilap() -> Dict[str, Any]:
    opts = format_options("Laiklik", [
        "Devletçilik",
        "Halkçılık",
        "Cumhuriyetçilik",
        "Milliyetçilik"
    ])
    return {
        "question_text": "Halifeliğin kaldırılması (1924), Medreselerin kapatılması ve Medeni Kanun'un kabulü (1926) doğrudan **Atatürk'ün hangi ilkesi doğrultusunda gerçekleştirilmiştir**?",
        "visual_svg": None,
        "explanation": "Din ile devlet işlerinin ayrılmasını, vicdan özgürlüğünü ve akılcı hukuk düzenini tesis eden bu devrimler Laiklik ilkesinin temel adımlarıdır.",
        "topic": "Atatürkçülük ve Türk İnkılabı",
        "subtopic": "Atatürk İlkeleri (Laiklik)",
        **opts
    }

def q_history_ww1() -> Dict[str, Any]:
    opts = format_options("Çanakkale Cephesi", [
        "Kafkas Cephesi",
        "Kanal Cephesi",
        "Hicaz-Yemen Cephesi",
        "Galiçya Cephesi"
    ])
    return {
        "question_text": "I. Dünya Savaşı'nda Osmanlı Devleti'nin İtilaf Devletleri donanmasını püskürterek **zafer kazandığı ve Çarlık Rusya'sına yardım gitmesini engelleyerek Rusya'da Bolşevik İhtilali'nin çıkmasında etkili olduğu savunma cephesi** hangisidir?",
        "visual_svg": None,
        "explanation": "Çanakkale Cephesi Osmanlı'nın I. Dünya Savaşı'nda net bir zafer elde ettiği, savaşın uzamasına ve Rusya'da çarlığın çökmesine yol açan cephedir.",
        "topic": "XX. Yüzyıl Başlarında Osmanlı Devleti",
        "subtopic": "I. Dünya Savaşı ve Çanakkale Cephesi",
        **opts
    }

def q_geography_population() -> Dict[str, Any]:
    opts = format_options("İklim şartlarının elverişli olması ve sanayi-ticaret olanaklarının gelişmiş olması", [
        "Doğal bitki örtüsünün sık ormanlarla kaplı olması",
        "Yükseltinin ve engebenin oldukça fazla olması",
        "Maden rezervlerinin tüm diğer bölgelerden zengin olması",
        "Volkanik arazilerin geniş yer kaplaması"
    ])
    return {
        "question_text": "Türkiye'de Çatalca-Kocaeli Bölümü, Kıyı Ege ve Çukurova yörelerinin **yoğun nüfuslu olmasının en temel ortak sebebi** aşağıdakilerden hangisidir?",
        "visual_svg": None,
        "explanation": "Bu bölgeler elverişli iklim şartları, ulaşım kolaylığı ve gelişmiş tarım/sanayi/ticaret imkânları sayesinde yoğun göç almaktadır.",
        "topic": "Nüfus ve Yerleşme",
        "subtopic": "Türkiye'de Nüfusun Dağılışı",
        **opts
    }

SOCIAL_GENERATOR_REGISTRY = [
    q_history_early_turks, q_history_ottoman, q_history_republic,
    q_history_seljuk, q_history_inkilap, q_history_ww1,
    q_geography_climate, q_geography_coordinates, q_geography_population,
    q_philosophy, q_religion
]

def get_procedural_candidates_pool(exam_type: str, subject: str, topic: str = "Karma") -> List[Any]:
    subj = (subject or "").lower()
    top = (topic or "").lower()

    if "geometri" in subj:
        return list(GEOMETRY_GENERATOR_REGISTRY)

    elif "fizik" in subj:
        if "elektrik" in top or "devre" in top:
            return [q_physics_circuit, q_physics_energy, q_physics_newton]
        if "optik" in top or "ayna" in top or "kırılma" in top:
            return [q_physics_optics, q_physics_waves]
        if "ısı" in top or "sıcaklık" in top:
            return [q_physics_thermodynamics, q_physics_energy]
        if "dalga" in top:
            return [q_physics_waves, q_physics_optics]
        if "kuvvet" in top or "hareket" in top or "newton" in top:
            return [q_physics_newton, q_physics_energy]
        if "basınç" in top or "kaldırma" in top:
            return [q_physics_buoyancy, q_physics_newton]
        return list(PHYSICS_GENERATOR_REGISTRY)

    elif "kimya" in subj:
        if "mol" in top:
            return [q_chemistry_mole, q_chemistry_gas_laws, q_chemistry_molarity]
        if "çözelti" in top or "derişim" in top:
            return [q_chemistry_molarity, q_chemistry_acid_base]
        if "gaz" in top:
            return [q_chemistry_gas_laws, q_chemistry_mole]
        if "asit" in top or "baz" in top:
            return [q_chemistry_acid_base, q_chemistry_molarity]
        if "periyodik" in top or "atom" in top:
            return [q_chemistry_periodic_table, q_chemistry_mole]
        return list(CHEMISTRY_GENERATOR_REGISTRY)

    elif "biyoloji" in subj:
        if "kalıtım" in top or "genetik" in top:
            return [q_biology_genetics, q_biology_dna_protein]
        if "bölünme" in top or "mitoz" in top or "mayoz" in top:
            return [q_biology_cell_division, q_biology_genetics]
        if "ekoloji" in top or "ekosistem" in top:
            return [q_biology_ecology, q_biology_photosynthesis]
        if "fotosentez" in top or "solunum" in top or "enerji" in top:
            return [q_biology_photosynthesis, q_biology_ecology]
        if "protein" in top or "dna" in top:
            return [q_biology_dna_protein, q_biology_genetics]
        return list(BIOLOGY_GENERATOR_REGISTRY)

    elif "türkçe" in subj or "edebiyat" in subj:
        if "yazım" in top:
            return [q_turkish_spelling, q_turkish_punctuation, q_turkish_reading]
        if "noktalama" in top:
            return [q_turkish_punctuation, q_turkish_spelling, q_turkish_reading]
        if "ses" in top:
            return [q_turkish_sound_events, q_turkish_spelling]
        if "divan" in top:
            return [q_literature_divan, q_turkish_reading]
        return list(TURKISH_GENERATOR_REGISTRY)

    elif "tarih" in subj:
        return [q_history_early_turks, q_history_ottoman, q_history_republic, q_history_seljuk, q_history_inkilap, q_history_ww1]

    elif "coğrafya" in subj:
        return [q_geography_climate, q_geography_coordinates, q_geography_population]

    elif "felsefe" in subj or "din" in subj:
        return [q_philosophy, q_religion]

    elif "sosyal" in subj:
        return list(SOCIAL_GENERATOR_REGISTRY)

    elif "matematik" in subj:
        if "türev" in top: return [q_derivative_tangent, q_function, q_parabola_max]
        if "integral" in top: return [q_integral_area, q_parabola_max, q_derivative_tangent]
        if "parabol" in top: return [q_parabola_max, q_function, q_polynomial]
        if "fonksiyon" in top: return [q_function, q_cargo_tariff, q_parabola_max]
        if "yaş" in top: return [q_age_problem, q_percentage_profit, q_speed_motion]
        if "yüzde" in top or "kâr" in top: return [q_percentage_profit, q_cargo_tariff, q_speed_motion]
        if "hız" in top: return [q_speed_motion, q_cargo_tariff, q_age_problem]
        if "kombinasyon" in top or "olasılık" in top: return [q_combinations, q_probability_dice]
        if "logaritma" in top: return [q_logarithm, q_function]
        if "trigonometri" in top: return [q_trigonometry, q_function]
        if "polinom" in top: return [q_polynomial, q_function]
        if "limit" in top: return [q_limit, q_function]
        if "ebob" in top: return [q_ebob_ekok, q_cargo_tariff]
        return list(MATH_GENERATOR_REGISTRY)

    return list(MATH_GENERATOR_REGISTRY)

# ================= GEMINI AI YAPAY ZEKA SORU ÜRETİCİSİ =================

import time
import uuid

async def generate_questions_with_gemini(
    exam_type: str,
    subject: str,
    topic: str,
    difficulty: str,
    question_count: int,
    include_diagrams: bool = True,
    custom_prompt: Optional[str] = None,
    api_key: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Google Gemini Pro / Flash API ile o anda dinamik olarak %100 özgün, 
    birbirinden bağımsız yeni nesil YKS soruları üretir.
    """
    key = api_key or os.getenv("GEMINI_API_KEY")
    if not key:
        print("[AI Exam Service] GEMINI_API_KEY bulunamadı. Prosedürel motora yönlendiriliyor.")
        return []

    unique_session_seed = f"{time.time()}_{uuid.uuid4().hex[:8]}"

    system_instruction = f"""Sen Türkiye'nin en seçkin ÖSYM ve MEB YKS ({exam_type}) soru hazırlama komisyonu başkanısın.
Ders: {subject}
Konu: {topic}
Zorluk: {difficulty}
İstenen Soru Sayısı: {question_count}
Benzersiz Oturum Kodu: {unique_session_seed}

KATI VE DEĞİŞMEZ KURALLAR:
1. Üreteceğin {question_count} sorunun TAMAMI birbirinden ve piyasadaki tüm klasik sorulardan KESİNLİKLE FARKLI VE ÖZGÜN OLMALIDIR.
2. AYNI TESTTE ASLA BENZER KALIP VEYA AYNI SORU KULLANILAMAZ. Her soru farklı bir senaryo, farklı bir kurgu veya farklı bir alt kazanımı test etmelidir.
3. Sorular güncel ÖSYM yeni nesil formatında olmalıdır: Gerçek hayat problemi, akıl yürütme, mantık, tablo/grafik analizi veya adım adım düşünme gerektirmelidir.
4. MATEMATİK VE GEOMETRİ İFADELERİ (KUSURSUZ KATEX STANDARD):
   - Kare, küp, üslü ifadeler ve derece işaretleri her zaman standart LaTeX ($ ... $) içinde yazılmalıdır.
   - Soru metninde, açıklamalarda ve TÜM ŞIKLARDA (A, B, C, D, E) matematiksel ifadeleri MUTLAKA $ ... $ içine al.
   - Derece için HER ZAMAN: $30\\circ$, $45\\circ$, $90\\circ$, $108\\circ$ kullan (asla ham 30^0 veya işaretsiz 30 derece yazma).
   - Kare için: $x^2$, $\\text{cm}^2$, $\\text{m}^2$ kullan.
   - Küp için: $x^3$, $\\text{cm}^3$, $\\text{m}^3$ kullan.
   - Pi sayısı için: $2\\\\pi$, $36\\\\pi$ vb. her zaman $ içine al.
   - Köklü sayılar ve kesirler için: $\\sqrt{3}$, $\\frac{a}{b}$ vb. her zaman $ içine al.
   - Şıklarda tek bir formül veya sayı olsa bile (örn. $108\\circ$ veya $36\\\\pi$ veya $x^2 + 1$) MUTLAKA $ sembolü ile sar.
5. Türkçe karakterleri hatasız, temiz UTF-8 olarak doğrudan yaz (ç, ğ, ı, İ, ö, ş, ü).
6. Her soru için 5 seçenek (A, B, C, D, E), doğru cevap harfi ve öğrencinin hatasını anlamasını sağlayacak detaylı bir çözüm adımı (explanation) ekle.
7. Çıktı SADECE ve SADECE geçerli bir JSON dizisi olmalıdır. Markdown süslemesi dışında hiçbir metin yazma.

Örnek JSON Şeması:
[
  {{
    "question_number": 1,
    "question_text": "Özgün soru metni...",
    "option_a": "A seçeneği",
    "option_b": "B seçeneği",
    "option_c": "C seçeneği",
    "option_d": "D seçeneği",
    "option_e": "E seçeneği",
    "correct_answer": "C",
    "explanation": "Detaylı çözüm adımları...",
    "topic": "{topic}",
    "subtopic": "Kazanım alt başlığı",
    "visual_svg": null
  }}
]"""

    user_msg = (
        f"{exam_type} - {subject} dersi, '{topic}' konusu için {difficulty} zorluk seviyesinde {question_count} adet "
        f"tamamen birbirinden farklı, özgün yeni nesil soru üret. "
        f"Tüm sorular o anda sıfırdan kurgulanmış olsun."
    )
    if custom_prompt:
        user_msg += f" Öğretmenin özel notu: {custom_prompt}"

    # Öncelikli olarak Gemini 1.5 Pro, ardından Gemini 2.0 Flash ve Gemini 1.5 Flash modelleri denenir
    candidate_models = [
        "gemini-3.8-flash",
        "gemini-3.5-flash",
        "gemini-3-flash-preview",
        "gemini-3.5-flash-lite",
        "gemini-flash-latest",
        "gemini-pro-latest"
    ]

    payload = {
        "contents": [{"parts": [{"text": f"{system_instruction}\n\nTalep: {user_msg}"}]}],
        "generationConfig": {
            "temperature": 0.88,
            "topP": 0.95,
            "responseMimeType": "application/json"
        }
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        for model_name in candidate_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={key}"
            try:
                print(f"[AI Exam Service] Gemini API çağrılıyor... Model: {model_name}, Soru Sayısı: {question_count}")
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    candidates = data.get("candidates", [])
                    if candidates and "content" in candidates[0] and "parts" in candidates[0]["content"]:
                        raw_text = candidates[0]["content"]["parts"][0]["text"].strip()
                        # Markdown ```json temizliği
                        if raw_text.startswith("```"):
                            raw_text = re.sub(r"^```(?:json)?", "", raw_text)
                            raw_text = re.sub(r"```$", "", raw_text).strip()
                        parsed = json.loads(raw_text)
                        if isinstance(parsed, dict) and "questions" in parsed:
                            parsed = parsed["questions"]
                        if isinstance(parsed, list) and len(parsed) > 0:
                            for q in parsed:
                                q["question_text"] = sanitize_math_and_turkish(q.get("question_text", ""))
                                q["explanation"] = sanitize_math_and_turkish(q.get("explanation", ""))
                            print(f"[AI Exam Service] {model_name} ile {len(parsed)} adet özgün soru başarıyla üretildi.")
                            return parsed
                else:
                    print(f"[AI Exam Service] {model_name} yanıt kodu: {res.status_code}, bir sonraki model deneniyor...")
            except Exception as e:
                print(f"[AI Exam Service] {model_name} çağrısında hata: {e}")

    return []

    system_instruction = f"""Sen Türkiye'nin en seçkin ÖSYM ve MEB YKS ({exam_type}) soru hazırlama komisyonu başkanısın.
Ders: {subject}
Konu: {topic}
Zorluk: {difficulty}
İstenen Soru Sayısı: {question_count}

ÖNEMLİ KURALLAR:
1. Üreteceğin {question_count} sorunun TAMAMI birbirinden kesinlikle farklı olmalıdır. Aynı soru veya benzer şablon asla tekrarlanmamalıdır!
2. Her soru güncel MEB kazanımlarına ve ÖSYM'nin yeni nesil tarzına uygun olmalıdır.
3. Matematik ve fen formülleri için KaTeX uyumlu standart LaTeX kullan ($ ve $$).
4. Türkçe karakter problemi yaşanmaması için UTF-8 Türkçe metinleri doğrudan yaz (ç, ğ, ı, İ, ö, ş, ü).
5. Her soru için 5 şık (A, B, C, D, E) ve doğru cevap ('A', 'B', 'C', 'D' veya 'E') belirtilmelidir.
6. Çıktı SADECE geçerli bir JSON dizisi olmalıdır."""

    user_msg = f"{exam_type} {subject} dersi, {topic} konusu için {difficulty} zorlukta {question_count} adet tamamen birbirinden farklı, yeni nesil soru üret."
    if custom_prompt:
        user_msg += f" Not: {custom_prompt}"

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={key}"
    payload = {
        "contents": [{"parts": [{"text": f"{system_instruction}\n\nTalep: {user_msg}"}]}],
        "generationConfig": {
            "temperature": 0.75,
            "topP": 0.95,
            "responseMimeType": "application/json"
        }
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        res = await client.post(url, json=payload)
        if res.status_code != 200:
            return []
        
        data = res.json()
        raw_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        parsed = json.loads(raw_text)
        if isinstance(parsed, dict) and "questions" in parsed:
            parsed = parsed["questions"]
        if isinstance(parsed, list):
            for q in parsed:
                q["question_text"] = sanitize_math_and_turkish(q.get("question_text", ""), is_option=False)
                q["explanation"] = sanitize_math_and_turkish(q.get("explanation", ""), is_option=False)
                for opt_k in ["option_a", "option_b", "option_c", "option_d", "option_e"]:
                    if opt_k in q:
                        q[opt_k] = sanitize_math_and_turkish(q[opt_k], is_option=True)
            return parsed
    return []

# ================= KATI BENZERSİZLİK VE DENETİM SİSTEMİ =================

def enforce_strict_uniqueness(
    initial_questions: List[Dict[str, Any]],
    target_count: int,
    exam_type: str,
    subject: str,
    topic: str
) -> List[Dict[str, Any]]:
    unique_questions = []

    for q in initial_questions:
        q_text = q.get("question_text", "").strip()
        if not q_text:
            continue

        is_duplicate = False
        for existing in unique_questions:
            if are_questions_too_similar(q_text, existing.get("question_text", "")):
                is_duplicate = True
                break

        if not is_duplicate:
            unique_questions.append(q)
            if len(unique_questions) >= target_count:
                break

    pool_funcs = get_procedural_candidates_pool(exam_type, subject, topic)
    all_subject_funcs = get_procedural_candidates_pool(exam_type, subject, "Karma")
    combined_pool = list(dict.fromkeys(pool_funcs + all_subject_funcs))
    random.shuffle(combined_pool)

    func_index = 0
    max_attempts = target_count * 25
    attempts = 0

    while len(unique_questions) < target_count and attempts < max_attempts:
        attempts += 1
        gen_func = combined_pool[func_index % len(combined_pool)]
        func_index += 1

        new_q = gen_func()
        q_text = new_q.get("question_text", "").strip()

        is_duplicate = False
        for existing in unique_questions:
            if are_questions_too_similar(q_text, existing.get("question_text", "")):
                is_duplicate = True
                break

        if not is_duplicate:
            unique_questions.append(new_q)

    for idx, q in enumerate(unique_questions, start=1):
        q["question_number"] = idx
        co = q.get("correct_option") or q.get("correct_answer") or "A"
        q["correct_option"] = str(co).upper()
        q["correct_answer"] = q["correct_option"]
        if not q.get("topic") or q["topic"] == "Karma":
            q["topic"] = topic if topic != "Karma" else q.get("topic", subject)

    return unique_questions[:target_count]

async def generate_questions_smart(
    exam_type: str,
    subject: str,
    topic: str,
    difficulty: str,
    question_count: int,
    include_diagrams: bool = True,
    custom_prompt: Optional[str] = None,
    api_key: Optional[str] = None
) -> List[Dict[str, Any]]:
    effective_key = api_key or os.getenv("GEMINI_API_KEY")
    candidates = []

    if effective_key:
        try:
            candidates = await generate_questions_with_gemini(
                exam_type=exam_type,
                subject=subject,
                topic=topic,
                difficulty=difficulty,
                question_count=question_count,
                include_diagrams=include_diagrams,
                custom_prompt=custom_prompt,
                api_key=effective_key
            )
        except Exception as e:
            print(f"[AI Exam Service] Gemini API hatası: {str(e)}. Prosedürel dinamik motora geçiliyor...")

    guaranteed_unique_questions = enforce_strict_uniqueness(
        initial_questions=candidates,
        target_count=question_count,
        exam_type=exam_type,
        subject=subject,
        topic=topic
    )

    return guaranteed_unique_questions
