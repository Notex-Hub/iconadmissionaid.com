import Navbar from "../../Components/Home/Navbar/Navbar";
import UniversitySmallCard from "../../Components/Package/UniversitySmallCard";
import BannerSection from "../../Components/Ui/BannerSection";
import SectionText from "../../Components/Ui/SectionText";
import Footer from "../../Layout/Footer";
import banner from "../../assets/banner/freetestBanner.png";

const FreeTest = () => {
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
      id: 3,
      title: "East West University Admission Help Desk",
      img: "/public/university/banner2.png",
    },
    {
      id: 4,
      title: "East West University Admission Help Desk",
      img: "/public/university/banner2.png",
    },
  ];
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <BannerSection
        banner={banner}
        text={{
          title: "University-Standard Online Exams Smart & Secure",
          subtitle:
            "Prepare students with real NSU, BRACU, AUST, EWU, AIUB & IUB exam patterns.",
        }}
      />
      <div className="container mx-auto">
        <div className="text-center my-12 md:my-16">
          <SectionText title="বিশ্ববিদ্যালয় ভিত্তিক মডেল টেস্ট" />
          <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
            বাস্তব পরীক্ষার মতো অভিজ্ঞতা পেতে বিশ্ববিদ্যালয়-স্টাইল মডেল টেস্ট।
          </p>
        </div>
        <UniversitySmallCard />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-5">
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

export default FreeTest;
