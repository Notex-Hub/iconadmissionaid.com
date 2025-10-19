/* eslint-disable react/prop-types */

import { useSelector } from "react-redux";

import { format as formatDateFn } from "date-fns"; // optional - remove import if not installed
import { useMemo } from "react";
import { useGetAllPurchaseQuery } from "../../../../redux/Features/Api/Purchase/Purchase";
import { useGetAllModuleQuery } from "../../../../redux/Features/Api/Module/ModuleApi";
import { useGetAllLiveClassQuery } from "../../../../redux/Features/Api/live/Live";

export default function LiveClassForPurchased() {
  const { userInfo } = useSelector((s) => s.auth || {});
  const studentId = userInfo?._id || userInfo?.id || null;
  const { data: purchaseResp, isLoading: purchasesLoading, isError: purchasesError } =
    useGetAllPurchaseQuery({ studentId }, { skip: !studentId });
  const { data: moduleResp, isLoading: modulesLoading } = useGetAllModuleQuery();
  const { data: liveResp, isLoading: liveLoading } = useGetAllLiveClassQuery();
  const purchases = purchaseResp?.data ?? [];
  const modules = moduleResp?.data ?? [];
  const liveClasses = liveResp?.data ?? [];

  const purchasedCourseIds = useMemo(() => {
    const s = new Set();
    purchases.forEach((p) => {
      const c = p?.courseId;
      if (!c) return;
      if (typeof c === "string") s.add(String(c));
      else if (typeof c === "object" && c._id) s.add(String(c._id));
    });
    return s;
  }, [purchases]);

  const purchasedUniversityIds = useMemo(() => {
    const s = new Set();
    purchases.forEach((p) => {
      const c = p?.courseId;
      if (!c) return;
      const u = c?.universityId;
      if (!u) return;
      if (typeof u === "string") s.add(String(u));
      else if (typeof u === "object" && (u._id || u?._id)) s.add(String(u._id || u));
    });
    return s;
  }, [purchases]);

  const allowedModuleIds = useMemo(() => {
    if (!modules || modules.length === 0 || purchasedUniversityIds.size === 0) return new Set();
    const s = new Set();
    modules.forEach((m) => {
      const uids = m?.universityId ?? [];
      if (!Array.isArray(uids)) {
        if (uids) {
          if (typeof uids === "string" && purchasedUniversityIds.has(String(uids))) s.add(String(m._id));
          else if (typeof uids === "object" && (uids._id ? purchasedUniversityIds.has(String(uids._id)) : false)) s.add(String(m._id));
        }
        return;
      }
      const matches = uids.some((uid) => purchasedUniversityIds.has(String(uid)));
      if (matches) s.add(String(m._id));
    });
    return s;
  }, [modules, purchasedUniversityIds]);

  // Filter live classes: keep if any of these true:
  // - live.courseId._id is in purchasedCourseIds
  // - live.courseId.universityId matches purchasedUniversityIds
  // - (optionally) live has no courseId (public) — we can exclude or include; here we include public ones if you want
  const filteredLiveClasses = useMemo(() => {
    if (!liveClasses || liveClasses.length === 0) return [];
    return liveClasses.filter((lc) => {
      if (lc.isDeleted) return false;
      // published only
      if (lc.status && String(lc.status).toLowerCase() !== "published") {
        // still allow if status missing
        // return false;
      }

      const course = lc.courseId;
      // If course is null, skip (or include) — here we include public classes
      if (!course) {
        // include public live classes (optional)
        return true;
      }

      // courseId may be object or string
      const courseId = typeof course === "string" ? String(course) : String(course._id || "");
      if (courseId && purchasedCourseIds.has(courseId)) return true;

      // course.universityId may be string or object
      const courseUniversity = typeof course === "object" ? course.universityId : null;
      if (!courseUniversity) return false;

      if (typeof courseUniversity === "string") {
        if (purchasedUniversityIds.has(String(courseUniversity))) return true;
      } else if (typeof courseUniversity === "object") {
        // courseUniversity could be { _id, name, ... } or an array — handle both
        if (Array.isArray(courseUniversity)) {
          if (courseUniversity.some((u) => purchasedUniversityIds.has(String(u)))) return true;
        } else if (courseUniversity._id && purchasedUniversityIds.has(String(courseUniversity._id))) {
          return true;
        }
      }

      return false;
    });
  }, [liveClasses, purchasedCourseIds, purchasedUniversityIds]);

  const loading = purchasesLoading || modulesLoading || liveLoading;

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Live Classes</h2>
          <div className="text-sm text-gray-500">
            {studentId ? "Enrolled / purchased classes" : "Please login to see purchased live classes"}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading live classes...</div>
        ) : (
          <>
            {filteredLiveClasses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No live classes available for your purchases.</div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredLiveClasses.map((lc) => {
                  const course = lc.courseId || {};
                  const courseTitle = typeof course === "object" ? (course.course_title || course.title || "") : "";
                  const timeText = lc.scheduleDate ? (() => {
                    try {
                      // use toLocaleString fallback; if date-fns installed you can format nicely
                      const d = new Date(lc.scheduleDate);
                      return isNaN(d.getTime()) ? String(lc.scheduleDate) : d.toLocaleString();
                    } catch (e) { return String(lc.scheduleDate); }
                  })() : "—";

                  return (
                    <article key={lc._id} className=" rounded-lg p-4 bg-gray-50 flex flex-col justify-between">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">{courseTitle}</div>
                        <h3 className="font-medium text-gray-900 truncate">{lc.title}</h3>
                        {lc.description && <p className="text-sm text-gray-700 mt-2 line-clamp-3 whitespace-pre-line">{String(lc.description)}</p>}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-2">
                        <div className="text-xs text-gray-500">{timeText}</div>

                        <div className="flex items-center gap-2">
                          {lc.link ? (
                            <a
                              href={lc.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            >
                              Join
                            </a>
                          ) : (
                            <button className="px-3 py-2 rounded-md bg-gray-200 text-sm">No Link</button>
                          )}

                          <button
                            onClick={() => {
                              try {
                                navigator.clipboard?.writeText(lc.link || window.location.href);
                                alert("Link copied to clipboard.");
                              } catch {
                                prompt("Copy link:", lc.link || window.location.href);
                              }
                            }}
                            className="px-3 py-2 rounded-md bg-white  text-sm"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
