/* eslint-disable react/prop-types */
// import { Link } from "react-router-dom";

import { Link } from "react-router-dom";

const ExamCard = ({ exam }) => {
  console.log(exam)
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
    <Link to={`/exam/exam-details/${exam?.slug}`} className="bg-white cursor-pointer  rounded-2xl shadow-md border border-gray-100 overflow-hidden max-w-full min-w-0">
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

    
    </Link>
  );
};

export default ExamCard;
