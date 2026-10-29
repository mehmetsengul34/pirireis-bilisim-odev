import React, { useState, useEffect } from 'react';
import { 
  X, Award, Users, TrendingUp, AlertTriangle, CheckCircle2, 
  HelpCircle, ArrowDown, ArrowUp, BarChart3, ListFilter, Sparkles, Send, ChevronDown, ChevronUp 
} from 'lucide-react';
import { examService, notificationService } from '../services/api';
import MathRenderer from './MathRenderer';
import { isVerbalBranch } from '../utils/branchUtils';

export default function ExamAnalyticsModal({ examId, onClose }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'topics' | 'questions'
  const [sendingAlert, setSendingAlert] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await examService.getAnalytics(examId);
        setAnalytics(data);
      } catch (err) {
        console.error('Analiz verisi alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [examId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Sınav analiz raporu ve öğrenci verileri işleniyor...
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const handleSendDeficiencyNotification = async (topic) => {
    setSendingAlert(true);
    try {
      await notificationService.send({
        classroom_id: analytics.classroom_name ? null : null,
        title: `Konu Tekrarı Uyarısı: ${topic.topic}`,
        message: `'${analytics.title}' sınavı analizinde '${topic.topic}' konusunda sınıf başarı oranının %${topic.success_rate} seviyesinde kaldığı tespit edildi. Lütfen bu konudaki konu anlatımını ve testleri tekrar ediniz.`,
        notification_type: 'alert'
      });
      alert(`'${topic.topic}' konusu için öğrencilere tekrar uyarısı gönderildi!`);
    } catch (err) {
      alert('Bildirim gönderilemedi.');
    } finally {
      setSendingAlert(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                {analytics.exam_type}
              </span>
              <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                {analytics.subject} • {analytics.topic}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {analytics.title} — Detaylı Sınav Analiz Raporu
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="p-5 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">Katılım Oranı</span>
            <div className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {analytics.total_submissions} <span className="text-xs text-zinc-400 font-normal">/ {analytics.total_students_enrolled || analytics.total_submissions} Öğrenci</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-800/50">
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 block font-medium">Sınıf Ortalama Net</span>
            <div className="text-lg sm:text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-0.5">
              {analytics.average_net} <span className="text-xs font-normal">Net</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">En Yüksek Net</span>
            <div className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
              {analytics.highest_net} <span className="text-xs font-normal">Net</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/50">
            <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-medium">En Düşük Net</span>
            <div className="text-lg sm:text-xl font-bold text-amber-700 dark:text-amber-300 mt-0.5">
              {analytics.lowest_net} <span className="text-xs font-normal">Net</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-6 pt-3 border-b border-zinc-100 dark:border-zinc-800 flex gap-2">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'leaderboard'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Öğrenci Sıralama Tablosu ({analytics.student_rankings.length})
          </button>

          <button
            onClick={() => setActiveTab('topics')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'topics'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Kazanım & Konu Analizi ({analytics.topic_analytics.length})
          </button>

          <button
            onClick={() => setActiveTab('questions')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'questions'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Soru & Çeldirici Raporu ({analytics.question_analytics.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          {/* TAB 1: Öğrenci Sıralama Tablosu */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-3">
              {analytics.student_rankings.length === 0 ? (
                <div className="text-center py-10 text-zinc-400 text-xs sm:text-sm">
                  Henüz bu sınavı tamamlayıp teslim eden öğrenci bulunmuyor.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="py-3 px-4">Sıra</th>
                        <th className="py-3 px-4">Öğrenci Adı Soyadı</th>
                        <th className="py-3 px-4">Öğrenci No</th>
                        <th className="py-3 px-4 text-center text-emerald-600">Doğru</th>
                        <th className="py-3 px-4 text-center text-rose-600">Yanlış</th>
                        <th className="py-3 px-4 text-center text-zinc-400">Boş</th>
                        <th className="py-3 px-4 text-right font-bold text-indigo-600 dark:text-indigo-400">Net Skor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {analytics.student_rankings.map((rank) => (
                        <tr key={rank.student_id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition">
                          <td className="py-3 px-4 font-bold">
                            {rank.rank === 1 && <span className="text-amber-500">🥇 1.</span>}
                            {rank.rank === 2 && <span className="text-slate-400">🥈 2.</span>}
                            {rank.rank === 3 && <span className="text-amber-700">🥉 3.</span>}
                            {rank.rank > 3 && <span className="text-zinc-500">{rank.rank}.</span>}
                          </td>
                          <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            {rank.student_name}
                          </td>
                          <td className="py-3 px-4 text-zinc-500 font-mono text-xs">
                            {rank.student_number || '—'}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-emerald-600">
                            {rank.correct_count}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-rose-600">
                            {rank.incorrect_count}
                          </td>
                          <td className="py-3 px-4 text-center font-medium text-zinc-400">
                            {rank.blank_count}
                          </td>
                          <td className="py-3 px-4 text-right font-black text-indigo-600 dark:text-indigo-400 text-sm">
                            {rank.net_score} Net
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Konu & Kazanım Analizi */}
          {activeTab === 'topics' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <strong>Yapay Zeka Pedagojik Teşhis:</strong> Aşağıdaki konular sınıfın başarı yüzdesine göre en çok zorlanılandan en başarılı olana doğru listelenmiştir. Düşük yüzdeli konular için tek tıkla öğrencilere tekrar bildirimi gönderebilirsiniz.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {analytics.topic_analytics.map((top, idx) => {
                  const isWeak = top.success_rate < 50;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 hover:border-zinc-300 dark:hover:border-zinc-700 transition"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${isWeak ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                            {top.topic}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            ({top.question_count} Soru soruldu)
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-extrabold ${isWeak ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            %{top.success_rate} Başarı
                          </span>
                          {isWeak && (
                            <button
                              onClick={() => handleSendDeficiencyNotification(top)}
                              disabled={sendingAlert}
                              className="px-2.5 py-1 text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg flex items-center gap-1 transition"
                            >
                              <Send className="w-3 h-3" />
                              Tekrar Uyarısı Yolla
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWeak ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${top.success_rate}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-zinc-400 pt-0.5">
                        <span>Toplam Verilen Doğru Cevap: <strong className="text-emerald-600">{top.correct_answers}</strong></span>
                        <span>Yanlış / Boş Sayısı: <strong className="text-rose-500">{top.incorrect_answers}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Soru & Çeldirici Raporu */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1 flex-wrap gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  Toplam {analytics.question_analytics.length} sorunun başarı oranları, şık dağılımları ve detaylı soru içerikleri:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const allOpen = Object.keys(expandedQuestions).length === analytics.question_analytics.length;
                    if (allOpen) {
                      setExpandedQuestions({});
                    } else {
                      const all = {};
                      analytics.question_analytics.forEach(q => { all[q.question_id] = true; });
                      setExpandedQuestions(all);
                    }
                  }}
                  className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold rounded-lg transition"
                >
                  {Object.keys(expandedQuestions).length === analytics.question_analytics.length ? 'Tüm Soruları Kapat' : 'Tüm Soru Metinlerini Aç'}
                </button>
              </div>

              <div className="space-y-4">
                {analytics.question_analytics.map((q) => {
                  const isExpanded = expandedQuestions[q.question_id] !== false; // default expanded
                  return (
                    <div
                      key={q.question_id}
                      className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 shadow-sm"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                            Soru {q.question_number}
                          </span>
                          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium text-xs rounded-md">
                            {q.topic || 'Genel'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs rounded-lg border border-emerald-200 dark:border-emerald-800">
                            Doğru Cevap: {q.correct_option} (%{q.success_rate} Başarı)
                          </span>
                          <button
                            type="button"
                            onClick={() => setExpandedQuestions(prev => ({ ...prev, [q.question_id]: !isExpanded }))}
                            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition"
                            title={isExpanded ? 'Soruyu Gizle' : 'Soruyu Göster'}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Question Content (Text, SVG, Choices, Solution) */}
                      {q.question_text && isExpanded && (
                        <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                          {/* Soru Metni */}
                          <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed bg-zinc-50 dark:bg-zinc-850/50 p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800">
                            <MathRenderer text={q.question_text} />
                          </div>

                          {/* Visual SVG if exists */}
                          {q.visual_svg && (
                            <div className="my-2 p-3 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 flex justify-center overflow-x-auto">
                              <div className="max-w-md w-full" dangerouslySetInnerHTML={{ __html: q.visual_svg }} />
                            </div>
                          )}

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                              const optText = q[`option_${opt.toLowerCase()}`];
                              const isCorrect = opt === q.correct_option;
                              const pickCount = q.option_distribution ? (q.option_distribution[opt] || 0) : 0;
                              return (
                                <div
                                  key={opt}
                                  className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 text-xs ${
                                    isCorrect
                                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-200 font-medium'
                                      : 'bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300'
                                  }`}
                                >
                                  <div className="flex items-start gap-2 min-w-0">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] ${
                                      isCorrect ? 'bg-emerald-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                                    }`}>
                                      {opt}
                                    </span>
                                    <div className="min-w-0">
                                      <MathRenderer text={optText || ''} />
                                    </div>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                                    isCorrect
                                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                                      : pickCount > 0
                                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300'
                                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                                  }`}>
                                    {pickCount} kişi
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          {q.explanation && (
                            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                Detaylı Pedagojik Çözüm:
                              </span>
                              <div className="text-zinc-700 dark:text-zinc-300 leading-relaxed pl-5">
                                <MathRenderer text={q.explanation} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Option Distribution Bars */}
                      <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block font-medium">
                          Şık Dağılımı ve Çeldirici Analizi:
                        </span>
                        <div className="grid grid-cols-6 gap-1.5 text-center font-mono text-xs">
                          {['A', 'B', 'C', 'D', 'E', 'Boş'].map((opt) => {
                            const count = q.option_distribution ? (q.option_distribution[opt] || 0) : 0;
                            const isCorrect = opt === q.correct_option;
                            return (
                              <div
                                key={opt}
                                className={`p-1.5 rounded-lg border ${
                                  isCorrect
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold'
                                    : count > 0
                                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400'
                                    : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 text-zinc-400'
                                }`}
                              >
                                <div className="text-[10px] opacity-75">{opt}</div>
                                <div className="font-bold">{count}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="text-[11px] text-zinc-400 flex justify-between pt-1 font-medium">
                        <span>Doğru Yapan: {q.correct_count}</span>
                        <span>Hatalı Yapan: {q.incorrect_count}</span>
                        <span>Boş Bırakan: {q.blank_count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
</div>

      </div>
    </div>
  );
}
