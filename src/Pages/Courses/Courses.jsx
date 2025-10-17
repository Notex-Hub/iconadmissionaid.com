import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

export default function Courses() {
  const location = useLocation(); 
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const qParam = params.get("q") ?? "";
  const uniParam = params.get("uni") ?? "";

  const { data: courseData, isLoading, isError } = useGetAllCourseQuery();
  const { courseCategory } = useGetAllCourseCategoryQuery();

  const categories = courseCategory?.data ?? [];
  const courses = courseData?.data ?? [];

  const [searchText, setSearchText] = useState(qParam);
  const [selectedUniId, setSelectedUniId] = useState(uniParam || null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    setSearchText(qParam);
  }, [qParam]);

  useEffect(() => {
    setSelectedUniId(uniParam || null);
  }, [uniParam]);

  const uniqueUniversities = useMemo(() => {
    const map = new Map();
    courses.forEach((c) => {
      const uni = c?.universityId;
      if (uni && uni._id && !map.has(uni._id)) {
        map.set(uni._id, {
          id: uni._id,
          title: uni.name ?? "Unknown University",
          img: uni.cover_photo ?? c?.category?.cover_photo ?? "/university/default.png",
          slug: uni.slug ?? null,
        });
      }
    });
    return Array.from(map.values());
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const q = (searchText || "").trim().toLowerCase();
    return courses.filter((c) => {
      if (selectedUniId && c?.universityId?._id !== selectedUniId) return false;
      if (selectedCategoryId) {
        if (!c?.category) return false;
        if (typeof c.category === "string") {
          if (c.category !== selectedCategoryId) return false;
        } else {
          if (c.category._id !== selectedCategoryId) return false;
        }
      }
      if (q) {
        const title = (c.title || "").toLowerCase();
        const shortDesc = (c.short_description || "").toLowerCase();
        const categoryTitle = (typeof c.category === "object" ? (c.category.title || "") : (categories.find(x => x._id === c.category)?.title || "")).toLowerCase();
        const uniName = (c.universityId?.name || "").toLowerCase();
        const tags = (c.tags || []).join(" ").toLowerCase();
        if (!title.includes(q) && !shortDesc.includes(q) && !categoryTitle.includes(q) && !uniName.includes(q) && !tags.includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [courses, selectedUniId, selectedCategoryId, searchText, categories]);

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

        {searchText && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="text-sm text-gray-600">Search results for <strong>{searchText}</strong></div>
            <div>
              <button
                onClick={() => {
                  setSearchText("");
                  const u = new URL(window.location.href);
                  u.searchParams.delete("q");
                  window.history.replaceState({}, "", u.toString());
                }}
                className="text-sm text-red-600 hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}

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
}
