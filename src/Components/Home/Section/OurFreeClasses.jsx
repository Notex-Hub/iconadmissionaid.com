import SectionText from "../../Ui/SectionText";
import Button from "../../Ui/Button";
import UniversitySmallCard from "../../Package/UniversitySmallCard";

const OurFreeClasses = () => {
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

      <UniversitySmallCard />
      <div className="flex justify-between items-center gap-10 my-20">
        {universityClass.map((item, index) => (
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
