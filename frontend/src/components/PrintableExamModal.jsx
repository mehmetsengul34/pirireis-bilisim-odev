import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Printer, X, CheckCircle2, ShieldCheck, EyeOff, KeyRound, Sliders, FileText } from 'lucide-react';
import MathRenderer from './MathRenderer';

export default function PrintableExamModal({ 
  questions = [], 
  defaultSubject = 'Matematik', 
  defaultTitle = '',
  onClose 
}) {
  // Güvenli Soru Listesi ve Tekilleştirme (Soru kökü benzer diye geçerli soruları asla silme)
  const uniqueQuestions = useMemo(() => {
    if (!Array.isArray(questions) || questions.length === 0) return [];
    const seenIds = new Set();
    const seenSignatures = new Set();
    const result = [];

    for (const q of questions) {
      if (!q) continue;
      
      // 1. ID varsa ID üzerinden tekilleştir
      if (q.id !== undefined && q.id !== null) {
        if (seenIds.has(q.id)) continue;
        seenIds.add(q.id);
        result.push(q);
        continue;
      }

      // 2. ID yoksa soru metni + şıklar üzerinden tam parmak iziyle tekilleştir
      const rawText = (q.question_text || q.text || '').trim();
      const sig = `${rawText}:::${q.option_a || ''}:::${q.option_b || ''}:::${q.option_c || ''}`;
      if (seenSignatures.has(sig)) continue;
      seenSignatures.add(sig);
      result.push(q);
    }
    return result;
  }, [questions]);

  const [questionLimit, setQuestionLimit] = useState(
    uniqueQuestions.length > 40 ? 20 : uniqueQuestions.length
  );

  // Görüntülenecek ve basılacak soru alt kümesi
  const displayedQuestions = useMemo(() => {
    if (questionLimit <= 0 || questionLimit >= uniqueQuestions.length) {
      return uniqueQuestions;
    }
    return uniqueQuestions.slice(0, questionLimit);
  }, [uniqueQuestions, questionLimit]);

  const [schoolName, setSchoolName] = useState('Piri Reis Ticaret Mesleki ve Teknik Anadolu Lisesi');
  const [examTitle, setExamTitle] = useState(
    defaultTitle || `${defaultSubject} Sınavı`
  );
  const [academicYear, setAcademicYear] = useState('2025 - 2026 Eğitim Öğretim Yılı');
  const [examDuration, setExamDuration] = useState(
    displayedQuestions.length > 0 
      ? Math.min(180, Math.max(20, Math.round(displayedQuestions.length * 2.5)))
      : 40
  );

  useEffect(() => {
    if (defaultTitle) {
      setExamTitle(defaultTitle);
    }
  }, [defaultTitle]);

  useEffect(() => {
    if (displayedQuestions.length > 0) {
      const autoDur = Math.min(180, Math.max(20, Math.round(displayedQuestions.length * 2.5)));
      setExamDuration(autoDur);
    }
  }, [displayedQuestions.length]);

  // Toggles (Varsayılan olarak öğrenci test kağıdı temiz ve sade gelir)
  const [twoColumns, setTwoColumns] = useState(true);
  const [showAnswerKey, setShowAnswerKey] = useState(false); // Varsayılan kapalı (öğrenci kağıdında cevap yazmaz)
  const [showSolutions, setShowSolutions] = useState(false);

  // 1. Fiziksel Yazıcılar İçin Doğrudan ve İzole Baskı Motoru (HP, Canon, Epson, Brother)
  // SPA kökünü veya modal katmanlarını bypass ederek sadece sınav kağıdını saf HTML olarak yazıcı kuyruğuna gönderir.
  const handleDirectPrinter = () => {
    const paperElement = document.getElementById('printable-exam-paper-content');
    if (!paperElement) {
      window.print();
      return;
    }

    const oldIframe = document.getElementById('direct-printer-iframe');
    if (oldIframe) {
      oldIframe.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'direct-printer-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    const styleSheets = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(node => node.outerHTML)
      .join('\n');

    const iframeDoc = iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="utf-8" />
        <title>${examTitle || 'Sınav Kağıdı'}</title>
        ${styleSheets}
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm 12mm 12mm 12mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            font-family: "Times New Roman", Times, Georgia, serif !important;
            font-size: 10pt !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * {
            color: #000000 !important;
            -webkit-text-fill-color: #000000 !important;
            text-shadow: none !important;
            box-sizing: border-box !important;
          }
          .printable-columns-2 {
            display: block !important;
            column-count: 2 !important;
            -webkit-column-count: 2 !important;
            column-gap: 22px !important;
            column-rule: 1px solid #000000 !important;
            width: 100% !important;
          }
          .printable-question-item {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            -webkit-column-break-inside: avoid !important;
            margin-bottom: 16px !important;
            padding-bottom: 12px !important;
            border-bottom: 1px solid #000000 !important;
            display: block !important;
          }
          svg {
            background: #ffffff !important;
            background-color: #ffffff !important;
            max-width: 250px !important;
            height: auto !important;
            display: block !important;
            margin: 4px auto !important;
            border: 1px solid #000000 !important;
            border-radius: 4px !important;
          }
          svg text {
            fill: #000000 !important;
            font-weight: bold !important;
          }
          svg line, svg rect, svg polygon, svg circle, svg path {
            stroke: #000000 !important;
          }
          .page-break-before {
            break-before: page !important;
            page-break-before: always !important;
          }
          .katex {
            font-size: 1em !important;
            color: #000000 !important;
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; max-width: 100%; margin: 0; padding: 0;">
          ${paperElement.innerHTML}
        </div>
      </body>
      </html>
    `);
    iframeDoc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (err) {
        console.error('Doğrudan yazdırma başarısız oldu, sistem yazdırmaya geçiliyor:', err);
        window.print();
      }
    }, 300);
  };

  // 2. Sistem Penceresi & PDF Olarak Kaydetme
  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 50);
  };

  return createPortal(
    <div className="printable-portal-root fixed inset-0 z-[100] overflow-y-auto bg-black/70 backdrop-blur-sm flex justify-center items-start p-2 sm:p-6 py-6 sm:py-10 printable-exam-modal-wrapper">
      
      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl flex flex-col my-0 border border-zinc-200 dark:border-zinc-800 printable-exam-container overflow-hidden">
        
        {/* Top Control Bar (Baskıda gizlenir) */}
        <div className="no-print p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-850/80 rounded-t-3xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>A4 Kağıt Sınav Baskı & Önizleme</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                  {displayedQuestions.length} Soru Baskıya Hazır
                </span>
                {uniqueQuestions.length > displayedQuestions.length && (
                  <span className="px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-semibold">
                    (Toplam {uniqueQuestions.length} sorudan seçildi)
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                ÖSYM & MEB standartlarında 2 sütunlu A4 sınav kağıdı şablonu (Fiziksel yazıcı ve PDF uyumlu).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDirectPrinter}
              disabled={displayedQuestions.length === 0}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
              title="Fiziksel masaüstü yazıcınıza doğrudan gönderir (HP, Canon, Epson, Brother)"
            >
              <Printer className="w-4 h-4" />
              <span>Yazıcıya Gönder (Fiziksel)</span>
            </button>
            <button
              onClick={handlePrint}
              disabled={displayedQuestions.length === 0}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
              title="PDF Olarak Kaydet / Sistem Önizlemesi"
            >
              <FileText className="w-4 h-4" />
              <span>PDF Olarak Kaydet</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition cursor-pointer"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Configuration Bar (Baskıda gizlenir) */}
        <div className="no-print p-4 bg-zinc-100/60 dark:bg-zinc-850/40 border-b border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
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

            {/* Soru Sayısı Sınırlandırıcısı (Soru bankasından toplu baskı alırken kolaylık) */}
            {uniqueQuestions.length > 20 && (
              <div className="min-w-[170px]">
                <label className="block text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mb-1 flex items-center gap-1">
                  <Sliders className="w-3 h-3 text-indigo-500" />
                  <span>Basılacak Soru Sayısı:</span>
                </label>
                <select
                  value={questionLimit}
                  onChange={(e) => setQuestionLimit(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                >
                  <option value={uniqueQuestions.length}>Tüm Sorular ({uniqueQuestions.length})</option>
                  <option value={10}>İlk 10 Soru (Hızlı Test)</option>
                  <option value={20}>İlk 20 Soru (Deneme Boyutu)</option>
                  {uniqueQuestions.length >= 40 && (
                    <option value={40}>İlk 40 Soru (Tam Format)</option>
                  )}
                </select>
              </div>
            )}
          </div>

          {/* Sınav Baskı Modu & Cevap Anahtarı Güvenlik Butonları */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 mr-1">Baskı Türü:</span>
              <div className="inline-flex p-1 rounded-xl bg-zinc-200/80 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setShowAnswerKey(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    !showAnswerKey
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Öğrenci Sınavı (Cevaplar Gizli)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAnswerKey(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    showAnswerKey
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>+ Cevap Anahtarı (Ek Sayfa)</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
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
                  checked={showSolutions}
                  onChange={(e) => setShowSolutions(e.target.checked)}
                  className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">Çözüm Kitapçığı</span>
              </label>
            </div>
          </div>

          <div className="text-[11px] flex items-center gap-2 pt-1">
            {!showAnswerKey ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Öğrenci Sınav Kağıdı: Cevaplar ve çözümler hiçbir sayfada basılmaz.</span>
              </span>
            ) : (
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Öğretmen Modu: Cevap anahtarı öğrenci sorularından sonra ayrı bir sayfada basılacaktır.</span>
              </span>
            )}
          </div>
        </div>

        {/* Printable Document Paper (Önizleme ve Baskı Birebir Aynı) */}
        <div 
          id="printable-exam-paper-content"
          className="p-6 sm:p-10 bg-white text-black font-serif printable-paper overflow-y-auto max-h-[72vh] print:max-h-none print:overflow-visible"
        >
          
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
              <span className="font-bold">Soru Sayısı:</span> {displayedQuestions.length} Soru
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
              * Bu sınavda {displayedQuestions.length} soru bulunmaktadır. Her sorunun tek bir doğru cevabı vardır. Başarılar dileriz.
            </span>
          </div>

          {displayedQuestions.length === 0 ? (
            <div className="py-12 text-center text-black font-sans space-y-2 border-2 border-dashed border-zinc-300 rounded-xl p-8">
              <p className="font-bold text-sm">Yazdırılacak soru bulunamadı.</p>
              <p className="text-xs text-zinc-600">Lütfen soru bankasından en az bir soru seçiniz veya bir sınav kartı üzerindeki "Yazdır" butonuna basınız.</p>
            </div>
          ) : (
            /* Questions Layout (2 Sütun ÖSYM Kitapçık Düzeni) */
            <div className={twoColumns ? 'printable-columns-2' : 'space-y-6'}>
              {displayedQuestions.map((q, idx) => {
                const qNum = idx + 1;
                const isLgsQuestion = q.exam_type === 'LGS' || defaultSubject === 'LGS' || (!q.option_e && q.exam_type !== 'AYT' && q.exam_type !== 'TYT');

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

                    {/* Vektörel SVG Çizimi (Açık Zemin / Yüksek Kontrast) */}
                    {q.visual_svg && (
                      <div className="my-2 p-1.5 bg-white flex justify-center overflow-hidden printable-svg-container">
                        <div className="max-w-[260px] w-full" dangerouslySetInnerHTML={{ __html: q.visual_svg }} />
                      </div>
                    )}

                    {/* Soru Metni (MathRenderer) */}
                    <div className="text-xs sm:text-[13px] leading-relaxed mb-3 text-black font-serif">
                      <MathRenderer text={q.question_text || q.text || ''} content={q.question_text || q.text || ''} />
                    </div>

                    {/* Şıklar (A, B, C, D, E) - Asla doğru cevap işareti barındırmaz */}
                    <div className="space-y-1.5 text-xs font-sans text-black">
                      {['A', 'B', 'C', 'D', 'E'].map((opt) => {
                        const optText = q[`option_${opt.toLowerCase()}`];
                        if (opt === 'E' && isLgsQuestion) return null;
                        if (opt === 'E' && (!optText || optText.trim() === '' || optText.trim() === '-')) return null;

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
          {showAnswerKey && displayedQuestions.length > 0 && (
            <div className="page-break-before break-before-page mt-8 pt-6 border-t-2 border-black font-sans text-black">
              <div className="font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>{schoolName} - ÖĞRETMEN CEVAP ANAHTARI</span>
              </div>
              <p className="text-xs text-zinc-600 mb-4">
                Not: Bu sayfa öğretmen kontrolü içindir, öğrenci test kağıdından ayrı bir sayfada basılır.
              </p>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-xs font-mono">
                {displayedQuestions.map((q, idx) => (
                  <div key={idx} className="p-1.5 border border-black rounded text-center">
                    <span className="text-zinc-600 mr-1">{idx + 1}:</span>
                    <span className="font-bold text-black">{q.correct_option || q.correct_answer || '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ayrıntılı Çözüm Kitapçığı (Sadece seçilirse AYRI SAYFADA çıkar) */}
          {showSolutions && displayedQuestions.length > 0 && (
            <div className="page-break-before break-before-page mt-8 pt-6 border-t-2 border-black font-sans text-black">
              <div className="text-sm font-black uppercase tracking-wide mb-4 text-center">
                {schoolName} - AYRINTILI SORU VE ÇÖZÜM KİTAPÇIĞI
              </div>
              <div className="space-y-4 text-xs">
                {displayedQuestions.map((q, idx) => (
                  <div key={idx} className="page-break-avoid break-inside-avoid p-3 border border-black rounded-lg">
                    <div className="flex items-center justify-between font-bold mb-1.5">
                      <span>Soru {idx + 1} ({q.topic || 'Genel'})</span>
                      <span className="px-2 py-0.5 border border-black rounded">Doğru Cevap: {q.correct_option || q.correct_answer || '-'}</span>
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
    </div>,
    document.body
  );
}
