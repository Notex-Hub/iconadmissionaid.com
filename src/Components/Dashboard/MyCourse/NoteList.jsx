/* eslint-disable react/prop-types */
/* src/pages/CourseModules/NoteList.jsx */
import { useMemo, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetAllNoteQuery } from "../../../../redux/Features/Api/note/Note";

const ITEMS_PER_PAGE = 10;

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
          // CHANGED: Ensure files is always an array
          files: Array.isArray(n.noteFile) ? n.noteFile : n.noteFile ? [n.noteFile] : [],
          moduleTitle: module?.moduleTitle || "",
          moduleSlug: module?.slug || "",
          createdAt: n.createdAt,
          slug: n.slug || "",
        };
      });
  }, [notesRaw, normalizedModuleId, normalizedModuleIds]);

  const [activeNote, setActiveNote] = useState(null);
  // NEW: Track which specific file index from the array is being viewed
  const [selectedFileIdx, setSelectedFileIdx] = useState(0); 
  const [page, setPage] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    setPage(1);
  }, [normalizedModuleId, normalizedModuleIds.join(",")]);

  useEffect(() => {
    if (activeNote && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Reset file index to 0 whenever a new note is opened
    setSelectedFileIdx(0);
  }, [activeNote]);

  if (isLoading) {
    return (
      <div className="w-full p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (isError) return <div className="text-sm text-red-600">Something went wrong.</div>;
  if (!normalizedModuleId && !normalizedModuleIds.length) return <div className="text-sm text-gray-500">Module not selected.</div>;
  if (!filtered.length) return <div className="text-sm text-gray-500">No notes found.</div>;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE);

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    alert("Link copied!");
  };

  return (
    <section className="bg-white rounded-2xl p-3 sm:p-6">
      <style>{`
        .nl-preview { width:100%; height:500px; border-radius:8px; border:1px solid #e5e7eb; background:#f8fafc; }
        @media (max-width:640px) { .nl-preview { height:300px; } }
      `}</style>

      {/* Header & Pagination Controls */}
      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Course Notes</h3>
          <div className="text-xs text-gray-500 mt-1">{total} items total</div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
          <span className="text-sm">{page} / {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      {/* ACTIVE NOTE PREVIEW */}
      <div ref={containerRef}>
        {activeNote && (
          <div className="mb-8 p-4 border-2 border-blue-100 rounded-xl bg-blue-50/30">
            <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
              <div>
                <h4 className="font-bold text-gray-900">{activeNote.title}</h4>
                <p className="text-xs text-gray-500">{activeNote.moduleTitle}</p>
              </div>
              <button onClick={() => setActiveNote(null)} className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-sm">Close Preview</button>
            </div>

            {/* FILE SELECTOR TABS (If multiple files exist) */}
            {activeNote.files.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {activeNote.files.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFileIdx(i)}
                    className={`px-3 py-1 text-xs rounded-full border ${selectedFileIdx === i ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
                  >
                    Part {i + 1}
                  </button>
                ))}
              </div>
            )}

            <div className="nl-preview mb-4">
              {activeNote.files[selectedFileIdx] ? (
                <iframe
                  title={activeNote.title}
                  src={activeNote.files[selectedFileIdx]}
                  className="w-full h-full rounded-md"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">No file found</div>
              )}
            </div>

            <div className="flex gap-3">
               <a
                href={activeNote.files[selectedFileIdx]}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Download This Part
              </a>
            </div>
          </div>
        )}
      </div>

      {/* NOTE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((note) => (
          <article key={note.id} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="font-semibold text-gray-900 line-clamp-1">{note.title}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">
                {note.files.length} {note.files.length > 1 ? "Files" : "File"} • {new Date(note.createdAt).toLocaleDateString()}
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {note.description.replace(/<[^>]*>?/gm, "")}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveNote(note)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  View Notes
                </button>
                
                {/* Simple Download (Downloads the first file by default from the card) */}
                <a
                  href={note.files[0]}
                  download
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700"
                  title="Download first file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              </div>
              
              <button
                onClick={() => copyToClipboard(note.files[0])}
                className="text-center text-[11px] text-gray-400 hover:text-blue-600"
              >
                Copy main link
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Numerical Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm border ${page === i + 1 ? "bg-green-600 text-white border-green-600" : "bg-white hover:bg-gray-50"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </section>
  );
}