/* eslint-disable react/prop-types */
import { FaArrowRight } from "react-icons/fa";
import SectionText from "../../Ui/SectionText";
import Button from "../../Ui/Button";
import { useGetUniversityQuery } from "../../../../redux/Features/Api/university/university";
import { useNavigate } from "react-router-dom";

const OurUniversity = () => {
  const { data: universityData, isLoading, isError } = useGetUniversityQuery();
  const universities = universityData?.data || [];
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center my-12 md:my-16">
          <SectionText title="আমাদের সূম্পর্ণ কোর্স সমূহ" />
          <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
            ভর্তি হতে আপনার ইউনিভার্সিটি সিলেক্ট করুন 👇
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-16">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-white p-3 md:p-5 border border-gray-200 rounded-xl shadow-sm 
                         cursor-pointer transition duration-300 ease-in-out
                         animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="h-5 w-48 bg-gray-200" />
              </div>
              <div className="h-6 w-6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center my-12 md:my-16">
          <SectionText title="আমাদের সূম্পর্ণ কোর্স সমূহ" />
          <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
            ভর্তি হতে আপনার ইউনিভার্সিটি সিলেক্ট করুন 👇
          </p>
        </div>
        <p className="text-center text-red-600">Something went wrong!</p>
      </div>
    );
  }

  const fallbackImg = "/university/default.png"; // adjust to your public path

  return (
    <div className="container mx-auto px-4">
      <div className="text-center my-12 md:my-16">
        <SectionText title="আমাদের সূম্পর্ণ কোর্স সমূহ" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
          ভর্তি হতে আপনার ইউনিভার্সিটি সিলেক্ট করুন 👇
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-16">
        {universities.map((item) => {
          const title = item?.name || "Unnamed University";
          const imgSrc = item?.cover_photo || item?.image || fallbackImg;
          const uniId = item?._id || item?.id || null;

          return (
            <button
              key={uniId || title}
              onClick={() => {
                if (!uniId) {
                  // safety: if no id, fallback to course listing page without filter
                  navigate("/courses");
                } else {
                  // navigate to courses page with uni query param
                  navigate(`/courses?uni=${encodeURIComponent(uniId)}`);
                }
              }}
              className="flex justify-between items-center bg-white p-3 md:p-5 border border-gray-200 rounded-xl shadow-sm 
                         cursor-pointer transition duration-300 ease-in-out
                         hover:border-blue-500 hover:shadow-lg hover:bg-blue-50 text-left w-full"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-10 h-10 object-contain rounded-full border p-1"
                  src={imgSrc}
                  alt={title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImg;
                  }}
                />
                <p className="text-base md:text-lg font-semibold text-gray-800">
                  {title}
                </p>
              </div>
              <div className="text-lg md:text-xl">
                <FaArrowRight />
              </div>
            </button>
          );
        })}
      </div>

      {universities.length === 8 && (
        <div className="flex justify-center items-center my-5">
          <Button text="View All Courses" onClick={() => navigate("/courses")} />
        </div>
      )}
    </div>
  );
};
export default OurUniversity;
