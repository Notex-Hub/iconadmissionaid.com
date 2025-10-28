import BookSection from "../../Package/BookSection";
import SectionText from "../../Ui/SectionText";

const OurBooks = () => {
  return (
    <div className="container mx-auto">
      <div className="text-center my-20 px-4">
        <SectionText title="আমাদের বই সমূহ" />
         <div className="flex justify-center mt-2">
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
      </div>
      <BookSection />
    </div>
  );
};

export default OurBooks;
