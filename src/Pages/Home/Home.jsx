import AdmissionPrepration from "../../Components/Home/AdmissionPrepration/AdmissionPrepration";
import HeroSection from "../../Components/Home/Banner/Banner";
import Navbar from "../../Components/Home/Navbar/Navbar";
import WhyChooseIcon from "../../Components/Home/WhyChooseIcon/WhyChooseIcon";

const Home = () => {
  return (
    <div className="relative">
      {/* Fixed Transparent Navbar */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Banner Section */}
      <HeroSection />
      <WhyChooseIcon/>
      <AdmissionPrepration/>
    </div>
  );
};

export default Home;




{/* Hello World
            <p className="font-[var(--font-bangla)] text-lg">
                আমি বাংলায় লিখছি 💚
            </p> */}