import Navbar from "../../Components/Home/Navbar/Navbar";
import UniversitySmallCard from "../../Components/Package/UniversitySmallCard";
import BannerSection from "../../Components/Ui/BannerSection";
import CourseCard from "../../Components/Ui/CourseCard";
import SectionText from "../../Components/Ui/SectionText";
import Footer from "../../Layout/Footer";
import banner from "../../assets/banner/coursesbanner.png";

const Courses = () => {
  const UniversityData = [
    {
      university: "NSU",
      categoryTitle: "NSU Specialized Courses",
      description:
        "Focused guidance and proven strategies to ensure your NSU admission success.",
      courses: [
        {
          title: "NSU AdmissionTest Spring 2026 Exam",
          subtitle: "Road to NSU Online Live Class",
          batch: "Premium Batch 17",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
        {
          title: "NSU AdmissionTest Spring 2026 Exam",
          subtitle: "Road to NSU Online Live Class",
          batch: "Premium Batch 18",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
      ],
    },
    {
      university: "BRAC",
      categoryTitle: "BRAC Specialized Courses",
      description:
        "Focused guidance and proven strategies to ensure your BRAC admission success.",
      courses: [
        {
          title: "BRAC AdmissionTest Spring 2026 Exam",
          subtitle: "Target BRAC Online Live Class",
          batch: "Premium Batch A",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
        {
          title: "BRAC AdmissionTest Spring 2026 Exam",
          subtitle: "Target BRAC Online Live Class",
          batch: "Premium Batch B",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
      ],
    },
    {
      university: "EWU",
      categoryTitle: "EWU Specialized Courses",
      description:
        "Focused guidance and proven strategies to ensure your EWU admission success.",
      courses: [
        {
          title: "EWU AdmissionTest Spring 2026 Exam",
          subtitle: "Target EWU Online Live Class",
          batch: "Premium Batch 1",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
        {
          title: "EWU AdmissionTest Spring 2026 Exam",
          subtitle: "Target EWU Online Live Class",
          batch: "Premium Batch 2",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
      ],
    },
    {
      university: "AUST",
      categoryTitle: "AUST Specialized Courses",
      description:
        "Focused guidance and proven strategies to ensure your AUST admission success.",
      courses: [
        {
          title: "AUST AdmissionTest Spring 2026 Exam",
          subtitle: "Target AUST Online Live Class",
          batch: "Premium Batch X",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
        {
          title: "AUST AdmissionTest Spring 2026 Exam",
          subtitle: "Target AUST Online Live Class",
          batch: "Premium Batch Y",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
      ],
    },
    {
      university: "IUB",
      categoryTitle: "IUB Specialized Courses",
      description:
        "Focused guidance and proven strategies to ensure your IUB admission success.",
      courses: [
        {
          title: "IUB AdmissionTest Spring 2026 Exam",
          subtitle: "Target IUB Online Live Class",
          batch: "Premium Batch 5",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
        {
          title: "IUB AdmissionTest Spring 2026 Exam",
          subtitle: "Target IUB Online Live Class",
          batch: "Premium Batch 6",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
      ],
    },
    {
      university: "AIUB",
      categoryTitle: "AIUB Specialized Courses",
      description:
        "Focused guidance and proven strategies to ensure your AIUB admission success.",
      courses: [
        {
          title: "AIUB AdmissionTest Spring 2026 Exam",
          subtitle: "Target AIUB Online Live Class",
          batch: "Premium Batch Alpha",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
        {
          title: "AIUB AdmissionTest Spring 2026 Exam",
          subtitle: "Target AIUB Online Live Class",
          batch: "Premium Batch Beta",
          price_bdt: 2500,
          currency: "BDT",
          buttons: [
            {
              label: "বিশদভাবে দেখুন",
              action: null,
            },
            {
              label: "রেজিস্ট্রেশন করুন",
              action: null,
            },
          ],
          card_image: null,
        },
      ],
    },
  ];

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <BannerSection banner={banner} />
      <div className="container mx-auto">
        <UniversitySmallCard />
        {UniversityData?.map((course, index) => (
          <section key={index}>
            <div className="text-center my-12 md:my-16">
              <SectionText title={course.categoryTitle} />
              <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
                {course.description}
              </p>
            </div>
            <div className="flex gap-4 justify-center mb-6">
              <button className="bg-[#5D0000] text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300">
                All Featured
              </button>
              <button className="bg-[#5D0000] text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300">
                Admission Course
              </button>
              <button className="bg-[#5D0000] text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300">
                Admission Live Course
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-5">
              {course.courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Courses;
