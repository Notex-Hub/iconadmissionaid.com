import { useMemo, useState } from "react";
import { useGetAllCourseCategoryQuery, useGetAllCourseQuery } from "../../../redux/Features/Api/Course/CourseApi";
import Navbar from "../../Components/Home/Navbar/Navbar";
import UniversitySmallCard from "../../Components/Package/UniversitySmallCard";
import BannerSection from "../../Components/Ui/BannerSection";
import CourseCard from "../../Components/Ui/CourseCard";
import SectionText from "../../Components/Ui/SectionText";
import Footer from "../../Layout/Footer";
import CategoryFilters from "../../Components/Ui/CategoryFilters";
import CoursesSection from "../../Components/Ui/CoursesSection";
import banner from "../../assets/banner/coursesbanner.png";

const Courses = () => {
  const { courseCategory } = useGetAllCourseCategoryQuery();
  const { data: courseData, isLoading, isError } = useGetAllCourseQuery();

  const categories = courseCategory?.data ?? [];
  const courses = courseData?.data ?? [];

  const uniqueUniversities = useMemo(() => {
    const map = new Map();
    courses.forEach((c) => {
      const uni = c?.universityId;
      if (uni && uni._id && !map.has(uni._id)) {
        map.set(uni._id, {
          id: uni._id,
          title: uni.name ?? "Unknown University",
          img: uni.cover_photo ?? c?.category?.cover_photo ?? "/public/university/default.png",
          slug: uni.slug ?? null,
        });
      }
    });
    return Array.from(map.values());
  }, [courses]);

  const [selectedUniId, setSelectedUniId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      if (selectedUniId && c?.universityId?._id !== selectedUniId) return false;
      if (selectedCategoryId) {
        if (!c?.category) return false;
        if (typeof c.category === "string") return c.category === selectedCategoryId;
        return c.category._id === selectedCategoryId;
      }
      return true;
    });
  }, [courses, selectedUniId, selectedCategoryId]);

  const groupedByCategory = useMemo(() => {
    const map = new Map();
    filteredCourses.forEach((c) => {
      const cat = c?.category;
      const catId = !cat ? "uncategorized" : typeof cat === "string" ? cat : cat._id;
      if (!map.has(catId)) {
        const catObj = typeof cat === "object" ? cat : categories.find((x) => x._id === catId) ?? null;
        map.set(catId, {
          id: catId,
          title: catObj?.title ?? "Uncategorized",
          cover_photo: catObj?.cover_photo ?? null,
          slug: catObj?.slug ?? null,
          courses: [],
        });
      }
      map.get(catId).courses.push(c);
    });
    return Array.from(map.values());
  }, [filteredCourses, categories]);

  return (
    <div className="relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="overflow-hidden">
        <BannerSection banner={banner} />
      </div>

      <div className="container mx-auto px-4">
        <div className="mt-6">
          <UniversitySmallCard
            universities={uniqueUniversities}
            selectedId={selectedUniId}
            onSelect={(id) => setSelectedUniId(id)}
          />
        </div>

        <CategoryFilters
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <div className="text-center my-6 md:my-8">
          <SectionText title={courseCategory?.message} />
          {courseCategory?.description && (
            <p className="mt-3 text-base md:text-lg font-medium text-gray-700 max-w-2xl mx-auto">
              {courseCategory.description}
            </p>
          )}
        </div>

        {isLoading && <div className="text-center text-gray-600">Loading courses…</div>}
        {isError && <div className="text-center text-red-500">Failed to load courses.</div>}

        {selectedCategoryId ? (
          (() => {
            const section = groupedByCategory.find((g) => g.id === selectedCategoryId);
            return section ? (
              <CoursesSection section={section} CourseCard={CourseCard} />
            ) : (
              <div className="text-center text-gray-600">No courses in this category.</div>
            );
          })()
        ) : groupedByCategory.length === 0 ? (
          <div className="text-center text-gray-600">No courses found.</div>
        ) : (
          groupedByCategory.map((section) => (
            <CoursesSection key={section.id} section={section} CourseCard={CourseCard} />
          ))
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;
