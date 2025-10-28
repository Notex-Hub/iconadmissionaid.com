/* eslint-disable react/prop-types */
/**
 * QuestionCard (updated)
 *
 * - removes leading numbering in the question HTML (like "1.", "<p>3.</p>", or an ol/li that only contains "8.")
 *   so you won't see duplicate numbers when the component also shows a badge.
 *
 * Props:
 * - q: question object
 * - value: selected option label or option text
 * - onChange: (questionId, selectedOptionLabel) => void
 * - index: local index on the page (0-based)  <-- pass idx from pageQuestions.map(...)
 * - globalIndex: absolute question number (optional)
 */
export const QuestionCard = ({ q, value, onChange, index, globalIndex }) => {
  const rawHtml = q?.question ?? "";
  const imgSrc = q?.questionImg ?? "";
  const options = Array.isArray(q?.options) ? q.options : [];

  // Remove leading plain numbering from HTML.
  // Strategy:
  // - Parse the HTML with DOMParser
  // - If the first visible child node is a text node or an element whose textContent is just "N." (like "3." or "10.")
  //   then remove that node so the displayed question doesn't include the leading number.
  const cleanQuestionHtml = (() => {
    try {
      const parser = new DOMParser();
      // ensure we wrap fragment into a container so we can inspect children
      const doc = parser.parseFromString(`<div id="qc-root">${rawHtml}</div>`, "text/html");
      const root = doc.getElementById("qc-root");
      if (!root) return rawHtml;

      // Helper: check if a string is just a number + dot (with optional whitespace)
      const isJustNumberDot = (str) => {
        if (typeof str !== "string") return false;
        return /^\s*\d+\.\s*$/i.test(str);
      };

      // Find first *visible* child node (skip empty text nodes)
      const children = Array.from(root.childNodes);

      // If first child is a text node with "3." remove it
      if (children.length > 0) {
        const first = children[0];

        if (first.nodeType === Node.TEXT_NODE) {
          if (isJustNumberDot(first.textContent)) {
            root.removeChild(first);
          } else {
            // text node might start with "3. " then rest of question text.
            // remove the leading "N. " from the beginning of the text node
            const match = first.textContent.match(/^\s*(\d+\.)\s*/);
            if (match) {
              first.textContent = first.textContent.replace(/^\s*\d+\.\s*/, "");
            }
          }
        } else if (first.nodeType === Node.ELEMENT_NODE) {
          // If first element (eg <p>, <li>, <ol>) contains only a number+dot, remove that element.
          const firstText = first.textContent ? first.textContent.trim() : "";
          if (isJustNumberDot(firstText)) {
            root.removeChild(first);
          } else {
            // Sometimes markup is <ol start="8"><li><p>8.</p></li></ol>
            // Try to see if first element contains a child that's just a number+dot and that child is the only content.
            const innerChildren = Array.from(first.childNodes);
            if (innerChildren.length === 1) {
              const inner = innerChildren[0];
              if (inner.nodeType === Node.ELEMENT_NODE || inner.nodeType === Node.TEXT_NODE) {
                const innerText = inner.textContent ? inner.textContent.trim() : "";
                if (isJustNumberDot(innerText)) {
                  // remove that inner node
                  first.removeChild(inner);
                  // If the first element becomes empty now, remove it too
                  if (!first.textContent.trim()) {
                    root.removeChild(first);
                  }
                }
              }
            } else {
              // If first element has text that *starts* with "N. " then strip that prefix.
              const leadingMatch = first.textContent && first.textContent.match(/^\s*(\d+\.)\s*/);
              if (leadingMatch) {
                // Remove only the leading number+dot text from the element's first text node
                // Find the first text node descendant
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

      // Return inner HTML of our wrapper
      return root.innerHTML;
    } catch (e) {
      // fallback: try a simple regex-based removal for common cases
      try {
        // remove leading <p>NUMBER.</p> or leading NUMBER. at the start
        let s = rawHtml;
        s = s.replace(/^\s*<p[^>]*>\s*\d+\.\s*<\/p>\s*/i, "");
        s = s.replace(/^\s*\d+\.\s*/i, "");
        return s;
      } catch {
        return rawHtml;
      }
    }
  })();

  const handleSelect = (label) => {
    if (typeof onChange === "function") onChange(q._id, label);
  };

  // Generate labels A, B, C... based on options length
  const optionLabels = options.map((_, i) => String.fromCharCode(65 + i)); // ["A","B",...]

  // Helper to determine if an option is selected.
  const isSelected = (optText, label) => {
    if (value == null) return false;
    try {
      const v = String(value).trim();
      if (!v) return false;
      if (v.toLowerCase() === String(label).toLowerCase()) return true;
      if (v.toLowerCase() === String(optText).trim().toLowerCase()) return true;
      return false;
    } catch {
      return false;
    }
  };

  // Determine displayed serial number: prefer page-local index (index + 1).
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
          {/* Cleaned Question HTML (dangerouslySetInnerHTML) */}
          <div
            className="prose max-w-none text-gray-800 mb-3"
            dangerouslySetInnerHTML={{ __html: cleanQuestionHtml }}
          />

          {/* Optional question image */}
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

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {options.length === 0 && (
              <div className="text-sm text-gray-500 italic">No options available</div>
            )}

            {options.map((optText, i) => {
              const label = optionLabels[i] ?? String.fromCharCode(65 + i);
              const optionId = `${q._id}-opt-${i}`;
              const selected = isSelected(optText, label);

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
                    value={label}
                    checked={selected}
                    onChange={() => handleSelect(label)}
                    className="form-radio h-4 w-4 text-green-600 mt-1"
                    aria-checked={selected}
                    aria-labelledby={`${optionId}-label`}
                  />

                  <div className="flex-1">
                    <div id={`${optionId}-label`} className="flex items-start gap-2">
                      <span className="font-semibold">{label}.</span>
                      <div className="text-gray-700 mt-0.5">{optText}</div>
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
