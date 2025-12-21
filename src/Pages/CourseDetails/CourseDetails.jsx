/* src/pages/CourseDetailsPage.jsx */
/* eslint-disable react/prop-types */

import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";

import {
  useGetAllCourseDetailsQuery,
  useGetAllCourseQuery,
} from "../../../redux/Features/Api/Course/CourseApi";

import { useGetAllModuleQuery } from "../../../redux/Features/Api/Module/ModuleApi";

import { CourseHeader } from "./CourseHeader";
import { PreviewTabs } from "./PreviewTabs";
import { InstructorList } from "./InstructorList";
import { HighlightsList } from "./HighlightsList";
import { ParagraphIconH4List } from "./RichContentWithIcons";
import { FAQAccordion } from "./FAQAccordion";
import { Sidebar } from "./Sidebar";

import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";

export default function CourseDetailsPage() {
  const { slug } = useParams();

  const { data: modulesData } = useGetAllModuleQuery();
  const { data: courseData } = useGetAllCourseQuery({ slug });

  const {
    data: rawResponse,
    error,
    isLoading,
    isFetching,
  } = useGetAllCourseDetailsQuery();

  // const [activeTab, setActiveTab] = useState("overview");

  // 🔹 helper
  const hasData = (data) =>
    Array.isArray(data) ? data.length > 0 : !!data;

  // 🔹 find course (NO fallback)
  const item = useMemo(() => {
    const list = rawResponse?.data || [];
    if (!Array.isArray(list)) return null;

    return (
      list.find((d) => {
        if (d.courseId && typeof d.courseId === "object" && d.courseId.slug)
          return d.courseId.slug === slug;
        if (d.slug) return d.slug === slug;
        if (d.courseId === slug) return true;
        return false;
      }) || null
    );
  }, [rawResponse, slug]);

  // 🔹 normalize course object
  const course = useMemo(() => {
    if (!item && !courseData?.data?.length) return null;

    const source =
      item?.courseId && typeof item.courseId === "object"
        ? item.courseId
        : item || courseData?.data?.[0];

    if (!source) return null;

    return {
      id: source._id,
      slug: source.slug,
      title: source.course_title || source.title || "Untitled Course",
      cover_photo: source.cover_photo || "",
      descriptionHtml: source.description || "",
      duration: source.duration || "—",
      isFree: !!source.isFree,
      price: source.price || 0,
      offerPrice: source.offerPrice || 0,
      course_type: source.course_type || "—",
      category: source.category?.title || "",
      instructors: source.instructors || [],
      daySchedule: source.daySchedule || [],
      timeShedule: source.timeShedule || [],
      course_tag: source.course_tag || [],
      suggestBook: source.suggestBook || [],
      courseDetails: item?.courseDetails || [],
      universityId: source.universityId || null,
    };
  }, [item, courseData, slug]);

  // 🔹 loading
  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-5xl animate-pulse space-y-4 p-6">
          <div className="h-64 bg-gray-200 rounded-lg" />
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  // 🔹 error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <p className="text-red-600 font-semibold mb-4">
            কোর্স লোড করা যায়নি।
          </p>
          <Link to="/courses" className="underline text-sm text-gray-700">
            সব কোর্স দেখো
          </Link>
        </div>
      </div>
    );
  }

  // 🔹 university → module filter
  const getCourseUniversityIds = () => {
    const u = course?.universityId;
    if (Array.isArray(u))
      return u.map((x) => (typeof x === "object" ? x._id : x));
    if (u && typeof u === "object") return [u._id];
    if (u) return [u];
    return [];
  };

  const courseUniversityIds = getCourseUniversityIds();

  const modules = (modulesData?.data || []).filter((m) => {
    const mu = m?.universityId;
    if (Array.isArray(mu))
      return mu.some((x) =>
        courseUniversityIds.includes(
          typeof x === "object" ? x._id : x
        )
      );
    if (mu && typeof mu === "object")
      return courseUniversityIds.includes(mu._id);
    if (mu) return courseUniversityIds.includes(mu);
    return false;
  });

  console.log("modules", modules);

  return (
    <>
      <Navbar />

      <div className="py-8 px-4 container mx-auto bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:mt-20">
          {/* 🔹 MAIN */}
          <main className="lg:col-span-8 space-y-6">
            {/* ✅ Header always visible */}
            <CourseHeader
              course={
                course || {
                  title: "কোর্স পাওয়া যায়নি",
                  cover_photo: "",
                  isFree: true,
                  price: 0,
                  duration: "",
                  course_type: "",
                }
              }
            />

            {/* 🔹 Preview / Modules */}
            {hasData(modules) ? (
              <PreviewTabs course={course} modules={modules} />
            ) : (
              <p className="text-sm text-gray-500">
                এই কোর্সের জন্য এখনো কোনো মডিউল যোগ করা হয়নি।
              </p>
            )}

            {/* 🔹 Instructors */}
            {hasData(course?.instructors) ? (
              <InstructorList instructors={course.instructors} />
            ) : (
              <p className="text-sm text-gray-500">
                এই কোর্সের কোনো Instructor তথ্য পাওয়া যায়নি।
              </p>
            )}

            <HighlightsList />

            {/* 🔹 Description */}
            {hasData(course?.descriptionHtml) ? (
              <div>
                <h3 className="text-xl font-bold mb-3">
                  কোর্স সম্পর্কে বিস্তারিত
                </h3>
                <ParagraphIconH4List html={course.descriptionHtml} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                কোর্সের বিস্তারিত বিবরণ এখনো দেওয়া হয়নি।
              </p>
            )}

            {/* 🔹 FAQ */}
            {hasData(course?.courseDetails) ? (
              <div>
                <h3 className="text-xl font-bold mb-3">কোর্স FAQ</h3>
                <FAQAccordion items={course.courseDetails} />
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                এই কোর্সের কোনো FAQ পাওয়া যায়নি।
              </p>
            )}
          </main>

          {/* 🔹 SIDEBAR always visible */}
          <aside className="lg:col-span-4">
            <Sidebar course={course} />
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
}
