# -*- coding: utf-8 -*-
"""
LGS 8. Sınıf Soru Üretim Motoru (MEB Müfredatı ve Yeni Nesil Beceri Temelli Sorular)
Branşlar:
1. Türkçe
2. Matematik
3. Fen Bilimleri
4. T.C. İnkılap Tarihi ve Atatürkçülük
5. Din Kültürü ve Ahlak Bilgisi
6. İngilizce

Standart:
- Sadece 4 seçenek (A, B, C, D). option_e KESİNLİKLE None.
- KaTeX formülleri $ ... $ biçiminde.
- Altı çizili sözcüklerde <u>...</u> etiketi zorunlu.
- Şıklarda "ulaşılamaz" veya meta geçersiz çeldirici bulunmaz.
- Bilişsel Düzey: Kavrama, Uygulama, Analiz / Muhakeme.
"""

import random
import re
from typing import Dict, Any, List

def format_lgs_options(correct_text: str, distractors: List[str]) -> Dict[str, Any]:
    """LGS için kesin 4 seçenek (A, B, C, D) ve None E şıkkı oluşturur."""
    letters = ["A", "B", "C", "D"]
    corr_idx = random.randint(0, 3)
    clean_dist = [d for d in distractors if "ulaşılamaz" not in str(d).lower()][:3]
    
    # Eksikse tamamla
    fillers = [
        "Verilen öncüllerdeki kavramsal ilişkinin doğrudan yansıtılması",
        "Olayların kronolojik ve mantıksal sıralamasının doğru kurgulanması",
        "Metindeki temel düşünce ile yardımcı düşüncelerin dengeli ele alınması",
        "Deney değişkenlerinin bağımsız parametreye göre yeniden düzenlenmesi"
    ]
    f_idx = 0
    while len(clean_dist) < 3:
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
            
    opts["option_e"] = None
    opts["correct_option"] = letters[corr_idx]
    return opts


# ================= 1. LGS TÜRKÇE =================

def gen_lgs_turkce(index: int) -> Dict[str, Any]:
    archetype = index % 8
    
    if archetype == 0:
        # Fiilimsiler
        verbs = [
            ("okumak", "okuyan", "okuyup", "Gözlerindeki ışığı <u>fark eden</u> öğretmen, öğrencinin soru sormasını bekledi."),
            ("koşmak", "koşan", "koşarak", "Haber merkezine <u>ulaşan</u> son dakika bilgilerini spiker heyecanla aktardı."),
            ("yazmak", "yazan", "yazınca", "Genç yaşta bu etkileyici şiirleri <u>kaleme alan</u> şair, edebiyat dünyasında yankı uyandırdı."),
            ("gülmek", "gülen", "gülerek", "Sahnede repliğini <u>unutan</u> oyuncu, durumu doğaçlama yaparak toparladı.")
        ]
        v = verbs[index % len(verbs)]
        q_text = f"Cümlede fiilimsi (eylemsi) ekleri fiil kök veya gövdelerine gelerek onları isim, sıfat veya zarf yapar.\n\nBuna göre;\n\"{v[3]}\"\ncümlesindeki altı çizili sözcükle **aynı türde fiilimsi** içeren cümle aşağıdakilerin hangisidir?"
        corr = "Gelecek günlerin umudunu yüreğinde taşıyan insanlar asla pes etmez."
        dist = [
            "Güneş dağların ardından batarken köyün sokakları sessizliğe büründü.",
            "Kitap okumak, zihnin en verimli beslenme kaynağıdır.",
            "Tüm eşyalarını toplayıp sessizce odadan ayrıldı."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Türkçe",
            "topic": "Fiilimsiler (Eylemsiler)",
            "subtopic": "Sıfat-Fiil (Ortaç)",
            "learning_outcome_code": f"T.8.3.{10 + (index % 5)}",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Altı çizili ifade ('{v[1]}') sıfat-fiil ekidir (-an/-en). Doğru seçenek olan cümlede de 'taşıyan' sözcüğü sıfat-fiil olarak kullanılmıştır.",
            **opts
        }
        
    elif archetype == 1:
        # Cümlenin Ögeleri
        sentences = [
            ("Sabahın ilk ışıklarıyla uyanan yaşlı balıkçı, fırtınaya rağmen küçük kayığıyla denize açıldı.", "Zarf Tamlayıcısı"),
            ("Kütüphanenin sessiz köşesinde ders çalışan öğrenciler, sınav tarihini merakla bekliyordu.", "Özne"),
            ("Sanatçı, çocukluğunun geçtiği Ege kasabasını romanlarında büyük bir ustalıkla anlatmıştır.", "Belirtili Nesne"),
            ("Geleneksel motiflerle süslenmiş seramik vazoyu antikacının vitrininde gördüm.", "Belirtili Nesne")
        ]
        s = sentences[index % len(sentences)]
        q_text = f"\"{s[0]}\"\n\nBu cümlenin **ögelerinin dizilişi** veya vurgulanan ögesi dikkate alındığında, eylemin durumunu veya zamanını bildiren öge aşağıdakilerden hangisidir?"
        corr = s[1]
        dist = ["Yüklem", "Yer Tamlayıcısı (Dolaylı Tümleç)", "Özne"]
        if corr in dist:
            dist.remove(corr)
            dist.append("Belirtisiz Nesne")
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Türkçe",
            "topic": "Cümlenin Ögeleri",
            "subtopic": "Temel ve Yardımcı Ögeler",
            "learning_outcome_code": "T.8.3.18",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"Cümlede yükleme sorulan 'nasıl / ne zaman / nereye' gibi sorularla bulunan öge {corr}'dir.",
            **opts
        }
        
    elif archetype == 2:
        # Altı Çizili Sözcükte Mecaz / Anlam
        words = [
            ("gözden düşmek", "toplumdaki saygınlığını ve itibarını yitirmek", "büyük bir felakete uğramak", "görme yetisini zayıflatmak", "işinden istifa etmek"),
            ("ayağına basmak", "birinin alanına veya yetkisine müdahale edip onu rahatsız etmek", "hızlıca bir yere ulaşmak", "yürürken dikkatli olmamak", "korkup geri çekilmek"),
            ("yol açmak", "bir gelişmeye zemin hazırlamak, sebep olmak", "yeni bir cadde inşa etmek", "yolcuları karşılamak", "kararları ertelemek"),
            ("kulak kabartmak", "çaktırmadan, belli etmeden dinlemeye çalışmak", "ses şiddetini artırmak", "kulağını tıkayıp duymamak", "uyarıları dikkate almamak")
        ]
        w = words[index % len(words)]
        q_text = f"Son dönemde attığı fevri adımlar ve verdiği tutarsız demeçler sebebiyle çevresindekilerin <u>{w[0]}</u> tehlikesiyle karşı karşıya kaldı.\n\nBu cümledeki altı çizili deyimin cümleye kattığı anlam aşağıdakilerden hangisidir?"
        opts = format_lgs_options(w[1], [w[2], w[3], w[4]])
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Türkçe",
            "topic": "Sözcükte Anlam",
            "subtopic": "Deyimler ve Mecaz Anlam",
            "learning_outcome_code": "T.8.3.5",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"'{w[0]}' deyimi, mecaz anlamıyla '{w[1]}' durumunu ifade etmektedir.",
            **opts
        }
        
    elif archetype == 3:
        # Paragrafta Ana Düşünce
        themes = [
            ("Okuma Kültürü", "Nitelikli bir edebiyat okuru olmak, sadece olay örgüsünü takip etmek değil; satır aralarındaki estetik ve felsefi incelikleri keşfetmektir. Yüzeysel bir gözle hızla tüketilen metinler zihinde kalıcı bir iz bırakmaz.", "Nitelikli okuma, metnin derinliklerindeki estetik ve düşünsel katmanları kavramayı gerektirir.", [
                "Edebi eserlerin başarısı yalnızca akıcı bir olay örgüsüne sahip olmalarına bağlıdır.",
                "Hızlı okuma teknikleri tüm edebi metinlerin anlaşılmasında temel koşuldur.",
                "Yazarlar metinlerini okuyucunun rahatça tüketebileceği sadelikte oluşturmalıdır."
            ]),
            ("Sanatta Özgünlük", "Başkalarının ayak izlerini takip edenler asla yeni ufuklar keşfedemez. Gerçek sanatçı, gelenekten beslense dahi kendi sesini bulma cesaretini gösteren ve taklit batağına saplanmayan kişidir.", "Gerçek sanatsal değer, gelenekten kopmadan özgün ve taklit edilemez bir üslup yakalamakla mümkündür.", [
                "Sanatçının temel görevi geleneksel kalıpları hiçbir değişiklik yapmadan korumaktır.",
                "Yeni ufuklar açmak için geçmiş kültürel mirasın tamamen reddedilmesi gerekir.",
                "Popüler akımlara uyum sağlamak bir sanatçının en önemli varoluş biçimidir."
            ])
        ]
        t = themes[index % len(themes)]
        q_text = f"**Metin:**\n\"{t[1]}\"\n\nBu metinde yazarın **asıl anlatmak istediği düşünce (ana fikir)** aşağıdakilerden hangisidir?"
        opts = format_lgs_options(t[2], t[3])
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Türkçe",
            "topic": "Paragrafta Anlam",
            "subtopic": "Ana Düşünce ve Vurgulanan Fikir",
            "learning_outcome_code": "T.8.3.16",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"Metnin bütününde savunulan ve varılmak istenen temel sonuç: {t[2]}",
            **opts
        }
        
    elif archetype == 4:
        # Metin Türleri ve Söz Sanatları
        arts = [
            ("Güneş, altın sarısı saçlarını yeryüzüne sererek yeni bir günü selamlıyordu. Bahçedeki narin güller ise hafif bir rüzgarla adeta fısıldaşıyordu.", "Kişileştirme (Teşhis) ve Benzetme (Teşbih)"),
            ("Ağlarım hatıra geldikçe gülüştüklerimiz / Çiçekler açar dertlerimin gölgesinde.", "Tezat (Karşıtlık)"),
            ("Bir ah çeksem dağı taşı eritir / Gözüm yaşı değirmeni yürütür.", "Abartma (Mübalağa)")
        ]
        a = arts[index % len(arts)]
        q_text = f"\"{a[0]}\"\n\nBu parçada başvurulan **söz sanatı** aşağıdakilerden hangisidir?"
        corr = a[1]
        dist = ["Tezat (Karşıtlık)", "Abartma (Mübalağa)", "Konuşturma (İntak)"]
        if corr in dist:
            dist.remove(corr)
            dist.append("Benzetme (Teşbih)")
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Türkçe",
            "topic": "Söz Sanatları ve Metin Türleri",
            "subtopic": "Edebi Sanatlar",
            "learning_outcome_code": "T.8.3.24",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Parçada insana ait özellikler doğaya aktarılmış veya karşıt durumlardan yararlanılarak {corr} sanatı yapılmıştır.",
            **opts
        }

    elif archetype == 5:
        # Noktalama İşaretleri
        q_text = "Genç adam [ ] telaşla kapıyı açan görevliye doğru yaklaştı [ ] \"Müdür Bey henüz çıkmadı, değil mi [ ]\" Görevli başını hafifçe sallayarak yanıt verdi [ ] \"Biraz önce ayrıldı efendim.\"\n\nBu parçada yay ayraçla [ ] gösterilen yerlere sırasıyla hangi noktalama işaretleri getirilmelidir?"
        corr = ", (Virgül) — : (İki Nokta) — ? (Soru İşareti) — : (İki Nokta)"
        dist = [
            "; (Noktalı Virgül) — , (Virgül) — . (Nokta) — , (Virgül)",
            ", (Virgül) — ; (Noktalı Virgül) — ! (Ünlem) — . (Nokta)",
            ". (Nokta) — : (İki Nokta) — ? (Soru İşareti) — ; (Noktalı Virgül)"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Türkçe",
            "topic": "Noktalama İşaretleri",
            "subtopic": "Virgül, İki Nokta ve Soru İşareti",
            "learning_outcome_code": "T.8.4.16",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Özneden sonra virgül, alıntı cümle öncesinde iki nokta ve doğrudan soru bildiren cümlenin sonuna soru işareti getirilmelidir.",
            **opts
        }
        
    elif archetype == 6:
        # Yazım Kuralları
        rules = [
            ("Tarihlerin ve gün adlarının yazımı", "Sınav 15 Haziran pazar günü yapılacaktır.", "Sınav 15 Haziran Pazar günü yapılacaktır."),
            ("Büyük harflerin kullanımı", "Batı medeniyeti doğu felsefesinden çok şey öğrenmiştir.", "Batı medeniyeti Doğu felsefesinden çok şey öğrenmiştir."),
            ("Birleşik sözcüklerin yazımı", "Olaylar karşısında soğuk kanlı davranmayı başardı.", "Olaylar karşısında soğukkanlı davranmayı başardı.")
        ]
        r = rules[index % len(rules)]
        q_text = f"Aşağıdaki cümlelerin hangisinde **yazım kurallarına tamamen uyulmuştur**?"
        corr = r[2]
        dist = [
            "Herkes bu konuda kendi bildiğince hareket etsede sonuç değişmedi.",
            "Törende bir çok öğrenci başarı belgesi alarak ailesini gururlandırdı.",
            "Evdeki eşyaları gelişi güzel kutulara doldurup kamyona yüklediler."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Türkçe",
            "topic": "Yazım Kuralları",
            "subtopic": "Büyük Harfler ve Birleşik Sözcükler",
            "learning_outcome_code": "T.8.4.15",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Doğru cümlede yazım kuralı eksiksiz uygulanmıştır: '{corr}'",
            **opts
        }
        
    else:
        # Cümlede Anlam: Neden-Sonuç, Amaç-Sonuç, Koşul
        types = [
            ("Yoğun kar yağışı nedeniyle köy yolları ulaşıma kapandı.", "Neden - Sonuç"),
            ("Projesini zamanında teslim etmek için gece gündüz demeden çalıştı.", "Amaç - Sonuç"),
            ("Hafta sonu ödevlerini bitirirsen arkadaşlarınla sinemaya gidebilirsin.", "Koşul (Şart) - Sonuç"),
            ("Bu yılki buğday rekoltesi geçen yıla göre oldukça bereketliydi.", "Karşılaştırma")
        ]
        t = types[index % len(types)]
        q_text = f"\"{t[0]}\"\n\nBu cümledeki **anlam ilişkisi** aşağıdakilerden hangisidir?"
        corr = t[1]
        dist = ["Amaç - Sonuç", "Koşul (Şart) - Sonuç", "Karşılaştırma"]
        if corr in dist:
            dist.remove(corr)
            dist.append("Neden - Sonuç")
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Türkçe",
            "topic": "Cümlede Anlam",
            "subtopic": "Cümleler Arası Anlam İlişkileri",
            "learning_outcome_code": "T.8.3.14",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Verilen cümlede yargının gerçekleşme gerekçesi veya hedefi bildirilmiş olup ilişki '{corr}' türündedir.",
            **opts
        }


# ================= 2. LGS MATEMATİK =================

def gen_lgs_matematik(index: int) -> Dict[str, Any]:
    archetype = index % 8
    
    if archetype == 0:
        # Çarpanlar ve Katlar: EBOB - EKOK
        a = random.choice([24, 36, 48, 60, 72])
        b = random.choice([30, 40, 50, 80, 90])
        import math
        gcd_val = math.gcd(a, b)
        q_text = f"Bir çiftçi kenar uzunlukları ${a}$ metre ve ${b}$ metre olan dikdörtgen biçimindeki bahçesinin etrafına, köşelere de gelmek şartıyla eşit aralıklarla fidan dikecektir.\n\nBuna göre iki fidan arasındaki mesafe **en fazla kaç metre** olabilir?"
        corr = f"${gcd_val}$ m"
        dist = [f"${gcd_val + 2}$ m", f"${max(2, gcd_val - 2)}$ m", f"${gcd_val * 2}$ m"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Matematik",
            "topic": "Çarpanlar ve Katlar",
            "subtopic": "EBOB ve EKOK Problemleri",
            "learning_outcome_code": "M.8.1.1.2",
            "cognitive_domain": "Uygulama / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"Aralıkların en büyük olması için $EBOB({a}, {b})$ bulunur. $EBOB({a}, {b}) = {gcd_val}$ metredir.",
            **opts
        }
        
    elif archetype == 1:
        # Üslü İfadeler: Bilimsel Gösterim
        n = random.randint(12, 85)
        power = random.randint(5, 8)
        num_str = f"{n}" + "0" * power
        scientific = f"{n/10:.1f} \\times 10^{{{power+1}}}"
        q_text = f"Bir laboratuvarda incelenen bir bakteri kültürünün toplam kütlesi yaklaşık ${num_str}$ miligram olarak ölçülmüştür.\n\nBu değerin **bilimsel gösterimi** aşağıdakilerden hangisidir?"
        corr = f"${scientific}$"
        dist = [
            f"${n} \\times 10^{{{power}}}$",
            f"${n/100:.2f} \\times 10^{{{power+2}}}$",
            f"${n/10:.1f} \\times 10^{{{power}}}$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Matematik",
            "topic": "Üslü İfadeler",
            "subtopic": "Bilimsel Gösterim ve Çözümleme",
            "learning_outcome_code": "M.8.1.2.5",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Bilimsel gösterimde $1 \\le |a| < 10$ olmalıdır. ${num_str} = {scientific}$ olarak yazılır.",
            **opts
        }

    elif archetype == 2:
        # Kareköklü İfadeler: Alan ve Kenar Bağıntısı
        side = random.choice([6, 7, 8, 9, 10, 11, 12])
        area = side * side
        perimeter = 4 * side
        q_text = f"Alanı ${area}\\text{{ cm}}^2$ olan kare şeklindeki bir panonun kenarlarına bir sıra renkli şerit çekilecektir.\n\nBu iş için gereken şeridin uzunluğu **kaç santimetredir**?"
        corr = f"${perimeter}$ cm"
        dist = [f"${2 * side}$ cm", f"${area // 2}$ cm", f"${perimeter + 4}$ cm"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Matematik",
            "topic": "Kareköklü İfadeler",
            "subtopic": "Tam Kare Sayılar ve Karekök",
            "learning_outcome_code": "M.8.1.3.1",
            "cognitive_domain": "Uygulama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Karenin bir kenarı $\\sqrt{{{area}}} = {side}$ cm'dir. Çevresi $4 \\times {side} = {perimeter}$ cm'dir.",
            **opts
        }

    elif archetype == 3:
        # Olasılık: Basit Olaylar
        red = random.randint(4, 8)
        blue = random.randint(5, 9)
        yellow = random.randint(3, 6)
        total = red + blue + yellow
        import math
        g = math.gcd(blue, total)
        p_num = blue // g
        p_den = total // g
        q_text = f"Bir torbada özdeş ${red}$ kırmızı, ${blue}$ mavi ve ${yellow}$ sarı bilye bulunmaktadır.\n\nTorbaya geri bırakılmaksızın rastgele çekilen bir bilyenin **mavi olma olasılığı** kaçtır?"
        corr = f"$\\frac{{{p_num}}}{{{p_den}}}$"
        dist = [
            f"$\\frac{{{red}}}{{{total}}}$",
            f"$\\frac{{{yellow}}}{{{total}}}$",
            f"$\\frac{{{blue}}}{{{total - 1}}}$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Matematik",
            "topic": "Basit Olayların Olasılığı",
            "subtopic": "Olasılık Hesabı",
            "learning_outcome_code": "M.8.5.1.5",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Toplam bilye sayısı ${total}$'dur. İstenen durum sayısı ${blue}$ mavi bilyedir. Olasılık $\\frac{{{blue}}}{{{total}}} = \\frac{{{p_num}}}{{{p_den}}}$ olur.",
            **opts
        }

    elif archetype == 4:
        # Cebirsel İfadeler ve Özdeşlikler
        a_val = random.randint(2, 5)
        # (x + a)^2 = x^2 + 2ax + a^2
        q_text = f"Bir kenar uzunluğu $(x + {a_val})$ cm olan kare şeklindeki kartonun alanı santimetrekare cinsinden aşağıdaki cebirsel ifadelerden hangisine eşittir?"
        corr = f"$x^2 + {2*a_val}x + {a_val**2}$"
        dist = [
            f"$x^2 + {a_val**2}$",
            f"$x^2 + {a_val}x + {a_val**2}$",
            f"$2x^2 + {2*a_val}x + {a_val**2}$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Matematik",
            "topic": "Cebirsel İfadeler ve Özdeşlikler",
            "subtopic": "Tam Kare Özdeşliği",
            "learning_outcome_code": "M.8.2.1.3",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"$(a+b)^2 = a^2 + 2ab + b^2$ özdeşliğinden $(x+{a_val})^2 = x^2 + {2*a_val}x + {a_val**2}$ bulunur.",
            **opts
        }

    elif archetype == 5:
        # Doğrusal Denklemler ve Eğim
        dy = random.choice([3, 4, 6, 8])
        dx = random.choice([2, 5, 8, 10])
        import math
        g = math.gcd(dy, dx)
        m_num = dy // g
        m_den = dx // g
        q_text = f"Dikey yüksekliği ${dy}$ metre, yatay uzunluğu ${dx}$ metre olan bir engelli rampasının **eğimi** kaçtır?"
        corr = f"$\\frac{{{m_num}}}{{{m_den}}}$" if m_den != 1 else f"${m_num}$"
        dist = [
            f"$\\frac{{{m_den}}}{{{m_num}}}$",
            f"$\\frac{{{dy}}}{{{dx + dy}}}$",
            f"$\\frac{{{dx}}}{{{dx + dy}}}$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Matematik",
            "topic": "Doğrusal Denklemler",
            "subtopic": "Eğim ve Grafik Yorumlama",
            "learning_outcome_code": "M.8.2.2.5",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Eğim $m = \\frac{{\\text{{Dikey}}}}{{\\text{{Yatay}}}} = \\frac{{{dy}}}{{{dx}}} = \\frac{{{m_num}}}{{{m_den}}}$'dir.",
            **opts
        }

    elif archetype == 6:
        # Pisagor Bağıntısı
        triplets = [(3, 4, 5), (5, 12, 13), (6, 8, 10), (8, 15, 17)]
        t = triplets[index % len(triplets)]
        q_text = f"Düz bir duvara dayalı olan merdivenin ayağı duvardan ${t[0]}$ metre uzaktadır. Merdivenin duvara değdiği noktanın yerden yüksekliği ${t[1]}$ metredir.\n\nBuna göre merdivenin boyu **kaç metredir**?"
        corr = f"${t[2]}$ m"
        dist = [f"${t[1] + 1}$ m", f"${t[0] + t[1]}$ m", f"${t[2] + 2}$ m"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Matematik",
            "topic": "Üçgenler",
            "subtopic": "Pisagor Bağıntısı",
            "learning_outcome_code": "M.8.3.1.5",
            "cognitive_domain": "Uygulama",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"Pisagor teoremine göre $a^2 + b^2 = c^2 \\implies {t[0]}^2 + {t[1]}^2 = {t[0]**2 + t[1]**2} = {t[2]}^2 \\implies c = {t[2]}$ metredir.",
            **opts
        }
        
    else:
        # Veri Analizi: Daire Grafiği
        total_deg = 360
        cat_a = 90
        cat_b = 120
        cat_c = total_deg - (cat_a + cat_b)
        q_text = f"Bir okuldaki öğrencilerin katıldıkları kulüplere göre dağılımı daire grafiğinde gösterilmiştir. Müzik kulübü ${cat_a}^\\circ$, Spor kulübü ${cat_b}^\\circ$ ile temsil edilmektedir.\n\nGeriye kalan öğrencilerin tamamı Resim kulübünde olduğuna göre, Resim kulübünü temsil eden **merkez açı kaç derecedir**?"
        corr = f"${cat_c}^\\circ$"
        dist = [f"${cat_c + 15}^\\circ$", f"${cat_c - 15}^\\circ$", f"${180}^\\circ$"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Matematik",
            "topic": "Veri Analizi",
            "subtopic": "Daire Grafiği Yorumlama",
            "learning_outcome_code": "M.8.4.1.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Dairenin tamamı $360^\\circ$'dir. $360 - ({cat_a} + {cat_b}) = 360 - {cat_a + cat_b} = {cat_c}^\\circ$ bulunur.",
            **opts
        }


# ================= 3. LGS FEN BİLİMLERİ =================

def gen_lgs_fen(index: int) -> Dict[str, Any]:
    archetype = index % 7
    
    if archetype == 0:
        # Mevsimler ve İklim: Eksen Eğikliği
        dates = [
            ("21 Haziran", "Kuzey Yarım Küre'de yaz başlangıcıdır ve en uzun gündüz yaşanır.", "Güney Yarım Küre'de yaz mevsimi başlar.", "Ekvator'a güneş ışınları dik açıyla düşer.", "Tüm dünyada gece ve gündüz süreleri eşitlenir."),
            ("21 Aralık", "Kuzey Yarım Küre'de kış başlangıcıdır ve en uzun gece yaşanır.", "Kuzey Yarım Küre'de gündüzler gecelerden daha uzundur.", "Güneş ışınları Yengeç Dönencesi'ne dik düşer.", "Kuzey Kutup Noktası'nda 24 saat gündüz yaşanır."),
            ("21 Mart", "Güneş ışınları Ekvator'a öğle vakti dik düşer ve tüm dünyada gece-gündüz eşitliği (ekinoks) yaşanır.", "Kuzey Yarım Küre'de sonbahar mevsimi başlar.", "Yalnızca kutup noktalarında gece yaşanır.", "Güney Yarım Küre'de en uzun gündüz kaydedilir.")
        ]
        d = dates[index % len(dates)]
        q_text = f"Dünya'nın Güneş etrafındaki dolanımı ve $23^\\circ 27'$ eksen eğikliği mevsimlerin oluşumunu sağlar.\n\nBuna göre **{d[0]} tarihi** ile ilgili aşağıdaki ifadelerden hangisi **doğrudur**?"
        opts = format_lgs_options(d[1], [d[2], d[3], d[4]])
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Fen Bilimleri",
            "topic": "Mevsimler ve İklim",
            "subtopic": "Dünya'nın Dönme Ekseni ve Mevsimler",
            "learning_outcome_code": "F.8.1.1.1",
            "cognitive_domain": "Kavrama / Analiz",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"{d[0]} tarihinde: {d[1]}",
            **opts
        }

    elif archetype == 1:
        # DNA ve Genetik Kod: Eşlenme ve Nükleotidler
        adenine = random.choice([250, 300, 450, 600])
        guanine = random.choice([350, 400, 550, 700])
        total = 2 * (adenine + guanine)
        q_text = f"Çift zincirli bir DNA molekülünde ${adenine}$ adet Adenin ve ${guanine}$ adet Guanin nükleotidi bulunmaktadır.\n\nBuna göre bu DNA molekülündeki **toplam deoksiriboz şekeri (veya toplam nükleotid)** sayısı kaçtır?"
        corr = f"${total}$"
        dist = [f"${total // 2}$", f"${adenine + guanine}$", f"${total + 200}$"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Fen Bilimleri",
            "topic": "DNA ve Genetik Kod",
            "subtopic": "DNA Yapısı ve Nükleotid Dizilimi",
            "learning_outcome_code": "F.8.2.1.2",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Adenin = Timin = {adenine}, Guanin = Sitozin = {guanine}. Toplam nükleotid = $2 \\times ({adenine} + {guanine}) = {total}$'dir. Nükleotid sayısı şeker sayısına eşittir.",
            **opts
        }

    elif archetype == 2:
        # Basınç: Katı ve Sıvı Basıncı
        q_text = "Özdeş küpler kullanılarak yapılan bir deneyde, tuğlanın zeminle temas eden yüzey alanı yarıya indirildiğinde zemine uyguladığı basınç incelenmektedir.\n\nBuna göre tuğlanın ağırlığı sabit tutulup **taban alanı yarıya indirilirse**, zemine uyguladığı katı basıncı nasıl değişir?"
        corr = "2 katına çıkar"
        dist = ["Yarıya iner", "Değişmez", "4 katına çıkar"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Fen Bilimleri",
            "topic": "Basınç",
            "subtopic": "Katı Basıncı ve Yüzey Alanı",
            "learning_outcome_code": "F.8.3.1.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Katı basıncı $P = \\frac{G}{S}$ formülüyle hesaplanır. Yüzey alanı ($S$) ile basınç ($P$) ters orantılıdır. Yüzey alanı yarıya inerse basınç 2 katına çıkar.",
            **opts
        }

    elif archetype == 3:
        # Madde ve Endüstri: Asitler ve Bazlar
        ph_val = random.choice([2.5, 3.0, 11.5, 12.0])
        is_acid = ph_val < 7.0
        q_text = f"Bir çözeltinin $25^\\circ\\text{{C}}$'deki pH değeri ${ph_val}$ olarak ölçülmüştür.\n\nBu çözelti ile ilgili aşağıdaki ifadelerden hangisi **kesinlikle doğrudur**?"
        corr = "Mavi turnusol kağıdını kırmızıya çevirir ve tatları ekşidir." if is_acid else "Kırmızı turnusol kağıdını maviye çevirir ve ele kayganlık hissi verir."
        dist = [
            "Ele kayganlık hissi verir ve porselen eşyaları matlaştırır." if is_acid else "Metallerle tepkimeye girerek hidrojen gazı açığa çıkarır.",
            "Sulu çözeltisinde $OH^-$ iyonu sayısı $H^+$ iyonu sayısından fazladır." if is_acid else "Tadı ekşidir ve sulu çözeltisinde $H^+$ derişimi yüksektir.",
            "Nötr bir tuz çözeltisidir."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Fen Bilimleri",
            "topic": "Madde ve Endüstri",
            "subtopic": "Asitler ve Bazların Özellikleri",
            "learning_outcome_code": "F.8.4.4.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"pH = {ph_val} değeri {'asidik' if is_acid else 'bazik'} ortamı gösterir. {corr}",
            **opts
        }

    elif archetype == 4:
        # Basit Makineler: Kaldıraçlar ve Makaralar
        q_text = "Ağırlığı önemsenmeyen sürtünmesiz bir hareketli makara sisteminde $G$ ağırlığındaki bir yük, düşey olarak $F$ kuvveti ile dengelenmektedir.\n\nBu sistemle ilgili olarak;\nI. Kuvvetten 2 kat kazanç sağlar.\nII. Yoldan 2 kat kayıp vardır.\nIII. İşten ve enerjiden kazanç sağlanır.\n\nyargılarından hangileri **doğrudur**?"
        corr = "I ve II"
        dist = ["Yalnız I", "Yalnız III", "I, II ve III"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Fen Bilimleri",
            "topic": "Basit Makineler",
            "subtopic": "Makaralar ve Kuvvet Kazancı",
            "learning_outcome_code": "F.8.5.1.1",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Hareketli makarada kuvvet kazancı 2'dir, bu nedenle yoldan 2 kat kayıp olur. Hiçbir basit makinede işten veya enerjiden kazanç sağlanamaz (III yanlıştır).",
            **opts
        }

    elif archetype == 5:
        # Canlılar ve Enerji: Fotosentez ve Solunum
        q_text = "Işıklı bir ortamda cam fanus içerisine yeşil bir saksı bitkisi ve canlı bir fare konulmuştur. Fanus hava almayacak şekilde kapatılmış ve kireç suyu eklenmiştir.\n\nBitkinin fotosentez hızını **artırmak** için aşağıdaki uygulamalardan hangisi yapılmalıdır?"
        corr = "Ortama verilen ışık şiddetini ve karbondioksit miktarını artırmak"
        dist = [
            "Ortamın sıcaklığını $60^\\circ\\text{C}$'ye çıkarmak",
            "Fanusa yalnızca yeşil dalga boyunda ışık göndermek",
            "Fanusun üzerini siyah bir örtü ile tamamen kapatmak"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Fen Bilimleri",
            "topic": "Canlılar ve Enerji İlişkileri",
            "subtopic": "Fotosentez Hızına Etki Eden Faktörler",
            "learning_outcome_code": "F.8.6.2.2",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "Fotosentez hızı ışık şiddeti ve $CO_2$ derişimi arttıkça belirli bir sınıra kadar artar. Aşırı sıcaklık enzimleri bozar, yeşil ışıkta ise fotosentez en yavaştır.",
            **opts
        }

    else:
        # Elektrik Yükleri ve Elektriklenme
        q_text = "Nötr ve yalıtkan iki cisim birbirine sürtüldüğünde elektron alışverişi gerçekleşir.\n\nBuna göre yün kumaşa sürtülen ebonit (plastik) çubuk ve ipek kumaşa sürtülen cam çubuğun kazandıkları **yük cinsleri** sırasıyla hangisinde doğru verilmiştir?"
        corr = "Negatif (-) ve Pozitif (+)"
        dist = [
            "Pozitif (+) ve Negatif (-)",
            "Her ikisi de Negatif (-)",
            "Her ikisi de Pozitif (+)"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Fen Bilimleri",
            "topic": "Elektrik Yükleri ve Elektrik Enerjisi",
            "subtopic": "Sürtünme ile Elektriklenme",
            "learning_outcome_code": "F.8.7.1.1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Ebonit çubuk yün kumaştan elektron alarak eksi (-) yüklenir. Cam çubuk ise ipek kumaşa elektron vererek artı (+) yüklenir.",
            **opts
        }


# ================= 4. LGS T.C. İNKILAP TARİHİ =================

def gen_lgs_inkilap(index: int) -> Dict[str, Any]:
    archetype = index % 6
    
    if archetype == 0:
        # Millî Uyanış: Genelgeler ve Kongreler
        events = [
            ("Amasya Genelgesi", "'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.'", "Millî Mücadele'nin gerekçesi, amacı ve yöntemi ilk kez açıkça ilan edilmiştir."),
            ("Erzurum Kongresi", "'Manda ve himaye kabul edilemez. Millî sınırlar içinde vatan bir bütündür, bölünemez.'", "Toplanış bakımından bölgesel, aldığı kararlar bakımından ulusal nitelik taşımaktadır."),
            ("Sivas Kongresi", "'Tüm cemiyetler Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti adı altında birleştirilmiştir.'", "Millî Mücadele tek merkezden yönetilmeye başlanmış ve birlik sağlanmıştır.")
        ]
        e = events[index % len(events)]
        q_text = f"Kurtuluş Savaşı hazırlık döneminde yayımlanan **{e[0]}**'nde yer alan;\n\"{e[1]}\"\nkararı ile aşağıdakilerden hangisi hedeflenmiştir?"
        corr = e[2]
        dist = [
            "İstanbul Hükümeti'nin otoritesini güçlendirerek saltanatı korumak",
            "Yabancı bir devletin manda ve himayesini kabul etmek",
            "Bölgesel direniş cemiyetlerinin bağımsız hareket etmesini sağlamak"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar",
            "subtopic": "Genelgeler ve Kongreler Dönemi",
            "learning_outcome_code": "İTA.8.2.3",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"{e[0]} kararlarının temel amacı: {e[2]}",
            **opts
        }

    elif archetype == 1:
        # Cepheler ve Askerî Zaferler
        battles = [
            ("I. İnönü Zaferi", "Düzenli ordunun Batı Cephesi'ndeki ilk zaferidir; Londra Konferansı toplanmış ve İstiklal Marşı kabul edilmiştir."),
            ("Sakarya Meydan Muharebesi", "'Hattı müdafaa yoktur, sathı müdafaa vardır. O satıh bütün vatandır.' emri verilmiş ve Türk ordusunun son savunma savaşı olmuştur."),
            ("Büyük Taarruz ve Başkomutanlık Meydan Muharebesi", "Anadolu'daki işgal tamamen sona erdirilmiş ve Mudanya Ateşkes Antlaşması'na ortam hazırlanmıştır.")
        ]
        b = battles[index % len(battles)]
        q_text = f"Kurtuluş Savaşı Batı Cephesi'nde kazanılan **{b[0]}**'nin millî ve uluslararası sonuçları düşünüldüğünde, aşağıdakilerden hangisi bu zaferin en belirgin sonucudur?"
        corr = b[1]
        dist = [
            "Sevr Antlaşması şartlarının tamamen kabul edilmesi",
            "Kuvâ-yı Millîye birliklerinin orduyu yönetmeye devam etmesi",
            "Güney Cephesi'nde Fransız işgalinin genişlemesi"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Millî Bir Destan: Ya İstiklal Ya Ölüm!",
            "subtopic": "Batı Cephesi ve Zaferler",
            "learning_outcome_code": "İTA.8.3.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"{b[0]} sonucunda {b[1]}",
            **opts
        }

    elif archetype == 2:
        # Atatürk İlkeleri
        principles = [
            ("Cumhuriyetçilik", "Halkın kendi yöneticilerini serbest seçimlerle belirlemesi ve millî egemenliğin esas alınmasıdır."),
            ("Milliyetçilik", "Türk milletinin bağımsızlığını, dilini, tarihini ve kültürünü yüceltmeyi amaçlar; ırkçılığı reddeder."),
            ("Halkçılık", "Toplumda hiçbir zümreye ayrıcalık tanınmaması, kanun önünde eşitlik ve sosyal adalet ilkesidir."),
            ("Laiklik", "Din ve devlet işlerinin ayrılması, akıl ve bilimin rehber edinilmesi ve vicdan özgürlüğünün güvenceye alınmasıdır."),
            ("Devletçilik", "Özel sektörün yetersiz kaldığı alanlarda büyük yatırımların devlet eliyle yürütülmesidir.")
        ]
        p = principles[index % len(principles)]
        q_text = f"TBMM'nin açılması, saltanatın kaldırılması ve kadınlara seçme-seçilme hakkının verilmesi öncelikle Atatürk'ün hangi ilkesiyle doğrudan ilişkilidir?" if p[0] == "Cumhuriyetçilik" else f"\"{p[1]}\"\n\nBu açıklamada tanımlanan **Atatürk ilkesi** aşağıdakilerden hangisidir?"
        corr = p[0]
        dist = [pr[0] for pr in principles if pr[0] != p[0]][:3]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Atatürkçülük ve Çağdaşlaşan Türkiye",
            "subtopic": "Atatürk İlkeleri",
            "learning_outcome_code": "İTA.8.4.1",
            "cognitive_domain": "Kavrama / Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Verilen tanım ve inkılaplar doğrudan Atatürk'ün '{corr}' ilkesini yansıtmaktadır.",
            **opts
        }

    elif archetype == 3:
        # Atatürk'ün Kişilik Özellikleri
        traits = [
            ("Çanakkale Savaşları'nda düşmanın Anafartalar ve Conkbayırı'ndan çıkarma yapacağını önceden tahmin etmesi", "İleri Görüşlülüğü"),
            ("Askeri dehasının yanında hukuk, tarih, dil ve sanat alanlarında eserler vermesi ve inkılaplar yapması", "Çok Yönlülüğü"),
            ("Milli Mücadele'nin en zor günlerinde bile umutsuzluğa kapılmayıp 'Geldikleri gibi giderler!' demesi", "Vatanseverliği ve Kararlılığı")
        ]
        t = traits[index % len(traits)]
        q_text = f"Mustafa Kemal Atatürk'ün {t[0]}, onun öncelikle hangi **kişisel özelliğini** kanıtlamaktadır?"
        corr = t[1]
        dist = ["Gelenekçiliği", "Sabırsızlığı", "Bölgeselciliği"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Bir Kahraman Doğuyor",
            "subtopic": "Atatürk'ün Kişilik Özellikleri",
            "learning_outcome_code": "İTA.8.1.4",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": f"Bu tarihsel tutum Atatürk'ün '{corr}' vasfının açık bir göstergesidir.",
            **opts
        }

    elif archetype == 4:
        # Dış Politika: Montrö ve Hatay
        pols = [
            ("Montrö Boğazlar Sözleşmesi (1936)", "Boğazlar Komisyonu kaldırılmış ve Boğazların kontrolü ile askeri güvenliği tamamen Türkiye'ye geçmiştir."),
            ("Hatay'ın Anavatana Katılması (1939)", "Atatürk'ün 'Şahsi meselemdir' dediği Misak-ı Millî hedefi diplomatik yollarla barışçıl şekilde tamamlanmıştır."),
            ("Balkan Antantı ve Sadabat Paktı", "Türkiye'nin hem batı hem de doğu sınırlarının güvenliğini sağlamak için bölgesel barış ittifakları kurmasıdır.")
        ]
        pl = pols[index % len(pols)]
        q_text = f"Atatürk dönemi Türk dış politikasında imzalanan **{pl[0]}** ile ulaşılan temel kazanım aşağıdakilerden hangisidir?"
        corr = pl[1]
        dist = [
            "Kapitülasyonların yeniden yürürlüğe konması",
            "Türkiye'nin tek taraflı olarak tarafsızlığını ilan etmesi",
            "Milletler Cemiyeti üyeliğinden ayrılınması"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Atatürk Dönemi Türk Dış Politikası",
            "subtopic": "Boğazlar ve Hatay Meselesi",
            "learning_outcome_code": "İTA.8.6.2",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"{pl[0]} sayesinde: {pl[1]}",
            **opts
        }

    else:
        # Lozan Barış Antlaşması
        q_text = "Lozan Barış Antlaşması'nda kapitülasyonların kayıtsız şartsız kaldırılması ve Düyun-ı Umumiye idaresinin sonlandırılması Türkiye'nin öncelikle hangi alandaki **bağımsızlığını** tescillemiştir?"
        corr = "Ekonomik ve Mali Bağımsızlık"
        dist = [
            "Dini ve Mezhepsel Ayrıcalıklar",
            "Yalnızca Askeri Savunma Anlaşmaları",
            "Geleneksel Hukuk Kuralları"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Millî Bir Destan: Ya İstiklal Ya Ölüm!",
            "subtopic": "Lozan Barış Antlaşması",
            "learning_outcome_code": "İTA.8.3.7",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Kapitülasyonların kaldırılması Osmanlı'dan kalan ekonomik prangaları sökerek Türkiye'nin tam ekonomik bağımsızlığını sağlamıştır.",
            **opts
        }


# ================= 5. LGS DİN KÜLTÜRÜ VE AHLAK BİLGİSİ =================

def gen_lgs_din(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # Evrensel Yasalar: Fiziksel, Biyolojik, Toplumsal
        laws = [
            ("Gemi ve uçakların aerodinamik ilkelerle hareket etmesi, suyun kaldırma kuvveti", "Fiziksel Yasalar"),
            ("Canlıların solunum, üreme ve genetik özelliklerinin nesilden nesile aktarılması", "Biyolojik Yasalar"),
            ("Gelir adaletsizliği ve haksızlığın arttığı toplumlarda huzursuzluk ve kaosun çıkması", "Toplumsal Yasalar")
        ]
        l = laws[index % len(laws)]
        q_text = f"Kur'an-ı Kerim'de Allah'ın evrene koyduğu değişmez ölçü ve düzene 'Sünnetullah' denir.\n\nBuna göre;\n\"{l[0]}\"\nörneği Allah'ın evrendeki hangi **yasası** kapsamında değerlendirilir?"
        corr = l[1]
        dist = ["Fiziksel Yasalar", "Biyolojik Yasalar", "Toplumsal Yasalar"]
        dist.remove(corr)
        dist.append("Manevi Tevekkül Yasaları")
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Kader İnancı",
            "subtopic": "Evrensel Yasalar (Sünnetullah)",
            "learning_outcome_code": "D.8.1.2",
            "cognitive_domain": "Kavrama / Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": f"Verilen olgu ve ilkeler {corr} tanımına girmektedir.",
            **opts
        }

    elif archetype == 1:
        # Zekat ve Sadaka: Nisap ve İnfak
        q_text = "İslam dininde bir Müslümanın zekat vermekle yükümlü olabilmesi için temel ihtiyaçları ve borçları dışında sahip olması gereken asgari zenginlik ölçüsüne ne ad verilir?"
        corr = "Nisap Miktarı"
        dist = ["Sadaka-i Fıtır", "İnfak", "Öşür"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Zekat ve Sadaka",
            "subtopic": "Zekat İbadeti ve Şartları",
            "learning_outcome_code": "D.8.2.1",
            "cognitive_domain": "Hatırlama / Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Dinen zengin sayılmanın asgari ölçüsüne 'Nisap' denir (altın için yaklaşık 80.18 gram).",
            **opts
        }

    elif archetype == 2:
        # Dinin Temel Gayesi (Zarûrât-ı Hamse)
        goals = [
            ("İslam'da adam öldürmenin büyük günah sayılması ve meşru müdafaa hakkı", "Canın Korunması"),
            ("Hırsızlık, rüşvet, faiz ve gaspın kesin olarak haram kılınması", "Malın Korunması"),
            ("Alkol, uyuşturucu ve zihni uyuşturan maddelerin yasaklanması", "Aklın Korunması"),
            ("Zinanın yasaklanıp aile kurumunun evlilik bağıyla teşvik edilmesi", "Neslin Korunması"),
            ("İnanç ve ibadet özgürlüğünün güvence altına alınması ve baskının reddi", "Dinin Korunması")
        ]
        g = goals[index % len(goals)]
        q_text = f"İslam dini insanların dünya ve ahiret mutluluğunu sağlamak için 5 temel değeri koruma altına almıştır.\n\nBuna göre;\n\"{g[0]}\"\nhükmü öncelikle **hangi temel hakkın korunmasına** yöneliktir?"
        corr = g[1]
        dist = [gl[1] for gl in goals if gl[1] != g[1]][:3]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Din ve Hayat",
            "subtopic": "Dinin Temel Gayeleri (Zarûrât-ı Hamse)",
            "learning_outcome_code": "D.8.3.1",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": f"Verilen hüküm doğrudan {corr} ilkesini teminat altına almayı hedefler.",
            **opts
        }

    elif archetype == 3:
        # Tevekkül Kavramı
        q_text = "Bir hedefe ulaşmak veya bir tehlikeden korunmak için elden gelen tüm maddi ve manevi gayreti gösterip gerekli tedbirleri aldıktan sonra Allah'a güvenip sonucu O'ndan beklemeye ne ad verilir?"
        corr = "Tevekkül"
        dist = ["Kaza", "Ecel", "Rızık"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Kader İnancı",
            "subtopic": "Tevekkül ve İnsan İradesi",
            "learning_outcome_code": "D.8.1.3",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Tedbir aldıktan sonra Allah'a güvenmeye tevekkül denir. Tedbir almadan beklemek tembelliktir.",
            **opts
        }

    else:
        # Sadaka-i Cariye
        q_text = "Peygamber Efendimiz (s.a.v.): 'İnsan ölünce üç şey dışında ameli kesilir: Sadaka-i cariye, faydalanılan ilim ve kendisine dua eden hayırlı evlat.' buyurmuştur.\n\nBuna göre aşağıdakilerden hangisi bir **Sadaka-i Cariye** örneğidir?"
        corr = "İnsanların ücretsiz faydalanacağı bir çeşme, köprü veya okul yaptırmak"
        dist = [
            "Bir yoksula bayram günü bir öğün yemek ikram etmek",
            "Yoldaki rahatsız edici bir taşı kenara çekmek",
            "Arkadaşına tebessüm ederek selam vermek"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Zekat ve Sadaka",
            "subtopic": "Sadaka Çeşitleri ve Sadaka-i Cariye",
            "learning_outcome_code": "D.8.2.3",
            "cognitive_domain": "Uygulama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Kişi öldükten sonra da sevabı devam eden kalıcı kamu yararı taşıyan hayırlara Sadaka-i Cariye denir.",
            **opts
        }


# ================= 6. LGS İNGİLİZCE =================

def gen_lgs_ingilizce(index: int) -> Dict[str, Any]:
    archetype = index % 5
    
    if archetype == 0:
        # Friendship: Accepting / Refusing / Excuses
        q_text = "Sandy: \"We are organizing a surprise birthday party for Emily this Friday. Would you like to join us?\"\n\nMark: \"I'd love to, but <u>I have to finish my science project</u> that day.\"\n\nAccording to the dialogue, Mark —."
        corr = "refuses the invitation by making an excuse"
        dist = [
            "accepts the invitation and brings a gift",
            "doesn't get on well with Emily",
            "invites Sandy to his own birthday party"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "İngilizce",
            "topic": "Friendship",
            "subtopic": "Accepting and Refusing with Excuses",
            "learning_outcome_code": "E.8.1.L1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "Mark 'I'd love to, but...' diyerek daveti mazeret bildirerek reddetmektedir (refuses by making an excuse).",
            **opts
        }

    elif archetype == 1:
        # Teen Life: Preferences
        q_text = "Alex loves outdoor activities and adventurous sports. He can't stand listening to classical music because he finds it boring. He prefers rock music and trekking in the mountains.\n\nWhich of the following is **CORRECT** according to the text?"
        corr = "Alex enjoys trekking and prefers energetic music."
        dist = [
            "Alex is fond of listening to classical music concerts.",
            "Alex hates doing outdoor sports.",
            "Alex thinks rock music is unbearable."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "İngilizce",
            "topic": "Teen Life",
            "subtopic": "Expressing Likes, Dislikes and Preferences",
            "learning_outcome_code": "E.8.2.R1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Metinde Alex'in doğa sporlarını ve rock müziği sevdiği açıkça belirtilmektedir.",
            **opts
        }

    elif archetype == 2:
        # In The Kitchen: Recipe Steps
        q_text = "**Recipe for Omelet:**\n1. First, crack two eggs into a bowl.\n2. Second, add a pinch of salt and whisk well.\n3. Next, melt some butter in a frying pan.\n4. After that, pour the mixture into the pan and cook for 3 minutes.\n5. Finally, serve it hot.\n\nWhat should you do **BEFORE** melting the butter in the pan?"
        corr = "Add salt and whisk the eggs well."
        dist = [
            "Pour the mixture into the hot pan.",
            "Serve the omelet hot on a plate.",
            "Cook both sides for 5 minutes."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "İngilizce",
            "topic": "In The Kitchen",
            "subtopic": "Describing Simple Processes and Sequences",
            "learning_outcome_code": "E.8.3.R1",
            "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil",
            "question_text": q_text,
            "explanation": "3. adımdan (melt butter) önceki adım 2. adımdır: 'add a pinch of salt and whisk well'.",
            **opts
        }

    elif archetype == 3:
        # On The Phone: Phone etiquette
        q_text = "Secretary: \"Good morning, Tech Support. How may I help you?\"\n\nCaller: \"Hello! May I speak to Mr. Davis, please?\"\n\nSecretary: \"<u>Hold on a moment, please. I'll put you through.</u>\"\n\nWhat does the secretary mean by the underlined sentence?"
        corr = "She wants the caller to wait while connecting him."
        dist = [
            "Mr. Davis is not in his office right now.",
            "The line is engaged so she hangs up the phone.",
            "She asks the caller to leave a voicemail message."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "İngilizce",
            "topic": "On The Phone",
            "subtopic": "Phone Conversations and Etiquette",
            "learning_outcome_code": "E.8.4.L1",
            "cognitive_domain": "Kavrama",
            "difficulty": "Orta",
            "question_text": q_text,
            "explanation": "'Hold on a moment... I'll put you through' ifadesi 'Hatta bekleyin, bağlıyorum' anlamına gelir.",
            **opts
        }

    else:
        # The Internet / Natural Forces
        q_text = "To stay safe online, you should follow these rules:\n- Do not share your personal information with strangers.\n- Create strong passwords with numbers and letters.\n- Never open suspicious links or files.\n\nWhich of the following behavior is **UNSAFE** according to the Internet safety rules?"
        corr = "Telling your home address and school name in a public chat room."
        dist = [
            "Changing your password regularly.",
            "Refusing friend requests from unknown people.",
            "Using antivirus software on your computer."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS",
            "grade_level": "8. Sınıf",
            "subject": "İngilizce",
            "topic": "The Internet",
            "subtopic": "Internet Safety and Cyber Rules",
            "learning_outcome_code": "E.8.5.R1",
            "cognitive_domain": "Uygulama",
            "difficulty": "Kolay",
            "question_text": q_text,
            "explanation": "Kişisel bilgileri (ev adresi, okul adı) yabancılarla paylaşmak tehlikelidir ve kurallara aykırıdır.",
            **opts
        }


# ================= ANA LGS SÖZLÜĞÜ VE ÜRETİCİ =================

LGS_DISPATCHER = {
    "Türkçe": gen_lgs_turkce,
    "Matematik": gen_lgs_matematik,
    "Fen Bilimleri": gen_lgs_fen,
    "T.C. İnkılap Tarihi ve Atatürkçülük": gen_lgs_inkilap,
    "Din Kültürü ve Ahlak Bilgisi": gen_lgs_din,
    "İngilizce": gen_lgs_ingilizce,
}

def generate_lgs_question(subject: str, index: int) -> Dict[str, Any]:
    func = LGS_DISPATCHER.get(subject, gen_lgs_turkce)
    return func(index)
