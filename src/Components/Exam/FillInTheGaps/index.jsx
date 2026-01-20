/* eslint-disable react/prop-types */
import { useGetAllModelTestFillintheGapsQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

/* -------- helper: strip html -------- */
const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

const ExamFillInTheGaps = ({ subject, userAnswers, setUserAnswers }) => {
  const { data, isLoading } = useGetAllModelTestFillintheGapsQuery();

  const filteredQuestions = data?.data?.filter(
    (q) =>
      q?.subjectId?.modelTest === subject?.modelTest?._id &&
      q?.subjectId?.slug === subject?.slug
  );

  const handleChange = (q, blankIndex, value) => {
    const correct =
      q.answers?.[blankIndex]
        ?.replace(/['"]/g, "")
        .toLowerCase()
        .trim() === value.toLowerCase().trim();

    const payload = {
      qId: q._id,
      blankIndex,
      userAnswer: value,
      isCorrect: correct,
      mark: correct ? q.mark || 0 : 0,
    };

    setUserAnswers((prev) => {
      const idx = prev.findIndex(
        (p) => p.qId === q._id && p.blankIndex === blankIndex
      );
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = payload;
        return copy;
      }
      return [...prev, payload];
    });
  };

  const getValue = (qId, blankIndex) =>
    userAnswers.find(
      (a) => a.qId === qId && a.blankIndex === blankIndex
    )?.userAnswer || "";

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-400 animate-pulse">
        Loading Gaps Questions...
      </div>
    );

  return (
    <div className="space-y-10">
      {filteredQuestions?.map((q, index) => {
        const cleanQ = stripHtml(q.question);
        const parts = cleanQ.split("___");

        return (
          <div
            key={q._id}
            className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8
            shadow-[0_10px_30px_-15px_rgba(0,0,0,0.08)]"
          >
            {/* Question Number */}
            <div className="mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#8B0000]/10 text-[#8B0000]
              flex items-center justify-center font-bold text-sm">
                {index + 1}
              </span>
              <p className="text-sm text-gray-400 font-medium">
                Fill in the blanks
              </p>
            </div>

            {/* Question Text */}
            <div className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed">
              {parts.map((text, i) => (
                <span key={i}>
                  {text}
                  {i < parts.length - 1 && (
                    <input
                      type="text"
                      value={getValue(q._id, i)}
                      onChange={(e) =>
                        handleChange(q, i, e.target.value)
                      }
                      placeholder={`(${i + 1})`}
                      className="mx-2 inline-block min-w-[120px] max-w-[180px]
                      border-b-2 border-gray-300 bg-transparent
                      text-center font-semibold text-[#8B0000]
                      focus:border-[#8B0000] focus:outline-none
                      transition-all duration-200"
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExamFillInTheGaps;
