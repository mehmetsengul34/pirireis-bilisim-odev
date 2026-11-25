# -*- coding: utf-8 -*-
"""
AYT (Alan Yeterlilik Testi) Yeni Nesil Beceri Temelli Soru Üretim Motoru (MEB Maarif Modeli & ÖSYM 11-12. Sınıf Standartları)
Branşlar:
1. Matematik
2. Geometri
3. Fizik
4. Kimya
5. Biyoloji
6. Edebiyat / Türk Dili ve Edebiyatı
7. Tarih-1
8. Coğrafya-1

Standart:
- 5 seçenek (A, B, C, D, E).
- Çok adımlı analitik muhakeme, gerçek yaşam modellemeleri, öncüllü (I, II, III) çıkarımlar.
- KaTeX formülleri $ ... $ biçiminde.
"""

import random
import math
from typing import Dict, Any, List


def format_ayt_options(correct_text: str, distractors: List[str]) -> Dict[str, Any]:
    """AYT için 5 seçenek (A, B, C, D, E) oluşturur."""
    letters = ["A", "B", "C", "D", "E"]
    corr_idx = random.randint(0, 4)
    clean_dist = [d for d in distractors if "ulaşılamaz" not in str(d).lower() and d != correct_text][:4]

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
    opts["correct_answer"] = letters[corr_idx]
    return opts


# ================= 1. AYT MATEMATİK (ÖSYM YENİ NESİL MODELLEME & ANALİZ) =================

def gen_ayt_matematik(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import generate_dynamic_parabola_svg
    if index is None:
        index = random.randint(0, 999)
    top_low = str(topic or "").lower()

    if "türev" in top_low or "maksimum" in top_low:
        archetype = 0
    elif "integral" in top_low:
        archetype = 1
    elif "parabol" in top_low or "ikinci derece" in top_low:
        archetype = 2
    elif "logaritma" in top_low or "üstel" in top_low:
        archetype = 3
    elif "trigonometri" in top_low:
        archetype = 4
    elif "limit" in top_low or "süreklilik" in top_low:
        archetype = 5
    elif "dizi" in top_low or "polinom" in top_low:
        archetype = 6
    else:
        archetype = index % 7

    if archetype == 0:
        # Yeni Nesil Türev: Maksimum-Minimum Optimizasyonu ve Teğet Geometrik Yorumu
        p_fence = random.choice([120, 160, 200, 240])
        # Bir kenarı nehir olan dikdörtgen bahçenin 3 kenarına toplam p_fence metre çit çekiliyor:
        # 2x + y = p_fence => Alan A(x) = x * (p_fence - 2x) = p_fence*x - 2x^2
        # A'(x) = p_fence - 4x = 0 => x = p_fence / 4, y = p_fence / 2
        x_opt = p_fence // 4
        y_opt = p_fence // 2
        max_area = x_opt * y_opt

        q_text = (
            f"Bir kenarı doğrusal bir nehir kıyısında bulunan dikdörtgen biçimindeki bir tarım arazisinin, nehir kıyısı hariç diğer **üç kenarına** toplam **${p_fence}\\text{{ metre}}$** uzunluğunda tel çit çekilecektir.\n\n"
            f"Arazinin alanını $x$ (nehre dik kenar uzunluğu) cinsinden modelleyen $A(x) = {p_fence}x - 2x^2$ fonksiyonunun türevi alındığında;\n"
            f"I. Arazinin alanının en büyük olması için nehre dik kenarlardan birinin uzunluğu **$x = {x_opt}\\text{{ m}}$** olmalıdır.\n"
            f"II. Nehre paralel olan uzun kenarın uzunluğu **$y = {y_opt}\\text{{ m}}$** olduğunda maksimum alana ulaşılır.\n"
            f"III. Çitle çevrilebilecek bu arazinin **en büyük alanı ${max_area}\\text{{ m}}^2$**'dir.\n\n"
            f"ifadelerinden hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Matematik",
            "topic": "Türev (Türevin Anlamı, Geometrik Yorum, Ekstremum Noktalar, Artan-Azalanlık)",
            "subtopic": "Türev ile Maksimum-Minimum Optimizasyon Problemleri",
            "learning_outcome_code": "MAT.AYT.5.3", "cognitive_domain": "Üst Düzey Akıl Yürütme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Çevre bağıntısı $2x + y = {p_fence} \\implies y = {p_fence} - 2x$. Alan fonksiyonu $A(x) = x({p_fence} - 2x) = {p_fence}x - 2x^2$. "
                f"Türev sıfıra eşitlenirse: $A'(x) = {p_fence} - 4x = 0 \\implies x = {x_opt}\\text{{ m}}$ (I doğru) ve $y = {y_opt}\\text{{ m}}$ (II doğru). "
                f"Maksimum alan $= {x_opt} \\times {y_opt} = {max_area}\\text{{ m}}^2$ (III doğru)."
            ),
            **opts
        }

    elif archetype == 1:
        # Yeni Nesil Belirli İntegral: Hız-Zaman Grafiğinden Konum ve Eğriler Arası Alan
        t_end = random.choice([3, 4, 6])
        k_acc = random.choice([3, 6])
        # v(t) = k_acc * t^2 + 4t => x = int_0^t_end (k_acc*t^2 + 4t) dt = (k_acc/3)*t_end^3 + 2*t_end^2
        disp = (k_acc // 3) * (t_end ** 3) + 2 * (t_end ** 2)

        q_text = (
            f"Doğrusal bir ray üzerinde durgun halden harekete geçen manyetik raylı (Maglev) bir trenin zamana ($t$, saniye) bağlı anlık hız fonksiyonu;\n"
            f"$$v(t) = {k_acc}t^2 + 4t\\quad (\\text{{m/s}})$$\n"
            f"olarak modellenmiştir.\n\n"
            f"Buna göre trenin harekete başladığı **$t = 0$ anından $t = {t_end}$. saniyenin sonuna kadar** aldığı toplam yol ($\\int_0^{{{t_end}}} v(t)\\,dt$) **kaç metredir**?"
        )
        corr = f"${disp}$"
        dist = [
            f"${disp + 12}$",
            f"${k_acc * (t_end**2) + 4 * t_end}$",
            f"${disp - 8}$",
            f"${(k_acc // 3) * (t_end**3)}$"
        ]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Matematik",
            "topic": "İntegral (Belirsiz İntegral, Belirli İntegral ve Alan Hesabı)",
            "subtopic": "Belirli İntegralin Fiziksel Yorumu ve Alan Hesabı",
            "learning_outcome_code": "MAT.AYT.6.3", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Alınan yol hız fonksiyonunun belirli integralidir: "
                f"$\\int_0^{{{t_end}}} ({k_acc}t^2 + 4t)\\,dt = \\left[ {k_acc // 3}t^3 + 2t^2 \\right]_0^{{{t_end}}} = "
                f"{k_acc // 3}({t_end})^3 + 2({t_end})^2 = {(k_acc // 3) * (t_end**3)} + {2 * (t_end**2)} = {disp}\\text{{ metre}}$."
            ),
            **opts
        }

    elif archetype == 2:
        # Yeni Nesil Parabol: Köprü Kemeri / Su Fıskiyesi Yörüngesi (SVG'li)
        r_top = random.choice([3, 4, 5])
        k_top = random.choice([16, 20, 25])
        # f(x) = -(x - r)^2 + k = -x^2 + 2rx + (k - r^2)
        b_coef = 2 * r_top
        c_coef = k_top - (r_top ** 2)
        svg = generate_dynamic_parabola_svg(-1, b_coef, c_coef, float(r_top), float(k_top))

        q_text = (
            f"Bir botanik parkındaki dekoratif su fıskiyesinden fışkıran suyun izlediği parabolik yörünge, yatay uzaklık $x$ (metre) ve yerden yükseklik $f(x)$ (metre) olmak üzere;\n"
            f"$$f(x) = -x^2 + {b_coef}x + ({c_coef})$$\n"
            f"fonksiyonu ile modellenmiştir.\n\n"
            f"Buna göre suyun çıktığı **maksimum yükseklik ($k$)** ile bu maksimum yüksekliğe ulaştığı noktanın **yatay uzaklığının ($r$) toplamı ($r + k$)** kaç metredir?"
        )
        ans = r_top + k_top
        corr = f"${ans}$"
        dist = [f"${k_top}$", f"${k_top - r_top}$", f"${ans + 4}$", f"${b_coef + k_top}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Matematik",
            "topic": "Parabol (İkinci Dereceden Fonksiyon Grafikleri)",
            "subtopic": "Parabolik Yörünge ve Tepe Noktası Modellemesi",
            "learning_outcome_code": "MAT.AYT.3.1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": (
                f"Tepe noktası apsisi $r = -\\frac{{b}}{{2a}} = -\\frac{{{b_coef}}}{{-2}} = {r_top}\\text{{ m}}$. "
                f"Maksimum yükseklik $k = f({r_top}) = -({r_top})^2 + {b_coef}({r_top}) + ({c_coef}) = {k_top}\\text{{ m}}$. "
                f"Toplam $r + k = {r_top} + {k_top} = {ans}\\text{{ m}}$ bulunur."
            ),
            **opts
        }

    elif archetype == 3:
        # Yeni Nesil Logaritma: Richter Deprem Ölçeği / Ses Şiddeti Desibel Modellemesi
        mag1 = random.choice([4, 5])
        mag2 = mag1 + 2
        ratio = 10 ** (mag2 - mag1)  # 100 kat

        q_text = (
            f"Sismolojide bir depremin Richter ölçeğine göre büyüklüğü ($M$), depremin merkez üssünde oluşturduğu maksimum genlik $I$ ve standart referans genlik $I_0$ olmak üzere;\n"
            f"$$M = \\log_{{10}}\\left(\\frac{{I}}{{I_0}}\\right)$$\n"
            f"formülü ile hesaplanmaktadır.\n\n"
            f"Buna göre Richter ölçeğine göre büyüklüğü **$M_2 = {mag2}$** olan bir depremin maksimum dalga genliği ($I_2$), büyüklüğü **$M_1 = {mag1}$** olan bir depremin dalga genliğinin ($I_1$) **kaç katıdır**?"
        )
        corr = f"${ratio}$"
        dist = [f"${mag2 - mag1}$", f"${(mag2 - mag1) * 10}$", f"$1000$", f"${ratio // 2}$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Matematik",
            "topic": "Üstel ve Logaritmik Fonksiyonlar", "subtopic": "Logaritmanın Gerçek Hayat (Richter / Desibel) Uygulamaları",
            "learning_outcome_code": "MAT.AYT.1.4", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"$M_2 - M_1 = \\log_{{10}}(I_2/I_0) - \\log_{{10}}(I_1/I_0) = \\log_{{10}}(I_2/I_1) = {mag2} - {mag1} = 2$. "
                f"Buradan $\\frac{{I_2}}{{I_1}} = 10^2 = {ratio}$ kat bulunur."
            ),
            **opts
        }

    elif archetype == 4:
        # Yeni Nesil Trigonometri: Güneş Paneli Eğim Açısı ve İki Kat Açı
        q_text = (
            "Bir mühendis, çatıya yerleştirdiği güneş panelinin eğim açısını sabah saatlerinde dar bir açı olan $\\theta$ olarak ayarlamış ve $\\sin(\\theta) = \\frac{3}{5}$ olduğunu ölçmüştür. "
            "Öğle saatlerinde ise panelin yatayla yaptığı açıyı tam iki katına çıkararak $2\\theta$ konumuna getirmiştir.\n\n"
            "Buna göre panelin öğle saatindeki konumuna ait **$\\sin(2\\theta)$ ve $\\cos(2\\theta)$** değerleri aşağıdakilerin hangisinde sırasıyla doğru verilmiştir?"
        )
        corr = "$\\sin(2\\theta) = \\frac{24}{25}$ — $\\cos(2\\theta) = \\frac{7}{25}$"
        dist = [
            "$\\sin(2\\theta) = \\frac{6}{5}$ — $\\cos(2\\theta) = \\frac{8}{5}$",
            "$\\sin(2\\theta) = \\frac{24}{25}$ — $\\cos(2\\theta) = -\\frac{7}{25}$",
            "$\\sin(2\\theta) = \\frac{12}{25}$ — $\\cos(2\\theta) = \\frac{16}{25}$",
            "$\\sin(2\\theta) = \\frac{7}{25}$ — $\\cos(2\\theta) = \\frac{24}{25}$"
        ]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Matematik",
            "topic": "Trigonometri (Toplam-Fark, İki Kat Açı, Denklemler)",
            "subtopic": "İki Kat Açı (Yarım Açı) Formülleri ve Mühendislik Uygulaması",
            "learning_outcome_code": "MAT.AYT.4.1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                "Dar açı $\\theta$ için $\\sin(\\theta) = 3/5 \\implies \\cos(\\theta) = 4/5$. "
                "$\\sin(2\\theta) = 2\\sin\\theta\\cos\\theta = 2\\cdot \\frac{3}{5}\\cdot \\frac{4}{5} = \\frac{24}{25}$. "
                "$\\cos(2\\theta) = \\cos^2\\theta - \\sin^2\\theta = \\frac{16}{25} - \\frac{9}{25} = \\frac{7}{25}$."
            ),
            **opts
        }

    elif archetype == 5:
        # Yeni Nesil Limit ve Süreklilik: Parçalı Fonksiyon Parametre Analizi
        c_pt = random.choice([2, 3])
        # f(x) = { ax + 4 (x < c),  2x^2 - b (x == c),  3x^2 - 2 (x > c) }
        lim_val = 3 * (c_pt ** 2) - 2
        # a*c_pt + 4 = lim_val => a = (lim_val - 4) / c_pt
        a_val = (lim_val - 4) / c_pt
        # Tam sayı çıkması için c_pt = 2 -> lim_val = 10 -> 2a + 4 = 10 -> a = 3!
        c_pt = 2
        lim_val = 3 * (2 ** 2) - 2  # 10
        a_val = 3  # 3*2 + 4 = 10
        b_val = 15  # b - 2x = 15 - 4 = 11 != 10 veya sürekli olması için: 2*(2^2) + b = 10 => 8 + b = 10 => b = 2
        b_val = 2

        q_text = (
            "Gerçel sayılar kümesinde tanımlı bir $f(x)$ parçalı fonksiyonu;\n"
            "$$f(x) = \\begin{cases} ax + 4, & x < 2 \\\\ 2x^2 + b, & x = 2 \\\\ 3x^2 - 2, & x > 2 \\end{cases}$$\n"
            "biçiminde veriliyor.\n\n"
            "$f(x)$ fonksiyonu gerçel sayıların tamamında **sürekli** olduğuna göre, **$a \\cdot b$ çarpımı** kaçtır?"
        )
        corr = f"${a_val * b_val}$"
        dist = [f"${a_val + b_val}$", "$10$", "$8$", "$12$"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Matematik",
            "topic": "Limit ve Süreklilik", "subtopic": "Parçalı Fonksiyonlarda Limit ve Süreklilik Şartı",
            "learning_outcome_code": "MAT.AYT.5.1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                "$x = 2$ kritik noktasında sağdan limit: $\\lim_{x \\to 2^+} (3x^2-2) = 3(4)-2 = 10$. "
                "Soldan limit: $\\lim_{x \\to 2^-} (ax+4) = 2a + 4 = 10 \\implies a = 3$. "
                "Fonksiyon değeri: $f(2) = 2(2)^2 + b = 8 + b = 10 \\implies b = 2$. "
                "Çarpım $a \\cdot b = 3 \\times 2 = 6$ bulunur."
            ),
            **opts
        }

    else:
        # Yeni Nesil Diziler: Amfi Tiyatro Koltuk Dizilimi (Aritmetik Dizi)
        a1 = random.choice([20, 24, 30])
        d_diff = random.choice([4, 6])
        n_rows = 10
        an = a1 + (n_rows - 1) * d_diff
        total_seats = (n_rows * (a1 + an)) // 2

        q_text = (
            f"Modern bir konferans salonunda koltuklar ilk sırada **${a1}$ koltuk** bulunacak ve her bir arka sıradaki koltuk sayısı bir ön sıradakinden **${d_diff}$ koltuk fazla** olacak biçimde aritmetik dizi kuralıyla yerleştirilmiştir.\n\n"
            f"Bu konferans salonunda toplam **${n_rows}$ sıra** bulunduğuna göre;\n"
            f"I. En arka ($10.$) sıradaki koltuk sayısı **${an}$**'dir.\n"
            f"II. Salondaki toplam koltuk sayısı **${total_seats}$**'dir.\n"
            f"III. $5.$ sıradaki koltuk sayısı ile $6.$ sıradaki koltuk sayısının toplamı **${a1 + an}$**'dir.\n\n"
            f"yargılarından hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Matematik",
            "topic": "Diziler ve Aritmetik-Geometrik Diziler", "subtopic": "Aritmetik Dizi Genel Terimi ve İlk n Terim Toplamı",
            "learning_outcome_code": "MAT.AYT.2.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"$a_{{10}} = a_1 + 9d = {a1} + 9\\cdot {d_diff} = {an}$ (I doğru). "
                f"İlk $10$ terim toplamı $S_{{10}} = \\frac{{10}}{{2}}(a_1 + a_{{10}}) = 5 \\cdot ({a1} + {an}) = {total_seats}$ (II doğru). "
                f"Aritmetik dizide uçlardan eşit uzaklıktaki terimler toplamı eşittir: $a_5 + a_6 = a_1 + a_{{10}} = {a1 + an}$ (III doğru)."
            ),
            **opts
        }


# ================= 2. AYT GEOMETRİ (ANALİTİK VE DÖNÜŞÜM GEOMETRİSİ) =================

def gen_ayt_geometri(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import generate_dynamic_coordinate_transform_svg
    if index is None:
        index = random.randint(0, 999)
    svg = generate_dynamic_coordinate_transform_svg("AYT Analitik Geometri: Koordinat Düzleminde Dönüşüm")
    q_text = (
        "Dik koordinat düzleminde merkezi $M(3, -4)$ noktasında bulunan ve orijinden ($O(0,0)$) geçen bir çember çiziliyor.\n\n"
        "Bu çemberin standart denklemi ve yarıçap uzunluğu ($r$) ile ilgili;\n"
        "I. Çemberin yarıçap uzunluğu $r = 5$ birimdir.\n"
        "II. Çemberin standart denklemi $(x - 3)^2 + (y + 4)^2 = 25$ biçimindedir.\n"
        "III. Çemberin $x$-eksenini kestiği noktaların apsisleri toplamı $6$'dır.\n\n"
        "ifadelerinden hangileri **doğrudur**?"
    )
    corr = "I, II ve III"
    dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
    opts = format_ayt_options(corr, dist)
    return {
        "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Geometri",
        "topic": "Çemberin Analitik İncelenmesi", "subtopic": "Çemberin Standart Denklemi ve Eksen Kesimleri",
        "learning_outcome_code": "GEO.AYT.2.2", "cognitive_domain": "Analiz / Muhakeme",
        "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
        "explanation": (
            "Merkez $M(3,-4)$ ile $O(0,0)$ arası uzaklık $r = \\sqrt{3^2 + (-4)^2} = 5$ birimdir (I doğru). "
            "Denklem $(x-3)^2 + (y+4)^2 = 5^2 = 25$'tir (II doğru). "
            "$y=0$ için $(x-3)^2 + 16 = 25 \\implies (x-3)^2 = 9 \\implies x_1 = 6, x_2 = 0$, toplamları $6$'dır (III doğru)."
        ),
        **opts
    }


# ================= 3. AYT FİZİK (ÖSYM YENİ NESİL MEKANİK VE ELEKTROMANYETİZMA) =================

def gen_ayt_fizik(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    archetype = index % 3

    if archetype == 0:
        # İtme, Momentum ve Enerji Korunumu (Balistik Sarkaç / Çarpışma)
        m1 = 2
        v1 = random.choice([6, 9, 12])
        m2 = 4
        v_common = (m1 * v1) // (m1 + m2)
        e_init = (m1 * (v1 ** 2)) // 2
        e_final = ((m1 + m2) * (v_common ** 2)) // 2
        e_lost = e_init - e_final

        q_text = (
            f"Sürtünmesiz yatay bir ray üzerinde **$v_1 = {v1}\\text{{ m/s}}$** sabit hızla ilerleyen **$m_1 = {m1}\\text{{ kg}}$** kütleli bir vagon, "
            f"aynı ray üzerinde durmakta olan **$m_2 = {m2}\\text{{ kg}}$** kütleli başka bir vagona çarparak otomatik kancayla kenetleniyor.\n\n"
            f"Bu tam esnek olmayan çarpışma süreciyle ilgili;\n"
            f"I. Çarpışma sırasında sisteme dışarıdan yatay net kuvvet etki etmediği için **çizgisel momentum korunmuştur**.\n"
            f"II. Kenetlenen vagonların çarpışma sonrasındaki ortak hızı **$v_{{ort}} = {v_common}\\text{{ m/s}}$**'dir.\n"
            f"III. Çarpışma esnasında ısı ve ses enerjisine dönüşerek kaybolan mekanik enerji miktarı **${e_lost}\\text{{ Joule}}$**'dür.\n\n"
            f"yargılarından hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Fizik",
            "topic": "İtme ve Çizgisel Momentum", "subtopic": "Esnek Olmayan Çarpışmalar ve Enerji Kaybı",
            "learning_outcome_code": "FİZ.AYT.2.1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Dış kuvvet sıfır olduğundan çizgisel momentum korunur: $m_1 v_1 = (m_1+m_2)v_{{ort}} \\implies {m1}\\cdot {v1} = 6\\cdot v_{{ort}} \\implies v_{{ort}} = {v_common}\\text{{ m/s}}$ (I ve II doğru). "
                f"$E_{{ilk}} = \\frac{{1}}{{2}}({m1})({v1})^2 = {e_init}\\text{{ J}}$, $E_{{son}} = \\frac{{1}}{{2}}(6)({v_common})^2 = {e_final}\\text{{ J}}$. Kayıp enerji $= {e_init} - {e_final} = {e_lost}\\text{{ J}}$ (III doğru)."
            ),
            **opts
        }

    elif archetype == 1:
        # İki Boyutta Atış Hareketi
        h_tower = random.choice([45, 80])
        t_flight = int(math.isqrt(2 * h_tower // 10))
        v0 = random.choice([20, 30])
        x_range = v0 * t_flight
        vy_final = 10 * t_flight

        q_text = (
            f"Hava direncinin ihmal edildiği bir ortamda, yerden **$h = {h_tower}\\text{{ metre}}$** yükseklikte sabit hızla uçan bir insansız hava aracı (İHA), "
            f"yatay doğrultuda **$v_0 = {v0}\\text{{ m/s}}$** hızla giderken bir yardım paketini serbest bırakıyor ($g = 10\\text{{ m/s}}^2$).\n\n"
            f"Paketin yere ulaşma süreciyle ilgili;\n"
            f"I. Paket havada toplam **${t_flight}\\text{{ saniye}}$** kalır.\n"
            f"II. Paketin bırakıldığı noktanın izdüşümüne göre yatayda aldığı menzil yolu **$x = {x_range}\\text{{ metre}}$**'dir.\n"
            f"III. Paketin yere çarptığı andaki düşey hız bileşeninin büyüklüğü **$v_y = {vy_final}\\text{{ m/s}}$**'dir.\n\n"
            f"ifadelerinden hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Fizik",
            "topic": "İki Boyutta Hareket (Atışlar)", "subtopic": "Yatay Atış Hareketi ve Menzil Analizi",
            "learning_outcome_code": "FİZ.AYT.1.3", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Düşeyde serbest düşme: $h = \\frac{{1}}{{2}}gt^2 \\implies {h_tower} = 5t^2 \\implies t = {t_flight}\\text{{ s}}$ (I doğru). "
                f"Yatay menzil: $x = v_0 \\cdot t = {v0} \\times {t_flight} = {x_range}\\text{{ m}}$ (II doğru). "
                f"Düşey son hız: $v_y = g \\cdot t = 10 \\times {t_flight} = {vy_final}\\text{{ m/s}}$ (III doğru)."
            ),
            **opts
        }

    else:
        # Fotoelektrik Olay ve Modern Fizik
        e_photon = random.choice([6.4, 7.2, 8.5])
        e_work = 3.2
        e_kin = round(e_photon - e_work, 1)
        q_text = (
            f"Bir fotoelektrik deneyinde eşik enerjisi (bağlanma enerjisi) **$E_0 = {e_work}\\text{{ eV}}$** olan sezyum metaliyle kaplı katot yüzeyine, "
            f"enerjisi **$E_{{foton}} = {e_photon}\\text{{ eV}}$** olan morötesi foton demeti düşürülüyor.\n\n"
            f"Einstein'ın fotoelektrik denklemine göre;\n"
            f"I. Katottan sökülen fotoelektronların maksimum kinetik enerjisi **${e_kin}\\text{{ eV}}$**'dir.\n"
            f"II. Fotoelektronları tamamen durdurmak için uygulanması gereken kesme potansiyeli **$V_k = {e_kin}\\text{{ Volt}}$**'tur.\n"
            f"III. Gelen ışığın frekansı değiştirilmeden yalnızca ışık şiddeti (foton sayısı) artırılırsa sökülen elektronların maksimum kinetik enerjisi iki katına çıkar.\n\n"
            f"yargılarından hangileri **doğrudur**?"
        )
        corr = "I ve II"
        dist = ["Yalnız I", "I ve III", "II ve III", "I, II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Fizik",
            "topic": "Modern Fizik ve Modern Fiziğin Teknolojideki Uygulamaları",
            "subtopic": "Fotoelektrik Olayı ve Kesme Potansiyeli",
            "learning_outcome_code": "FİZ.AYT.5.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"$E_k = E_{{foton}} - E_0 = {e_photon} - {e_work} = {e_kin}\\text{{ eV}}$ (I doğru). "
                f"$e \\cdot V_k = E_k \\implies V_k = {e_kin}\\text{{ V}}$ (II doğru). "
                f"Işık şiddeti yalnızca sökülen fotoelektron sayısını (akımı) artırır, tek bir elektronun kinetik enerjisini değiştirmez (III yanlış)."
            ),
            **opts
        }


# ================= 4. AYT KİMYA (ÖSYM YENİ NESİL TİTRASYON, DENGE VE ELEKTROKİMYA) =================

def gen_ayt_kimya(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import generate_dynamic_chemistry_lab_svg
    if index is None:
        index = random.randint(0, 999)
    archetype = index % 3

    if archetype == 0:
        svg = generate_dynamic_chemistry_lab_svg("AYT Kimya: Kuvvetli Asit - Kuvvetli Baz Titrasyon Düzeneği")
        v_acid = random.choice([100, 200])
        m_acid = 0.1
        m_base = 0.1
        # Tam eşdeğerlik noktası için V_base = V_acid = 100 veya 200 mL
        q_text = (
            f"Yukarıdaki titrasyon düzeneğinde, erlenmayerde bulunan $25^\\circ\\text{{C}}$'deki **${v_acid}\\text{{ mL}}$ $0.1\\text{{ M}}$ $HCl$** sulu çözeltisi üzerine, büretten damla damla **$0.1\\text{{ M}}$ $NaOH$** standart sulu çözeltisi eklenmektedir.\n\n"
            f"Bu titrasyon deneyiyle ilgili;\n"
            f"I. Başlangıçta erlenmayerdeki $HCl$ çözeltisinin $pH$ değeri **$1$**'dir.\n"
            f"II. Büretten tam **${v_acid}\\text{{ mL}}$** $NaOH$ çözeltisi eklendiğinde eşdeğerlik (dönüm) noktasına ulaşılır ve $pH = 7$ olur.\n"
            f"III. Eşdeğerlik noktasında çözeltideki toplam hacim ${2 * v_acid}\\text{{ mL}}$ olduğundan oluşan $NaCl$ tuzunun derişimi **$0.05\\text{{ M}}$**'dir.\n\n"
            f"yargılarından hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Kimya",
            "topic": "Sulu Çözelti Dengeleri (Asit-Baz Dengesi, Tampon Çözeltiler, KÇÇ Çözünürlük Dengesi)",
            "subtopic": "Asit-Baz Titrasyonu ve Eşdeğerlik Noktası",
            "learning_outcome_code": "KİM.AYT.3.4", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": (
                f"$[H^+] = 0.1 = 10^{{-1}}\\text{{ M}} \\implies pH = 1$ (I doğru). "
                f"$n_{{H^+}} = n_{{OH^-}} \\implies 0.1 \\times {v_acid} = 0.1 \\times V_{{baz}} \\implies V_{{baz}} = {v_acid}\\text{{ mL}}$'de $pH=7$ olur (II doğru). "
                f"Hacim iki katına çıktığı için oluşan tuzun derişimi yarıya ($0.05\\text{{ M}}$) iner (III doğru)."
            ),
            **opts
        }

    elif archetype == 1:
        q_text = (
            "Sabit hacimli kapalı bir reaktörde gerçekleşen;\n"
            "$$N_2(g) + 3H_2(g) \\rightleftharpoons 2NH_3(g) \\quad \\Delta H < 0\\ (\\text{Ekzotermik})$$\n"
            "Haber-Bosch amonyak sentezi tepkimesi dengedeyken sisteme ayrı ayrı şu müdahaleler yapılıyor:\n\n"
            "I. Sabit sıcaklıkta kaba $N_2$ gazı eklenirse denge **ürünler (sağ)** yönüne kayar ve $NH_3$ mol sayısı artar.\n"
            "II. Sistemin sıcaklığı düşürülürse hem denge **ürünler (sağ)** yönüne kayar hem de denge sabiti **$K_c$ büyür**.\n"
            "III. Sabit sıcaklıkta ortama uygun bir katalizör eklenirse denge sabiti $K_c$ değişmez, sadece sistemin dengeye ulaşma süresi kısalır.\n\n"
            "Le Chatelier ilkesine göre yukarıdaki çıkarımlardan hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Kimya",
            "topic": "Kimyasal Denge ve Dengeye Etki Eden Faktörler (Le Chatelier)",
            "subtopic": "Dengeye Sıcaklık, Derişim ve Katalizör Etkisi",
            "learning_outcome_code": "KİM.AYT.3.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": "Giren eklemek dengeyi ürünlere kaydırır (I doğru). Ekzotermik tepkimede soğutma dengeyi ürünlere kaydırır ve $K_c$'yi büyütür (II doğru). Katalizör denge sabitini değiştirmez (III doğru).",
            **opts
        }

    else:
        q_text = (
            "Standart koşullarda ($25^\\circ\\text{C}$, $1\\text{ M}$) kurulan bir **Zn - Cu (Daniel) elektrokimyasal pilinde** yarı hücrelerin standart indirgenme potansiyelleri;\n"
            "- $Zn^{2+}(suda) + 2e^- \\to Zn(k) \\quad E^\\circ = -0.76\\text{ V}$\n"
            "- $Cu^{2+}(suda) + 2e^- \\to Cu(k) \\quad E^\\circ = +0.34\\text{ V}$\n"
            "olarak verilmiştir.\n\n"
            "Bu galvanik hücre çalışırken gerçekleşen olaylarla ilgili aşağıdakilerden hangisi **yanlıştır**?"
        )
        corr = "Dış devrede elektronların akış yönü $Cu$ (katot) elektrottan $Zn$ (anot) elektroda doğrudur."
        dist = [
            "Pilin başlangıçtaki standart hücre potansiyeli $E^\\circ_{pil} = +1.10\\text{ Volt}$'tur.",
            "$Zn$ elektrot anottur ve zamanla aşınarak kütlesi azalırken $Zn^{2+}$ derişimi artar.",
            "$Cu$ elektrot katottur ve yüzeyinde $Cu^{2+}$ iyonları indirgenerek bakır metali birikir.",
            "Tuz köprüsündeki anyonlar ($-$ yüklü iyonlar) anot yarı hücresi olan $Zn$ kabına doğru göç eder."
        ]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Kimya",
            "topic": "Kimya ve Elektrik (Redoks, Aktiflik, Galvanik Piller, Nernst Eşitliği, Elektroliz)",
            "subtopic": "Elektrokimyasal Pillerin Çalışma İlkeleri",
            "learning_outcome_code": "KİM.AYT.4.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": "Dış devrede elektronlar daima ANOTTAN ($Zn$) KATODA ($Cu$) doğru akar. Seçenekte tersi söylendiği için yanlıştır.",
            **opts
        }


# ================= 5. AYT BİYOLOJİ (ÖSYM YENİ NESİL FİZYOLOJİ VE MOLEKÜLER BİYOLOJİ) =================

def gen_ayt_biyoloji(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    archetype = index % 3

    if archetype == 0:
        q_text = (
            "Sağlıklı bir insanın uzun süre karbonhidrat ağırlıklı besin tüketmesinin ardından kan şekerinin (glikoz düzeyinin) normal eşik değerin üzerine çıktığı tespit edilmiştir.\n\n"
            "Endokrin sistemin homeostaziyi (iç dengeyi) sağlamak için verdiği tepki sürecinde;\n"
            "I. Pankreasın Langerhans adacıklarındaki beta hücrelerinden kana **insülin hormonu** salgılanır.\n"
            "II. İnsülin etkisiyle kandaki fazla glikozun karaciğer ve çizgili kas hücrelerine geçişi hızlanır ve **glikojen** şeklinde depolanır.\n"
            "III. Aynı anda böbrek üstü bezinden yoğun miktarda glukagon salgılanarak kan şekeri daha da yükseltilir.\n\n"
            "olaylarından hangileri gerçekleşir?"
        )
        corr = "I ve II"
        dist = ["Yalnız I", "I ve III", "II ve III", "I, II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Biyoloji",
            "topic": "Endokrin Sistem (Hormonlar)", "subtopic": "Kan Şekerinin Düzenlenmesi (İnsülin - Glukagon Antagonizması)",
            "learning_outcome_code": "BİY.AYT.1.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Kan şekeri yükseldiğinde pankreastan insülin salgılanır ve glikoz hücrelere alınıp glikojen olarak depolanır (I ve II doğru). Glukagon ise pankreastan (böbrek üstü bezinden değil) açlık durumunda salgılanır (III yanlış).",
            **opts
        }

    elif archetype == 1:
        q_text = (
            "Ökaryot bir hücrede **$90$ amino asitten** oluşan işlevsel bir polipeptit zincirinin ribozomda sentezlenmesi (**translasyon**) sırasında (**dur kodonu / stop kodonu hariç** $90$ anlamlı kodon görev yapmaktadır):\n\n"
            "I. Sentezde görev yapan mRNA molekülünün protein kodlayan bölgesinde (başlangıç kodonu dahil, **dur/stop kodonu dahil**) toplam **$91$ kodon ($273$ nükleotit)** bulunur.\n"
            "II. Polipeptit zinciri kurulurken amino asitler arasında **$89$ adet peptit bağı** oluşturulur ve $89$ molekül su ($H_2O$) açığa çıkar.\n"
            "III. Durdurucu kodonların ($UAA, UAG, UGA$) tRNA antikodon karşılığı olmadığından bu kodonlar herhangi bir amino asit şifrelemez.\n\n"
            "ifadelerinden hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Biyoloji",
            "topic": "Genden Proteine (DNA, RNA, Replikasyon ve Protein Sentezi)",
            "subtopic": "Genetik Şifre, Kodon Hesabı ve Peptit Bağı",
            "learning_outcome_code": "BİY.AYT.3.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                "$90$ amino asit için $90$ anlamlı kodon $+ 1$ stop kodonu $= 91$ kodon ($91 \\times 3 = 273$ nükleotit) bulunur (I doğru). "
                "Peptit bağı ve su sayısı $= n - 1 = 90 - 1 = 89$'dur (II doğru). Stop kodonları amino asit şifrelemez (III doğru)."
            ),
            **opts
        }

    else:
        q_text = (
            "Yeşil bir bitkide gerçekleşen **fotosentez** reaksiyonlarında, işaretli oksijen ($^{18}O$) taşıyan su ($H_2^{18}O$) ve normal oksijen taşıyan karbondioksit ($C^{16}O_2$) kullanılmıştır.\n\n"
            "Fotosentezin ışığa bağımlı ve ışıktan bağımsız (Calvin döngüsü) tepkimeleri tamamlandığında;\n"
            "I. Atmosfere verilen serbest oksijen gazı ($^{18}O_2$), suyun fotoliziyle oluştuğu için **ağır oksijen ($^{18}O$)** izotopunu taşır.\n"
            "II. Sentezlenen glikoz ($C_6H_{12}O_6$) molekülünün yapısındaki oksijen atomları, karbondioksitten ($C^{16}O_2$) geldiği için **normal oksijen ($^{16}O$)** izotopunu taşır.\n"
            "III. Işıktan bağımsız tepkimeler kloroplastın **stroma** sıvısında gerçekleşir ve $ATP$ ile $NADPH$ tüketilir.\n\n"
            "yargılarından hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_ayt_options(corr, dist)
        return {
            "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Biyoloji",
            "topic": "Canlılarda Enerji Dönüşümleri (Fotosentez, Kemosentez ve Hücresel Solunum)",
            "subtopic": "Fotosentezde Atomların İzlenmesi ve Evreler",
            "learning_outcome_code": "BİY.AYT.4.1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Suyun fotolizinden çıkan oksijen atmosfere verilir ($^{18}O_2$). $CO_2$'deki karbon ve oksijen ise Calvin döngüsünde (stromada) glikozun yapısına katılır.",
            **opts
        }


# ================= 6. AYT EDEBİYAT, TARİH-1 VE COĞRAFYA-1 =================

def gen_ayt_edebiyat(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    items = [
        (
            "Divan şiirinde 16. yüzyılın zirve şahsiyetlerinden olan iki büyük şair karşılaştırıldığında:\n"
            "- **I. Şair:** Bağdat ve Kerbela coğrafyasında yetişmiş, tasavvufi ıstırabı, platonik aşkı ve lirizmi **'Leylâ vü Mecnun'** mesnevisinde ve **'Su Kasidesi'**'nde zirveye taşımıştır.\n"
            "- **II. Şair:** İstanbul'da yetişmiş, tasavvuftan uzak durarak dünyevi neşeyi, rindane yaşayışı ve Osmanlı'nın ihtişamını kusursuz bir aruz diliyle işleyerek **'Sultanü'ş-Şuarâ'** unvanını almış, **'Kanuni Mersiyesi'**'ni yazmıştır.\n\n"
            "Bu parçada edebi kişilikleri karşılaştırılan iki büyük Divan şairi aşağıdakilerin hangisinde sırasıyla verilmiştir?",
            "I: Fuzûlî — II: Bâkî",
            [
                "I: Şeyh Galip — II: Nedim",
                "I: Fuzûlî — II: Nâbî",
                "I: Nef'î — II: Bâkî",
                "I: Ahmet Paşa — II: Zâtî"
            ],
            "Leylâ vü Mecnun ve Su Kasidesi'nin şairi Fuzûlî; Sultanü'ş-Şuara unvanlı Kanuni Mersiyesi şairi ise Bâkî'dir."
        ),
        (
            "Türk romanının modernleşme sürecinde;\n"
            "- Tanzimat I. Dönem'de **Namık Kemal**, romantizm akımının etkisiyle yazdığı **'İntibah'** romanında yanlış batılılaşma ve tutkulu bir aşkın yıkımını işlemiş,\n"
            "- Tanzimat II. Dönem'de **Recaizade Mahmut Ekrem**, realizm akımına yönelerek yazdığı **'Araba Sevdası'** romanında Bihruz Bey karakteri üzerinden yüzeysel alafrangalığı ironik biçimde eleştirmiş,\n"
            "- Servetifünun Dönemi'nde ise **Halit Ziya Uşaklıgil**, Batılı anlamda ilk modern roman örneklerimiz olan **'Mai ve Siyah'** ile **'Aşk-ı Memnu'**'da teknik kusursuzluğa ulaşmıştır.\n\n"
            "Bu tarihsel gelişim çizgisiyle ilgili aşağıdakilerden hangisi **söylenemez**?",
            "Tanzimat'tan Servetifünun'a geçildikçe romanda gözlem ve psikolojik tahlil terk edilerek olağanüstü masalsı kurgulara dönülmüştür.",
            [
                "Tanzimat I. Dönem romanlarında yazarlar kişiliklerini gizlememiş ve toplumu eğitme amacı gütmüşlerdir.",
                "Recaizade Mahmut Ekrem'in 'Araba Sevdası' eseri Türk edebiyatında ilk realist roman kabul edilir.",
                "Halit Ziya Uşaklıgil, roman tekniği, çevre betimlemesi ve psikolojik derinlik bakımından Türk romanını Batı standardına taşımıştır.",
                "Yanlış batılılaşma (alafranga züppe tipi), Tanzimat'tan itibaren Türk romanının ana izleklerinden biri olmuştur."
            ],
            "Tanzimat'tan Servetifünun'a geçildikçe masalsı kurgulara dönülmemiş, tam aksine realizm, gözlem ve psikolojik tahlil güçlenmiştir."
        )
    ]
    it = items[index % len(items)]
    opts = format_ayt_options(it[1], it[2])
    return {
        "exam_type": "AYT", "grade_level": "11-12. Sınıf", "subject": "Edebiyat",
        "topic": "Divan, Tanzimat ve Cumhuriyet Dönemi Edebiyatı",
        "subtopic": "Karşılaştırmalı Dönem, Yazar ve Eser Analizi",
        "learning_outcome_code": "TDE.AYT.3.2", "cognitive_domain": "Analiz / Muhakeme",
        "difficulty": "ÖSYM / Yeni Nesil", "question_text": it[0], "explanation": it[3], **opts
    }


# ================= ANA AYT SÖZLÜĞÜ VE ÜRETİCİ =================

AYT_DISPATCHER = {
    "Matematik": gen_ayt_matematik,
    "Geometri": gen_ayt_geometri,
    "Fizik": gen_ayt_fizik,
    "Kimya": gen_ayt_kimya,
    "Biyoloji": gen_ayt_biyoloji,
    "Edebiyat": gen_ayt_edebiyat,
    "Türk Dili ve Edebiyatı": gen_ayt_edebiyat,
}


def generate_ayt_question(subject: str, index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.question_generator_tyt import gen_tyt_tarih, gen_tyt_cografya
    s_norm = str(subject or "").lower()
    if "geometri" in s_norm:
        return gen_ayt_geometri(index, topic)
    elif "matematik" in s_norm:
        return gen_ayt_matematik(index, topic)
    elif "fizik" in s_norm:
        return gen_ayt_fizik(index, topic)
    elif "kimya" in s_norm:
        return gen_ayt_kimya(index, topic)
    elif "biyoloji" in s_norm:
        return gen_ayt_biyoloji(index, topic)
    elif "tarih" in s_norm:
        q = gen_tyt_tarih(index, topic)
        q["exam_type"] = "AYT"
        q["grade_level"] = "11-12. Sınıf"
        return q
    elif "coğrafya" in s_norm or "cografya" in s_norm:
        q = gen_tyt_cografya(index, topic)
        q["exam_type"] = "AYT"
        q["grade_level"] = "11-12. Sınıf"
        return q
    return gen_ayt_edebiyat(index, topic)
