import React, { useState } from 'react';
import { Printer, X, FileText, CheckCircle2, Settings, HelpCircle, Columns } from 'lucide-react';
import MathRenderer from './MathRenderer';

export default function PrintableExamModal({ 
  questions = [], 
  defaultSubject = 'Matematik', 
  defaultTitle = '',
  onClose 
}) {
  const [schoolName, setSchoolName] = useState('Piri Reis Ticaret Mesleki ve Teknik Anadolu Lisesi');
  const [examTitle, setExamTitle] = useState(defaultTitle || `${defaultSubject} YKS Kazanım ve Deneme Sınavı`);
  const [academicYear, setAcademicYear] = useState('2025 - 2026 Eğitim Öğretim Yılı');
  const [examDuration, setExamDuration] = useState(
    questions.length > 0 
      ? (questions.length * 2.5 > 120 ? 120 : Math.max(30, Math.round(questions.length * 2.5))) 
      : 40
  );
  
  // Toggles
  const [showOpticForm, setShowOpticForm] = useState(true);
  const [showAnswerKey, setShowAnswerKey] = useState(true);
  const [showSolutions, setShowSolutions] = useState(false);
  const [twoColumns, setTwoColumns] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-2 sm:p-4 printable-exam-modal-wrapper">
      
      {/* Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col my-auto border border-zinc-200 dark:border-zinc-800 printable-exam-container">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/80 rounded-t-3xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Kağıt Baskı & Sınav Yazdırma Modülü</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  {questions.length} Soru
                </span>
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                ÖSYM & MEB standartlarında 2 sütunlu A4 sınav kağıdı şablonu.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={questions.length === 0}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF Olarak Kaydet</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Configuration Bar (Hidden when printing) */}
        <div className="no-print p-4 bg-zinc-100/60 dark:bg-zinc-850/40 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex-1 min-w-[240px]">
            <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
              Okul Adı:
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1">
              Sınav Başlığı:
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap pt-4 sm:pt-0">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={twoColumns}
                onChange={(e) => setTwoColumns(e.target.checked)}
                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">2 Sütun (Kitapçık Düzeni)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOpticForm}
                onChange={(e) => setShowOpticForm(e.target.checked)}
                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Optik Cevap Alanı Ekle</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showAnswerKey}
                onChange={(e) => setShowAnswerKey(e.target.checked)}
                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Cevap Anahtarı Tablosu</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSolutions}
                onChange={(e) => setShowSolutions(e.target.checked)}
                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Detaylı Çözümler</span>
            </label>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-6 sm:p-10 bg-white text-black font-serif print:p-0 print:m-0 overflow-y-auto max-h-[75vh] print:max-h-none print:overflow-visible">
          
          {/* Header */}
          <div className="border-b-2 border-black pb-4 mb-5 text-center space-y-1">
            <div className="text-xs uppercase tracking-widest font-sans font-bold text-zinc-600 print:text-black">
              T.C. MİLLÎ EĞİTİM BAKANLIĞI
            </div>
            <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
              {schoolName}
            </h1>
            <div className="text-xs sm:text-sm font-bold uppercase text-zinc-800 print:text-black">
              {academicYear} • {examTitle}
            </div>
          </div>

          {/* Student Info Box */}
          <div className="border border-black p-3 rounded-lg mb-6 text-xs font-sans grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4">
            <div>
              <span className="font-bold">Adı Soyadı:</span> ....................................................
            </div>
            <div>
              <span className="font-bold">Sınıfı / Şubesi:</span> ....................
            </div>
            <div>
              <span className="font-bold">Okul Numarası:</span> ....................
            </div>
            <div>
              <span className="font-bold">Ders / Branş:</span> {defaultSubject}
            </div>
            <div>
              <span className="font-bold">Soru Sayısı:</span> {questions.length} Soru
            </div>
            <div>
              <span className="font-bold">Sınav Süresi:</span> {examDuration} Dakika
            </div>
            <div className="col-span-2 sm:col-span-3 pt-1 border-t border-dashed border-zinc-400 flex justify-between text-[11px] text-zinc-700 print:text-black">
              <span>Doğru: ______</span>
              <span>Yanlış: ______</span>
              <span>Boş: ______</span>
              <span>Net: ______</span>
              <span>Puan: ______</span>
              <span>Tarih: ___ / ___ / 2026</span>
            </div>
          </div>

          {/* Instructions Notice */}
          <div className="bg-zinc-100 print:bg-transparent border border-zinc-300 print:border-black p-2.5 rounded-md mb-6 text-[11px] font-sans">
            <span className="font-bold">SINAV YÖNERGESİ:</span>
            <ul className="list-disc list-inside mt-0.5 space-y-0.5 text-zinc-700 print:text-black">
              <li>Bu sınavda {questions.length} adet yeni nesil ve MEB/ÖSYM müfredatına uygun soru bulunmaktadır.</li>
              <li>Her sorunun tek bir doğru cevabı vardır. Cevaplarınızı kurşun kalem ile form alanına kodlayınız.</li>
              <li>4 yanlış cevap 1 doğru cevabı götürmektedir. Sınav süresi {examDuration} dakikadır. Başarılar dileriz.</li>
            </ul>
          </div>

          {questions.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-sans space-y-2 border-2 border-dashed border-zinc-200 rounded-xl p-8">
              <p className="font-bold text-sm text-zinc-700">Yazdırılacak soru bulunamadı.</p>
              <p className="text-xs text-zinc-500">Lütfen soru bankasından en az bir soru seçiniz veya herhangi bir sınav kartı üzerindeki <strong>"Yazdır"</strong> butonuna basınız.</p>
            </div>
          ) : (
            /* Questions Layout */
            <div className={twoColumns ? 'columns-1 md:columns-2 gap-8 [column-rule:1px_solid_#e4e4e7] print:[column-rule:1px_solid_#000]' : 'space-y-6'}>
              {questions.map((q, idx) => {
                const qNum = idx + 1;
                return (
                  <div 
                    key={q.id || idx} 
                    className="page-break-avoid break-inside-avoid mb-6 pb-4 border-b border-zinc-200 print:border-zinc-300 last:border-none"
                  >
                    {/* Soru No & Konu */}
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-black text-sm font-sans flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-xs font-bold font-sans">
                          {qNum}
                        </span>
                      </span>
                      {q.topic && (
                        <span className="text-[10px] text-zinc-500 print:text-zinc-600 font-sans italic">
                          ({q.topic})
                        </span>
                      )}
                    </div>

                    {/* Visual SVG if exists */}
                    {q.visual_svg && (
                      <div className="my-2 p-2 bg-white flex justify-center overflow-hidden">
                        <div className="max-w-[260px] w-full" dangerouslySetInnerHTML={{ __html: q.visual_svg }} />
                      </div>
                    )}

                    {/* Soru Metni */}
                    <div className="text-xs sm:text-[13px] leading-relaxed mb-3 text-black">
                      <MathRenderer text={q.question_text} content={q.question_text} />
                    </div>

                    {/* Options */}
                    <div className="space-y-1.5 text-xs font-sans">
                      {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                        const optText = q[`option_${opt.toLowerCase()}`];
                        return (
                          <div key={opt} className="flex items-start gap-2">
                            <span className="font-bold text-xs shrink-0 w-5">
                              {opt})
                            </span>
                            <div className="min-w-0 text-zinc-900 leading-snug">
                              <MathRenderer text={optText || ''} content={optText || ''} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Optical Answer Form for Students */}
          {showOpticForm && questions.length > 0 && (
            <div className="page-break-avoid break-inside-avoid mt-8 pt-6 border-t-2 border-black font-sans">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs uppercase tracking-wide">
                  ÖĞRENCİ CEVAP VE KODLAMA ALANI:
                </span>
                <span className="text-[10px] text-zinc-500">
                  Lütfen doğru şıkkın içini kurşun kalemle doldurunuz.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 p-3 border border-black rounded-lg bg-zinc-50 print:bg-transparent text-xs">
                {questions.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="font-bold w-4 text-right">{idx + 1}.</span>
                    <div className="flex items-center gap-1">
                      {['A', 'B', 'C', 'D', 'E'].map(letter => (
                        <span 
                          key={letter} 
                          className="w-4 h-4 rounded-full border border-black flex items-center justify-center text-[9px] font-bold"
                        >
                          {letter}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Key (Table) */}
          {showAnswerKey && questions.length > 0 && (
            <div className="page-break-avoid break-inside-avoid mt-8 pt-6 border-t border-dashed border-zinc-400 font-sans">
              <div className="font-bold text-xs uppercase tracking-wide mb-2 flex items-center gap-1.5 text-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 print:text-black" />
                <span>ÖĞRETMEN CEVAP ANAHTARI:</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {questions.map((q, idx) => (
                  <div key={idx} className="px-2 py-1 border border-zinc-300 print:border-black rounded bg-zinc-50 print:bg-transparent">
                    <span className="text-zinc-500 print:text-black mr-1">{idx + 1}:</span>
                    <span className="font-bold text-black">{q.correct_option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Solutions (Optional) */}
          {showSolutions && questions.length > 0 && (
            <div className="page-break-before break-before-page mt-8 pt-6 border-t-2 border-black font-sans">
              <div className="text-sm font-black uppercase tracking-wide mb-4 text-center">
                {schoolName} - AYRINTILI SORU VE ÇÖZÜM KİTAPÇIĞI
              </div>
              <div className="space-y-4 text-xs">
                {questions.map((q, idx) => (
                  <div key={idx} className="page-break-avoid break-inside-avoid p-3 border border-zinc-200 print:border-black rounded-lg">
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>Soru {idx + 1} ({q.topic || 'Genel'})</span>
                      <span>Doğru Cevap: {q.correct_option}</span>
                    </div>
                    <div className="text-zinc-700 print:text-black leading-relaxed">
                      <MathRenderer text={q.explanation || 'Açıklama mevcut değil.'} content={q.explanation || 'Açıklama mevcut değil.'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
