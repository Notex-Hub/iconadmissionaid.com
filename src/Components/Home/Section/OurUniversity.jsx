import { FaArrowRight } from "react-icons/fa";
import SectionText from "../../Ui/SectionText";
import Button from "../../Ui/Button";
import { useGetUniversityQuery } from "../../../../redux/Features/Api/university/university";

const OurUniversity = () => {
  const { data: universityData, isLoading, isError } = useGetUniversityQuery();
  const universities = universityData?.data || [];

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

  const fallbackImg = "../../../../public/university/aiub.png";
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

          return (
            <div
              key={item._id || title}
              className="flex justify-between items-center bg-white p-3 md:p-5 border border-gray-200 rounded-xl shadow-sm 
                         cursor-pointer transition duration-300 ease-in-out
                         hover:border-blue-500 hover:shadow-lg hover:bg-blue-50"
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
              <p className="text-lg md:text-xl ">
                <FaArrowRight />
              </p>
            </div>
          );
        })}
      </div>

      {universities.length === 8 && (
        <div className="flex justify-center items-center my-5">
          <Button text="View All Courses" />
        </div>
      )}
    </div>
  );
};
export default OurUniversity;
