import SectionText from "../../Ui/SectionText";
import Button from "../../Ui/Button";

const OurFreeClasses = () => {
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

  const universityClass = [
    {
      id: 1,
      title: "BRAC Spring 2026 Admission Help Desk",
      img: "/public/university/banner1.png",
    },
    {
      id: 2,
      title: "East West University Admission Help Desk",
      img: "/public/university/banner2.png",
    },
  ];
  return (
    <div className="container mx-auto px-4">
      <div className="text-center my-12 md:my-16">
        <SectionText title="আমাদের সকল ফ্রি ক্লাসসমূহ" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
          আমাদের ক্লাসের কোয়ালিটি সম্পর্কে ধারণা পেতে সম্পূর্ণ ফ্রিতে <br />
          দেখে নিতে পারো কিছু ক্লাস
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex justify-between items-center gap-5 flex-wrap">
        {university?.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center px-14 py-3 rounded border border-gray-200"
          >
            <img
              className="w-10 h-10 object-contain rounded-full border p-1"
              src={item.img}
              alt={item.title}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center gap-10 my-20">
        {universityClass.map((item,index) => (
          <img
            key={index}
           className="w-full h-auto object-cover"
            src={item.img}
            alt={item.title}
          />
        ))}
      </div>
      <div className="flex justify-center items-center my-5">
        <Button text="View All Courses" />
      </div>
    </div>
  );
};
export default OurFreeClasses;
