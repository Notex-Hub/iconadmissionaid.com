import CoursesSection from "../../Package/CoursesSection";
import Button from "../../Ui/Button";
import SectionText from "../../Ui/SectionText";

const AdmissionPrepration = () => {
  return (
    <div className="container mx-auto">
      <div className="text-center my-40 px-4">
        <SectionText title="এডমিশন প্রস্তুতি কোর্স সমূহ" />
        <div className="flex justify-center mt-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 10"
            className="w-40 sm:w-56 md:w-72 lg:w-96"
          >
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff8f8f" />
                <stop offset="50%" stopColor="#ff4d4d" />
                <stop offset="100%" stopColor="#ff8f8f" />
              </linearGradient>
            </defs>

            <path
              d="M0 5 Q50 0, 100 5 T200 5"
              stroke="url(#grad)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="mt-6 text-gray-600 max-w-xl mx-auto text-base sm:text-lg">
          দেশের সেরা শিক্ষকদের সাথে প্রস্তুত হও তোমার স্বপ্নের বিশ্ববিদ্যালয়ের
          জন্য।
        </p>
      </div>
      <CoursesSection />
      <div className="flex justify-center items-center my-5">
        <Button text="View All Courses" />
      </div>
    </div>
  );
};

export default AdmissionPrepration;
