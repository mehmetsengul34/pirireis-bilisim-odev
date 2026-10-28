import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * Türkçe Karakter ve LaTeX Güvenlik Sanitizer'ı:
 * Formül içinde (\text{} dışında) kalmış Türkçe karakterli kelimeleri KaTeX için güvenli \text{} bloklarına çevirir.
 * Ayrıca unicode üs (², ³), derece (°) ve kök sembollerini KaTeX standardına normalize eder.
 */
function sanitizeFormulaForKatex(formula) {
  if (!formula) return '';
  let f = formula;

  // 1. Unicode üsleri KaTeX LaTeX formatına dönüştür
  f = f.replace(/²/g, '^{2}');
  f = f.replace(/³/g, '^{3}');
  f = f.replace(/⁴/g, '^{4}');
  f = f.replace(/⁵/g, '^{5}');
  f = f.replace(/⁰/g, '^{0}');
  f = f.replace(/¹/g, '^{1}');
  f = f.replace(/⁻¹/g, '^{-1}');
  f = f.replace(/⁻²/g, '^{-2}');

  // 2. Derece sembolü ve bozuk varyasyonlarını tek seferde temiz ve standart hale getir:
  // Örn: 108^{^{\circ}}, 60^^\circ, 30^°, 30°, 60^\circ, 90\circ
  f = f.replace(/\^+\{*\s*\^+\{*\s*\\circ\}*\}*/g, '^{\\circ}');
  f = f.replace(/\^+\{*\s*°\}*/g, '^{\\circ}');
  f = f.replace(/°/g, '^{\\circ}');
  f = f.replace(/\^+\{*\s*\\circ\}*/g, '^{\\circ}');
  f = f.replace(/(?<=[0-9a-zA-Z])\s*\\circ(?![a-zA-Z])/g, '^{\\circ}');
  f = f.replace(/(?<=[0-9])\s*\^0\b/g, '^{\\circ}');
  
  // Çift üs kalıntısı kalmışsa temizle:
  f = f.replace(/\^\{\s*\^\{\\circ\}\s*\}/g, '^{\\circ}');
  f = f.replace(/\^\{\s*\{\\circ\}\s*\}/g, '^{\\circ}');

  // 3. Kök işaretleri
  f = f.replace(/√([0-9a-zA-Z]+)/g, '\\sqrt{$1}');
  f = f.replace(/√\(([^)]+)\)/g, '\\sqrt{$1}');

  // 4. Semboller
  f = f.replace(/·/g, '\\cdot ');
  f = f.replace(/×/g, '\\times ');
  f = f.replace(/÷/g, '\\div ');
  f = f.replace(/≤/g, '\\le ');
  f = f.replace(/≥/g, '\\ge ');
  f = f.replace(/≠/g, '\\ne ');
  f = f.replace(/±/g, '\\pm ');

  // 5. Eğer \text{...} içinde değilse ve Türkçe karakter içeriyorsa \text{} içine al
  const turkishRegex = /(?<!\\text\{)([a-zA-ZçğıöşüÇĞİÖŞÜ]+[çğıöşüÇĞİÖŞÜ][a-zA-ZçğıöşüÇĞİÖŞÜ]*)/g;
  const parts = [];
  let lastIndex = 0;
  const textBlockRegex = /\\text\{([^}]*)\}/g;
  let match;

  while ((match = textBlockRegex.exec(f)) !== null) {
    const before = f.substring(lastIndex, match.index);
    parts.push(before.replace(turkishRegex, (_m, g1) => `\\text{${g1}}`));
    parts.push(match[0]);
    lastIndex = match.index + match[0].length;
  }

  const remainder = f.substring(lastIndex);
  parts.push(remainder.replace(turkishRegex, (_m, g1) => `\\text{${g1}}`));

  return parts.join('');
}

/**
 * Matematiksel metinleri, formülleri, üs ve derece sembollerini otomatik normalize eder.
 * Ham LaTeX ifadelerini (örn. 108^\circ, 74\pi, \sqrt{3}/2, x^2) veya üslü/dereceli şıkları
 * KaTeX'in işleyebileceği $...$ bloklarına sarar.
 * Zaten $...$ veya $$...$$ içinde olan ifadelere dokunmaz (iç içe dolar işareti oluşturmaz).
 */
function normalizeMathText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText;

  const trimmed = text.trim();
  // Zaten tek başına $...$ veya $$...$$ ise olduğu gibi bırak
  if (/^\$[^$]+\$$|^\$\$[\s\S]+\$\$$/.test(trimmed)) {
    return trimmed;
  }

  // 1. Eğer tüm metin tek bir seçenek veya kısa matematiksel ifade ise ($ işareti olmadan yazılmışsa)
  const hasLaTeXOrMath = /[\\^_²³°√π±≤≥≠÷×]|\b(cm|m|mm|km|dm)\^[23]\b|\b[a-zA-Z0-9]\^[0-9]/i.test(trimmed);
  const wordCount = (trimmed.match(/[a-zA-ZçğıöşüÇĞİÖŞÜ]{4,}/g) || []).length;

  if (hasLaTeXOrMath && wordCount <= 2 && !trimmed.includes('$')) {
    return '$' + trimmed + '$';
  }

  // 2. Metin içinde var olan math bloklarını ($...$ ve $$...$$) ayır.
  // SADECE formül DIŞINDAKİ düz metin parçalarına regex uygulayacağız!
  const mathBlockRegex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
  const segments = [];
  let lastIndex = 0;
  let match;

  while ((match = mathBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ isMath: false, value: text.substring(lastIndex, match.index) });
    }
    segments.push({ isMath: true, value: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ isMath: false, value: text.substring(lastIndex) });
  }

  const processed = segments.map(seg => {
    if (seg.isMath) return seg.value;
    let s = seg.value;

    // A. Formül dışı derece kalıpları: 108^\circ, 30°, 60^{\circ} -> $108^{\circ}$
    s = s.replace(/\b([0-9]+)\s*\^+\{*\s*\\circ\}*/g, (_m, g1) => `$${g1}^{\\circ}$`);
    s = s.replace(/\b([0-9]+)\s*°/g, (_m, g1) => `$${g1}^{\\circ}$`);
    s = s.replace(/\b([0-9]+)\s*\\circ\b/g, (_m, g1) => `$${g1}^{\\circ}$`);

    // B. Formül dışı pi sayısı
    s = s.replace(/\b([0-9]+)\s*\\pi\b/g, (_m, g1) => `$${g1}\\pi$`);
    s = s.replace(/(?<![a-zA-Z0-9])\\pi\b/g, '$\\pi$');

    // C. Alan ve hacim birimleri: 12 cm², 5 m³, 10 cm^2
    s = s.replace(/\b([0-9]+)\s*(cm|m|mm|km|dm)[\^]?[2²](?![a-zA-Z0-9])/gi, (_m, num, unit) => `$${num}\\text{ ${unit}}^2$`);
    s = s.replace(/\b([0-9]+)\s*(cm|m|mm|km|dm)[\^]?[3³](?![a-zA-Z0-9])/gi, (_m, num, unit) => `$${num}\\text{ ${unit}}^3$`);

    // D. Değişken kare ve küpleri: 2x^2, x^2, x², y³
    s = s.replace(/\b([0-9]*[a-zA-Z])\s*\^\s*([0-9]+)\b/g, (_m, base, exp) => `$${base}^{${exp}}$`);
    s = s.replace(/\b([0-9]*[a-zA-Z])([²³⁴])(?![a-zA-Z0-9])/g, (_m, base, p) => {
      const exp = p === '²' ? '2' : p === '³' ? '3' : '4';
      return `$${base}^{${exp}}$`;
    });

    return s;
  });

  return processed.join('');
}

/**
 * Düz metin token'larında kalmış derece (°) veya üs (², ³, ^2, ^3) işaretlerini
 * HTML elemanları ile temiz ve şık render eder.
 */
function renderPlainTextWithMathSymbols(rawStr) {
  if (!rawStr) return null;

  // Temizlik: Ham ^\circ kalıntılarını dereceye çevir
  let str = rawStr.replace(/\^\\circ/g, '°').replace(/\\circ/g, '°');

  // Regex ile üs ve derece sembollerine göre parçala
  const regex = /(°|²|³|⁴|(?:\b[a-zA-Z0-9]+)?\^[0-9]+)/g;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token === '°') {
      parts.push(<span key={match.index} className="inline-block font-sans text-amber-600 dark:text-amber-400 print:!text-black font-semibold px-0.5">°</span>);
    } else if (token === '²') {
      parts.push(<sup key={match.index} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 print:!text-black">2</sup>);
    } else if (token === '³') {
      parts.push(<sup key={match.index} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 print:!text-black">3</sup>);
    } else if (token === '⁴') {
      parts.push(<sup key={match.index} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 print:!text-black">4</sup>);
    } else if (token.includes('^')) {
      const [base, exp] = token.split('^');
      parts.push(
        <span key={match.index} className="inline-block print:!text-black">
          {base && <span>{base}</span>}
          <sup className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 print:!text-black">{exp}</sup>
        </span>
      );
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length > 0 ? parts : str;
}

/**
 * MathRenderer:
 * Matematik formüllerini ($...$ ve $$...$$), üs (kare, küp), derece işaretlerini
 * ve Türkçe karakterleri kusursuz ve estetik olarak render eder.
 */
export default function MathRenderer({ text, content, value, children, className = '' }) {
  const rawText = text ?? content ?? value ?? (typeof children === 'string' ? children : '') ?? '';

  const renderedContent = useMemo(() => {
    if (!rawText) return null;

    // Önce metni normalize et (derece, kare, küp, pi ve ham formülleri $...$ içine sar)
    const normalized = normalizeMathText(rawText);

    // Metni satırlara ayır
    const lines = normalized.split('\n');

    return lines.map((line, lineIdx) => {
      // Satır içi parçalama: Önce $$...$$ (display math), sonra $...$ (inline math), sonra **...** (bold)
      const tokenRegex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$|\*\*[^*]+?\*\*)/g;
      const tokens = [];
      let lastPos = 0;
      let tokenMatch;

      while ((tokenMatch = tokenRegex.exec(line)) !== null) {
        if (tokenMatch.index > lastPos) {
          tokens.push({
            type: 'text',
            value: line.substring(lastPos, tokenMatch.index)
          });
        }

        const matchStr = tokenMatch[0];
        if (matchStr.startsWith('$$') && matchStr.endsWith('$$')) {
          tokens.push({
            type: 'block-math',
            value: matchStr.slice(2, -2)
          });
        } else if (matchStr.startsWith('$') && matchStr.endsWith('$')) {
          tokens.push({
            type: 'inline-math',
            value: matchStr.slice(1, -1)
          });
        } else if (matchStr.startsWith('**') && matchStr.endsWith('**')) {
          tokens.push({
            type: 'bold',
            value: matchStr.slice(2, -2)
          });
        }

        lastPos = tokenMatch.index + matchStr.length;
      }

      if (lastPos < line.length) {
        tokens.push({
          type: 'text',
          value: line.substring(lastPos)
        });
      }

      return (
        <span key={lineIdx} className="block leading-relaxed print:!text-black">
          {tokens.map((token, tokIdx) => {
            if (token.type === 'block-math') {
              try {
                const safeFormula = sanitizeFormulaForKatex(token.value);
                const html = katex.renderToString(safeFormula, {
                  displayMode: true,
                  throwOnError: false,
                  output: 'html'
                });
                return (
                  <span
                    key={tokIdx}
                    className="block my-2 text-center overflow-x-auto py-1 print:!text-black"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch (_e) {
                return (
                  <span key={tokIdx} className="block my-1 font-mono text-xs text-rose-500">
                    $${token.value}$$
                  </span>
                );
              }
            } else if (token.type === 'inline-math') {
              try {
                const safeFormula = sanitizeFormulaForKatex(token.value);
                const html = katex.renderToString(safeFormula, {
                  displayMode: false,
                  throwOnError: false,
                  output: 'html'
                });
                return (
                  <span
                    key={tokIdx}
                    className="inline-block px-0.5 align-middle print:!text-black"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch (_e) {
                return (
                  <span key={tokIdx} className="font-mono text-xs text-rose-500">
                    ${token.value}$
                  </span>
                );
              }
            } else if (token.type === 'bold') {
              return (
                <strong key={tokIdx} className="font-semibold text-zinc-900 dark:text-zinc-100 print:!text-black print:dark:!text-black">
                  {renderPlainTextWithMathSymbols(token.value)}
                </strong>
              );
            } else {
              return (
                <span key={tokIdx} className="print:!text-black">
                  {renderPlainTextWithMathSymbols(token.value)}
                </span>
              );
            }
          })}
        </span>
      );
    });
  }, [rawText]);

  return <div className={`math-content select-text print:!text-black ${className}`}>{renderedContent}</div>;
}
