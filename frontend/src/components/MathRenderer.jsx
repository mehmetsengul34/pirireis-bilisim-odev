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

  // 1. Unicode üsleri, dereceyi ve sembolleri KaTeX LaTeX formatına dönüştür
  f = f.replace(/²/g, '^{2}');
  f = f.replace(/³/g, '^{3}');
  f = f.replace(/⁴/g, '^{4}');
  f = f.replace(/⁵/g, '^{5}');
  f = f.replace(/⁰/g, '^{0}');
  f = f.replace(/¹/g, '^{1}');
  f = f.replace(/°/g, '^{\\circ}');
  f = f.replace(/\^\\circ(?!\w)/g, '^{\\circ}');
  f = f.replace(/\\circ(?!\w)/g, '^{\\circ}');
  f = f.replace(/\^0\b/g, '^{\\circ}'); // 30^0 -> 30^{\circ}
  f = f.replace(/√([0-9a-zA-Z]+)/g, '\\sqrt{$1}');

  // 2. Eğer \text{...} içinde değilse ve Türkçe karakter içeriyorsa \text{} içine al
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
 */
function normalizeMathText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText;

  // 1. Eğer tüm metin tek bir seçenek veya kısa matematiksel ifade ise ($ işareti olmadan yazılmışsa)
  // Örn: '93^\circ', '108^\circ', '74\pi', '\sqrt{3}/2', 'x^2 + 4', '30°', 'x²', 'x³', '12 cm^2'
  const trimmed = text.trim();
  const hasLaTeXOrMath = /[\\^_²³°√π±≤≥≠÷×]|\b(cm|m|mm|km|dm)\^[23]\b|\b[a-zA-Z]\^[0-9]/i.test(trimmed);
  const wordCount = (trimmed.match(/[a-zA-ZçğıöşüÇĞİÖŞÜ]{4,}/g) || []).length;

  if (!trimmed.startsWith('$') && hasLaTeXOrMath && wordCount <= 2) {
    text = '$' + trimmed + '$';
  }

  // 2. Metin içinde $...$ blokları dışındaki derece kalıplarını algıla ve $ içine al
  // 108^\circ -> $108^{\circ}$
  text = text.replace(/(?<!\$)\b([0-9]+)\s*\^\\circ\b(?!\$)/g, (_m, g1) => `$${g1}^{\\circ}$`);
  text = text.replace(/(?<!\$)\b([0-9]+)\s*\^\{\\circ\}\b(?!\$)/g, (_m, g1) => `$${g1}^{\\circ}$`);
  text = text.replace(/(?<!\$)\b([0-9]+)\s*\\circ\b(?!\$)/g, (_m, g1) => `$${g1}^{\\circ}$`);
  // 30° -> $30^{\circ}$ (derece simgesi)
  text = text.replace(/(?<!\$)\b([0-9]+)\s*°(?!\$)/g, (_m, g1) => `$${g1}^{\\circ}$`);

  // 3. Pi sayısı kalıpları: 74\pi -> $74\pi$, \pi -> $\pi$
  text = text.replace(/(?<!\$)\b([0-9]+)\s*\\pi\b(?!\$)/g, (_m, g1) => `$${g1}\\pi$`);

  // 4. Alan ve hacim birimleri: cm^2 -> $\text{cm}^2$, m^3 -> $\text{m}^3$
  text = text.replace(/(?<!\$)\b(cm|m|mm|km|dm)\s*\^2\b(?!\$)/gi, (_m, g1) => `$\\text{${g1}}^2$`);
  text = text.replace(/(?<!\$)\b(cm|m|mm|km|dm)\s*\^3\b(?!\$)/gi, (_m, g1) => `$\\text{${g1}}^3$`);
  text = text.replace(/(?<!\$)\b(cm|m|mm|km|dm)²\b(?!\$)/gi, (_m, g1) => `$\\text{${g1}}^2$`);
  text = text.replace(/(?<!\$)\b(cm|m|mm|km|dm)³\b(?!\$)/gi, (_m, g1) => `$\\text{${g1}}^3$`);

  // 5. Değişken kare ve küpleri (metin içinde $ olmadan kalmışsa):
  // örn: x^2 -> $x^2$, x^3 -> $x^3$, y^2 -> $y^2$
  text = text.replace(/(?<![$\w])([a-zA-Z])\s*\^\s*([0-9]+)(?![$\w])/g, (_m, v, p) => `$${v}^{${p}}$`);

  return text;
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
      parts.push(<span key={match.index} className="inline-block font-sans text-amber-600 dark:text-amber-400 font-semibold px-0.5">°</span>);
    } else if (token === '²') {
      parts.push(<sup key={match.index} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">2</sup>);
    } else if (token === '³') {
      parts.push(<sup key={match.index} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">3</sup>);
    } else if (token === '⁴') {
      parts.push(<sup key={match.index} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">4</sup>);
    } else if (token.includes('^')) {
      const [base, exp] = token.split('^');
      parts.push(
        <span key={match.index} className="inline-block">
          {base && <span>{base}</span>}
          <sup className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{exp}</sup>
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
export default function MathRenderer({ text = '', className = '' }) {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    // Önce metni normalize et (derece, kare, küp, pi ve ham formülleri $...$ içine sar)
    const normalized = normalizeMathText(text);

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
        <span key={lineIdx} className="block leading-relaxed">
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
                    className="block my-2 text-center overflow-x-auto py-1"
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
                    className="inline-block px-0.5 align-middle"
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
                <strong key={tokIdx} className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {renderPlainTextWithMathSymbols(token.value)}
                </strong>
              );
            } else {
              return (
                <span key={tokIdx}>
                  {renderPlainTextWithMathSymbols(token.value)}
                </span>
              );
            }
          })}
        </span>
      );
    });
  }, [text]);

  return <div className={`math-content select-text ${className}`}>{renderedContent}</div>;
}
