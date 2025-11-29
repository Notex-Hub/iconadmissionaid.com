/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ExamCard = ({ exam }) => {
  // Fallbacks for image and university name
  const bannerSrc = exam?.image ?? exam?.cover_photo ?? "/public/university/default.png";
  const uniName =
    exam?.university ?? exam?.universityName ?? "North South University";
  const examTitle = exam?.title ?? "Untitled Exam";

  return (
    <Link
      to={`/exam/exam-details/${exam?.slug}`}
      className="bg-white cursor-pointer rounded-2xl shadow-md border border-gray-100 overflow-hidden transition transform hover:scale-105 duration-200 max-w-full min-w-0"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 text-center">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#8B0000] leading-tight">
          {examTitle}
        </h3>
        <div className="text-sm text-gray-600 mt-1">{uniName}</div>
        <div className="text-xs text-gray-500 mt-1">All Departments</div>
      </div>

      {/* Banner Image */}
      <div className="w-full h-44 sm:h-48 md:h-52 overflow-hidden">
        <img
          src={bannerSrc}
          alt={examTitle}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/public/university/default.png";
          }}
        />
      </div>

      {/* Optional: Footer with sections or tags */}
      {exam?.sectionsOrderForEnglish && exam.sectionsOrderForEnglish.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-gray-100 bg-gray-50">
          {exam.sectionsOrderForEnglish.map((sec, idx) => (
            <span
              key={idx}
              className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full"
            >
              {sec}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
};

export default ExamCard;
