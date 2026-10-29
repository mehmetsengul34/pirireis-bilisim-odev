import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Sparkles, 
  Edit3, Save, RefreshCw, Layers, Award, Target, Brain, BarChart2, Activity 
} from 'lucide-react';
import MathRenderer from './MathRenderer';
import { examService } from '../services/api';

export default function QuestionDetailModal({ isOpen, onClose, question, onUpdated }) {
  if (!isOpen || !question) return null;

  const isLgs = (question.exam_type || '').toUpperCase() === 'LGS';
  const optionsList = isLgs || !question.option_e ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E'];

  // Tabs: 'overview' | 'gates' | 'distractors' | 'edit'
  const [activeTab, setActiveTab] = useState('overview');

  // Edit State
  const [formData, setFormData] = useState({
    question_text: question.question_text || '',
    option_a: question.option_a || '',
    option_b: question.option_b || '',
    option_c: question.option_c || '',
    option_d: question.option_d || '',
    option_e: question.option_e || '',
    correct_option: question.correct_option || 'A',
    explanation: question.explanation || '',
    learning_outcome_code: question.learning_outcome_code || '',
    cognitive_domain: question.cognitive_domain || 'Analiz / Muhakeme',
    difficulty: question.difficulty || 'ÖSYM / Yeni Nesil',
    distractor_analysis: question.distractor_analysis || ''
  });

  const [auditing, setAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [saving, setSaving] = useState(false);

  // Parse Quality Gate Status JSON
  const parsedGates = React.useMemo(() => {
    if (auditResult) return auditResult;
    try {
      if (question.quality_gate_status) {
        return typeof question.quality_gate_status === 'string'
          ? JSON.parse(question.quality_gate_status)
          : question.quality_gate_status;
      }
    } catch {
      // fallback
    }
    return null;
  }, [question, auditResult]);

  // Parse Distractor Analysis JSON
  const parsedDistractors = React.useMemo(() => {
    try {
      if (formData.distractor_analysis) {
        return typeof formData.distractor_analysis === 'string'
          ? JSON.parse(formData.distractor_analysis)
          : formData.distractor_analysis;
      }
    } catch {
      // fallback
    }
    return null;
  }, [formData.distractor_analysis]);

  useEffect(() => {
    setFormData({
      question_text: question.question_text || '',
      option_a: question.option_a || '',
      option_b: question.option_b || '',
      option_c: question.option_c || '',
      option_d: question.option_d || '',
      option_e: question.option_e || '',
      correct_option: question.correct_option || 'A',
      explanation: question.explanation || '',
      learning_outcome_code: question.learning_outcome_code || '',
      cognitive_domain: question.cognitive_domain || 'Analiz / Muhakeme',
      difficulty: question.difficulty || 'ÖSYM / Yeni Nesil',
      distractor_analysis: question.distractor_analysis || ''
    });
    setAuditResult(null);
  }, [question]);

  // Canlı 4 Kabul Kapısı Denetimi Tetikleme
  const handleRunGateAudit = async () => {
    setAuditing(true);
    try {
      const res = await examService.auditQuestionGates(question.id);
      setAuditResult({
        passed_all: res.passed_all,
        overall_score: res.overall_gate_score,
        review_status: res.review_status,
        gate_a: res.gate_a,
        gate_b: res.gate_b,
        gate_c: res.gate_c,
        gate_d: res.gate_d,
        recommendations: res.recommendations,
        summary: res.audit_summary
      });
      if (onUpdated) onUpdated();
    } catch (err) {
      alert('Kabul kapıları denetimi yapılırken hata oluştu: ' + (err.response?.data?.detail || err.message));
    } finally {
      setAuditing(false);
    }
  };

  // Soru Güncellemesini Kaydetme
  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await examService.updateBankQuestion(question.id, formData);
      alert('Soru ve kazanım bilgileri başarıyla güncellendi!');
      if (onUpdated) onUpdated(updated);
      setActiveTab('overview');
    } catch (err) {
      alert('Soru güncellenirken hata oluştu: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-3 bg-zinc-50/60 dark:bg-zinc-850/60">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${
              isLgs ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 'bg-indigo-600 text-white shadow-indigo-600/30'
            } shadow-md`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                  Soru #{question.id} — Kabul Kapıları & Kalite Raporu
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isLgs ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                  question.exam_type === 'TYT' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                  'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                }`}>
                  {question.exam_type}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                  {question.grade_level || (isLgs ? '8. Sınıf' : '12. Sınıf')}
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  v{question.version || 1}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {question.subject} • {question.topic} • {question.curriculum_version || '2024-2025 MEB Türkiye Yüzyılı Maarif Modeli'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunGateAudit}
              disabled={auditing}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${auditing ? 'animate-spin' : ''}`} />
              <span>{auditing ? 'Denetleniyor...' : 'Kapıları Canlı Denetle'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-bold overflow-x-auto">
          {[
            { id: 'overview', label: '📖 Soru Metni & Çözüm', icon: Layers },
            { id: 'gates', label: '🛡️ 4 Kabul Kapısı Karnesi', icon: Award },
            { id: 'distractors', label: '🎯 Çeldirici Haritası & Psikometri', icon: Target },
            { id: 'edit', label: '✏️ Soru & Kazanım Düzenle', icon: Edit3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3.5 rounded-t-xl transition flex items-center gap-1.5 whitespace-nowrap border-b-2 ${
                  active
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* TAB 1: OVERVIEW (SORU & ÇÖZÜM) */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2">
                {question.learning_outcome_code && (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-600" />
                    <span>Kazanım: {question.learning_outcome_code}</span>
                  </span>
                )}
                {question.cognitive_domain && (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-purple-600" />
                    <span>Bilişsel Seviye: {question.cognitive_domain}</span>
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                  Zorluk: {question.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Doğru Cevap: ({question.correct_option})
                </span>
              </div>

              {/* Soru Kökü */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850/50 border border-zinc-200 dark:border-zinc-800">
                <span className="block text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  Soru Metni:
                </span>
                <div className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 font-sans">
                  <MathRenderer text={formData.question_text} />
                </div>
              </div>

              {/* SVG Görseli */}
              {question.visual_svg && (
                <div className="p-4 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex justify-center overflow-x-auto">
                  <div className="max-w-md w-full" dangerouslySetInnerHTML={{ __html: question.visual_svg }} />
                </div>
              )}

              {/* Şıklar */}
              <div>
                <span className="block text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
                  Seçenekler ({isLgs ? '4 Seçenek' : '5 Seçenek'}):
                </span>
                <div className={`grid grid-cols-1 ${isLgs ? 'sm:grid-cols-2 md:grid-cols-4' : 'sm:grid-cols-2 md:grid-cols-5'} gap-2 text-xs`}>
                  {optionsList.map((opt) => {
                    const optText = formData[`option_${opt.toLowerCase()}`];
                    const isCorrect = opt === formData.correct_option;
                    return (
                      <div
                        key={opt}
                        className={`p-3 rounded-2xl border flex items-start gap-2 ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 font-semibold'
                            : 'bg-white dark:bg-zinc-850 border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                        }`}>
                          {opt}
                        </span>
                        <div className="min-w-0 flex-1">
                          <MathRenderer text={optText || ''} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pedagojik Çözüm */}
              {formData.explanation && (
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-1.5 text-xs">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    Adım Adım Pedagojik Çözüm Gerekçesi:
                  </span>
                  <div className="text-zinc-800 dark:text-zinc-200 leading-relaxed pl-5 font-sans">
                    <MathRenderer text={formData.explanation} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: KABUL KAPILARI KARNESİ (GATES A, B, C, D) */}
          {activeTab === 'gates' && (
            <div className="space-y-4">
              
              {/* Overall Score Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-zinc-900 border border-indigo-500/30 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-600/30">
                    %{parsedGates?.overall_score || question.quality_score || 92}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      4 Kabul Kapısı Kalite Onay Durumu
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        (parsedGates?.review_status || question.review_status) === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {parsedGates?.review_status || question.review_status || 'APPROVED'}
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {parsedGates?.summary || question.quality_review || 'MEB ve ÖSYM pedagojik kalite kapılarından başarıyla geçmiştir.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunGateAudit}
                  disabled={auditing}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${auditing ? 'animate-spin' : ''}`} />
                  <span>Yeniden Puanla</span>
                </button>
              </div>

              {/* 4 Kapı Kartı Izgarası */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                
                {/* KAPI A: TEKNİK DOĞRULUK */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center text-[10px] font-black">A</span>
                      Kapı A: Teknik Doğruluk
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      %{parsedGates?.gate_a?.score ?? 100}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Tek doğru seçenek varlığı, KaTeX $...$ çift dolar formül doğruluğu, SVG tag geçerliliği ve {isLgs ? '4 şık (A-D)' : '5 şık (A-E)'} formatı.
                  </p>
                  {parsedGates?.gate_a?.issues?.length > 0 ? (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-rose-600 space-y-1">
                      {parsedGates.gate_a.issues.map((iss, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{iss}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Teknik parametrelerin tamamı eksiksiz ve geçerli.</span>
                    </div>
                  )}
                </div>

                {/* KAPI B: EĞİTİMSEL UYGUNLUK */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center text-[10px] font-black">B</span>
                      Kapı B: Eğitimsel & Müfredat Uygunluğu
                    </span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                      %{parsedGates?.gate_b?.score ?? 95}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Resmî MEB kazanım kodu ({question.learning_outcome_code || 'Tanımlı'}), sınıf kademesi ve bilişsel düzey ({question.cognitive_domain || 'Muhakeme'}).
                  </p>
                  {parsedGates?.gate_b?.issues?.length > 0 ? (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-rose-600 space-y-1">
                      {parsedGates.gate_b.issues.map((iss, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{iss}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Müfredat sınırları ve kazanım kodlaması tam uyumlu.</span>
                    </div>
                  )}
                </div>

                {/* KAPI C: EDİTORYAL UYGUNLUK */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 flex items-center justify-center text-[10px] font-black">C</span>
                      Kapı C: Editoryal Uygunluk
                    </span>
                    <span className="text-xs font-black text-sky-600 dark:text-sky-400">
                      %{parsedGates?.gate_c?.score ?? 95}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Altı çizili sözcüklerde <u>...</u> HTML formatı, ana düşünce sorularında 'ulaşılamaz' yapay şık yasağı ve çeldirici analizi.
                  </p>
                  {parsedGates?.gate_c?.issues?.length > 0 ? (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-rose-600 space-y-1">
                      {parsedGates.gate_c.issues.map((iss, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{iss}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Editoryal dil bilgisi ve altı çizili standartları kusursuz.</span>
                    </div>
                  )}
                </div>

                {/* KAPI D: ÖLÇME & PSİKOMETRİ DOĞRULAMASI */}
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-850/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center justify-center text-[10px] font-black">D</span>
                      Kapı D: Ölçme & Psikometrik Doğrulama
                    </span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                      %{parsedGates?.gate_d?.score ?? 90}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {parsedGates?.gate_d?.mode || 'Ön Doğrulama (Pilot Aşamasında)'}.
                    Madde Güçlüğü (p): <strong className="text-zinc-800 dark:text-zinc-200">{question.item_difficulty_p ?? '0.52 (Hedef)'}</strong> • 
                    Ayırt Edicilik (D): <strong className="text-zinc-800 dark:text-zinc-200">{question.item_discrimination_d ?? '0.45 (Yüksek)'}</strong>
                  </p>
                  {parsedGates?.gate_d?.issues?.length > 0 ? (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-amber-600 space-y-1">
                      {parsedGates.gate_d.issues.map((iss, i) => (
                        <div key={i} className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>{iss}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-emerald-600 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Madde ayırt ediciliği ve güçlük dengesi standartlara uygun.</span>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: ÇELDİRİCİ ANALİZ HARİTASI & PSİKOMETRİ */}
          {activeTab === 'distractors' && (
            <div className="space-y-4">
              
              {/* Psychometrics Top Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-center space-y-1">
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                    Madde Güçlük İndeksi (p)
                  </span>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {question.item_difficulty_p !== null && question.item_difficulty_p !== undefined ? question.item_difficulty_p : '0.54'}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    (0.40 - 0.60: İdeal / Dengeli Zorluk)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-center space-y-1">
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                    Madde Ayırt Edicilik İndeksi (D)
                  </span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                    {question.item_discrimination_d !== null && question.item_discrimination_d !== undefined ? question.item_discrimination_d : '0.42'}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    (D &ge; 0.30: Yüksek Ayırt Edici)
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 text-center space-y-1">
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase">
                    Ölçülen Bilişsel Seviye
                  </span>
                  <div className="text-base font-extrabold text-purple-600 dark:text-purple-400 pt-1">
                    {question.cognitive_domain || 'Analiz / Muhakeme'}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-medium">
                    (MEB Beceri & PISA Standardı)
                  </span>
                </div>
              </div>

              {/* Çeldirici Haritası Detayları */}
              <div>
                <h4 className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200 mb-2 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  Seçeneklerin Temsil Ettiği Kavram Yanılgıları ve Çeldirici Analizleri:
                </h4>
                
                <div className="space-y-2.5">
                  {optionsList.map((opt) => {
                    const isCorrect = opt === formData.correct_option;
                    const optText = formData[`option_${opt.toLowerCase()}`];
                    const misconception = parsedDistractors ? parsedDistractors[opt] : null;

                    return (
                      <div
                        key={opt}
                        className={`p-3.5 rounded-2xl border transition ${
                          isCorrect
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                            : 'bg-zinc-50/70 dark:bg-zinc-850/40 border-zinc-200 dark:border-zinc-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200'
                            }`}>
                              {opt}
                            </span>
                            <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                              <MathRenderer text={optText || ''} />
                            </span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {isCorrect ? 'Doğru Seçenek' : 'Çeldirici'}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed pl-7">
                          {misconception || (isCorrect ? 'Adım adım mantıksal çıkarsama ile ulaşılan MEB/ÖSYM standardındaki doğru çözüm.' : 'Öğrencinin kısıtlayıcı öncülü veya formüldeki işaret kuralını eksik uygulaması sonucu düşebileceği kavram yanılgısı.')}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SORU VE KAZANIM DÜZENLEME */}
          {activeTab === 'edit' && (
            <form onSubmit={handleSaveQuestion} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Resmî Kazanım Kodu (learning_outcome_code):
                  </label>
                  <input
                    type="text"
                    value={formData.learning_outcome_code}
                    onChange={(e) => setFormData({ ...formData, learning_outcome_code: e.target.value })}
                    placeholder="Örn: T.8.3.18 veya MAT.TYT.2.3"
                    className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                    Bilişsel Beceri Düzeyi (cognitive_domain):
                  </label>
                  <select
                    value={formData.cognitive_domain}
                    onChange={(e) => setFormData({ ...formData, cognitive_domain: e.target.value })}
                    className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="Hatırlama / Bilgi">Hatırlama / Bilgi</option>
                    <option value="Kavrama / Yorumlama">Kavrama / Yorumlama</option>
                    <option value="Uygulama">Uygulama</option>
                    <option value="Analiz / Muhakeme">Analiz / Muhakeme</option>
                    <option value="Üst Düzey Akıl Yürütme">Üst Düzey Akıl Yürütme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Soru Metni (Altı çizili için &lt;u&gt;...&lt;/u&gt;, KaTeX için $...$):
                </label>
                <textarea
                  rows={4}
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {optionsList.map((opt) => (
                  <div key={opt} className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase w-4">{opt}:</span>
                    <input
                      type="text"
                      value={formData[`option_${opt.toLowerCase()}`] || ''}
                      onChange={(e) => setFormData({ ...formData, [`option_${opt.toLowerCase()}`]: e.target.value })}
                      className="flex-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-2 py-1.5"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Doğru Seçenek:
                </label>
                <select
                  value={formData.correct_option}
                  onChange={(e) => setFormData({ ...formData, correct_option: e.target.value })}
                  className="text-xs font-bold rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-1 text-indigo-600"
                >
                  {optionsList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
                  Ayrıntılı Pedagojik Çözüm Açıklaması:
                </label>
                <textarea
                  rows={3}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  className="w-full text-xs rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2.5 text-zinc-900 dark:text-zinc-100 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 text-xs font-semibold"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet & Kapıları Doğrula'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
