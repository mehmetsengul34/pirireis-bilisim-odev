import React, { useState, useMemo } from 'react';
import { Printer, X, FileText, CheckCircle2, Columns } from 'lucide-react';
import MathRenderer from './MathRenderer';

export default function PrintableExamModal({ 
  questions = [], 
  defaultSubject = 'Matematik', 
  defaultTitle = '',
  onClose 
}) {
  // Tekrar eden soruları filtrele (Aynı sorunun birden fazla kez yer almasını engelle)
  const uniqueQuestions = useMemo(() => {
    const seenTexts = new Set();
    const seenIds = new Set();
    const result = [];
    for (const q of questions) {
      if (!q) continue;
      if (q.id && seenIds.has(q.id)) continue;
      
      const rawText = (q.question_text || '').trim();
      if (!rawText) continue;
      
      const textKey = rawText.toLowerCase().replace(/[^a-z0-9ğüşıöç]/g, '');
      if (!textKey || seenTexts.has(textKey)) continue;

      if (q.id) seenIds.add(q.id);
      seenTexts.add(textKey);
      result.push(q);
    }
    return result;
  }, [questions]);

  const duplicatesFiltered = questions.length - uniqueQuestions.length;

  const [schoolName, setSchoolName] = useState('Piri Reis Ticaret Mesleki ve Teknik Anadolu Lisesi');
  const [examTitle, setExamTitle] = useState(defaultTitle || `${defaultSubject} YKS Kazanım ve Deneme Sınavı`);
  const [academicYear, setAcademicYear] = useState('2025 - 2026 Eğitim Öğretim Yılı');
  const [examDuration, setExamDuration] = useState(
    uniqueQuestions.length > 0 
      ? (uniqueQuestions.length * 2.5 > 120 ? 120 : Math.max(30, Math.round(uniqueQuestions.length * 2.5))) 
      : 40
  );
  
  // Toggles (Varsayılan olarak öğrenci test kağıdı temiz ve sade gelir)
  const [twoColumns, setTwoColumns] = useState(true);
  const [showAnswerKey, setShowAnswerKey] = useState(false); // Varsayılan kapalı (öğrenci kağıdında cevap yazmaz)
  const [showSolutions, setShowSolutions] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-center p-2 sm:p-4 printable-exam-modal-wrapper">
      
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col my-auto border border-zinc-200 dark:border-zinc-800 printable-exam-container">
        
        {/* Top Control Bar (Baskıda gizlenir) */}
        <div className="no-print p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/80 rounded-t-3xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>A4 Kağıt Sınav Baskı Modülü</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  {uniqueQuestions.length} Özgün Soru
                </span>
                {duplicatesFiltered > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                    {duplicatesFiltered} Tekrar Eden Soru Elendi
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                ÖSYM & MEB standartlarında 2 sütunlu A4 sınav kağıdı şablonu.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              disabled={uniqueQuestions.length === 0}
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

        {/* Print Configuration Bar (Baskıda gizlenir) */}
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
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">2 Sütun (Kitapçık Düzeni)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showAnswerKey}
                onChange={(e) => setShowAnswerKey(e.target.checked)}
                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Cevap Anahtarı (Ayrı Sayfa)</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSolutions}
                onChange={(e) => setShowSolutions(e.target.checked)}
                className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Ayrıntılı Çözüm Kitapçığı</span>
            </label>
          </div>
        </div>

        {/* Printable Document Paper (Önizleme ve Baskı Birebir Aynı) */}
        <div className="p-6 sm:p-10 bg-white text-black font-serif printable-paper overflow-y-auto max-h-[75vh] print:max-h-none print:overflow-visible">
          
          {/* Sınav Başlığı / Header */}
          <div className="border-b-2 border-black pb-3 mb-4 text-center space-y-1">
            <div className="text-[11px] uppercase tracking-widest font-sans font-bold text-black">
              T.C. MİLLÎ EĞİTİM BAKANLIĞI
            </div>
            <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-black font-sans">
              {schoolName}
            </h1>
            <div className="text-xs sm:text-sm font-bold uppercase text-black font-sans">
              {academicYear} • {examTitle}
            </div>
          </div>

          {/* Öğrenci Bilgi Alanı */}
          <div className="border border-black p-2.5 rounded-lg mb-5 text-[11px] font-sans grid grid-cols-2 sm:grid-cols-4 gap-y-1.5 gap-x-3 text-black">
            <div className="col-span-2">
              <span className="font-bold">Adı Soyadı:</span> ................................................................
            </div>
            <div>
              <span className="font-bold">Sınıfı / Şubesi:</span> ....................
            </div>
            <div>
              <span className="font-bold">Okul No:</span> ....................
            </div>
            <div>
              <span className="font-bold">Ders:</span> {defaultSubject}
            </div>
            <div>
              <span className="font-bold">Soru Sayısı:</span> {uniqueQuestions.length} Soru
            </div>
            <div>
              <span className="font-bold">Süre:</span> {examDuration} Dakika
            </div>
            <div>
              <span className="font-bold">Tarih:</span> ___ / ___ / 2026
            </div>
          </div>

          {/* Sınav Yönergesi */}
          <div className="border-b border-black pb-2 mb-5 text-[11px] font-sans flex items-center justify-between text-black">
            <span className="font-bold">SINAV YÖNERGESİ:</span>
            <span className="italic">
              * Bu sınavda {uniqueQuestions.length} soru bulunmaktadır. Her sorunun tek bir doğru cevabı vardır. Başarılar dileriz.
            </span>
          </div>

          {uniqueQuestions.length === 0 ? (
            <div className="py-12 text-center text-black font-sans space-y-2 border-2 border-dashed border-zinc-300 rounded-xl p-8">
              <p className="font-bold text-sm">Yazdırılacak soru bulunamadı.</p>
              <p className="text-xs text-zinc-600">Lütfen soru bankasından en az bir soru seçiniz veya bir sınav kartı üzerindeki "Yazdır" butonuna basınız.</p>
            </div>
          ) : (
            /* Questions Layout (2 Sütun ÖSYM Kitapçık Düzeni) */
            <div className={twoColumns ? 'printable-columns-2' : 'space-y-6'}>
              {uniqueQuestions.map((q, idx) => {
                const qNum = idx + 1;
                return (
                  <div 
                    key={q.id || idx} 
                    className="printable-question-item page-break-avoid break-inside-avoid"
                  >
                    {/* Soru No & Konu Başlığı */}
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="font-black text-sm font-sans flex items-center gap-1.5 text-black">
                        <span className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-xs font-bold font-sans">
                          {qNum}
                        </span>
                      </span>
                      {q.topic && (
                        <span className="text-[10px] text-zinc-600 font-sans italic font-medium">
                          ({q.topic})
                        </span>
                      )}
                    </div>

                    {/* Vektörel SVG Çizimi (Varsa) */}
                    {q.visual_svg && (
                      <div className="my-2 p-1.5 bg-white flex justify-center overflow-hidden printable-svg-container">
                        <div className="max-w-[260px] w-full" dangerouslySetInnerHTML={{ __html: q.visual_svg }} />
                      </div>
                    )}

                    {/* Soru Metni (MathRenderer) */}
                    <div className="text-xs sm:text-[13px] leading-relaxed mb-3 text-black font-serif">
                      <MathRenderer text={q.question_text} content={q.question_text} />
                    </div>

                    {/* Şıklar (A, B, C, D, E) - Asla doğru cevap işareti barındırmaz */}
                    <div className="space-y-1.5 text-xs font-sans text-black">
                      {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                        const optText = q[`option_${opt.toLowerCase()}`];
                        if (!optText && opt === 'E' && defaultSubject === 'LGS') return null;
                        return (
                          <div key={opt} className="flex items-start gap-1.5">
                            <span className="font-bold text-xs shrink-0 w-4 text-black">
                              {opt})
                            </span>
                            <div className="min-w-0 text-black leading-snug">
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

          {/* Öğretmen Cevap Anahtarı (Öğrenci kağıdında yer almaz, sadece seçilirse AYRI SAYFADA çıkar) */}
          {showAnswerKey && uniqueQuestions.length > 0 && (
            <div className="page-break-before break-before-page mt-8 pt-6 border-t-2 border-black font-sans text-black">
              <div className="font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>{schoolName} - ÖĞRETMEN CEVAP ANAHTARI</span>
              </div>
              <p className="text-xs text-zinc-600 mb-4">
                Not: Bu sayfa öğretmen kontrolü içindir, öğrenci test kağıdından ayrı bir sayfada basılır.
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-xs font-mono">
                {uniqueQuestions.map((q, idx) => (
                  <div key={idx} className="p-1.5 border border-black rounded text-center">
                    <span className="text-zinc-600 mr-1">{idx + 1}:</span>
                    <span className="font-bold text-black">{q.correct_option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ayrıntılı Çözüm Kitapçığı (Sadece seçilirse AYRI SAYFADA çıkar) */}
          {showSolutions && uniqueQuestions.length > 0 && (
            <div className="page-break-before break-before-page mt-8 pt-6 border-t-2 border-black font-sans text-black">
              <div className="text-sm font-black uppercase tracking-wide mb-4 text-center">
                {schoolName} - AYRINTILI SORU VE ÇÖZÜM KİTAPÇIĞI
              </div>
              <div className="space-y-4 text-xs">
                {uniqueQuestions.map((q, idx) => (
                  <div key={idx} className="page-break-avoid break-inside-avoid p-3 border border-black rounded-lg">
                    <div className="flex items-center justify-between font-bold mb-1.5">
                      <span>Soru {idx + 1} ({q.topic || 'Genel'})</span>
                      <span className="px-2 py-0.5 border border-black rounded">Doğru Cevap: {q.correct_option}</span>
                    </div>
                    <div className="text-black leading-relaxed">
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
