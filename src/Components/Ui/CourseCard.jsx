import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const CourseCard = ({ course }) => {
  const hasOffer = course.offerPrice && course.offerPrice > 0;
  const coursePrice = course.isFree ? "Free" : `BDT ${course.price || 0} TK`;
  const offerPrice = hasOffer ? `BDT ${course.offerPrice} TK` : null;

  return (
    <div className="rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300 px-2">
      
      {/* Image wrapper with 1:1 aspect ratio */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <img
          className="absolute inset-0 w-full h-full rounded-md"
          src={course.cover_photo || "/public/course/img.jpg"}
          alt={course.course_title || "Course Image"}
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold md:text-lg text-xs mb-2">
          {course.course_title || "Untitled Course"}
        </h3>

        <div className="flex items-center flex-row md:flex-col justify-between gap-2 mb-4">
          <div>
            {hasOffer && (
              <p className="text-[#D91A19] font-bold text-sm line-through">
                {coursePrice}
              </p>
            )}
            <p className="text-[#008000] text-xl">
              {offerPrice || coursePrice}
            </p>
          </div>
          <p className="text-[#1C1C1C] text-sm sm:text-base">
            কোর্সটি করেছে: ১২৫২ জন
          </p>
        </div>

        <Link to={`/course/${course.slug}`}>
          <button className="w-full cursor-pointer bg-gradient-to-r from-[#6A0000] via-[#B10000] to-[#FF0000]  text-white font-semibold py-2 px-4 rounded-lg  transition-colors duration-300">
            বিস্তারিত দেখুন
          </button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
