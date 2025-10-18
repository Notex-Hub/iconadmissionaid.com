/* src/pages/CourseModules/CourseModulesPage.jsx */
import { useMemo, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetAllModuleQuery } from "../../../../redux/Features/Api/Module/ModuleApi";
import { ModuleCard } from "./ModuleCard";
import LectureList from "./LectureList";

const TABS = ["Modules", "Lectures", "Exams", "Notes", "Facebook Group"];
const ITEMS_PER_PAGE = 6;

export default function CourseModulesPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: moduleResp, isLoading, isError } = useGetAllModuleQuery();
  const modules = moduleResp?.data ?? [];
  const [activeTab, setActiveTab] = useState("Modules");
  const [selectedModule, setSelectedModule] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const tab = qs.get("tab");
    const p = parseInt(qs.get("page") || "", 10);
    if (tab && TABS.includes(tab)) setActiveTab(tab);
    if (p && p > 0) setPage(p);
  }, [location.search]);

  const qs = new URLSearchParams(location.search);
  const uniParam = qs.get("university") || "";
  const universityIds = uniParam
    ? uniParam.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const courseModules = useMemo(() => {
    if (!modules.length) return [];
    if (universityIds.length > 0) {
      return modules.filter((m) => {
        const uids = m.universityId ?? [];
        if (!uids || uids.length === 0) return false;
        return uids.some((id) => universityIds.includes(String(id)));
      });
    }
    return modules.filter((m) => {
      const c = m.courseId;
      if (!c) return false;
      if (typeof c === "object") {
        if (c.slug && c.slug === slug) return true;
        if (c._id && String(c._id) === String(slug)) return true;
      }
      if (typeof c === "string") {
        if (c === slug) return true;
      }
      return false;
    });
  }, [modules, universityIds, slug]);

  const allowedModuleIdsForUniversities = useMemo(() => {
    if (!universityIds.length) return [];
    return modules
      .filter((m) => (m.universityId ?? []).some((id) => universityIds.includes(String(id))))
      .map((m) => String(m._id));
  }, [modules, universityIds]);

  const totalItems = courseModules.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedModules = courseModules.slice(startIndex, endIndex);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  function setQuery(params = {}) {
    const sp = new URLSearchParams(location.search);
    Object.entries(params).forEach(([k, v]) => {
      if (v === null || v === undefined) sp.delete(k);
      else sp.set(k, String(v));
    });
    window.history.replaceState({}, "", `${location.pathname}?${sp.toString()}`);
  }

  function handleOpenLectures(payload) {
    const moduleObj = payload?.module || payload;
    setSelectedModule(moduleObj);
    setActiveTab("Lectures");
    setQuery({ tab: "Lectures" });
  }

  function goToPage(n) {
    const next = Math.max(1, Math.min(totalPages, n));
    setPage(next);
    setQuery({ page: next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <div className="animate-pulse w-full max-w-4xl space-y-4">
          <div className="h-6 bg-gray-200 rounded-md" />
          <div className="h-64 bg-gray-200 rounded-md" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24 text-red-600">
        কিছু সমস্যা হয়েছে — পরে চেক করো।
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col md:flex-col md:items-start md:justify-between gap-4">
          <div>
            <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:underline">← Back</button>
            <h1 className="text-2xl font-bold mt-3">Course: <span className="text-green-700">{slug}</span></h1>
            {universityIds.length > 0 && <p className="text-sm text-gray-500 mt-2">Showing modules for university id(s): {universityIds.join(", ")}</p>}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-xs text-gray-500">View</div>
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t);
                  setSelectedModule(null);
                  setQuery({ tab: t, page: 1 });
                  setPage(1);
                }}
                className={activeTab === t
                  ? "px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium shadow-sm"
                  : "px-3 py-1.5 rounded-lg bg-white shadow cursor-pointer  text-sm text-gray-700 hover:bg-gray-50"
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Modules" && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Modules</h2>

            {totalItems === 0 ? (
              <div className="text-sm text-gray-500">No modules found for this course / university.</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {paginatedModules.map((m) => (
                    <ModuleCard key={m._id} m={m} onOpenLectures={handleOpenLectures} />
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">{`Showing ${Math.min(startIndex + 1, totalItems)}–${Math.min(endIndex, totalItems)} of ${totalItems}`}</div>

                  <nav className="flex items-center gap-2" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      className={`px-3 py-1 rounded-md ${page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50"}`}
                    >
                      Prev
                    </button>

                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const n = i + 1;
                        const isActive = n === page;
                        if (totalPages > 7) {
                          if (n === 1 || n === totalPages || (n >= page - 1 && n <= page + 1)) {
                            return (
                              <button
                                key={n}
                                onClick={() => goToPage(n)}
                                className={`px-3 py-1 rounded-md ${isActive ? "bg-green-600 text-white" : "bg-white border hover:bg-gray-50"}`}
                              >
                                {n}
                              </button>
                            );
                          }
                          if (n === 2 && page > 4) {
                            return <span key="dots-start" className="px-2 text-sm text-gray-500">…</span>;
                          }
                          if (n === totalPages - 1 && page < totalPages - 3) {
                            return <span key="dots-end" className="px-2 text-sm text-gray-500">…</span>;
                          }
                          return null;
                        }
                        return (
                          <button
                            key={n}
                            onClick={() => goToPage(n)}
                            className={`px-3 py-1 rounded-md ${isActive ? "bg-green-600 text-white" : "bg-white border hover:bg-gray-50"}`}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                      className={`px-3 py-1 rounded-md ${page === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border hover:bg-gray-50"}`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </>
            )}
          </section>
        )}

        {activeTab === "Lectures" && (
          <div className="mt-4">
            {selectedModule ? (
              <LectureList moduleId={selectedModule._id || selectedModule.slug} />
            ) : (
              <LectureList moduleIds={allowedModuleIdsForUniversities} />
            )}
          </div>
        )}

        {activeTab === "Exams" && (
          <section className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-3">Exams</h2>
            <div className="text-sm text-gray-600">Exams listing is not implemented yet. Provide exams data to render here.</div>
          </section>
        )}

        {activeTab === "Notes" && (
          <section className="bg-white rounded-2xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-3">Notes</h2>
            <div className="text-sm text-gray-600">Notes listing is not implemented yet. Provide notes data to render here.</div>
          </section>
        )}

        {activeTab === "Facebook Group" && (
          <section className="bg-white rounded-2xl p-6 shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Facebook Group</h2>
                <p className="text-sm text-gray-600 mt-2">Join the course community on Facebook to discuss lectures, ask questions and get announcements.</p>
              </div>
              <div className="flex items-center gap-3">
                <a href="#" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white">Open Facebook Group</a>
                <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm">Copy Link</button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
