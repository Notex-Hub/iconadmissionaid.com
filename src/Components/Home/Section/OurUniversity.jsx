import { FaArrowRight } from "react-icons/fa";
import SectionText from "../../Ui/SectionText";
import Button from "../../Ui/Button";

const OurUniversity = () => {
  const university = [
    {
      id: 1,
      title: "নর্থ সাউথ ইউনিভার্সিটি",
      img: "/public/university/nsu.png",
    },
    {
      id: 2,
      title: "ব্র্যাক ইউনিভার্সিটি",
      img: "/public/university/brac.png",
    },
    {
      id: 3,
      title: "ইস্ট ওয়েস্ট ইউনিভার্সিটি",
      img: "/public/university/east-west.png",
    },
    {
      id: 4,
      title: "আহসানউল্লাহ ইউনিভার্সিটি",
      img: "/public/university/aiub.png",
    },
    {
      id: 5,
      title: "American International University",
      img: "/public/university/aiub.png",
    },
    {
      id: 6,
      title: "Independent University",
      img: "/public/university/iub.png",
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center my-12 md:my-16">
        <SectionText title="আমাদের সূম্পর্ণ কোর্স সমূহ" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
          ভর্তি হতে আপনার ইউনিভার্সিটি সিলেক্ট করুন 👇
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-16">
        {university?.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-white p-3 md:p-5 border border-gray-200 rounded-xl shadow-sm 
                       cursor-pointer transition duration-300 ease-in-out
                       hover:border-blue-500 hover:shadow-lg hover:bg-blue-50"
          >
            <div className="flex items-center gap-4">
              <img
                className="w-10 h-10 object-contain rounded-full border p-1"
                src={item.img}
                alt={item.title}
              />
              <p className="text-base md:text-lg font-semibold text-gray-800">
                {item?.title}
              </p>
            </div>
            <p className="text-lg md:text-xl ">
              <FaArrowRight />
            </p>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center my-5">
        <Button text="View All Courses" />
      </div>
    </div>
  );
};
export default OurUniversity;
