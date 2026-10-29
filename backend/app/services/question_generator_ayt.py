# -*- coding: utf-8 -*-
"""
AYT (Alan Yeterlilik Testi) Soru Üretim Motoru (MEB / ÖSYM Standartları - 11-12. Sınıf)
Branşlar:
1. Matematik
2. Fizik
3. Kimya
4. Biyoloji
5. Edebiyat

Standart:
- 5 seçenek (A, B, C, D, E).
- KaTeX formülleri $ ... $ biçiminde.
- Altı çizili sözcüklerde <u>...</u> etiketi zorunlu.
- Şıklarda 'ulaşılamaz' veya yapay meta çeldirici bulunmaz.
- Bilişsel Düzey: Hatırlama, Kavrama, Uygulama, Analiz / Muhakeme.
"""

import random
import math
from typing import Dict, Any, List

def format_ayt_options(correct_text: str, distractors: List[str]) -> Dict[str, Any]:
    """AYT için 5 seçenek (A, B, C, D, E) oluşturur."""
    letters = ["A", "B", "C", "D", "E"]
    corr_idx = random.randint(0, 4)
    clean_dist = [d for d in distractors if "ulaşılamaz" not in str(d).lower()][:4]
    
    fillers = [
        "Metnin biçimsel ve anlamsal özellikleri dönemin genel zihniyetini yansıtır.",
        "Fonksiyonun tanım kümesindeki süreklilik şartı integral hesabında temeldir.",
        "Tepkime mekanizmasındaki yavaş adım hız bağıntısını doğrudan belirler.",
        "Genetik bilginin ribozoma aktarımı kodon-antikodon uyumuna dayanır.",
        "Sistemin açısal momentumu dış tork sıfır olduğunda korunur."
    ]
    f_idx = 0
    while len(clean_dist) < 4:
        cand = fillers[f_idx % len(fillers)]
        f_idx += 1
        if cand not in clean_dist and cand != correct_text:
            clean_dist.append(cand)
            
    random.shuffle(clean_dist)
    
    opts = {}
    d_ptr = 0
    for i, letter in enumerate(letters):
        key = f"option_{letter.lower()}"
        if i == corr_idx:
            opts[key] = correct_text
        else:
            opts[key] = clean_dist[d_ptr]
            d_ptr += 1
            
    opts["correct_option"] = letters[corr_idx]
    return opts


# ================= 1. AYT MATEMATİK =================

def gen_ayt_matematik(index: int) -> Dict[str, Any]:
    archetype = index % 7
    
    if archetype == 0:
        # Türev: Teğetin Eğimi
        x0 = random.choice([1, 2, 3])
        # f(x) = x^3 - 3x + 2 => f'(x) = 3x^2 - 3
        m_slope = 3 * (x0**2) - 3
        q_text = f"$f(x) = x^3 - 3x + 2$ eğrisine $x = {x0}$ apsisli noktasından çizilen teğetin **eğimi kaçtır**?"
        corr = f"${m_slope}$"
        dist = [f"${m_slope + 3}$", f"${m_slope - 2}$", f"${m_slope + 6}$", f"${3 * x0}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Matematik",
            "topic": "Türev",
            "subtopic": "Türevin Geometrik Yorumu ve Teğet Denklemi",
            "learning_outcome_code": "MAT.AYT.4.1",
            "cognitive_domain": "Uygulama",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"$f'(x) = 3x^2 - 3 \\implies m = f'({x0}) = 3({x0})^2 - 3 = {m_slope}$'dir.",
            **opts
        }

    elif archetype == 1:
        # İntegral: Belirli İntegral ve Alan
        b_upper = random.choice([2, 3, 4])
        # int_0^b 3x^2 dx = [x^3]_0^b = b^3
        area = b_upper**3
        q_text = f"$\\int_0^{{{b_upper}}} 3x^2\\,dx$ belirli integralinin değeri kaçtır?"
        corr = f"${area}$"
        dist = [f"${area // 2}$", f"${area + 4}$", f"${3 * b_upper**2}$", f"${b_upper**2}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Matematik",
            "topic": "İntegral",
            "subtopic": "Belirli İntegral Alma ve Alan Hesabı",
            "learning_outcome_code": "MAT.AYT.5.2",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"$\\int 3x^2\\,dx = x^3$. $[x^3]_0^{{{b_upper}}} = {b_upper}^3 - 0 = {area}$.",
            **opts
        }

    elif archetype == 2:
        # Trigonometri: İki Kat Açı Formülleri
        # sin(2x) = 2 sin(x) cos(x)
        q_text = "Bir dar açı olan $x$ için $\\sin(x) = \\frac{3}{5}$ olduğuna göre $\\sin(2x)$ değeri kaçtır?"
        # cos(x) = 4/5 => sin(2x) = 2 * 3/5 * 4/5 = 24/25
        corr = "$\\frac{24}{25}$"
        dist = ["$\\frac{12}{25}$", "$\\frac{7}{25}$", "$\\frac{16}{25}$", "$\\frac{4}{5}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Matematik",
            "topic": "Trigonometri",
            "subtopic": "Yarım Açı ve İki Kat Açı Formülleri",
            "learning_outcome_code": "MAT.AYT.2.3",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "$\\sin(x) = 3/5 \\implies \\cos(x) = 4/5$. $\\sin(2x) = 2\\sin(x)\\cos(x) = 2 \\cdot \\frac{3}{5} \\cdot \\frac{4}{5} = \\frac{24}{25}$.",
            **opts
        }

    elif archetype == 3:
        # Logaritma: Taban Değiştirme
        base = random.choice([2, 3, 5])
        val = base**3
        q_text = f"$\\log_{{{base}}}({val}) + \\log_2(16)$ işleminin sonucu kaçtır?"
        # log_base(val) = 3, log_2(16) = 4 => 3 + 4 = 7
        total = 3 + 4
        corr = f"${total}$"
        dist = [f"${total - 1}$", f"${total + 2}$", f"${12}$", f"${base * 2}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Matematik",
            "topic": "Logaritma",
            "subtopic": "Logaritma Özellikleri",
            "learning_outcome_code": "MAT.AYT.1.4",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"$\\log_{{{base}}}({base}^3) = 3$ ve $\\log_2(2^4) = 4$. Toplam $3 + 4 = 7$'dir.",
            **opts
        }

    elif archetype == 4:
        # Limit ve Süreklilik (0/0 Belirsizliği)
        a_lim = random.choice([2, 3, 4])
        # lim_{x -> a} (x^2 - a^2) / (x - a) = 2a
        lim_val = 2 * a_lim
        q_text = f"$\\lim_{{x \\to {a_lim}}} \\frac{{x^2 - {a_lim**2}}}{{x - {a_lim}}}$ limitinin değeri kaçtır?"
        corr = f"${lim_val}$"
        dist = [f"${lim_val + 2}$", f"${a_lim**2}$", f"${0}$", f"${lim_val - 1}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Matematik",
            "topic": "Limit ve Süreklilik",
            "subtopic": "0/0 Belirsizliği ve Çarpanlara Ayırma",
            "learning_outcome_code": "MAT.AYT.3.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"$\\frac{{(x - {a_lim})(x + {a_lim})}}{{x - {a_lim}}} = x + {a_lim}$. $x \\to {a_lim}$ için ${a_lim} + {a_lim} = {lim_val}$.",
            **opts
        }

    elif archetype == 5:
        # Diziler: Aritmetik ve Geometrik Dizi
        a1 = random.randint(2, 6)
        d = random.randint(3, 7)
        # a_n = a1 + (n - 1) * d
        n_term = 10
        a10 = a1 + 9 * d
        q_text = f"İlk terimi $a_1 = {a1}$ ve ortak farkı $d = {d}$ olan bir aritmetik dizinin **$10$. terimi ($a_{{10}}$) kaçtır**?"
        corr = f"${a10}$"
        dist = [f"${a10 + d}$", f"${a10 - d}$", f"${10 * d}$", f"${a1 * 10}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Matematik",
            "topic": "Diziler",
            "subtopic": "Aritmetik Dizi Genel Terimi",
            "learning_outcome_code": "MAT.AYT.1.5",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"$a_{{10}} = a_1 + 9d = {a1} + 9 \\times {d} = {a10}$.",
            **opts
        }

    else:
        # Parabol ve Ekstremum
        # f(x) = x^2 - 4x + 7 => r = 2, k = 4 - 8 + 7 = 3
        r_val = random.choice([2, 3, 4])
        k_val = random.randint(1, 6)
        # f(x) = x^2 - 2rx + (r^2 + k)
        b_term = 2 * r_val
        c_term = r_val**2 + k_val
        q_text = f"$f(x) = x^2 - {b_term}x + {c_term}$ parabolünün **tepe noktasının ordinatı (en küçük değeri)** kaçtır?"
        corr = f"${k_val}$"
        dist = [f"${r_val}$", f"${k_val + 3}$", f"${c_term}$", f"${k_val - 2}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Matematik",
            "topic": "İkinci Dereceden Fonksiyonlar (Parabol)",
            "subtopic": "Tepe Noktası ve En Büyük / En Küçük Değer",
            "learning_outcome_code": "MAT.AYT.1.2",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"$r = -b / (2a) = {b_term} / 2 = {r_val}$. $k = f({r_val}) = {r_val**2} - {b_term * r_val} + {c_term} = {k_val}$.",
            **opts
        }


# ================= 2. AYT FİZİK =================

def gen_ayt_fizik(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # İki Boyutta Hareket: Yatay Atış
        v0 = random.choice([10, 20, 30])
        h = random.choice([20, 45, 80])
        # h = 1/2 g t^2 (g = 10) => t = sqrt(2h / 10)
        t_sec = int(math.sqrt(2 * h / 10))
        x_range = v0 * t_sec
        q_text = f"Yerden $h = {h}$ metre yüksekliğindeki bir kuleden yatay doğrultuda $v_0 = {v0}\\text{{ m/s}}$ hızla fırlatılan bir cismin **yatayda aldığı menzil yolu ($x$) kaç metredir**? ($g = 10\\text{{ m/s}}^2$ alınız, sürtünmeler önemsizdir.)"
        corr = f"${x_range}\\text{{ m}}$"
        dist = [f"${x_range + 20}\\text{{ m}}$", f"${x_range - 10}\\text{{ m}}$", f"${v0 * 2}\\text{{ m}}$", f"${h}\\text{{ m}}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Fizik",
            "topic": "İki Boyutta Hareket",
            "subtopic": "Yatay Atış ve Menzil Hesabı",
            "learning_outcome_code": "FİZ.AYT.1.2",
            "cognitive_domain": "Uygulama",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"$h = \\frac{{1}}{{2}}gt^2 \\implies {h} = 5t^2 \\implies t = {t_sec}\\text{{ s}}$. Yatayda sabit hızlı hareketten $x = v_0 \\cdot t = {v0} \\times {t_sec} = {x_range}\\text{{ m}}$.",
            **opts
        }

    elif archetype == 1:
        # Çizgisel Momentum Korunumu
        m1 = 2
        v1 = 6
        m2 = 4
        # Esnek olmayan kenetlenme: m1*v1 = (m1 + m2) * v_ort => 12 = 6 * v_ort => v_ort = 2
        q_text = f"Sürtünmesiz yatay düzlemde $v_1 = {v1}\\text{{ m/s}}$ hızla hareket eden $m_1 = {m1}$ kg kütleli cisim, durmakta olan $m_2 = {m2}$ kg kütleli cisme çarparak kenetlenmektedir.\n\nBuna göre cisimlerin çarpışma sonrasındaki **ortak hızı kaç $\\text{{m/s}}$ olur**?"
        corr = "$2\\text{ m/s}$"
        dist = ["$3\\text{ m/s}$", "$1\\text{ m/s}$", "$4\\text{ m/s}$", "$1.5\\text{ m/s}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Fizik",
            "topic": "İtme ve Momentum",
            "subtopic": "Tam Esnek Olmayan Çarpışmalar",
            "learning_outcome_code": "FİZ.AYT.1.4",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "$P_{ilk} = P_{son} \\implies m_1 v_1 + 0 = (m_1 + m_2) v_{ort} \\implies 2 \\times 6 = 6 \\times v_{ort} \\implies v_{ort} = 2\\text{ m/s}$.",
            **opts
        }

    elif archetype == 2:
        # Düzgün Çembersel Hareket: Merkezcil İvme
        r_rad = random.choice([2, 4, 5])
        v_speed = random.choice([4, 6, 10])
        a_cent = (v_speed**2) // r_rad
        q_text = f"Yarıçapı $r = {r_rad}$ metre olan çembersel yörüngede $v = {v_speed}\\text{{ m/s}}$ büyüklüğünde sabit çizgisel süratle dönen bir cismin **merkezcil ivmesi kaç $\\text{{m/s}}^2$'dir**?"
        corr = f"${a_cent}\\text{{ m/s}}^2$"
        dist = [f"${a_cent + 4}\\text{{ m/s}}^2$", f"${a_cent // 2}\\text{{ m/s}}^2$", f"${v_speed * r_rad}\\text{{ m/s}}^2$", f"${2 * a_cent}\\text{{ m/s}}^2$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Fizik",
            "topic": "Çembersel Hareket",
            "subtopic": "Merkezcil İvme ve Kuvvet",
            "learning_outcome_code": "FİZ.AYT.2.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"$a = \\frac{{v^2}}{{r}} = \\frac{{{v_speed}^2}}{{{r_rad}}} = {a_cent}\\text{{ m/s}}^2$.",
            **opts
        }

    elif archetype == 3:
        # Elektromanyetik İndüksiyon ve Faraday Kanunu
        q_text = "Bir iletken çerçeveden geçen manyetik akı ($\\Phi$) zamanla değiştiğinde devrede bir indüksiyon elektromotor kuvveti (emk) oluşur.\n\nBuna göre indüksiyon akımının yönünü ve büyüklüğünü belirleyen temel fizik yasaları hangileridir?"
        corr = "Faraday İndüksiyon Kanunu ve Lenz Kanunu"
        dist = [
            "Coulomb Kanunu ve Gauss Yasası",
            "Newton'ın Çekim Kanunu ve Kepler Yasaları",
            "Ohm Yasası ve Joule Kanunu",
            "Snell Kırılma Yasası ve Huygens Prensibi"
        ]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Fizik",
            "topic": "Elektrik ve Manyetizma",
            "subtopic": "Manyetik Akı ve İndüksiyon Akımı",
            "learning_outcome_code": "FİZ.AYT.3.3",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Faraday emk büyüklüğünü ($\\varepsilon = -\\Delta \\Phi / \\Delta t$), Lenz ise oluşan akımın kendini doğuran nedene karşı koyacak yönde olduğunu açıklar.",
            **opts
        }

    else:
        # Fotoelektrik Olay (Modern Fizik)
        q_text = "Bir fotosel lambanın katoduna düşürülen fotonların enerjisi $E_{foton} = 6\\text{ eV}$ ve metalin bağlanma enerjisi (iş fonksiyonu) $E_0 = 4\\text{ eV}$'dir.\n\nBuna göre sökülen fotoelektronların **maksimum kinetik enerjisi kaç eV'dir**?"
        # Ek = E_foton - E0 = 6 - 4 = 2 eV
        corr = "$2\\text{ eV}$"
        dist = ["$10\\text{ eV}$", "$4\\text{ eV}$", "$1.5\\text{ eV}$", "$8\\text{ eV}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Fizik",
            "topic": "Modern Fizik",
            "subtopic": "Fotoelektrik Denklem ve Kinetik Enerji",
            "learning_outcome_code": "FİZ.AYT.5.1",
            "cognitive_domain": "Uygulama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Einstein fotoelektrik denklemine göre $E_{foton} = E_0 + E_k \\implies 6 = 4 + E_k \\implies E_k = 2\\text{ eV}$.",
            **opts
        }


# ================= 3. AYT KİMYA =================

def gen_ayt_kimya(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # Gazlar: İdeal Gaz Yasası
        # P * V = n * R * T
        q_text = "Sürtünmesiz ideal pistonlu bir kapta bulunan bir miktar gazın mutlak sıcaklığı $2$ katına çıkarılırken hacmi sabit tutulursa gaz basıncı nasıl değişir?"
        corr = "2 katına çıkar"
        dist = ["Yarıya iner", "Değişmez", "4 katına çıkar", "Sıcaklığa bağlı olarak azalır"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Kimya",
            "topic": "Gazlar",
            "subtopic": "İdeal Gaz Yasası ve Değişkenler",
            "learning_outcome_code": "KİM.AYT.1.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Gay-Lussac yasasına göre hacim ve mol sayısı sabitken basınç mutlak sıcaklıkla doğru orantılıdır ($P_1/T_1 = P_2/T_2$).",
            **opts
        }

    elif archetype == 1:
        # Sıvı Çözeltiler ve Molarite
        # M = n / V
        m_sol = random.choice([0.2, 0.5, 1.0, 2.0])
        v_lit = random.choice([0.5, 1.0, 2.0])
        n_mol = m_sol * v_lit
        q_text = f"${m_sol}\\text{{ M}}$ derişimli bir çözelti hazırlamak için ${v_lit}\\text{{ L}}$ hacminde çözücüye **kaç mol çözünen madde** eklenmelidir?"
        corr = f"${n_mol:.2f}\\text{{ mol}}$" if n_mol % 1 != 0 else f"${int(n_mol)}\\text{{ mol}}$"
        dist = [f"${n_mol + 0.5:.2f}\\text{{ mol}}$", f"${m_sol / v_lit:.2f}\\text{{ mol}}$", f"${n_mol * 2:.2f}\\text{{ mol}}$", f"${1.0}\\text{{ mol}}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Kimya",
            "topic": "Sıvı Çözeltiler ve Çözünürlük",
            "subtopic": "Molarite ve Derişim Hesapları",
            "learning_outcome_code": "KİM.AYT.2.1",
            "cognitive_domain": "Uygulama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"$M = \\frac{{n}}{{V}} \\implies n = M \\times V = {m_sol} \\times {v_lit} = {n_mol}\\text{{ mol}}$.",
            **opts
        }

    elif archetype == 2:
        # Kimyasal Denge: Le Chatelier İlkesi
        q_text = "Ekzotermik olan bir denge tepkimesinde;\n$N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g) + \\text{Isı}$\n\nSıcaklık artırıldığında denge yönü ve denge sabiti ($K_c$) nasıl değişir?"
        corr = "Denge girenler (sol) yönüne kayar ve $K_c$ değeri azalır."
        dist = [
            "Denge ürünler (sağ) yönüne kayar ve $K_c$ artar.",
            "Denge girenler yönüne kayar fakat $K_c$ değişmez.",
            "Denge yönü değişmez, yalnızca tepkime hızı artar.",
            "Denge ürünler yönüne kayar fakat $K_c$ azalır."
        ]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Kimya",
            "topic": "Kimyasal Denge",
            "subtopic": "Le Chatelier İlkesi ve Sıcaklık Etkisi",
            "learning_outcome_code": "KİM.AYT.3.3",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Ekzotermik tepkimelerde sıcaklık artışı dengeyi girenler lehine bozar; ürün derişimi azalacağından $K_c$ düşer.",
            **opts
        }

    elif archetype == 3:
        # Elektrokimya ve Galvanik Piller
        # Standart Pil Potansiyeli
        e_zn = -0.76  # Zn -> Zn2+ + 2e (yükseltgenme: +0.76)
        e_cu = 0.34   # Cu2+ + 2e -> Cu (indirgenme: +0.34)
        e_pil = 0.76 + 0.34 # 1.10 V
        q_text = "Standart Daniel pilinde;\n$Zn^{2+} + 2e^- \\to Zn \\quad (E^\\circ = -0.76\\text{ V})$\n$Cu^{2+} + 2e^- \\to Cu \\quad (E^\\circ = +0.34\\text{ V})$\n\nyarı tepkimeleri verildiğine göre pilin **standart potansiyeli ($E^\\circ_{pil}$) kaç Volt'tur**?"
        corr = f"${e_pil:.2f}\\text{{ V}}$"
        dist = ["$0.42\\text{ V}$", "$-1.10\\text{ V}$", "$1.52\\text{ V}$", "$0.76\\text{ V}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Kimya",
            "topic": "Kimya ve Elektrik",
            "subtopic": "Galvanik Piller ve Standart Potansiyel",
            "learning_outcome_code": "KİM.AYT.4.2",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Zn anottur ($E^\\circ_{{yüks}} = +0.76\\text{{ V}}$), Cu katottur ($E^\\circ_{{ind}} = +0.34\\text{{ V}}$). $E^\\circ_{{pil}} = 0.76 + 0.34 = 1.10\\text{{ V}}$.",
            **opts
        }

    else:
        # Organik Kimya: Fonksiyonel Gruplar
        groups = [
            ("Alkol", "$-OH$ (Hidroksil)", "Eter", "Aldehit", "Keton", "Ester"),
            ("Karboksilik Asit", "$-COOH$ (Karboksil)", "Amin", "Amit", "Alkin", "Alken"),
            ("Aldehit", "$-CHO$ (Karbonil + H)", "Keton", "Alkol", "Eter", "Haloalkan")
        ]
        g = groups[index % len(groups)]
        q_text = f"Organik bileşiklerde **{g[0]}** sınıfını karakterize eden fonksiyonel grup aşağıdakilerden hangisidir?"
        corr = g[1]
        dist = [g[2], g[3], g[4], g[5]]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Kimya",
            "topic": "Organik Kimya",
            "subtopic": "Fonksiyonel Gruplar",
            "learning_outcome_code": "KİM.AYT.5.3",
            "cognitive_domain": "Hatırlama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"{g[0]} bileşikleri {g[1]} grubunu taşır.",
            **opts
        }


# ================= 4. AYT BİYOLOJİ =================

def gen_ayt_biyoloji(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # İnsan Fizyolojisi: Sinir Sistemi ve İmpuls İletimi
        q_text = "Bir nöronda impuls iletimi sırasında akson zarı boyunca sırasıyla gerçekleşen elektriksel ve kimyasal evreler hangisinde doğru verilmiştir?"
        corr = "Polarizasyon (Dinlenme) $\\to$ Depolarizasyon (Aksiyon Potansiyeli) $\\to$ Repolarizasyon"
        dist = [
            "Depolarizasyon $\\to$ Hiperpolarizasyon $\\to$ Polarizasyon",
            "Repolarizasyon $\\to$ Depolarizasyon $\\to$ Sinaps",
            "Miyelinleşme $\\to$ Ranvier Düğümü $\\to$ Polarizasyon",
            "Endositoz $\\to$ Ekzositoz $\\to$ Repolarizasyon"
        ]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Biyoloji",
            "topic": "İnsan Fizyolojisi",
            "subtopic": "Sinir Sistemi ve İmpuls İletim Mekanizması",
            "learning_outcome_code": "BİY.AYT.1.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Hücre zarında $Na^+/K^+$ pompası ve voltaj kapılı kanallarla iletim polarizasyon, depolarizasyon ve repolarizasyon sırasıyla yürür.",
            **opts
        }

    elif archetype == 1:
        # Dolaşım Sistemi ve Kan Basıncı
        q_text = "İnsan kalbinde sol karıncığın kasılmasıyla oksijence zengin kanı tüm vücuda pompalayan en büyük atardamar aşağıdakilerden hangisidir?"
        corr = "Aort Atardamarı"
        dist = ["Akciğer Atardamarı", "Üst Ana Toplardamar", "Kapı Toplardamarı", "Koroner Toplardamar"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Biyoloji",
            "topic": "İnsan Fizyolojisi",
            "subtopic": "Dolaşım Sistemi ve Kalbin Yapısı",
            "learning_outcome_code": "BİY.AYT.1.4",
            "cognitive_domain": "Hatırlama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Sol karıncıktan çıkan Aort, temiz kanı tüm doku ve organlara ulaştırır.",
            **opts
        }

    elif archetype == 2:
        # Protein Sentezi ve Santral Dogma
        q_text = "Hücrede DNA'daki genetik şifrenin mRNA'ya aktarılması (**Transkripsiyon**) ve mRNA'daki kodonların ribozomda okunarak polipeptit zincirinin oluşturulması (**Translasyon**) süreçleriyle ilgili;\nI. Transkripsiyon ökaryotlarda çekirdekte gerçekleşir.\nII. Translasyon tüm canlılarda ribozom organelinde gerçekleşir.\nIII. Her kodon birden fazla amino asidi şifreleyebilir.\n\nyargılarından hangileri **doğrudur**?"
        corr = "I ve II"
        dist = ["Yalnız I", "I ve III", "II ve III", "I, II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Biyoloji",
            "topic": "Genden Proteine",
            "subtopic": "Transkripsiyon ve Translasyon",
            "learning_outcome_code": "BİY.AYT.2.2",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Her kodon sadece tek bir amino asidi şifreler (III yanlıştır). I ve II doğrudur.",
            **opts
        }

    elif archetype == 3:
        # Fotosentez ve Kemosentez
        q_text = "Bitkilerde fotosentezin ışığa bağımlı reaksiyonlarında suyun parçalanması (**fotoliz**) sonucunda açığa çıkan ürünler hangileridir?"
        corr = "Elektron ($e^-$), Proton ($H^+$) ve Atmosfere verilen $O_2$ gazı"
        dist = [
            "Glikoz, ATP ve $CO_2$",
            "Yalnızca NADPH ve $CO_2$",
            "Pirüvat ve Laktik asit",
            "Amino asit ve Yağ asitleri"
        ]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Biyoloji",
            "topic": "Canlılarda Enerji Dönüşümleri",
            "subtopic": "Fotosentez ve Suyun Fotolizi",
            "learning_outcome_code": "BİY.AYT.3.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Suyun fotoliziyle ($H_2O \\to 2H^+ + 2e^- + \\frac{1}{2}O_2$) atmosfere oksijen verilir, elektronlar klorofile aktarılır.",
            **opts
        }

    else:
        # Bitki Biyolojisi: İletim Dokuları
        q_text = "Odunsu bir bitkide köklerden alınan su ve inorganik mineralleri yapraklara doğru tek yönlü taşıyan **cansız iletim dokusu** hangisidir?"
        corr = "Ksilem (Odun Boruları)"
        dist = ["Floem (Soymuk Boruları)", "Kambiyum", "Kollenkima (Pek Doku)", "Sklerenkima (Sert Doku)"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Biyoloji",
            "topic": "Bitki Biyolojisi",
            "subtopic": "Bitkisel Dokular ve Madde Taşınması",
            "learning_outcome_code": "BİY.AYT.4.2",
            "cognitive_domain": "Hatırlama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Su ve mineral iletimi cansız olan Ksilem borularıyla kılcallık, kök basıncı ve terleme-çekim gücüyle gerçekleşir.",
            **opts
        }


# ================= 5. AYT EDEBİYAT =================

def gen_ayt_edebiyat(index: int) -> Dict[str, Any]:
    archetype = index % 6
    
    if archetype == 0:
        # Divan Edebiyatı: Nazım Şekilleri ve Şairler
        poets = [
            ("Fuzuli", "16. yüzyılın en büyük şairi; 'Leyla vü Mecnun' mesnevisi, 'Su Kasidesi' ve 'Şikayetname' eserleriyle tanınır."),
            ("Baki", "16. yüzyıl 'Sultanü'ş-Şuara' unvanlı şairi; 'Kanuni Mersiyesi' ve rindane gazelleriyle meşhurdur."),
            ("Nedim", "18. yüzyıl Lale Devri şairi; şarkı nazım şeklinin ustası olup İstanbul Türkçesini ve mahallileşme akımını başarıyla uygulamıştır."),
            ("Şeyh Galip", "18. yüzyıl son büyük divan şairi; Sebk-i Hindi akımının temsilcisi ve 'Hüsn ü Aşk' mesnevisinin yazarıdır.")
        ]
        p = poets[index % len(poets)]
        q_text = f"\"{p[1]}\"\n\nYukarıda özellikleri ve başlıca eserleri tanıtılan **divan edebiyatı şairi** aşağıdakilerden hangisidir?"
        corr = p[0]
        dist = [pt[0] for pt in poets if pt[0] != p[0]]
        dist.append("Nabi")
        opts = format_ayt_options(corr, dist[:4])
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Edebiyat",
            "topic": "Divan Edebiyatı",
            "subtopic": "Divan Şairleri ve Eserleri",
            "learning_outcome_code": "EDB.AYT.2.3",
            "cognitive_domain": "Hatırlama / Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Verilen edebi özellikler ve şaheserler {p[0]}'ye aittir.",
            **opts
        }

    elif archetype == 1:
        # Tanzimat Edebiyatı
        authors = [
            ("Namık Kemal", "Vatan ve hürriyet şairi; ilk edebi roman 'İntibah', ilk tarihi roman 'Cezmi' ve sahnelenen ilk tiyatro 'Vatan yahut Silistre'nin yazarıdır."),
            ("Şinasi", "Tanzimat edebiyatının öncüsü; ilk tiyatro eseri 'Şair Evlenmesi' ve ilk özel gazete 'Tercüman-ı Ahval'i çıkarmıştır."),
            ("Recaizade Mahmut Ekrem", "II. Dönem Tanzimatçısı; 'Zemzeme' önsözüyle yeni edebiyatı savunmuş, ilk realist romanımız 'Araba Sevdası'nı yazmıştır.")
        ]
        a = authors[index % len(authors)]
        q_text = f"\"{a[1]}\"\n\nBu parçada tanıtılan **Tanzimat Dönemi yazarı** aşağıdakilerden hangisidir?"
        corr = a[0]
        dist = [au[0] for au in authors if au[0] != a[0]]
        dist.extend(["Ziya Paşa", "Ahmet Mithat Efendi"])
        opts = format_ayt_options(corr, dist[:4])
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Edebiyat",
            "topic": "Tanzimat Edebiyatı",
            "subtopic": "Tanzimat Dönemi Yazar ve Eserleri",
            "learning_outcome_code": "EDB.AYT.3.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Tanıtılan yazar: {a[0]}",
            **opts
        }

    elif archetype == 2:
        # Millî Edebiyat ve Genç Kalemler
        q_text = "1911 yılında Selanik'te çıkarılan **Genç Kalemler** dergisinde yayımlanan ve Ömer Seyfettin tarafından kaleme alınan \"Yeni Lisan\" makalesinin temel amacı nedir?"
        corr = "Türkçeyi Arapça ve Farsça kurallardan arındırarak İstanbul halkının konuştuğu sade dille eserler üretmek"
        dist = [
            "Batı dillerinden alınan yeni terimleri edebiyata aynen aktarmak",
            "Aruz ölçüsünü tüm edebi türlerde zorunlu kılmak",
            "Yalnızca divan edebiyatı nazım biçimlerini modernize etmek",
            "Edebiyatı sadece aydın zümrenin anlayabileceği soyut bir alana çekmek"
        ]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Edebiyat",
            "topic": "Millî Edebiyat Dönemi",
            "subtopic": "Yeni Lisan Hareketi ve Dil Anlayışı",
            "learning_outcome_code": "EDB.AYT.4.1",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Yeni Lisan Hareketi, Millî Edebiyat'ın dil devrimidir; halkın konuştuğu yaşayan Türkçeyi edebiyat dili yapmıştır.",
            **opts
        }

    elif archetype == 3:
        # Cumhuriyet Dönemi Şiir Akımları: Garip Akımı (I. Yeni)
        q_text = "Orhan Veli Kanık, Melih Cevdet Anday ve Oktay Rifat Horozcu'nun başlattığı **Garip Akımı (I. Yeni)** ile ilgili aşağıdakilerden hangisi **söylenemez**?"
        corr = "Aruz ölçüsü, kafiye, redif ve edebi sanatları şiirin vazgeçilmez temel unsuru olarak görmüşlerdir."
        dist = [
            "Şiirde her türlü kalıba, şairaneliğe ve edebi sanatlara karşı çıkmışlardır.",
            "Sıradan insanları, günlük küçük olayları sade ve mizahi bir dille şiire taşımışlardır.",
            "Serbest nazmı savunmuşlar ve sokaktaki konuşma dilini kullanmışlardır.",
            "Şiirin sadece zengin elit zümreye değil, halkın tamamına hitap etmesi gerektiğini savunmuşlardır."
        ]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Edebiyat",
            "topic": "Cumhuriyet Dönemi Türk Şiiri",
            "subtopic": "Garip Akımı (I. Yeni)",
            "learning_outcome_code": "EDB.AYT.5.2",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Garipçiler ölçü, uyak ve edebi sanatları reddederek şiiri şairanelikten kurtarmışlardır.",
            **opts
        }

    elif archetype == 4:
        # Batı Edebiyatı Akımları: Realizm ve Romantizm
        currents = [
            ("Realizm (Gerçekçilik)", "Olayları, insanları ve toplumu olduğu gibi, gözlem ve belgelere dayanarak tarafsız bir dille aktarma ilkesidir (Balzac, Stendhal, Flaubert, Tolstoy)."),
            ("Romantizm (Coşumculuk)", "Akla ve kurallara karşı duyguyu, hayali ve coşkuyu yücelten, iyi-kötü çatışmasını işleyen akımdır (Victor Hugo, Goethe, Rousseau)."),
            ("Natüralizm (Doğalcılık)", "Realizmi ileriye taşıyarak determinizm ve soyaçekim ilkelerini deneysel roman anlayışıyla birleştiren akımdır (Emile Zola).")
        ]
        c = currents[index % len(currents)]
        q_text = f"\"{c[1]}\"\n\nBu parçada özellikleri belirtilen **edebi akım** aşağıdakilerden hangisidir?"
        corr = c[0].split(" (")[0]
        dist = ["Klasisizm", "Parnasizm", "Sembolizm", "Sürrealizm"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Edebiyat",
            "topic": "Edebi Akımlar",
            "subtopic": "Batı Edebiyatı Akımları",
            "learning_outcome_code": "EDB.AYT.1.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Verilen açıklama doğrudan {c[0]} akımının temel nitelikleridir.",
            **opts
        }

    else:
        # Şiir Bilgisi ve Edebi Sanatlar
        arts = [
            ("Kişileştirme (Teşhis)", "İnsana ait özelliklerin insan dışındaki canlı veya cansız varlıklara aktarılmasıdır."),
            ("Tezat (Karşıtlık)", "Birbirine zıt duygu, düşünce veya kavramların bir arada kullanılmasıdır."),
            ("Hüsn-i Talil (Güzel Neden Bulma)", "Bir olayın gerçek sebebini bırakıp onu şairane ve güzel bir nedene bağlamaktır.")
        ]
        ar = arts[index % len(arts)]
        q_text = f"\"{ar[1]}\"\n\nTanımı verilen **edebi sanat** aşağıdakilerden hangisidir?"
        corr = ar[0].split(" (")[0]
        dist = ["İstiare (Eğretileme)", "Mecazımürsel", "Telmih (Hatırlatma)", "Tecahülüarif"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT",
            "grade_level": "11-12. Sınıf",
            "subject": "Edebiyat",
            "topic": "Şiir Bilgisi",
            "subtopic": "Edebi Sanatlar",
            "learning_outcome_code": "EDB.AYT.1.1",
            "cognitive_domain": "Hatırlama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Verilen tanım doğrudan {ar[0]} sanatına aittir.",
            **opts
        }


# ================= ANA AYT SÖZLÜĞÜ VE ÜRETİCİ =================

AYT_DISPATCHER = {
    "Matematik": gen_ayt_matematik,
    "Fizik": gen_ayt_fizik,
    "Kimya": gen_ayt_kimya,
    "Biyoloji": gen_ayt_biyoloji,
    "Edebiyat": gen_ayt_edebiyat,
}

def generate_ayt_question(subject: str, index: int) -> Dict[str, Any]:
    func = AYT_DISPATCHER.get(subject, gen_ayt_matematik)
    return func(index)
