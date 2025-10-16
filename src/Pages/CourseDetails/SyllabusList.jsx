/* src/components/SyllabusList.jsx */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { ChevronDown, ChevronRight, Calendar, FileText } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Responsive & enhanced SyllabusList
 */
export default function SyllabusList({ modules = [], examsByModule = {} }) {
  const [expandedModule, setExpandedModule] = useState(null);

  if (!modules || modules.length === 0) {
    return (
      <div className="border border-dashed border-gray-200 rounded-lg p-6 text-center bg-white">
        <p className="text-gray-500">কোনো মডিউল পাওয়া যায়নি।</p>
      </div>
    );
  }

  const toggle = (id) => {
    setExpandedModule((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-4">
      {modules.map((m, idx) => {
        const mid = m._id || String(m.id || "");
        const exams = examsByModule[mid] || [];
        const isExpanded = expandedModule === mid;

        return (
          <article
            key={mid || idx}
            className={`group bg-white rounded-lg p-4 transition-shadow ${
              isExpanded ? "shadow-lg ring-1 ring-indigo-100" : "shadow-sm hover:shadow-md"
            }`}
          >
            {/* Responsive layout: column on mobile, row on small+ */}
            <div className="flex flex-wrap sm:flex-row  gap-4">
              {/* numbered circle */}
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-semibold text-base">
                  {String(idx + 1)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-base sm:text-lg truncate">{m.moduleTitle || "Untitled Module"}</h4>

                    {/* mobile: meta under title; desktop: shown to right (see below hidden sm:block) */}
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="truncate">{m.slug}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[12px]">
                        <FileText className="w-3 h-3 mr-1" /> {exams.length} exam{exams.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[12px] text-gray-400 hidden sm:inline">•</span>
                      <span className="text-[12px] text-gray-400 hidden sm:inline">Module ID: {mid.slice(0, 6)}</span>
                    </div>
                  </div>

                  {/* right-side area on desktop: meta + toggle */}
                  <div className="flex items-center gap-3">
                    {/* created/updated: show only on sm+ here */}
                    <div className="text-xs text-gray-500 hidden sm:block text-right">
                      <div>Created: <span className="text-gray-600">{formatDate(m.createdAt)}</span></div>
                      <div>Updated: <span className="text-gray-600">{formatDate(m.updatedAt)}</span></div>
                    </div>

                    {/* Toggle button - larger on mobile for touch */}
                    <button
                      onClick={() => toggle(mid)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center justify-center p-2 sm:p-2.5 rounded-full bg-white border hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      title={isExpanded ? "Hide exams" : "View exams"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* collapsible content */}
                <div
                  className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="space-y-3">
                    {exams.length === 0 ? (
                      <div className="text-sm text-gray-500">এই মডিউলের কোনো পরীক্ষা পাওয়া যায়নি।</div>
                    ) : (
                      <div className="space-y-3">
                        {exams.map((ex) => (
                          <CompactExamRow key={ex._id} exam={ex} module={m} />
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <Link
                        to={`/modules/${m.slug || mid}`}
                        className="text-xs inline-flex items-center gap-1 text-indigo-600 hover:underline"
                      >
                        View module page
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

/* Compact exam row - responsive: column on mobile, row on sm+ */
function CompactExamRow({ exam = {}, module = {} }) {
  const {
    _id,
    examTitle,
    examType,
    totalQuestion,
    scheduleDate,
    status,
    slug,
    image,
  } = exam;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-md bg-gray-50 ">
      <div className="w-full sm:w-36 flex-shrink-0 rounded-md bg-white overflow-hidden border flex items-center justify-center">
        {image ? (
          <img src={image} alt={examTitle} className="object-cover w-full h-20 sm:h-14" />
        ) : (
          <div className="flex flex-col items-center justify-center text-xs text-gray-500 p-2">
            <Calendar className="w-4 h-4 mb-1" />
            <span>Exam</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center  sm:justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{examTitle || "Untitled Exam"}</div>
            <div className="text-xs text-gray-500 truncate">
              {examType} • {totalQuestion} question{totalQuestion !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="text-right text-xs sm:text-xs">
            <div
              className={`inline-block px-2 py-0.5 rounded-full text-white text-[11px] ${
                status === "published" ? "bg-green-600" : "bg-gray-500"
              }`}
            >
              {status}
            </div>
            <div className="text-gray-500 mt-1">{formatDateTime(scheduleDate)}</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <Link to={`/exams/${slug || _id}`} className="text-indigo-600 hover:underline">
            View exam
          </Link>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">Module: {module.moduleTitle}</span>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function formatDate(d) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-GB");
  } catch (e) {
    return String(d);
  }
}
function formatDateTime(d) {
  if (!d) return "—";
  try {
    const dt = new Date(d);
    // show only date/time if present
    const date = dt.toLocaleDateString("en-GB");
    const time = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${date}${time && time !== "Invalid Date" ? ` ${time}` : ""}`;
  } catch (e) {
    return String(d);
  }
}
