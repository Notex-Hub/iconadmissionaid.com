import { useMemo, useState } from "react";
import SectionText from "../../Ui/SectionText";
import Button from "../../Ui/Button";
import UniversitySmallCard from "../../Package/UniversitySmallCard";
import { useGetAllCourseQuery } from "../../../../redux/Features/Api/Course/CourseApi";
import CourseCard from "../../Ui/CourseCard";

const OurFreeClasses = () => {
  const { data: courseData, isLoading, isError } = useGetAllCourseQuery();
  const courses = courseData?.data ?? [];

  const freeCourses = useMemo(
    () => courses.filter((c) => c?.isFree === true || c?.price === 0),
    [courses]
  );

  const uniqueUniversities = useMemo(() => {
    const map = new Map();
    freeCourses.forEach((c) => {
      if (c?.universityId) {
        const id = c.universityId._id;
        if (!map.has(id)) {
          map.set(id, {
            id,
            title: c.universityId?.name ?? "Unknown University",
            img:
              c.universityId?.cover_photo ??
              c.category?.cover_photo ??
              "/public/university/default.png",
            slug: c.universityId?.slug ?? null,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [freeCourses]);

  const [selectedUniId, setSelectedUniId] = useState(null);

  const filteredCourses = useMemo(() => {
    if (!selectedUniId) return freeCourses;
    return freeCourses.filter((c) => c?.universityId?._id === selectedUniId);
  }, [freeCourses, selectedUniId]);

  return (
    <div className="container mx-auto px-4 overflow-x-hidden">
      <div className="text-center my-12 md:my-16">
        <SectionText title="আমাদের সকল ফ্রি ক্লাসসমূহ" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700 max-w-2xl mx-auto">
          আমাদের ক্লাসের কোয়ালিটি সম্পর্কে ধারণা পেতে সম্পূর্ণ ফ্রিতে
          <br />
          দেখে নিতে পারো কিছু ক্লাস
        </p>
      </div>

      <UniversitySmallCard
        universities={uniqueUniversities}
        selectedId={selectedUniId}
        onSelect={(id) => setSelectedUniId(id)}
      />

      {isLoading && <div className="text-center py-8 text-gray-600">লোড হচ্ছে...</div>}
      {isError && <div className="text-center py-8 text-red-500">কোর্স লোড করতে সমস্যা হয়েছে।</div>}

      {!isLoading && !isError && (
        <>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-600">কোনো ফ্রি কোর্স পাওয়া যায়নি।</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
              {filteredCourses.map((course) => (
                <div key={course._id} className="min-w-0">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {courses.length === 8 && (
        <div className="flex justify-center items-center my-5">
          <Button text="View All Courses" />
        </div>
      )}
    </div>
  );
};

export default OurFreeClasses;
