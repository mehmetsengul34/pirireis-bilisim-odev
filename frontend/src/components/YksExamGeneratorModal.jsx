import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, BookOpen, Clock, HelpCircle, CheckCircle2, 
  Trash2, Edit3, ArrowRight, ArrowLeft, Send, AlertCircle, RefreshCw, Layers 
} from 'lucide-react';
import { examService, classroomService } from '../services/api';
import MathRenderer from './MathRenderer';

export default function YksExamGeneratorModal({ isOpen, onClose, onCreated }) {
  const [step, setStep] = useState(1); // 1: Ayarlar, 2: Soruları İnceleme & Düzenleme
  const [curriculum, setCurriculum] = useState({});
  const [classrooms, setClassrooms] = useState([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);

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

  // Fetch Curriculum & Classes
  useEffect(() => {
    if (!isOpen) return;

    const initData = async () => {
      setLoadingCurriculum(true);
      try {
        const [currData, classList] = await Promise.all([
          examService.getCurriculum(),
          classroomService.list()
        ]);
        setCurriculum(currData);
        setClassrooms(classList);
        if (classList.length > 0 && !selectedClassId) {
          setSelectedClassId(classList[0].id.toString());
        }

        // Default subject for TYT
        const subjects = Object.keys(currData['TYT'] || {});
        if (subjects.length > 0) {
          setSubject(subjects[0]);
        }
      } catch (err) {
        console.error('Müfredat yüklenemedi:', err);
      } finally {
        setLoadingCurriculum(false);
      }
    };
    initData();
  }, [isOpen]);

  // When examType or subject changes, update default title & reset topic
  useEffect(() => {
    if (examType && subject) {
      setTitle(`${examType} ${subject} Deneme Sınavı`);
      setTopic('Karma');
    }
  }, [examType, subject]);

  if (!isOpen) return null;

  const currentSubjects = Object.keys(curriculum[examType] || {});
  const currentTopics = curriculum[examType]?.[subject] || [];

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Lütfen bir sınav başlığı giriniz.');
      return;
    }

    if (geminiApiKey) {
      localStorage.setItem('gemini_api_key', geminiApiKey);
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
        gemini_api_key: geminiApiKey || null
      });

      setGeneratedQuestions(resp.questions || []);
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
      // Renumber questions
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
      await examService.create({
        classroom_id: selectedClassId ? parseInt(selectedClassId, 10) : null,
        title,
        description: description || `${examType} ${subject} - ${topic} Testi`,
        exam_type: examType,
        subject,
        topic,
        difficulty,
        duration_minutes: durationMinutes ? parseInt(durationMinutes, 10) : null,
        questions: generatedQuestions
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
                <div className="grid grid-cols-2 gap-3 max-w-md">
                  {['TYT', 'AYT'].map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => {
                        setExamType(t);
                        const subs = Object.keys(curriculum[t] || {});
                        if (subs.length > 0) setSubject(subs[0]);
                      }}
                      className={`py-2.5 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition flex items-center justify-center gap-2 ${
                        examType === t
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                          : 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      {t} ({t === 'TYT' ? 'Temel Yeterlilik' : 'Alan Yeterlilik'})
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
                </div>
              </div>

              {/* Ders & Konu Seçimi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Ders Seçimi
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {currentSubjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Konu Kapsamı (Güncel Müfredat)
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

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Gemini API Anahtarı (İsteğe Bağlı)
                  </label>
                  <input
                    type="password"
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    placeholder="AIzaSy... (Boş bırakılırsa dahili motor çalışır)"
                    className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2.5 text-zinc-900 dark:text-zinc-100 font-mono"
                  />
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
                            {['a', 'b', 'c', 'd', 'e'].map((opt) => (
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
                              {['A', 'B', 'C', 'D', 'E'].map(c => (
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
                            {['A', 'B', 'C', 'D', 'E'].map((opt) => {
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
