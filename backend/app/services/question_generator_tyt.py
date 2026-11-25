# -*- coding: utf-8 -*-
"""
TYT (Temel Yeterlilik Testi) Yeni Nesil Beceri Temelli Soru Üretim Motoru (MEB Maarif Modeli & ÖSYM Standartları)
Branşlar:
1. Türkçe
2. Temel Matematik
3. Geometri
4. Fizik
5. Kimya
6. Biyoloji
7. Tarih
8. Coğrafya
9. Felsefe
10. Din Kültürü ve Ahlak Bilgisi

Standart:
- 5 seçenek (A, B, C, D, E).
- Gerçek yaşam senaryoları, tablo/grafik/deney yorumlama, öncüllü (I, II, III) muhakeme.
- KaTeX formülleri $ ... $ biçiminde.
- Altı çizili sözcüklerde <u>...</u> etiketi zorunlu.
"""

import random
import math
from typing import Dict, Any, List


def format_tyt_options(correct_text: str, distractors: List[str]) -> Dict[str, Any]:
    """TYT için 5 seçenek (A, B, C, D, E) oluşturur."""
    letters = ["A", "B", "C", "D", "E"]
    corr_idx = random.randint(0, 4)
    clean_dist = [d for d in distractors if "ulaşılamaz" not in str(d).lower() and d != correct_text][:4]

    fillers = [
        "Kavramsal derinliğe sahip metinler dönemsel koşullarla doğrudan ilişkilidir.",
        "Sanatsal ve kültürel üretim çağın gereksinimlerinden bağımsız ele alınamaz.",
        "Bireysel deneyimler toplumsal değerlerin oluşumunda tek belirleyici unsurdur.",
        "Bilimsel ve felsefi gelişmeler toplumsal ilerlemenin temel itici gücüdür.",
        "Sistematik yaklaşımlar analitik muhakemenin ön koşuludur."
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


# ================= 1. TYT TÜRKÇE (ÖSYM YENİ NESİL MUHAKEME) =================

def gen_tyt_turkce(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    top_low = str(topic or "").lower()

    if "sözcük" in top_low:
        archetype = 1
    elif "ses" in top_low:
        archetype = 2
    elif "yazım" in top_low:
        archetype = 3
    elif "noktalama" in top_low:
        archetype = 4
    elif "öge" in top_low or "cümle" in top_low:
        archetype = 5
    elif "paragraf" in top_low or "anlatım" in top_low:
        archetype = random.choice([0, 6])
    else:
        archetype = index % 7

    if archetype == 0:
        # Yeni Nesil Paragrafta Ana Düşünce & İki Paragraf Karşılaştırma
        passages = [
            (
                "Modern çağda bilgiye erişimin saniyelere inmesi, bilginin kendisini değersizleştirmedi; ancak bilgiyi <u>içselleştirme ve hikmete dönüştürme</u> sürecini sekteye uğrattı. "
                "Eskiden bir kavramın peşinde kütüphane rafları arasında geçirilen haftalar, zihne o kavramla derin bir bağ kurma imkânı tanırdı. "
                "Şimdi ise ekranlardan akan binlerce veri kırıntısı, derinleşemeyen bir zihinde yalnızca geçici birer gürültü yaratıyor.",
                "Dijital çağda bilgiye zahmetsiz ve hızlı ulaşılması, bilginin zihinde derinlemesine işlenip kalıcı bir kavrayışa dönüşmesini zorlaştırmaktadır.",
                [
                    "İnternet teknolojileri kütüphanelerin tarihsel işlevini tamamen sona erdirmiştir.",
                    "Bilgiye hızlı erişim, bireylerin bilimsel üretim kapasitesini her alanda artırmıştır.",
                    "Geçmiş dönemlerde üretilen felsefi metinler günümüz sorunlarına çözüm üretmekte yetersizdir.",
                    "Görsel medyanın yaygınlaşması yazılı kültürün tamamen unutulmasına yol açmıştır."
                ]
            ),
            (
                "Bir edebiyat yapıtını başka bir dile çevirmek, sadece kelimeleri sözlükteki karşılıklarıyla değiştirmek değildir; bir kültürün ruhunu, tarihsel belleğini ve mizahını başka bir dilin ikliminde <u>yeniden nefes alır hale</u> getirmektir. "
                "Bu yüzdendir ki yetkin bir çevirmen, kaynak metnin sadık bir kopyacısı değil; o metni hedef dilde yeniden kuran görünmez bir eş yazardır.",
                "Nitelikli edebi çeviri, dilsel aktarımın ötesinde eserin kültürel ve estetik ruhunu hedef dilde yeniden inşa eden yaratıcı bir süreçtir.",
                [
                    "Çevirmen kaynak metindeki sözcüklerin dışına çıktığında eserin edebi değerini zedeler.",
                    "Farklı kültürlere ait edebi yapıtların başka bir dile eksiksiz çevrilmesi olanaksızdır.",
                    "Bir eserin dünya edebiyatında tanınması yazarından çok çevirmeninin üslubuna bağlıdır.",
                    "Şiir ve roman çevirilerinde dil bilgisi kuralları estetik kaygıların önünde tutulmalıdır."
                ]
            )
        ]
        p = passages[index % len(passages)]
        q_text = f"**Paragraf:**\n\"{p[0]}\"\n\nBu parçadan çıkarılabilecek **en kapsamlı yargı (ana düşünce)** aşağıdakilerden hangisidir?"
        opts = format_tyt_options(p[1], p[2])
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Türkçe",
            "topic": "Paragrafta Anlam ve Ana Düşünce", "subtopic": "Ana Düşünce ve Bütüncül Çıkarım",
            "learning_outcome_code": "TDE.TYT.1.4", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "explanation": f"Metnin merkezinde yer alan temel tez: {p[1]}",
            **opts
        }

    elif archetype == 1:
        # Altı Çizili Söz Öbeği (ÖSYM Tipi)
        items = [
            (
                "Sanatçı, ilk öykülerinde döneminin baskın edebi rüzgârlarına kapılsa da olgunluk dönemi yapıtlarında <u>kendi sesinin coğrafyasını kurmayı</u> başarmış ve edebiyatımızda benzersiz bir iz bırakmıştır.",
                "Başkalarına öykünmekten sıyrılarak tamamen özgün ve bağımsız bir sanat dünyası oluşturmak",
                [
                    "Doğup büyüdüğü yörenin coğrafi güzelliklerini eserlerinin tek konusu haline getirmek",
                    "Geleneksel anlatım kalıplarını koruyarak geniş halk kitlelerinin beğenisini kazanmak",
                    "Çağdaşlarının edebi yaklaşımlarını sert bir dille eleştirerek tartışma yaratmak",
                    "Öykülerinde yerel ağız özelliklerini kullanarak gerçekçiliği artırmaya çalışmak"
                ]
            ),
            (
                "Tarih boyunca büyük medeniyetler, farklı kültürlerle karşılaştıklarında <u>kabuklarına çekilmek</u> yerine o kültürlerin birikimini kendi potalarında eriterek yeni sentezlere ulaşmışlardır.",
                "Dış dünyayla ve farklı toplumlarla iletişimi keserek kendi içine kapanmak",
                [
                    "Askerî ve ekonomik gücünü korumak amacıyla sınır güvenliğini artırmak",
                    "Başka toplumların kültürel değerlerini hiçbir elemeden geçirmeden taklit etmek",
                    "Geçmişten gelen geleneksel kurumları çağın şartlarına göre yenilemek",
                    "Bilimsel araştırmaları yalnızca kendi dilinde yayımlamaya özen göstermek"
                ]
            )
        ]
        it = items[index % len(items)]
        q_text = f"**Parça:**\n\"{it[0]}\"\n\nBu parçadaki **altı çizili sözle** anlatılmak istenen aşağıdakilerden hangisidir?"
        opts = format_tyt_options(it[1], it[2])
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Türkçe",
            "topic": "Sözcükte Anlam", "subtopic": "Söz Öbeklerinde Bağlamsal Anlam",
            "learning_outcome_code": "TDE.TYT.1.1", "cognitive_domain": "Kavrama / Analiz",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": f"Altı çizili ifade mecaz anlamıyla '{it[1]}' durumunu anlatmaktadır.",
            **opts
        }

    elif archetype == 2:
        # Ses Bilgisi: Çoklu Ses Olayı Tespiti
        q_text = (
            "\"Kasabanın dar sokaklarında <u>ilerledikçe</u> burnumuza gelen ıhlamur kokusu, çocukluğumuzun <u>kayıp</u> hatıralarını birer birer <u>canlandırıyordu</u>; "
            "köşedeki yaşlı çınarın <u>ağaran</u> dalları altında <u>oturan</u> ihtiyarlar ise sessizce <u>etrafı</u> izliyordu.\"\n\n"
            "Bu parçada aşağıdaki ses olaylarından hangisinin örneği **yoktur**?"
        )
        corr = "Ünsüz Türemesi (İkizleşme)"
        dist = [
            "Ünsüz Benzeşmesi (Sertleşme — ilerledik-çe)",
            "Ünlü Düşmesi (Hece Düşmesi — ilerile-dikçe / kayıp)",
            "Ünsüz Yumuşaması (Değişimi — ak-aran -> ağaran)",
            "Ünlü Daralması (canlandırıyor-du / izle-yordu -> izliyordu)"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Türkçe",
            "topic": "Ses Bilgisi", "subtopic": "Metin Üzerinde Çoklu Ses Olayı Analizi",
            "learning_outcome_code": "TDE.TYT.2.1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Parçada 'ilerledikçe' (ileri-le: ünlü düşmesi, -dik-çe: ünsüz benzeşmesi), 'ağaran' (ak-aran: ünsüz yumuşaması), 'izliyordu' (izle-yor: ünlü daralması) vardır; ancak ünsüz türemesi (affetmek, hissetmek, sırrı vb.) yoktur.",
            **opts
        }

    elif archetype == 3:
        # Yazım Kuralları: ÖSYM Tarzı Öncüllü Metin
        q_text = (
            "(I) Anadolu'nun biyoçeşitliliği üzerine yapılan araştırmalarda **Toros Dağları'nın** endemik bitki örtüsü bakımından eşsiz bir hazine olduğu belirlendi. "
            "(II) Bölgede çalışan botanikçiler, özellikle **meyan kökü** ve dağ çayı türlerinin koruma altına alınması gerektiğini vurguluyor. "
            "(III) Araştırma ekibinin **14 Kasım 2026 Cumartesi** günü yayımladığı raporda iklim değişikliğinin etkileri tek tek sıralandı. "
            "(IV) Rapora göre kuraklığın etkisiyle **ardarda** yaşanan su kayıpları, bölgedeki **bir çok** canlı türünü tehdit ediyor. "
            "(V) Bilim insanları bu tehdidi önlemek için yerel yönetimlerle **iş birliği** yapılmasını öneriyor.\n\n"
            "Bu parçadaki numaralanmış cümlelerin hangisinde **yazım yanlışı** yapılmıştır?"
        )
        corr = "IV. cümlede ('art arda' ayrı ve t ile, 'birçok' ise bitişik yazılmalıdır)"
        dist = [
            "I. cümlede ('Toros Dağları'nın' ifadesinde dağ adı küçük yazılmalıdır)",
            "II. cümlede ('meyan kökü' bitişik yazılmalıdır)",
            "III. cümlede ('Cumartesi' küçük harfle başlamalıdır)",
            "V. cümlede ('iş birliği' bitişik yazılmalıdır)"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Türkçe",
            "topic": "Yazım Kuralları", "subtopic": "İkilemeler ve Birleşik Sözcüklerin Yazımı",
            "learning_outcome_code": "TDE.TYT.2.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "IV. cümlede ikileme olan 'art arda' ayrı ve 't' ile yazılmalı, belgisiz sıfat olan 'birçok' ise bitişik yazılmalıdır.",
            **opts
        }

    elif archetype == 4:
        # Noktalama İşaretleri
        q_text = (
            "Edebiyat dünyasında bazı yazarlar vardır ki tek bir romanıyla asırları aşar ( ) Cervantes, Don Kişot ile şövalye romanlarını ( ) Dostoyevski, Suç ve Ceza ile insan ruhunun karanlık dehlizlerini ( ) Kafka ise Dönüşüm ile modern bireyin yabancılaşmasını ölümsüzleştirmiştir ( )\n\n"
            "Bu parçada yay ayraçlarla ( ) belirtilen yerlere aşağıdakilerin hangisinde verilen noktalama işaretleri sırasıyla getirilmelidir?"
        )
        corr = "(:) (;) (;) (.)"
        dist = [
            "(;) (,) (,) (.)",
            "(:) (,) (;) (...)",
            "(.) (;) (,) (.)",
            "(:) (,) (,) (!)"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Türkçe",
            "topic": "Noktalama İşaretleri", "subtopic": "İki Nokta ve Noktalı Virgülün İşlevleri",
            "learning_outcome_code": "TDE.TYT.2.3", "cognitive_domain": "Uygulama / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Kendisiyle ilgili örnek verilecek cümlenin sonuna iki nokta (:), kendi içinde virgül bulunan sıralı cümleleri birbirinden ayırmak için noktalı virgül (;) ve tamamlanmış cümlenin sonuna nokta (.) konur.",
            **opts
        }

    elif archetype == 5:
        # Cümlenin Ögeleri (ÖSYM Karmaşık Tamlama Cümlesi)
        q_text = (
            "\"İnsan zihninin sınırlarını zorlayan yapay zekâ teknolojileri, karmaşık tıbbi görüntülerin erken teşhis amacıyla analiz edilmesi sürecini son yıllarda büyük ölçüde hızlandırdı.\"\n\n"
            "Bu cümlenin **ögelerinin doğru sıralanışı** aşağıdakilerin hangisinde verilmiştir?"
        )
        corr = "Özne — Belirtili Nesne — Zarf Tamlayıcısı — Zarf Tamlayıcısı — Yüklem"
        dist = [
            "Özne — Yer Tamlayıcısı — Belirtili Nesne — Zarf Tamlayıcısı — Yüklem",
            "Belirtisiz Nesne — Özne — Zarf Tamlayıcısı — Yüklem",
            "Özne — Belirtili Nesne — Yer Tamlayıcısı — Yüklem",
            "Zarf Tamlayıcısı — Özne — Belirtili Nesne — Yüklem"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Türkçe",
            "topic": "Cümlenin Ögeleri", "subtopic": "Uzun Tamlamalı Cümlelerde Öge Çözümlemesi",
            "learning_outcome_code": "TDE.TYT.2.5", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Hızlandırdı (Yüklem) | Kim/Ne? İnsan zihninin sınırlarını zorlayan yapay zekâ teknolojileri (Özne) | Neyi? karmaşık tıbbi görüntülerin erken teşhis amacıyla analiz edilmesi sürecini (Belirtili Nesne) | Ne zaman? son yıllarda (Zarf T.) | Ne kadar? büyük ölçüde (Zarf T.).",
            **opts
        }

    else:
        # Paragrafta Yapı ve Akışı Bozan Cümle
        q_text = (
            "(I) Uyku, beynin yalnızca dinlendiği pasif bir zaman dilimi değil; gün boyu edinilen bilgilerin ayıklanıp uzun süreli belleğe kaydedildiği aktif bir nörolojik onarım sürecidir. "
            "(II) Özellikle derin uyku evresinde beyin omurilik sıvısı, sinir hücreleri arasında biriken metabolik atıkları temizleyerek nörodejeneratif hastalıklara karşı koruma sağlar. "
            "(III) Uyku apnesi ve horlama gibi solunum yolu rahatsızlıkları ise cerrahi müdahalelerle veya özel maskelerle tedavi edilebilmektedir. "
            "(IV) Bu temizlik ve bellek pekiştirme mekanizması aksadığında bireyin dikkat, problem çözme ve duygusal denge becerilerinde ciddi düşüşler gözlenir. "
            "(V) Dolayısıyla kaliteli bir uyku, zihinsel performansın sürdürülebilirliği için beslenme kadar vazgeçilmez bir biyolojik ihtiyaçtır.\n\n"
            "Bu parçadaki numaralanmış cümlelerden hangisi **düşüncenin akışını bozmaktadır**?"
        )
        corr = "III"
        dist = ["I", "II", "IV", "V"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Türkçe",
            "topic": "Paragrafta Yapı ve Akışı Bozan Cümle", "subtopic": "Anlam Bütünlüğü ve Akışı Bozan Cümle",
            "learning_outcome_code": "TDE.TYT.1.5", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Parça uykunun beyin sağlığı, nörolojik temizlik ve bellek üzerindeki işlevini anlatmaktadır. III. cümle ise solunum yolu rahatsızlığı olan uyku apnesinin cerrahi tedavisine geçerek akışı bozmuştur.",
            **opts
        }


# ================= 2. TYT TEMEL MATEMATİK (ÖSYM YENİ NESİL MUHAKEME) =================

def gen_tyt_matematik(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import generate_dynamic_chart_analysis_svg
    if index is None:
        index = random.randint(0, 999)
    top_low = str(topic or "").lower()

    if "sayı" in top_low or "kesir" in top_low or "problem" in top_low:
        archetype = 0
    elif "yaş" in top_low:
        archetype = 1
    elif "hız" in top_low or "hareket" in top_low:
        archetype = 2
    elif "yüzde" in top_low or "kâr" in top_low or "kar" in top_low:
        archetype = 3
    elif "grafik" in top_low or "tablo" in top_low or "veri" in top_low:
        archetype = 4
    elif "fonksiyon" in top_low:
        archetype = 5
    elif "küme" in top_low or "mantık" in top_low:
        archetype = 6
    elif "olasılık" in top_low or "permütasyon" in top_low or "kombinasyon" in top_low:
        archetype = 7
    else:
        archetype = index % 8

    if archetype == 0:
        # Yeni Nesil Sayı & Kesir Problemi: Elektrikli Araç Batarya Şarj Tarifesi
        cap_kwh = random.choice([60, 80, 100])
        init_pct = random.choice([15, 20])
        mid_pct = 80
        final_pct = 95
        price_fast = random.choice([8, 10])      # %80'e kadar kWh başı TL
        price_slow = random.choice([12, 15])     # %80'den sonra kWh başı TL

        kwh_stage1 = cap_kwh * (mid_pct - init_pct) // 100
        kwh_stage2 = cap_kwh * (final_pct - mid_pct) // 100
        total_bill = kwh_stage1 * price_fast + kwh_stage2 * price_slow

        q_text = (
            f"Tam kapasitesi **${cap_kwh}\\text{{ kWh}}$** olan bir elektrikli otomobilin bataryası, hızlı şarj istasyonunda iki kademeli fiyat tarifesiyle şarj edilmektedir:\n"
            f"- **1. Kademe (%$0$ ile %$80$ doluluk arası):** Doldurulan her $1\\text{{ kWh}}$ enerji için **${price_fast}\\text{{ TL}}$**,\n"
            f"- **2. Kademe (%$80$ ile %$100$ doluluk arası):** Batarya sağlığını korumak için akım düşürüldüğünden doldurulan her $1\\text{{ kWh}}$ enerji için **${price_slow}\\text{{ TL}}$** ücret alınmaktadır.\n\n"
            f"İstasyona batarya doluluk oranı **%${init_pct}$** iken gelen bir sürücü, bataryasını **%${final_pct}$** doluluk oranına kadar şarj ettiğinde istasyona toplam **kaç TL** öder?"
        )
        corr = f"${total_bill}$"
        dist = [
            f"${(kwh_stage1 + kwh_stage2) * price_fast}$",
            f"${total_bill + 45}$",
            f"${total_bill - 30}$",
            f"${(kwh_stage1 + kwh_stage2) * price_slow}$"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Temel Matematik",
            "topic": "Yeni Nesil Sayı ve Kesir Problemleri", "subtopic": "Kademeli Tarife ve Yüzde Modelleme",
            "learning_outcome_code": "MAT.TYT.3.1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"1. Kademede (%${init_pct}$'den %$80$'e) %${mid_pct - init_pct}$ dolum yapılır: ${cap_kwh} \\times \\frac{{{mid_pct - init_pct}}}{{100}} = {kwh_stage1}\\text{{ kWh}} \\implies {kwh_stage1} \\times {price_fast} = {kwh_stage1 * price_fast}\\text{{ TL}}$. "
                f"2. Kademede (%$80$'den %${final_pct}$'e) %${final_pct - mid_pct}$ dolum yapılır: ${cap_kwh} \\times \\frac{{{final_pct - mid_pct}}}{{100}} = {kwh_stage2}\\text{{ kWh}} \\implies {kwh_stage2} \\times {price_slow} = {kwh_stage2 * price_slow}\\text{{ TL}}$. "
                f"Toplam ödenecek tutar $= {kwh_stage1 * price_fast} + {kwh_stage2 * price_slow} = {total_bill}\\text{{ TL}}$ bulunur."
            ),
            **opts
        }

    elif archetype == 1:
        # Yeni Nesil Yaş Problemi: Doğum Yılı ve Kimlik Kartı Kurgusu
        base_year = 2026
        child_age = random.choice([12, 14, 15])
        mother_age = child_age * 3 - 4
        father_age = mother_age + 4
        # Çocuk doğduğunda anne ve babanın yaşları toplamı
        sum_at_birth = (mother_age - child_age) + (father_age - child_age)

        q_text = (
            f"Bir ailede anne, baba ve çocukları Kerem'in **2026 yılındaki** yaşlarıyla ilgili şunlar bilinmektedir:\n"
            f"- Annenin yaşı, Kerem'in yaşının $3$ katından $4$ eksiktir.\n"
            f"- Babanın yaşı ise Kerem'in yaşının $3$ katına eşittir.\n"
            f"- Kerem doğduğu yılda anne ve babasının yaşları toplamı **${sum_at_birth}$** idi.\n\n"
            f"Buna göre Kerem **hangi yılda doğmuştur**?"
        )
        birth_year = base_year - child_age
        corr = f"${birth_year}$"
        dist = [
            f"${birth_year - 2}$",
            f"${birth_year + 2}$",
            f"${birth_year - 4}$",
            f"${birth_year + 3}$"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Temel Matematik",
            "topic": "Yaş Problemleri", "subtopic": "Yıl ve Yaş Farkı Korunumu Muhakemesi",
            "learning_outcome_code": "MAT.TYT.3.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Kerem'in 2026'daki yaşına $x$ dersek, Anne $= 3x-4$, Baba $= 3x$ olur. "
                f"Kerem doğduğunda ($x$ yıl önce) Anne $= 2x-4$, Baba $= 2x$ yaşındadır. "
                f"Toplamları: $4x - 4 = {sum_at_birth} \\implies 4x = {sum_at_birth + 4} \\implies x = {child_age}$. "
                f"Doğum yılı $= 2026 - {child_age} = {birth_year}$ bulunur."
            ),
            **opts
        }

    elif archetype == 2:
        # Yeni Nesil Hız ve Hareket Problemi: Tünel ve Navigasyon Süresi
        v1 = random.choice([80, 90, 100])
        v2 = v1 + 30
        t_planned = random.choice([4, 5])
        total_dist = v1 * t_planned
        # Yolu yarıladığında mola verip hızını artırıyor
        half_dist = total_dist // 2
        t_first_half = half_dist / v1  # saat
        # Hızını v2 yapınca ikinci yarı süresi
        # Dakika farkı
        saved_minutes = int(round((half_dist / v1 - half_dist / v2) * 60))

        q_text = (
            f"A kentinden B kentine sabit **${v1}\\text{{ km/sa}}$** hızla gitmeyi planlayan bir sürücü, navigasyon ekranında toplam yolun **${total_dist}\\text{{ km}}$** olduğunu görüyor.\n"
            f"- Sürücü yolun tam yarısına geldiğinde bir dinlenme tesisinde **$20$ dakika** mola veriyor.\n"
            f"- Moladan sonra kalan yolu sabit **${v2}\\text{{ km/sa}}$** hızla tamamlayarak B kentine ulaşıyor.\n\n"
            f"Buna göre sürücü B kentine, başlangıçta hiç mola vermeden planladığı varış saatine göre **kaç dakika farkla** ulaşmıştır?"
        )
        net_diff = saved_minutes - 20
        if net_diff > 0:
            corr = f"${net_diff}$ dakika erken varmıştır"
        elif net_diff < 0:
            corr = f"${abs(net_diff)}$ dakika geç varmıştır"
        else:
            corr = "Tam planladığı dakikada varmıştır"

        dist = [
            f"${saved_minutes}$ dakika erken varmıştır",
            f"$20$ dakika geç varmıştır",
            f"${abs(net_diff) + 10}$ dakika erken varmıştır",
            f"${abs(net_diff) + 15}$ dakika geç varmıştır"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Temel Matematik",
            "topic": "Hız ve Hareket Problemleri", "subtopic": "Navigasyon ve Ortalama Hız Muhakemesi",
            "learning_outcome_code": "MAT.TYT.3.5", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Yolun ikinci yarısı ${half_dist}\\text{{ km}}$'dir. Normalde ${v1}\\text{{ km/sa}}$ ile ${int(half_dist/v1*60)}$ dakika sürecekken, "
                f"${v2}\\text{{ km/sa}}$ hızla ${int(half_dist/v2*60)}$ dakika sürmüş ve yolda ${saved_minutes}$ dakika kazanılmıştır. "
                f"$20$ dakika mola düşüldüğünde net durum: {corr}."
            ),
            **opts
        }

    elif archetype == 3:
        # Yeni Nesil Yüzde & Kâr-Zarar: Kampanya "3 Al 2 Öde" vs Yüzde İndirim
        unit_cost = random.choice([120, 150, 200])
        markup_pct = 50  # %50 karla etiket = 1.5 * cost
        label_price = int(unit_cost * 1.5)
        # 3 al 2 öde kampanyasında 3 ürün satışı: müşteri 2 * label_price öder = 3 * unit_cost!
        # Eğer 4 al 3 öde yapılırsa: müşteri 3 * label_price = 4.5 * unit_cost öder, maliyet 4 * unit_cost
        # 3 üründe 3. ürüne %50 indirim kampanyası: 2.5 * label_price = 3.75 * unit_cost (Maliyet 3 * unit_cost => %25 kar!)
        paid_for_3 = int(2.5 * label_price)
        cost_for_3 = 3 * unit_cost
        profit_for_3 = paid_for_3 - cost_for_3
        profit_pct = int(round((profit_for_3 / cost_for_3) * 100))

        q_text = (
            f"Bir giyim mağazası, birim maliyeti **${unit_cost}\\text{{ TL}}$** olan gömleklerin etiket fiyatını maliyet üzerinden **%$50$ kârla** belirlemiştir.\n"
            f"Mağaza hafta sonu özel bir kampanya başlatarak; **\"Aynı gömlekten $3$ adet alan müşteriye, $1.$ ve $2.$ gömlek etiket fiyatından, $3.$ gömlek ise etiket fiyatı üzerinden %$50$ indirimli\"** olarak satmaktadır.\n\n"
            f"Bu kampanyadan yararlanarak $3$ adet gömlek satın alan bir müşterinin ödediği toplam tutar üzerinden mağazanın elde ettiği **gerçek kâr oranı yüzde kaçtır**?"
        )
        corr = f"%${profit_pct}$"
        dist = ["%$20$", "%$30$", "%$35$", "%$15$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Temel Matematik",
            "topic": "Yüzde, Kâr-Zarar ve İskonto Problemleri", "subtopic": "Kampanya Kurguları ve Gerçek Kâr Analizi",
            "learning_outcome_code": "MAT.TYT.3.4", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Birim maliyet $= {unit_cost}\\text{{ TL}}$, etiket fiyatı $= {label_price}\\text{{ TL}}$'dir. "
                f"$3$ gömleğin toplam maliyeti $= 3 \\times {unit_cost} = {cost_for_3}\\text{{ TL}}$'dir. "
                f"Müşterinin ödediği tutar $= {label_price} + {label_price} + {label_price // 2} = {paid_for_3}\\text{{ TL}}$'dir. "
                f"Kâr $= {paid_for_3} - {cost_for_3} = {profit_for_3}\\text{{ TL}}$ olup kâr yüzdesi $= \\frac{{{profit_for_3}}}{{{cost_for_3}}} \\times 100 = \\%{profit_pct}$ bulunur."
            ),
            **opts
        }

    elif archetype == 4:
        # Yeni Nesil Grafik ve Tablo Yorumlama (SVG'li)
        k_mult = random.choice([10, 15, 20])
        a_prod = 40 * k_mult // 10
        b_prod = 30 * k_mult // 10
        c_prod = 50 * k_mult // 10
        svg = generate_dynamic_chart_analysis_svg(120, 90, 150, "TYT Veri Analizi: Üretim Dağılımı ve Birim Oranlar")

        q_text = (
            f"Bir geri dönüşüm tesisine gelen **Cam (A), Plastik (B) ve Metal (C)** atıkların kütlece dağılımı yukarıdaki **Grafik 1 (Daire Grafiği)**'nde verilmiştir ($120^\\circ, 90^\\circ, 150^\\circ$).\n"
            f"- Tesise gelen toplam atık kütlesi **${a_prod + b_prod + c_prod}\\text{{ ton}}$**'dur.\n"
            f"- Geri dönüşüm işlemi sonucunda Cam atıkların **%$75$'i**, Plastik atıkların **%$60$'ı** ve Metal atıkların **%$80$'i** saf hammaddeye dönüştürülebilmektedir.\n\n"
            f"Buna göre bu tesiste elde edilen **toplam saf hammadde miktarı kaç tondur**?"
        )
        pure_a = a_prod * 75 // 100
        pure_b = b_prod * 60 // 100
        pure_c = c_prod * 80 // 100
        total_pure = pure_a + pure_b + pure_c

        corr = f"${total_pure}$"
        dist = [
            f"${total_pure + 12}$",
            f"${total_pure - 9}$",
            f"${a_prod + b_prod}$",
            f"${total_pure + 25}$"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Temel Matematik",
            "topic": "Grafik ve Tablo Yorumlama Problemleri", "subtopic": "Daire ve Sütun Grafiği Verimlilik Hesabı",
            "learning_outcome_code": "MAT.TYT.3.6", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": (
                f"Toplam ${a_prod + b_prod + c_prod}\\text{{ ton}}$ ($360^\\circ$) içinde: A (Cam, $120^\\circ$) $= {a_prod}$ ton, B (Plastik, $90^\\circ$) $= {b_prod}$ ton, C (Metal, $150^\\circ$) $= {c_prod}$ ton. "
                f"Saf hammadde $= {a_prod}\\times 0.75 + {b_prod}\\times 0.60 + {c_prod}\\times 0.80 = {pure_a} + {pure_b} + {pure_c} = {total_pure}\\text{{ ton}}$."
            ),
            **opts
        }

    elif archetype == 5:
        # Yeni Nesil Fonksiyonlar: Kargo / Akıllı Sayaç Modellemesi
        a = random.choice([3, 4, 5])
        b = random.choice([10, 12, 15])
        x_in = random.choice([4, 6, 8])
        # f(x) = ax + b, g(x) = 2x - 4
        fx = a * x_in + b
        gfx = 2 * fx - 4

        q_text = (
            f"Bir veri merkezinde sunucu soğutma sisteminin enerji tüketimi iki aşamalı fonksiyonla modellenmiştir:\n"
            f"- Ortam sıcaklığı $x\\ (^\\circ\\text{{C}})$ olmak üzere, fanların devir hızı $f(x) = {a}x + {b}$ fonksiyonu ile,\n"
            f"- Devir hızı $y$ olan fanların saatlik elektrik tüketimi ise $g(y) = 2y - 4$ fonksiyonu ile hesaplanmaktadır.\n\n"
            f"Buna göre ortam sıcaklığı **$x = {x_in}^\\circ\\text{{C}}$** olduğunda sistemin saatlik elektrik tüketimini veren **$(g \\circ f)({x_in})$ değeri** kaçtır?"
        )
        corr = f"${gfx}$"
        dist = [
            f"${fx}$",
            f"${gfx + a}$",
            f"${gfx - 6}$",
            f"${a * (2 * x_in - 4) + b}$"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Temel Matematik",
            "topic": "Fonksiyonlar (Temel Düzey)", "subtopic": "Bileşke Fonksiyonun Gerçek Yaşam Modellemesi",
            "learning_outcome_code": "MAT.TYT.4.2", "cognitive_domain": "Uygulama / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Önce $f({x_in}) = {a} \\cdot {x_in} + {b} = {fx}$ bulunur. "
                f"Ardından $(g \\circ f)({x_in}) = g(f({x_in})) = g({fx}) = 2 \\cdot {fx} - 4 = {gfx}$ hesaplanır."
            ),
            **opts
        }

    elif archetype == 6:
        # Yeni Nesil Kümeler & Venn Şeması Muhakemesi
        only_py = random.choice([12, 14, 16])
        only_js = random.choice([10, 13, 15])
        both = random.choice([6, 8, 9])
        neither = random.choice([4, 5])
        total_students = only_py + only_js + both + neither

        q_text = (
            f"Bilişim teknolojileri bölümündeki **${total_students}$ öğrencinin** katıldığı bir yazılım anketinde:\n"
            f"- **Python** dilini bilenlerin sayısı, her iki dili de bilmeyenlerin sayısının **${(only_py + both) // neither if (only_py + both) % neither == 0 else ''}$**${only_py + both}$ kişidir,\n"
            f"- **En çok bir** yazılım dilini bilenlerin sayısı **${only_py + only_js + neither}$** kişidir,\n"
            f"- **En az bir** yazılım dilini bilenlerin sayısı ise **${only_py + only_js + both}$** kişidir.\n\n"
            f"Buna göre sınıfta **yalnızca JavaScript** dilini bilen öğrenci sayısı kaçtır?"
        )
        corr = f"${only_js}$"
        dist = [
            f"${only_py}$",
            f"${both}$",
            f"${only_js + both}$",
            f"${only_js + neither}$"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Temel Matematik",
            "topic": "Kümeler ve Kartezyen Çarpım", "subtopic": "Küme Problemleri (En Az / En Çok Bir Kurgusu)",
            "learning_outcome_code": "MAT.TYT.1.5", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Toplam öğrenci $= {total_students}$. En az bir dil bilenler ($P \\cup J$) $= {only_py + only_js + both}$ kişi olduğundan, "
                f"hiçbirini bilmeyenler $= {total_students} - {only_py + only_js + both} = {neither}$ kişidir. "
                f"Python bilenler ($s(P)$) $= {only_py + both}$ kişi olduğundan, yalnızca JavaScript bilenler $= s(P \\cup J) - s(P) = {only_py + only_js + both} - {only_py + both} = {only_js}$ bulunur."
            ),
            **opts
        }

    else:
        # Yeni Nesil Olasılık ve Kombinasyon: Güvenli Şifre / Takım Seçimi
        n_eng = 4
        n_doc = 5
        # 4 mühendis ve 5 doktor arasından 3 kişilik komisyon, içinde en az 1 mühendis ve en az 1 doktor olma olasılığı
        total_ways = math.comb(n_eng + n_doc, 3)  # C(9,3) = 84
        valid_ways = math.comb(n_eng, 2) * math.comb(n_doc, 1) + math.comb(n_eng, 1) * math.comb(n_doc, 2)  # 6*5 + 4*10 = 70
        g = math.gcd(valid_ways, total_ways)

        q_text = (
            f"Bir biyo-mühendislik projesinde görev yapan **$4$ yazılım mühendisi ve $5$ tıp doktoru** arasından rastgele **$3$ kişilik** bir etik kurul seçilecektir.\n\n"
            f"Seçilen bu kurulda **her iki meslek grubundan da en az birer kişinin** bulunma olasılığı kaçtır?"
        )
        corr = f"$\\frac{{{valid_ways // g}}}{{{total_ways // g}}}$"
        dist = [
            f"$\\frac{{{valid_ways // g - 1}}}{{{total_ways // g}}}$",
            f"$\\frac{{3}}{{4}}$",
            f"$\\frac{{2}}{{3}}$",
            f"$\\frac{{5}}{{7}}$"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Temel Matematik",
            "topic": "Olasılık", "subtopic": "Koşullu Kombinasyon ve Olasılık",
            "learning_outcome_code": "MAT.TYT.5.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": (
                f"Tüm durumlar $\\binom{{9}}{{3}} = 84$'tür. İstenen durum ($2$ Mühendis $1$ Doktor) veya ($1$ Mühendis $2$ Doktor) seçilmesidir: "
                f"$\\binom{{4}}{{2}}\\binom{{5}}{{1}} + \\binom{{4}}{{1}}\\binom{{5}}{{2}} = 6 \\cdot 5 + 4 \\cdot 10 = 30 + 40 = 70$. "
                f"Olasılık $= \\frac{{70}}{{84}} = \\frac{{{valid_ways // g}}}{{{total_ways // g}}}$ bulunur."
            ),
            **opts
        }


# ================= 3. TYT GEOMETRİ (ÖSYM YENİ NESİL KATLAMA VE MODELLEME) =================

def gen_tyt_geometri(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import (
        generate_dynamic_folding_geometry_svg,
        generate_dynamic_triangle_svg,
        generate_dynamic_geometry_circle_svg
    )
    if index is None:
        index = random.randint(0, 999)
    top_low = str(topic or "").lower()

    if "katlama" in top_low or "açı" in top_low or "dörtgen" in top_low:
        archetype = 0
    elif "üçgen" in top_low or "benzerlik" in top_low or "alan" in top_low:
        archetype = 1
    elif "çember" in top_low or "daire" in top_low:
        archetype = 2
    else:
        archetype = index % 3

    if archetype == 0:
        alpha = random.choice([34, 38, 42])
        ans_angle = 180 - 2 * alpha
        svg = generate_dynamic_folding_geometry_svg(15, 10, alpha, "TYT Geometri: Dikdörtgen Katlama ve Açıortay")
        q_text = (
            f"Şekildeki $ABCD$ dikdörtgeni biçimindeki kâğıt, $[EF]$ boyunca katlandığında $D$ köşesi dikdörtgenin iç bölgesindeki $D'$ noktasına gelmektedir.\n"
            f"- Katlama sonucunda $[ED]$ kenarı $[ED']$ konumuna taşındığına göreve $m(\\widehat{{DEF}}) = \\alpha = {alpha}^\\circ$ olduğuna göre,\n\n"
            f"**$m(\\widehat{{AED'}})$ açısının ölçüsü kaç derecedir**?"
        )
        corr = f"${ans_angle}^\\circ$"
        dist = [f"${90 - alpha}^\\circ$", f"${180 - alpha}^\\circ$", f"${2 * alpha}^\\circ$", f"${ans_angle + 12}^\\circ$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Geometri",
            "topic": "Dörtgenler ve Özel Dörtgenler (Paralelkenar, Eşkenar Dörtgen, Dikdörtgen, Kare, Yamuk)",
            "subtopic": "Yeni Nesil Kâğıt Katlama ve Açıortay Özellikleri",
            "learning_outcome_code": "GEO.TYT.2.3", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": f"Kat izi $[EF]$ açıortay olduğundan $m(\\widehat{{DEF}}) = m(\\widehat{{FED'}}) = {alpha}^\\circ$. Doğrusal açıdan $m(\\widehat{{AED'}}) = 180^\\circ - 2\\cdot {alpha}^\\circ = {ans_angle}^\\circ$.",
            **opts
        }

    elif archetype == 1:
        triples = [(6, 8, 10), (8, 15, 17), (9, 12, 15), (12, 16, 20)]
        c_side, a_side, b_hyp = triples[index % len(triples)]
        svg = generate_dynamic_triangle_svg(a_side, b_hyp, c_side, "ABC Dik Üçgen Parkuru")
        area = (a_side * c_side) // 2
        q_text = (
            f"Bir belediye, dik üçgen biçimindeki $ABC$ yeşil alanının ($[AB] \\perp [BC]$) etrafına yürüyüş yolu yapacaktır.\n"
            f"- Parkın dik kenar uzunlukları $|AB| = {c_side}\\text{{ m}}$ ve $|BC| = {a_side}\\text{{ m}}$'dir.\n\n"
            f"Buna göre hipotenüs uzunluğu $|AC| = b$ kaç metredir ve parkın **toplam alanı kaç $\\text{{m}}^2$'dir**?"
        )
        corr = f"$|AC| = {b_hyp}\\text{{ m}}$ — Alan $= {area}\\text{{ m}}^2$"
        dist = [
            f"$|AC| = {b_hyp}\\text{{ m}}$ — Alan $= {a_side * c_side}\\text{{ m}}^2$",
            f"$|AC| = {a_side + c_side}\\text{{ m}}$ — Alan $= {area}\\text{{ m}}^2$",
            f"$|AC| = {b_hyp + 2}\\text{{ m}}$ — Alan $= {area + 10}\\text{{ m}}^2$",
            f"$|AC| = {b_hyp}\\text{{ m}}$ — Alan $= {(a_side + c_side) * 2}\\text{{ m}}^2$"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Geometri",
            "topic": "Özel Üçgenler (Dik, İkizkenar, Eşkenar)", "subtopic": "Dik Üçgende Pisagor ve Alan Modellemesi",
            "learning_outcome_code": "GEO.TYT.1.3", "cognitive_domain": "Uygulama / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": f"Pisagor bağıntısından $|AC| = \\sqrt{{{c_side}^2 + {a_side}^2}} = {b_hyp}\\text{{ m}}$. Alan $= \\frac{{{c_side} \\times {a_side}}}{{2}} = {area}\\text{{ m}}^2$.",
            **opts
        }

    else:
        r = random.choice([6, 8, 12])
        angle = random.choice([60, 90, 120])
        svg = generate_dynamic_geometry_circle_svg(r, angle)
        sector_area = (r * r * angle) // 360
        q_text = (
            f"Merkezi $O$ noktası ve yarıçapı **$r = {r}\\text{{ metre}}$** olan daire biçimindeki bir tarım arazisinde, merkezde bulunan döner fıskiye **$\\alpha = {angle}^\\circ$**'lik merkez açı tarayarak sulama yapmaktadır.\n\n"
            f"Buna göre fıskiyenin suladığı **daire diliminin alanı kaç $\\pi\\text{{ m}}^2$'dir**?"
        )
        corr = f"${sector_area}\\pi$"
        dist = [f"${sector_area * 2}\\pi$", f"${r * r}\\pi$", f"${sector_area + 4}\\pi$", f"${2 * r}\\pi$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Geometri",
            "topic": "Dairede Alan ve Çevre", "subtopic": "Daire Diliminin Alanı",
            "learning_outcome_code": "GEO.TYT.3.2", "cognitive_domain": "Uygulama / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": f"Daire diliminin alanı $= \\pi r^2 \\cdot \\frac{{\\alpha}}{{360^\\circ}} = \\pi \\cdot {r}^2 \\cdot \\frac{{{angle}}}{{360}} = {sector_area}\\pi\\text{{ m}}^2$.",
            **opts
        }


# ================= 4. TYT FİZİK (ÖSYM YENİ NESİL DENEY VE GÖRSEL TEMELLİ) =================

def gen_tyt_fizik(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import (
        generate_dynamic_circuit_svg,
        generate_dynamic_force_block_svg,
        generate_dynamic_optics_prism_svg
    )
    if index is None:
        index = random.randint(0, 999)
    top_low = str(topic or "").lower()

    if "elektrik" in top_low or "devre" in top_low:
        archetype = 0
    elif "kuvvet" in top_low or "hareket" in top_low or "newton" in top_low:
        archetype = 1
    elif "optik" in top_low or "kırılma" in top_low or "ayna" in top_low:
        archetype = 2
    else:
        archetype = index % 3

    if archetype == 0:
        r1, r2, r3 = 4, 6, 2
        r_eq = r1 + r2 + r3  # 12 ohm
        i_amp = random.choice([2, 3, 4])
        v_volt = r_eq * i_amp
        svg = generate_dynamic_circuit_svg(v_volt, r1, r2, r3)
        p_watt = (i_amp ** 2) * r2
        q_text = (
            f"Şekildeki elektrik devresinde iç direnci önemsiz **$V = {v_volt}\\text{{ Volt}}$** gerilimli üretece $R_1 = {r1}\\,\\Omega$, $R_2 = {r2}\\,\\Omega$ ve $R_3 = {r3}\\,\\Omega$ dirençleri seri olarak bağlanmıştır.\n\n"
            f"Buna göre;\n"
            f"I. İdeal ampermetreden ($A$) geçen ana kol akımı **${i_amp}\\text{{ Amper}}$**'dir.\n"
            f"II. $R_2$ direncinin uçları arasındaki potansiyel farkı **${i_amp * r2}\\text{{ Volt}}$**'tur.\n"
            f"III. $R_2$ direncinin birim zamanda ($1$ saniyede) harcadığı elektriksel güç **${p_watt}\\text{{ Watt}}$**'tır.\n\n"
            f"yargılarından hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Fizik",
            "topic": "Elektrik Akımı ve Devreler", "subtopic": "Ohm Yasası, Potansiyel Farkı ve Elektriksel Güç",
            "learning_outcome_code": "FİZ.TYT.3.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": (
                f"$R_{{eş}} = {r1}+{r2}+{r3} = {r_eq}\\,\\Omega$. Ana kol akımı $I = V/R_{{eş}} = {v_volt}/{r_eq} = {i_amp}\\text{{ A}}$ (I doğru). "
                f"$V_2 = I \\cdot R_2 = {i_amp} \\cdot {r2} = {i_amp * r2}\\text{{ V}}$ (II doğru). "
                f"Güç $P_2 = I^2 \\cdot R_2 = {i_amp}^2 \\cdot {r2} = {p_watt}\\text{{ W}}$ (III doğru)."
            ),
            **opts
        }

    elif archetype == 1:
        m = random.choice([4, 5])
        a = random.choice([2, 3])
        f_s = random.choice([6, 8])
        f_uyg = m * a + f_s
        svg = generate_dynamic_force_block_svg(m, f_uyg, f_s, a)
        q_text = (
            f"Yatay ve sürtünmeli bir düzlemde hareket eden **$m = {m}\\text{{ kg}}$** kütleli bir sandığa yatay doğrultuda **$F = {f_uyg}\\text{{ N}}$** kuvvet uygulandığında, zemin ile sandık arasında **$f_s = {f_s}\\text{{ N}}$** büyüklüğünde kinetik sürtünme kuvveti oluşmaktadır.\n\n"
            f"Buna göre sandığın hareket ivmesi ($a$) ve $4$ saniye sonunda durgun halden başlayarak kazanacağı hız ($v$) aşağıdakilerin hangisinde doğru verilmiştir?"
        )
        corr = f"$a = {a}\\text{{ m/s}}^2$ — $v = {4 * a}\\text{{ m/s}}$"
        dist = [
            f"$a = {f_uyg / m:.1f}\\text{{ m/s}}^2$ — $v = {2 * a}\\text{{ m/s}}$",
            f"$a = {a + 1}\\text{{ m/s}}^2$ — $v = {4 * (a + 1)}\\text{{ m/s}}$",
            f"$a = {a}\\text{{ m/s}}^2$ — $v = {2 * a}\\text{{ m/s}}$",
            f"$a = {a + 2}\\text{{ m/s}}^2$ — $v = {4 * a}\\text{{ m/s}}$"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Fizik",
            "topic": "Newton'ın Hareket Yasaları", "subtopic": "Sürtünmeli Yüzeyde Dinamik ve Hız Değişimi",
            "learning_outcome_code": "FİZ.TYT.2.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": f"$F_{{net}} = F - f_s = {f_uyg} - {f_s} = {m * a}\\text{{ N}}$. İvme $a = F_{{net}}/m = {a}\\text{{ m/s}}^2$. $4$ saniye sonraki hız $v = a \\cdot t = {4 * a}\\text{{ m/s}}$.",
            **opts
        }

    else:
        svg = generate_dynamic_optics_prism_svg()
        q_text = (
            "Şekildeki optik deney düzeneğinde, kırıcılık indisi $n_1$ olan hava ortamından kırıcılık indisi $n_2$ olan cam prizmaya ($n_2 > n_1$) tek renkli bir ışık ışını gönderilmiştir.\n\n"
            "Işığın hava ortamından cam prizmaya geçiş sürecinde;\n"
            "I. Işığın ortalama yayılma sürati azalır.\n"
            "II. Işığın frekansı ($f$) kaynağa bağlı olduğundan değişmez.\n"
            "III. Işın yüzey normaline yaklaşacak biçimde kırılır.\n\n"
            "yargılarından hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Fizik",
            "topic": "Optik (Aydınlanma, Aynalar, Kırılma, Mercekler, Prizmalar ve Renk)",
            "subtopic": "Snell Kırılma Yasası ve Dalga Özellikleri",
            "learning_outcome_code": "FİZ.TYT.5.3", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": "Az yoğundan çok yoğuna geçen ışın normale yaklaşır, ortamdaki hızı ($v=c/n$) ve dalga boyu azalır, ancak frekansı değişmez.",
            **opts
        }


# ================= 5. TYT KİMYA (ÖSYM YENİ NESİL LABORATUVAR VE ANALİZ) =================

def gen_tyt_kimya(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import generate_dynamic_chemistry_lab_svg
    if index is None:
        index = random.randint(0, 999)
    archetype = index % 3

    if archetype == 0:
        svg = generate_dynamic_chemistry_lab_svg("TYT Kimya Deneyi: Asit-Baz Nötralleşme Düzeneği")
        q_text = (
            "Kimya laboratuvarında kurulan yukarıdaki düzenekte, erlenmayerde bulunan **$HCl$ (hidroklorik asit)** sulu çözeltisi üzerine büretten damla damla **$NaOH$ (sodyum hidroksit)** sulu çözeltisi eklenmektedir.\n\n"
            "Gerçekleşen $HCl(suda) + NaOH(suda) \\to NaCl(suda) + H_2O(s)$ tepkimesi ve süreçle ilgili;\n"
            "I. Erlenmayerdeki çözeltinin $pH$ değeri zamanla artar.\n"
            "II. Net iyon denklemi $H^+(suda) + OH^-(suda) \\to H_2O(s)$ şeklindedir.\n"
            "III. Tam nötralleşme anında oluşan $NaCl$ tuzu suda iyonlaşarak elektriği iletir.\n\n"
            "ifadelerinden hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Kimya",
            "topic": "Asitler, Bazlar ve Tuzlar", "subtopic": "Asit-Baz Nötralleşme Tepkimeleri",
            "learning_outcome_code": "KİM.TYT.5.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": "Asit üzerine baz eklendikçe asitlik azalır ve pH yükselir (I doğru). Nötralleşmenin net iyon denklemi su oluşumudur (II doğru) ve tuzlu su elektrolittir (III doğru).",
            **opts
        }

    elif archetype == 1:
        q_text = (
            "Aşağıda üç farklı kimyasal tür çifti arasındaki baskın etkileşimler incelenmektedir:\n"
            "- **I. Durum:** Saf su ($H_2O$) ile etil alkol ($C_2H_5OH$) molekülleri arasında kurulan etkileşim,\n"
            "- **II. Durum:** Sıvı karbondioksit ($CO_2$) molekülleri arasında yoğunlaşma sırasında oluşan etkileşim,\n"
            "- **III. Durum:** Yemek tuzu ($NaCl$) kristalindeki $Na^+$ ve $Cl^-$ iyonlarının su ($H_2O$) molekülleriyle sarılması.\n\n"
            "Bu üç etkileşim türü aşağıdakilerin hangisinde sırasıyla doğru sınıflandırılmıştır?"
        )
        corr = "I: Hidrojen Bağı — II: London Kuvvetleri — III: İyon-Dipol Etkileşimi"
        dist = [
            "I: Dipol-Dipol — II: Hidrojen Bağı — III: İyonik Bağ",
            "I: Hidrojen Bağı — II: Dipol-Dipol — III: Kovalent Bağ",
            "I: Kovalent Bağ — II: London Kuvvetleri — III: Hidrojen Bağı",
            "I: İyon-Dipol — II: London Kuvvetleri — III: Dipol-Dipol"
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Kimya",
            "topic": "Kimyasal Türler Arası Etkileşimler", "subtopic": "Zayıf Etkileşimlerin Sınıflandırılması",
            "learning_outcome_code": "KİM.TYT.2.3", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": "$H_2O$ ve $C_2H_5OH$ arasında $-OH$ gruplarından dolayı Hidrojen bağı (I), apolar $CO_2$ molekülleri arasında yalnız London kuvvetleri (II), $NaCl$ iyonları ile polar $H_2O$ arasında İyon-Dipol etkileşimi (III) bulunur.",
            **opts
        }

    else:
        q_text = (
            "Periyodik sistemin baş gruplarında (A grupları) yer alan **X, Y ve Z** elementleriyle ilgili şu bilgiler veriliyor:\n"
            "- **$X$ ve $Y$** aynı periyotta yer almakta olup $Y$'nin atom yarıçapı $X$'inkinden küçüktür.\n"
            "- **$X$ ve $Z$** aynı grupta yer almakta olup $Z$'nin birinci iyonlaşma enerjisi $X$'inkinden küçüktür.\n\n"
            "Buna göre $X, Y$ ve $Z$ elementlerinin **atom numaralarının (proton sayılarının)** büyükten küçüğe doğru sıralanışı aşağıdakilerden hangisidir?"
        )
        corr = "$Z > Y > X$"
        dist = ["$X > Y > Z$", "$Y > Z > X$", "$Z > X > Y$", "$Y > X > Z$"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Kimya",
            "topic": "Atom ve Periyodik Sistem", "subtopic": "Periyodik Özelliklerin Değişim Eğilimleri",
            "learning_outcome_code": "KİM.TYT.1.4", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": "Aynı periyotta sağa gidildikçe yarıçap küçülür ($Y$, $X$'in sağındadır $\\implies Z_Y > Z_X$). Aynı grupta aşağı inildikçe iyonlaşma enerjisi azalır ($Z$, $X$'in alt periyodundadır $\\implies Z_Z > Z_Y > Z_X$).",
            **opts
        }


# ================= 6. TYT BİYOLOJİ (ÖSYM YENİ NESİL SOYAĞACI VE EKOLOJİ) =================

def gen_tyt_biyoloji(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import (
        generate_dynamic_pedigree_svg,
        generate_dynamic_food_pyramid_svg
    )
    if index is None:
        index = random.randint(0, 999)
    archetype = index % 3

    if archetype == 0:
        svg = generate_dynamic_pedigree_svg("TYT Biyoloji: Otozomal Çekinik Kalıtım Analizi")
        q_text = (
            "Yukarıdaki soyağacında koyu renkli ($2$ ve $4$ numaralı) bireyler belirli bir kalıtsal özelliği fenotipinde göstermektedir. Bu özelliğin **otozomal çekinik ($a$)** bir alelle taşındığı bilinmektedir.\n\n"
            "Buna göre soyağacındaki numaralanmış bireylerin genotipleriyle ilgili;\n"
            "I. $2$ ve $4$ numaralı bireyler kesinlikle homozigot çekinik ($aa$) genotiptedir.\n"
            "II. $1$ numaralı baba, $4$ numaralı çocuğuna çekinik alel aktardığı için heterozigot ($Aa$) olmak zorundadır.\n"
            "III. $3$ ve $5$ numaralı kardeşler annelerinden ($2$ numara) kesinlikle çekinik ($a$) alelini almış birer taşıyıcıdır ($Aa$).\n\n"
            "yargılarından hangileri **kesinlikle doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "I ve III", "II ve III"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Biyoloji",
            "topic": "Kalıtımın Genel İlkeleri (Mendel Genetiği)", "subtopic": "Soyağacı ve Otozomal Çekinik Kalıtım",
            "learning_outcome_code": "BİY.TYT.4.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": "Koyu bireyler (2 ve 4) $aa$'dır (I doğru). 4 numara ($aa$) bir $a$'yı 1 numaralı babadan aldığı için 1 numara sağlıklı görünümlü $Aa$'dır (II doğru). 2 numaralı anne ($aa$) tüm çocuklarına (3 ve 5) $a$ aleli verdiğinden 3 ve 5 kesinlikle $Aa$'dır (III doğru).",
            **opts
        }

    elif archetype == 1:
        svg = generate_dynamic_food_pyramid_svg()
        q_text = (
            "Yukarıda bir kara ekosistemine ait **besin ve enerji piramidi** gösterilmiştir. Piramidin en alt basamağındaki üreticilerin toplam enerji eşdeğeri **$100.000\\text{ Joule}$** olarak ölçülmüştür.\n\n"
            "Bu besin piramidiyle ilgili;\n"
            "I. Trofik basamaklar arasında %$10$ enerji aktarım yasasına göre 2. tüketici basamağına aktarılan enerji yaklaşık **$1.000\\text{ Joule}$**'dür.\n"
            "II. Toprağa karışan DDT gibi biyolojik olarak parçalanamayan bir zehir, en yüksek derişime **3. tüketici** dokularında ulaşır.\n"
            "III. Ayrıştırıcı (saprofit) canlılar piramidin yalnızca en üst basamağındaki canlıların kalıntılarını ayrıştırır.\n\n"
            "ifadelerinden hangileri **doğrudur**?"
        )
        corr = "I ve II"
        dist = ["Yalnız I", "Yalnız II", "II ve III", "I, II ve III"]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Biyoloji",
            "topic": "Ekosistem Ekolojisi ve Güncel Çevre Sorunları", "subtopic": "Besin Piramidi ve Biyolojik Birikim",
            "learning_outcome_code": "BİY.TYT.5.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": "Üretici ($100.000\\text{ J}$) $\\to$ 1. Tüketici ($10.000\\text{ J}$) $\\to$ 2. Tüketici ($1.000\\text{ J}$) (I doğru). Biyolojik birikim en üstte maksimumdur (II doğru). Saprofitler tüm basamaklarda görev yapar (III yanlış).",
            **opts
        }

    else:
        q_text = (
            "Yarı geçirgen bir zarla ayrılmış U borusunun **A koluna %$10$'luk sükroz (çay şekeri) çözeltisi**, **B koluna ise %$2$'lik sükroz çözeltisi** konularak eşit seviyede başlatılıyor.\n\n"
            "Sükroz disakkarit olduğundan hücre zarından (yarı geçirgen zardan) doğrudan geçemediğine göre, bir süre sonra gerçekleşecek olaylarla ilgili aşağıdakilerden hangisi **doğrudur**?"
        )
        corr = "B kolundan A koluna doğru ozmozla su geçişi olur; A kolundaki sıvı seviyesi yükselirken iki kolun derişimleri eşitlenir."
        dist = [
            "A kolundan B koluna doğru sükroz molekülleri difüzyonla geçerek şeker miktarlarını eşitler.",
            "A kolundaki su molekülleri B koluna geçerek B kolundaki sıvı seviyesini yükseltir.",
            "Su geçişi sırasında ortamda bulunan ATP molekülleri harcanarak aktif taşıma yapılır.",
            "Her iki koldaki sıvı seviyeleri ve ozmotik basınçlar hiçbir değişime uğramadan sabit kalır."
        ]
        opts = format_tyt_options(corr, dist)
        return {
            "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Biyoloji",
            "topic": "Hücre Zarından Madde Geçişleri", "subtopic": "Ozmoz ve Ozmotik Basınç Deneyi",
            "learning_outcome_code": "BİY.TYT.1.4", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": "Sükroz büyük molekül (disakkarit) olduğu için zardan geçemez. Ancak yoğunluğu fazla olan A kolunun ozmotik basıncı yüksek olduğundan B kolundan A koluna ozmozla su çeker.",
            **opts
        }


# ================= 7. TYT TARİH, COĞRAFYA, FELSEFE, DİN KÜLTÜRÜ =================

def gen_tyt_tarih(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    items = [
        (
            "Orhun Yazıtları'nda Bilge Kağan; *\"Türk milleti için gece uyumadım, gündüz oturmadım. Ölecek milleti dirilttim, çıplak milleti giydirdim, fakir milleti zengin kıldım.\"* ifadelerini kullanmıştır.\n\n"
            "Bilge Kağan'ın bu sözleri İlk Türk devletlerindeki yönetim anlayışıyla ilgili;\n"
            "I. Sosyal devlet (halkın refahını gözetme) anlayışının benimsendiği,\n"
            "II. Hükümdarın halka karşı sorumluluk bilinciyle hareket ettiği,\n"
            "III. Teokratik mutlakiyetle halkın yönetime katılımının tamamen yasaklandığı\n\n"
            "durumlarından hangilerini kanıtlar?",
            "I ve II",
            ["Yalnız I", "Yalnız II", "I ve III", "I, II ve III"],
            "Aç halkı doyurmak ve giydirmek doğrudan 'Sosyal Devlet' anlayışının ve hükümdarın milletine karşı görev bilincinin kanıtıdır."
        ),
        (
            "Osmanlı Devleti'nde klasik dönemde uygulanan **Tımar (Dirlik) Sistemi**'nde devlet, toprağın mülkiyetini (rakabe) elinde tutar; kullanım hakkını köylüye (reaya), vergisini toplama yetkisini ise sipahiye devrederdi. Sipahi topladığı vergiyle atlı asker (**cebelü**) yetiştirirdi.\n\n"
            "Buna göre Tımar sisteminin bozulması Osmanlı Devleti'nde;\n"
            "I. Taşrada güvenliğin sarsılması ve Celâli İsyanları'nın yayılması,\n"
            "II. Tarımsal üretimin düşmesi ve köylünün toprağı terk etmesi,\n"
            "III. Hazine giderlerinin artması ve ücretli asker (sekban/saruca) alımının çoğalması\n\n"
            "sonuçlarından hangilerine doğrudan yol açmıştır?",
            "I, II ve III",
            ["Yalnız I", "I ve II", "II ve III", "I ve III"],
            "Tımar sisteminin bozulması hem askeri hem ekonomik hem de taşra güvenliği açısından üç sonucu da doğrudan doğurmuştur."
        )
    ]
    it = items[index % len(items)]
    opts = format_tyt_options(it[1], it[2])
    return {
        "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Tarih",
        "topic": "İlk ve Orta Çağlarda Türk Dünyası", "subtopic": "Tarihsel Kaynak Analizi ve Sosyal Devlet",
        "learning_outcome_code": "TAR.TYT.1.3", "cognitive_domain": "Analiz / Muhakeme",
        "difficulty": "ÖSYM / Yeni Nesil", "question_text": it[0], "explanation": it[3], **opts
    }


def gen_tyt_cografya(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    items = [
        (
            "Türkiye'de kıyı bölgelerden iç kesimlere doğru gidildikçe iklim ve yer şekillerine bağlı olarak beşerî ve ekonomik faaliyetlerde belirgin değişimler gözlenir.\n\n"
            "Aşağıdaki bölgelerden hangisinde dağların kıyıya uzanış doğrultusu nedeniyle **denizel iklimin iç kesimlere sokulması daha kolay** olmuş ve kıyı ile iç kesim arasındaki iklim farklılığı daha az kalmıştır?",
            "Ege Bölgesi (Kıyı Ege — Dağların kıyıya dik uzanması ve graben ovaları)",
            [
                "Doğu Karadeniz Bölümü (Kaçkar Dağları'nın kıyıya paralel uzanması)",
                "Antalya Bölümü (Batı Torosların kıyıya paralel yükselmesi)",
                "Batı Karadeniz Bölümü (Küre Dağları'nın kıyı şeridini sınırlaması)",
                "Adana Bölümü (Orta Torosların iç kesimle bağlantıyı güçleştirmesi)"
            ],
            "Ege Bölgesi'nde horst-graben sistemindeki dağlar kıyıya dik uzandığı için nemli hava kütleleri graben ovaları boyunca iç kesimlere kadar sokulabilir."
        ),
        (
            "Bir ülkenin **1980 ve 2026 yıllarına ait nüfus piramitleri** karşılaştırıldığında; piramidin tabanının belirgin biçimde daraldığı, üst kısmının (65+ yaş grubu) ise genişlediği tespit edilmiştir.\n\n"
            "Bu nüfus değişimi yaşayan ülke için aşağıdakilerden hangisi **kesinlikle söylenebilir**?",
            "Doğum oranları azalmış, ortalama yaşam süresi uzamış ve ortanca (medyan) yaş yükselmiştir.",
            [
                "Toplam nüfus miktarı 1980 yılına göre yarı yarıya azalmıştır.",
                "Tarımda çalışan aktif nüfus oranı sanayi ve hizmet sektörünü geçmiştir.",
                "Bebek ölüm oranları yükselmiş ve sağlık hizmetleri gerilemiştir.",
                "Genç bağımlı nüfus oranı yaşlı bağımlı nüfus oranının iki katına çıkmıştır."
            ],
            "Piramidin tabanının daralması doğum oranlarının düştüğünü, tavanının genişlemesi ise ortalama yaşam süresinin ve yaşlı nüfus oranının (ortanca yaşın) arttığını gösterir."
        )
    ]
    it = items[index % len(items)]
    opts = format_tyt_options(it[1], it[2])
    return {
        "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Coğrafya",
        "topic": "Türkiye'nin İklimi ve Nüfus", "subtopic": "Yer Şekilleri-İklim İlişkisi ve Nüfus Piramitleri",
        "learning_outcome_code": "COĞ.TYT.2.4", "cognitive_domain": "Analiz / Muhakeme",
        "difficulty": "ÖSYM / Yeni Nesil", "question_text": it[0], "explanation": it[3], **opts
    }


def gen_tyt_felsefe(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    items = [
        (
            "Immanuel Kant'a göre bir insan, boğulmakta olan birini *'ileride bana iyiliği dokunur'* veya *'toplumda kahraman ilan edilirim'* düşüncesiyle kurtarırsa, bu eylem görünüşte ödeve uygun olsa bile **ahlaki değer taşımaz**. Eylemin ahlaki olabilmesi için hiçbir çıkar gözetmeksizin, yalnızca **'insan hayatını kurtarmak ahlaki bir ödev olduğu için'** yapılması gerekir.\n\n"
            "Bu parçadan hareketle Kant'ın ahlak felsefesi (deontoloji) hakkında aşağıdakilerden hangisine ulaşılabilir?",
            "Bir eylemin ahlaki değerini belirleyen ölçüt, eylemin doğurduğu pratik sonuçlar değil arkasındaki iyi niyet ve koşulsuz ödev bilincidir.",
            [
                "En fazla sayıda insana en büyük mutluluğu sağlayan eylem en ahlaki eylemdir.",
                "İnsan doğası gereği bencil olduğundan evrensel bir ahlak yasası kurulamaz.",
                "Ahlaki kurallar toplumdan topluma ve çağdan çağa değişen göreli uzlaşımlardır.",
                "Bireyin bedensel ve ruhsal hazza ulaşması yaşamın en yüce ahlaki amacıdır."
            ],
            "Kant'ın ödev ahlakı faydacı sonuçları reddeder; eylemin yalnızca 'iyi isteme' ve 'koşulsuz buyruk (ödev)' bilinciyle yapılmasını şart koşar."
        ),
        (
            "Karl Popper'a göre bilim, doğrulamalarla değil **'yanlışlanabilirlik' (falsifiability)** ilkesiyle ilerler. *'Bütün kuğular beyazdır.'* önermesini milyonlarca beyaz kuğu gözlemleyerek kesin olarak kanıtlayamazsınız; çünkü gelecekte siyah bir kuğu çıkma ihtimali her zaman vardır. Ancak tek bir siyah kuğu gözlemlemek bu genellemeyi kesin olarak çürütmeye yeter.\n\n"
            "Popper'ın bu bilim felsefesi yaklaşımına göre bir kuramın **bilimsel sayılabilmesinin temel ölçütü** aşağıdakilerden hangisidir?",
            "Deney ve gözlemlerle sınanabilir olması ve hangi koşullarda yanlışlanabileceğini açıkça ortaya koyması",
            [
                "Hiçbir deneysel eleştiriye açık olmayacak kadar mutlak ve değişmez kabul edilmesi",
                "Bilim dünyasının çoğunluğu tarafından hiçbir kuşku duyulmadan onaylanması",
                "Sadece matematiksel sembollerle ifade edilip duyusal dünyadan bağımsız kalması",
                "Tümevarım yöntemiyle toplanan sınırlı sayıdaki gözlemi mutlak yasa ilan etmesi"
            ],
            "Popper'a göre bir önermenin bilimsel olmasının kriteri doğrulanabilirliği değil, deneysel olarak sınanıp yanlışlanabilir (çürütülebilir) olmasıdır."
        )
    ]
    it = items[index % len(items)]
    opts = format_tyt_options(it[1], it[2])
    return {
        "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Felsefe",
        "topic": "Ahlak ve Bilim Felsefesi", "subtopic": "Felsefi Metin Analizi ve Argüman Çıkarımı",
        "learning_outcome_code": "FEL.TYT.2.3", "cognitive_domain": "Analiz / Muhakeme",
        "difficulty": "ÖSYM / Yeni Nesil", "question_text": it[0], "explanation": it[3], **opts
    }


def gen_tyt_din(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    items = [
        (
            "İslam düşünce geleneğinde bir bilginin dinî açıdan bağlayıcı sayılabilmesi için **Selim Akıl, Salim Duyular ve Sadık Haber (Vahiy / Mütevatir Haber)** kaynaklarından birine dayanması şarttır. Buna karşılık kişinin gördüğü rüyalar, öznel sezgileri (ilham) ve keşifleri yalnızca kendisini bağlar; toplumun tamamı için dinî bir hüküm kaynağı oluşturamaz.\n\n"
            "Bu ilkenin İslam toplumunda öncelikle hangi tehlikeyi önlemeye yönelik olduğu söylenebilir?",
            "Öznel iddiaların, hurafelerin ve istismarcı yorumların dinin kesin emriymiş gibi topluma dayatılmasını",
            [
                "İnsanların bireysel ibadetlerinde samimiyet ve huşu arayışına girmesini",
                "Bilim insanlarının doğa olaylarını deney ve gözlemle incelemesini",
                "Farklı coğrafyalardaki Müslümanların kültürel sanat eserleri üretmesini",
                "Ayetlerin anlaşılmasında akıl ve mantık ilkelerine başvurulmasını"
            ],
            "İslam epistemolojisinde bilginin nesnel kaynaklara (vahiy, akıl, duyular) bağlanması, dinin sübjektif rüya/ilham iddialarıyla istismar edilmesini engeller."
        ),
        (
            "Bir kimsenin gösterişten, şöhret arzusundan ve dünyevi bir çıkar beklentisinden tamamen arınarak ibadetlerini ve iyiliklerini **yalnızca Allah'ın rızasını kazanmak** amacıyla yapması **'İhlas'**; her an Allah'ın kendisini gördüğü bilinciyle en güzel ve titiz biçimde davranması ise **'İhsan'** kavramıyla ifade edilir.\n\n"
            "Buna göre İhlas ve İhsan bilincini içselleştirmiş bir bireyden aşağıdaki davranışlardan hangisi **beklenmez**?",
            "Yaptığı hayır ve yardımları toplum içinde itibar kazanmak amacıyla sürekli dile getirmesi",
            [
                "Kimsenin görmediği ortamlarda dahi kul hakkına ve dürüstlüğe riayet etmesi",
                "Üstlendiği mesleki görevi denetleyen biri olmasa bile eksiksiz yerine getirmesi",
                "İhtiyaç sahiplerini incitmemek için yardımlarını gizlice ulaştırmaya özen göstermesi",
                "İbadetlerinde şekilselliğin ötesine geçerek samimiyeti esas alması"
            ],
            "Gösteriş ve itibar kazanmak için yapılan iyilik 'riya'dır ve İhlas/İhsan kavramlarının tam zıddıdır."
        )
    ]
    it = items[index % len(items)]
    opts = format_tyt_options(it[1], it[2])
    return {
        "exam_type": "TYT", "grade_level": "9-10. Sınıf", "subject": "Din Kültürü ve Ahlak Bilgisi",
        "topic": "İslam ve İnanç Esasları", "subtopic": "İslam Epistemolojisi ve Ahlaki Kavramlar",
        "learning_outcome_code": "DİN.TYT.1.3", "cognitive_domain": "Analiz / Muhakeme",
        "difficulty": "ÖSYM / Yeni Nesil", "question_text": it[0], "explanation": it[3], **opts
    }


# ================= ANA TYT SÖZLÜĞÜ VE ÜRETİCİ =================

TYT_DISPATCHER = {
    "Türkçe": gen_tyt_turkce,
    "Temel Matematik": gen_tyt_matematik,
    "Matematik": gen_tyt_matematik,
    "Geometri": gen_tyt_geometri,
    "Fizik": gen_tyt_fizik,
    "Kimya": gen_tyt_kimya,
    "Biyoloji": gen_tyt_biyoloji,
    "Tarih": gen_tyt_tarih,
    "Coğrafya": gen_tyt_cografya,
    "Felsefe": gen_tyt_felsefe,
    "Din Kültürü ve Ahlak Bilgisi": gen_tyt_din,
    "Din Kültürü": gen_tyt_din,
}


def generate_tyt_question(subject: str, index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    s_norm = str(subject or "").lower()
    if "geometri" in s_norm:
        return gen_tyt_geometri(index, topic)
    elif "matematik" in s_norm:
        return gen_tyt_matematik(index, topic)
    elif "fizik" in s_norm:
        return gen_tyt_fizik(index, topic)
    elif "kimya" in s_norm:
        return gen_tyt_kimya(index, topic)
    elif "biyoloji" in s_norm:
        return gen_tyt_biyoloji(index, topic)
    elif "tarih" in s_norm:
        return gen_tyt_tarih(index, topic)
    elif "coğrafya" in s_norm or "cografya" in s_norm:
        return gen_tyt_cografya(index, topic)
    elif "felsefe" in s_norm:
        return gen_tyt_felsefe(index, topic)
    elif "din" in s_norm:
        return gen_tyt_din(index, topic)
    return gen_tyt_turkce(index, topic)
