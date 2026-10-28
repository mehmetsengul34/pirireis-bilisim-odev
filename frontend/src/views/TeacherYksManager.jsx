import React, { useState, useEffect } from 'react';
import { 
  Sparkles, BookOpen, Plus, BarChart3, Users, Clock, Award, 
  Trash2, Eye, Send, CheckCircle2, ChevronRight, Layers, AlertCircle 
} from 'lucide-react';
import { examService, notificationService } from '../services/api';
import YksExamGeneratorModal from '../components/YksExamGeneratorModal';
import ExamAnalyticsModal from '../components/ExamAnalyticsModal';
import MathRenderer from '../components/MathRenderer';

export default function TeacherYksManager({ classrooms = [], user }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  
  // Modals
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [analyticsExamId, setAnalyticsExamId] = useState(null);
  const [previewExam, setPreviewExam] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

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

  useEffect(() => {
    fetchExams();
  }, [selectedClassFilter]);

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
              YKS TYT & AYT Test Yönetimi
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Güncel MEB/ÖSYM müfredatını inceleyen yapay zeka ile matematik formülleri ve Türkçe karakter güvenlikli yeni nesil sorular üretin, sınıflarınıza atayın ve anlık sınav analiz raporlarını inceleyin.
            </p>
          </div>

          <button
            onClick={() => setShowGeneratorModal(true)}
            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-zinc-100 text-indigo-950 font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition flex items-center gap-2 shrink-0 group"
          >
            <Sparkles className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" />
            <span>Yapay Zeka ile Yeni Test Oluştur</span>
          </button>
        </div>

        {/* Quick Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10">
          <div>
            <span className="text-[11px] text-indigo-200/70 block">Oluşturulan YKS Testleri</span>
            <span className="text-xl sm:text-2xl font-black text-white">{totalExams}</span>
          </div>
          <div>
            <span className="text-[11px] text-indigo-200/70 block">Tamamlanan Öğrenci Sınavları</span>
            <span className="text-xl sm:text-2xl font-black text-white">{totalSubmissions}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[11px] text-indigo-200/70 block">Desteklenen Sınav Türleri</span>
            <span className="text-xl sm:text-2xl font-black text-indigo-300">TYT & AYT</span>
          </div>
        </div>
      </div>

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
            Yukarıdaki "Yapay Zeka ile Yeni Test Oluştur" butonuna basarak güncel müfredata uygun ilk yeni nesil testinizi saniyeler içinde hazırlayabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
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

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenPreview(exam.id)}
                    className="flex-1 py-1.5 px-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1 transition"
                  >
                    <Eye className="w-3 h-3 text-zinc-400" />
                    <span>Sorular</span>
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

      {/* Generator Modal */}
      <YksExamGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        onCreated={fetchExams}
      />

      {/* Analytics Modal */}
      {analyticsExamId && (
        <ExamAnalyticsModal
          examId={analyticsExamId}
          onClose={() => setAnalyticsExamId(null)}
        />
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
              <button
                onClick={() => setPreviewExam(null)}
                className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
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
