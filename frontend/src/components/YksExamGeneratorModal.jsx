import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, BookOpen, Clock, HelpCircle, CheckCircle2, 
  Trash2, Edit3, ArrowRight, ArrowLeft, Send, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';
import { examService, classroomService } from '../services/api';
import MathRenderer from './MathRenderer';
import { isVerbalBranch } from '../utils/branchUtils';

// MEB ve ÖSYM Güncel Müfredat Kataloğu (Her an hazır, sıfır gecikme)
export const DEFAULT_YKS_CURRICULUM = {
  LGS: {
    'Türkçe': [
      'Fiilimsiler (Eylemsiler)', 'Cümlenin Ögeleri', 'Cümle Türleri',
      'Paragrafta Anlam ve Ana Düşünce', 'Paragrafta Yapı ve Akış', 'Metin Türleri ve Söz Sanatları',
      'Noktalama İşaretleri', 'Yazım Kuralları', 'Görsel Okuma ve Grafik Yorumlama',
      'Sözel Mantık ve Muhakeme'
    ],
    'Matematik': [
      'Çarpanlar ve Katlar (EBOB-EKOK)', 'Üslü İfadeler', 'Kareköklü İfadeler',
      'Veri Analizi (Daire ve Çizgi Grafiği)', 'Basit Olayların Olasılığı',
      'Cebirsel İfadeler ve Özdeşlikler', 'Doğrusal Denklemler ve Koordinat Sistemi',
      'Eşitsizlikler', 'Üçgenler (Açı-Kenar Bağıntıları, Pisagor)', 'Dönüşüm Geometrisi',
      'Geometrik Cisimler (Prizma, Silindir, Koni, Piramit)'
    ],
    'Fen Bilimleri': [
      'Mevsimler ve İklim', 'DNA ve Genetik Kod', 'Basınç (Katı, Sıvı ve Gaz Basıncı)',
      'Madde ve Endüstri (Periyodik Sistem, Fiziksel ve Kimyasal Değişimler, Asit-Bazlar)',
      'Basit Makineler (Makaralar, Kaldıraç, Eğik Düzlem, Çıkrık)',
      'Enerji Dönüşümleri ve Çevre Bilimi (Besin Zinciri, Fotosentez, Solunum)',
      'Elektrik Yükleri ve Elektrik Enerjisi'
    ],
    'T.C. İnkılap Tarihi ve Atatürkçülük': [
      'Bir Kahraman Doğuyor (Mustafa Kemal\'in Hayatı)', 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar',
      'Millî Bir Destan: Ya İstiklal Ya Ölüm! (Cepheler ve Lozan)',
      'Atatürkçülük ve Çağdaşlaşan Türkiye (İnkılaplar)', 'Demokratikleşme Çabaları',
      'Atatürk Dönemi Türk Dış Politikası', 'Atatürk\'ün Ölümü ve Sonrası'
    ],
    'Din Kültürü ve Ahlak Bilgisi': [
      'Kader İnancı (Kaza, Kader, Tevekkül, Evrenin Yasaları)', 'Zekat ve Sadaka İbadeti',
      'Din ve Hayat (Temel Hakların Korunması)', 'Hz. Muhammed\'in Doğruluğu ve Güvenilirliği',
      'Kur\'an-ı Kerim ve Özellikleri'
    ],
    'İngilizce': [
      'Friendship (Accepting & Refusing)', 'Teen Life (Daily Routines, Preferences)',
      'In The Kitchen (Cooking Process & Recipes)', 'On The Phone (Phone Conversations)',
      'The Internet (Online Habits & Rules)', 'Adventures (Extreme Sports)',
      'Tourism (Vacation Types, Attractions)', 'Chores (Obligations & Responsibilities)',
      'Science (Scientific Discoveries & Inventions)', 'Natural Forces (Disasters & Precautions)'
    ]
  },
  TYT: {
    'Temel Matematik': [
      'Temel Kavramlar ve Sayı Kümeleri', 'Bölme ve Bölünebilme Kuralları', 'Asal Çarpanlar ve EBOB-EKOK',
      'Rasyonel ve Ondalık Sayılar', 'Birinci Dereceden Denklem ve Eşitsizlikler', 'Mutlak Değer',
      'Üslü ve Köklü İfadeler', 'Çarpanlara Ayırma', 'Oran ve Orantı',
      'Yeni Nesil Sayı ve Kesir Problemleri', 'Yaş Problemleri', 'İşçi Problemleri',
      'Yüzde, Kâr-Zarar ve İskonto Problemleri', 'Karışım Problemleri', 'Hız ve Hareket Problemleri',
      'Grafik ve Tablo Yorumlama Problemleri', 'Kümeler ve Kartezyen Çarpım',
      'Fonksiyonlar (Temel Düzey)', 'Mantık', 'Sayma, Permütasyon ve Kombinasyon',
      'Olasılık', 'İstatistik ve Veri Analizi'
    ],
    'Türkçe': [
      'Sözcükte Anlam', 'Cümlede Anlam', 'Paragrafta Anlam ve Ana Düşünce',
      'Paragrafta Yapı ve Akışı Bozan Cümle', 'Anlatım Teknikleri ve Düşünceyi Geliştirme Yolları',
      'Ses Bilgisi', 'Yazım Kuralları', 'Noktalama İşaretleri',
      'Sözcükte Yapı ve Ekler', 'İsim, Sıfat, Zamir, Zarf', 'Edat, Bağlaç, Ünlem',
      'Fiiller, Ek Fiil ve Fiilimsi', 'Cümlenin Ögeleri', 'Cümle Türleri', 'Anlatım Bozuklukları'
    ],
    'Geometri': [
      'Doğruda ve Üçgende Açılar', 'Özel Üçgenler (Dik, İkizkenar, Eşkenar)', 'Üçgende Alan',
      'Üçgende Benzerlik', 'Açıortay ve Kenarortay Bağıntıları', 'Çokgenler ve Düzgün Çokgenler',
      'Dörtgenler ve Özel Dörtgenler (Paralelkenar, Eşkenar Dörtgen, Dikdörtgen, Kare, Yamuk)',
      'Çemberde Açılar ve Uzunluk', 'Dairede Alan ve Çevre', 'Katı Cisimler (Prizma, Silindir, Koni, Piramit, Küre)'
    ],
    'Fizik': [
      'Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Hareket ve Kuvvet', 'Newton\'ın Hareket Yasaları',
      'İş, Güç ve Enerji', 'Isı, Sıcaklık ve Genleşme', 'Elektrostatik', 'Elektrik Akımı ve Devreler',
      'Mıknatıs ve Manyetizma', 'Basınç ve Kaldırma Kuvveti', 'Dalgalar (Yay, Su, Ses, Deprem)',
      'Optik (Aydınlanma, Aynalar, Kırılma, Mercekler, Prizmalar ve Renk)'
    ],
    'Kimya': [
      'Kimya Bilimi ve Güvenlik', 'Atom Modelleri ve Periyodik Sistem',
      'Kimyasal Türler Arası Etkileşimler (Zayıf ve Güçlü Bağlar)', 'Maddenin Halleri (Katı, Sıvı, Gaz, Plazma)',
      'Doğa ve Kimya', 'Kimyanın Temel Kanunları ve Kimyasal Hesaplamalar', 'Mol Kavramı',
      'Karışımlar ve Ayırma Teknikleri', 'Asitler, Bazlar ve Tuzlar', 'Kimya Her Yerde'
    ],
    'Biyoloji': [
      'Yaşam Bilimi Biyoloji ve Canlıların Ortak Özellikleri', 'Canlıların Temel Bileşikleri (İnorganik ve Organik)',
      'Hücre Teorisi, Hücre Zarı ve Organeller', 'Hücre Zarından Madde Geçişleri',
      'Canlılar Dünyası ve Sınıflandırma', 'Mitoz Bölünme ve Eşeysiz Üreme',
      'Mayoz Bölünme ve Eşeyli Üreme', 'Kalıtımın Genel Esasları ve Çaprazlamalar',
      'Ekosistem Ekolojisi ve Madde Döngüleri', 'Güncel Çevre Sorunları ve Biyoçeşitlilik'
    ],
    'Tarih': [
      'Tarih ve Zaman', 'İlk ve Orta Çağlarda Türk Dünyası', 'İslam Medeniyetinin Doğuşu ve İlk İslam Devletleri',
      'Türklerin İslamiyet\'i Kabulü ve İlk Türk İslam Devletleri', 'Orta Çağ\'da Dünya',
      'Beylikten Devlete Osmanlı Siyaseti (1300-1453)', 'Dünya Gücü Osmanlı Devleti (1453-1595)',
      'Değişim Çağında Avrupa ve Osmanlı', 'Uluslararası İlişkilerde Denge Stratejisi (1774-1914)',
      '20. Yüzyıl Başlarında Osmanlı Devleti ve Dünya', 'Milli Mücadele Dönemi (Hazırlık, Cepheler)',
      'Atatürkçülük ve Türk İnkılabı'
    ],
    'Coğrafya': [
      'Doğa ve İnsan Etkileşimi', 'Dünya\'nın Şekli ve Hareketleri', 'Coğrafi Konum ve Koordinat Sistemi',
      'Harita Bilgisi ve Ölçekler', 'Atmosfer ve İklim Elemanları (Sıcaklık, Basınç, Rüzgar, Nem, Yağış)',
      'Büyük İklim Tipleri ve Türkiye\'nin İklimi', 'Yerin İç Yapısı ve İç Kuvvetler',
      'Dış Kuvvetler ve Oluşturduğu Yer Şekilleri', 'Su, Toprak ve Bitki Varlığı',
      'Nüfusun Gelişimi, Dağılışı ve Nüfus Piramitleri', 'Göçler ve Yerleşme Tipleri',
      'Ekonomik Faaliyetler ve Doğal Afetler'
    ],
    'Felsefe': [
      'Felsefenin Anlamı ve Özellikleri', 'Bilgi Felsefesi (Epistemoloji)', 'Varlık Felsefesi (Ontoloji)',
      'Ahlak Felsefesi (Etik)', 'Sanat Felsefesi (Estetik)', 'Din Felsefesi', 'Siyaset Felsefesi', 'Bilim Felsefesi'
    ],
    'Din Kültürü ve Ahlak Bilgisi': [
      'İslam ve İnanç Esasları (Tevhid, Ahiret, Kader)', 'İbadetler (Namaz, Oruç, Zekat, Hac)',
      'Ahlak ve Değerler', 'Din, Kültür ve Medeniyet', 'Hz. Muhammed\'in Örnek Hayatı',
      'Vahiy ve Akıl İlişkisi'
    ]
  },
  AYT: {
    'Matematik': [
      'Temel Matematik İleri Uygulamaları', 'İkinci Dereceden Bir Bilinmeyenli Denklemler',
      'Karmaşık Sayılar', 'İkinci Dereceden Eşitsizlikler ve Grafikleri',
      'Parabol (İkinci Dereceden Fonksiyonlar)', 'Polinomlar ve Polinomlarda Bölme',
      'Fonksiyonlarda Dönüşümler ve Bileşke', 'Permütasyon, Kombinasyon, Binom Açılımı ve Olasılık',
      'Trigonometri (Birim Çember, Toplam-Fark, Yarım Açı, Denklemler)',
      'Logaritma Fonksiyonu ve Üstel Denklemler', 'Diziler ve Aritmetik-Geometrik Diziler',
      'Limit ve Süreklilik', 'Türev Tanımı, Kuralları ve Teğet Denklemi',
      'Türevin Geometrik Yorumu ve Artan-Azalanlık', 'Maksimum ve Minimum Problemleri',
      'Belirsiz İntegral ve İntegral Alma Teknikleri', 'Belirli İntegral ve Eğri Altında Kalan Alan Hesabı'
    ],
    'Geometri': [
      'Noktanın ve Doğrunun Analitik İncelenmesi', 'Dönüşümlerle Geometri (Öteleme, Dönme, Yansıma)',
      'Çemberin Analitik İncelenmesi', 'Katı Cisimler (Prizma, Piramit, Koni, Küre Hacim ve Alan)',
      'Çemberde Uzunluk ve Teğet Özellikleri', 'Dairede Alan ve Yay Parçası', 'Vektörler (İleri)'
    ],
    'Fizik': [
      'Vektörler ve Bağıl Hareket', 'Newton\'ın Hareket Yasaları (İki Boyutta Dinamik)',
      'Bir ve İki Boyutta Sabit İvmeli Hareket (Atışlar)', 'İş, Güç ve Mekanik Enerjinin Korunumu',
      'İtme ve Çizgisel Momentum Korunumu', 'Tork, Denge ve Kütle Merkezi', 'Basit Makineler',
      'Elektriksel Kuvvet, Elektrik Alan ve Potansiyel', 'Düzgün Elektrik Alan ve Sığa (Kondansatörler)',
      'Manyetik Alan, Manyetik Kuvvet ve İndüksiyon Akımı', 'Alternatif Akım Devreleri ve Transformatörler',
      'Düzgün Çembersel Hareket ve Viraj Problemleri', 'Basit Harmonik Hareket',
      'Dalga Mekaniği (Kırınım, Girişim ve Doppler Olayı)',
      'Atom Fiziğine Giriş, Bohr Atom Modeli ve Radyoaktivite',
      'Özel Görelilik Teorisi ve Fotoelektrik Olayı', 'Compton Saçılması ve De Broglie Hipotezi',
      'Modern Fiziğin Teknolojideki Uygulamaları (Yarı İletkenler, Süper İletkenler, Lazer)'
    ],
    'Kimya': [
      'Modern Atom Teorisi ve Kuantum Sayıları', 'Gaz Yasaları ve Gerçek Gazlar',
      'Sıvı Çözeltiler ve Derişim Birimleri (Molarite, Molalite)', 'Koligatif Özellikler',
      'Kimyasal Tepkimelerde Enerji ve Entalpi (Hess Yasası)',
      'Kimyasal Tepkimelerde Hız ve Çarpışma Teorisi', 'Kimyasal Denge ve Dengeye Etki Eden Faktörler (Le Chatelier)',
      'Sulu Çözelti Dengeleri (Asit-Baz Dengesi, pH, Tampon Çözeltiler)',
      'Çözünürlük Dengesi (Kçç ve Ortak İyon Etkisi)',
      'Kimya ve Elektrik (İndirgenme-Yükseltgenme, Elektrokimyasal Piller, Nernst Eşitliği)',
      'Elektroliz ve Korozyon', 'Karbon Kimyasına Giriş ve Hibritleşme-Molekül Geometrisi',
      'Organik Kimya: Hidrokarbonlar (Alkanlar, Alkenler, Alkinler, Aromatik Bileşikler)',
      'Organik Kimya: Fonksiyonel Gruplar (Alkoller, Eterler, Karbonil Bileşikleri, Karboksilik Asitler ve Esterler)'
    ],
    'Biyoloji': [
      'Sinir Sistemi, Nöronlar ve İmpuls İletimi', 'Endokrin Sistem ve Hormonlar',
      'Duyu Organları (Göz, Kulak, Deri, Burun, Dil)', 'Destek ve Hareket Sistemi (Kemik, Kıkırdak, Kas Kasılması)',
      'Sindirim Sistemi ve Besinlerin Emilimi', 'Dolaşım Sistemi, Kalbin Çalışması ve Bağışıklık',
      'Solunum Sistemi ve Gaz Alışverişi', 'Boşaltım Sistemi ve Nefronların Fonksiyonu',
      'Üreme Sistemi ve Embriyonik Gelişim', 'Komünite ve Popülasyon Ekolojisi',
      'Nükleik Asitler (DNA, RNA) ve Genetik Şifre', 'Replikasyon, Transkripsiyon ve Protein Sentezi',
      'Fotosentez ve Kemosentez Reaksiyonları', 'Hücresel Solunum (Glikoliz, Krebs, ETS) ve Fermantasyon',
      'Bitki Biyolojisi (Dokular, Organlar, Madde Taşınması, Büyüme ve Üreme)', 'Canlılar ve Çevre'
    ],
    'Türk Dili ve Edebiyatı': [
      'Şiir Bilgisi, Nazım Biçimleri ve Edebi Sanatlar',
      'İslamiyet Öncesi ve Geçiş Dönemi Türk Edebiyatı', 'Halk Edebiyatı (Anonim, Âşık, Tekke)',
      'Divan Edebiyatı (Nazım Şekilleri, Temsilcileri)', 'Tanzimat Dönemi Türk Edebiyatı',
      'Servet-i Fünun ve Fecr-i Âti Edebiyatı', 'Millî Edebiyat Dönemi',
      'Cumhuriyet Dönemi Türk Edebiyatı (Şiir, Roman, Hikaye, Tiyatro)',
      'Batı Edebiyatı Akımları (Klasisizm, Romantizm, Realizm, Sembolizm vb.)'
    ],
    'Tarih-1': [
      'Tarih Bilimi ve İlk Uygarlıklar', 'İlk ve Orta Çağlarda Türk Dünyası',
      'İslam Medeniyeti ve Türk-İslam Devletleri', 'Selçuklu ve Beylikler Dönemi',
      'Klasik Çağ Osmanlı Toplum ve Devlet Yapısı', 'Milli Mücadele Dönemi',
      'Atatürk İlkeleri ve İnkılap Tarihi'
    ],
    'Coğrafya-1': [
      'Ekosistem ve Madde Döngüleri', 'Nüfus Politikaları ve Şehirlerin Fonksiyonları',
      'Türkiye\'de Tarım, Hayvancılık, Madenler ve Enerji Kaynakları', 'Türkiye\'de Sanayi ve Ulaşım',
      'Bölgesel Kalkınma Projeleri', 'Küresel ve Bölgesel Örgütler', 'Çevre ve Toplum'
    ]
  }
};

export default function YksExamGeneratorModal({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(1); // 1: Ayarlar, 2: Soruları İnceleme & Düzenleme
  const [curriculum, setCurriculum] = useState(DEFAULT_YKS_CURRICULUM);
  const [classrooms, setClassrooms] = useState([]);

  // Form States (Step 1)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [examType, setExamType] = useState('TYT'); // 'TYT' | 'AYT'
  const [subject, setSubject] = useState('Temel Matematik');
  const [topic, setTopic] = useState('Karma');
  const [difficulty, setDifficulty] = useState('ÖSYM / Yeni Nesil');
  const [questionCount, setQuestionCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [includeDiagrams, setIncludeDiagrams] = useState(true);
  const [customPrompt, setCustomPrompt] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  // Generation & Editing States (Step 2)
  const [generating, setGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [savingExam, setSavingExam] = useState(false);

  // Active curriculum dictionary safely resolved
  const activeCurriculum = (curriculum && Object.keys(curriculum).length > 0) ? curriculum : DEFAULT_YKS_CURRICULUM;
  const currentSubjects = Object.keys(activeCurriculum[examType] || DEFAULT_YKS_CURRICULUM[examType] || {});
  const currentTopics = (activeCurriculum[examType] || DEFAULT_YKS_CURRICULUM[examType])?.[subject] || [];

  // Fetch Curriculum & Classes on mount / open
  useEffect(() => {
    if (!isOpen) return;

    const initData = async () => {
      try {
        const [currData, classList] = await Promise.all([
          examService.getCurriculum().catch(() => null),
          classroomService.list().catch(() => [])
        ]);

        if (currData && typeof currData === 'object' && Object.keys(currData).length > 0) {
          setCurriculum(currData);
        }
        if (Array.isArray(classList)) {
          setClassrooms(classList);
          if (classList.length > 0 && !selectedClassId) {
            setSelectedClassId(classList[0].id.toString());
          }
        }
      } catch (err) {
        console.error('Veriler yüklenirken hata:', err);
      }
    };
    initData();
  }, [isOpen]);

  // Ensure subject is always valid for the selected examType
  useEffect(() => {
    if (currentSubjects.length > 0) {
      if (!subject || !currentSubjects.includes(subject)) {
        setSubject(currentSubjects[0]);
      }
    }
  }, [examType, currentSubjects, subject]);

  // When examType or subject changes, update default title & reset topic
  useEffect(() => {
    if (examType && subject) {
      setTitle(`${examType} ${subject} Deneme Sınavı`);
      setTopic('Karma');
    }
  }, [examType, subject]);

  if (!isOpen) return null;

  const handleExamTypeChange = (newType) => {
    setExamType(newType);
    const subs = Object.keys((activeCurriculum && activeCurriculum[newType]) || DEFAULT_YKS_CURRICULUM[newType] || {});
    if (subs.length > 0) {
      setSubject(subs[0]);
    }
    setTopic('Karma');
  };

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Lütfen bir sınav başlığı giriniz.');
      return;
    }

    if (geminiApiKey && geminiApiKey.trim()) {
      localStorage.setItem('gemini_api_key', geminiApiKey.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }

    setGenerating(true);
    setGenerationStatus('Güncel MEB/ÖSYM kazanımları taranıyor ve yeni nesil soru kalıpları inceleniyor...');

    try {
      setTimeout(() => {
        setGenerationStatus('Matematik formülleri ve Türkçe karakter güvenlik filtreleri uygulanıyor...');
      }, 1500);

      const resp = await examService.generateQuestions({
        exam_type: examType,
        subject,
        topic,
        difficulty,
        question_count: parseInt(questionCount, 10),
        include_diagrams: includeDiagrams,
        custom_prompt: customPrompt || null,
        gemini_api_key: geminiApiKey || null,
        classroom_id: selectedClassId ? parseInt(selectedClassId, 10) : null,
        enforce_zero_duplicate: true
      });

      const requestedCount = parseInt(questionCount, 10);
      const normalized = (resp.questions || []).map((q, idx) => {
        const correct = (q.correct_option || q.correct_answer || 'A').toUpperCase();
        return {
          ...q,
          question_number: q.question_number || (idx + 1),
          correct_option: correct,
          correct_answer: correct
        };
      });

      if (normalized.length === 0) {
        alert('Seçtiğiniz konuda yeterli benzersiz soru üretilemedi. Lütfen konuyu veya soru sayısını değiştiriniz.');
        return;
      }

      if (normalized.length < requestedCount) {
        alert(`Bilgilendirme: Seçtiğiniz konuda tekrar eden veya birbirine çok yakın soruların yer almaması için ${normalized.length} adet tamamen özgün soru üretildi.`);
      }

      setGeneratedQuestions(normalized);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.detail || 'Soru üretilirken bir hata oluştu.');
    } finally {
      setGenerating(false);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    setGeneratedQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDeleteQuestion = (index) => {
    if (generatedQuestions.length <= 1) {
      alert('Sınavda en az 1 soru bulunmalıdır.');
      return;
    }
    setGeneratedQuestions(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((q, idx) => ({ ...q, question_number: idx + 1 }));
    });
  };

  const handlePublishExam = async () => {
    if (generatedQuestions.length === 0) {
      alert('Yayınlanacak soru bulunamadı.');
      return;
    }

    setSavingExam(true);
    try {
      const questionsToPublish = generatedQuestions.map((q, idx) => ({
        question_number: q.question_number || (idx + 1),
        question_text: q.question_text || '',
        visual_svg: q.visual_svg || null,
        option_a: q.option_a || '',
        option_b: q.option_b || '',
        option_c: q.option_c || '',
        option_d: q.option_d || '',
        option_e: q.option_e || '',
        correct_option: (q.correct_option || q.correct_answer || 'A').toUpperCase(),
        explanation: q.explanation || null,
        topic: q.topic || topic || subject,
        subtopic: q.subtopic || null
      }));

      await examService.create({
        classroom_id: selectedClassId ? parseInt(selectedClassId, 10) : null,
        title,
        description: description || `${examType} ${subject} - ${topic} Testi`,
        exam_type: examType,
        subject,
        topic,
        difficulty,
        duration_minutes: durationMinutes ? parseInt(durationMinutes, 10) : null,
        questions: questionsToPublish
      });

      alert('YKS Testi başarıyla oluşturuldu ve öğrencilere bildirim gönderildi!');
      onCreated();
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || 'Sınav kaydedilemedi.');
    } finally {
      setSavingExam(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Yapay Zeka YKS Test ve Soru Üretim Sihirbazı
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {step === 1 ? 'Adım 1/2: Ders, Konu ve Sınav Ayarları' : `Adım 2/2: Üretilen ${generatedQuestions.length} Soruyu İncele ve Yayınla`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          
          {/* STEP 1: FORM AYARLARI */}
          {step === 1 && (
            <form onSubmit={handleGenerateQuestions} className="space-y-5">
              
              {/* Sınav Türü Seçimi (TYT vs AYT) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  Sınav Grubu
                </label>
                <div className="grid grid-cols-3 gap-2.5 max-w-lg">
                  {['TYT', 'AYT', 'LGS'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleExamTypeChange(t)}
                      className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition flex items-center justify-center gap-1.5 ${
                        examType === t
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{t} ({t === 'TYT' ? 'Temel' : t === 'AYT' ? 'Alan' : '8. Sınıf'})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sınav Başlığı & Hedef Sınıf */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Sınav / Test Başlığı
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: TYT Matematik Denemesi 1"
                    className="w-full text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Atanacak Sınıf
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Tüm Sınıflar (Genel)</option>
                    {classrooms.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name} ({cls.grade_level})
                      </option>
                    ))}
                  </select>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Sıfır Tekrar Koruması: Sınıfın geçmiş sınav soruları elenir, asla aynı soru çıkmaz.</span>
                  </div>
                </div>
              </div>

              {/* Ders & Konu Seçimi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                    <span>Ders Seçimi</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">
                      ({currentSubjects.length} Ders Mevcut)
                    </span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      setTopic('Karma');
                    }}
                    className="w-full text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {currentSubjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                    <span>Konu Kapsamı (Güncel Müfredat)</span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      ({currentTopics.length} Konu)
                    </span>
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Karma">✨ Karma (Tüm Müfredattan Dengeli Dağılım)</option>
                    {currentTopics.map((top) => (
                      <option key={top} value={top}>{top}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Soru Sayısı, Zorluk ve Süre */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Soru Sayısı
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={5}>5 Soru (Hızlı Tarama)</option>
                    <option value={10}>10 Soru (Standart Test)</option>
                    <option value={15}>15 Soru (Konu Bitirme)</option>
                    <option value={20}>20 Soru (Bölüm Denemesi)</option>
                    <option value={40}>40 Soru (Tam Branş Denemesi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Zorluk Seviyesi
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ÖSYM / Yeni Nesil">ÖSYM / Yeni Nesil (Önerilen)</option>
                    <option value="Kolay">Temel Kavrama (Kolay)</option>
                    <option value="Orta">Pekiştirme (Orta)</option>
                    <option value="Zor">Derece Hedefli (Zor & Seçici)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Sınav Süresi (Dakika)
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value ? parseInt(e.target.value, 10) : '')}
                    className="w-full text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={15}>15 Dakika</option>
                    <option value={30}>30 Dakika</option>
                    <option value={45}>45 Dakika</option>
                    <option value={60}>60 Dakika</option>
                    <option value={80}>80 Dakika</option>
                    <option value="">Süresiz (Zaman Kısıtlamasız)</option>
                  </select>
                </div>
              </div>

              {/* Görsel Desteği Toggle & Gemini API Key */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40">
                  <input
                    type="checkbox"
                    id="includeDiagrams"
                    checked={includeDiagrams}
                    onChange={(e) => setIncludeDiagrams(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-zinc-300 dark:border-zinc-700"
                  />
                  <label htmlFor="includeDiagrams" className="text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <span className="font-bold block">Gerektiğinde Şekil & SVG Çizimi Üret</span>
                    <span className="text-[11px] text-zinc-400">Geometri, devre veya grafik sorularında vektörel çizim ekler.</span>
                  </label>
                </div>

                <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/40 dark:bg-indigo-950/20">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>🤖 Gemini Yapay Zeka API Anahtarı</span>
                    </label>
                    {geminiApiKey ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        🟢 Özel API Anahtarı Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        🟢 Sunucu Canlı Gemini AI Aktif
                      </span>
                    )}
                  </div>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => {
                      const val = e.target.value;
                      setGeminiApiKey(val);
                      if (!val.trim()) localStorage.removeItem('gemini_api_key');
                    }}
                    placeholder="İsteğe bağlı (Boş bırakılırsa sunucudaki canlı Gemini anahtarı kullanılır)"
                    className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 font-mono shadow-sm focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                    Sunucuda canlı Gemini API anahtarı zaten tanımlıdır; bu alanı boş bırakabilirsiniz.
                  </p>
                </div>
              </div>

              {/* Özel Öğretmen Yönergesi (Prompt) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Özel Öğretmen Yönergesi / İsteği (İsteğe Bağlı)
                </label>
                <textarea
                  rows={2}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Örn: 2024 ve 2025 YKS çıkmış soru tarzında, güncel hayat senaryoları ve çeldiricisi güçlü sorular olsun."
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  disabled={generating}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 disabled:opacity-50 transition"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{generationStatus || 'Yapay Zeka Soruları Üretiyor...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Soruları Yapay Zeka ile Üret</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* STEP 2: SORULARI ÖNİZLEME, DÜZENLEME & YAYINLAMA */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50">
                <div>
                  <h3 className="text-sm font-bold text-indigo-950 dark:text-indigo-200">
                    {title} ({examType} • {subject})
                  </h3>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400 mt-0.5">
                    Yapay zeka {generatedQuestions.length} adet yeni nesil soru üretti. Soruları aşağıda inceleyebilir, formül ve metinlerini düzenleyebilir, onayladıktan sonra yayınlayabilirsiniz.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 rounded-xl border border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Ayarlara Dön
                </button>
              </div>

              {/* Soru Kartları */}
              <div className="space-y-4">
                {generatedQuestions.map((q, idx) => {
                  const isEditing = editingIndex === idx;

                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 shadow-sm"
                    >
                      {/* Soru Başlık Çubuğu */}
                      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs">
                            {q.question_number}
                          </span>
                          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            {q.topic} {q.subtopic ? `• ${q.subtopic}` : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingIndex(isEditing ? null : idx)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-xs font-medium flex items-center gap-1 transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{isEditing ? 'Önizlemeye Dön' : 'Düzenle'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(idx)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Soru İçeriği (Görüntüleme veya Düzenleme Modu) */}
                      {isEditing ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                              Soru Metni (LaTeX için $...$ kullanınız):
                            </label>
                            <textarea
                              rows={4}
                              value={q.question_text}
                              onChange={(e) => handleQuestionChange(idx, 'question_text', e.target.value)}
                              className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 font-mono"
                            />
                          </div>

                          {/* Şıklar */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(examType === 'LGS' ? ['a', 'b', 'c', 'd'] : ['a', 'b', 'c', 'd', 'e']).map((opt) => (
                              <div key={opt} className="flex items-center gap-2">
                                <span className="font-bold text-xs uppercase w-4">{opt}:</span>
                                <input
                                  type="text"
                                  value={q[`option_${opt}`]}
                                  onChange={(e) => handleQuestionChange(idx, `option_${opt}`, e.target.value)}
                                  className="flex-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1.5"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <label className="text-xs font-bold">Doğru Şık:</label>
                            <select
                              value={q.correct_option}
                              onChange={(e) => handleQuestionChange(idx, 'correct_option', e.target.value)}
                              className="text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1 font-bold"
                            >
                              {(examType === 'LGS' ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E']).map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Soru Metni (MathRenderer) */}
                          <MathRenderer text={q.question_text} className="text-xs sm:text-sm font-medium leading-relaxed" />

                          {/* SVG Çizimi (Varsa) */}
                          {q.visual_svg && (
                            <div
                              className="my-3 flex justify-center"
                              dangerouslySetInnerHTML={{ __html: q.visual_svg }}
                            />
                          )}

                          {/* Şıklar Listesi */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            {(examType === 'LGS' || q.exam_type === 'LGS' || !q.option_e ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E']).map((opt) => {
                              const key = `option_${opt.toLowerCase()}`;
                              const isCorrect = q.correct_option === opt;

                              return (
                                <div
                                  key={opt}
                                  className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                                    isCorrect
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold'
                                      : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${
                                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                                  }`}>
                                    {opt}
                                  </span>
                                  <MathRenderer text={q[key]} className="flex-1" />
                                </div>
                              );
                            })}
                          </div>

                          {/* Çözüm Açıklaması */}
                          {q.explanation && (
                            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                                Çözüm & Pedagojik Açıklama:
                              </span>
                              <MathRenderer text={q.explanation} />
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between sticky bottom-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Geri Dön ve Yeniden Üret
                </button>

                <button
                  type="button"
                  onClick={handlePublishExam}
                  disabled={savingExam}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 flex items-center gap-2 transition disabled:opacity-50"
                >
                  {savingExam ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sınav Kaydediliyor ve Yayınlanıyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Sınavı Yayınla & Öğrencilere Gönder</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
