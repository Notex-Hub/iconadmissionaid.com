import BookSection from "../../Package/BookSection";
import Button from "../../Ui/Button";
import SectionText from "../../Ui/SectionText";

const OurBooks = () => {
  return (
    <div className="container mx-auto">
      <div className="text-center my-20 px-4">
        <SectionText title="আমাদের বই সমূহ" />
      </div>
      <BookSection />
      <div className="flex justify-center items-center my-5">
        <Button text="View All Courses" />
      </div>
    </div>
  );
};

export default OurBooks;
