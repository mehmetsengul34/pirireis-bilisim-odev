import React, { useState, useEffect } from 'react';
import { 
  Sparkles, BookOpen, Clock, Award, CheckCircle2, ChevronRight, 
  Play, FileText, HelpCircle, AlertCircle, BarChart2 
} from 'lucide-react';
import { examService } from '../services/api';
import StudentExamTakingModal from '../components/StudentExamTakingModal';

export default function StudentYksManager({ user }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'completed'
  const [takingExamId, setTakingExamId] = useState(null);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const data = await examService.list();
      setExams(data);
    } catch (err) {
      console.error('YKS testleri alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const pendingExams = exams.filter(e => !e.my_submission);
  const completedExams = exams.filter(e => !!e.my_submission);

  // Student summary stats
  const totalCompleted = completedExams.length;
  const totalNets = completedExams.reduce((acc, e) => acc + (e.my_submission?.net_score || 0), 0);
  const avgNet = totalCompleted > 0 ? (totalNets / totalCompleted).toFixed(2) : '0.00';

  return (
    <div className="space-y-6">
      
      {/* Student YKS Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-zinc-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>YKS Hazırlık & Test Merkezi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              YKS Deneme ve Testlerin
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
              Öğretmeninin senin için hazırladığı yeni nesil TYT ve AYT testlerini çöz, ÖSYM kurallarına göre anlık net hesaplamanı ve detaylı soru çözümlerini anında öğren.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[120px]">
              <span className="text-[11px] text-indigo-200 block">Çözülen Sınav</span>
              <span className="text-2xl font-black text-white">{totalCompleted}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center min-w-[120px]">
              <span className="text-[11px] text-indigo-200 block">Ortalama Net</span>
              <span className="text-2xl font-black text-indigo-300">{avgNet}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Çözülmeyi Bekleyen Sınavlar ({pendingExams.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Tamamlanan Sınavlarım ({completedExams.length})</span>
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span className="text-xs text-zinc-400">Sınavlar yükleniyor...</span>
        </div>
      ) : activeTab === 'pending' ? (
        /* PENDING EXAMS */
        pendingExams.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Harika! Bekleyen Sınavın Bulunmuyor
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Sınıfına tanımlanan tüm YKS sınavlarını tamamladın. Öğretmenin yeni bir sınav atadığında sana bildirim gelecektir.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-800 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      exam.exam_type === 'TYT'
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                        : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'
                    }`}>
                      {exam.exam_type}
                    </span>

                    <span className="text-[11px] text-zinc-400">
                      {exam.teacher_name}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {exam.title}
                  </h3>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {exam.subject} • {exam.topic}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-zinc-100 dark:border-zinc-800 text-center">
                  <div className="p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
                    <span className="text-[10px] text-zinc-400 block">Soru Sayısı</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{exam.question_count} Soru</span>
                  </div>
                  <div className="p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
                    <span className="text-[10px] text-zinc-400 block">Sınav Süresi</span>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {exam.duration_minutes ? `${exam.duration_minutes} dk` : 'Süresiz'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setTakingExamId(exam.id)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition group"
                >
                  <Play className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
                  <span>Sınava Başla</span>
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        /* COMPLETED EXAMS */
        completedExams.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Henüz Tamamlanan Sınavın Yok
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              "Çözülmeyi Bekleyen Sınavlar" sekmesinden ilk testine başlayarak karne ve soru analizlerini burada görebilirsin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedExams.map((exam) => {
              const sub = exam.my_submission;
              return (
                <div
                  key={exam.id}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        Tamamlandı
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {new Date(sub?.submitted_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {exam.subject} • {exam.topic}
                    </p>
                  </div>

                  {/* Net & Scorecard Bar */}
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-medium">YKS Net Puanı</span>
                      <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                        {sub?.net_score} Net
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-emerald-600">{sub?.correct_count} D</span>
                      <span className="text-rose-600">{sub?.incorrect_count} Y</span>
                      <span className="text-zinc-400">{sub?.blank_count} B</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setTakingExamId(exam.id)}
                    className="w-full py-2.5 px-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Karneni ve Çözümleri Gör</span>
                  </button>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Taking / Reviewing Modal */}
      {takingExamId && (
        <StudentExamTakingModal
          examId={takingExamId}
          onClose={() => setTakingExamId(null)}
          onSubmitted={fetchExams}
        />
      )}

    </div>
  );
}
