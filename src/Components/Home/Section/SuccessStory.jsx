
import SectionText from "../../Ui/SectionText";

const SuccessStory = () => {
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
        <SectionText title="SUCCESS STORY" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
         আমাদের সাফল্যের হার ৯০%
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {universityClass.map((item,index) => (
          <img
            key={index}
           className="w-full h-auto object-cover"
            src={item.img}
            alt={item.title}
          />
        ))}
      </div>
    </div>
  );
};
export default SuccessStory;
