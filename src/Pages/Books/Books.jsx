import Navbar from "../../Components/Home/Navbar/Navbar";
import BookSection from "../../Components/Package/BookSection";
import BannerSection from "../../Components/Ui/BannerSection";
import SectionText from "../../Components/Ui/SectionText";
import Footer from "../../Layout/Footer";
import banner from "../../assets/banner/bookbanner.png";

const Books = () => {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <BannerSection banner={banner} />
      <div className="container mx-auto">
        <div className="text-center my-20 px-4">
          <SectionText title="আমাদের বই সমূহ" />
        </div>
        <BookSection />
      </div>
      <Footer />
    </div>
  );
};

export default Books;
