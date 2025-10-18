/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export function ModuleCard({ m, onOpenLectures }) {
  const navigate = useNavigate();

  function handleOpen() {
    const payload = {
      id: m._id,
      slug: m.slug,
      module: m,
    };
    if (typeof onOpenLectures === "function") {
      onOpenLectures(payload);
    } else {
      navigate(`/module/${m.slug || m._id}`);
    }
  }

  const lecturesCount = (m.lectures?.length ?? 0);
  const uniCount = (m.universityId?.length ?? 0);

  return (
    <article
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? handleOpen() : null)}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-3 sm:p-4 flex flex-col gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-300"
      aria-label={`Open ${m.moduleTitle} lectures`}
      onClick={handleOpen}
      data-module-id={m._id}
      data-module-slug={m.slug}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex-none w-11 h-11 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
            </svg>
          </div>

          <div className="min-w-0">
            <h4 className="text-gray-900 text-sm sm:text-base font-semibold truncate">
              {m.moduleTitle}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 truncate">Slug: {m.slug}</span>
              {uniCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{uniCount} uni</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-gray-400">{new Date(m.createdAt || Date.now()).toLocaleDateString()}</div>
          <div className="inline-flex items-center gap-2">
            <span className="text-xs text-gray-600">{lecturesCount} lectures</span>
            <button
              onClick={(e) => { e.stopPropagation(); handleOpen(); }}
              className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-300"
              aria-label={`View lectures for ${m.moduleTitle}`}
            >
              View
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 5v14" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2">
        {m.description ? String(m.description).replace(/<[^>]*>?/gm, "").slice(0, 140) : "Lecture list & resources available inside."}
      </p>
    </article>
  );
}
