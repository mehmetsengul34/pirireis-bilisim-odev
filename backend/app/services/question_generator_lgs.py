# -*- coding: utf-8 -*-
"""
LGS 8. Sınıf Yeni Nesil Beceri Temelli Soru Üretim Motoru (MEB Türkiye Yüzyılı Maarif Modeli & PISA Standartları)
Branşlar:
1. Türkçe
2. Matematik
3. Fen Bilimleri
4. T.C. İnkılap Tarihi ve Atatürkçülük
5. Din Kültürü ve Ahlak Bilgisi
6. İngilizce

Standart:
- Sadece 4 seçenek (A, B, C, D). option_e KESİNLİKLE None.
- Gerçek yaşam senaryoları, tablo/veri analizi, öncüllü (I, II, III) muhakeme ve deney düzenekleri.
- KaTeX formülleri $ ... $ biçiminde.
- Altı çizili sözcüklerde <u>...</u> etiketi zorunlu.
"""

import random
import math
from typing import Dict, Any, List


def format_lgs_options(correct_text: str, distractors: List[str]) -> Dict[str, Any]:
    """LGS için kesin 4 seçenek (A, B, C, D) ve None E şıkkı oluşturur."""
    letters = ["A", "B", "C", "D"]
    corr_idx = random.randint(0, 3)
    clean_dist = [d for d in distractors if "ulaşılamaz" not in str(d).lower() and d != correct_text][:3]

    fillers = [
        "Yalnızca I. öncüldeki değişkenin bağımsız parametre olarak sabit tutulması",
        "Verilen tablodaki ilk iki grubun aritmetik ortalamasının birbirine eşit olması",
        "Metindeki temel argümanın yalnızca kronolojik sıralamaya dayandırılması",
        "Deney düzeneğindeki kontrol grubunun son aşamada devre dışı bırakılması"
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
    opts["correct_answer"] = letters[corr_idx]
    return opts


# ================= 1. LGS TÜRKÇE (YENİ NESİL BECERİ TEMELLİ) =================

def gen_lgs_turkce(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    top_low = str(topic or "").lower()

    if "fiilimsi" in top_low or "eylemsi" in top_low:
        archetype = 0
    elif "öge" in top_low:
        archetype = 1
    elif "mantık" in top_low or "muhakeme" in top_low or "görsel" in top_low:
        archetype = 2
    elif "paragraf" in top_low or "anlam" in top_low:
        archetype = random.choice([3, 4])
    elif "noktalama" in top_low:
        archetype = 5
    elif "yazım" in top_low:
        archetype = 6
    elif "söz sanat" in top_low or "metin" in top_low:
        archetype = 7
    else:
        archetype = index % 8

    if archetype == 0:
        # Yeni Nesil Fiilimsiler: Bağlam İçi Çoklu Analiz
        scenarios = [
            (
                "Bilim insanları, Antarktika'daki buzulların altında <u>keşfedilmeyi</u> bekleyen antik gölleri incelemek için özel bir robot tasarladı. "
                "Buz katmanlarını <u>eriterek</u> ilerleyen bu cihaz, su örneklerini <u>toplayan</u> sensörleri sayesinde daha önce hiç <u>görülmemiş</u> mikroorganizmaları kayıt altına aldı.",
                "I. 'keşfedilmeyi' sözcüğü isim-fiil (mastar) eki almıştır.\n"
                "II. 'eriterek' sözcüğü cümleye durum anlamı katan bir zarf-fiildir (ulaç).\n"
                "III. 'toplayan' ve 'görülmemiş' sözcükleri sıfat-fiil (ortaç) görevinde kullanılmıştır.",
                "I, II ve III",
                ["Yalnız I", "I ve II", "II ve III"],
                "Parçadaki altı çizili sözcüklerden 'keşfedilmeyi' (-me isim-fiil), 'eriterek' (-erek zarf-fiil), 'toplayan' (-an sıfat-fiil) ve 'görülmemiş' (-miş sıfat-fiil) olduğundan üç öncül de doğrudur."
            ),
            (
                "Anadolu'nun kadim kentlerinde <u>yürütülen</u> arkeolojik kazılar, geçmiş medeniyetlerin gündelik yaşamını <u>aydınlatmak</u> açısından eşsiz veriler sunuyor. "
                "Toprağın altından gün yüzüne <u>çıkarılınca</u> büyük heyecan uyandıran tabletler, o dönemin ticaret ağını <u>anlamamızı</u> kolaylaştırıyor.",
                "I. 'yürütülen' sözcüğü kendisinden sonraki ismi niteleyen bir sıfat-fiildir.\n"
                "II. 'aydınlatmak' ve 'anlamamızı' sözcükleri isim-fiil grubu oluşturmuştur.\n"
                "III. 'çıkarılınca' sözcüğü cümleye zaman anlamı katan bir zarf-fiildir.",
                "I, II ve III",
                ["I ve II", "I ve III", "II ve III"],
                "'yürütülen' (-en sıfat-fiil), 'aydınlatmak' ve 'anlamamızı' (-mak/-ma isim-fiil), 'çıkarılınca' (-ınca zarf-fiil) görevindedir. Tüm yargılar doğrudur."
            )
        ]
        sc = scenarios[index % len(scenarios)]
        q_text = (
            f"**Metin:**\n\"{sc[0]}\"\n\n"
            f"Bu metindeki altı çizili fiilimsilerle (eylemsilerle) ilgili;\n{sc[1]}\n\n"
            f"yargılarından hangileri **doğrudur**?"
        )
        opts = format_lgs_options(sc[2], sc[3])
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Türkçe",
            "topic": "Fiilimsiler (Eylemsiler)", "subtopic": "İsim-Fiil, Sıfat-Fiil ve Zarf-Fiil Muhakemesi",
            "learning_outcome_code": "T.8.3.9", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "explanation": sc[4], **opts
        }

    elif archetype == 1:
        # Yeni Nesil Cümlenin Ögeleri: Vurgu ve Öge Eşleştirme
        items = [
            (
                "I. Türkiye'nin ilk yerli gözlem uydusu, yüksek çözünürlüklü görüntüleri **uzay istasyonuna** dün gece başarıyla iletti.\n"
                "II. Genç araştırmacılar, yenilenebilir enerji projelerini **bilim fuarının ana salonunda** ziyaretçilere tanıttılar.\n"
                "III. Geleneksel el sanatları ustası, yüzyıllık motifleri **büyük bir sabır ve titizlikle** bakır tepsiye işliyordu.",
                "Numaralanmış cümlelerde koyu yazılmış bölümlerin cümledeki öge görevleri aşağıdakilerin hangisinde sırasıyla doğru verilmiştir?",
                "I: Yer Tamlayıcısı (Dolaylı Tümleç) — II: Yer Tamlayıcısı — III: Zarf Tamlayıcısı",
                [
                    "I: Belirtili Nesne — II: Yer Tamlayıcısı — III: Zarf Tamlayıcısı",
                    "I: Yer Tamlayıcısı — II: Zarf Tamlayıcısı — III: Belirtisiz Nesne",
                    "I: Zarf Tamlayıcısı — II: Yer Tamlayıcısı — III: Özne"
                ],
                "I. cümlede 'nereye iletti?' -> 'uzay istasyonuna' (Yer Tamlayıcısı). II. cümlede 'nerede tanıttılar?' -> 'bilim fuarının ana salonunda' (Yer Tamlayıcısı). III. cümlede 'nasıl işliyordu?' -> 'büyük bir sabır ve titizlikle' (Zarf Tamlayıcısı)."
            )
        ]
        it = items[index % len(items)]
        q_text = f"{it[0]}\n\n{it[1]}"
        opts = format_lgs_options(it[2], it[3])
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Türkçe",
            "topic": "Cümlenin Ögeleri", "subtopic": "Cümle Çözümlemesi ve Öge İşlevleri",
            "learning_outcome_code": "T.8.3.18", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "explanation": it[4], **opts
        }

    elif archetype == 2:
        # Sözel Mantık ve Muhakeme (Yeni Nesil Tablo/Kural Kurgusu)
        puzzles = [
            (
                "Bir okulun kütüphane haftası etkinliklerinde **Aslı, Burak,eren, Deniz ve Ece** adlı öğrenciler; **Roman, Bilim, Tarih, Şiir ve Felsefe** türlerinden birer kitap seçmiştir. Seçimlerle ilgili şunlar bilinmektedir:\n"
                "- Her öğrenci farklı bir türde kitap seçmiştir.\n"
                "- Aslı **Bilim** veya **Tarih** kitabı seçmemiştir.\n"
                "- Deniz **Şiir** kitabı seçmiştir.\n"
                "- Burak'ın seçtiği tür **Tarih**, Ece'nin seçtiği tür ise **Roman**'dır.\n"
                "- Eren **Felsefe** türünü seçmemiştir.\n\n"
                "Bu bilgilere göre **Aslı ve Eren'in** seçtiği kitap türleri aşağıdakilerin hangisinde sırasıyla doğru verilmiştir?",
                "Aslı: Felsefe — Eren: Bilim",
                [
                    "Aslı: Bilim — Eren: Felsefe",
                    "Aslı: Roman — Eren: Tarih",
                    "Aslı: Felsefe — Eren: Şiir"
                ],
                "Deniz=Şiir, Burak=Tarih, Ece=Roman seçmiştir. Geriye Bilim ve Felsefe kalmıştır. Aslı Bilim seçmediğine göre Aslı=Felsefe, Eren=Bilim olmak zorundadır."
            ),
            (
                "Bir teknoloji festivalinde **K, L, M, N ve P** robotları; Pazartesi'den Cuma'ya kadar hafta içi her gün bir robot olmak üzere sırayla tanıtılacaktır:\n"
                "- **M** robotu Çarşamba günü tanıtılacaktır.\n"
                "- **K** robotu, **M**'den hemen önceki gün tanıtılacaktır.\n"
                "- **P** robotu Cuma günü tanıtılmayacaktır.\n"
                "- **L** robotu, **N** robotundan önceki bir günde tanıtılacaktır.\n\n"
                "Buna göre **Pazartesi ve Cuma** günleri tanıtılacak robotlar sırasıyla hangileridir?",
                "Pazartesi: P — Cuma: N",
                [
                    "Pazartesi: L — Cuma: P",
                    "Pazartesi: P — Cuma: L",
                    "Pazartesi: N — Cuma: L"
                ],
                "Çarşamba=M ve hemen öncesi Salı=K'dır. Geriye Pazartesi, Perşembe ve Cuma kalır. L, N'den önce olacağı ve P Cuma olamayacağı için; P=Pazartesi olmak zorundadır (eğer P=Perşembe olsaydı L=Pazartesi, N=Cuma da sağlanırdı ancak L ile N ardışık son iki güne yerleştiğinde P=Pazartesi, L=Perşembe, N=Cuma kesinleşir)."
            )
        ]
        pz = puzzles[index % len(puzzles)]
        opts = format_lgs_options(pz[1], pz[2])
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Türkçe",
            "topic": "Sözel Mantık ve Muhakeme", "subtopic": "Tablo ve Öncül Çıkarımı",
            "learning_outcome_code": "T.8.3.26", "cognitive_domain": "Üst Düzey Akıl Yürütme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": pz[0], "explanation": pz[3], **opts
        }

    elif archetype == 3:
        # Yeni Nesil İki Diyaloglu / Gazeteci-Yazar Muhakeme Paragrafı
        dialogues = [
            (
                "**Gazeteci:** — Son dönemde yapay zekâ araçlarının metin yazarlığında kullanılması edebiyat dünyasında endişe yarattı. Sizce algoritmalar gerçek bir romancının yerini alabilir mi?\n\n"
                "**Yazar:** — Algoritmalar milyarlarca cümleyi tarayarak kusursuz dil bilgisine sahip metinler üretebilir. Ancak edebiyat, kusursuz cümle kurma matematiği değil; insanın acısını, çocukluk travmalarını, ölüm korkusunu ve yaşama sevincini <u>etten ve kemikten bir tanıklıkla</u> kâğıda dökme sanatıdır. Hiçbir kod satırı, bir insanın kalp kırıklığını bizzat yaşamadan o sızıyı okura geçiremez.\n\n"
                "Bu diyalogdan hareketle yazarın yapay zekâ ve edebiyat ilişkisi hakkındaki **temel görüşü** aşağıdakilerden hangisidir?",
                "Gerçek edebi değer, dilsel kusursuzluktan ziyade yaşanmış insani duyguların ve varoluşsal deneyimlerin aktarılmasıyla doğar.",
                [
                    "Yapay zekâ algoritmaları yakın gelecekte dil bilgisi bakımından insan yazarları tamamen geride bırakacaktır.",
                    "Okurlar bir eseri değerlendirirken yazarın kimliğinden çok metnin akıcılığına ve kurgusuna odaklanır.",
                    "Teknolojik gelişmeler edebi türlerin biçimsel yapısını değiştirerek yeni anlatım teknikleri ortaya çıkarmaktadır."
                ],
                "Yazar, algoritmaların teknik açıdan düzgün metin üretse bile 'etten ve kemikten yaşanmış insani deneyime' sahip olamayacağını vurgulamaktadır."
            ),
            (
                "**Eleştirmen:** — Günümüz okuru uzun betimlemelerden sıkılıyor; doğrudan olay örgüsünün hızla aktığı yapıtları tercih ediyor. Bu durum yazarları nasıl etkiliyor?\n\n"
                "**Romancı:** — Hız çağının dayattığı bu sabırsızlık, edebiyatı fast-food kültürüne dönüştürme tehlikesi taşıyor. Oysa bir romanda mekânın kokusunu, karakterin yüzündeki bir kırışıklığın ardındaki yılları <u>sindire sindire</u> anlatmazsanız, okurun zihninde derinlikli bir dünya kuramazsınız. Ben popüler rüzgâra kapılıp derinliği feda etmektense az ama nitelikli okurla yol yürümeyi seçiyorum.\n\n"
                "Bu konuşmada romancının **yakındığı temel durum** aşağıdakilerden hangisidir?",
                "Popüler hız kültürünün edebi eserlerdeki sanatsal derinliği ve ayrıntı zenginliğini yüzeyselleştirme baskısı",
                [
                    "Eleştirmenlerin çağdaş romanları geleneksel ölçütlerle değerlendirmekte ısrar etmesi",
                    "Genç yazarların klasik edebiyat yapıtlarını yeterince incelemeden roman yazmaya başlaması",
                    "Yayınevlerinin tanıtım faaliyetlerinde nitelikli eserlere yeterince bütçe ayırmaması"
                ],
                "Romancı, hız çağının etkisiyle uzun betimlemelerin ve derinliğin terk edilip edebiyatın yüzeyselleştirilmesine (fast-food kültürüne dönüşmesine) karşı çıkmaktadır."
            )
        ]
        dg = dialogues[index % len(dialogues)]
        opts = format_lgs_options(dg[1], dg[2])
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Türkçe",
            "topic": "Paragrafta Anlam ve Ana Düşünce", "subtopic": "Diyalog ve Eleştirel Muhakeme",
            "learning_outcome_code": "T.8.3.16", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": dg[0], "explanation": dg[3], **opts
        }

    elif archetype == 4:
        # Altı Çizili Söz Öbeği (Yeni Nesil Metin Bağlamlı)
        phrases = [
            (
                "Bilimsel araştırmalarda daha önce binlerce kez yürünmüş güvenli yollardan gitmek bilim insanına yeni bir keşif kazandırmaz. Çığır açan buluşlar, ancak <u>alışılmışın kalıplarını kırıp</u> bilinmeyenin sınırlarına cesaretle yürüyen araştırmacıların eseridir.",
                "Yerleşik ve sıradanlaşmış düşünce biçimlerinin dışına çıkarak özgün yaklaşımlar geliştirmek",
                [
                    "Geçmişteki bilimsel kuramların tamamını yanlışlayarak reddetmek",
                    "Deney sonuçlarını toplumun beklentilerine uygun biçimde yeniden yorumlamak",
                    "Bilimsel çalışmalarda yalnızca kuramsal hesaplamalara bağlı kalmak"
                ]
            ),
            (
                "Usta bir öykücü, kelimeleri rastgele kâğıda serpiştirmez; her sözcüğü bir kuyumcu titizliğiyle seçerek okurun zihninde <u>kendi yankısını bulan</u> çok katmanlı bir anlam evreni inşa eder.",
                "Okuyucunun iç dünyasında kişisel bir karşılık ve derin bir çağrışım uyandıran",
                [
                    "Yazarın yaşam öyküsünü hiçbir kurgu katmadan olduğu gibi yansıtan",
                    "Sadece yazıldığı dönemin tarihsel olaylarına ışık tutan",
                    "Dil bilgisi kurallarına harfiyen bağlı kalarak öğretici bir üslup benimseyen"
                ]
            )
        ]
        ph = phrases[index % len(phrases)]
        q_text = f"**Parça:**\n\"{ph[0]}\"\n\nBu parçadaki **altı çizili sözle** anlatılmak istenen aşağıdakilerden hangisidir?"
        opts = format_lgs_options(ph[1], ph[2])
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Türkçe",
            "topic": "Sözcükte ve Söz Öbeklerinde Anlam", "subtopic": "Bağlam Temelli Söz Öbeği Yorumu",
            "learning_outcome_code": "T.8.3.5", "cognitive_domain": "Kavrama / Analiz",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": f"Altı çizili ifade metin bağlamında '{ph[1]}' anlamını taşımaktadır.", **opts
        }

    elif archetype == 5:
        # Yeni Nesil Noktalama İşaretleri: Kural-Örnek Eşleştirme
        q_text = (
            "Aşağıda virgülün (,) bazı kullanım kuralları verilmiştir:\n"
            "- **Kural 1:** Sıralı cümleleri birbirinden ayırmak için konur.\n"
            "- **Kural 2:** Cümle içinde ara sözleri veya ara cümleleri ayırmak için ara sözün başına ve sonuna konur.\n"
            "- **Kural 3:** Anlam karışıklığını önlemek için özne veya tamlayan sonrasında kullanılır.\n\n"
            "Buna göre aşağıdaki cümlelerin hangisinde virgül, yukarıdaki kurallardan **herhangi birinin örneği değildir**?"
        )
        corr = "Sabahın erken saatlerinde sahil kenarındaki asırlık çınarların, ıhlamurların ve erguvanların altında yürüyüş yaptık."
        dist = [
            "Genç, doktorun odasından çıktıktan sonra elindeki reçeteyi dikkatle inceledi.",
            "Doğup büyüdüğü o şirin Anadolu ilçesini, Torbalı'yı, her yaz mutlaka ziyaret ederdi.",
            "Fırtına öncesi gökyüzü bir anda karardı, sokaktaki insanlar telaşla evlerine çekildi."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Türkçe",
            "topic": "Noktalama İşaretleri", "subtopic": "Noktalama İşaretlerinin İşlev Eşleştirmesi",
            "learning_outcome_code": "T.8.4.16", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Doğru seçenekte virgül 'eş görevli sözcükleri (çınarların, ıhlamurların)' ayırmak için kullanılmıştır; verilen 3 kuralda bu işlev yer almamaktadır.",
            **opts
        }

    elif archetype == 6:
        # Yeni Nesil Yazım Kuralları: Öncüllü Metin Denetimi
        q_text = (
            "**Metin:**\n"
            "(I) Türkiye'nin uzay araştırmaları kapsamında **2026 yılı Ekim ayında** uluslararası bir sempozyum düzenlenecek. "
            "(II) Sempozyuma **Orta Doğu Teknik Üniversitesi** başta olmak üzere pek çok kurumdan astrofizikçi katılacak. "
            "(III) Araştırmacılar, **Güneş Sistemi'nin** dış halkasındaki gezegenlerin atmosfer yapısını tartışacaklar. "
            "(IV) Toplantı sonunda yayımlanacak bildiride **bir çok** yeni teleskop veriside kamuoyuyla paylaşılacak.\n\n"
            "Bu metindeki numaralanmış cümlelerin hangisinde **birden fazla yazım yanlışı** yapılmıştır?"
        )
        corr = "IV. cümlede ('birçok' bitişik, 'verisi de' bağlacı ayrı yazılmalıdır)"
        dist = [
            "I. cümlede ('ekim' küçük harfle yazılmalıdır)",
            "II. cümlede ('Üniversitesi' küçük harfle yazılmalıdır)",
            "III. cümlede ('Sistemi'nin' kesme işaretiyle ayrılmamalıdır)"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Türkçe",
            "topic": "Yazım Kuralları", "subtopic": "Büyük Harfler, Birleşik Sözcükler ve Bağlaçlar",
            "learning_outcome_code": "T.8.4.15", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "I, II ve III. cümlelerde yazım doğrudur (belirli tarih yanında ay adı büyük, kurum adı büyük, gök bilimi terimi büyük). IV. cümlede 'birçok' bitişik ve 'verisi de' ayrı yazılmalıdır.",
            **opts
        }

    else:
        # Metin Türleri ve Düşünceyi Geliştirme Yolları
        q_text = (
            "\"Bilim kurgu edebiyatı çoğu zaman gerçeklikten bir kaçış olarak görülür. Oysa Jules Verne denizaltıyı hayal etmeseydi veya Isaac Asimov robot yasalarını kurgulamasaydı, bugünkü mühendislik dünyası çok daha çorak kalırdı. "
            "Nitekim ünlü fizikçi Michio Kaku da 'Bugünün bilim kurgusu yarının bilimsel gerçeğidir.' diyerek hayal gücünün laboratuvarlara nasıl yön verdiğini açıkça ortaya koymaktadır.\"\n\n"
            "Bu parçanın anlatımında yazar düşüncesini inandırıcı kılmak için öncelikle hangi **düşünceyi geliştirme yollarına** başvurmuştur?"
        )
        corr = "Örneklendirme ve Tanık Gösterme",
        if isinstance(corr, tuple):
            corr = corr[0]
        dist = [
            "Sayısal Verilerden Yararlanma ve Tanımlama",
            "Benzetme ve Duyulardan Yararlanma",
            "Tanımlama ve Öyküleme"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Türkçe",
            "topic": "Metin Türleri ve Söz Sanatları", "subtopic": "Anlatım Biçimleri ve Düşünceyi Geliştirme Yolları",
            "learning_outcome_code": "T.8.3.21", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Parçada Jules Verne ve Asimov örnek verilmiş (Örneklendirme), ardından Michio Kaku'nun sözü doğrudan alıntılanmıştır (Tanık Gösterme).",
            **opts
        }


# ================= 2. LGS MATEMATİK (YENİ NESİL BECERİ TEMELLİ) =================

def gen_lgs_matematik(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import (
        generate_dynamic_chart_analysis_svg,
        generate_dynamic_folding_geometry_svg,
        generate_dynamic_coordinate_transform_svg,
        generate_dynamic_triangle_svg
    )
    if index is None:
        index = random.randint(0, 999)
    top_low = str(topic or "").lower()

    if "çarpan" in top_low or "ebob" in top_low or "ekok" in top_low:
        archetype = 0
    elif "veri" in top_low or "grafik" in top_low or "daire" in top_low:
        archetype = 1
    elif "üslü" in top_low:
        archetype = 2
    elif "kareköklü" in top_low or "köklü" in top_low:
        archetype = 3
    elif "üçgen" in top_low or "pisagor" in top_low or "katlama" in top_low:
        archetype = 4
    elif "cebirsel" in top_low or "özdeşlik" in top_low:
        archetype = 5
    elif "doğrusal" in top_low or "koordinat" in top_low or "dönüşüm" in top_low:
        archetype = 6
    elif "olasılık" in top_low or "eşitsizlik" in top_low:
        archetype = 7
    else:
        archetype = index % 8

    if archetype == 0:
        # Yeni Nesil EBOB-EKOK: İki Farklı Marka Güneş Paneli / Raf Dizilimi
        step1 = random.choice([18, 24, 30])
        step2 = random.choice([20, 36, 40])
        while step1 == step2:
            step2 = random.choice([20, 36, 40])
        lcm_cm = (step1 * step2) // math.gcd(step1, step2)
        mult = random.choice([3, 4, 5])
        total_len = lcm_cm * mult
        count1 = total_len // step1
        count2 = total_len // step2
        cost1 = random.choice([120, 150])
        cost2 = random.choice([140, 180])
        diff_cost = abs(count1 * cost1 - count2 * cost2)

        q_text = (
            f"Bir akıllı sera projesinde eşit uzunluktaki iki paralel rafa LED aydınlatma modülleri boşluk kalmadan ve raf dışına taşmadan dizilecektir:\n"
            f"- **1. Rafa:** Her birinin uzunluğu ${step1}\\text{{ cm}}$ ve adet fiyatı ${cost1}\\text{{ TL}}$ olan A tipi modüller,\n"
            f"- **2. Rafa:** Her birinin uzunluğu ${step2}\\text{{ cm}}$ ve adet fiyatı ${cost2}\\text{{ TL}}$ olan B tipi modüller yan yana diziliyor.\n\n"
            f"Raflardan birinin uzunluğunun **${total_len - 35}\\text{{ cm}}$ ile ${total_len + 35}\\text{{ cm}}$ arasında** olduğu bilindiğine göre, "
            f"1. ve 2. rafa yerleştirilen modüllerin toplam maliyetleri arasındaki fark **kaç TL'dir**?"
        )
        corr = f"${diff_cost}$ TL"
        dist = [
            f"${diff_cost + cost1}$ TL",
            f"${max(100, diff_cost - cost2)}$ TL",
            f"${(count1 + count2) * 50}$ TL"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Matematik",
            "topic": "Çarpanlar ve Katlar (EBOB-EKOK)", "subtopic": "Gerçek Yaşam EKOK ve Maliyet Optimizasyonu",
            "learning_outcome_code": "M.8.1.1.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                f"Raf uzunluğu $EKOK({step1}, {step2}) = {lcm_cm}\\text{{ cm}}$'nin katı olmalıdır. Verilen aralıktaki kat ${lcm_cm} \\times {mult} = {total_len}\\text{{ cm}}$'dir. "
                f"A modülü sayısı $= {total_len}/{step1} = {count1}$ adet (Maliyet: ${count1 * cost1}$ TL). "
                f"B modülü sayısı $= {total_len}/{step2} = {count2}$ adet (Maliyet: ${count2 * cost2}$ TL). "
                f"Maliyet farkı $= |{count1 * cost1} - {count2 * cost2}| = {diff_cost}$ TL bulunur."
            ),
            **opts
        }

    elif archetype == 1:
        # Yeni Nesil Veri Analizi: Daire ve Sütun Grafiği Eşleştirmesi (SVG'li)
        k_unit = random.choice([4, 5, 6, 8])
        # A: 120 deg -> 40*k/10, B: 90 deg -> 30*k/10, C: 150 deg -> 50*k/10
        # SVG'de 120, 90, 150 derece ve 40, 30, 50 baz oranları var
        total_items = 12 * k_unit  # 360 derece -> 12*k_unit (30 derece = k_unit)
        val_a = 4 * k_unit  # 120 deg
        val_b = 3 * k_unit  # 90 deg
        val_c = 5 * k_unit  # 150 deg
        defect_rate_c = 20  # %20
        net_c = val_c - (val_c * defect_rate_c // 100)
        svg = generate_dynamic_chart_analysis_svg(120, 90, 150, "Grafik 1: Merkez Açılar & Grafik 2: Referans Oran")

        q_text = (
            f"Bir teknoloji fabrikasında üretilen **A, B ve C** model sensörlerin sayıca dağılımı yukarıdaki **Grafik 1 (Daire Grafiği)**'nde merkez açılarıyla ($120^\\circ, 90^\\circ, 150^\\circ$) gösterilmiştir.\n"
            f"- Fabrikada bir günde üretilen **B model** sensör sayısı **${val_b}$ adet**tir.\n"
            f"- Kalite kontrol aşamasında **C model** sensörlerin **%$20$'sinin** arızalı olduğu tespit edilip ayrılmıştır.\n\n"
            f"Buna göre fabrikada o gün üretilen **A model sensör sayısı** ile **sağlam C model sensör sayısının** toplamı kaçtır?"
        )
        ans = val_a + net_c
        corr = f"${ans}$"
        dist = [f"${val_a + val_c}$", f"${ans + k_unit}$", f"${total_items}$"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Matematik",
            "topic": "Veri Analizi (Daire ve Çizgi Grafiği)", "subtopic": "Daire ve Sütun Grafiği Dönüşümü",
            "learning_outcome_code": "M.8.4.1.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": (
                f"$90^\\circ$ merkez açılı B modeli ${val_b}$ adet ise her $30^\\circ$ dilim ${k_unit}$ sensöre karşılık gelir. "
                f"A modeli ($120^\\circ = 4 \\times {k_unit} = {val_a}$ adet), C modeli ($150^\\circ = 5 \\times {k_unit} = {val_c}$ adet). "
                f"C modelinin %$20$'si arızalıysa %$80$'i sağlamdır: ${val_c} \\times 0.80 = {net_c}$ adet. "
                f"Toplam $= {val_a} + {net_c} = {ans}$ bulunur."
            ),
            **opts
        }

    elif archetype == 2:
        # Yeni Nesil Üslü İfadeler: Güneş Enerjisi / Veri Depolama Tablosu
        exp_base = random.choice([8, 9, 10])
        panels = 2 ** 5  # 32 panel
        daily_wh = 2 ** exp_base
        days = 2 ** 4    # 16 gün
        total_exp = 5 + exp_base + 4
        four_exp = total_exp // 2 if total_exp % 2 == 0 else None

        q_text = (
            f"Bir okulun çatısına kurulan güneş enerjisi sisteminde **$32$ adet** özdeş fotovoltaik panel bulunmaktadır.\n"
            f"- Her bir panel günde ortalama **$2^{{{exp_base}}}\\text{{ Watt-saat}}$** elektrik enerjisi üretmektedir.\n"
            f"- Üretilen enerjinin tamamı **$16$ gün** boyunca hiç kayıp olmadan ana bataryada depolanmıştır.\n\n"
            f"Buna göre $16$ günün sonunda bataryada biriken toplam elektrik enerjisinin Watt-saat cinsinden **üslü ifadesi** aşağıdakilerden hangisine eşittir?"
        )
        corr = f"$2^{{{total_exp}}}$"
        dist = [
            f"$2^{{{total_exp - 2}}}$",
            f"$2^{{{5 * exp_base}}}$",
            f"$2^{{{total_exp + 3}}}$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Matematik",
            "topic": "Üslü İfadeler", "subtopic": "Üslü İfadelerle Çarpma ve Modelleme",
            "learning_outcome_code": "M.8.1.2.3", "cognitive_domain": "Uygulama / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                f"Panel sayısı $= 32 = 2^5$, gün sayısı $= 16 = 2^4$, günlük üretim $= 2^{{{exp_base}}}$. "
                f"Toplam enerji $= 2^5 \\times 2^4 \\times 2^{{{exp_base}}} = 2^{{5 + 4 + {exp_base}}} = 2^{{{total_exp}}}$ Watt-saat olur."
            ),
            **opts
        }

    elif archetype == 3:
        # Yeni Nesil Kareköklü İfadeler: $a\sqrt{b}$ Parkur / Robot Yürüyüşü
        rad = random.choice([2, 3, 5])
        c1 = random.choice([3, 4, 5])
        c2 = random.choice([2, 6, 7])
        c3 = random.choice([2, 3])
        sq1 = (c1 ** 2) * rad
        sq2 = (c2 ** 2) * rad
        sq3 = (c3 ** 2) * rad
        net_coeff = c1 + c2 - c3

        q_text = (
            f"Otonom bir çizgi izleyen robot, doğrusal bir test pistinde A noktasından başlayarak;\n"
            f"1. Adımda ileri yönde **$\\sqrt{{{sq1}}}\\text{{ dm}}$**,\n"
            f"2. Adımda aynı yönde **$\\sqrt{{{sq2}}}\\text{{ dm}}$** ilerledikten sonra,\n"
            f"3. Adımda ters yönde **$\\sqrt{{{sq3}}}\\text{{ dm}}$** geri gelerek B noktasında durmuştur.\n\n"
            f"Buna göre robotun başlangıç noktası (A) ile durduğu nokta (B) arasındaki **net uzaklık kaç desimetredir**?"
        )
        corr = f"${net_coeff}\\sqrt{{{rad}}}\\text{{ dm}}$"
        dist = [
            f"${c1 + c2 + c3}\\sqrt{{{rad}}}\\text{{ dm}}$",
            f"${abs(c1 - c2) + c3}\\sqrt{{{rad}}}\\text{{ dm}}$",
            f"$\\sqrt{{{sq1 + sq2 - sq3}}}\\text{{ dm}}$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Matematik",
            "topic": "Kareköklü İfadeler", "subtopic": "Kareköklü İfadelerde Toplama ve Çıkarma Problemleri",
            "learning_outcome_code": "M.8.1.3.4", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                f"$\\sqrt{{{sq1}}} = {c1}\\sqrt{{{rad}}}$, $\\sqrt{{{sq2}}} = {c2}\\sqrt{{{rad}}}$ ve $\\sqrt{{{sq3}}} = {c3}\\sqrt{{{rad}}}$ dm'dir. "
                f"Net yer değiştirme $= ({c1} + {c2} - {c3})\\sqrt{{{rad}}} = {net_coeff}\\sqrt{{{rad}}}$ dm bulunur."
            ),
            **opts
        }

    elif archetype == 4:
        # Yeni Nesil Katlama Geometrisi ve Açı/Üçgen (SVG'li)
        alpha = random.choice([32, 36, 40, 42])
        # Katlamada EF kat izi açıortaydır: m(DEF) = m(F E D') = alpha => m(A E D') = 180 - 2*alpha
        rem_angle = 180 - 2 * alpha
        svg = generate_dynamic_folding_geometry_svg(12, 8, alpha, "LGS Yeni Nesil Dikdörtgen Katlama Modeli")

        q_text = (
            f"Şekildeki $ABCD$ dikdörtgeni biçimindeki ön yüzü mavi, arka yüzü açık mavi renkli karton, $[EF]$ doğru parçası boyunca katlandığında $D$ köşesi $D'$ noktasına gelmektedir.\n"
            f"- Katlama çizgisi $[EF]$ simetri ekseni (açıortay) görevi görmektedir.\n"
            f"- Katlama sonucunda oluşan $m(\\widehat{{DEF}}) = \\alpha = {alpha}^\\circ$ olarak ölçülmüştür.\n\n"
            f"Buna göre $[AD]$ kenarı üzerinde oluşan **$m(\\widehat{{AED'}})$ açısının ölçüsü kaç derecedir**?"
        )
        corr = f"${rem_angle}^\\circ$"
        dist = [
            f"${180 - alpha}^\\circ$",
            f"${90 - alpha}^\\circ$",
            f"${2 * alpha}^\\circ$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Matematik",
            "topic": "Üçgenler (Açı-Kenar Bağıntıları, Pisagor)", "subtopic": "Katlama Geometrisi ve Açıortay",
            "learning_outcome_code": "M.8.3.1.1", "cognitive_domain": "Üst Düzey Akıl Yürütme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": (
                f"Katlama işlemlerinde kat izi açıortaydır: $m(\\widehat{{DEF}}) = m(\\widehat{{FED'}}) = {alpha}^\\circ$. "
                f"$A, E, D$ noktaları doğrusal olduğundan $m(\\widehat{{AED'}}) = 180^\\circ - 2 \\times {alpha}^\\circ = {rem_angle}^\\circ$ bulunur."
            ),
            **opts
        }

    elif archetype == 5:
        # Yeni Nesil Cebirsel İfadeler ve Özdeşlikler: İki Kare Farkı Çerçeve Alanı
        k_val = random.choice([3, 4, 5, 6])
        # Dış kare kenarı (2x + k), içten çıkarılan kare kenarı (2x - k) veya (x)
        # (x + k)^2 - k^2 = x^2 + 2kx
        q_text = (
            f"Bir kenar uzunluğu $(2x + {k_val})\\text{{ cm}}$ olan kare biçimindeki bir ahşap levhanın tam ortasından, "
            f"bir kenar uzunluğu $(2x - {k_val})\\text{{ cm}}$ olan kare biçiminde bir bölge kesilerek çıkarılıyor.\n\n"
            f"Buna göre geriye kalan **çerçeve bölgesinin bir yüzünün alanını** $\\text{{cm}}^2$ cinsinden veren cebirsel ifade aşağıdakilerden hangisidir?"
        )
        # (2x+k)^2 - (2x-k)^2 = 4 * (2x) * k = 8kx
        coeff = 8 * k_val
        corr = f"${coeff}x$"
        dist = [
            f"$4x^2 + {2 * k_val**2}$",
            f"${4 * k_val}x$",
            f"$4x^2 - {k_val**2}$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Matematik",
            "topic": "Cebirsel İfadeler ve Özdeşlikler", "subtopic": "İki Kare Farkı Özdeşliği ve Alan Modelleme",
            "learning_outcome_code": "M.8.2.1.3", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                f"Kalan alan iki kare farkı özdeşliğiyle bulunur: $A = (2x+{k_val})^2 - (2x-{k_val})^2 = "
                f"[(2x+{k_val}) - (2x-{k_val})] \\cdot [(2x+{k_val}) + (2x-{k_val})] = (2 \\cdot {k_val}) \\cdot (4x) = {coeff}x\\text{{ cm}}^2$."
            ),
            **opts
        }

    elif archetype == 6:
        # Yeni Nesil Dönüşüm Geometrisi & Koordinat Sistemi (SVG'li)
        x0 = random.choice([-4, -3, -2])
        y0 = random.choice([2, 3, 4])
        dx = random.choice([5, 6, 7])
        dy = random.choice([4, 5, 6])
        x1 = x0 + dx
        y1 = y0 - dy
        svg = generate_dynamic_coordinate_transform_svg("Koordinat Düzleminde ABC Üçgeninin Ötelenmesi")

        q_text = (
            f"Dik koordinat sisteminde köşelerinden biri $A({x0}, {y0})$ olan $ABC$ üçgeni;\n"
            f"- Önce $x$ ekseni boyunca **${dx}$ birim sağa**,\n"
            f"- Ardından $y$ ekseni boyunca **${dy}$ birim aşağı** ötelenerek $A'B'C'$ üçgeni elde ediliyor.\n\n"
            f"Buna göre $A'$ köşesinin yeni koordinatlarının **apsisi ile ordinatının toplamı** kaçtır?"
        )
        ans = x1 + y1
        corr = f"${ans}$"
        dist = [
            f"${x0 + y0 + dx + dy}$",
            f"${x1 - y1}$",
            f"${ans + 4}$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Matematik",
            "topic": "Dönüşüm Geometrisi", "subtopic": "Koordinat Sisteminde Öteleme Hareketi",
            "learning_outcome_code": "M.8.3.2.1", "cognitive_domain": "Uygulama / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": (
                f"${dx}$ birim sağa ötelemede apsis artar: $x' = {x0} + {dx} = {x1}$. "
                f"${dy}$ birim aşağı ötelemede ordinat azalır: $y' = {y0} - {dy} = {y1}$. "
                f"$A'({x1}, {y1})$ için koordinatlar toplamı $= {x1} + ({y1}) = {ans}$ bulunur."
            ),
            **opts
        }

    else:
        # Yeni Nesil Olasılık ve Eşitsizlik: Kodlama / Şifre Kombinasyonu
        limit_num = random.choice([30, 40, 50])
        primes = [p for p in range(10, limit_num) if all(p % d != 0 for d in range(2, int(math.isqrt(p)) + 1))]
        total_two_digit = limit_num - 10
        g = math.gcd(len(primes), total_two_digit)
        num_s = len(primes) // g
        den_s = total_two_digit // g

        q_text = (
            f"Bir dijital kasanın güvenlik algoritması, **$10$'dan büyük veya eşit, ${limit_num}$'dan küçük** ($10 \\le x < {limit_num}$) iki basamaklı doğal sayılar arasından rastgele bir güvenlik kodu seçmektedir.\n\n"
            f"Algoritmanın seçtiği bu iki basamaklı sayının bir **asal sayı olma olasılığı** kaçtır?"
        )
        corr = f"$\\frac{{{num_s}}}{{{den_s}}}$"
        dist = [
            f"$\\frac{{{len(primes) + 1}}}{{{total_two_digit}}}$",
            f"$\\frac{{{len(primes) - 1}}}{{{total_two_digit}}}$",
            f"$\\frac{{{num_s}}}{{{den_s + 2}}}$"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Matematik",
            "topic": "Basit Olayların Olasılığı", "subtopic": "Eşitsizlik Aralığında Olasılık Hesabı",
            "learning_outcome_code": "M.8.5.1.5", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                f"$10 \\le x < {limit_num}$ aralığında toplam ${total_two_digit}$ adet sayı vardır. "
                f"Bu aralıktaki asal sayılar {primes} olup ${len(primes)}$ adettir. "
                f"Olasılık $= \\frac{{{len(primes)}}}{{{total_two_digit}}} = \\frac{{{num_s}}}{{{den_s}}}$ bulunur."
            ),
            **opts
        }


# ================= 3. LGS FEN BİLİMLERİ (YENİ NESİL DENEY VE DÜZENEK TEMELLİ) =================

def gen_lgs_fen(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    from app.services.ai_exam_service import (
        generate_dynamic_pulley_inclined_svg,
        generate_dynamic_pressure_manometer_svg
    )
    if index is None:
        index = random.randint(0, 999)
    top_low = str(topic or "").lower()

    if "basit makine" in top_low or "makara" in top_low or "kaldıraç" in top_low or "eğik" in top_low:
        archetype = 0
    elif "basınç" in top_low:
        archetype = 1
    elif "mevsim" in top_low or "iklim" in top_low:
        archetype = 2
    elif "dna" in top_low or "genetik" in top_low or "kalıtım" in top_low:
        archetype = 3
    elif "madde" in top_low or "periyodik" in top_low or "asit" in top_low:
        archetype = 4
    elif "enerji" in top_low or "fotosentez" in top_low or "besin" in top_low:
        archetype = 5
    elif "elektrik" in top_low:
        archetype = 6
    else:
        archetype = index % 7

    if archetype == 0:
        # Yeni Nesil Basit Makineler: Eğik Düzlem ve Sabit Makara Deneyi (SVG'li)
        g_load = random.choice([60, 80, 100, 120])
        f_pull = g_load // 2  # sin(30) = 0.5 => kuvvet kazancı 2
        svg = generate_dynamic_pulley_inclined_svg("LGS Fen Deneyi: Eğik Düzlem ve Sabit Makara Sistemi", f_pull, g_load, 30)

        q_text = (
            f"Sürtünmelerin ihmal edildiği yukarıdaki deney düzeneğinde, ağırlığı **$G = {g_load}\\text{{ N}}$** olan bir yük, eğim açısı $\\alpha = 30^\\circ$ olan eğik düzlem üzerinde tepeye yerleştirilmiş sabit makaradan geçen iple **$F = {f_pull}\\text{{ N}}$** büyüklüğündeki kuvvetle dengelenmiştir.\n\n"
            f"Öğrencinin kurduğu bu düzenekle ilgili;\n"
            f"I. Sistemde kuvvetten $2$ kat kazanç, yoldan $2$ kat kayıp vardır.\n"
            f"II. Tepedeki sabit makara sadece uygulanan kuvvetin yönünü değiştirmiştir, kuvvet kazancına etkisi yoktur.\n"
            f"III. Eğik düzlemin yüksekliği sabit tutulup boyu uzatılırsa, yükü dengeleyen $F$ kuvveti ${f_pull}\\text{{ N}}$'dan daha küçük olur.\n\n"
            f"yorumlarından hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["I ve II", "I ve III", "II ve III"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Fen Bilimleri",
            "topic": "Basit Makineler (Makaralar, Kaldıraç, Eğik Düzlem, Çıkrık)",
            "subtopic": "Eğik Düzlem ve Makara Sistemlerinde Kuvvet Kazancı",
            "learning_outcome_code": "F.8.5.1.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": (
                f"Kuvvet kazancı $= G / F = {g_load} / {f_pull} = 2$'dir (I doğru). Sabit makara kuvvet kazancı sağlamaz, yön değiştirir (II doğru). "
                f"Eğik düzlemin boyu ($L$) uzatılırsa kuvvet kazancı ($L/h$) artacağından gereken $F$ kuvveti azalır (III doğru)."
            ),
            **opts
        }

    elif archetype == 1:
        # Yeni Nesil Sıvı Basıncı: Bağımsız/Bağımlı Değişken ve U Borusu Deneyi (SVG'li)
        h_val = random.choice([12, 15, 20])
        svg = generate_dynamic_pressure_manometer_svg(h_val, "P₀ (Açık Hava)", "X Sıvısı (d₁)", "Y Sıvısı (d₂)")

        q_text = (
            f"Bir araştırmacı birbirine karışmayan $X$ ($d_1$) ve $Y$ ($d_2$) sıvılarını iki ucu açık bir U borusuna koyduğunda sıvılar yukarıdaki şekildeki gibi dengede kalmaktadır ($K$ ve $L$ noktaları aynı yatay seviyededir).\n\n"
            f"Şekildeki denge durumuna göre;\n"
            f"I. $K$ ve $L$ noktalarındaki toplam sıvı basınçları birbirine eşittir ($P_K = P_L$).\n"
            f"II. $Y$ sıvısının yoğunluğu, $X$ sıvısının yoğunluğundan daha büyüktür ($d_2 > d_1$).\n"
            f"III. Düzenek deniz seviyesinden daha yüksek bir dağın zirvesine çıkarılırsa kollar arasındaki seviye farkı değişmez.\n\n"
            f"çıkarımlarından hangileri **doğrudur**?"
        )
        corr = "I, II ve III"
        dist = ["Yalnız I", "I ve II", "II ve III"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Fen Bilimleri",
            "topic": "Basınç (Katı, Sıvı ve Gaz Basıncı)", "subtopic": "Sıvı Basıncı ve Yoğunluk İlişkisi",
            "learning_outcome_code": "F.8.3.1.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": svg,
            "explanation": (
                "Aynı sıvı içerisindeki aynı yatay seviyedeki $K$ ve $L$ noktalarında basınçlar eşittir ($P_K = P_L$). "
                "Her iki uç da açık olduğundan $P_0$ birbirini götürür; daha az yükseklikle dengeleyen veya tabanda kalan sıvı daha yoğundur."
            ),
            **opts
        }

    elif archetype == 2:
        # Yeni Nesil Mevsimler ve İklim: Gölge Boyu Tablosu Analizi
        q_text = (
            "Dünya üzerindeki **K, L ve M** şehirlerinde özdeş birer çubuğun öğle vakti ölçülen **gölge boylarının** yıl içindeki değişimi inceleniyor:\n"
            "- **K şehrinde:** 21 Haziran tarihinde öğle vakti gölge boyu yılın en kısa değerine ulaşmaktadır.\n"
            "- **L şehrinde:** 21 Aralık tarihinde öğle vakti gölge boyu sıfır ($0\\text{ cm}$) olmaktadır.\n"
            "- **M şehrinde:** 21 Mart ve 23 Eylül tarihlerinde öğle vakti gölge boyu sıfır ($0\\text{ cm}$) olmaktadır.\n\n"
            "Bu gözlem verilerine göre K, L ve M şehirlerinin Dünya üzerindeki konumları için aşağıdakilerden hangisi **kesinlikle doğrudur**?"
        )
        corr = "K şehri Kuzey Yarım Küre'de, L şehri Oğlak Dönencesi üzerinde, M şehri ise Ekvator üzerindedir."
        dist = [
            "K şehri Yengeç Dönencesi'nde, L şehri Kuzey Yarım Küre'de, M şehri Güney Yarım Küre'dedir.",
            "L şehri Ekvator üzerinde, K ve M şehirleri ise Güney Yarım Küre'de yer almaktadır.",
            "K ve L şehirleri Kuzey Yarım Küre'de, M şehri ise Oğlak Dönencesi üzerindedir."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Fen Bilimleri",
            "topic": "Mevsimler ve İklim", "subtopic": "Güneş Işınlarının Düşme Açısı ve Gölge Boyu Analizi",
            "learning_outcome_code": "F.8.1.1.1", "cognitive_domain": "Üst Düzey Akıl Yürütme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                "21 Haziran'da gölge en kısaysa K Kuzey Yarım Küre'dedir. 21 Aralık'ta gölge sıfırsa güneş dik gelmiştir (L = Oğlak Dönencesi). "
                "Ekinokslarda (21 Mart / 23 Eylül) gölge sıfırsa M = Ekvator üzerindedir."
            ),
            **opts
        }

    elif archetype == 3:
        # Yeni Nesil DNA ve Kalıtım: Bezelye Çaprazlama Deneyi
        q_text = (
            "Bezelyelerde **mor çiçek geni ($M$)**, **beyaz çiçek genine ($m$)** baskındır. Bir araştırmacı genotiplerini bilmediği iki mor çiçekli bezelyeyi çaprazladığında (1. Kuşak), oluşan $400$ yeni bezelyeden yaklaşık $100$ tanesinin **beyaz çiçekli**, $300$ tanesinin ise **mor çiçekli** olduğunu gözlemliyor.\n\n"
            "Bu deney sonuçlarına göre;\n"
            "I. Çaprazlanan ata bezelyelerin her ikisi de heterozigot ($Mm$) genotipe sahiptir.\n"
            "II. Oluşan mor çiçekli bezelyelerin arasında hem homozigot ($MM$) hem de heterozigot ($Mm$) bireyler bulunur.\n"
            "III. Oluşan beyaz çiçekli bezelyeler kendi aralarında çaprazlanırsa mor çiçekli bezelye oluşma ihtimali %$25$'tir.\n\n"
            "ifadelerinden hangileri **doğrudur**?"
        )
        corr = "I ve II"
        dist = ["Yalnız I", "I ve III", "I, II ve III"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Fen Bilimleri",
            "topic": "DNA ve Genetik Kod", "subtopic": "Tek Karakter Çaprazlamaları ve Kalıtım",
            "learning_outcome_code": "F.8.2.2.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                "Mor çiçekli iki atadan $3:1$ (%$75$ mor, %$25$ beyaz) oranı çıkması için atalar $Mm \\times Mm$ olmalıdır (I doğru). "
                "Yavrularda $1/4\\ MM$, $2/4\\ Mm$ (mor) ve $1/4\\ mm$ (beyaz) oluşur (II doğru). "
                "Beyaz bezelyeler ($mm \\times mm$) çaprazlandığında %$100$ beyaz oluşur, mor oluşamaz (III yanlış)."
            ),
            **opts
        }

    elif archetype == 4:
        # Yeni Nesil Madde ve Endüstri: Periyodik Sistem ve Kimyasal Değişim
        q_text = (
            "Periyodik tablonun ilk üç periyodunda yer alan **X, Y ve Z** elementleri hakkında şu deneysel bulgular elde edilmiştir:\n"
            "- **X elementi:** Katman-elektron diziliminde son katmanında $2$ elektron bulunmasına rağmen **soygaz** (8A grubu) özelliği göstermektedir.\n"
            "- **Y elementi:** X ile aynı periyotta olup elektriği ve ısıyı iyi ileten parlak bir **alkali metaldir** (1A grubu).\n"
            "- **Z elementi:** Y ile aynı grupta yer almakta olup atom numarası Y'den daha büyüktür.\n\n"
            "Buna göre X, Y ve Z elementleri ile ilgili aşağıdakilerden hangisi **yanlıştır**?"
        )
        corr = "X ve Y elementleri aynı periyotta yer alır (X 1. periyotta, Y ise en az 2. periyottadır)."
        dist = [
            "X elementi Helyum ($He$, atom numarası $2$) olup oda sıcaklığında tek atomlu gaz halindedir.",
            "Z elementinin periyot numarası (katman sayısı), Y elementinin periyot numarasından büyüktür.",
            "Y ve Z elementlerinin son katmanlarındaki (değerlik) elektron sayıları birbirine eşittir ($1$'dir)."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Fen Bilimleri",
            "topic": "Madde ve Endüstri (Periyodik Sistem, Fiziksel ve Kimyasal Değişimler, Asit-Bazlar)",
            "subtopic": "Periyodik Sistemde Grup ve Periyot Özellikleri",
            "learning_outcome_code": "F.8.4.1.2", "cognitive_domain": "Üst Düzey Akıl Yürütme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                "Son katmanında 2 elektron olup 8A soygazı olan element Helyum'dur ($He$, 1. periyot). "
                "1. periyotta 1A grubunda bulunan Hidrojen ($H$) alkali metal değil ametaldir! Dolayısıyla X ile aynı periyotta bir alkali metal bulunamaz."
            ),
            **opts
        }

    elif archetype == 5:
        # Yeni Nesil Enerji Dönüşümleri: Kapalı Ekosistem Fotosentez-Solunum Deneyi
        q_text = (
            "Hava sızdırmaz şeffaf bir cam fanus içerisine **yeşil bir saksı bitkisi**, **canlı bir kelebek** ve **$CO_2$ tutucu potasyum hidroksit ($KOH$) çözeltisi** konularak aydınlık bir ortama bırakılıyor.\n\n"
            "Belirli bir süre sonra fanustaki bitkinin fotosentez hızının giderek düştüğü ve kelebeğin yaşamının tehlikeye girdiği gözlemleniyor. Bu durumun **temel bilimsel nedeni** aşağıdakilerden hangisidir?"
        )
        corr = "$KOH$ çözeltisinin ortamdaki karbondioksit ($CO_2$) gazını tutması nedeniyle bitkinin fotosentez yapamayıp oksijen üretememesi"
        dist = [
            "Aydınlık ortamda bitkinin hücresel solunumu tamamen durdurarak sadece oksijen tüketmesi",
            "Kelebeğin solunum sırasında ortama fotosentezi engelleyen azot gazı salgılaması",
            "Şeffaf cam fanusun ışık enerjisinin kloroplastlara ulaşmasını tamamen engellemesi"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Fen Bilimleri",
            "topic": "Enerji Dönüşümleri ve Çevre Bilimi (Besin Zinciri, Fotosentez, Solunum)",
            "subtopic": "Fotosentez ve Solunum Deney Düzenekleri",
            "learning_outcome_code": "F.8.6.2.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                "$KOH$ (veya kireç suyu) karbondioksit tutucudur. Fanustaki $CO_2$ tutulunca bitki fotosentez için gerekli ham maddeyi bulamaz ve $O_2$ üretimi durur."
            ),
            **opts
        }

    else:
        # Yeni Nesil Elektrik Yükleri ve Elektroskop Deneyi
        q_text = (
            "Yaprakları belirli bir açıyla açık olan **negatif ($-$) yüklü** bir elektroskobun topuzuna, yük cinsi bilinmeyen iletken bir **$K$ küresi** dokunduruluyor.\n\n"
            "Dokunma sonucunda elektroskobun yapraklarının **tamamen kapandığı ve tekrar açılmadığı** gözlemlendiğine göre, $K$ küresinin başlangıçtaki yük durumu için aşağıdakilerden hangisi doğrudur?"
        )
        corr = "Elektroskobun yük miktarına eşit büyüklükte pozitif ($+$) yüklüdür."
        dist = [
            "Yüksüz (nötr) bir iletken küredir.",
            "Elektroskobun yük miktarından daha fazla negatif ($-$) yüklüdür.",
            "Elektroskobun yük miktarından çok daha fazla pozitif ($+$) yüklüdür."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Fen Bilimleri",
            "topic": "Elektrik Yükleri ve Elektrik Enerjisi", "subtopic": "Elektroskop ve Dokunma ile Elektriklenme",
            "learning_outcome_code": "F.8.7.1.3", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text, "visual_svg": None,
            "explanation": (
                "Yaprakların tamamen kapanıp tekrar açılmaması sistemin toplam yükünün sıfırlandığını (nötrlendiğini) gösterir. "
                "Bunun için $K$ küresi elektroskopla eşit miktarda ve zıt ($+$) yüklü olmalıdır."
            ),
            **opts
        }


# ================= 4. LGS T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK (YENİ NESİL) =================

def gen_lgs_inkilap(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    archetype = index % 5

    if archetype == 0:
        q_text = (
            "Mustafa Kemal Paşa, **Amasya Genelgesi**'nde:\n"
            "- *'Vatanın bütünlüğü, milletin bağımsızlığı tehlikededir.'*\n"
            "- *'İstanbul Hükûmeti üzerine aldığı sorumluluğun gereğini yerine getirememektedir.'*\n"
            "- *'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.'*\n"
            "maddelerini tüm yurda ilan etmiştir.\n\n"
            "Bu maddeler tarihsel açıdan analiz edildiğinde;\n"
            "I. İlk iki maddede Kurtuluş Savaşı'nın **gerekçesi** ortaya konulmuştur.\n"
            "II. Üçüncü maddede mücadelenin **amacı ve yöntemi** belirlenmiştir.\n"
            "III. 'Milletin kararı' vurgusuyla ileride **millî egemenliğe** dayalı yeni bir yönetim kurulacağının işareti verilmiştir.\n\n"
            "çıkarımlarından hangilerine ulaşılabilir?"
        )
        corr = "I, II ve III"
        dist = ["I ve II", "I ve III", "II ve III"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar", "subtopic": "Amasya Genelgesi Analizi",
            "learning_outcome_code": "İTA.8.2.3", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Amasya Genelgesi hem Millî Mücadele'nin gerekçe, amaç ve yöntemini açıklamış hem de 'milletin kararı' ile ulusal egemenlik mesajı vermiştir.",
            **opts
        }

    elif archetype == 1:
        q_text = (
            "Kütahya-Eskişehir Muharebeleri'nin devam ettiği en zorlu günlerde Mustafa Kemal Paşa, Ankara'da **Maarif (Eğitim) Kongresi**'ni toplamış ve kongrenin açılışında şu konuşmayı yapmıştır:\n"
            "*\"Silahıyla olduğu gibi dimağıyla (aklıyla) da mücadele etmek zorunda olan milletimizin birincisinde gösterdiği kudreti ikincisinde de göstereceğine asla şüphem yoktur. Çocuklarımızı ve gençlerimizi, fikrî hür, vicdanı hür nesiller olarak yetiştirecek millî bir eğitim programı hazırlamalıyız.\"*\n\n"
            "Mustafa Kemal Paşa'nın savaş şartlarına rağmen bu kongreyi toplaması aşağıdakilerden hangisinin en güçlü kanıtıdır?"
        )
        corr = "Askerî zaferlerin ancak eğitim, kültür ve çağdaş bilimle taçlandırıldığında kalıcı bağımsızlığa dönüşeceğine inanmasının"
        dist = [
            "Batı Cephesi'ndeki askerî harekâtların tamamen sona erdiğini düşünmesinin",
            "Eğitim politikalarını yabancı devletlerin danışmanlarına devretmek istemesinin",
            "Geleneksel medrese eğitimini hiçbir değişiklik yapmadan sürdürmeyi amaçlamasının"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Millî Bir Destan: Ya İstiklal Ya Ölüm! (Cepheler ve Lozan)", "subtopic": "Maarif Kongresi ve Eğitim Vizyonu",
            "learning_outcome_code": "İTA.8.3.3", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Savaşın en kritik anında Maarif Kongresi'nin toplanması, Atatürk'ün cehalete karşı savaşı düşmana karşı savaş kadar hayati gördüğünü kanıtlar.",
            **opts
        }

    elif archetype == 2:
        q_text = (
            "Cumhuriyet'in ilk yıllarında gerçekleştirilen;\n"
            "- **Tevhid-i Tedrisat Kanunu** ile tüm okulların Millî Eğitim Bakanlığı'na bağlanması ve eğitimde fırsat eşitliğinin sağlanması,\n"
            "- **Soyadı Kanunu** ile 'ağa, hacı, hafız, paşa, bey' gibi toplumsal ayrıcalık belirten unvanların kaldırılması,\n"
            "- **Türk Medeni Kanunu** ile kadın ve erkeğin miras, şahitlik ve aile hukukunda eşit haklara kavuşturulması\n\n"
            "inkılaplarının üçünün de ortak paydada hizmet ettiği **Atatürk ilkesi** aşağıdakilerden hangisidir?"
        )
        corr = "Halkçılık"
        dist = ["Devletçilik", "İnkılapçılık", "Milliyetçilik"]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Atatürkçülük ve Çağdaşlaşan Türkiye (İnkılaplar)", "subtopic": "Atatürk İlkeleri ve İnkılap Eşleştirmesi",
            "learning_outcome_code": "İTA.8.4.5", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Kanun önünde eşitlik, ayrıcalıkların kaldırılması ve sosyal adalet doğrudan Halkçılık ilkesinin temel göstergeleridir.",
            **opts
        }

    elif archetype == 3:
        q_text = (
            "24 Temmuz 1923'te imzalanan **Lozan Barış Antlaşması**'nın aşağıdaki kararlarından hangisi, yeni Türk devletinin **ekonomik bağımsızlığını** engelleyen asırlık kısıtlamaları ortadan kaldırmaya yöneliktir?"
        )
        corr = "Yabancı devletlere tanınan adli, mali ve iktisadi kapitülasyonların kayıtsız şartsız kaldırılması ve Düyûn-ı Umûmiye idaresinin sonlandırılması"
        dist = [
            "Boğazların yönetiminin başkanı Türk olan uluslararası bir komisyona bırakılması",
            "Türkiye-Yunanistan sınırının Meriç Nehri olarak kabul edilmesi",
            "İstanbul'daki Rumlar ile Batı Trakya'daki Türkler dışındaki nüfusun mübadeleye tabi tutulması"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Millî Bir Destan: Ya İstiklal Ya Ölüm! (Cepheler ve Lozan)", "subtopic": "Lozan Barış Antlaşması ve Tam Bağımsızlık",
            "learning_outcome_code": "İTA.8.3.7", "cognitive_domain": "Kavrama / Analiz",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Kapitülasyonların ve Düyûn-ı Umûmiye'nin (Genel Borçlar İdaresi) kaldırılması doğrudan ekonomik ve mali bağımsızlığı sağlamıştır.",
            **opts
        }

    else:
        q_text = (
            "1930'lu yıllarda Avrupa'da İtalya ve Almanya'nın yayılmacı politikaları nedeniyle yeni bir dünya savaşı tehlikesi belirdiğinde Türkiye;\n"
            "- 1932'de **Milletler Cemiyeti**'ne üye olmuş,\n"
            "- 1934'te batı sınırını güvenceye almak için **Balkan Antantı**'nı imzalamış,\n"
            "- 1936'da **Montrö Boğazlar Sözleşmesi** ile Boğazlarda tam egemenlik sağlamış,\n"
            "- 1937'de doğu sınırını korumak için **Sadabat Paktı**'na öncülük etmiştir.\n\n"
            "Bu diplomatik adımlar Atatürk dönemi Türk dış politikasının hangi temel ilkesiyle hareket ettiğini gösterir?"
        )
        corr = "'Yurtta sulh, cihanda sulh' ilkesi doğrultusunda uluslararası hukuka ve bölgesel barış ittifaklarına dayalı güvenlik siyaseti"
        dist = [
            "Komşu devletlerin topraklarını askeri güçle ilhak etmeye dayalı yayılmacı siyaset",
            "Uluslararası örgütlerden ve ittifaklardan tamamen uzak duran yalnızlık (izolasyon) politikası",
            "Sadece büyük devletlerin himayesine girerek sınırları koruma anlayışı"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "T.C. İnkılap Tarihi ve Atatürkçülük",
            "topic": "Atatürk Dönemi Türk Dış Politikası", "subtopic": "Barışçı Dış Politika ve Bölgesel İttifaklar",
            "learning_outcome_code": "İTA.8.6.1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Türkiye, haklarını uluslararası hukuk (Montrö) ve bölgesel barış paktları (Balkan Antantı, Sadabat Paktı) ile koruyarak 'Yurtta sulh, cihanda sulh' ilkesini uygulamıştır.",
            **opts
        }


# ================= 5. LGS DİN KÜLTÜRÜ VE AHLAK BİLGİSİ (YENİ NESİL) =================

def gen_lgs_din(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    archetype = index % 4

    if archetype == 0:
        q_text = (
            "Allah'ın evrende koyduğu değişmez ölçü ve yasalara **Sünnetullah** adı verilir ve üç grupta incelenir:\n"
            "- **I. Durum:** Deniz seviyesinden yükseklere çıkıldıkça atmosfer basıncının ve suyun kaynama noktasının düşmesi.\n"
            "- **II. Durum:** Kurak bölgelerde yaşayan kaktüslerin su kaybını önlemek için diken yapraklı bir yapıya sahip olması.\n"
            "- **III. Durum:** Adaletin, güvenin ve fırsat eşitliğinin korunduğu toplumlarda barış ve refahın yükselmesi.\n\n"
            "Bu üç durumun karşılık geldiği evrensel yasalar aşağıdakilerin hangisinde sırasıyla doğru eşleştirilmiştir?"
        )
        corr = "I: Fiziksel Yasalar — II: Biyolojik Yasalar — III: Toplumsal Yasalar"
        dist = [
            "I: Biyolojik Yasalar — II: Fiziksel Yasalar — III: Toplumsal Yasalar",
            "I: Fiziksel Yasalar — II: Toplumsal Yasalar — III: Biyolojik Yasalar",
            "I: Toplumsal Yasalar — II: Biyolojik Yasalar — III: Fiziksel Yasalar"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Kader İnancı (Kaza, Kader, Tevekkül, Evrenin Yasaları)", "subtopic": "Evrenin Yasaları (Sünnetullah)",
            "learning_outcome_code": "D.8.1.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Madde ve enerji olayları Fiziksel (I), canlıların yapı ve uyumları Biyolojik (II), insan ilişkileri ve adalet ise Toplumsal (III) yasalardır.",
            **opts
        }

    elif archetype == 1:
        q_text = (
            "*\"Sevdiğiniz şeylerden Allah yolunda harcamadıkça gerçek iyiliğe (birr'e) asla erişemezsiniz. Her ne harcarsanız Allah onu hakkıyla bilir.\"* (Âl-i İmrân Suresi, 92. ayet)\n\n"
            "Hz. Peygamber'in de hadislerinde vurguladığı üzere, bir Müslümanın zekât ve sadaka verirken dikkat etmesi gereken **temel ahlaki duyarlılık** bu ayete göre aşağıdakilerden hangisidir?"
        )
        corr = "İhtiyaç sahiplerine, kendisinin de severek kullanacağı kaliteli ve temiz mallardan gönül hoşluğuyla vermesi, başa kakmaması"
        dist = [
            "Yardımları yalnızca herkesin görebileceği kalabalık ortamlarda duyurarak yapması",
            "Kullanım ömrü geçmiş veya bozulmaya yüz tutmuş eşyaları elden çıkarması",
            "Zekât ve sadakayı yalnızca ticari ortaklık kurduğu kişilere vermesi"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Zekat ve Sadaka İbadeti", "subtopic": "İnfak Ahlakı ve Yardımlaşma",
            "learning_outcome_code": "D.8.2.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Ayette insanın kendi sevdiği, nitelikli mallardan paylaşması (infak ahlakı) emredilmektedir.",
            **opts
        }

    elif archetype == 2:
        q_text = (
            "İslam dini, bireyin ve toplumun huzurunu korumak amacıyla **Zarûrât-ı Hamse** (beş temel esas) adı verilen dokunulmaz hakları güvence altına almıştır:\n"
            "- İş sağlığı ve güvenliği tedbirlerinin alınarak iş kazalarının önlenmesi,\n"
            "- Dijital dolandırıcılık, rüşvet, karaborsacılık ve haksız kazancın yasaklanması,\n"
            "- Gençlerin bağımlılık yapıcı uyuşturucu madde ve alkolden uzak tutulması.\n\n"
            "Verilen bu üç uygulama sırasıyla hangi temel hakların korunmasıyla doğrudan ilişkilidir?"
        )
        corr = "Canın Korunması — Malın Korunması — Aklın Korunması"
        dist = [
            "Malın Korunması — Canın Korunması — Neslin Korunması",
            "Aklın Korunması — Dinin Korunması — Malın Korunması",
            "Canın Korunması — Aklın Korunması — Dinin Korunması"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Din ve Hayat (Temel Hakların Korunması)", "subtopic": "Beş Temel Esas (Zarûrât-ı Hamse)",
            "learning_outcome_code": "D.8.3.1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "İş güvenliği canı, haksız kazancın önlenmesi malı, bağımlılıktan korunma ise aklı korumaya yöneliktir.",
            **opts
        }

    else:
        q_text = (
            "Hz. Muhammed (s.a.v.) gençlik yıllarında Mekke'de haksızlığa uğrayan yerli ve yabancı tüccarların hakkını savunmak için kurulan **Hılfu'l-Fudûl (Erdemliler Topluluğu)** cemiyetine aktif olarak katılmış, peygamberliğinden sonra da *'İslam'da öyle bir anlaşmaya çağrılsam yine tereddütsüz icabet ederim.'* buyurmuştur.\n\n"
            "Bu tarihsel olay Hz. Peygamber'in aşağıdaki kişilik özelliklerinden hangisini ön plana çıkarmaktadır?"
        )
        corr = "Haksızlık kimden gelirse gelsin mazlumun yanında durması ve adaleti her şeyin üstünde tutması"
        dist = [
            "Ticari anlaşmalarda yalnızca kendi kabilesinin çıkarlarını gözetmesi",
            "Toplumsal sorunların çözümünü sadece kabile reislerine bırakması",
            "Siyasi ittifakları adalet ilkelerinin önünde tutması"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "Din Kültürü ve Ahlak Bilgisi",
            "topic": "Hz. Muhammed'in Doğruluğu ve Güvenilirliği", "subtopic": "Hz. Muhammed'in Hakkı ve Adaleti Gözetmesi",
            "learning_outcome_code": "D.8.4.2", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Hılfu'l-Fudûl'a katılımı Hz. Peygamber'in adaleti, güvenilirliği ve mazlumun hakkını korumayı yaşam ilkesi edindiğini gösterir.",
            **opts
        }


# ================= 6. LGS İNGİLİZCE (YENİ NESİL TABLO & DİYALOG) =================

def gen_lgs_ingilizce(index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    if index is None:
        index = random.randint(0, 999)
    archetype = index % 4

    if archetype == 0:
        q_text = (
            "**Read the survey results of 100 teenagers about their internet habits and answer the question:**\n"
            "- **45% of teens:** Doing research for school assignments and learning foreign languages.\n"
            "- **30% of teens:** Playing online multiplayer games and watching videos.\n"
            "- **15% of teens:** Using social networking sites to chat with friends.\n"
            "- **10% of teens:** Doing online shopping.\n\n"
            "Which of the following is **CORRECT** according to the survey results above?"
        )
        corr = "Nearly half of the teenagers use the Internet for educational purposes."
        dist = [
            "Online shopping is the most popular activity among teenagers.",
            "More than half of the teenagers use the Internet only to chat on social media.",
            "Teenagers never use the Internet for their school projects."
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "İngilizce",
            "topic": "The Internet (Online Habits & Rules)", "subtopic": "Interpreting Charts and Survey Results",
            "learning_outcome_code": "E.8.5.R1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "%45 (nearly half) okul araştırması ve yabancı dil öğrenimi (educational purposes) için interneti kullanmaktadır.",
            **opts
        }

    elif archetype == 1:
        q_text = (
            "**Kevin invited four of his classmates to a science exhibition on Saturday afternoon. Here are their replies:**\n"
            "- **Sarah:** *'That sounds awesome! Count me in. I love robotics.'*\n"
            "- **Tom:** *'I'd love to join you, but my cousin is coming from abroad on Saturday.'*\n"
            "- **Lily:** *'I have nothing better to do. What time shall we meet?'*\n"
            "- **Jack:** *'I'm sorry, I can't make it. I have basketball training at 2 p.m.'*\n\n"
            "According to the responses above, **how many friends ACCEPTED** Kevin's invitation?"
        )
        corr = "2 (Sarah and Lily)"
        dist = [
            "1 (Only Sarah)",
            "3 (Sarah, Tom and Lily)",
            "4 (All of them)"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "İngilizce",
            "topic": "Friendship (Accepting & Refusing)", "subtopic": "Accepting and Refusing Invitations with Excuses",
            "learning_outcome_code": "E.8.1.R1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Sarah ('Count me in') ve Lily ('What time shall we meet?') daveti kabul etmiştir (2 kişi). Tom ve Jack mazeret bildirerek reddetmiştir.",
            **opts
        }

    elif archetype == 2:
        q_text = (
            "**Read the recipe of Homemade Lentil Soup:**\n"
            "1. First, chop an onion and a carrot into small pieces.\n"
            "2. Second, heat two tablespoons of olive oil in a pot and fry the vegetables for 3 minutes.\n"
            "3. Next, rinse a cup of red lentils and add them into the pot with five glasses of hot water.\n"
            "4. Then, boil the mixture on low heat for 25 minutes and blend it until it becomes smooth.\n"
            "5. Finally, sprinkle some dried mint and serve it warm with lemon.\n\n"
            "According to the recipe, which kitchen tool do you need **RIGHT AFTER** boiling the mixture for 25 minutes?"
        )
        corr = "A blender (to make the soup smooth)"
        dist = [
            "A rolling pin (to roll the dough)",
            "A grater (to grate the cheese)",
            "A baking tray (to roast the meat)"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "İngilizce",
            "topic": "In The Kitchen (Cooking Process & Recipes)", "subtopic": "Sequencing Cooking Steps and Tools",
            "learning_outcome_code": "E.8.3.R1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "4. adımda 25 dakika kaynattıktan hemen sonra 'blend it until it becomes smooth' denildiği için blender gerekir.",
            **opts
        }

    else:
        q_text = (
            "**Dr. Aziz Sancar** was born in Mardin, Türkiye in 1946. He graduated from Istanbul University Faculty of Medicine and completed his PhD in Molecular Biology at the University of Texas. "
            "He worked for years on **how cells repair damaged DNA** and mapped the nucleotide excision repair mechanism. "
            "Thanks to his groundbreaking research in biochemistry, he was awarded the **Nobel Prize in Chemistry in 2015**.\n\n"
            "Which question does **NOT** have an answer in the text above?"
        )
        corr = "How many scientific books did Aziz Sancar publish during his career?"
        dist = [
            "What scientific discovery brought Aziz Sancar the Nobel Prize?",
            "Where and when was Dr. Aziz Sancar born?",
            "Which university did he graduate from in Türkiye?"
        ]
        opts = format_lgs_options(corr, dist)
        return {
            "exam_type": "LGS", "grade_level": "8. Sınıf", "subject": "İngilizce",
            "topic": "Science (Scientific Discoveries & Inventions)", "subtopic": "Biographies of Scientists and Achievements",
            "learning_outcome_code": "E.8.9.R1", "cognitive_domain": "Analiz / Muhakeme",
            "difficulty": "ÖSYM / Yeni Nesil", "question_text": q_text,
            "explanation": "Metinde doğum yeri/yılı, mezun olduğu üniversite ve Nobel ödülü aldığı DNA onarım keşfi vardır; ancak kaç kitap yazdığı belirtilmemiştir.",
            **opts
        }


# ================= ANA LGS SÖZLÜĞÜ VE ÜRETİCİ =================

LGS_DISPATCHER = {
    "Türkçe": gen_lgs_turkce,
    "Matematik": gen_lgs_matematik,
    "Fen Bilimleri": gen_lgs_fen,
    "T.C. İnkılap Tarihi ve Atatürkçülük": gen_lgs_inkilap,
    "İnkılap Tarihi": gen_lgs_inkilap,
    "Din Kültürü ve Ahlak Bilgisi": gen_lgs_din,
    "Din Kültürü": gen_lgs_din,
    "İngilizce": gen_lgs_ingilizce,
}


def generate_lgs_question(subject: str, index: int = None, topic: str = "Karma") -> Dict[str, Any]:
    s_norm = str(subject or "").lower()
    if "matematik" in s_norm:
        return gen_lgs_matematik(index, topic)
    elif "fen" in s_norm:
        return gen_lgs_fen(index, topic)
    elif "inkılap" in s_norm or "inkilap" in s_norm or "tarih" in s_norm:
        return gen_lgs_inkilap(index, topic)
    elif "din" in s_norm:
        return gen_lgs_din(index, topic)
    elif "ingilizce" in s_norm:
        return gen_lgs_ingilizce(index, topic)
    return gen_lgs_turkce(index, topic)
