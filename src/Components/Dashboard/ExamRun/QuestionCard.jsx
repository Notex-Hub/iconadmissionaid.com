/* eslint-disable react/prop-types */
/**
 * QuestionCard (text-only options)
 *
 * - Sends only the option TEXT via onChange (no A/B/C or numeric index)
 * - Renders options without letter labels
 * - Keeps your leading number cleanup for the question HTML
 *
 * Props:
 * - q: question object
 * - value: selected option TEXT
 * - onChange: (questionId, selectedOptionText) => void
 * - index: local index on the page (0-based)
 * - globalIndex: absolute question number (optional)
 */
export const QuestionCard = ({ q, value, onChange, index, globalIndex }) => {
  const rawHtml = q?.question ?? "";
  const imgSrc = q?.questionImg ?? "";
  const options = Array.isArray(q?.options) ? q.options : [];

  // Clean leading numbering from question HTML
  const cleanQuestionHtml = (() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div id="qc-root">${rawHtml}</div>`, "text/html");
      const root = doc.getElementById("qc-root");
      if (!root) return rawHtml;

      const isJustNumberDot = (str) => typeof str === "string" && /^\s*\d+\.\s*$/i.test(str);
      const children = Array.from(root.childNodes);

      if (children.length > 0) {
        const first = children[0];

        if (first.nodeType === Node.TEXT_NODE) {
          if (isJustNumberDot(first.textContent)) {
            root.removeChild(first);
          } else {
            const match = first.textContent.match(/^\s*(\d+\.)\s*/);
            if (match) first.textContent = first.textContent.replace(/^\s*\d+\.\s*/, "");
          }
        } else if (first.nodeType === Node.ELEMENT_NODE) {
          const firstText = first.textContent ? first.textContent.trim() : "";
          if (isJustNumberDot(firstText)) {
            root.removeChild(first);
          } else {
            const innerChildren = Array.from(first.childNodes);
            if (innerChildren.length === 1) {
              const inner = innerChildren[0];
              const innerText = inner?.textContent ? inner.textContent.trim() : "";
              if (isJustNumberDot(innerText)) {
                first.removeChild(inner);
                if (!first.textContent.trim()) root.removeChild(first);
              }
            } else {
              const leadingMatch = first.textContent && first.textContent.match(/^\s*(\d+\.)\s*/);
              if (leadingMatch) {
                const walker = doc.createTreeWalker(first, NodeFilter.SHOW_TEXT, null, false);
                const txtNode = walker.nextNode();
                if (txtNode && txtNode.nodeValue) {
                  txtNode.nodeValue = txtNode.nodeValue.replace(/^\s*\d+\.\s*/, "");
                }
              }
            }
          }
        }
      }

      return root.innerHTML;
    } catch {
      try {
        let s = rawHtml;
        s = s.replace(/^\s*<p[^>]*>\s*\d+\.\s*<\/p>\s*/i, "");
        s = s.replace(/^\s*\d+\.\s*/i, "");
        return s;
      } catch {
        return rawHtml;
      }
    }
  })();

  // send TEXT only
  const handleSelect = (optText) => {
    if (typeof onChange === "function") onChange(q._id, optText);
  };

  // is this option selected? compare with TEXT
  const isSelected = (optText) => {
    if (value == null) return false;
    try {
      return String(value).trim() === String(optText).trim();
    } catch {
      return false;
    }
  };

  const displayIndex = Number.isInteger(index) ? index + 1 : globalIndex ?? 1;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700"
            aria-hidden
            title={`Question ${displayIndex}`}
          >
            {displayIndex}
          </div>
        </div>

        <div className="flex-1">
          {/* Question HTML */}
          <div
            className="prose max-w-none text-gray-800 mb-3"
            dangerouslySetInnerHTML={{ __html: cleanQuestionHtml }}
          />

          {/* Optional image */}
          {imgSrc && (
            <div className="mb-3">
              <img
                src={imgSrc}
                alt={`Question ${displayIndex}`}
                loading="lazy"
                className="w-full max-h-[520px] object-contain rounded-md border"
              />
            </div>
          )}

          {/* Options (TEXT only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {options.length === 0 && (
              <div className="text-sm text-gray-500 italic">No options available</div>
            )}

            {options.map((optText, i) => {
              const optionId = `${q._id}-opt-${i}`;
              const selected = isSelected(optText);

              return (
                <label
                  key={optionId}
                  htmlFor={optionId}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-shadow focus-within:ring-2 focus-within:ring-offset-1 ${
                    selected ? "border-green-500 shadow-md bg-green-50" : "border-gray-200 bg-white hover:shadow-sm"
                  }`}
                >
                  <input
                    id={optionId}
                    type="radio"
                    name={`q-${q._id}`}
                    value={optText}           
                    checked={selected}
                    onChange={() => handleSelect(optText)}  
                    className="form-radio h-4 w-4 text-green-600 mt-1"
                    aria-checked={selected}
                    aria-labelledby={`${optionId}-label`}
                  />

                  <div className="flex-1">
                    <div id={`${optionId}-label`} className="text-gray-700 mt-0.5">
                      {optText}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
