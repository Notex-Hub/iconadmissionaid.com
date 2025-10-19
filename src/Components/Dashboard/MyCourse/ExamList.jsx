/* eslint-disable react/prop-types */
/* src/pages/CourseModules/ExamList.jsx */
import { useMemo, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetAllExamQuery } from "../../../../redux/Features/Api/Exam/exam"; // adjust path if needed

const ITEMS_PER_PAGE = 6;

export default function ExamList({ moduleId = null, moduleIds = [], onStartExam }) {
  const { userInfo } = useSelector((s) => s.auth || {});
  const { data: resp, isLoading, isError } = useGetAllExamQuery();
  const examsRaw = resp?.data ?? [];

  const normalizedModuleId = useMemo(() => (moduleId ? String(moduleId) : null), [moduleId]);
  const normalizedModuleIds = useMemo(
    () => (moduleIds && moduleIds.length ? moduleIds.map((x) => String(x)) : []),
    [moduleIds]
  );

  const filtered = useMemo(() => {
    if (!examsRaw.length) return [];
    return examsRaw
      .filter((ex) => !ex.isDeleted && (ex.status === "published" || ex.status === "drafted" || !ex.status))
      .filter((ex) => {
        const m = ex.moduleId;
        if (!m) return false;
        if (normalizedModuleId) {
          if (typeof m === "string") return String(m) === normalizedModuleId;
          if (typeof m === "object") {
            if (m._id && String(m._id) === normalizedModuleId) return true;
            if (m.slug && String(m.slug) === normalizedModuleId) return true;
            return false;
          }
          return false;
        }
        if (normalizedModuleIds.length) {
          if (typeof m === "string") return normalizedModuleIds.includes(String(m));
          if (typeof m === "object") {
            return normalizedModuleIds.includes(String(m._id || m.slug || ""));
          }
          return false;
        }
        return false;
      })
      .map((ex) => {
        const module = ex.moduleId && typeof ex.moduleId === "object" ? ex.moduleId : null;
        return {
          id: ex._id,
          title: ex.examTitle,
          examType: ex.examType,
          totalQuestion: ex.totalQuestion,
          positiveMark: ex.positiveMark,
          negativeMark: ex.negativeMark,
          mcqDuration: ex.mcqDuration,
          cqMark: ex.cqMark,
          validTime: ex.validTime,
          scheduleDate: ex.scheduleDate,
          status: ex.status,
          isFree: ex.isFree === true || ex.isFree === "true",
          price: ex.price,
          moduleTitle: module?.moduleTitle || "",
          moduleSlug: module?.slug || "",
          createdAt: ex.createdAt,
          image: ex.image || "",
          slug: ex.slug || "",
        };
      });
  }, [examsRaw, normalizedModuleId, normalizedModuleIds]);

  const [activeExam, setActiveExam] = useState(null);
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    setPage(1);
  }, [normalizedModuleId, normalizedModuleIds.join(",")]);

  useEffect(() => {
    if (activeExam && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeExam]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-sm text-red-600">কিছু সমস্যা হয়েছে — পরে চেক করো।</div>;
  }

  if (!normalizedModuleId && !normalizedModuleIds.length) {
    return <div className="text-sm text-gray-500">Module not selected.</div>;
  }

  if (!filtered.length) {
    return <div className="text-sm text-gray-500">No exams found for the selected module(s).</div>;
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  function copyToClipboard(text) {
    try {
      navigator.clipboard?.writeText(text);
      alert("Link copied to clipboard.");
    } catch {
      prompt("Copy this link:", text);
    }
  }

  return (
    <section className="bg-white rounded-2xl p-3 sm:p-6">
      <style>{`
        .ll-marquee { display:inline-block; white-space:nowrap; animation: ll-move 12s linear infinite; }
        @keyframes ll-move { 0% { transform: translateX(-5%); } 50% { transform: translateX(105%); } 100% { transform: translateX(-5%); } }
      `}</style>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Exams</h3>
          <div className="text-xs text-gray-500 mt-1">{total} items</div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">Page</div>
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={`px-2 py-1 rounded ${page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50"}`}
            >
              Prev
            </button>
            <div className="px-3 py-1 rounded bg-white border text-sm">{page} / {totalPages}</div>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={`px-2 py-1 rounded ${page === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50"}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div ref={containerRef}>
        {activeExam && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-gray-900">{activeExam.title}</div>
                <div className="text-xs text-gray-500">{activeExam.moduleTitle || ""}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500 mr-2">{activeExam.examType || ""}</div>
                <button onClick={() => setActiveExam(null)} className="px-3 py-1 rounded bg-red-500 text-white shadow text-sm">Close</button>
              </div>
            </div>

            <div className="bg-gray-50 rounded p-4">
              <div className="text-sm text-gray-700">
                <div><strong>Type:</strong> {activeExam.examType}</div>
                <div><strong>Questions:</strong> {activeExam.totalQuestion}</div>
                <div><strong>MCQ Duration:</strong> {activeExam.mcqDuration ? `${activeExam.mcqDuration} mins` : "—"}</div>
                <div><strong>MCQ Mark/ + :</strong> {activeExam.positiveMark} &nbsp; <strong>- :</strong> {activeExam.negativeMark}</div>
                <div><strong>CQ Mark:</strong> {activeExam.cqMark}</div>
                <div><strong>Schedule:</strong> {activeExam.scheduleDate ? new Date(activeExam.scheduleDate).toLocaleString() : "—"}</div>
                <div className="mt-2">
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/exam/${activeExam.slug || activeExam.id}`)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white text-gray-900 text-xs font-medium shadow"
                  >
                    Copy Exam Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginated.map((ex, idx) => {
          return (
            <article key={ex.id || idx} className="bg-gray-50 rounded-lg p-3 flex gap-3 items-start">
              <div className="w-28 h-16 flex-shrink-0 rounded-md overflow-hidden bg-black/5">
                {ex.image ? (
                  <img src={ex.image} alt={ex.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No image</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{ex.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {ex.moduleTitle && <span className="mr-2">Module: {ex.moduleTitle}</span>}
                      {ex.examType && <span className="mr-2">{ex.examType}</span>}
                      {ex.totalQuestion !== undefined && <span>{ex.totalQuestion} q</span>}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="inline-flex items-center gap-2">
                      {ex.isFree ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">Free</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs">
                          {ex.price ? `৳ ${ex.price}` : "Paid"}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          if (typeof onStartExam === "function") {
                            onStartExam(ex);
                          } else {
                            setActiveExam(ex);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        Start
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 5v14" />
                        </svg>
                      </button>

                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}/exam/${ex.slug || ex.id}`)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-700 mt-2">
                  <div className="text-xs text-gray-500">
                    <span className="mr-2">Schedule: {ex.scheduleDate ? new Date(ex.scheduleDate).toLocaleString() : "—"}</span>
                    <span>Valid Time: {ex.validTime || "—"}</span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => {
          const n = i + 1;
          return (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded-md ${n === page ? "bg-green-600 text-white" : "bg-white border hover:bg-gray-50"}`}
            >
              {n}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 8 }}>
        <div className="ll-marquee text-xs text-gray-500">
          {userInfo?.name ? `User: ${userInfo.name} • ${userInfo._id || ""}` : `Guest`}
        </div>
      </div>
    </section>
  );
}
