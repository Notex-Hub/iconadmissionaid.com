import Navbar from "../../Components/Home/Navbar/Navbar";
import OurFreeLectures from "../../Components/Home/Section/OurFreeClasses";
import BannerSection from "../../Components/Ui/BannerSection";
import Footer from "../../Layout/Footer";
import banner from "../../assets/banner/freeclass.png";

const FreeClass = () => {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <BannerSection banner={banner} />
      <div className="container mx-auto">
       <OurFreeLectures />
      </div>
      <Footer />
    </div>
  );
};

export default FreeClass;
