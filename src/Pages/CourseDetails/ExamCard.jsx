/* src/components/ExamCard.jsx */
/* eslint-disable react/prop-types */

export default function ExamCard({ exam = {},}) {
  const {
    examTitle,
    examType,
    totalQuestion,
    positiveMark,
    negativeMark,
    scheduleDate,
    image,
  } = exam;

  return (
    <div className=" rounded p-3 bg-white flex items-center gap-3">
      <div className="w-16 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden flex items-center justify-center text-xs">
        {image ? <img src={image} alt={examTitle} className="object-cover w-full h-full" /> : <span>Exam</span>}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h5 className="font-semibold">{examTitle || "Untitled Exam"}</h5>
            <div className="text-xs text-gray-500">
              <span className="mr-2">{examType}</span>
              <span className="mr-2">• {totalQuestion} questions</span>
              <span className="mr-2">• +{positiveMark}</span>
              <span className="mr-2">• -{negativeMark}</span>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="text-gray-500 mt-1">{formatDateTime(scheduleDate)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function formatDateTime(d) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return `${dt.toLocaleDateString("en-GB")} ${dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  // eslint-disable-next-line no-unused-vars
  } catch (e) {
    return String(d);
  }
}
