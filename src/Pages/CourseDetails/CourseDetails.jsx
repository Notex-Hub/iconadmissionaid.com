/* src/pages/CourseDetailsPage.jsx */
/* eslint-disable react/prop-types */
import  { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetAllCourseDetailsQuery } from "../../../redux/Features/Api/Course/CourseApi";
import { CourseHeader } from "./CourseHeader";
import { PreviewTabs } from "./PreviewTabs";
import { InstructorList } from "./InstructorList";
import { HighlightsList } from "./HighlightsList";
import { ParagraphIconH4List } from "./RichContentWithIcons";
import { FAQAccordion } from "./FAQAccordion";
import { Sidebar } from "./Sidebar";
import { useGetAllModuleQuery } from "../../../redux/Features/Api/Module/ModuleApi";
import Navbar from "../../Components/Home/Navbar/Navbar";
import Footer from "../../Layout/Footer";


export default function CourseDetailsPage() {
  const { slug } = useParams();
  // eslint-disable-next-line no-unused-vars
  const {data:modulesData, isLoading:moduleLoading} = useGetAllModuleQuery();
  const { data: rawResponse, error, isLoading, isFetching } = useGetAllCourseDetailsQuery();
  // eslint-disable-next-line no-unused-vars
  const [activeTab, setActiveTab] = useState("overview");

  const item = useMemo(() => {
    const list = rawResponse?.data || [];
    if (!Array.isArray(list) || list.length === 0) return null;
    const found = list.find((d) => {
      if (d.courseId && typeof d.courseId === "object" && d.courseId.slug) return d.courseId.slug === slug;
      if (d.slug) return d.slug === slug;
      if (d.courseId === slug) return true;
      return false;
    });
    return found || list[0];
  }, [rawResponse, slug]);

  const course = useMemo(() => {
    if (!item) return null;
    const source = item.courseId && typeof item.courseId === "object" ? item.courseId : item;
    console.log(source)
    return {
      id: source._id || item._id,
      courseId:source,
      slug: source.slug || item.slug || slug,
      title: source.course_title || source.title || "Untitled Course",
      cover_photo: source.cover_photo || source.coverPhoto || "",
      descriptionHtml: source.description || source.descriptionHtml || "<p>No description</p>",
      duration: source.duration || "—",
      isFree: !!source.isFree,
      price: source.price || 0,
      offerPrice: source.offerPrice || 0,
      course_type: source.course_type || source.courseType || "—",
      category: typeof source.category === "object" ? source.category : { title: source.category || "" },
      instructors: item.instructors || source.instructors || [],
      daySchedule: source.daySchedule || item.daySchedule || [],
      timeShedule: source.timeShedule || item.timeShedule || [],
      course_tag: source.course_tag || source.courseTag || [],
      suggestBook: Array.isArray(source.suggestBook) ? source.suggestBook : item.suggestBook || [],
      courseDetails: item.courseDetails || source.courseDetails || [],
      isDeleted: source.isDeleted || false,
    };
  }, [item, rawResponse, slug]);

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-5xl animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded-lg" />
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">কোর্স লোড করা যায়নি।</p>
          <pre className="text-xs text-gray-600">{String(error)}</pre>
          <Link to="/courses" className="mt-4 inline-block underline text-sm text-gray-700">কোর্স গুলো দেখো</Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <p className="font-semibold mb-4">কোর্স পাওয়া যায়নি।</p>
          <Link to="/courses" className="text-sm underline text-gray-700">সব কোর্স দেখো</Link>
        </div>
      </div>
    );
  }

  // normalize course university ids into an array of id strings
const getCourseUniversityIds = (course) => {
  const u = course?.courseId?.universityId ?? course?.universityId ?? null;

  // if it's an array (of strings or objects)
  if (Array.isArray(u)) {
    return u
      .map((it) => (typeof it === "object" ? it._id : String(it)))
      .filter(Boolean);
  }

  // if it's an object like { _id: '...' }
  if (u && typeof u === "object") {
    return [u._id].filter(Boolean);
  }

  // if it's a primitive id (string/number)
  if (u) return [String(u)];

  return [];
};

const courseUniversityIds = getCourseUniversityIds(course);

// now filter modules: module.universityId can be array (most likely), object or string
const modules = (modulesData?.data || []).filter((m) => {
  const mu = m?.universityId;

  // if module.universityId is an array -> check intersection
  if (Array.isArray(mu)) {
    // items inside mu might be objects or strings
    const moduleIds = mu.map((it) => (typeof it === "object" ? it._id : String(it))).filter(Boolean);
    return moduleIds.some((id) => courseUniversityIds.includes(id));
  }

  // if module.universityId is an object like { _id: '...' }
  if (mu && typeof mu === "object") {
    return courseUniversityIds.includes(mu._id);
  }

  // if module.universityId is a primitive (string)
  if (mu) {
    return courseUniversityIds.includes(String(mu));
  }

  // no universityId on module -> exclude
  return false;
});





  
  return (
    <>
    <Navbar/>
      <div className="py-8 px-4 container md:px-8 lg:px-16  mx-auto bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8  lg:mt-20">
        {/* Main column */}
        <main className="lg:col-span-8 space-y-6">
          <CourseHeader course={course} />
          <PreviewTabs course={course} modules={modules} />
          <InstructorList instructors={course.instructors} />
          <HighlightsList />
          <div>
            <h3 className="text-xl font-bold mb-3">কোর্স সম্পর্কে বিস্তারিত</h3>
            <ParagraphIconH4List html={course.descriptionHtml} />
          </div>

          {course.courseDetails && course.courseDetails.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3">কোর্স FAQ</h3>
              <FAQAccordion items={course.courseDetails} />
            </div>
          )}
        </main>
        <aside className="lg:col-span-4">
          <Sidebar course={course} />
        </aside>
      </div>
    </div>
    <Footer/>
    </>
  
  );
}

