import React, { useState, useEffect } from 'react';
import { 
  X, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, 
  Send, Flag, HelpCircle, Award, Check, RotateCcw 
} from 'lucide-react';
import { examService } from '../services/api';
import MathRenderer from './MathRenderer';
import { isVerbalBranch } from '../utils/branchUtils';

export default function StudentExamTakingModal({ examId, onClose, onSubmitted }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionId]: 'A' | 'B' | 'C' | 'D' | 'E' }
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Fetch Exam detail
  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const data = await examService.getDetail(examId);
        setExam(data);

        // If student already submitted, show result directly
        if (data.my_submission) {
          setSubmissionResult(data.my_submission);
        } else if (data.duration_minutes) {
          setSecondsLeft(data.duration_minutes * 60);
        }
      } catch (err) {
        alert('Sınav verisi alınamadı.');
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  // Timer countdown
  useEffect(() => {
    if (secondsLeft === null || submissionResult) return;

    if (secondsLeft <= 0) {
      alert('Sınav süreniz doldu! Cevaplarınız otomatik olarak gönderiliyor.');
      handleSubmitAnswers();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, submissionResult]);

  const handleSelectOption = (questionId, option) => {
    if (submissionResult) return; // Sınav bittiyse değiştirilemez
    setAnswers(prev => ({
      ...prev,
      [questionId]: prev[questionId] === option ? null : option
    }));
  };

  const handleSubmitAnswers = async () => {
    if (!exam) return;
    setSubmitting(true);
    try {
      const answersPayload = (exam.questions || []).map(q => ({
        question_id: q.id,
        selected_option: answers[q.id] || null
      }));

      const result = await examService.submit(exam.id, answersPayload);
      setSubmissionResult(result);
      setShowConfirmSubmit(false);

      // Refresh detail to get explanations & answers
      const updatedExam = await examService.getDetail(exam.id);
      setExam(updatedExam);

      if (onSubmitted) onSubmitted();
    } catch (err) {
      alert(err.response?.data?.detail || 'Cevaplar gönderilemedi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Sınav ortamı hazırlanıyor...
          </p>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const questions = exam.questions || [];
  const currentQuestion = questions[currentIndex] || null;
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const blankCount = questions.length - answeredCount;

  // Format timer
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-800/40">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              exam.exam_type === 'TYT'
                ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                : 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
            }`}>
              {exam.exam_type}
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                {exam.title}
              </h2>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {exam.subject} • {exam.topic}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer (if ongoing) */}
            {!submissionResult && secondsLeft !== null && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold ${
                secondsLeft < 300
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 animate-pulse border border-rose-200 dark:border-rose-800'
                  : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(secondsLeft)}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUBMISSION RESULT BANNER (if submitted) */}
        {submissionResult && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/50 flex flex-wrap items-center justify-between gap-3 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-bold block">
                  Sınavınız Başarıyla Değerlendirildi!
                </span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Doğru, yanlış ve soru çözümlerinizi aşağıdan inceleyebilirsiniz.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                Doğru: <strong>{submissionResult.correct_count}</strong>
              </span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                Yanlış: <strong>{submissionResult.incorrect_count}</strong>
              </span>
              <span className="font-semibold text-zinc-500">
                Boş: <strong>{submissionResult.blank_count}</strong>
              </span>
              <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold rounded-xl shadow-sm">
                Net: {submissionResult.net_score}
              </span>
            </div>
          </div>
        )}

        {/* Question Selector Bar */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 flex items-center gap-1.5 overflow-x-auto">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = !!answers[q.id];

            // If submitted, show correct/incorrect color
            let statusColor = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';
            if (submissionResult) {
              const myAns = submissionResult.answers?.find(a => a.question_id === q.id);
              if (myAns?.is_correct) {
                statusColor = 'bg-emerald-500 text-white';
              } else if (myAns?.selected_option) {
                statusColor = 'bg-rose-500 text-white';
              } else {
                statusColor = 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500';
              }
            } else if (isAnswered) {
              statusColor = 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30';
            }

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-xl text-xs font-bold shrink-0 transition flex items-center justify-center ${statusColor} ${
                  isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2 dark:ring-offset-zinc-900 scale-105' : ''
                }`}
              >
                {q.question_number}
              </button>
            );
          })}
        </div>

        {/* Question Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {currentQuestion && (
            <div className="space-y-5 max-w-2xl mx-auto">
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                  Soru {currentQuestion.question_number} / {questions.length}
                </span>
                <span>{currentQuestion.topic || ''}</span>
              </div>

              {/* Soru Metni */}
              <div className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed bg-zinc-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                <MathRenderer text={currentQuestion.question_text} />
              </div>

              {/* SVG Görsel */}
              {currentQuestion.visual_svg && (
                <div
                  className="my-3 flex justify-center"
                  dangerouslySetInnerHTML={{ __html: currentQuestion.visual_svg }}
                />
              )}

              {/* Şıklar */}
              <div className="space-y-2.5 pt-2">
                {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                  const key = `option_${opt.toLowerCase()}`;
                  const isSelected = answers[currentQuestion.id] === opt;
                  
                  // Submission değerlendirmesi
                  const myAns = submissionResult?.answers?.find(a => a.question_id === currentQuestion.id);
                  const isMySelection = myAns?.selected_option === opt;
                  const isCorrect = currentQuestion.correct_option === opt;

                  let optClass = 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-indigo-400 text-zinc-800 dark:text-zinc-200';

                  if (submissionResult) {
                    if (isCorrect) {
                      optClass = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isMySelection && !isCorrect) {
                      optClass = 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-900 dark:text-rose-200 line-through';
                    } else {
                      optClass = 'opacity-60 border-zinc-200 dark:border-zinc-700';
                    }
                  } else if (isSelected) {
                    optClass = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-600 text-indigo-900 dark:text-indigo-200 font-semibold ring-1 ring-indigo-600';
                  }

                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => handleSelectOption(currentQuestion.id, opt)}
                      disabled={!!submissionResult}
                      className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-left transition flex items-start gap-3.5 ${optClass}`}
                    >
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                        submissionResult && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : submissionResult && isMySelection && !isCorrect
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300'
                      }`}>
                        {opt}
                      </span>
                      <div className="flex-1 mt-0.5">
                        <MathRenderer text={currentQuestion[key]} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Seçimi Temizle Butonu (Sınav devam ederken) */}
              {!submissionResult && answers[currentQuestion.id] && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, answers[currentQuestion.id])}
                    className="text-xs text-zinc-400 hover:text-rose-500 flex items-center gap-1 transition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>İşareti Kaldır (Boş Bırak)</span>
                  </button>
                </div>
              )}

              {/* Çözüm ve Pedagojik Açıklama (Sınav teslim edildiyse) */}
              {submissionResult && currentQuestion.explanation && (
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs sm:text-sm space-y-1.5 text-indigo-950 dark:text-indigo-200">
                  <span className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
                    <HelpCircle className="w-4 h-4" />
                    Sorunun Detaylı Çözümü:
                  </span>
                  <MathRenderer text={currentQuestion.explanation} />
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/30">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Önceki
          </button>

          {!submissionResult ? (
            <button
              type="button"
              onClick={() => setShowConfirmSubmit(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition"
            >
              <Send className="w-4 h-4" />
              <span>Sınavı Tamamla ve Gönder</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold text-xs sm:text-sm transition"
            >
              Kapat ve Portala Dön
            </button>
          )}

          <button
            type="button"
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex(prev => prev + 1)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 flex items-center gap-1 transition"
          >
            Sonraki
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Confirm Submit Dialog */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Sınavı Göndermek İstiyor Musunuz?
              </h3>

              <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-2 leading-relaxed">
                <p>
                  Toplam <strong>{questions.length}</strong> sorudan <strong>{answeredCount}</strong> tanesini işaretlediniz.
                </p>
                {blankCount > 0 && (
                  <p className="text-amber-600 dark:text-amber-400 font-semibold">
                    ⚠️ <strong>{blankCount}</strong> soruyu boş bıraktınız!
                  </p>
                )}
                <p>
                  Sınavı teslim ettikten sonra verdiğiniz cevapları değiştiremezsiniz.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
                >
                  Soruya Dön
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitAnswers}
                  className="px-5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {submitting ? 'Hesaplanıyor...' : 'Evet, Sınavı Bitir'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
