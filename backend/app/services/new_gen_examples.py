# -*- coding: utf-8 -*-
"""
Yeni nesil soru üretimi için yerleşik örnek sorular (few-shot).

Bu sorular bu proje için özgün olarak yazılmıştır; ÖSYM veya MEB sorularının
kopyası değildir. Modele "yeni nesil soru neye benzer" sorusunun cevabını
somut olarak göstermek için kullanılır. Her örnek, modelin üretmesi istenen
JSON biçimindedir.

Alanlar:
- seviye: "LGS" veya "YKS"
- alan:   "sayisal" veya "sozel"
"""

from typing import Any, Dict, List

NEW_GEN_EXAMPLES: List[Dict[str, Any]] = [
    {
        "seviye": "LGS",
        "alan": "sayisal",
        "ornek": {
            "baglam": (
                "Bir ortaokulun kütüphanesinde, öğrencilerin bir hafta boyunca ödünç aldığı kitaplar "
                "türlerine ve günlere göre aşağıdaki tabloda gösterilmiştir. Kütüphane görevlisi, "
                "ödünç alınan kitaplar arasından rastgele birini seçerek okuma panosunda tanıtacaktır."
            ),
            "veri_tablosu": (
                "| Kitap türü | Pazartesi - Çarşamba | Perşembe - Cuma |\n"
                "|---|---|---|\n"
                "| Roman | 18 | 12 |\n"
                "| Bilim | 9 | 15 |\n"
                "| Şiir | 6 | 4 |\n"
                "| Tarih | 7 | 9 |"
            ),
            "onculler": None,
            "soru_koku": "Buna göre seçilen kitabın **Perşembe - Cuma günlerinde ödünç alınmış bir bilim kitabı** olma olasılığı kaçtır?",
            "secenekler": {"A": "$\\frac{3}{10}$", "B": "$\\frac{3}{16}$", "C": "$\\frac{3}{8}$", "D": "$\\frac{5}{8}$"},
            "dogru_cevap": "B",
            "cozum": (
                "Bir haftada ödünç alınan toplam kitap: Pazartesi - Çarşamba $18+9+6+7=40$, "
                "Perşembe - Cuma $12+15+4+9=40$, toplam $80$. İstenen durum sayısı Perşembe - Cuma "
                "günlerinde alınan bilim kitabı sayısıdır: $15$. Olasılık $\\frac{15}{80}=\\frac{3}{16}$ olur."
            ),
            "celdirici_analizi": {
                "A": "Gün koşulunu atlayıp tüm bilim kitaplarını (24) toplama oranlamak: 24/80.",
                "B": "Doğru cevap.",
                "C": "Örneklem uzayını yalnızca Perşembe - Cuma günleri (40) almak: 15/40.",
                "D": "Örneklem uzayını yalnızca bilim kitapları (24) almak: 15/24.",
            },
            "kazanim": "8. Sınıf Matematik - Basit Olayların Olasılığı",
            "bilissel_duzey": "Analiz / Muhakeme",
            "alt_konu": "Tablodan Olasılık Hesaplama",
            "adim_sayisi": 3,
            "visual_svg": None,
        },
    },
    {
        "seviye": "LGS",
        "alan": "sayisal",
        "ornek": {
            "baglam": (
                "Elif, her birinin ağırlığı 60 N olan özdeş tuğlaları yumuşak kum üzerine farklı "
                "biçimlerde yerleştirerek kumun ne kadar battığını ölçüyor. Yaptığı üç deneyin "
                "sonuçları tabloda verilmiştir."
            ),
            "veri_tablosu": (
                "| Deney | Kuma değen yüzey alanı ($cm^2$) | Üst üste konan tuğla sayısı | Batma miktarı (mm) |\n"
                "|---|---|---|---|\n"
                "| 1 | 200 | 1 | 6 |\n"
                "| 2 | 100 | 1 | 12 |\n"
                "| 3 | 200 | 2 | 12 |"
            ),
            "onculler": [
                "Yüzey alanı sabitken ağırlık arttıkça katının kuma uyguladığı basınç artar.",
                "Ağırlık sabitken yüzey alanı azaldıkça katının kuma uyguladığı basınç artar.",
                "3. deneyde kuma uygulanan basınç, 2. deneydekinin iki katıdır.",
            ],
            "soru_koku": "Elif'in deney sonuçlarına göre yukarıdaki yargılardan **hangileri doğrudur**?",
            "secenekler": {"A": "Yalnız I", "B": "Yalnız II", "C": "I ve II", "D": "I, II ve III"},
            "dogru_cevap": "C",
            "cozum": (
                "1. ve 3. deneylerde yüzey alanı aynıdır, ağırlık 60 N'den 120 N'ye çıkınca batma 6 mm'den 12 mm'ye çıkmıştır; I doğrudur. "
                "1. ve 2. deneylerde ağırlık aynıdır, yüzey alanı yarıya inince batma iki katına çıkmıştır; II doğrudur. "
                "Basınçlar: 2. deney $\\frac{60}{100}=0,6$, 3. deney $\\frac{120}{200}=0,6$ N/$cm^2$; eşittir, III yanlıştır."
            ),
            "celdirici_analizi": {
                "A": "Yalnızca ağırlık değişkenini fark edip yüzey alanı etkisini görmemek.",
                "B": "Yalnızca yüzey alanı değişkenini fark edip ağırlık etkisini görmemek.",
                "C": "Doğru cevap.",
                "D": "Tuğla sayısı iki katına çıktığı için basıncın da 2. deneye göre iki katı olduğunu sanmak.",
            },
            "kazanim": "8. Sınıf Fen - Katı Basıncı",
            "bilissel_duzey": "Analiz / Muhakeme",
            "alt_konu": "Katı Basıncı Deney Yorumlama",
            "adim_sayisi": 3,
            "visual_svg": None,
        },
    },
    {
        "seviye": "LGS",
        "alan": "sozel",
        "ornek": {
            "baglam": (
                "Bir yayınevi, okurlarına son bir yılda kitap seçerken en çok hangi etkene dikkat "
                "ettiklerini sormuştur. Her katılımcı yalnızca bir etken seçmiştir. Gençler ve "
                "yetişkinlerden alınan cevapların yüzdelik dağılımı aşağıdaki tabloda verilmiştir."
            ),
            "veri_tablosu": (
                "| Etken | Gençler (%) | Yetişkinler (%) |\n"
                "|---|---|---|\n"
                "| Arkadaş önerisi | 42 | 18 |\n"
                "| Yazarın tanınırlığı | 21 | 37 |\n"
                "| Kapak tasarımı | 25 | 9 |\n"
                "| Eleştirmen yorumu | 12 | 36 |"
            ),
            "onculler": None,
            "soru_koku": "Tablodaki bilgilere göre aşağıdakilerden hangisi **kesinlikle söylenebilir**?",
            "secenekler": {
                "A": "Yetişkinler kitap seçerken en çok eleştirmen yorumuna dikkat etmektedir.",
                "B": "Gençlerin çoğunluğu kitap seçerken arkadaş önerisini dikkate almaktadır.",
                "C": "Yazarın tanınırlığını seçen yetişkinlerin oranı, bu etkeni seçen gençlerin oranının iki katından azdır.",
                "D": "Gençler eleştirmen yorumlarını okumadıkları için bu etkeni az seçmiştir.",
            },
            "dogru_cevap": "C",
            "cozum": (
                "Yazarın tanınırlığını seçen gençler %21, iki katı %42'dir; yetişkinlerde bu oran %37 olduğundan "
                "iki katından azdır. A yanlıştır çünkü yetişkinlerde en yüksek oran %37 ile yazarın tanınırlığıdır. "
                "B yanlıştır çünkü %42 çoğunluk (yarıdan fazla) değildir. D'deki neden tablodan çıkarılamaz."
            ),
            "celdirici_analizi": {
                "A": "Birbirine yakın iki değeri (37 ve 36) dikkatsiz karşılaştırmak.",
                "B": "En büyük payı 'çoğunluk' ile karıştırmak.",
                "C": "Doğru cevap.",
                "D": "Tabloda olmayan bir neden-sonuç ilişkisi kurmak.",
            },
            "kazanim": "8. Sınıf Türkçe - Grafik ve Tablo Yorumlama",
            "bilissel_duzey": "Analiz / Muhakeme",
            "alt_konu": "Tablo ve Grafik Okuma",
            "adim_sayisi": 2,
            "visual_svg": None,
        },
    },
    {
        "seviye": "YKS",
        "alan": "sayisal",
        "ornek": {
            "baglam": (
                "Bir el yapımı sabun atölyesi siparişlerini kargo ile göndermektedir. Atölyenin "
                "çalıştığı iki kargo firmasının ücret tarifesi aşağıdaki tabloda verilmiştir. Her iki "
                "firmada da ücret, sabit ücrete gönderinin her kilogramı için kilogram başına ücretin "
                "eklenmesiyle hesaplanmaktadır."
            ),
            "veri_tablosu": (
                "| Firma | Sabit ücret (TL) | Kilogram başına ücret (TL) |\n"
                "|---|---|---|\n"
                "| X | 40 | 12 |\n"
                "| Y | 100 | 8 |"
            ),
            "onculler": None,
            "soru_koku": (
                "Atölye, gönderilerinin ağırlığını tam sayı kilogram olarak hesapladığına göre "
                "**Y firmasının X firmasından daha ucuz olduğu en küçük ağırlık** kaç kilogramdır?"
            ),
            "secenekler": {"A": "14", "B": "15", "C": "16", "D": "17", "E": "25"},
            "dogru_cevap": "C",
            "cozum": (
                "$k$ kilogramlık gönderi için X: $40+12k$, Y: $100+8k$ TL'dir. Y'nin daha ucuz olması için "
                "$100+8k<40+12k \\Rightarrow 60<4k \\Rightarrow k>15$ olmalıdır. En küçük tam sayı $k=16$'dır."
            ),
            "celdirici_analizi": {
                "A": "Eşitsizlik yönünü ters çevirip bir eksiğini almak.",
                "B": "Eşitlik noktasını (iki firmanın aynı ücreti aldığı ağırlığı) cevap sanmak.",
                "C": "Doğru cevap.",
                "D": "Kesin büyüklük yerine bir fazlasını almak.",
                "E": "Yalnızca Y'nin sabit ücretini kilogram ücreti farkına bölmek: 100/4.",
            },
            "kazanim": "TYT Matematik - Problemler",
            "bilissel_duzey": "Uygulama",
            "alt_konu": "Doğrusal Maliyet Karşılaştırma",
            "adim_sayisi": 3,
            "visual_svg": None,
        },
    },
    {
        "seviye": "YKS",
        "alan": "sozel",
        "ornek": {
            "baglam": (
                "Türkiye'de yer alan K ve L şehirlerine ait bazı iklim verileri aşağıdaki tabloda verilmiştir."
            ),
            "veri_tablosu": (
                "| Şehir | Ocak ort. sıcaklığı (°C) | Temmuz ort. sıcaklığı (°C) | Yıllık yağış (mm) | En yağışlı mevsim |\n"
                "|---|---|---|---|---|\n"
                "| K | 9 | 27 | 650 | Kış |\n"
                "| L | -8 | 19 | 450 | İlkbahar |"
            ),
            "onculler": None,
            "soru_koku": "Bu verilere göre aşağıdakilerden hangisine **ulaşılabilir**?",
            "secenekler": {
                "A": "K şehrinde kar yağışı hiç görülmez.",
                "B": "L şehri, K şehrinden daha güneyde yer alır.",
                "C": "L şehrinde yıllık sıcaklık farkı K şehrine göre daha fazladır.",
                "D": "K şehrinin yıllık ortalama sıcaklığı 18 °C'dir.",
                "E": "L şehrinde yağışın büyük bölümü yaz mevsiminde düşer.",
            },
            "dogru_cevap": "C",
            "cozum": (
                "Yıllık sıcaklık farkı K'de $27-9=18$ °C, L'de $19-(-8)=27$ °C'dir; L'de daha fazladır. "
                "A ve B için tabloda yeterli bilgi yoktur (sıcaklık farkı yalnızca enlemle açıklanamaz; yükselti ve karasallık da etkilidir). "
                "D'de yalnızca iki ayın ortalaması alınmıştır. E tablodaki 'İlkbahar' bilgisiyle çelişir."
            ),
            "celdirici_analizi": {
                "A": "Ocak ortalamasının sıfırın üstünde olmasını hiç kar yağmayacağı biçiminde genellemek.",
                "B": "Düşük sıcaklığı yalnızca enlemle açıklamak; yükselti ve karasallığı göz ardı etmek.",
                "C": "Doğru cevap.",
                "D": "İki ayın ortalamasını yıllık ortalama sanmak.",
                "E": "Karasal iklim bilgisini tablodaki veriye tercih etmek.",
            },
            "kazanim": "TYT Coğrafya - İklim Elemanları",
            "bilissel_duzey": "Analiz / Muhakeme",
            "alt_konu": "İklim Verisi Yorumlama",
            "adim_sayisi": 2,
            "visual_svg": None,
        },
    },
]


def pick_examples(exam_type: str, verbal: bool, limit: int = 2) -> List[Dict[str, Any]]:
    """Sınav türüne ve dal türüne en uygun örnekleri seçer."""
    seviye = "LGS" if str(exam_type).upper() == "LGS" else "YKS"
    alan = "sozel" if verbal else "sayisal"
    same_level = [e["ornek"] for e in NEW_GEN_EXAMPLES if e["alan"] == alan and e["seviye"] == seviye]
    other_level = [e["ornek"] for e in NEW_GEN_EXAMPLES if e["alan"] == alan and e["seviye"] != seviye]
    return (same_level + other_level)[:limit]
