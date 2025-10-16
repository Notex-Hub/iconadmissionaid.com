/* src/pages/PreviewTabs.jsx */
/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { useGetAllExamQuery } from "../../../redux/Features/Api/Exam/Exam";
import SyllabusList from "./SyllabusList";

export function PreviewTabs({ course, modules = [] }) {
  const [active, setActive] = useState("overview");

  const { data: examResponse, isLoading: examsLoading } = useGetAllExamQuery();
  const examData = examResponse?.data || [];

  // filter modules that belong to this course (same logic you had)
  const modulesForCourse = useMemo(() => {
    const courseId = course?.id || (course?.courseId && course.courseId._id) || null;
    if (!courseId) return modules;
    return modules.filter((m) => {
      if (!m) return false;
      if (m.courseId) return String(m.courseId) === String(courseId);
      return true;
    });
  }, [modules, course]);

  // group exams by module id (moduleId may be object or primitive)
  const examsByModule = useMemo(() => {
    const map = {};
    (examData || []).forEach((ex) => {
      if (!ex) return;
      let mid = null;
      if (ex.moduleId && typeof ex.moduleId === "object") {
        mid = ex.moduleId._id;
      } else if (ex.moduleId) {
        mid = String(ex.moduleId);
      } else if (ex.module && ex.module.id) {
        mid = String(ex.module.id);
      }
      if (!mid) return;
      if (!map[mid]) map[mid] = [];
      map[mid].push(ex);
    });
    return map;
  }, [examData]);

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <TabButton active={active === "overview"} onClick={() => setActive("overview")}>Overview</TabButton>
          <TabButton active={active === "syllabus"} onClick={() => setActive("syllabus")}>Syllabus</TabButton>
          <TabButton active={active === "resources"} onClick={() => setActive("resources")}>Resources</TabButton>
        </div>
      </div>

      <div>
        {active === "overview" && (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">Course overview</h3>
            <div dangerouslySetInnerHTML={{ __html: course.descriptionHtml || "<p>No description</p>" }} />
          </div>
        )}

        {active === "syllabus" && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Course Syllabus</h3>
            <SyllabusList modules={modulesForCourse} examsByModule={examsByModule} />
          </div>
        )}

        {active === "resources" && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Resources</h3>
            <p className="text-sm text-gray-600">No resources available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm font-medium ${
        active ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

export default PreviewTabs;
