import  { useMemo, useState } from "react";
import SectionText from "../../Ui/SectionText";
import Button from "../../Ui/Button";
import UniversitySmallCard from "../../Package/UniversitySmallCard";
import { useGetAllCourseQuery } from "../../../../redux/Features/Api/Course/CourseApi";
import { Link } from "react-router-dom";

const OurFreeClasses = () => {
  const { data: courseData, isLoading, isError } = useGetAllCourseQuery();
  const courses = courseData?.data ?? [];

  // all free courses
  const freeCourses = useMemo(
    () => courses.filter((c) => c?.isFree === true || c?.price === 0),
    [courses]
  );

  // unique universities derived from freeCourses
  const uniqueUniversities = useMemo(() => {
    const map = new Map();
    freeCourses.forEach((c) => {
      if (c?.universityId) {
        const id = c.universityId._id;
        if (!map.has(id)) {
          map.set(id, {
            id,
            title: c.universityId?.name ?? "Unknown University",
            img: c.universityId?.cover_photo ?? c.category?.cover_photo ?? "/public/university/default.png",
            slug: c.universityId?.slug ?? null,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [freeCourses]);

  // selected university id for filtering (null means "All")
  const [selectedUniId, setSelectedUniId] = useState(null);

  // filtered courses based on selectedUniId
  const filteredCourses = useMemo(() => {
    if (!selectedUniId) return freeCourses;
    return freeCourses.filter((c) => c?.universityId?._id === selectedUniId);
  }, [freeCourses, selectedUniId]);

  return (
    <div className="container mx-auto px-4">
      <div className="text-center my-12 md:my-16">
        <SectionText title="আমাদের সকল ফ্রি ক্লাসসমূহ" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700">
          আমাদের ক্লাসের কোয়ালিটি সম্পর্কে ধারণা পেতে সম্পূর্ণ ফ্রিতে <br />
          দেখে নিতে পারো কিছু ক্লাস
        </p>
      </div>

      {/* pass dynamic universities + selection handler */}
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
                <div key={course._id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
                  <img
                    src={course?.cover_photo}
                    alt={course?.course_title}
                    className="w-full h-44 object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/public/university/default-course.png";
                    }}
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{course.course_title}</h3>
                      <p
                        className="mt-2 text-sm text-gray-600 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: course?.description ?? "" }}
                      />
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500">🎓 {course?.universityId?.name ?? "Unknown University"}</p>
                      <p className="text-sm text-gray-500">Duration: {course?.duration ?? "N/A"}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/courses/${course?.slug ?? course?._id}`}
                        className="flex-1 text-center py-2 rounded-xl border border-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        View Course
                      </Link>
                      {course?.routine && (
                        <a href={course?.routine} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-red-100 border border-red-300 text-sm">
                          Routine
                        </a>
                      )}
                    </div>
                  </div>
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
