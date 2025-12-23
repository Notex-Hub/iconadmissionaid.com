/* eslint-disable react/prop-types */
/* src/pages/CourseModules/NoteList.jsx */
import { useMemo, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetAllNoteQuery } from "../../../../redux/Features/Api/note/Note";

const ITEMS_PER_PAGE = 6;

export default function NoteList({ moduleId = null, moduleIds = [] }) {
  const { userInfo } = useSelector((s) => s.auth || {});
  const { data: resp, isLoading, isError } = useGetAllNoteQuery();
  const notesRaw = resp?.data ?? [];

  const normalizedModuleId = useMemo(() => (moduleId ? String(moduleId) : null), [moduleId]);
  const normalizedModuleIds = useMemo(
    () => (moduleIds && moduleIds.length ? moduleIds.map((x) => String(x)) : []),
    [moduleIds]
  );

  const filtered = useMemo(() => {
    if (!notesRaw.length) return [];
    return notesRaw
      .filter((n) => !n.isDeleted && (n.status === "Published" || !n.status))
      .filter((n) => {
        const m = n.moduleId;
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
      .map((n) => {
        const module = n.moduleId && typeof n.moduleId === "object" ? n.moduleId : null;
        return {
          id: n._id,
          title: n.title,
          description: n.description || "",
          file: n.noteFile || "",
          moduleTitle: module?.moduleTitle || "",
          moduleSlug: module?.slug || "",
          createdAt: n.createdAt,
          slug: n.slug || "",
        };
      });
  }, [notesRaw, normalizedModuleId, normalizedModuleIds]);

  const [activeNote, setActiveNote] = useState(null);
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    setPage(1);
  }, [normalizedModuleId, normalizedModuleIds.join(",")]);

  useEffect(() => {
    if (activeNote && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeNote]);

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
    return <div className="text-sm text-gray-500">No notes found for the selected module(s).</div>;
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
        .nl-marquee { display:inline-block; white-space:nowrap; animation: nl-move 12s linear infinite; }
        @keyframes nl-move { 0% { transform: translateX(-5%); } 50% { transform: translateX(105%); } 100% { transform: translateX(-5%); } }
        .nl-preview { width:100%; height:420px; border-radius:8px; border:1px solid #e5e7eb; overflow:hidden; background:#f8fafc; }
        @media (max-width:640px) { .nl-preview { height:260px; } }
      `}</style>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
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
        {activeNote && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-gray-900">{activeNote.title}</div>
                <div className="text-xs text-gray-500">{activeNote.moduleTitle || ""}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500 mr-2">{activeNote.createdAt ? new Date(activeNote.createdAt).toLocaleDateString() : ""}</div>
                <button onClick={() => setActiveNote(null)} className="px-3 py-1 rounded bg-red-500 text-white shadow text-sm">Close</button>
              </div>
            </div>

            <div className="nl-preview mb-2">
              {activeNote.file ? (
                <iframe
                  title={activeNote.title}
                  src={activeNote.file}
                  className="w-full h-full"
                  style={{ border: 0 }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">No preview available</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {activeNote.file && (
                <>
                
                  <a
                    href={activeNote.file}
                    download
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white text-sm shadow hover:bg-green-700"
                  >
                    Download
                  </a>

               
                </>
              )}
            </div>

            {activeNote.description && (
              <div className="mt-3 text-sm text-gray-700 whitespace-pre-line">
                {String(activeNote.description).replace(/<[^>]*>?/gm, "")}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((note, idx) => (
          <article key={note.id || idx} className="bg-gray-50 rounded-lg p-3 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-gray-900 truncate">{note.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {note.moduleTitle && <span className="mr-2">Module: {note.moduleTitle}</span>}
                  {note.createdAt && <span>{new Date(note.createdAt).toLocaleDateString()}</span>}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveNote(note)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  >
                    View
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  {note.file ? (
                    <a
                      href={note.file}
                      download
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                    >
                      Download
                    </a>
                  ) : (
                    <button
                      onClick={() => alert("No file available for download.")}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200 text-sm"
                    >
                      No file
                    </button>
                  )}
                </div>

                <button
                  onClick={() => copyToClipboard(note.file || window.location.href)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {note.description && (
              <p className="text-sm text-gray-700 mt-2 line-clamp-3">{String(note.description).replace(/<[^>]*>?/gm, "")}</p>
            )}
          </article>
        ))}
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

      <div className="mt-4">
        <div className="nl-marquee text-xs text-gray-500">
          {userInfo?.name ? `User: ${userInfo.name} • ${userInfo._id || ""}` : `Guest`}
        </div>
      </div>
    </section>
  );
}
