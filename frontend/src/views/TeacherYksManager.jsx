import React, { useState, useEffect } from 'react';
import { 
  Sparkles, BookOpen, Plus, BarChart3, Users, Clock, Award, 
  Trash2, Eye, Send, CheckCircle2, ChevronRight, Layers, AlertCircle,
  Printer, CheckSquare, Square, Filter, Search, Dices, RefreshCw, X
} from 'lucide-react';
import { examService, notificationService } from '../services/api';
import YksExamGeneratorModal from '../components/YksExamGeneratorModal';
import ExamAnalyticsModal from '../components/ExamAnalyticsModal';
import PrintableExamModal from '../components/PrintableExamModal';
import MathRenderer from '../components/MathRenderer';

export default function TeacherYksManager({ classrooms = [], user }) {
  // Navigation View: 'exams' | 'bank'
  const [activeView, setActiveView] = useState('exams');

  // Exams State
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  
  // Modals for Exams
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [analyticsExamId, setAnalyticsExamId] = useState(null);
  const [previewExam, setPreviewExam] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Question Bank State
  const [bankQuestions, setBankQuestions] = useState([]);
  const [bankSubjects, setBankSubjects] = useState([]);
  const [totalBankQuestions, setTotalBankQuestions] = useState(0);
  const [loadingBank, setLoadingBank] = useState(false);
  const [filterBankExamType, setFilterBankExamType] = useState('Tümü');
  const [filterBankSubject, setFilterBankSubject] = useState('Tümü');
  const [filterBankDifficulty, setFilterBankDifficulty] = useState('Tümü');
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // Modals for Bank
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printCustomExam, setPrintCustomExam] = useState(null);
  const [showAssignFromBankModal, setShowAssignFromBankModal] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignClassId, setAssignClassId] = useState(classrooms[0]?.id?.toString() || '');
  const [assignDuration, setAssignDuration] = useState(40);
  const [assigningExam, setAssigningExam] = useState(false);

  // Fetch Exams
  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await examService.list(selectedClassFilter ? parseInt(selectedClassFilter, 10) : null);
      setExams(data);
    } catch (err) {
      console.error('Sınavlar yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Question Bank
  const fetchBankQuestions = async () => {
    setLoadingBank(true);
    try {
      const params = {};
      if (filterBankExamType !== 'Tümü') params.exam_type = filterBankExamType;
      if (filterBankSubject !== 'Tümü') params.subject = filterBankSubject;
      if (filterBankDifficulty !== 'Tümü') params.difficulty = filterBankDifficulty;
      if (bankSearchQuery.trim()) params.search = bankSearchQuery.trim();
      params.limit = 150;

      const res = await examService.getQuestionBank(params);
      setBankQuestions(res.questions || []);
      setTotalBankQuestions(res.total || 0);
      if (res.subjects && res.subjects.length > 0) {
        setBankSubjects(res.subjects);
      }
    } catch (err) {
      console.error('Soru bankası yüklenirken hata:', err);
    } finally {
      setLoadingBank(false);
    }
  };


  useEffect(() => {
    fetchExams();
    fetchBankQuestions();
  }, [selectedClassFilter]);


  useEffect(() => {
    if (activeView === 'bank') {
      fetchBankQuestions();
    }
  }, [activeView, filterBankExamType, filterBankSubject, filterBankDifficulty]);

  const handleDeleteExam = async (examId, title) => {
    if (!window.confirm(`'${title}' başlıklı sınavı ve bu sınava ait tüm öğrenci sonuçlarını silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await examService.delete(examId);
      setExams(prev => prev.filter(e => e.id !== examId));
    } catch (err) {
      alert(err.response?.data?.detail || 'Sınav silinirken hata oluştu.');
    }
  };

  
  const handlePrintExam = async (examId) => {
    try {
      const detail = await examService.getDetail(examId);
      setPrintCustomExam(detail);
      setShowPrintModal(true);
    } catch (err) {
      alert('Sınav detayları alınamadı.');
    }
  };

  const handleOpenPreview = async (examId) => {
    setLoadingPreview(true);
    try {
      const detail = await examService.getDetail(examId);
      setPreviewExam(detail);
    } catch (err) {
      alert('Soru detayları alınamadı.');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleBroadcastReminder = async (exam) => {
    const msg = prompt(`'${exam.title}' sınavı için öğrencilere gönderilecek hatırlatma mesajını giriniz:`, `Sevgili öğrenciler, '${exam.title}' testini lütfen belirtilen sürede tamamlayınız.`);
    if (!msg) return;

    try {
      await notificationService.send({
        classroom_id: exam.classroom_id,
        title: `Sınav Hatırlatması: ${exam.title}`,
        message: msg,
        notification_type: 'exam_assigned',
        link_path: `/exams/${exam.id}`
      });
      alert('Hatırlatma bildirimi sınıftaki öğrencilere iletildi!');
    } catch (err) {
      alert('Bildirim gönderilemedi.');
    }
  };

  // Question Bank Helpers
  const handleToggleSelect = (id) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestionIds.length === bankQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(bankQuestions.map(q => q.id));
    }
  };

  const handleRandomSelect = (count) => {
    if (bankQuestions.length === 0) return;
    const shuffled = [...bankQuestions].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, count).map(q => q.id);
    setSelectedQuestionIds(picked);
  };

  const handleDeleteFromBank = async (id) => {
    if (!window.confirm('Bu soruyu soru bankasından silmek istediğinize emin misiniz?')) return;
    try {
      await examService.deleteFromBank(id);
      setBankQuestions(prev => prev.filter(q => q.id !== id));
      setSelectedQuestionIds(prev => prev.filter(x => x !== id));
      setTotalBankQuestions(prev => Math.max(0, prev - 1));
    } catch (err) {
      alert('Soru silinemedi.');
    }
  };

  const handleBulkDeleteFromBank = async () => {
    if (selectedQuestionIds.length === 0) return;
    if (!window.confirm(`Seçili ${selectedQuestionIds.length} soruyu soru bankasından kalıcı olarak silmek istediğinize emin misiniz?`)) return;
    try {
      await examService.bulkDeleteFromBank(selectedQuestionIds);
      setBankQuestions(prev => prev.filter(q => !selectedQuestionIds.includes(q.id)));
      setTotalBankQuestions(prev => Math.max(0, prev - selectedQuestionIds.length));
      setSelectedQuestionIds([]);
      alert('Seçilen sorular silindi.');
    } catch (err) {
      alert('Toplu silme başarısız oldu.');
    }
  };

  const handleOpenAssignModal = () => {
    if (selectedQuestionIds.length === 0) {
      alert('Lütfen sınava dönüştürmek için en az 1 soru seçiniz.');
      return;
    }
    const sample = bankQuestions.find(q => q.id === selectedQuestionIds[0]);
    setAssignTitle(`${sample?.subject || 'Genel'} Kazanım Değerlendirme Testi`);
    setAssignDuration(Math.max(20, selectedQuestionIds.length * 2));
    setShowAssignFromBankModal(true);
  };

  const handleExecuteAssignFromBank = async (e) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    setAssigningExam(true);
    try {
      const sample = bankQuestions.find(q => q.id === selectedQuestionIds[0]);
      await examService.createExamFromBank({
        title: assignTitle.trim(),
        classroom_id: assignClassId ? parseInt(assignClassId, 10) : null,
        exam_type: sample?.exam_type || 'TYT',
        subject: sample?.subject || 'Genel',
        duration_minutes: parseInt(assignDuration, 10) || 40,
        question_ids: selectedQuestionIds
      });
      setShowAssignFromBankModal(false);
      setSelectedQuestionIds([]);
      alert('Soru bankasından sınav başarıyla oluşturuldu ve sınıfa atandı!');
      fetchExams();
      setActiveView('exams');
    } catch (err) {
      alert(err.response?.data?.detail || 'Sınav oluşturulamadı.');
    } finally {
      setAssigningExam(false);
    }
  };

  // Questions to print
  const questionsToPrint = selectedQuestionIds.length > 0
    ? bankQuestions.filter(q => selectedQuestionIds.includes(q.id))
    : bankQuestions;

  // Toplam istatistikler
  const totalExams = exams.length;
  const totalSubmissions = exams.reduce((acc, e) => acc + (e.submission_count || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-zinc-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>Yapay Zeka Destekli YKS Sınav ve Test Merkezi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              YKS TYT & AYT Test Yönetimi & Soru Bankası
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Piri Reis MTAL öğretmen paneli: Yapay zekanın ürettiği tüm sorular veritabanında saklanır; dilediğiniz zaman kağıt üzerine 2 sütunlu sınav çıktısı alabilir veya sınıflarınıza online test atayabilirsiniz.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowGeneratorModal(true)}
              className="px-5 py-3 rounded-2xl bg-white hover:bg-zinc-100 text-indigo-950 font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
              <span>Yapay Zeka ile Soru Üret</span>
            </button>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div>
            <span className="text-[11px] text-indigo-200/70 block">Oluşturulan YKS Testleri</span>
            <span className="text-xl sm:text-2xl font-black text-white">{totalExams}</span>
          </div>
          <div>
            <span className="text-[11px] text-indigo-200/70 block">Tamamlanan Sınavlar</span>
            <span className="text-xl sm:text-2xl font-black text-white">{totalSubmissions}</span>
          </div>
          <div>
            <span className="text-[11px] text-indigo-200/70 block">Soru Bankasındaki Soru</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{totalBankQuestions}</span>
          </div>
          <div>
            <span className="text-[11px] text-indigo-200/70 block">Kağıt Baskı Şablonu</span>
            <span className="text-xl sm:text-2xl font-black text-indigo-300">ÖSYM / A4</span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveView('exams')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeView === 'exams'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Aktif Sınavlar & Sınıf Sonuçları ({exams.length})</span>
        </button>

        <button
          onClick={() => setActiveView('bank')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeView === 'bank'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>📚 Soru Bankası & Kağıt Baskı (Yazdır)</span>
          {totalBankQuestions > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[10px] font-mono">
              {totalBankQuestions}
            </span>
          )}
        </button>
      </div>

      {/* ================= VIEW 1: EXAMS ================= */}
      {activeView === 'exams' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Sınıfa Göre Filtrele:</span>
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1.5 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Tüm Sınıflar</option>
                {classrooms.map((cls) => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            <span className="text-xs text-zinc-400 font-medium">
              Toplam {exams.length} sınav listeleniyor
            </span>
          </div>

          {/* Exams Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span className="text-xs text-zinc-400">YKS testleri yükleniyor...</span>
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Henüz YKS Testi Oluşturulmadı
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                Yukarıdaki "Yapay Zeka ile Soru Üret" butonuna basarak güncel müfredata uygun test hazırlayabilir veya Soru Bankası sekmesinden seçim yapabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        exam.exam_type === 'TYT'
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                          : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                      }`}>
                        {exam.exam_type}
                      </span>

                      <span className="text-[11px] font-semibold text-zinc-400">
                        {exam.classroom_name || 'Tüm Sınıflar'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {exam.title}
                    </h3>

                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {exam.subject} • {exam.topic}
                    </p>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-100 dark:border-zinc-800/80 text-center">
                    <div className="p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
                      <span className="text-[10px] text-zinc-400 block">Soru</span>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{exam.question_count}</span>
                    </div>
                    <div className="p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
                      <span className="text-[10px] text-zinc-400 block">Süre</span>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {exam.duration_minutes ? `${exam.duration_minutes} dk` : 'Süresiz'}
                      </span>
                    </div>
                    <div className="p-1.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40">
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block">Katılım</span>
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{exam.submission_count}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={() => setAnalyticsExamId(exam.id)}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Sınav Analiz Raporunu İncele</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenPreview(exam.id)}
                        className="flex-1 py-1.5 px-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1 transition"
                      >
                        <Eye className="w-3 h-3 text-zinc-400" />
                        <span>Sorular</span>
                      </button>

                      <button
                        onClick={() => handlePrintExam(exam.id)}
                        title="Bu Sınavı Kağıda Yazdır"
                        className="py-1.5 px-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300 flex items-center justify-center gap-1 transition"
                      >
                        <Printer className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>Yazdır</span>
                      </button>

                      <button
                        onClick={() => handleBroadcastReminder(exam)}
                        title="Öğrencilere Hatırlatma Bildirimi Yolla"
                        className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteExam(exam.id, exam.title)}
                        title="Sınavı Sil"
                        className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= VIEW 2: QUESTION BANK & PRINT ================= */}
      {activeView === 'bank' && (
        <div className="space-y-6">
          
          {/* Question Bank Filters */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Exam Type Filter */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Sınav Türü:
                </label>
                <select
                  value={filterBankExamType}
                  onChange={(e) => setFilterBankExamType(e.target.value)}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Tümü">Tüm Sınavlar (TYT & AYT)</option>
                  <option value="TYT">TYT</option>
                  <option value="AYT">AYT</option>
                </select>
              </div>

              {/* Subject / Branch Filter */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Branş / Ders Seçimi:
                </label>
                <select
                  value={filterBankSubject}
                  onChange={(e) => setFilterBankSubject(e.target.value)}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Tümü">Tüm Branşlar</option>
                  {bankSubjects.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Zorluk Derecesi:
                </label>
                <select
                  value={filterBankDifficulty}
                  onChange={(e) => setFilterBankDifficulty(e.target.value)}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Tümü">Tüm Seviyeler</option>
                  <option value="Temel Kavrama (Kolay)">Temel Kavrama (Kolay)</option>
                  <option value="Pekiştirme (Orta)">Pekiştirme (Orta)</option>
                  <option value="ÖSYM / Yeni Nesil">ÖSYM / Yeni Nesil</option>
                  <option value="Derece Hedefli (Zor)">Derece Hedefli (Zor)</option>
                </select>
              </div>

              {/* Search Box */}
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Soru veya Konu Ara:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={bankSearchQuery}
                    onChange={(e) => setBankSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchBankQuestions()}
                    placeholder="Soru metni, formül, konu..."
                    className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 pl-8 pr-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

            </div>

            {/* Selection Toolbar & Print Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              
              {/* Quick Selection Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1"
                >
                  {selectedQuestionIds.length === bankQuestions.length && bankQuestions.length > 0 ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Seçimi Kaldır</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Tümünü Seç</span>
                    </>
                  )}
                </button>

                <span className="text-zinc-300 dark:text-zinc-700">|</span>

                <span className="text-[11px] text-zinc-400 font-medium mr-1">Rastgele Seç:</span>
                {[5, 10, 20, 40].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleRandomSelect(num)}
                    className="px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-[11px] font-bold text-zinc-600 dark:text-zinc-300 transition"
                  >
                    {num} Soru
                  </button>
                ))}

                <button
                  type="button"
                  onClick={fetchBankQuestions}
                  title="Yenile"
                  className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mr-1">
                  {selectedQuestionIds.length} / {bankQuestions.length} Seçildi
                </span>

                {selectedQuestionIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleBulkDeleteFromBank}
                    className="px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold text-xs flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sil</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleOpenAssignModal}
                  disabled={selectedQuestionIds.length === 0}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold text-xs disabled:opacity-40 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Online Sınav Yap</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  disabled={bankQuestions.length === 0}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>🖨️ Kağıda Yazdır ({selectedQuestionIds.length > 0 ? selectedQuestionIds.length : bankQuestions.length})</span>
                </button>
              </div>

            </div>
          </div>

          {/* Question Bank Cards */}
          {loadingBank ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span className="text-xs text-zinc-400">Soru bankası taranıyor...</span>
            </div>
          ) : bankQuestions.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Seçilen Kriterlere Uygun Soru Bulunamadı
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                Filtreleri temizleyebilir veya "Yapay Zeka ile Soru Üret" butonuna basarak yeni sorular üretip bankaya ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bankQuestions.map((q, idx) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleSelect(q.id)}
                    className={`p-5 rounded-3xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-300 dark:border-zinc-700'
                        }`}>
                          {isSelected && <CheckSquare className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100">
                          #{idx + 1}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          q.exam_type === 'TYT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {q.exam_type}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {q.subject}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          {q.topic}
                        </span>
                      </div>

                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Doğru: {q.correct_option}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFromBank(q.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Soru Bankasından Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans bg-zinc-50 dark:bg-zinc-850/40 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 mb-3">
                      <MathRenderer text={q.question_text} />
                    </div>

                    {/* Visual SVG if exists */}
                    {q.visual_svg && (
                      <div className="my-2 p-3 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-center overflow-x-auto">
                        <div className="max-w-xs w-full" dangerouslySetInnerHTML={{ __html: q.visual_svg }} />
                      </div>
                    )}

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                      {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                        const optText = q[`option_${opt.toLowerCase()}`];
                        const isCorrect = opt === q.correct_option;
                        return (
                          <div
                            key={opt}
                            className={`p-2 rounded-xl border flex items-start gap-1.5 ${
                              isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 font-semibold text-emerald-900 dark:text-emerald-200'
                                : 'bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                            }`}>
                              {opt}
                            </span>
                            <div className="min-w-0">
                              <MathRenderer text={optText || ''} />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {q.explanation && (
                      <div className="mt-3 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                          Çözüm Yolu:
                        </span>
                        <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed pl-4">
                          <MathRenderer text={q.explanation} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Generator Modal */}
      <YksExamGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => {
          setShowGeneratorModal(false);
          fetchBankQuestions();
          fetchExams();
        }}
        onCreated={() => {
          fetchExams();
          fetchBankQuestions();
        }}
      />

      {/* Analytics Modal */}
      {analyticsExamId && (
        <ExamAnalyticsModal
          examId={analyticsExamId}
          onClose={() => setAnalyticsExamId(null)}
        />
      )}

      {/* Printable Exam Modal */}
      {showPrintModal && (
        <PrintableExamModal
          questions={printCustomExam ? (printCustomExam.questions || []) : questionsToPrint}
          defaultSubject={printCustomExam ? (printCustomExam.subject || 'Genel') : (filterBankSubject !== 'Tümü' ? filterBankSubject : (questionsToPrint[0]?.subject || 'Matematik'))}
          defaultTitle={printCustomExam ? printCustomExam.title : `${filterBankSubject !== 'Tümü' ? filterBankSubject : 'YKS'} Deneme Sınavı`}
          onClose={() => {
            setShowPrintModal(false);
            setPrintCustomExam(null);
          }}
        />
      )}

      {/* Assign Exam From Bank Modal */}
      {showAssignFromBankModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-100">
                Soru Bankasından Online Sınav Atama
              </h3>
              <button
                onClick={() => setShowAssignFromBankModal(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteAssignFromBank} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Sınav Başlığı:
                </label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Hedef Sınıf:
                </label>
                <select
                  value={assignClassId}
                  onChange={(e) => setAssignClassId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Tüm Sınıflar (Genel)</option>
                  {classrooms.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-600 dark:text-zinc-400 mb-1">
                  Sınav Süresi (Dakika):
                </label>
                <input
                  type="number"
                  min="5"
                  max="240"
                  value={assignDuration}
                  onChange={(e) => setAssignDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                Seçilen <strong>{selectedQuestionIds.length} adet</strong> soru bu sınava eklenecek ve sınıf öğrencilerine bildirim gidecektir.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignFromBankModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={assigningExam}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold disabled:opacity-50"
                >
                  {assigningExam ? 'Oluşturuluyor...' : 'Sınavı Başlat & Ata'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Exam Questions Modal */}
      {previewExam && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {previewExam.title} — Sorular & Çözümler
                </h3>
                <span className="text-xs text-zinc-400">Toplam {previewExam.questions?.length} soru</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setPrintCustomExam(previewExam);
                    setShowPrintModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Kağıda Yazdır</span>
                </button>
                <button
                  onClick={() => setPreviewExam(null)}
                  className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {previewExam.questions?.map((q) => (
                <div key={q.id} className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Soru {q.question_number}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Doğru Şık: {q.correct_option}
                    </span>
                  </div>

                  <MathRenderer text={q.question_text} className="text-xs sm:text-sm font-medium" />

                  {q.visual_svg && (
                    <div className="my-2 flex justify-center" dangerouslySetInnerHTML={{ __html: q.visual_svg }} />
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    {['A', 'B', 'C', 'D', 'E'].map((opt) => (
                      <div
                        key={opt}
                        className={`p-2 rounded-lg border flex items-start gap-2 ${
                          q.correct_option === opt
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 font-semibold text-emerald-900 dark:text-emerald-200'
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700'
                        }`}
                      >
                        <span className="font-bold">{opt}:</span>
                        <MathRenderer text={q[`option_${opt.toLowerCase()}`]} />
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/30 text-xs text-indigo-900 dark:text-indigo-200">
                      <strong>Çözüm:</strong> <MathRenderer text={q.explanation} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
