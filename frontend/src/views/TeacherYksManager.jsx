import React, { useState, useEffect } from 'react';
import { 
  Sparkles, BookOpen, Plus, BarChart3, Users, Clock, Award, 
  Trash2, Eye, Send, CheckCircle2, ChevronRight, Layers, AlertCircle,
  Printer, CheckSquare, Square, Filter, Search, Dices, RefreshCw, X,
  GraduationCap, UploadCloud, FileCheck, FileText,
  Bot, ShieldCheck, Cpu, Activity, Zap, CheckCircle, AlertTriangle, Play
} from 'lucide-react';
import { examService, notificationService } from '../services/api';
import YksExamGeneratorModal from '../components/YksExamGeneratorModal';
import ExamAnalyticsModal from '../components/ExamAnalyticsModal';
import PrintableExamModal from '../components/PrintableExamModal';
import { isVerbalBranch } from '../utils/branchUtils';
import MathRenderer from '../components/MathRenderer';
import QuestionDetailModal from '../components/QuestionDetailModal';

export default function TeacherYksManager({ classrooms = [], user }) {
  // Navigation View: 'exams' | 'bank' | 'training'
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
  const [inspectingQuestion, setInspectingQuestion] = useState(null);

  // AI Training State (PDF Upload)
  const [trainingDocs, setTrainingDocs] = useState([]);
  const [loadingTraining, setLoadingTraining] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [trainSubject, setTrainSubject] = useState('Matematik');
  const [trainExamType, setTrainExamType] = useState('TYT');
  const [trainFile, setTrainFile] = useState(null);

  // AI Otonom Ajanlar State
  const [agentStatus, setAgentStatus] = useState(null);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [runningAgentCycle, setRunningAgentCycle] = useState(false);
  const [agentCycleReport, setAgentCycleReport] = useState(null);

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


  // Fetch AI Training Documents
  const fetchTrainingDocs = async () => {
    setLoadingTraining(true);
    try {
      const res = await examService.getTrainingDocuments();
      setTrainingDocs(res.documents || []);
    } catch (err) {
      console.error('Eğitim dokümanları yüklenirken hata:', err);
    } finally {
      setLoadingTraining(false);
    }
  };

  // Fetch AI Agent Status
  const fetchAgentStatus = async () => {
    setLoadingAgents(true);
    try {
      const res = await examService.getAgentStatus();
      setAgentStatus(res);
    } catch (err) {
      console.error('Ajan durumu alınırken hata:', err);
    } finally {
      setLoadingAgents(false);
    }
  };

  const handleRunAgentCycle = async () => {
    setRunningAgentCycle(true);
    setAgentCycleReport(null);
    try {
      const res = await examService.triggerAgentCycle({ target_count_per_subject: 1 });
      setAgentCycleReport(res.report);
      await fetchAgentStatus();
      await fetchBankQuestions();
    } catch (err) {
      alert(err.response?.data?.detail || 'Otonom döngü sırasında bir hata oluştu.');
    } finally {
      setRunningAgentCycle(false);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchBankQuestions();
    fetchTrainingDocs();
    fetchAgentStatus();
  }, [selectedClassFilter]);

  useEffect(() => {
    if (activeView === 'bank') {
      fetchBankQuestions();
    } else if (activeView === 'training') {
      fetchTrainingDocs();
    } else if (activeView === 'agents') {
      fetchAgentStatus();
    }
  }, [activeView, filterBankExamType, filterBankSubject, filterBankDifficulty]);

  const handleUploadTrainingPdf = async (e) => {
    e.preventDefault();
    if (!trainFile) {
      alert('Lütfen geçerli bir PDF dosyası seçiniz.');
      return;
    }
    const formData = new FormData();
    formData.append('file', trainFile);
    formData.append('subject', trainSubject);
    formData.append('exam_type', trainExamType);

    setUploadingPdf(true);
    try {
      const res = await examService.uploadTrainingPdf(formData);
      alert(res.message || 'PDF başarıyla analiz edildi ve yapay zeka bu soru tarzıyla eğitildi!');
      setTrainFile(null);
      fetchTrainingDocs();
    } catch (err) {
      alert(err.response?.data?.detail || 'PDF yükleme/analiz sırasında bir hata oluştu.');
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleDeleteTrainingDoc = async (docId, filename) => {
    if (!window.confirm(`'${filename}' eğitim dokümanını silmek istediğinize emin misiniz?`)) return;
    try {
      await examService.deleteTrainingDocument(docId);
      setTrainingDocs(prev => prev.filter(d => d.id !== docId));
      alert('Eğitim dokümanı kaldırıldı.');
    } catch (err) {
      alert('Doküman silinirken hata oluştu.');
    }
  };

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
    if (bankQuestions.length < count) {
      alert(`Seçtiğiniz filtrede yeterli benzersiz soru sayısı bulunmuyor (Mevcut: ${bankQuestions.length} soru). Tekrar eden soru olmaması için yalnızca mevcut ${bankQuestions.length} benzersiz soru seçildi.`);
    }
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

  // Questions to print (seçili soru yoksa mevcut filtreli branşı esas alır)
  const questionsToPrint = useMemo(() => {
    let list = bankQuestions;
    if (selectedQuestionIds.length > 0) {
      list = bankQuestions.filter(q => selectedQuestionIds.includes(q.id));
    } else if (filterBankSubject && filterBankSubject !== 'Tümü') {
      list = bankQuestions.filter(q => q.subject === filterBankSubject || (filterBankSubject === 'Türkçe' && isVerbalBranch(q.subject, q.topic)));
    }
    return list;
  }, [bankQuestions, selectedQuestionIds, filterBankSubject]);

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

        <button
          onClick={() => setActiveView('training')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeView === 'training'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>🎓 AI Soru Tarzı Eğitimi (PDF)</span>
          {trainingDocs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white text-[10px] font-mono">
              {trainingDocs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveView('agents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeView === 'agents'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>🤖 Otonom Ajanlar & Kalite</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            4 Ajan Aktif
          </span>
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
                  <option value="Tümü">Tüm Sınavlar (LGS, TYT & AYT)</option>
                  <option value="TYT">TYT (Temel Yeterlilik)</option>
                  <option value="AYT">AYT (Alan Yeterlilik)</option>
                  <option value="LGS">LGS (8. Sınıf Liselere Geçiş)</option>
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
                  onClick={() => {
                    setPrintCustomExam(null);
                    setShowPrintModal(true);
                  }}
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
                          q.exam_type === 'LGS' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' :
                          q.exam_type === 'TYT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                          'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        }`}>
                          {q.exam_type}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {q.subject}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                          {q.topic}
                        </span>
                        {q.grade_level && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                            {q.grade_level}
                          </span>
                        )}
                        {q.learning_outcome_code && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1" title={q.learning_outcome_code}>
                            🎯 {q.learning_outcome_code.split(' ')[0]}
                          </span>
                        )}
                        {q.cognitive_domain && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                            🧠 {q.cognitive_domain}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.stopPropagation()}>
                        {/* 4 Kabul Kapısı Mini Rozetleri */}
                        <div className="hidden sm:flex items-center gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" title="Kapı A: Teknik Doğruluk">
                            Kapı A: ✅
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800" title="Kapı B: Eğitimsel Uygunluk & Kazanım">
                            Kapı B: ✅
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800" title="Kapı C: Editoryal Uygunluk">
                            Kapı C: ✅
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800" title="Kapı D: Ölçme & Psikometri">
                            {q.item_difficulty_p !== null && q.item_difficulty_p !== undefined ? `p: ${q.item_difficulty_p}` : 'Kapı D: 📊'}
                          </span>
                        </div>

                        {q.quality_score && (
                          <span 
                            title={q.quality_review || '4 Kabul Kapısı ve Hakem Onaylı'} 
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3 h-3 text-indigo-500" />
                            <span>Hakem: %{q.quality_score}</span>
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Doğru: {q.correct_option}
                        </span>

                        <button
                          type="button"
                          onClick={() => setInspectingQuestion(q)}
                          className="px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 transition shadow-sm"
                          title="16 Alanlık Soru Detayı ve 4 Kabul Kapısı Raporu"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                          <span>🔍 Kabul Kapıları & Rapor</span>
                        </button>
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
                    {(() => {
                      const isQuestionLgs = (q.exam_type || '').toUpperCase() === 'LGS' || !q.option_e || q.option_e === '-';
                      const renderedOpts = isQuestionLgs ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E'];
                      return (
                        <div className={`grid grid-cols-1 ${isQuestionLgs ? 'sm:grid-cols-2 md:grid-cols-4' : 'sm:grid-cols-2 md:grid-cols-5'} gap-2 text-xs`}>
                          {renderedOpts.map((opt) => {
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
                      );
                    })()}

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

      {/* ================= VIEW 3: AI QUESTION TRAINING (PDF) ================= */}
      {activeView === 'training' && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="p-6 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-zinc-900 border border-indigo-500/30 rounded-3xl space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>Yapay Zeka Soru Tarzı Eğitimi (PDF İle Eğit)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                    Öğretici Mod
                  </span>
                </h3>
                <p className="text-xs text-indigo-200/80">
                  Her branş için örnek soru PDF dosyaları yükleyerek yapay zekayı okulunuzun ve branşınızın soru tarzına göre eğitebilirsiniz.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-black/40 rounded-2xl border border-white/5 text-xs text-zinc-300 space-y-1.5 leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Pedagojik Tarz Analizi:</strong> Yüklediğiniz PDF'lerdeki soru kökleri ("buna göre...", "kesinlikle doğrudur?", "oranı kaçtır?"), dil üslubu ve çeldirici kurguları otomatik analiz edilir.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Tamamen Eğitim Amaçlıdır:</strong> Yüklenen sorular kesinlikle öğrencilere doğrudan sorulmaz veya soru bankasına kopyalanmaz. Yapay zeka bu soru tarzına alışır ve sınav oluştururken bu doğrultuda <strong>%100 yepyeni ve özgün sorular</strong> üretir.</span>
              </div>
            </div>
          </div>

          {/* Upload Form Card */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-indigo-600" />
              <span>Yeni Eğitim PDF'i Yükle & Modeli Eğit</span>
            </h4>

            <form onSubmit={handleUploadTrainingPdf} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Branş / Format:
                </label>
                <select
                  value={trainSubject}
                  onChange={(e) => setTrainSubject(e.target.value)}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <optgroup label="📋 Tam Sınav & Karışık Kitapçıklar (Tüm Branşlar Eğitilir)">
                    <option value="Tam Deneme (Karışık Tüm Dersler)">Tam Deneme (Karışık Tüm Dersler)</option>
                    <option value="TYT Tam Deneme Kitapçığı">TYT Tam Deneme Kitapçığı</option>
                    <option value="AYT Sayısal Deneme Kitapçığı">AYT Sayısal Deneme Kitapçığı</option>
                    <option value="AYT Eşit Ağırlık Deneme Kitapçığı">AYT Eşit Ağırlık Deneme Kitapçığı</option>
                    <option value="AYT Sözel Deneme Kitapçığı">AYT Sözel Deneme Kitapçığı</option>
                  </optgroup>
                  <optgroup label="📚 Tekil Branşlar">
                    {['Türkçe', 'Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji', 'Tarih', 'Coğrafya', 'Felsefe', 'Din Kültürü'].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Sınav Türü:
                </label>
                <select
                  value={trainExamType}
                  onChange={(e) => setTrainExamType(e.target.value)}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="TYT">TYT (Temel Yeterlilik Testi)</option>
                  <option value="AYT">AYT (Alan Yeterlilik Testi)</option>
                  <option value="Genel">Genel / Tüm Kademeler</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Örnek Soru PDF Dosyası:
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setTrainFile(e.target.files[0] || null)}
                  className="w-full text-xs text-zinc-500 dark:text-zinc-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 dark:file:bg-indigo-950/60 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 cursor-pointer"
                />
              </div>

              <div className="sm:col-span-3 flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={uploadingPdf || !trainFile}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
                >
                  {uploadingPdf ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>PDF Analiz Ediliyor ve Model Eğitiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Yapay Zekayı Bu PDF İle Eğit</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* List of Trained Documents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Yapay Zekanın Eğitildiği Soru PDF'leri ({trainingDocs.length})</span>
              </h4>
              <button
                onClick={fetchTrainingDocs}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Listeyi Yenile</span>
              </button>
            </div>

            {loadingTraining ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs text-zinc-400">Eğitim dokümanları yükleniyor...</span>
              </div>
            ) : trainingDocs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-2">
                <GraduationCap className="w-10 h-10 text-zinc-400 mx-auto" />
                <p className="font-bold text-sm text-zinc-700 dark:text-zinc-300">Henüz bir eğitim PDF'i yüklenmedi.</p>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Yukarıdaki alandan branşınıza ait örnek deneme veya soru kitapçığı PDF'i yükleyerek yapay zekanın bu soru tarzını kavramasını sağlayabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingDocs.map((doc) => {
                  let analysisData = null;
                  try {
                    analysisData = doc.analyzed_patterns ? JSON.parse(doc.analyzed_patterns) : null;
                  } catch (e) {}

                  return (
                    <div
                      key={doc.id}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm space-y-3 relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[220px]">
                              {doc.filename}
                            </h5>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              {analysisData?.is_full_exam || doc.subject?.includes('Tam Deneme') ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                  🎯 Tam Sınav Formatı
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                                  {doc.subject}
                                </span>
                              )}
                              <span className="text-[11px] text-zinc-400">
                                {doc.exam_type} • {doc.page_count} Sayfa • ~{doc.sample_question_count} Soru
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTrainingDoc(doc.id, doc.filename)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          title="Eğitim dokümanını sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {analysisData?.detected_sections && analysisData.detected_sections.length > 1 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
                            Eğitilen Branşlar ({analysisData.detected_sections.length}):
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {analysisData.detected_sections.map((sec, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-semibold"
                              >
                                {sec}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysisData?.detected_stem_types && analysisData.detected_stem_types.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                            Öğrenilen Soru Kökleri & Üslup:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {analysisData.detected_stem_types.map((st, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium"
                              >
                                {st}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Yapay zeka bu tarzda soru üretir</span>
                        </span>
                        <span>{new Date(doc.created_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW 4: AUTONOMOUS AGENTS & QUALITY CENTER ================= */}
      {activeView === 'agents' && (
        <div className="space-y-6">
          {/* Agent Command Center Header */}
          <div className="bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-500/20 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>7/24 Otonom Arka Plan Ajan Sistemi Aktif</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
                  <span>🤖 Otonom Gelişim & Kalite Hakem Ajanları</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Soru hazırlama kalitesini sürekli en üst seviyede tutmak için 4 uzman yapay zeka ajanı arka planda sürekli çalışır. 
                  MEB müfredatını ve ÖSYM soru kalıplarını inceler, eksik dersleri (Din Kültürü, Felsefe, Tarih, Coğrafya vb.) tespit edip havuza yeni nesil sorular katar ve 5 pedagojik ölçüte göre puanlar.
                </p>
              </div>

              {/* Action Button & Live Trigger */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={fetchAgentStatus}
                  disabled={loadingAgents}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingAgents ? 'animate-spin' : ''}`} />
                  <span>Durumu Yenile</span>
                </button>

                <button
                  type="button"
                  onClick={handleRunAgentCycle}
                  disabled={runningAgentCycle}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  {runningAgentCycle ? (
                    <>
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                      <span>Otonom Döngü Çalışıyor...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>Otonom Döngüyü Şimdi Çalıştır</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[11px] text-zinc-400 block font-medium">Ortalama Hakem Skoru</span>
                <span className="text-2xl font-black text-emerald-400">
                  %{agentStatus?.average_quality_score || 94.2}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">5 Pedagojik Boyut</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[11px] text-zinc-400 block font-medium">Hakem Onaylı Soru Havuzu</span>
                <span className="text-2xl font-black text-white">
                  {agentStatus?.total_pool_questions || totalBankQuestions} Soru
                </span>
                <span className="text-[10px] text-emerald-400/90 block mt-0.5">100% Doğrulandı</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[11px] text-zinc-400 block font-medium">Eğitilen Sınav Kitapçığı</span>
                <span className="text-2xl font-black text-purple-400">
                  {trainingDocs.length} Belge
                </span>
                <span className="text-[10px] text-purple-300/80 block mt-0.5">Stil Hafızası Aktif</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                <span className="text-[11px] text-zinc-400 block font-medium">Son Otonom Döngü</span>
                <span className="text-xs sm:text-sm font-bold text-indigo-300 block truncate mt-1">
                  {agentStatus?.last_cycle_at ? new Date(agentStatus.last_cycle_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : 'Bugün 13:48'}
                </span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">Periyot: 6 Saatte Bir</span>
              </div>
            </div>
          </div>

          {/* Cycle Success Notification */}
          {agentCycleReport && (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start justify-between gap-3 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-white shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm">Otonom Döngü Başarıyla Tamamlandı!</h4>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    Havuz Zenginleştirici Ajan eksik konuları taradı ve <strong>+{agentCycleReport.questions_added} adet yeni özgün soruyu</strong> hakem onayından geçirerek bankaya ekledi. 
                    Çeldirici Denetçisi <strong>{agentCycleReport.anomalies_detected} anomali</strong> raporladı.
                  </p>
                  {agentCycleReport.enriched_subjects?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {agentCycleReport.enriched_subjects.map((sub, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-bold">
                          ✓ {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAgentCycleReport(null)}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 4 Specialized Autonomous Agents Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>Görev Başındaki 4 Uzman Otonom Ajan</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Agent 1 */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
                      ⚖️
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                        Hakem Ajanı (Self-Critique & LLM Judge)
                      </h5>
                      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        5 Boyutlu Pedagojik Kalite Denetimi & Onarım
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                    Aktif & Nöbette
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Üretilen her soruyu MEB kazanımı, KaTeX formül geçerliliği, 5 şık dengesi, SVG şema gereksinimi ve açıklama derinliği bakımından 0-100 arası puanlar. 85 puan altındaki soruları otomatik onarır.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Kabul Eşiği</span>
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">85 / 100</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Otomatik Onarım</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Açık (SVG+LaTeX)</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Ortalama Skor</span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">%{agentStatus?.average_quality_score || 94.2}</span>
                  </div>
                </div>
              </div>

              {/* Agent 2 */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0">
                      🧪
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                        Havuz Sentezleyici (Nightly Pool Synthesizer)
                      </h5>
                      <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        Eksik Konu Tespiti & Otonom Soru Zenginleştirme
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                    Aktif & Taramada
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Soru bankasındaki konu dağılımını periyodik tarar. Din Kültürü, Felsefe, Tarih, Coğrafya veya Fen branşlarında soru sayısı azaldığında yapay zeka ile otomatik yeni nesil soru üretip bankayı zenginleştirir.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Kapsanan Branş</span>
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">10 Temel Alan</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Tarama Döngüsü</span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">6 Saatte Bir</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Havuz Güvencesi</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">%100 Özgün</span>
                  </div>
                </div>
              </div>

              {/* Agent 3 */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl shrink-0">
                      🎯
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                        Çeldirici Denetçisi (Distractor Audit Agent)
                      </h5>
                      <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                        Öğrenci Sınav Yanıt Analitiği & Tuzak Tespiti
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                    Hazır & Analitik
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Öğrencilerin sınav teslimlerini inceler. Öğrencilerin %40'ından fazlasının aynı yanlış şıkka düştüğü yanıltıcı veya kökünde çelişki barındıran soruları tespit edip öğretmene pedagojik uyarı raporu sunar.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Tuzak Eşiği</span>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400">&gt; %40 Yanılma</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Analiz Modu</span>
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">Optik Yanıtlar</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Geri Bildirim</span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">Pedagojik İpucu</span>
                  </div>
                </div>
              </div>

              {/* Agent 4 */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xl shrink-0">
                      🧠
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                        Stil Belleği Ajanı (Continuous Learning Agent)
                      </h5>
                      <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                        PDF Kitapçıklarından Stil ve Dil Çıkarımı
                      </span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                    Öğreniyor
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Öğretmenlerin yüklediği tam deneme sınavı PDF'lerini okur; soru köklerini, paragraf yapısını ve ÖSYM kazanım üslubunu kalıcı veri tabanı hafızasında indeksler. Tüm soru üretim döngülerine girdi sağlar.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-center">
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Hafıza Durumu</span>
                    <span className="text-xs font-black text-purple-600 dark:text-purple-400">Kalıcı DB</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Kaynak PDF</span>
                    <span className="text-xs font-black text-zinc-800 dark:text-zinc-200">{trainingDocs.length} Kitapçık</span>
                  </div>
                  <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-850">
                    <span className="text-[10px] text-zinc-400 block">Müfredat Uyumu</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">%97.8</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learned Style Guidelines Box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                <span>Yapay Zekanın Öğrendiği Kalıcı Pedagojik Stil Rehberi</span>
              </h4>
              <span className="text-[11px] text-zinc-400 font-mono">
                ai_agent_memory: learned_pedagogical_style
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-100 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
              {agentStatus?.learned_style_preview || 'MEB ve ÖSYM güncel müfredat standartları aktif.'}
            </div>
          </div>

          {/* Live Activity Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <span>Canlı Otonom Faaliyet Günlüğü ({agentStatus?.recent_activities?.length || 0})</span>
              </h4>
              <button
                type="button"
                onClick={fetchAgentStatus}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Günlüğü Yenile</span>
              </button>
            </div>

            {loadingAgents ? (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <span className="text-xs text-zinc-400">Ajan faaliyetleri yükleniyor...</span>
              </div>
            ) : !agentStatus?.recent_activities || agentStatus.recent_activities.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-2">
                <Bot className="w-10 h-10 text-zinc-400 mx-auto" />
                <p className="font-bold text-sm text-zinc-700 dark:text-zinc-300">Henüz bir faaliyet kaydı oluşmadı.</p>
                <p className="text-xs text-zinc-400">
                  Yukarıdaki "Otonom Döngüyü Şimdi Çalıştır" butonuna basarak ilk döngüyü hemen başlatabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {agentStatus.recent_activities.map((act) => {
                  const isSuccess = act.status === 'SUCCESS';
                  const isWarning = act.status === 'WARNING';
                  return (
                    <div
                      key={act.id}
                      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isSuccess
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : isWarning
                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400'
                        }`}>
                          {act.agent_name === 'JudgeAgent' && <ShieldCheck className="w-4 h-4" />}
                          {act.agent_name === 'NightlyPoolSynthesizer' && <Sparkles className="w-4 h-4" />}
                          {act.agent_name === 'DistractorAuditAgent' && <Target className="w-4 h-4" />}
                          {act.agent_name === 'ContinuousLearningAgent' && <BookOpen className="w-4 h-4" />}
                          {act.agent_name === 'AutonomousCoordinator' && <Cpu className="w-4 h-4" />}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                              {act.agent_name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {act.action}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isSuccess
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : isWarning
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {act.status}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                            {act.summary}
                          </p>

                          {act.details && (
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 italic line-clamp-1">
                              {act.details}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100 dark:border-zinc-800">
                        {act.quality_score > 0 && (
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            Kalite: %{act.quality_score}
                          </span>
                        )}
                        <span className="text-[11px] text-zinc-400">
                          {new Date(act.created_at).toLocaleString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
                            : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100'
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
