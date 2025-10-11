import HeroSection from "../../Components/Home/Banner/Banner";
import Navbar from "../../Components/Home/Navbar/Navbar";
import AdmissionPrepration from "../../Components/Home/Section/AdmissionPrepration";
import JoinSocalMidea from "../../Components/Home/Section/JoinSocalMidea";
import OurBooks from "../../Components/Home/Section/OurBooks";
import OurExperiencedTeachers from "../../Components/Home/Section/OurExperiencedTeachers";
import OurFreeClasses from "../../Components/Home/Section/OurFreeClasses";
import OurUniversity from "../../Components/Home/Section/OurUniversity";
import SuccessStory from "../../Components/Home/Section/SuccessStory";
import WhyChooseIcon from "../../Components/Home/WhyChooseIcon/WhyChooseIcon";
import Footer from "../../Layout/Footer";

const Home = () => {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <HeroSection />
      <WhyChooseIcon />
      <AdmissionPrepration />
      <OurBooks />
      <OurUniversity />
      <JoinSocalMidea />
      <OurFreeClasses />
      <SuccessStory />
      <OurExperiencedTeachers />
      <Footer/>
    </div>
  );
};

export default Home;

{
  /* Hello World
            <p className="font-[var(--font-bangla)] text-lg">
                আমি বাংলায় লিখছি 💚
            </p> */
}
