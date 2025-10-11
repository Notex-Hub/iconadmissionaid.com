/* eslint-disable react/prop-types */

const CourseCard = ({ course }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
      <img
        className="w-full h-auto object-cover"
        src={"/public/course/img.jpg"}
        alt={course.title}
      />
      <div className="p-4">
        <h3 className=" font-bold text-lg mb-2">
          BRACU AdmissionTest Spring 2026 Exam
        </h3>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <p className="text-[#D91A19] font-bold text-sm line-through">BDT 6000 TK</p>
            <p className="text-[#008000] text-xl">BDT 2010 TK</p>
          </div>
          <p className="text-[#1C1C1C]">কোর্সটি করেছে: ১২৫২ জন </p>
        </div>
        <button className="w-full bg-[#5D0000] text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300">
          বিস্তারিত দেখুন
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
