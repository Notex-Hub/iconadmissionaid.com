import Navbar from "../../Components/Home/Navbar/Navbar";
import UniversitySmallCard from "../../Components/Package/UniversitySmallCard";
import BannerSection from "../../Components/Ui/BannerSection";
import SectionText from "../../Components/Ui/SectionText";
import Footer from "../../Layout/Footer";
import banner from "../../assets/banner/freeclass.png";

const FreeClass = () => {
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
    <div className="relative">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <BannerSection banner={banner} />
      <div className="container mx-auto">
        <div className="text-center my-12 md:my-16">
          <SectionText title="আমাদের সকল ফ্রি ক্লাসসমূহ" />
          <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
            আমাদের ক্লাসের কোয়ালিটি সম্পর্কে ধারণা পেতে সম্পূর্ণ ফ্রিতে <br />{" "}
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
      </div>
      <Footer />
    </div>
  );
};

export default FreeClass;
