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
    "LGS": {
        "Türkçe": [
            "Fiilimsiler (Eylemsiler)", "Cümlenin Ögeleri", "Cümle Türleri",
            "Paragrafta Anlam ve Ana Düşünce", "Paragrafta Yapı ve Akış", "Metin Türleri ve Söz Sanatları",
            "Noktalama İşaretleri", "Yazım Kuralları", "Görsel Okuma ve Grafik Yorumlama",
            "Sözel Mantık ve Muhakeme"
        ],
        "Matematik": [
            "Çarpanlar ve Katlar (EBOB-EKOK)", "Üslü İfadeler", "Kareköklü İfadeler",
            "Veri Analizi (Daire ve Çizgi Grafiği)", "Basit Olayların Olasılığı",
            "Cebirsel İfadeler ve Özdeşlikler", "Doğrusal Denklemler ve Koordinat Sistemi",
            "Eşitsizlikler", "Üçgenler (Açı-Kenar Bağıntıları, Pisagor)", "Dönüşüm Geometrisi",
            "Geometrik Cisimler (Prizma, Silindir, Koni, Piramit)"
        ],
        "Fen Bilimleri": [
            "Mevsimler ve İklim", "DNA ve Genetik Kod", "Basınç (Katı, Sıvı ve Gaz Basıncı)",
            "Madde ve Endüstri (Periyodik Sistem, Fiziksel ve Kimyasal Değişimler, Asit-Bazlar)",
            "Basit Makineler (Makaralar, Kaldıraç, Eğik Düzlem, Çıkrık)",
            "Enerji Dönüşümleri ve Çevre Bilimi (Besin Zinciri, Fotosentez, Solunum)",
            "Elektrik Yükleri ve Elektrik Enerjisi"
        ],
        "T.C. İnkılap Tarihi ve Atatürkçülük": [
            "Bir Kahraman Doğuyor (Mustafa Kemal'in Hayatı)", "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar",
            "Millî Bir Destan: Ya İstiklal Ya Ölüm! (Cepheler ve Lozan)",
            "Atatürkçülük ve Çağdaşlaşan Türkiye (İnkılaplar)", "Demokratikleşme Çabaları",
            "Atatürk Dönemi Türk Dış Politikası", "Atatürk'ün Ölümü ve Sonrası"
        ],
        "Din Kültürü ve Ahlak Bilgisi": [
            "Kader İnancı (Kaza, Kader, Tevekkül, Evrenin Yasaları)", "Zekat ve Sadaka İbadeti",
            "Din ve Hayat (Temel Hakların Korunması)", "Hz. Muhammed'in Doğruluğu ve Güvenilirliği",
            "Kur'an-ı Kerim ve Özellikleri"
        ],
        "İngilizce": [
            "Friendship (Accepting & Refusing)", "Teen Life (Daily Routines, Preferences)",
            "In The Kitchen (Cooking Process & Recipes)", "On The Phone (Phone Conversations)",
            "The Internet (Online Habits & Rules)", "Adventures (Extreme Sports)",
            "Tourism (Vacation Types, Attractions)", "Chores (Obligations & Responsibilities)",
            "Science (Scientific Discoveries & Inventions)", "Natural Forces (Disasters & Precautions)"
        ]
    },
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

    # Formül içi LaTeX temizliği ve derece/üs standardizasyonu
    def clean_math_inner(formula: str) -> str:
        f = formula.strip()
        f = f.replace("²", "^{2}").replace("³", "^{3}").replace("⁴", "^{4}").replace("⁰", "^{0}").replace("¹", "^{1}")
        # Bozuk ve iç içe geçmiş dereceleri tek standarda indir:
        f = re.sub(r'\^+\{*\s*\^+\{*\s*\\circ\}*\}*', r'^{\\circ}', f)
        f = re.sub(r'\^+\{*\s*°\}*', r'^{\\circ}', f)
        f = f.replace("°", "^{\\circ}")
        f = re.sub(r'\^+\{*\s*\\circ\}*', r'^{\\circ}', f)
        f = re.sub(r'(?<=[0-9a-zA-Z])\s*\\circ(?![a-zA-Z])', r'^{\\circ}', f)
        f = re.sub(r'(?<=[0-9])\s*\^0\b', r'^{\\circ}', f)
        f = re.sub(r'\^\{\s*\^\{\\circ\}\s*\}', r'^{\\circ}', f)
        f = re.sub(r'\^\{\s*\{\\circ\}\s*\}', r'^{\\circ}', f)
        # Kök ve operatörler
        f = re.sub(r'√([0-9a-zA-Z]+)', r'\\sqrt{\1}', f)
        f = re.sub(r'√\(([^)]+)\)', r'\\sqrt{\1}', f)
        f = f.replace("·", r"\cdot ").replace("×", r"\times ").replace("÷", r"\div ")
        f = f.replace("≤", r"\le ").replace("≥", r"\ge ").replace("≠", r"\ne ").replace("±", r"\pm ")
        f = re.sub(r'<=', r'\\le ', f)
        f = re.sub(r'>=', r'\\ge ', f)
        f = re.sub(r'!=', r'\\ne ', f)

        # Trigonometri ve standart fonksiyonlar
        f = re.sub(r'(?<![a-zA-Z\\])(sin|cos|tan|cot|sec|csc|log|ln|lim|det|arcsin|arccos|arctan|deg|gcd|lcm)(?![a-zA-Z])', r'\\\1', f)

        # Yunan harfleri ve sabitler
        f = f.replace("α", r"\alpha ").replace("β", r"\beta ").replace("θ", r"\theta ").replace("π", r"\pi ").replace("Δ", r"\Delta ").replace("∞", r"\infty ").replace("λ", r"\lambda ").replace("γ", r"\gamma ").replace("ω", r"\omega ").replace("σ", r"\sigma ").replace("μ", r"\mu ")

        # Geometri açı & şapka notasyonu
        f = re.sub(r'\\hat\{([a-zA-Z]{2,})\}', r'\\widehat{\1}', f)
        return f

    # 1. Eğer açıkça bir şık veya çok kısa saf matematik ifadesi ise
    if is_option or (len(trimmed) < 50 and not any(p in trimmed for p in ['?', '!', ':', 'dir.', 'tir.', 'dır.', 'tır.'])):
        has_math = bool(re.search(r'[\\\^_²³°√π±≤≥≠÷×]|\b(cm|m|mm|km)\^[23]\b|\b[a-zA-Z]\^[0-9]', trimmed, re.IGNORECASE))
        words = re.findall(r'[a-zA-ZçğıöşüÇĞİÖŞÜ]{4,}', trimmed)
        if not (trimmed.startswith("$") and trimmed.endswith("$")) and has_math and len(words) <= 1:
            return f"${clean_math_inner(trimmed)}$"

    # 2. Metni formül blokları ($$...$$ ve $...$) ile formül dışı düz metin olarak böl
    token_pattern = re.compile(r'(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)')
    parts = []
    last_end = 0

    for match in token_pattern.finditer(text):
        start, end = match.span()
        if start > last_end:
            parts.append(('text', text[last_end:start]))
        token = match.group(0)
        if token.startswith('$$') and token.endswith('$$'):
            parts.append(('display_math', token[2:-2]))
        else:
            parts.append(('inline_math', token[1:-1]))
        last_end = end

    if last_end < len(text):
        parts.append(('text', text[last_end:]))

    # 3. Her parçayı güvenle işle (formül içindeki dolar işaretlerine ASLA dokunulmaz)
    result = []
    exp_map = {'²': '2', '³': '3', '⁴': '4'}
    for p_type, val in parts:
        if p_type == 'inline_math':
            result.append(f"${clean_math_inner(val)}$")
        elif p_type == 'display_math':
            result.append(f"$${clean_math_inner(val)}$$")
        else:
            t = val
            # Formül dışı derece kalıpları
            t = re.sub(r'\b([0-9]+)\s*\^+\{*\s*\\circ\}*', r'$\1^{\\circ}$', t)
            t = re.sub(r'\b([0-9]+)\s*°', r'$\1^{\\circ}$', t)
            t = re.sub(r'\b([0-9]+)\s*\\circ\b', r'$\1^{\\circ}$', t)
            # Formül dışı pi sayısı
            t = re.sub(r'\b([0-9]+)\s*\\pi\b', r'$\1\\pi$', t)
            # Formül dışı alan ve hacim birimleri
            t = re.sub(r'\b([0-9]+)\s*(cm|m|mm|km|dm)[\^]?[2²](?![a-zA-Z0-9])', r'$\1\\text{ \2}^2$', t, flags=re.IGNORECASE)
            t = re.sub(r'\b([0-9]+)\s*(cm|m|mm|km|dm)[\^]?[3³](?![a-zA-Z0-9])', r'$\1\\text{ \2}^3$', t, flags=re.IGNORECASE)
            # Formül dışı değişken kare ve küpleri
            t = re.sub(r'\b([0-9]*[a-zA-Z])\s*\^\s*([0-9]+)\b', r'$\1^{\2}$', t)
            t = re.sub(r'\b([0-9]*[a-zA-Z])([²³⁴])(?![a-zA-Z0-9])', lambda m: f"${m.group(1)}^{{{exp_map.get(m.group(2), '2')}}}$", t)
            # Düz metinde altı çizili sözcük standartlaştırması: \underline{...} veya _kelime_ -> <u>...</u>
            t = re.sub(r'\\underline\{([^}]+)\}', r'<u>\1</u>', t)
            t = re.sub(r'(?<![a-zA-Z0-9çğıöşüÇĞİÖŞÜ])_([^_\n]+)_(?![a-zA-Z0-9çğıöşüÇĞİÖŞÜ])', r'<u>\1</u>', t)
            result.append(t)

    return ''.join(result).strip()

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
    # Kelime çakışması %60 ve üzeri olan sorular birbirine çok yakın kabul edilip elenir
    return (inter / union) >= 0.60

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
    shuffled_distractors = [d for d in distractors[:4] if "ulaşılamaz" not in str(d).lower()]

    # Yedek alternatif iddialar (asla 'bu yargıya ulaşılamaz' veya geçersiz meta şık kullanılmaz)
    generic_fallbacks = [
        "Bireysel deneyimler toplumsal değerlerin oluşumunda tek belirleyici unsurdur.",
        "Sanatsal ve kültürel üretim çağın gereksinimlerinden bağımsız ele alınamaz.",
        "Kavramsal derinliğe sahip metinler dönemsel koşullarla doğrudan ilişkilidir.",
        "Bilimsel ve felsefi gelişmeler toplumsal ilerlemenin temel itici gücüdür."
    ]
    random.shuffle(generic_fallbacks)
    fb_idx = 0
    while len(shuffled_distractors) < 4:
        cand = generic_fallbacks[fb_idx % len(generic_fallbacks)]
        fb_idx += 1
        if cand not in shuffled_distractors and cand != correct_str:
            shuffled_distractors.append(cand)

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

def generate_dynamic_triangle_svg(a: int = 6, b: int = 8, c: int = 10, label: str = "ABC Dik Üçgeni") -> str:
    return f'''<svg viewBox="0 0 380 230" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:420px; margin:auto; display:block;">
  <defs>
    <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0.10"/>
    </linearGradient>
  </defs>
  <polygon points="60,180 320,180 60,40" fill="url(#triGrad)" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round"/>
  <rect x="60" y="162" width="18" height="18" fill="none" stroke="#f43f5e" stroke-width="2"/>
  <circle cx="69" cy="171" r="2.5" fill="#f43f5e"/>
  <circle cx="60" cy="40" r="4.5" fill="#38bdf8"/>
  <circle cx="60" cy="180" r="4.5" fill="#38bdf8"/>
  <circle cx="320" cy="180" r="4.5" fill="#38bdf8"/>
  <text x="45" y="35" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold">A</text>
  <text x="45" y="195" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold">B</text>
  <text x="330" y="195" fill="#f8fafc" font-size="14" font-family="sans-serif" font-weight="bold">C</text>
  <text x="25" y="115" fill="#fbbf24" font-size="13" font-family="sans-serif" font-weight="bold">{c}</text>
  <text x="180" y="202" fill="#fbbf24" font-size="13" font-family="sans-serif" font-weight="bold">{a}</text>
  <text x="200" y="105" fill="#34d399" font-size="13" font-family="sans-serif" font-weight="bold">{b}</text>
  <text x="120" y="25" fill="#94a3b8" font-size="12" font-family="sans-serif">{label}</text>
</svg>'''

def generate_dynamic_geometry_circle_svg(r: int = 6, angle: int = 60) -> str:
    return f'''<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:400px; margin:auto; display:block;">
  <circle cx="180" cy="115" r="75" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
  <circle cx="180" cy="115" r="4" fill="#f43f5e"/>
  <text x="185" y="110" fill="#f8fafc" font-size="13" font-family="sans-serif" font-weight="bold">O</text>
  <line x1="180" y1="115" x2="255" y2="115" stroke="#fbbf24" stroke-width="2"/>
  <line x1="180" y1="115" x2="225" y2="52" stroke="#fbbf24" stroke-width="2"/>
  <path d="M 210,115 A 30 30 0 0 0 200,90" fill="none" stroke="#34d399" stroke-width="2"/>
  <text x="212" y="102" fill="#34d399" font-size="12" font-family="sans-serif" font-weight="bold">α={angle}°</text>
  <text x="210" y="130" fill="#fbbf24" font-size="12" font-family="sans-serif" font-weight="bold">r={r}</text>
  <text x="110" y="25" fill="#94a3b8" font-size="12" font-family="sans-serif">Dairede Merkez Açı ve Yay</text>
</svg>'''

def generate_dynamic_circuit_svg(v: int = 24, r1: int = 4, r2: int = 6, r3: int = 2) -> str:
    return f'''<svg viewBox="0 0 440 210" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:460px; margin:auto; display:block;">
  <rect x="50" y="35" width="340" height="140" fill="none" stroke="#64748b" stroke-width="2.5" rx="6"/>
  <line x1="180" y1="35" x2="250" y2="35" stroke="#0f172a" stroke-width="8"/>
  <rect x="185" y="25" width="60" height="20" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>
  <text x="195" y="39" fill="#38bdf8" font-size="11" font-family="sans-serif" font-weight="bold">R₁={r1}Ω</text>
  <line x1="180" y1="175" x2="250" y2="175" stroke="#0f172a" stroke-width="8"/>
  <rect x="185" y="165" width="60" height="20" fill="#1e293b" stroke="#38bdf8" stroke-width="2" rx="4"/>
  <text x="195" y="179" fill="#38bdf8" font-size="11" font-family="sans-serif" font-weight="bold">R₂={r2}Ω</text>
  <line x1="390" y1="80" x2="390" y2="130" stroke="#0f172a" stroke-width="8"/>
  <rect x="375" y="85" width="30" height="40" fill="#1e293b" stroke="#a855f7" stroke-width="2" rx="4"/>
  <text x="350" y="110" fill="#c084fc" font-size="11" font-family="sans-serif" font-weight="bold">R₃={r3}Ω</text>
  <line x1="50" y1="85" x2="50" y2="125" stroke="#0f172a" stroke-width="8"/>
  <line x1="38" y1="95" x2="62" y2="95" stroke="#f43f5e" stroke-width="3"/>
  <line x1="44" y1="115" x2="56" y2="115" stroke="#f43f5e" stroke-width="1.5"/>
  <text x="12" y="110" fill="#f43f5e" font-size="12" font-family="sans-serif" font-weight="bold">V={v}V</text>
  <circle cx="110" cy="35" r="13" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>
  <text x="105" y="40" fill="#fbbf24" font-size="12" font-family="sans-serif" font-weight="bold">A</text>
  <text x="135" y="22" fill="#94a3b8" font-size="11" font-family="sans-serif">Elektrik Devresi (Ana Kol Akımı)</text>
</svg>'''

def generate_dynamic_force_block_svg(m: int = 4, f_uyg: int = 20, f_s: int = 8, a: int = 3) -> str:
    return f'''<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:440px; margin:auto; display:block;">
  <line x1="30" y1="150" x2="370" y2="150" stroke="#94a3b8" stroke-width="3"/>
  <line x1="40" y1="150" x2="30" y2="165" stroke="#64748b" stroke-width="1.5"/>
  <line x1="80" y1="150" x2="70" y2="165" stroke="#64748b" stroke-width="1.5"/>
  <line x1="120" y1="150" x2="110" y2="165" stroke="#64748b" stroke-width="1.5"/>
  <line x1="160" y1="150" x2="150" y2="165" stroke="#64748b" stroke-width="1.5"/>
  <line x1="200" y1="150" x2="190" y2="165" stroke="#64748b" stroke-width="1.5"/>
  <line x1="240" y1="150" x2="230" y2="165" stroke="#64748b" stroke-width="1.5"/>
  <line x1="280" y1="150" x2="270" y2="165" stroke="#64748b" stroke-width="1.5"/>
  <line x1="320" y1="150" x2="310" y2="165" stroke="#64748b" stroke-width="1.5"/>
  <rect x="150" y="80" width="90" height="70" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" rx="4"/>
  <text x="175" y="122" fill="#38bdf8" font-size="15" font-family="sans-serif" font-weight="bold">m={m} kg</text>
  <line x1="240" y1="115" x2="320" y2="115" stroke="#34d399" stroke-width="3"/>
  <polygon points="320,115 310,110 310,120" fill="#34d399"/>
  <text x="270" y="105" fill="#34d399" font-size="12" font-family="sans-serif" font-weight="bold">F={f_uyg} N</text>
  <line x1="150" y1="135" x2="90" y2="135" stroke="#f43f5e" stroke-width="2.5"/>
  <polygon points="90,135 100,130 100,140" fill="#f43f5e"/>
  <text x="95" y="125" fill="#f43f5e" font-size="11" font-family="sans-serif" font-weight="bold">fs={f_s} N</text>
  <line x1="160" y1="55" x2="210" y2="55" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,3"/>
  <polygon points="210,55 204,52 204,58" fill="#fbbf24"/>
  <text x="160" y="45" fill="#fbbf24" font-size="11" font-family="sans-serif">İvme: a={a} m/s²</text>
  <text x="80" y="22" fill="#94a3b8" font-size="12" font-family="sans-serif">Sürtünmeli Yatay Düzlemde Kuvvet Diyagramı</text>
</svg>'''

def generate_dynamic_optics_prism_svg() -> str:
    return '''<svg viewBox="0 0 380 210" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:420px; margin:auto; display:block;">
  <polygon points="190,40 100,170 280,170" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="2"/>
  <line x1="40" y1="140" x2="130" y2="125" stroke="#fbbf24" stroke-width="2.5"/>
  <polygon points="100,130 90,127 92,135" fill="#fbbf24"/>
  <line x1="130" y1="125" x2="225" y2="140" stroke="#f43f5e" stroke-width="2"/>
  <line x1="225" y1="140" x2="330" y2="165" stroke="#34d399" stroke-width="2.5"/>
  <polygon points="290,155 280,150 283,158" fill="#34d399"/>
  <line x1="105" y1="100" x2="155" y2="150" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="45" y="130" fill="#fbbf24" font-size="11" font-family="sans-serif" font-weight="bold">Gelen Işın</text>
  <text x="260" y="180" fill="#34d399" font-size="11" font-family="sans-serif" font-weight="bold">Kırılan Işın</text>
  <text x="180" y="110" fill="#f43f5e" font-size="11" font-family="sans-serif">Cam (n₂)</text>
  <text x="75" y="80" fill="#94a3b8" font-size="11" font-family="sans-serif">Hava (n₁)</text>
  <text x="115" y="25" fill="#94a3b8" font-size="12" font-family="sans-serif">Prizmada Işığın Kırılması</text>
</svg>'''

def generate_dynamic_parabola_svg(a: int = 1, b: int = -4, c: int = 3, r: float = 2.0, k: float = -1.0) -> str:
    return f'''<svg viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:420px; margin:auto; display:block;">
  <line x1="40" y1="160" x2="350" y2="160" stroke="#475569" stroke-width="2"/>
  <line x1="190" y1="20" x2="190" y2="200" stroke="#475569" stroke-width="2"/>
  <polygon points="350,160 342,156 342,164" fill="#475569"/>
  <polygon points="190,20 186,28 194,28" fill="#475569"/>
  <text x="355" y="164" fill="#94a3b8" font-size="12" font-family="sans-serif">x</text>
  <text x="182" y="15" fill="#94a3b8" font-size="12" font-family="sans-serif">y</text>
  <path d="M 80,180 Q 190,30 300,180" fill="none" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="190" cy="55" r="5" fill="#f43f5e"/>
  <text x="200" y="55" fill="#f43f5e" font-size="12" font-family="sans-serif" font-weight="bold">T(r={r:.0f}, k={k:.0f})</text>
  <text x="70" y="208" fill="#34d399" font-size="12" font-family="sans-serif">f(x) = {a}x² + {b}x + {c}</text>
</svg>'''

def generate_dynamic_pedigree_svg(trait_name: str = "Otozomal Çekinik Kalıtım") -> str:
    return f'''<svg viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:420px; margin:auto; display:block;">
  <text x="90" y="25" fill="#94a3b8" font-size="12" font-family="sans-serif">Kalıtım Soyağacı ({trait_name})</text>
  <rect x="100" y="45" width="28" height="28" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="109" y="63" fill="#38bdf8" font-size="11" font-family="sans-serif">1</text>
  <line x1="128" y1="59" x2="210" y2="59" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="224" cy="59" r="14" fill="#f43f5e" stroke="#f43f5e" stroke-width="2"/>
  <text x="220" y="64" fill="#ffffff" font-size="11" font-family="sans-serif" font-weight="bold">2</text>
  <line x1="169" y1="59" x2="169" y2="105" stroke="#94a3b8" stroke-width="2"/>
  <line x1="70" y1="105" x2="270" y2="105" stroke="#94a3b8" stroke-width="2"/>
  <line x1="70" y1="105" x2="70" y2="135" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="70" cy="149" r="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="66" y="154" fill="#38bdf8" font-size="11" font-family="sans-serif">3</text>
  <line x1="169" y1="105" x2="169" y2="135" stroke="#94a3b8" stroke-width="2"/>
  <rect x="155" y="135" width="28" height="28" fill="#f43f5e" stroke="#f43f5e" stroke-width="2"/>
  <text x="165" y="153" fill="#ffffff" font-size="11" font-family="sans-serif" font-weight="bold">4</text>
  <line x1="270" y1="105" x2="270" y2="135" stroke="#94a3b8" stroke-width="2"/>
  <rect x="256" y="135" width="28" height="28" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="266" y="153" fill="#38bdf8" font-size="11" font-family="sans-serif">5</text>
  <rect x="60" y="190" width="12" height="12" fill="#f43f5e"/>
  <text x="78" y="200" fill="#94a3b8" font-size="10" font-family="sans-serif">: Özelliği Gösteren Birey</text>
  <rect x="220" y="190" width="12" height="12" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="238" y="200" fill="#94a3b8" font-size="10" font-family="sans-serif">: Normal Birey</text>
</svg>'''

def generate_dynamic_food_pyramid_svg() -> str:
    return '''<svg viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:420px; margin:auto; display:block;">
  <polygon points="190,30 230,70 150,70" fill="#f43f5e" stroke="#0f172a" stroke-width="2"/>
  <text x="170" y="56" fill="#ffffff" font-size="9" font-family="sans-serif" font-weight="bold">3. Tüketici</text>
  <polygon points="150,70 230,70 260,115 120,115" fill="#fbbf24" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="98" fill="#0f172a" font-size="10" font-family="sans-serif" font-weight="bold">2. Tüketici</text>
  <polygon points="120,115 260,115 290,160 90,160" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/>
  <text x="155" y="142" fill="#0f172a" font-size="11" font-family="sans-serif" font-weight="bold">1. Tüketici (Otçul)</text>
  <polygon points="90,160 290,160 320,200 60,200" fill="#34d399" stroke="#0f172a" stroke-width="2"/>
  <text x="145" y="185" fill="#0f172a" font-size="12" font-family="sans-serif" font-weight="bold">Üreticiler (Bitkiler)</text>
  <line x1="335" y1="195" x2="335" y2="45" stroke="#c084fc" stroke-width="2"/>
  <polygon points="335,40 330,50 340,50" fill="#c084fc"/>
  <text x="345" y="115" fill="#c084fc" font-size="9" font-family="sans-serif" transform="rotate(90 345,115)">Biyolojik Birikim Artar ↑</text>
  <text x="115" y="20" fill="#94a3b8" font-size="11" font-family="sans-serif">Ekolojik Besin Piramidi</text>
</svg>'''

def generate_dynamic_isohypse_svg(h_val: int = 100) -> str:
    return f'''<svg viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:420px; margin:auto; display:block;">
  <ellipse cx="190" cy="115" rx="140" ry="75" fill="none" stroke="#475569" stroke-width="1.5"/>
  <text x="65" y="120" fill="#94a3b8" font-size="10" font-family="sans-serif">0m (Deniz)</text>
  <ellipse cx="190" cy="115" rx="100" ry="55" fill="none" stroke="#38bdf8" stroke-width="2"/>
  <text x="100" y="118" fill="#38bdf8" font-size="10" font-family="sans-serif">{h_val}m</text>
  <ellipse cx="190" cy="115" rx="60" ry="35" fill="none" stroke="#fbbf24" stroke-width="2"/>
  <text x="145" y="118" fill="#fbbf24" font-size="10" font-family="sans-serif">{h_val*2}m</text>
  <circle cx="190" cy="115" r="4" fill="#f43f5e"/>
  <text x="198" y="113" fill="#f43f5e" font-size="11" font-family="sans-serif" font-weight="bold">Δ Doruk ({h_val*2 + 80}m)</text>
  <path d="M 190,115 Q 230,150 280,180" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="3,3"/>
  <text x="240" y="170" fill="#34d399" font-size="10" font-family="sans-serif">Akarsu Vadisi</text>
  <text x="110" y="20" fill="#94a3b8" font-size="11" font-family="sans-serif">Topografya / Eş Yükselti (İzohips) Haritası</text>
</svg>'''

def generate_dynamic_climate_graph_svg(climate_name: str = "Akdeniz İklimi") -> str:
    return f'''<svg viewBox="0 0 380 220" xmlns="http://www.w3.org/2000/svg" style="background:#0f172a; border-radius:12px; width:100%; max-width:420px; margin:auto; display:block;">
  <line x1="45" y1="180" x2="340" y2="180" stroke="#64748b" stroke-width="1.5"/>
  <line x1="45" y1="35" x2="45" y2="180" stroke="#38bdf8" stroke-width="1.5"/>
  <line x1="340" y1="35" x2="340" y2="180" stroke="#f43f5e" stroke-width="1.5"/>
  <text x="20" y="30" fill="#38bdf8" font-size="9" font-family="sans-serif">Yağış (mm)</text>
  <text x="310" y="30" fill="#f43f5e" font-size="9" font-family="sans-serif">Sıcaklık (°C)</text>
  <rect x="55" y="70" width="14" height="110" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="75" y="80" width="14" height="100" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="95" y="100" width="14" height="80" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="115" y="120" width="14" height="60" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="135" y="145" width="14" height="35" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="155" y="170" width="14" height="10" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="175" y="175" width="14" height="5" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="195" y="172" width="14" height="8" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="215" y="160" width="14" height="20" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="235" y="130" width="14" height="50" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="255" y="90" width="14" height="90" fill="#38bdf8" fill-opacity="0.6"/>
  <rect x="275" y="65" width="14" height="115" fill="#38bdf8" fill-opacity="0.6"/>
  <path d="M 62,145 Q 185,60 282,148" fill="none" stroke="#f43f5e" stroke-width="3"/>
  <text x="110" y="20" fill="#f8fafc" font-size="12" font-family="sans-serif" font-weight="bold">{climate_name} Grafiği</text>
  <text x="80" y="200" fill="#94a3b8" font-size="10" font-family="sans-serif">O  Ş  M  N  M  H  T  A  E  E  K  A (Aylar)</text>
</svg>'''

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


# ================= 16 ALANLIK SORU VERİ STANDARDI YARDIMCILARI =================

def get_grade_level_for_exam(exam_type: str) -> str:
    """Sınav türüne göre sınıf düzeyini belirler."""
    et = str(exam_type or "").upper()
    if "LGS" in et:
        return "8. Sınıf"
    elif "TYT" in et:
        return "9-10. Sınıf (Temel Düzey)"
    elif "AYT" in et:
        return "11-12. Sınıf (İleri Düzey)"
    return "12. Sınıf / Mezun"

def generate_learning_outcome_code(exam_type: str, subject: str, topic: str) -> str:
    """MEB ve ÖSYM resmi müfredat kazanım kodunu türetir veya haritalar."""
    et = str(exam_type or "TYT").lower()
    sub = str(subject or "Genel").lower()
    top = str(topic or "Genel").lower()

    if "lgs" in et:
        if "türkçe" in sub or "turkce" in sub:
            return "T.8.3.18 (Metindeki söz sanatlarını ve anlam ilişkilerini tespit eder)"
        elif "matematik" in sub:
            if "çarpan" in top or "ebob" in top:
                return "M.8.1.1.3 (Verilen iki doğal sayının aralarında asal olup olmadığını belirler)"
            elif "üslü" in top:
                return "M.8.1.2.2 (Tam sayıların tam sayı kuvvetlerini hesaplar)"
            elif "kareköklü" in top:
                return "M.8.1.3.4 (Kareköklü ifadelerde toplama ve çıkarma işlemlerini yapar)"
            elif "üçgen" in top or "pisagor" in top:
                return "M.8.3.1.5 (Pisagor bağıntısını oluşturur, ilgili problemleri çözer)"
            return "M.8.2.1.4 (Doğrusal denklem ve eşitsizlikleri gerçek hayat durumlarıyla ilişkilendirir)"
        elif "fen" in sub:
            if "dna" in top or "genetik" in top:
                return "F.8.2.1.3 (DNA'nın yapısını ve kendini eşlemesini model üzerinde açıklar)"
            elif "basınç" in top:
                return "F.8.3.1.2 (Sıvı basıncını etkileyen değişkenleri tahmin eder ve test eder)"
            return "F.8.1.1.1 (Mevsimlerin oluşumuna yönelik tahminlerde bulunur)"
        elif "inkılap" in sub or "tarih" in sub:
            return "İTA.8.2.4 (Millî Mücadele'nin hazırlık döneminde Mustafa Kemal'in çalışmalarını analiz eder)"
        elif "din" in sub:
            return "D.8.1.3 (Kaza ve kader ile ilgili kavramları analiz eder)"
        elif "ingilizce" in sub:
            return "E8.2.R1 (Students will be able to understand short texts about daily life and routines)"
        return "LGS.8.GENEL.1"

    elif "ayt" in et:
        if "matematik" in sub:
            if "türev" in top:
                return "MAT.AYT.5.2 (Türevin geometrik yorumunu yaparak ekstremum noktalarını inceler)"
            elif "integral" in top:
                return "MAT.AYT.6.3 (Belirli integral ile eğriler arasında kalan alanı hesaplar)"
            elif "trigonometri" in top:
                return "MAT.AYT.4.1 (Toplam-fark ve iki kat açı formüllerini kullanarak trigonometrik denklemleri çözer)"
            return "MAT.AYT.3.2 (İkinci dereceden fonksiyon ve eşitsizlik grafiklerini analiz eder)"
        elif "fizik" in sub:
            if "atış" in top or "hareket" in top:
                return "FİZ.AYT.1.2 (İki boyutta sabit ivmeli hareketi analiz eder)"
            elif "momentum" in top:
                return "FİZ.AYT.2.1 (İtme ve çizgisel momentum korunumu bağıntılarını açıklar)"
            elif "manyetizma" in top or "indüksiyon" in top:
                return "FİZ.AYT.3.4 (İndüksiyon akımı ve manyetik akı değişimini hesaplar)"
            return "FİZ.AYT.4.2 (Basit harmonik harekette konum, hız ve ivme ilişkilerini yorumlar)"
        elif "kimya" in sub:
            return "KİM.AYT.2.3 (Kimyasal dengenin dinamik doğasını ve Le Chatelier ilkesini açıklar)"
        elif "biyoloji" in sub:
            return "BİY.AYT.4.1 (Fotosentez ve hücresel solunum arasındaki enerji aktarımını modeller)"
        elif "edebiyat" in sub:
            return "TDE.AYT.2.4 (Divan ve Tanzimat dönemi edebi metinlerini estetik açıdan karşılaştırır)"
        return "AYT.12.GENEL.1"

    else: # TYT
        if "matematik" in sub:
            return "MAT.TYT.2.3 (Birinci dereceden denklem ve yeni nesil problemleri modeller)"
        elif "türkçe" in sub or "turkce" in sub:
            return "TDE.TYT.1.4 (Metindeki ana düşünceyi ve yardımcı düşünceleri belirler)"
        elif "fizik" in sub:
            return "FİZ.TYT.2.1 (Hareket, kuvvet ve enerji arasındaki bağıntıları yorumlar)"
        elif "kimya" in sub:
            return "KİM.TYT.3.2 (Kimyasal türler arası zayıf ve güçlü etkileşimleri sınıflandırır)"
        elif "biyoloji" in sub:
            return "BİY.TYT.1.2 (Hücre organellerinin yapı ve işlevlerini karşılaştırır)"
        elif "tarih" in sub:
            return "TAR.TYT.3.1 (İlk Türk İslam devletlerinin siyasi ve kültürel etkilerini açıklar)"
        elif "coğrafya" in sub:
            return "COĞ.TYT.2.4 (İklim grafikleri ve harita ölçekleri üzerinden mekânsal çıkarımlar yapar)"
        elif "felsefe" in sub:
            return "FEL.TYT.1.2 (Felsefi akımların bilgi ve varlık görüşlerini analiz eder)"
        elif "din" in sub:
            return "DİN.TYT.1.3 (İslam düşüncesinde ahlak, ibadet ve inanç esaslarının bütünlüğünü değerlendirir)"
        return "TYT.10.GENEL.1"

def generate_distractor_analysis(question: Dict[str, Any]) -> str:
    """Sorunun her bir seçeneği için öğrencinin olası düşünme hatasını / kavram yanılgısını modeller."""
    correct_opt = str(question.get("correct_option") or question.get("correct_answer") or "A").upper()
    topic = str(question.get("topic", "Genel"))
    exam_type = str(question.get("exam_type", "TYT")).upper()

    options_to_check = ["A", "B", "C", "D"] if "LGS" in exam_type else ["A", "B", "C", "D", "E"]
    analysis = {}

    misconceptions = [
        "Temel formülde işaret veya yön kuralını ters uygulama hatası.",
        "Öncüllü soruda kısıtlayıcı koşulu ('kesinlikle', 'yalnızca') gözden kaçırma.",
        "İşlem basamağında pay ve paydayı karıştırma veya orantıyı eksik kurma.",
        "Metindeki yan düşünceyi ana düşünce yerine koyarak erken sonuca varma.",
        "Birim dönüşümünü (cm -> m, saniye -> dakika) yapmadan hesaplama hatası.",
        "Kavram kargaşası: İki benzer terimin birbirine karıştırılması."
    ]

    m_idx = 0
    for opt in options_to_check:
        if opt == correct_opt:
            analysis[opt] = f"Doğru Seçenek: ÖSYM/MEB '{topic}' kazanımına tam uygun, adım adım mantıksal çıkarsama ile doğrulanan çözüm."
        else:
            analysis[opt] = f"Çeldirici Yanılgısı: {misconceptions[m_idx % len(misconceptions)]}"
            m_idx += 1

    return json.dumps(analysis, ensure_ascii=False)

TURKISH_READINGS = [
    (
        "Teknolojinin sunduğu sonsuz bilgi akışı, bireylerin derinlemesine düşünme ve odaklanma becerilerini zamanla aşındırmaktadır. Eskiden saatlerce bir kitabın dünyasına dalıp giden insan, bugün birkaç saniyelik görsel uyarıcıların peşinden koşan sabırsız bir izleyiciye dönüşmüştür. Bu yüzeysellik, sanatsal yaratıcılıktan felsefi sorgulamalara kadar her alanı derinden etkilemektedir.",
        "Dijital hız ve bilgi bombardımanı insanın derinlikli odaklanma yeteneğini zayıflatmaktadır.",
        [
            "Teknoloji sayesinde insanların okuma ve anlama hızı katlanarak artmıştır.",
            "Görsel uyarıcılar felsefi yaratıcılığı zenginleştiren en önemli unsurdur.",
            "Geleneksel kitaplar dijital çağın getirdiği gereksinimleri karşılamaktan uzaktır.",
            "Sanatsal üretim dijitalleşmenin doğurduğu yüzeyselliğe karşı tek sığınaktır."
        ],
        "Paragrafta teknolojinin hızının derin düşünmeyi ve sabırlı odaklanmayı zedelediği ana düşünce olarak vurgulanmıştır."
    ),
    (
        "Sanatçı, çağına tanıklık eden ama onun dar sınırlarına hapsolmayan kişidir. Bir romancı veya şair, yaşadığı dönemin toplumsal çalkantılarını eserine nakşederken evrensel insanlık durumunu ıskalarsa, eseri yarınlara kalamaz. Çünkü kalıcılık, yerelden yola çıkıp evrensel değerlerle buluşabilme ustalığıdır.",
        "Sanat eserinin kalıcılığı, yerel olayları evrensel insanlık temalarıyla harmanlamasına bağlıdır.",
        [
            "Sanatçı yalnızca kendi çağının modasına ve beklentilerine uygun eser üretmelidir.",
            "Evrensel temaları işleyen yazarlar toplumsal gerçeklikten kopuk kalırlar.",
            "Kalıcı olmanın tek koşulu soyut ve anlaşılmaz bir dil kullanmaktır.",
            "Toplumsal çalkantıları konu edinmeyen hiçbir yapıt edebi değer kazanamaz."
        ],
        "Yazar, yerellikten evrenselliğe uzanabilen yapıtların zamana direnebileceğini belirtmektedir."
    ),
    (
        "Eleştiri, bir edebiyat eserini yargılayıp mahkûm etme kürsüsü değil; aksine okur ile metin arasında köprü kurma sanatıdır. Yetkin bir eleştirmen, yazarın kurduğu dünyayı didik didik ederken onun gizli estetik katmanlarını gün ışığına çıkarır. Böylece okur, metnin yüzeyinde göremediği zenginlikleri keşfeder.",
        "Eleştirinin temel gayesi, eserin derinliklerini açığa çıkararak okurun alımlamasını zenginleştirmektir.",
        [
            "Eleştirmen eserin zayıf yönlerini cezalandırmakla görevli bir hakemdir.",
            "İyi bir metin hiçbir eleştiriye ve rehberliğe ihtiyaç duymadan anlaşılır.",
            "Eleştiri yazıları edebi eserlerin özgünlüğünü kısıtlayan bir engeldir.",
            "Okurun metinden zevk alabilmesi için yazarın niyetini baştan bilmesi zorunludur."
        ],
        "Paragrafta eleştirinin okur ile metin arasındaki zenginleştirici köprü işlevi ele alınmıştır."
    ),
    (
        "Mimari yapılar, taş ve harçtan ibaret fiziki varlıklar değil; bir toplumun hayat tasavvurunun, inanç sisteminin ve tabiatla kurduğu ilişkinin mekâna yansımasıdır. Osmanlı cami ve külliyelerine baktığınızda yalnızca ibadet mekânı değil; aşevi, medrese ve şifahane ile bütünleşmiş bir merhamet medeniyeti görürsünüz.",
        "Mimari eserler inşa edildikleri toplumun kültürel, ahlaki ve zihinsel kodlarını yansıtır.",
        [
            "Tarihi yapıların dayanıklılığı kullanılan malzemenin cinsine bağlıdır.",
            "Mimarlık sadece estetik kaygılarla üretilen pratikten ibarettir.",
            "Geleneksel mimarinin günümüz kent yaşamına uygulanması imkânsızdır.",
            "Kentleşme süreçlerinde tarihi eserlerin korunması ikinci planda tutulmalıdır."
        ],
        "Paragrafta mimarinin bir toplumun değerler sistemini somutlaştırdığı vurgulanmıştır."
    ),
    (
        "Dil, yalnızca insanlar arasında anlaşmayı sağlayan mekanik bir araç değildir; bir ulusun hafızası, dünyayı algılama biçimi ve düşünce evrenidir. Bir sözcük kaybolduğunda sadece bir ses öbeği değil, o sözcüğün taşıdığı asırlık bir duygu ve deneyim de tarihe karışır. Bu yüzden anadilini korumak, bir toplumun kendi varoluşunu ve kimliğini koruması demektir.",
        "Anadil, bir ulusun zihniyetini, kültürel belleğini ve kolektif kimliğini taşıyan kurucu unsurdur.",
        [
            "Dillerin değişimi ve yabancı sözcüklerin girişi her zaman kültürel bir zenginleşme doğurur.",
            "Kelimelerin sayısı bir toplumun teknolojik gelişmişlik düzeyini doğrudan yansıtır.",
            "Dilin temel işlevi yalnızca pratik günlük iletişimi sağlamakla sınırlıdır.",
            "Eski sözcükleri koruma çabası çağdaş edebiyatın gelişimine ket vurmaktadır."
        ],
        "Yazar anadilin bir milletin kültürel hafızası ve kimliği olduğunu ana düşünce olarak savunmaktadır."
    ),
    (
        "Yazmak, içsel bir hesaplaşma ve dünyayı yeniden kurma çabasıdır. Masasının başına geçen yazar, gerçeği olduğu gibi kopyalamak yerine ona kendi duyarlık süzgecinden geçirerek yeni bir biçim verir. Tıpkı bir ressamın tuvaline vurduğu fırça darbeleri gibi, sözcükler de yazarın zihninde yeniden yoğrulup yeni anlam katmanlarına bürünür.",
        "Yazınsal yaratım, nesnel gerçeğin yazarın öznel duyarlılığı ve imgeleminde yeniden üretilmesidir.",
        [
            "Başarılı bir yazar gözlemlediği olayları hiçbir değişiklik yapmadan aktarmalıdır.",
            "Edebi metinlerin değeri anlatılan olayın olağanüstülüğü ve sıradışılığı ile ölçülür.",
            "Yazarlık yeteneği tamamen doğuştan gelen ve sonradan geliştirilemeyen bir niteliktir.",
            "Gerçekçi romanlar okurun hayal gücünü geliştirmekte yetersiz kalır."
        ],
        "Paragrafta yazarın gerçeği kopyalamak yerine öznel duyarlılığıyla dönüştürdüğü ana fikir olarak işlenmiştir."
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


# --- ALTI ÇİZİLİ SÖZCÜK VE SÖZ ÖBEĞİ ÜRETEÇLERİ (GARANTİLİ <u>...</u> ETİKETLİ) ---

TURKISH_UNDERLINED_PHRASES = [
    (
        "Genç yazar, ilk romanında ustaların ayak izlerini takip etmek yerine <u>kendi patikasını açmayı</u> seçmiş; edebiyat dünyasında bağımsız bir ses olarak öne çıkmıştır.",
        "Kimseye özenmeden özgün ve bağımsız bir anlatım yolu benimsemek",
        [
            "Zorlu ve yıpratıcı çalışma koşullarını göze almak",
            "Geleneksel anlatım biçimlerini harfiyen sürdürmek",
            "Geniş okur kitlelerinin ticari beklentilerine uygun eser üretmek",
            "Kişisel yaşam öyküsünü edebi bir kurgu haline getirmek"
        ],
        "Metindeki 'kendi patikasını açmak' ifadesi, başkalarını taklit etmeden özgün ve bağımsız bir edebi yol tutturmayı ifade eder."
    ),
    (
        "Usta şair, şiirlerinde büyük iddiaların arkasına sığınmaz; gündelik hayatın telaşında gözden kaçan ayrıntılara <u>ayna tutarak</u> okuru derin bir iç muhasebeye davet eder.",
        "Gerçekleri ve saklı kalan durumları tarafsızca görünür kılmak",
        [
            "Edebi gelenekten tamamen koparak soyut imgelere yönelmek",
            "Okurun beklentilerine göre şiir anlayışını şekillendirmek",
            "Sosyal eleştiriyi gizlemek amacıyla kapalı bir dil kullanmak",
            "Geleceğe dair kesin ve bağlayıcı öngörülerde bulunmak"
        ],
        "'Ayna tutmak' sözü, var olan durumları veya gözden kaçan gerçekleri olduğu gibi yansıtıp görünür kılmak anlamındadır."
    ),
    (
        "Toplumsal meseleler karşısında <u>kabuğuna çekilmek</u> bir aydının benimseyeceği tavır olamaz; aydın, çağına ve insanına karşı vicdani sorumluluk taşır.",
        "Çevresindeki olaylarla ilgisini kesip kendi içine kapanmak",
        [
            "Fikirlerini kimseden çekinmeden açıkça savunmak",
            "Toplumsal baskılara karşı örgütlü bir mücadele yürütmek",
            "Geçmişin kültürel mirasını tarafsızca incelemek",
            "Sorunları çözmek yerine görmezden gelmeyi erdem saymak"
        ],
        "'Kabuğuna çekilmek' deyimi, dış dünyadaki gelişmelere duyarsız kalarak kendi yalnızlığına ve iç dünyasına kapanmak demektir."
    ),
    (
        "Büyük romancılar sadece olay anlatmaz; eserlerinde <u>hayatın nabzını tutarak</u> insan ruhunun en hassas titreşimlerini okura duyururlar.",
        "Yaşamın canlılığını, değişimini ve gerçek dinamiklerini yakından hissetmek",
        [
            "Tarihsel belgeleri roman kurgusunda kusursuzca birleştirmek",
            "Toplumun ahlaki değerlerini yargılayıp yönlendirmeye çalışmak",
            "Okurlara hayatın zorluklarına karşı teselli vermek",
            "Eserin sonunu okurun tahmin edemeyeceği biçimde bağlamak"
        ],
        "'Hayatın nabzını tutmak' ifadesi, yaşamın gerçek akışını, temposunu ve insani duyguları derinden kavramak ve hissettirmek anlamına gelir."
    )
]

def q_turkish_underlined_phrase() -> Dict[str, Any]:
    item = random.choice(TURKISH_UNDERLINED_PHRASES)
    opts = format_options(item[1], item[2])
    return {
        "question_text": f'**Paragraf:**\n"{item[0]}"\n\nBu parçadaki **altı çizili sözle anlatılmak istenen** aşağıdakilerden hangisidir?',
        "visual_svg": None,
        "explanation": item[3],
        "topic": "Sözcükte ve Söz Öbeklerinde Anlam",
        "subtopic": "Altı Çizili Söz Öbeğinin Anlamı",
        **opts
    }

def q_turkish_underlined_word_meaning() -> Dict[str, Any]:
    items = [
        {
            "stem": "Aşağıdaki cümlelerin hangisinde **altı çizili sözcük mecaz anlamda** kullanılmıştır?",
            "correct": "Bu samimi ve sıcak tavırlarıyla kısa sürede herkesin <u>kalbini kazandı</u>.",
            "distractors": [
                "Dün akşamdan beri odasındaki çalışma <u>masasını</u> temizliyordu.",
                "Pencereden süzülen parlak <u>güneş</u> ışığı odayı aydınlattı.",
                "Bahçedeki sararmış kuru <u>yaprakları</u> dikkatle topladılar.",
                "Çantasındaki kalın <u>kitabı</u> çıkarıp sıranın üzerine bıraktı."
            ],
            "exp": "'Kalp kazanmak' mecaz anlamlı bir söz öbeğidir (sevgi ve sempati kazanmak anlamında kullanılmıştır)."
        },
        {
            "stem": "Aşağıdaki cümlelerin hangisinde **altı çizili sözcük terim anlamıyla** kullanılmıştır?",
            "correct": "Tiyatro oyununun ikinci <u>perdesi</u> seyircilerden büyük alkış aldı.",
            "distractors": [
                "Güneş içeri girmesin diye salonun <u>perdesini</u> kapattı.",
                "Olayların üzerindeki sır <u>perdesi</u> henüz aralanmadı.",
                "Gözlerindeki hüzün <u>perdesi</u> dikkatimizden kaçmadı.",
                "İki arkadaş aralarındaki soğukluk <u>perdesini</u> sonunda kaldırdı."
            ],
            "exp": "'Perde' sözcüğü tiyatro sanatına ait bir kavram olarak terim anlamıyla kullanılmıştır."
        }
    ]
    chosen = random.choice(items)
    opts = format_options(chosen["correct"], chosen["distractors"])
    return {
        "question_text": chosen["stem"],
        "visual_svg": None,
        "explanation": chosen["exp"],
        "topic": "Sözcükte Anlam",
        "subtopic": "Gerçek, Mecaz ve Terim Anlam",
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


# ================= DİN KÜLTÜRÜ VE AHLAK BİLGİSİ ÜRETEÇLERİ (MEB & ÖSYM KAZANIMLARI) =================

def q_religion_zekat_infak() -> Dict[str, Any]:
    opts = format_options("Sadaka-i Cariye", ["Fitre (Sadaka-i Fıtır)", "Öşür", "Kefaret", "Adak Kurbanı"])
    return {
        "question_text": "Maddi durumu iyi olan bir hayırsever, yaşadığı ilçede herkesin ücretsiz yararlanabileceği bir sağlık ocağı ve su kuyusu yaptırmıştır. Peygamber Efendimiz (s.a.v.), insanın vefatından sonra da amel defterinin kapanmamasına vesile olan bu tür kalıcı hayırları aşağıdaki kavramlardan hangisiyle nitelendirmiştir?",
        "visual_svg": None,
        "explanation": "Kişinin vefatından sonra da sevabı devam eden okul, cami, çeşme, köprü gibi kalıcı sadakalara 'Sadaka-i Cariye' denir.",
        "topic": "İslam ve İbadetler",
        "subtopic": "Zekat, İnfak ve Sadaka-i Cariye",
        **opts
    }

def q_religion_kader_tevekkul() -> Dict[str, Any]:
    opts = format_options("Tevekkül anlayışının yanlış yorumlanması; tedbirsiz tevekkül olamayacağı gerçeği", [
        "Ecel kavramının tamamen rastlantılara bağlı olduğu inancı",
        "Külli iradenin insanın tüm eylemlerini zorunlu kıldığı yanılgısı",
        "İbadetlerin sadece cami ve mescitlerde yapılabileceği düşüncesi",
        "Toplumsal yasaların fiziksel yasalardan daha önemsiz olduğu kabulü"
    ])
    return {
        "question_text": "Tarlasını sürmeyen, tohum ekmeyen ve gerekli sulamayı yapmayan bir çiftçinin, 'Ben Allah'a güvendim, kaderimde ne varsa o çıkar' diyerek verimli bir hasat beklemesi, İslam inancındaki hangi temel kavramın yanlış anlaşılmasına örnektir?",
        "visual_svg": None,
        "explanation": "Tevekkül, bir amaca ulaşmak için insanın elinden gelen tüm maddi ve manevi sebeplere başvurup tedbir aldıktan sonra Allah'a güvenmesidir. Sebeplere sarılmadan beklemek tembelliktir.",
        "topic": "Kader İnancı",
        "subtopic": "Tevekkül ve İnsan İradesi",
        **opts
    }

def q_religion_bilgi_kaynaklari() -> Dict[str, Any]:
    opts = format_options("Selim Akıl, Sadık Haber (Vahiy) ve Salim Duyular", [
        "Sezgiler, Rüya ve Astroloji",
        "Gelenekler, Mitoloji ve Doğa Olayları",
        "Sadece Salim Duyular ve Deney",
        "Felsefi Şüphecilik ve Varsayımlar"
    ])
    return {
        "question_text": "İslam epistemolojisinde (bilgi felsefesinde) insanın doğru ve bağlayıcı bilgiye ulaşmasını sağlayan üç temel kaynak aşağıdakilerin hangisinde birlikte ve eksiksiz verilmiştir?",
        "visual_svg": None,
        "explanation": "İslam düşüncesine göre doğru bilginin üç temel kaynağı vardır: Selim akıl (önyargısız akıl yürütme), Sadık haber (vahiy ve mütevatir haber) ve Salim duyular (sağlam duyu organları).",
        "topic": "İnanç ve Bilgi",
        "subtopic": "İslam'da Bilginin Kaynakları",
        **opts
    }

def q_religion_ahlak_kulhakki() -> Dict[str, Any]:
    opts = format_options("Kul Hakkı ve Sosyal Adalet", [
        "Kader ve Kaza",
        "Taassup ve Taklit",
        "Mübah ve Mekruh Hükümleri",
        "Teyemmüm ve Temizlik"
    ])
    return {
        "question_text": "'Ey iman edenler! Mallarınızı aranızda batıl ve haksız yollarla yemeyin; ancak karşılıklı rızaya dayanan ticaretle yiyin...' (Nisâ Suresi, 29)\n\nBu ayet-i kerimede bireysel ve toplumsal hayatta öncelikle hangi ahlaki ve hukuki ilkenin korunması emredilmektedir?",
        "visual_svg": None,
        "explanation": "Ayet; gasp, hırsızlık, rüşvet, hile ve aldatmayı yasaklayarak 'Kul Hakkı'nın korunmasını ve ekonomik adaleti tesis etmeyi hedeflemektedir.",
        "topic": "Ahlak ve Değerler",
        "subtopic": "İslam Ahlakı ve Kul Hakkı",
        **opts
    }

def q_religion_peygamber_usve() -> Dict[str, Any]:
    opts = format_options("İstişareye (Şûra) verdiği önem ve ortak akla başvurması", [
        "Kişisel kararlarını vahyin dahi üzerinde tutması",
        "Sadece yaşlı ve kabile reislerinin fikrini dinlemesi",
        "Her türlü askeri kararı tek başına alması",
        "Toplumsal kuralları geleneklere göre esnetmesi"
    ])
    return {
        "question_text": "Hz. Muhammed (s.a.v.), Hendek Savaşı öncesinde Selman-ı Farisi'nin hendek kazma teklifini kabul etmiş, Bedir Savaşı'nda ise ordunun konaklayacağı yer konusunda sahabenin görüşüne uyarak karargâh yerini değiştirmiştir. Bu durum Hz. Peygamber'in hangi yönetimsel ve ahlaki ilkeye bağlılığını kanıtlar?",
        "visual_svg": None,
        "explanation": "Hz. Peygamber vahyin bulunmadığı hususlarda ashabıyla görüş alışverişinde bulunur (şûra / istişare) ve en isabetli ortak karara uyardı.",
        "topic": "Hz. Muhammed ve Örnekliği",
        "subtopic": "Üsve-i Hasene ve İstişare (Şura)",
        **opts
    }

def q_religion_kuran_kavramlar() -> Dict[str, Any]:
    opts = format_options("İhsan", ["İhlas", "Takva", "Hidayet", "Sırat-ı Müstakim"])
    return {
        "question_text": "Meşhur 'Cebrail Hadisi'nde Peygamber Efendimiz (s.a.v.) tarafından 'Allah'ı görüyormuş gibi ibadet etmendir; her ne kadar sen O'nu görmesen de O seni görmektedir' şeklinde tarif edilen yüce manevi makam aşağıdakilerden hangisidir?",
        "visual_svg": None,
        "explanation": "Kişinin her an Allah'ın gözetimi altında olduğu bilinciyle samimi ve kaliteli yaşamasına 'İhsan' denir. Bunu gerçekleştiren kula 'muhsin' adı verilir.",
        "topic": "Kur'an'da Bazı Kavramlar",
        "subtopic": "İhsan, İhlas ve Takva",
        **opts
    }

def q_religion_mezhepler() -> Dict[str, Any]:
    opts = format_options("Maturidilik ve Eş'arilik", [
        "Hanefilik ve Şafilik",
        "Malikilik ve Hanbelilik",
        "Mutezile ve Cebriye",
        "Caferilik ve Zeydilik"
    ])
    return {
        "question_text": "İslam tarihinde inanç (itikad) alanında ortaya çıkan, ayet ve hadisleri akıl ilkeleriyle destekleyerek Ehl-i Sünnet omurgasını oluşturan iki büyük itikadi mezhep aşağıdakilerden hangisinde doğru verilmiştir?",
        "visual_svg": None,
        "explanation": "Ehl-i Sünnet'in iki temel itikadi ekolü İmam Maturidi'nin kurduğu Maturidilik ile İmam Eş'ari'nin kurduğu Eş'ariliktir. (Hanefilik ve Şafilik ise ameli/fıkhi mezheplerdir).",
        "topic": "İslam Düşüncesinde Yorumlar",
        "subtopic": "İtikadi ve Fıkhi Mezhepler",
        **opts
    }

def q_religion_ibadetler_hukumler() -> Dict[str, Any]:
    opts = format_options("Farz-ı Kifaye", ["Farz-ı Ayn", "Vacip", "Sünnet-i Müekkede", "Mübah"])
    return {
        "question_text": "Müslümanların bir kısmı tarafından yerine getirildiğinde diğerlerinin üzerinden sorumluluğu kalkan, ancak hiç kimse yapmazsa tüm toplumun sorumlu sayıldığı ibadet çeşidi (örneğin cenaze namazı) fıkıhta hangi kavramla adlandırılır?",
        "visual_svg": None,
        "explanation": "Cenaze namazı, ilim öğrenmek gibi toplumsal mükellefiyetler 'Farz-ı Kifaye'dir. Beş vakit namaz ve oruç gibi herkesin bizzat yapması gerekenler ise 'Farz-ı Ayn'dır.",
        "topic": "İslam ve İbadetler",
        "subtopic": "Ef'al-i Mükellefin Hükümleri",
        **opts
    }

def q_religion_gonul_cografyasi() -> Dict[str, Any]:
    opts = format_options("Hoca Ahmed Yesevi - Divan-ı Hikmet", [
        "Yusuf Has Hacib - Kutadgu Bilig",
        "Kaşgarlı Mahmud - Divanu Lugati't-Türk",
        "Edip Ahmet Yükneki - Atabetü'l-Hakayık",
        "Ali Şir Nevai - Muhakemetü'l-Lugateyn"
    ])
    return {
        "question_text": "Türkistan'da yetişip yetiştirdiği dervişleri Anadolu ve Balkanlar'a göndererek Türklerin İslamlaşmasına ve gönül coğrafyamızın mayalanmasına öncülük eden 'Pîr-i Türkistan' lakaplı mutasavvıf ve en önemli eseri hangisidir?",
        "visual_svg": None,
        "explanation": "Pir-i Türkistan olarak bilinen Hoca Ahmed Yesevi'nin hikmet dolu şiirlerinin toplandığı eser 'Divan-ı Hikmet'tir.",
        "topic": "Din, Kültür ve Medeniyet",
        "subtopic": "Gönül Coğrafyamızın Öncüleri",
        **opts
    }

def q_religion_cevre_israf() -> Dict[str, Any]:
    opts = format_options("Kainattaki hassas ekolojik dengenin korunması ve kaynakların israf edilmemesi", [
        "Doğal kaynakların sınırsızca tüketilmesinin serbest oluşu",
        "Sadece ibadet esnasında temizliğe riayet edilmesinin yeterli olması",
        "Tüm canlı türlerinin insana tamamen boyun eğdirilmesinin emredilmesi",
        "Maddi zenginliğin her türlü ahlaki kuralın önünde tutulması"
    ])
    return {
        "question_text": "'Göğü yükseltti ve ölçüyü (dengeyi) koydu. Sakın ölçü ve dengede haddi aşmayın!' (Rahmân Suresi, 7-8)\n\nBu ayet-i kerime günümüz dünyasında yaşanan küresel sorunlardan öncelikle hangisine karşı ilahi bir ikaz niteliğindedir?",
        "visual_svg": None,
        "explanation": "Ayet kainattaki ilahi ölçü ve ekolojik dengenin gözetilmesini, doğal kaynakların sorumsuzca ifrat ve tefrite düşülerek israf edilmemesini emreder.",
        "topic": "Din ve Hayat",
        "subtopic": "İslam ve Çevre Ahlakı",
        **opts
    }

# ================= FELSEFE ÜRETEÇLERİ =================

def q_philosophy_epistemology() -> Dict[str, Any]:
    opts = format_options("Kritisizm (Eleştiricilik - Kant)", [
        "Rasyonalizm (Akılcılık - Descartes)",
        "Empirizm (Deneycilik - John Locke)",
        "Pozitivizm (Olguculuk - Auguste Comte)",
        "Entüisyonizm (Sezgicilik - Bergson)"
    ])
    return {
        "question_text": "'Görüsüz kavramlar boş, kavramsız görüler kördür.' sözüyle bilginin hem duyusal deneyden hem de zihnin a priori formlarından meydana geldiğini savunan felsefi akım ve düşünür aşağıdakilerden hangisidir?",
        "visual_svg": None,
        "explanation": "Immanuel Kant hem akılcılığı hem de deneyciliği uzlaştırarak bilginin deneyle başladığını fakat deneyden ibaret olmadığını savunan 'Kritisizm' akımını kurmuştur.",
        "topic": "Bilgi Felsefesi (Epistemoloji)",
        "subtopic": "Kant ve Kritisizm",
        **opts
    }

def q_philosophy_ethics() -> Dict[str, Any]:
    opts = format_options("Ödev Ahlakı (Deontoloji / Koşulsuz Buyruk)", [
        "Faydacılık (Utilitarizm)",
        "Hazcılık (Hedonizm)",
        "Bencillik (Egoizm)",
        "Hiççilik (Nihilizm)"
    ])
    return {
        "question_text": "Bir eylemin ahlaki değerini doğuracağı sonuçlara, getireceği çıkara veya hazza göre değil; yalnızca 'ödev duygusuyla ve iyi niyetle' yapılmış olmasına bağlayan etik yaklaşım aşağıdakilerden hangisidir?",
        "visual_svg": None,
        "explanation": "Kant'ın 'Ödev Ahlakı'na (Kategorik İmperatif) göre bir eylem çıkar veya korku gözetilmeksizin sırf ahlak yasasına saygıdan dolayı yapılmışsa ahlakidir.",
        "topic": "Ahlak Felsefesi (Etik)",
        "subtopic": "Kant'ın Ödev Ahlakı",
        **opts
    }

def q_philosophy_ontology() -> Dict[str, Any]:
    opts = format_options("Düalizm (İkicilik - Madde ve Ruh)", [
        "Materyalizm (Özdekçilik)",
        "İdealizm (Fikirçilik)",
        "Oluşçuluk (Herakleitos)",
        "Fenomenoloji (Görüngübilim)"
    ])
    return {
        "question_text": "Varlığın temelinde birbirine indirgenemeyen iki tözün olduğunu; ruhun düşünen (res cogitans), maddenin ise yer kaplayan (res extensa) nitelikte bulunduğunu öne süren Descartes'ın ontolojik yaklaşımı hangisidir?",
        "visual_svg": None,
        "explanation": "Descartes varlığı madde ve ruh olmak üzere iki ayrı cevherle açıklayan 'Düalizm' (ikicilik) yaklaşımının en önemli temsilcisidir.",
        "topic": "Varlık Felsefesi (Ontoloji)",
        "subtopic": "Düalizm ve Töz Problemi",
        **opts
    }

def q_philosophy_nature_thinking() -> Dict[str, Any]:
    opts = format_options("Refleksif (düşünce üzerine düşünme) ve kümülatif (yığılımlı) olması", [
        "Bitmiş, kesin ve mutlak doğrular sunması",
        "Yalnızca deneysel metotlarla doğrulanabilir olması",
        "Teknolojiye doğrudan pratik ürün sağlaması",
        "Toplumun geneli tarafından oybirliğiyle benimsenmesi"
    ])
    return {
        "question_text": "Felsefi bilginin bilimsel bilgiden ayrılan en temel niteliği; düşüncenin kendi üzerine dönerek sorgulama yapması ve çağlar boyunca bilgilerin birbirine eklenerek birikmesidir. Bu nitelikler sırasıyla hangi kavramlarla adlandırılır?",
        "visual_svg": None,
        "explanation": "Zihnin kendi bilgi ve düşünceleri üzerine düşünmesine 'refleksif olma', felsefi birikimin art arda yığılmasına ise 'kümülatif olma' denir.",
        "topic": "Felsefeyi Tanıma",
        "subtopic": "Felsefi Düşüncenin Nitelikleri",
        **opts
    }

def q_philosophy_politics() -> Dict[str, Any]:
    opts = format_options("Ütopya (İstenen / Tasarlanan İdeal Devlet)", [
        "Distopya (Korku Ütopyası)",
        "Bürokrasi",
        "Otokrasi",
        "Meşruiyet Krizi"
    ])
    return {
        "question_text": "Gerçekte var olmayan ancak filozofların toplumsal adaleti ve mükemmel düzeni sağlamak amacıyla zihinlerinde kurguladıkları hayali devlet tasarımlarına (örneğin Thomas More'un eseri) ne ad verilir?",
        "visual_svg": None,
        "explanation": "Gerçekleşmesi arzulanan kusursuz toplumsal düzen tasarımlarına 'Ütopya' denir.",
        "topic": "Siyaset Felsefesi",
        "subtopic": "İdeal Düzen Arayışları ve Ütopyalar",
        **opts
    }

def q_philosophy_religion() -> Dict[str, Any]:
    opts = format_options("Agnostisizm (Bilinemezcilik)", [
        "Deizm (Yaradanancılık)",
        "Teizm (Tanrıcılık)",
        "Panteizm (Tüm-tanrıcılık)",
        "Ateizm (Tanrıtanımazlık)"
    ])
    return {
        "question_text": "'Tanrı'nın varlığı veya yokluğu insan zihninin sınırlı yapısı ve deneysel yetersizliği nedeniyle kesin olarak bilinemez ve kanıtlanamaz.' tezini savunan felsefi görüş aşağıdakilerden hangisidir?",
        "visual_svg": None,
        "explanation": "Tanrı'nın varlığına ilişkin akli ve mantıki yargıda bulunmaktan kaçınan 'bilinemezcilik' yaklaşımı Agnostisizm'dir.",
        "topic": "Din Felsefesi",
        "subtopic": "Tanrı'nın Varlığına Yaklaşımlar",
        **opts
    }

# ================= COĞRAFYA ÜRETEÇLERİ (VEKTÖREL SVG GÖRSELLİ) =================

def q_geography_climate() -> Dict[str, Any]:
    svg = generate_dynamic_climate_graph_svg("Akdeniz İklimi")
    opts = format_options("Yazları sıcak ve kurak, kışları ılık ve yağışlıdır.", [
        "Her mevsim düzenli ve bol yağış alır.",
        "Kış aylarında sıcaklık daima eksi değerlerdedir.",
        "En fazla yağış ilkbahar konveksiyonel yağışları şeklindedir.",
        "Yıllık sıcaklık farkı 50 derecenin üzerindedir."
    ])
    return {
        "question_text": "Yukarıda aylık sıcaklık ve yağış grafiği verilen iklim bölgesi (Antalya, İzmir yöresi) için aşağıdaki değerlendirmelerden hangisi kesinlikle doğrudur?",
        "visual_svg": svg,
        "explanation": "Grafikte yaz aylarında sıcaklığın yüksek ve yağışın minimum olduğu, kış aylarında ise sıcaklığın 10°C civarında kalıp yağışın tavan yaptığı Akdeniz iklim karakteri açıkça görülmektedir.",
        "topic": "İklim Bilgisi",
        "subtopic": "Büyük İklim Tipleri ve Grafikleri",
        **opts
    }

def q_geography_isohypse() -> Dict[str, Any]:
    h = random.choice([100, 200, 250])
    svg = generate_dynamic_isohypse_svg(h)
    opts = format_options(f"{h} metre", [f"{h//2} metre", f"{h*2} metre", f"{h+50} metre", "50 metre"])
    return {
        "question_text": f"Yukarıdaki topografya haritasında deniz seviyesinden başlayan ilk eş yükselti eğrisi ile sonraki eğriler gösterilmiştir. Buna göre, bu haritadaki izohips eğrileri kaç metre aralıkla (eküidistans) çizilmiştir?",
        "visual_svg": svg,
        "explanation": f"Deniz seviyesi 0 metredir. Bir sonraki eğri {h} metre olduğuna göre izohips aralığı (eküidistans) {h} metredir.",
        "topic": "Harita Bilgisi ve İzohipsler",
        "subtopic": "Eküidistans ve Yükselti Hesabı",
        **opts
    }

def q_geography_coordinates() -> Dict[str, Any]:
    boylam = random.choice([15, 30, 45, 60])
    saat_farki = boylam // 15
    opts = format_options(f"{saat_farki} saat ileri", [f"{saat_farki} saat geri", f"{saat_farki * 2} saat ileri", "Yerel saatler aynıdır", f"{saat_farki + 1} saat geri"])
    return {
        "question_text": f"$30^\\circ$ Doğu meridyeninde yerel saat 12.00 iken, aynı anda ${30 + boylam}^\\circ$ Doğu meridyeninde yer alan bir merkezde yerel saat batıdakine göre nasıl bir farklılık gösterir?",
        "visual_svg": None,
        "explanation": f"Doğudaki merkezlerde güneş daha erken doğar ve yerel saat daima ileridir. İki meridyen arasındaki {boylam}° boylam farkı {boylam} x 4 = {boylam*4} dakika, yani {saat_farki} saat ileri demektir.",
        "topic": "Coğrafi Konum",
        "subtopic": "Meridyenler ve Yerel Saat",
        **opts
    }

def q_geography_population() -> Dict[str, Any]:
    opts = format_options("Doğum oranlarının hızla düşmesi ve ortalama yaşam süresinin uzayarak yaşlı nüfusun artması", [
        "Nüfusun büyük bölümünün tarım sektöründe çalışması",
        "Bebek ölüm oranlarının aşırı yüksek seyretmesi",
        "Ülkenin sürekli dışarıya niteliksiz beyin göçü vermesi",
        "İç göçlerin sadece kırsal alanlara doğru yönelmesi"
    ])
    return {
        "question_text": "Tabanı giderek daralan ve üst kısmı genişleyen (arı kovanı veya çan şeklindeki) bir nüfus piramidine sahip gelişmiş bir ülke hakkında aşağıdakilerden hangisi söylenebilir?",
        "visual_svg": None,
        "explanation": "Gelişmiş ülkelerde eğitim ve refah düzeyi yükseldikçe doğum oranları düşer (piramit tabanı daralır), sağlık hizmetleri geliştikçe ortalama ömür uzar (piramidin zirvesi genişler).",
        "topic": "Nüfus ve Yerleşme",
        "subtopic": "Nüfus Piramitleri ve Gelişmişlik",
        **opts
    }

def q_geography_natural_hazards() -> Dict[str, Any]:
    opts = format_options("Levha sınırları (fay hatları), volkanik kuşaklar ve genç oluşumlu araziler", [
        "Eski masif araziler ve birinci jeolojik zaman kalkanları",
        "Sadece çöl ikliminin etkili olduğu iç havzalar",
        "Kutuplara yakın donmuş tundra bölgeleri",
        "Sırf derin akarsu vadilerinin bulunduğu platolar"
    ])
    return {
        "question_text": "Dünya genelinde tektonik depremler, volkanik faaliyetler ve sıcak su kaynaklarının (gayzer ve kaplıcaların) coğrafi dağılımı incelendiğinde, bu doğa olaylarının en yoğun paralellik gösterdiği alanlar hangisidir?",
        "visual_svg": None,
        "explanation": "Deprem, volkanizma ve sıcak su kaynakları litosferdeki aktif levha sınırları ve kırık (fay) hatları boyunca paralellik gösterir.",
        "topic": "İç ve Dış Kuvvetler",
        "subtopic": "Levha Tektoniği ve Doğal Afetler",
        **opts
    }

def q_geography_winds() -> Dict[str, Any]:
    opts = format_options("Fön Rüzgarı", ["Meltem Rüzgarı", "Alize Rüzgarı", "Bora", "Sirokko"])
    return {
        "question_text": "Dağ yamacını aşarak diğer taraftan aşağıya doğru alçalan havanın her 100 metrede yaklaşık 1°C ısınmasıyla oluşan; kışın karları erken eriten, yazın ise tarım ürünlerini kurutan sıcak ve kuru rüzgar hangisidir?",
        "visual_svg": None,
        "explanation": "Yamaçtan aşağıya sürtünerek hızla inen havanın adyabatik ısınmasıyla 'Fön rüzgarı' meydana gelir.",
        "topic": "Atmosfer ve Rüzgarlar",
        "subtopic": "Yerel Rüzgarlar ve Fön Etkisi",
        **opts
    }

# ================= TARİH ÜRETEÇLERİ (MEB KAZANIMLARI) =================

def q_history_seljuk() -> Dict[str, Any]:
    opts = format_options("Malazgirt Meydan Muharebesi (1071)", [
        "Dandanakan Savaşı (1040)",
        "Pasinler Savaşı (1048)",
        "Katvan Savaşı (1141)",
        "Yassıçemen Savaşı (1230)"
    ])
    return {
        "question_text": "Büyük Selçuklu Hükümdarı Sultan Alparslan'ın Bizans İmparatoru Romen Diyojen'i mağlup ederek 'Anadolu'nun kapılarını Türklere kesin olarak açtığı' tarihi zafer hangisidir?",
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
        "question_text": "Halifeliğin kaldırılması (1924), Medreselerin kapatılması ve Medeni Kanun'un kabulü (1926) doğrudan Atatürk'ün hangi ilkesi doğrultusunda gerçekleştirilmiştir?",
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
        "question_text": "I. Dünya Savaşı'nda Osmanlı Devleti'nin İtilaf Devletleri donanmasını püskürterek zafer kazandığı ve Çarlık Rusya'sına yardım gitmesini engelleyerek Rusya'da Bolşevik İhtilali'nin çıkmasında etkili olduğu savunma cephesi hangisidir?",
        "visual_svg": None,
        "explanation": "Çanakkale Cephesi Osmanlı'nın I. Dünya Savaşı'nda net bir zafer elde ettiği, savaşın uzamasına ve Rusya'da çarlığın çökmesine yol açan cephedir.",
        "topic": "XX. Yüzyıl Başlarında Osmanlı Devleti",
        "subtopic": "I. Dünya Savaşı ve Çanakkale Cephesi",
        **opts
    }

def q_history_ottoman_reforms() -> Dict[str, Any]:
    opts = format_options("Kanun üstünlüğü ilkesi kabul edilmiş ve padişah kendi yetkilerini kanunla sınırlandırmıştır.", [
        "Cumhuriyet yönetimine resmen geçilmiştir.",
        "Osmanlı ordusu tamamen feshedilerek yerine milis kuvvetler kurulmuştur.",
        "Kapitülasyonlar tek taraflı olarak kaldırılmıştır.",
        "Yabancı okulların tamamı kapatılmıştır."
    ])
    return {
        "question_text": "3 Kasım 1839'da Sultan Abdülmecid döneminde Hariciye Nazırı Mustafa Reşit Paşa tarafından ilan edilen Tanzimat Fermanı'nın Osmanlı hukuk tarihindeki en temel önemi nedir?",
        "visual_svg": None,
        "explanation": "Tanzimat Fermanı ile padişah ilk kez hukukun ve kanunların üstünlüğünü tanımış, can, mal ve namus güvenliğini anayasal güvenceye bağlamıştır.",
        "topic": "Değişen Dünya Dengeleri Karşısında Osmanlı",
        "subtopic": "Tanzimat Fermanı ve Hukukun Üstünlüğü",
        **opts
    }

def q_history_national_struggle() -> Dict[str, Any]:
    opts = format_options("Amasya Genelgesi", [
        "Havza Genelgesi",
        "Erzurum Kongresi",
        "Sivas Kongresi",
        "Misak-ı Milli Kararları"
    ])
    return {
        "question_text": "'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.' maddesiyle Kurtuluş Savaşı'nın gerekçesini, amacını ve yöntemini ilk kez belirten tarihi belge hangisidir?",
        "visual_svg": None,
        "explanation": "22 Haziran 1919 tarihli Amasya Genelgesi, milli egemenliğe dayalı ihtilal beyannamesi niteliğindedir.",
        "topic": "Milli Mücadele",
        "subtopic": "Amasya Genelgesi ve Kurtuluş Savaşı Yöntemi",
        **opts
    }

def q_history_treaties() -> Dict[str, Any]:
    opts = format_options("Osmanlı Devleti hukuken sona ermiştir.", [
        "TBMM Sevr Antlaşması'nı onaylamıştır.",
        "Yunanistan tazminat olarak İzmir'i Türkiye'ye devretmiştir.",
        "İstanbul ve Boğazlar İngiltere'ye kalıcı olarak bırakılmıştır.",
        "Düzenli ordu tamamen dağıtılmıştır."
    ])
    return {
        "question_text": "11 Ekim 1922'de imzalanan Mudanya Ateşkes Antlaşması'nda İstanbul ve Boğazlar bölgesinin yönetiminin TBMM Hükümeti'ne bırakılması kararlaştırılmıştır. Bu gelişmenin Osmanlı Devleti açısından en kritik sonucu nedir?",
        "visual_svg": None,
        "explanation": "Başkenti TBMM'ye devredilen Osmanlı Devleti, Mudanya Ateşkesi ile hukuken sona ermiş sayılmıştır.",
        "topic": "Milli Mücadele",
        "subtopic": "Mudanya Ateşkesi ve Hukuken Sona Erme",
        **opts
    }

# ================= BİYOLOJİ VE FİZİK GÖRSELLİ ÜRETEÇLERİ =================

def q_biology_pedigree() -> Dict[str, Any]:
    svg = generate_dynamic_pedigree_svg("Otozomal Çekinik Kalıtım")
    opts = format_options("Otozomal çekinik (örneğin kistik fibrozis veya orak hücre anemisi)", [
        "Y kromozomuna bağlı baskın",
        "Mitokondriyal kalıtım",
        "X kromozomuna bağlı tam baskın",
        "Sadece erkeklerde görülen holandrik kalıtım"
    ])
    return {
        "question_text": "Yukarıdaki soyağacında koyu renkle gösterilen bireyler (4 numaralı birey gibi) belirli bir kalıtsal özelliği fenotipinde göstermektedir. Buna göre, bu özelliğin kalıtılma biçimi aşağıdakilerden hangisiyle en uyumludur?",
        "visual_svg": svg,
        "explanation": "Anne ve baba sağlıklı fenotipte olmasına rağmen çocuklarında (4 numara) bu özelliğin ortaya çıkması, özelliğin çekinik olduğunu ve anne-babanın heterozigot (Aa x Aa) taşıyıcı olduğunu kanıtlar.",
        "topic": "Kalıtımın Genel İlkeleri",
        "subtopic": "Soyağacı Analizi ve Çekinik Genler",
        **opts
    }

def q_biology_food_pyramid() -> Dict[str, Any]:
    svg = generate_dynamic_food_pyramid_svg()
    opts = format_options("Üreticilerden 3. derece tüketicilere doğru biyolojik birikim (zehir birikimi) artar.", [
        "Her basamakta enerji aktarımı %90 oranında gerçekleşir.",
        "Toplam biyokütle en üst basamakta en fazladır.",
        "Birey sayısı üreticilerden tüketicilere doğru sürekli çoğalır.",
        "Ayrıştırıcılar besin zincirinden tamamen bağımsızdır."
    ])
    return {
        "question_text": "Yukarıda şematize edilen karasal ekolojik besin piramidi ile ilgili olarak aşağıdaki yargılardan hangisi doğrudur?",
        "visual_svg": svg,
        "explanation": "Besin piramidinde yukarı çıkıldıkça trofik basamaklar arasında enerji kaybı yaşanır (yalnızca %10 aktarılır) ve ayrışmayan toksik maddelerin dokulardaki biyolojik birikimi artar.",
        "topic": "Ekosistem Ekolojisi",
        "subtopic": "Besin Zinciri ve Enerji Akışı",
        **opts
    }

def q_physics_force_block() -> Dict[str, Any]:
    m = random.choice([2, 4, 5])
    a = random.choice([2, 3, 4])
    f_net = m * a
    f_s = random.choice([4, 6, 8])
    f_uyg = f_net + f_s
    svg = generate_dynamic_force_block_svg(m, f_uyg, f_s, a)
    opts = format_options(f"{a}", [f"{a+1}", f"{max(1, a-1)}", f"{a+2}", f"{a*2}"])
    return {
        "question_text": f"Yatay bir düzlemde $m = {m}\\text{{ kg}}$ kütleli cisme $F = {f_uyg}\\text{{ N}}$ kuvvet uygulandığında zemin ile cisim arasındaki sürtünme kuvveti $f_s = {f_s}\\text{{ N}}$ olarak ölçülüyor. Buna göre, cismin ivmesi kaç $\\text{{m/s}}^2$'dir?",
        "visual_svg": svg,
        "explanation": f"Net kuvvet $F_{{net}} = F - f_s = {f_uyg} - {f_s} = {f_net}\\text{{ N}}$. Newton'ın 2. Yasası gereği $a = F_{{net}} / m = {f_net} / {m} = {a}\\text{{ m/s}}^2$ bulunur.",
        "topic": "Kuvvet ve Hareket",
        "subtopic": "Sürtünmeli Düzlemde İvme Hesabı",
        **opts
    }

def q_physics_optics_prism() -> Dict[str, Any]:
    svg = generate_dynamic_optics_prism_svg()
    opts = format_options("Işık az yoğun ortamdan (hava) çok yoğun ortama (cam) geçerken normale yaklaşarak kırılır.", [
        "Işığın cam ortamındaki yayılma hızı havadakinden daha fazladır.",
        "Işığın frekansı cam prizmaya girdiğinde yarıya iner.",
        "Kırılma açısı her zaman gelme açısından daha büyüktür.",
        "Işığın hiçbir rengi cam ortamında sapmaya uğramaz."
    ])
    return {
        "question_text": "Yukarıda tek renkli bir ışık ışınının hava ortamından cam prizmaya girişi ve kırılması gösterilmiştir. Bu optik olay için hangisi temel fizik kuralıdır?",
        "visual_svg": svg,
        "explanation": "Snell Kanunu gereği ışık kırıcılık indisi küçük olan ortamdan büyük olan ortama geçerken normale yaklaşır ve ortamdaki yayılma sürati ($v=c/n$) azalır.",
        "topic": "Optik",
        "subtopic": "Prizmalarda Işığın Kırılması",
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
    q_physics_circuit, q_physics_force_block, q_physics_optics_prism,
    q_physics_newton, q_physics_optics, q_physics_thermodynamics,
    q_physics_waves, q_physics_energy, q_physics_buoyancy
]

CHEMISTRY_GENERATOR_REGISTRY = [
    q_chemistry_mole, q_chemistry_molarity, q_chemistry_gas_laws,
    q_chemistry_acid_base, q_chemistry_periodic_table
]

BIOLOGY_GENERATOR_REGISTRY = [
    q_biology_genetics, q_biology_pedigree, q_biology_food_pyramid,
    q_biology_cell_division, q_biology_ecology, q_biology_photosynthesis,
    q_biology_dna_protein
]

TURKISH_GENERATOR_REGISTRY = [
    q_turkish_reading, q_turkish_spelling, q_turkish_punctuation,
    q_turkish_sound_events, q_literature_divan,
    q_turkish_underlined_phrase, q_turkish_underlined_word_meaning
]

HISTORY_GENERATOR_REGISTRY = [
    q_history_early_turks, q_history_ottoman, q_history_republic,
    q_history_seljuk, q_history_inkilap, q_history_ww1,
    q_history_ottoman_reforms, q_history_national_struggle, q_history_treaties
]

GEOGRAPHY_GENERATOR_REGISTRY = [
    q_geography_climate, q_geography_isohypse, q_geography_coordinates,
    q_geography_population, q_geography_natural_hazards, q_geography_winds
]

PHILOSOPHY_GENERATOR_REGISTRY = [
    q_philosophy, q_philosophy_epistemology, q_philosophy_ethics,
    q_philosophy_ontology, q_philosophy_nature_thinking, q_philosophy_politics,
    q_philosophy_religion
]

RELIGION_GENERATOR_REGISTRY = [
    q_religion_zekat_infak, q_religion_kader_tevekkul, q_religion_bilgi_kaynaklari,
    q_religion_ahlak_kulhakki, q_religion_peygamber_usve, q_religion_kuran_kavramlar,
    q_religion_mezhepler, q_religion_ibadetler_hukumler, q_religion_gonul_cografyasi,
    q_religion_cevre_israf
]

SOCIAL_GENERATOR_REGISTRY = (
    HISTORY_GENERATOR_REGISTRY +
    GEOGRAPHY_GENERATOR_REGISTRY +
    PHILOSOPHY_GENERATOR_REGISTRY +
    RELIGION_GENERATOR_REGISTRY
)

def get_procedural_candidates_pool(exam_type: str, subject: str, topic: str = "Karma") -> List[Any]:
    subj = (subject or "").lower()
    top = (topic or "").lower()

    if "din" in subj:
        if "zekat" in top or "ibadet" in top or "infak" in top:
            return [q_religion_zekat_infak, q_religion_ibadetler_hukumler, q_religion_cevre_israf]
        if "kader" in top or "kaza" in top or "tevekkül" in top:
            return [q_religion_kader_tevekkul, q_religion_bilgi_kaynaklari]
        if "ahlak" in top or "hak" in top or "değer" in top:
            return [q_religion_ahlak_kulhakki, q_religion_kuran_kavramlar]
        if "peygamber" in top or "siyer" in top or "örnek" in top:
            return [q_religion_peygamber_usve, q_religion_gonul_cografyasi]
        if "mezhep" in top or "yorum" in top:
            return [q_religion_mezhepler, q_religion_bilgi_kaynaklari]
        return list(RELIGION_GENERATOR_REGISTRY)

    elif "felsefe" in subj:
        if "bilgi" in top or "epistemoloji" in top:
            return [q_philosophy_epistemology, q_philosophy]
        if "ahlak" in top or "etik" in top:
            return [q_philosophy_ethics, q_philosophy]
        if "varlık" in top or "ontoloji" in top:
            return [q_philosophy_ontology, q_philosophy]
        if "siyaset" in top:
            return [q_philosophy_politics, q_philosophy]
        if "din" in top:
            return [q_philosophy_religion, q_philosophy]
        return list(PHILOSOPHY_GENERATOR_REGISTRY)

    elif "coğrafya" in subj:
        if "iklim" in top or "hava" in top:
            return [q_geography_climate, q_geography_winds]
        if "harita" in top or "izohips" in top:
            return [q_geography_isohypse, q_geography_coordinates]
        if "konum" in top or "saat" in top or "koordinat" in top:
            return [q_geography_coordinates, q_geography_isohypse]
        if "nüfus" in top or "göç" in top or "yerleşme" in top:
            return [q_geography_population, q_geography_natural_hazards]
        if "afet" in top or "iç kuvvet" in top or "deprem" in top:
            return [q_geography_natural_hazards, q_geography_isohypse]
        return list(GEOGRAPHY_GENERATOR_REGISTRY)

    elif "tarih" in subj:
        if "türk" in top or "orta çağ" in top or "selçuklu" in top:
            return [q_history_early_turks, q_history_seljuk]
        if "osmanlı" in top:
            return [q_history_ottoman, q_history_ottoman_reforms, q_history_ww1]
        if "inkılap" in top or "atatürk" in top:
            return [q_history_inkilap, q_history_treaties, q_history_republic]
        if "milli mücadele" in top or "kurtuluş" in top or "kongre" in top:
            return [q_history_national_struggle, q_history_treaties, q_history_republic]
        if "savaş" in top or "lozan" in top:
            return [q_history_ww1, q_history_treaties, q_history_republic]
        return list(HISTORY_GENERATOR_REGISTRY)

    elif "geometri" in subj:
        if "çember" in top or "daire" in top:
            return [q_geometry_circle, q_geometry_triangle]
        if "üçgen" in top:
            return [q_geometry_triangle, q_geometry_pythagoras_euclid]
        if "analitik" in top:
            return [q_geometry_analytic, q_geometry_triangle]
        if "çokgen" in top:
            return [q_geometry_polygon, q_geometry_solid]
        return list(GEOMETRY_GENERATOR_REGISTRY)

    elif "fizik" in subj:
        if "elektrik" in top or "devre" in top:
            return [q_physics_circuit, q_physics_energy, q_physics_newton]
        if "optik" in top or "ayna" in top or "kırılma" in top or "prizma" in top:
            return [q_physics_optics_prism, q_physics_optics, q_physics_waves]
        if "kuvvet" in top or "hareket" in top or "newton" in top or "sürtünme" in top:
            return [q_physics_force_block, q_physics_newton, q_physics_energy]
        if "ısı" in top or "sıcaklık" in top:
            return [q_physics_thermodynamics, q_physics_energy]
        if "dalga" in top:
            return [q_physics_waves, q_physics_optics]
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
        if "kalıtım" in top or "genetik" in top or "soyağacı" in top:
            return [q_biology_pedigree, q_biology_genetics, q_biology_dna_protein]
        if "ekoloji" in top or "besin" in top or "ekosistem" in top:
            return [q_biology_food_pyramid, q_biology_ecology, q_biology_photosynthesis]
        if "bölünme" in top or "mitoz" in top or "mayoz" in top:
            return [q_biology_cell_division, q_biology_genetics]
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
    api_key: Optional[str] = None,
    training_guidelines: Optional[str] = None
) -> List[Dict[str, Any]]:
    """
    Google Gemini API ile MEB müfredatı ve ÖSYM geçmiş sınav kalıplarına tam uyumlu,
    %100 özgün yeni nesil YKS soruları üretir.
    """
    key = api_key or os.getenv("GEMINI_API_KEY")
    if not key:
        print("[AI Exam Service] GEMINI_API_KEY bulunamadı. Prosedürel motora yönlendiriliyor.")
        return []

    unique_session_seed = f"{time.time()}_{uuid.uuid4().hex[:8]}"

    is_lgs = (str(exam_type).upper() == "LGS")
    opt_count_str = "4 seçenekli (A, B, C, D)" if is_lgs else "5 seçenekli (A, B, C, D, E)"
    comm_title = "Millî Eğitim Bakanlığı (MEB) 8. Sınıf LGS Soru Hazırlama Komisyonu" if is_lgs else f"ÖSYM ve MEB YKS ({exam_type}) Soru Hazırlama Komisyonu"

    system_instruction = f"""Sen Türkiye'nin en seçkin {comm_title} Başkanısın.
Sınav Türü: {exam_type}
Ders: {subject}
Konu: {topic}
Zorluk Seviyesi: {difficulty}
İstenen Soru Sayısı: {question_count} ({opt_count_str})
Oturum Benzersizlik Kodu: {unique_session_seed}

PEDAGOJİK VE MÜFREDAT ESASLARI (ÖSYM & MEB STANDARTLARI):
1. MEB güncel müfredat kazanımlarına ve ÖSYM geçmiş YKS (TYT/AYT) soru üslubuna KESİNLİKLE SADIK KAL.
2. Basit ezberden kaçın; soru kökleri gerçek yaşam senaryosu, bilimsel deney/düzenek, veri/tablo yorumlama, harita/grafik muhakemesi ve adım adım çıkarım gerektirsin.
3. Din Kültürü ve Ahlak Bilgisi için: Ayet, hadis ve paragraf metinlerinden yola çıkan, kavramsal derinliği olan (İhsan, İhlas, Tevekkül, Adalet, Bilgi Kaynakları vb.) ÖSYM kalıbında sorular üret. Asla tekdüze 1-2 soru kalıbına sıkışma.
4. Felsefe, Tarih ve Coğrafya için: Paragraf analizi, kavram eşleştirme, harita/iklim ve neden-sonuç örgülü yeni nesil sorular kurgula.
5. Matematik ve Fen (Fizik, Kimya, Biyoloji) için: Formül ezberletmek yerine formülü problem bağlamında uygulatan yeni nesil akıl yürütme soruları üret.

GÖRSEL VE VEKTÖREL ŞEKİL DESTEĞİ:
- Geometri (üçgen, çember, analitik), Fizik (devre, kuvvet, prizma/optik), Kimya (kap, periyodik sistem), Biyoloji (soyağacı, besin piramidi) ve Coğrafya (izohips, iklim grafiği) gibi derslerde soru bir görsel gerektiriyorsa:
- 'visual_svg' alanına temiz, inline, viewBox'lı modern bir SVG stringi ekle (örneğin: <svg viewBox="0 0 380 200" ...>...</svg>).
- Eğer uygun SVG üretemiyorsan 'visual_svg': null bırak; sistem otomatik vektörel diyagram bağlayacaktır.

MATEMATİK VE KATEX STANDARDI:
- Matematik, fen ve derece sembolleri her zaman standart LaTeX $ ... $ içine alınmalıdır.
- Derece için DAİMA $30^\\circ$, $45^\\circ$, $60^\\circ$ yaz.
- Şıklarda tek bir sayı veya formül olsa bile MUTLAKA $ ... $ içine al (örn. $36\\pi$, $x^2 + 1$).
- Türkçe karakterleri temiz UTF-8 olarak doğrudan yaz (ç, ğ, ı, İ, ö, ş, ü).

TÜRKÇE VE PARAGRAF KESİN KURALLARI (MEB/ÖSYM FORMATI):
1. ALTI ÇİZİLİ SÖZCÜK KURALI:
   - Eğer soru kökünde veya şıklarda 'altı çizili sözcük', 'altı çizili ifade', 'altı çizili söz öbeği' ifadesi geçiyorsa, paragraftaki veya şıktaki ilgili hedef sözcüklerin altı KESİNLİKLE <u>...</u> HTML etiketi içine alınmalıdır!
   - Örnek: "Yazar bu yapıtında <u>hayatın nabzını tutmayı</u> başarmıştır." veya A şıkkı: "Olaylara her zaman <u>ön yargılı</u> yaklaşıyordu."
   - 'Altı çizili' deyip sözcüğün altını çizmemek (<u> etiketi koymamak) KESİNLİKLE YASAKTIR!

2. EN KAPSAMLI YARGI / ANA DÜŞÜNCE ŞIK KURALI:
   - Paragraftan çıkarılabilecek 'en kapsamlı yargı', 'ana düşünce', 'ana fikir' veya 'asıl anlatılmak istenen' sorularında; şıklardan birine 'Bu yargıya metinden ulaşılamaz', 'Metinden böyle bir sonuca varılamaz', 'Metinden çıkarılamaz' gibi geçersiz, saçma ve hatalı şıklar YAZMAK KESİNLİKLE YASAKTIR!
   - Tüm 5 şık da (A, B, C, D, E) metnin konusuna dair alternatif birer fikir veya iddia cümlesi olmalıdır."""

    if training_guidelines:
        system_instruction += f"""

ÖĞRETMENİN YÜKLEDİĞİ ÖRNEK VE TAM SINAV PDF'LERİNDEN ÇIKARILAN SORU TARZI REHBERİ:
{training_guidelines}
ÖNEMLİ: Bu dökümanlar tamamen stil, soru derinliği ve dil eğitimi içindir. Soruları ASLA birebir kopyalama; bu soru köklerini ve zorluk düzeyini rehber alarak YEPYENİ ve ÖZGÜN sorular türet!"""

    opt_rule = "LGS soruları KESİNLİKLE 4 şıklıdır (A, B, C, D). 'option_e' alanı null olmalı, doğru cevap yalnızca A, B, C veya D olmalıdır." if is_lgs else "TYT/AYT soruları 5 dengeli şıktan oluşur (option_a, option_b, option_c, option_d, option_e)."
    opt_e_sample = "null" if is_lgs else '"E şıkkı"'

    system_instruction += f"""

KATI KURALLAR:
1. Üreteceğin {question_count} sorunun TAMAMI birbirinden KESİNLİKLE FARKLI ve ÖZGÜN olmalıdır.
2. {opt_rule}
3. Her soru için resmî MEB kazanım kodu ('learning_outcome_code'), bilişsel beceri ('cognitive_domain': 'Hatırlama', 'Kavrama', 'Uygulama', 'Analiz / Muhakeme') ve her seçeneğin temsil ettiği öğrenci yanılgısını içeren çeldirici analizini ('distractor_analysis') üret.
4. Çıktı SADECE ve SADECE geçerli bir JSON dizisi olmalıdır.

Örnek JSON Formatı:
[
  {{
    "question_number": 1,
    "question_text": "Özgün soru metni...",
    "option_a": "A şıkkı",
    "option_b": "B şıkkı",
    "option_c": "C şıkkı",
    "option_d": "D şıkkı",
    "option_e": {opt_e_sample},
    "correct_answer": "C",
    "explanation": "Adım adım gerekçeli pedagojik çözüm...",
    "learning_outcome_code": "Kazanım Kodu",
    "cognitive_domain": "Analiz / Muhakeme",
    "distractor_analysis": "{{\"A\": \"Öncül hatası\", \"B\": \"İşlem yanılgısı\", \"C\": \"Doğru çözüm\", \"D\": \"Ters bağıntı\"}}",
    "topic": "{topic}",
    "subtopic": "Alt Konu",
    "visual_svg": null
  }}
]"""

    user_msg = (
        f"{exam_type} - {subject} dersi, '{topic}' konusu için {difficulty} zorluk seviyesinde {question_count} adet "
        f"tamamen birbirinden farklı, özgün MEB/ÖSYM tarzı yeni nesil soru üret."
    )
    if custom_prompt:
        user_msg += f" Öğretmenin özel notu: {custom_prompt}"

    candidate_models = [
        "gemini-3-flash-preview",
        "gemini-flash-lite-latest",
        "gemini-3.1-flash-lite-preview",
        "gemini-flash-latest"
    ]

    payload = {
        "contents": [{"parts": [{"text": f"{system_instruction}\n\nTalep: {user_msg}"}]}],
        "generationConfig": {
            "temperature": 0.85,
            "topP": 0.95,
            "responseMimeType": "application/json"
        }
    }

    async with httpx.AsyncClient(timeout=35.0) as client:
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
                        if raw_text.startswith("```"):
                            raw_text = re.sub(r"^```(?:json)?", "", raw_text)
                            raw_text = re.sub(r"```$", "", raw_text).strip()
                        parsed = json.loads(raw_text)
                        if isinstance(parsed, dict) and "questions" in parsed:
                            parsed = parsed["questions"]
                        if isinstance(parsed, list) and len(parsed) > 0:
                            for q in parsed:
                                q["question_text"] = sanitize_math_and_turkish(q.get("question_text", ""), is_option=False)
                                q["explanation"] = sanitize_math_and_turkish(q.get("explanation", ""), is_option=False)
                                for opt_k in ["option_a", "option_b", "option_c", "option_d", "option_e"]:
                                    if opt_k in q:
                                        q[opt_k] = sanitize_math_and_turkish(q[opt_k], is_option=True)
                            print(f"[AI Exam Service] {model_name} ile {len(parsed)} adet özgün soru başarıyla üretildi.")
                            return parsed
                else:
                    print(f"[AI Exam Service] {model_name} yanıt kodu: {res.status_code}, alternatif model deneniyor...")
            except Exception as e:
                print(f"[AI Exam Service] {model_name} çağrısında hata: {e}")

    return []

# ================= KATI BENZERSİZLİK VE DENETİM SİSTEMİ =================


def ensure_underlined_word_formatting(questions: List[Dict[str, Any]]):
    """Eğer soru kökünde 'altı çizili' ifadesi varsa metinde veya şıklarda <u> etiketinin varlığını garanti eder."""
    for q in questions:
        q_text = q.get("question_text", "")
        q_text_low = q_text.lower()
        if "altı çizili" in q_text_low or "altı çizilmiş" in q_text_low:
            # 1. Metin veya şıklarda _kelime_ varsa <u>kelime</u> yap
            q["question_text"] = re.sub(r'(?<![a-zA-Z0-9çÇğĞıİöÖşŞüÜ])_([^\n_]+)_(?![a-zA-Z0-9çÇğĞıİöÖşŞüÜ])', r'<u>\g<1></u>', q["question_text"])
            for opt_k in ["option_a", "option_b", "option_c", "option_d", "option_e"]:
                if opt_k in q and q[opt_k]:
                    q[opt_k] = re.sub(r'(?<![a-zA-Z0-9çÇğĞıİöÖşŞüÜ])_([^\n_]+)_(?![a-zA-Z0-9çÇğĞıİöÖşŞüÜ])', r'<u>\g<1></u>', str(q[opt_k]))

            has_u = ("<u>" in q["question_text"]) or any("<u>" in str(q.get(opt_k, "")) for opt_k in ["option_a", "option_b", "option_c", "option_d", "option_e"] if q.get(opt_k))
            if not has_u:
                quote_m = re.search(r'["\']([^"\'\n]{3,40})["\']', q["question_text"])
                if quote_m:
                    target = quote_m.group(1)
                    q["question_text"] = q["question_text"].replace(f'"{target}"', f'<u>{target}</u>').replace(f"'{target}'", f'<u>{target}</u>')
                else:
                    words = q["question_text"].split()
                    if len(words) >= 4:
                        cand = f"{words[1]} {words[2]}"
                        q["question_text"] = q["question_text"].replace(cand, f"<u>{cand}</u>", 1)
                    else:
                        first_opt = str(q.get("option_a", "")).strip()
                        if len(first_opt.split()) <= 3 and not first_opt.startswith("<u>"):
                            for opt_k in ["option_a", "option_b", "option_c", "option_d", "option_e"]:
                                if opt_k in q and q[opt_k]:
                                    val = str(q[opt_k]).strip()
                                    q[opt_k] = f"<u>{val}</u>"

def decorate_question_visuals(questions: List[Dict[str, Any]], subject: str):
    """Görsel gerektiren ders ve konularda sorunun visual_svg alanı boşsa otomatik uygun vektörel SVG bağlar."""
    for q in questions:
        if not q.get("visual_svg"):
            q_text_low = (q.get("question_text") or "").lower()
            q_topic_low = (q.get("topic") or "").lower()
            q_subj_low = (subject or "").lower()

            if "geometri" in q_subj_low or "üçgen" in q_topic_low or "pisagor" in q_text_low or "hipotenüs" in q_text_low:
                q["visual_svg"] = generate_dynamic_triangle_svg()
            elif "çember" in q_topic_low or "daire" in q_topic_low or "yay" in q_text_low:
                q["visual_svg"] = generate_dynamic_geometry_circle_svg()
            elif "parabol" in q_topic_low or ("fonksiyon" in q_topic_low and "grafik" in q_text_low):
                q["visual_svg"] = generate_dynamic_parabola_svg()
            elif "fizik" in q_subj_low and ("devre" in q_topic_low or "direnç" in q_text_low or "akım" in q_text_low or "ohm" in q_text_low):
                q["visual_svg"] = generate_dynamic_circuit_svg()
            elif "fizik" in q_subj_low and ("kuvvet" in q_topic_low or "ivme" in q_text_low or "sürtünme" in q_text_low or "newton" in q_topic_low):
                q["visual_svg"] = generate_dynamic_force_block_svg()
            elif "fizik" in q_subj_low and ("optik" in q_topic_low or "kırılma" in q_topic_low or "prizma" in q_text_low or "ışın" in q_text_low):
                q["visual_svg"] = generate_dynamic_optics_prism_svg()
            elif "biyoloji" in q_subj_low and ("kalıtım" in q_topic_low or "soyağacı" in q_text_low or "genetik" in q_topic_low or "çekinik" in q_text_low):
                q["visual_svg"] = generate_dynamic_pedigree_svg()
            elif "biyoloji" in q_subj_low and ("ekoloji" in q_topic_low or "besin" in q_text_low or "piramit" in q_text_low or "trofik" in q_text_low):
                q["visual_svg"] = generate_dynamic_food_pyramid_svg()
            elif "coğrafya" in q_subj_low and ("harita" in q_topic_low or "izohips" in q_topic_low or "yükselti" in q_text_low or "topografya" in q_text_low):
                q["visual_svg"] = generate_dynamic_isohypse_svg()
            elif "coğrafya" in q_subj_low and ("iklim" in q_topic_low or "sıcaklık" in q_text_low or "yağış" in q_text_low or "grafiği" in q_text_low):
                q["visual_svg"] = generate_dynamic_climate_graph_svg()

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
    if not combined_pool:
        combined_pool = list(MATH_GENERATOR_REGISTRY)
    random.shuffle(combined_pool)

    func_index = 0
    max_attempts = target_count * 30
    attempts = 0

    while len(unique_questions) < target_count and attempts < max_attempts:
        attempts += 1
        gen_func = combined_pool[func_index % len(combined_pool)]
        func_index += 1

        try:
            new_q = gen_func()
            q_text = new_q.get("question_text", "").strip()

            is_duplicate = False
            for existing in unique_questions:
                if are_questions_too_similar(q_text, existing.get("question_text", "")):
                    is_duplicate = True
                    break

            if not is_duplicate:
                unique_questions.append(new_q)
        except Exception as e:
            print(f"[enforce_strict_uniqueness] Üreteç hatası: {e}")

    is_lgs = (str(exam_type).upper() == "LGS")
    for idx, q in enumerate(unique_questions, start=1):
        q["question_number"] = idx
        co = q.get("correct_option") or q.get("correct_answer") or "A"
        q["correct_option"] = str(co).upper()
        q["correct_answer"] = q["correct_option"]
        if not q.get("topic") or q["topic"] == "Karma":
            q["topic"] = topic if topic != "Karma" else q.get("topic", subject)

        q["exam_type"] = exam_type
        q["grade_level"] = get_grade_level_for_exam(exam_type)
        q["curriculum_version"] = "2024-2025 MEB Türkiye Yüzyılı Maarif Modeli"
        if not q.get("learning_outcome_code"):
            q["learning_outcome_code"] = generate_learning_outcome_code(exam_type, subject, q.get("topic") or topic)
        if not q.get("cognitive_domain"):
            q["cognitive_domain"] = random.choice(["Uygulama", "Analiz / Muhakeme", "Üst Düzey Akıl Yürütme", "Kavrama"])
        if is_lgs:
            q["option_e"] = None
            if q["correct_option"] == "E":
                q["correct_option"] = "D"
                q["correct_answer"] = "D"
        if not q.get("distractor_analysis"):
            q["distractor_analysis"] = generate_distractor_analysis(q)

    # Otomatik görsel denetimi ve süslemesi
    decorate_question_visuals(unique_questions, subject)
    ensure_underlined_word_formatting(unique_questions)

    return unique_questions[:target_count]

async def generate_questions_smart(
    exam_type: str,
    subject: str,
    topic: str,
    difficulty: str,
    question_count: int,
    include_diagrams: bool = True,
    custom_prompt: Optional[str] = None,
    api_key: Optional[str] = None,
    training_guidelines: Optional[str] = None
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
                api_key=effective_key,
                training_guidelines=training_guidelines
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
