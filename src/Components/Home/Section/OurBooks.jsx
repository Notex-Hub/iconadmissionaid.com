import BookSection from "../../Package/BookSection";
import SectionText from "../../Ui/SectionText";

const OurBooks = () => {
  return (
    <div className="container mx-auto">
      <div className="text-center my-20 px-4">
        <SectionText title="আমাদের বই সমূহ" />
      </div>
      <BookSection />
    </div>
  );
};

export default OurBooks;
