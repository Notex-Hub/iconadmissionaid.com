/* QuestionDetailRow.jsx */
import { useState } from "react";


const OptionLabel = ({ idx }) => {
  // A, B, C, ...
  return String.fromCharCode(65 + idx);
};

const SafeHtml = ({ html }) => {
  // small wrapper to render simple HTML from backend
  return <div dangerouslySetInnerHTML={{ __html: String(html || "") }} />;
};

const TickIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CrossIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const QuestionDetailRow = ({ qObj }) => {
  const [openExplanation, setOpenExplanation] = useState(false);

  const q = qObj?.questionId ?? {};
  const questionText = q.question ?? "(No question text)";
  const options = Array.isArray(q.options) ? q.options : null;
  const rawCorrect = q.correctAnswer ?? "";
  const selected = qObj?.selectedAnswer ?? "";

  // Determine canonical correct index/text:
  let correctIndex = null; // 0-based
  let correctText = null;

  if (options && options.length > 0) {
    // correct could be "2" (1-based index) or "A" or the exact text
    if (!isNaN(Number(rawCorrect))) {
      const idx = Number(rawCorrect) - 1;
      if (idx >= 0 && idx < options.length) correctIndex = idx;
      correctText = options[correctIndex] ?? null;
    } else {
      // try to match by text
      const byTextIdx = options.findIndex((op) => String(op).trim() === String(rawCorrect).trim());
      if (byTextIdx >= 0) {
        correctIndex = byTextIdx;
        correctText = options[byTextIdx];
      } else {
        // maybe rawCorrect is a letter like "A"
        if (typeof rawCorrect === "string" && /^[A-Za-z]$/.test(rawCorrect.trim())) {
          const derived = rawCorrect.trim().toUpperCase().charCodeAt(0) - 65;
          if (derived >= 0 && derived < options.length) {
            correctIndex = derived;
            correctText = options[derived];
          }
        }
      }
    }
  } else {
    // no options: treat correctAnswer as text
    correctText = rawCorrect ?? null;
  }

  // Determine whether selected matches correct
  let isCorrect = false;
  if (options && options.length > 0) {
    // selected might be index, letter, or text
    if (selected === null || selected === undefined || selected === "") {
      isCorrect = false;
    } else if (!isNaN(Number(selected))) {
      isCorrect = Number(selected) - 1 === correctIndex;
    } else if (typeof selected === "string" && /^[A-Za-z]$/.test(selected.trim())) {
      const selIdx = selected.trim().toUpperCase().charCodeAt(0) - 65;
      isCorrect = selIdx === correctIndex;
    } else {
      // compare by text
      isCorrect = String(selected).trim() === String(correctText).trim();
    }
  } else {
    // open answer compare
    if ((selected === null || selected === undefined || selected === "") && (correctText === null || correctText === "")) {
      isCorrect = false;
    } else {
      isCorrect = String(selected).trim() === String(correctText).trim();
    }
  }

  return (
    <div className="question-row">
      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">Question</div>
        <div className="text-base font-medium text-gray-800">
          <SafeHtml html={questionText} />
        </div>
      </div>

      {options && options.length > 0 ? (
        <div className="grid grid-cols-1 gap-2">
          {options.map((opt, idx) => {
            const isThisCorrect = correctIndex === idx;
            // check if user selected this
            let userSelectedThis = false;
            if (!isNaN(Number(selected))) {
              userSelectedThis = Number(selected) - 1 === idx;
            } else if (typeof selected === "string" && /^[A-Za-z]$/.test(selected.trim())) {
              userSelectedThis = selected.trim().toUpperCase().charCodeAt(0) - 65 === idx;
            } else {
              userSelectedThis = String(selected).trim() === String(opt).trim();
            }

            return (
              <div
                key={idx}
                className={`p-3 rounded-md border flex items-start gap-3
                  ${isThisCorrect ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"}
                  ${userSelectedThis && !isThisCorrect ? "border-red-300 bg-red-50" : ""}
                `}
              >
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm
                    ${isThisCorrect ? "bg-green-600 text-white" : userSelectedThis ? "bg-gray-200 text-gray-800" : "bg-white text-gray-700 border"}
                  `}>
                    <span>{OptionLabel({ idx })}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="text-sm text-gray-800"><SafeHtml html={opt} /></div>
                    <div className="ml-3 flex items-center gap-2">
                      {isThisCorrect && (
                        <div className="text-green-700 flex items-center gap-1 text-sm font-semibold">
                          <TickIcon className="w-4 h-4" />
                          <span>Correct</span>
                        </div>
                      )}

                      {userSelectedThis && !isThisCorrect && (
                        <div className="text-red-600 flex items-center gap-1 text-sm font-semibold">
                          <CrossIcon className="w-4 h-4" />
                          <span>Your answer</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // open-answer case
        <div className="mb-3">
          <div className="text-sm text-gray-600 mb-1">Correct Answer</div>
          <div className="p-3 rounded-md border border-gray-200 bg-white">
            <div className="text-sm text-gray-800">{correctText ?? "—"}</div>
          </div>

          <div className="mt-2">
            <div className="text-sm text-gray-600 mb-1">Your Answer</div>
            <div className={`p-3 rounded-md border ${isCorrect ? "border-green-300 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <div className="text-sm text-gray-800">{String(selected ?? "—")}</div>
            </div>
          </div>
        </div>
      )}

      {/* Explanation / feedback */}
      {(q.explanation || q.explain || q.hint) && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpenExplanation((s) => !s)}
            className="text-sm text-[#0b74a6] hover:underline"
          >
            {openExplanation ? "Hide explanation" : "View explanation"}
          </button>

          {openExplanation && (
            <div className="mt-2 p-3 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-700">
              <SafeHtml html={q.explanation ?? q.explain ?? q.hint} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionDetailRow;
