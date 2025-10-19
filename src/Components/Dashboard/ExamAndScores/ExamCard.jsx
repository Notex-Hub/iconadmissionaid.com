/* eslint-disable react/prop-types */
const ExamCard = ({ exam, onStart }) => {
  const image = exam.image ?? exam.moduleId?.cover_photo ?? "/public/university/default.png";
  const scheduleDate = exam.scheduleDate ? new Date(exam.scheduleDate) : null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 md:p-8 max-w-2xl w-full mx-auto">
      <div className="flex items-start gap-6">
        <div className="w-28 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img src={image} alt={exam.examTitle} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{exam.examTitle}</h3>
              {exam.moduleId?.moduleTitle && (
                <p className="text-sm text-gray-500 mt-1">{exam.moduleId.moduleTitle}</p>
              )}
            </div>
            <div className="text-sm text-gray-500">{exam.mcqDuration ? `${exam.mcqDuration} min` : "N/A"}</div>
          </div>
          {exam.examType && (
            <p className="text-sm text-gray-600 mt-3">{exam.examType} — {exam.totalQuestion} questions</p>
          )}
          {scheduleDate && (
            <p className="text-sm text-gray-500 mt-2">Created: {new Date(exam.createdAt).toLocaleDateString()}</p>
          )}
          <div className="mt-6">
            <button
              onClick={() => onStart(exam)}
              className="px-6 py-3 bg-[#c21010] hover:bg-[#a50e0e] text-white rounded-lg font-medium shadow"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
