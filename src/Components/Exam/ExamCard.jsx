/* eslint-disable react/prop-types */
// import { Link } from "react-router-dom";

const ExamCard = ({ exam }) => {
  const bannerSrc = exam?.image ?? exam?.cover_photo ?? "/public/university/default.png";
  const uniName =
    exam?.universityId?.name ??
    exam?.universityName ??
    exam?.moduleId?.universityName ??
    "North South University";
  // const moduleTitle = exam?.moduleId?.moduleTitle ?? exam?.moduleTitle ?? "";
  // const isFreeFlag =
  //   exam?.isFree === true || exam?.isFree === "true" || exam?.isFree === "1";

  return (
    <article className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden max-w-full min-w-0">
      <div className="px-4 pt-4 pb-3 text-center">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#8B0000] leading-tight">
          {uniName}
        </h3>
        <div className="text-sm text-gray-600 mt-1">ALL Department</div>
      </div>

      <div className="w-full h-44 sm:h-48 md:h-52 overflow-hidden">
        <img
          src={bannerSrc}
          alt={exam?.examTitle ?? "Exam banner"}
          className="w-full h-full object-cover max-w-full"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/public/university/default.png";
          }}
        />
      </div>

      {/* <div className="p-4">
        <h4 className="text-lg font-semibold line-clamp-2">{exam?.examTitle}</h4>

        <div className="mt-2 text-sm text-gray-600">
          {moduleTitle && (
            <div>
              <strong>Module:</strong> {moduleTitle}
            </div>
          )}
          <div>
            <strong>Type:</strong> {exam?.examType ?? "N/A"}
          </div>
          <div>
            <strong>Questions:</strong> {exam?.totalQuestion ?? "N/A"}
          </div>
          <div className="text-sm text-gray-500">
            <strong>Schedule:</strong>{" "}
            {exam?.scheduleDate ? new Date(exam.scheduleDate).toLocaleString() : "N/A"}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Link
            to={`/exam/${exam?.slug ?? exam?._id}`}
            className="flex-1 text-center py-2 rounded-xl border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
          >
            View Exam
          </Link>

          {isFreeFlag && (
            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200">
              Free
            </span>
          )}
        </div>
      </div> */}
    </article>
  );
};

export default ExamCard;
