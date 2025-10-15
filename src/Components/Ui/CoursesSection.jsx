/* eslint-disable react/prop-types */
import SectionText from "./SectionText";

const CoursesSection = ({ section, CourseCard }) => {
  return (
    <section className="mb-12">
      <div className="text-center my-6">
        <SectionText title={section.title} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-5">
        {section.courses.map((c) => (
          <div key={c._id ?? c.id} className="min-w-0">
            <CourseCard course={c} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CoursesSection;
