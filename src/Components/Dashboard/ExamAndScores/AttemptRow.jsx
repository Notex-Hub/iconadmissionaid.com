/* eslint-disable react/prop-types */
import format from "date-fns/format";

const AttemptRow = ({ attempt, onView, isCard = false }) => {
  const exam = attempt.examId ?? {};
  const student = attempt.studentId ?? {};
  const createdAt = attempt.createdAt ? new Date(attempt.createdAt) : null;

  // how many questions are in exam vs how many were actually answered
  const totalQFromExam = Number(exam.totalQuestion ?? 0);
  const attempted = Array.isArray(attempt.answer) ? attempt.answer.length : 0;

  // use exam total if available, otherwise use attempted as denominator to compute percentage
  const denominator = totalQFromExam > 0 ? totalQFromExam : attempted > 0 ? attempted : 1;

  const correct = Number(attempt.correctCount ?? 0);
  const wrong = Number(attempt.wrongCount ?? 0);

  // percent computed relative to denominator described above
  const percent = Math.round((correct / denominator) * 100);

  // pass rule: >= 50% (adjust if you want a different threshold)
  const passed = percent >= 50;

  // helper texts
  const statusText = passed ? "Passed" : "Failed";
  const statusClass = passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  // small label for attempted info
  const attemptedLabel = totalQFromExam > 0 ? `${attempted}/${totalQFromExam}` : `${attempted}`;

  if (isCard) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl font-semibold text-gray-700">
            {student?.name ? student.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="font-medium text-gray-800">{student?.name ?? "Unknown"}</div>
              <div className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}>{statusText}</div>
            </div>
            <div className="text-sm text-gray-500">{student?.phone ?? "—"}</div>
            <div className="text-xs text-gray-400 mt-1">Attempted: <span className="font-medium text-gray-700">{attemptedLabel}</span></div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm text-gray-500">Score</div>
            <div className="text-lg font-bold text-[#7a0000]">{percent}%</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500">Correct / Wrong</div>
            <div className="text-sm font-medium">{correct} / {wrong}</div>
          </div>

          <div className="text-right">
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>{statusText}</div>
            <div className="text-xs text-gray-400 mt-1">{createdAt ? format(createdAt, "PPp") : "-"}</div>
          </div>

          <button onClick={() => onView(attempt)} className="px-3 py-2 bg-[#c21010] text-white rounded-md text-sm">View</button>
        </div>
      </div>
    );
  }

  return (
    <tr className="bg-white even:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="font-medium text-gray-800">{student?.name ?? "Unknown"}</div>
          <div className={`text-xs px-2 py-0.5 rounded-full ${statusClass}`}>{statusText}</div>
        </div>
        <div className="text-xs text-gray-400">{student?.phone ?? "—"}</div>
        <div className="text-xs text-gray-500 mt-1">Attempted: <span className="font-medium text-gray-700">{attemptedLabel}</span></div>
      </td>

      <td className="px-4 py-3 text-center">
        <div className="text-lg font-semibold text-[#7a0000]">{percent}%</div>
        <div className="text-xs text-gray-400">{correct}/{denominator}</div>
      </td>

      <td className="px-4 py-3 text-center">
        <div className={`px-3 py-1 rounded-full text-sm font-semibold inline-block ${statusClass}`}>
          {statusText}
        </div>
      </td>

      <td className="px-4 py-3 text-center text-sm text-gray-500">
        {createdAt ? format(createdAt, "PPp") : "-"}
      </td>

      <td className="px-4 py-3 text-right">
       
<button
  onClick={() => onView(attempt._id, attempt.examId?.slug ?? attempt.examId?.examTitle ?? "")}
  className="px-3 cursor-pointer py-2 bg-[#c21010] text-white rounded-md text-sm"
>
  View
</button>


      </td>
    </tr>
  );
};

export default AttemptRow;
