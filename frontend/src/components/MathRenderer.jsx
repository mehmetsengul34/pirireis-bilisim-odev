import React, { useMemo } from 'react';
import katex from 'katex';

/**
 * Türkçe Karakter ve LaTeX Güvenlik Sanitizer'ı:
 * Formül içinde (\text{} dışında) kalmış Türkçe karakterli kelimeleri KaTeX için güvenli \text{} bloklarına çevirir.
 */
function sanitizeFormulaForKatex(formula) {
  if (!formula) return '';
  
  // Eğer \text{...} içinde değilse ve Türkçe karakter içeriyorsa:
  const turkishRegex = /(?<!\\text\{)([a-zA-ZçğıöşüÇĞİÖŞÜ]+[çğıöşüÇĞİÖŞÜ][a-zA-ZçğıöşüÇĞİÖŞÜ]*)/g;
  
  // Parçalara ayırıp \text{} içindekileri koru
  const parts = [];
  let lastIndex = 0;
  const textBlockRegex = /\\text\{([^}]*)\}/g;
  let match;
  
  while ((match = textBlockRegex.exec(formula)) !== null) {
    const before = formula.substring(lastIndex, match.index);
    parts.push(before.replace(turkishRegex, '\\text{$1}'));
    parts.push(match[0]);
    lastIndex = match.index + match[0].length;
  }
  
  const remainder = formula.substring(lastIndex);
  parts.push(remainder.replace(turkishRegex, '\\text{$1}'));
  
  return parts.join('');
}

/**
 * MathRenderer:
 * Matematik formüllerini ($...$ ve $$...$$), Türkçe karakterleri ve biçimlendirmeleri kusursuz render eder.
 */
export default function MathRenderer({ text = '', className = '' }) {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    // Metni satırlara ve bloklara ayır
    const lines = text.split('\n');

    return lines.map((line, lineIdx) => {
      // Satır içi parçalama: Önce $$...$$ (display math), sonra $...$ (inline math)
      // Regex: (\$\$[\s\S]*?\$\$|\$[^\$]+?\$|\*\*[^*]+?\*\*)
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
              } catch (e) {
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
                    className="inline-block px-0.5"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch (e) {
                return (
                  <span key={tokIdx} className="font-mono text-xs text-rose-500">
                    ${token.value}$
                  </span>
                );
              }
            } else if (token.type === 'bold') {
              return (
                <strong key={tokIdx} className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {token.value}
                </strong>
              );
            } else {
              return <span key={tokIdx}>{token.value}</span>;
            }
          })}
        </span>
      );
    });
  }, [text]);

  return <div className={`math-content select-text ${className}`}>{renderedContent}</div>;
}
