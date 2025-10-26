/* src/components/SyllabusList.jsx */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { ChevronDown, ChevronRight, Calendar, FileText, Play } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * SyllabusList with in-place modal iframe playback.
 * - Accepts lecture.videoId as full URL or plain video id.
 * - Opens modal with privacy-friendly embed (youtube-nocookie).
 * - Shows fallback "Open on YouTube".
 * - Ensures origin param and proper iframe allow attributes (no sandbox).
 */

function extractYouTubeId(input) {
  if (!input) return null;
  const s = String(input).trim();
  // plain 11-char id
  if (/^[\w-]{11}$/.test(s)) return s;
  // try parsing as URL
  try {
    const u = new URL(s);
    const host = (u.hostname || "").toLowerCase();
    // short link
    if (host.includes("youtu.be")) {
      const p = u.pathname.replace("/", "");
      if (/^[\w-]{11}$/.test(p)) return p;
    }
    // youtube.com variants
    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      // v param
      const v = u.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      // /embed/VIDEOID
      const parts = u.pathname.split("/");
      const idx = parts.indexOf("embed");
      if (idx >= 0 && parts[idx + 1] && /^[\w-]{11}$/.test(parts[idx + 1])) return parts[idx + 1];
    }
  } catch (e) {
    // not a valid URL — fall back to regex below
  }
  // fallback: first 11-char token found
  const m = String(input).match(/([\w-]{11})/);
  return m ? m[1] : null;
}

function buildYouTubeEmbedUrl(videoId) {
  if (!videoId) return null;
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    // privacy-friendly + origin param; autoplay=1 kept because src is set after user click
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&origin=${encodeURIComponent(origin)}&autoplay=1`;
  } catch (e) {
    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&autoplay=1`;
  }
}

export default function SyllabusList({
  modules = [],
  examsByModule = {},
  lectures = [],
  notes = [],
  onPlayLecture = () => {},
}) {
  const [expandedModule, setExpandedModule] = useState(null);

  // modal state for embedded playback
  const [showModal, setShowModal] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [iframeSrc, setIframeSrc] = useState("");

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

  // helper to normalize module id
  const moduleIdOf = (m) => {
    if (!m) return null;
    return m._id || String(m.id || "");
  };

  // helpers to match lecture/note moduleId robustly
  const matchesModule = (item, mid) => {
    if (!item || !mid) return false;
    // possible shapes: item.moduleId === null | string | { _id, slug, moduleTitle }
    try {
      if (item.moduleId && typeof item.moduleId === "object") {
        if (item.moduleId._id && String(item.moduleId._id) === String(mid)) return true;
        if (item.moduleId.slug && String(item.moduleId.slug) === String(mid)) return true;
        return false;
      }
      if (item.moduleId) return String(item.moduleId) === String(mid);
      if (item.module && typeof item.module === "object") {
        if (item.module._id && String(item.module._id) === String(mid)) return true;
        if (item.module.id && String(item.module.id) === String(mid)) return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const playInModal = (videoIdOrUrl) => {
    const id = extractYouTubeId(videoIdOrUrl);
    if (!id) {
      // fallback: open external URL if provided
      if (videoIdOrUrl && typeof window !== "undefined") {
        try {
          // if it's a URL string, open it
          const s = String(videoIdOrUrl).trim();
          if (s.startsWith("http://") || s.startsWith("https://")) {
            window.open(s, "_blank", "noopener,noreferrer");
            return;
          }
        } catch (e) {
          // ignore
        }
      }
      // nothing useful to play
      return;
    }
    const src = buildYouTubeEmbedUrl(id);
    setCurrentVideoId(id);
    // set iframe src now — user-initiated click
    setIframeSrc(src);
    setShowModal(true);

    // call optional parent hook for analytics/logging
    try {
      onPlayLecture(videoIdOrUrl);
    } catch (e) {
      // ignore errors from parent callback
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVideoId(null);
    // clearing src to stop playback and free resources
    setIframeSrc("");
  };

  return (
    <div className="space-y-4">
      {modules.map((m, idx) => {
        const mid = moduleIdOf(m);
        const exams = examsByModule[mid] || [];
        const isExpanded = expandedModule === mid;

        // lectures and notes belonging to this module
        const moduleLectures = (lectures || []).filter((l) => matchesModule(l, mid));
        const moduleNotes = (notes || []).filter((n) => matchesModule(n, mid));

        return (
          <article
            key={mid || idx}
            className={`group bg-white rounded-lg p-4 transition-shadow ${isExpanded ? "shadow-lg ring-1 ring-indigo-100" : "shadow-sm hover:shadow-md"}`}
          >
            {/* Responsive layout: column on mobile, row on small+ */}
            <div className="flex flex-wrap sm:flex-row gap-4">
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

                    {/* mobile: meta under title; desktop: shown to right */}
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className="truncate">{m.slug}</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[12px]">
                        <FileText className="w-3 h-3 mr-1" /> {exams.length} exam{exams.length !== 1 ? "s" : ""}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[12px]">
                        <Calendar className="w-3 h-3 mr-1" /> {moduleLectures.length} lecture{moduleLectures.length !== 1 ? "s" : ""}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[12px]">
                        <FileText className="w-3 h-3 mr-1" /> {moduleNotes.length} note{moduleNotes.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-[12px] text-gray-400 hidden sm:inline">•</span>
                      <span className="text-[12px] text-gray-400 hidden sm:inline">Module ID: {String(mid || "").slice(0, 6)}</span>
                    </div>
                  </div>

                  {/* right-side area on desktop: meta + toggle */}
                  <div className="flex items-center gap-3">
                    {/* created/updated: show only on sm+ here */}
                

                    {/* Toggle button */}
                    <button
                      onClick={() => toggle(mid)}
                      aria-expanded={isExpanded}
                      className="inline-flex items-center cursor-pointer justify-center p-2 sm:p-2.5 rounded-full bg-white border hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      title={isExpanded ? "Hide details" : "View details"}
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
                <div className={`mt-4 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[900px] opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="space-y-4">
                    {/* Exams */}
                    <div>
                      <h5 className="text-sm font-semibold mb-2">Exams</h5>
                      {exams.length === 0 ? (
                        <div className="text-sm text-gray-500">এই মডিউলের কোনো পরীক্ষা পাওয়া যায়নি।</div>
                      ) : (
                        <div className="space-y-3">
                          {exams.map((ex) => (
                            <CompactExamRow key={ex._id} exam={ex} module={m} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Lectures */}
                    <div>
                      <h5 className="text-sm font-semibold mb-2">Lectures</h5>
                      {moduleLectures.length === 0 ? (
                        <div className="text-sm text-gray-500">এই মডিউলের কোনো lecture নেই।</div>
                      ) : (
                        <ul className="space-y-2">
                          {moduleLectures.map((lec) => (
                            <li key={lec._id} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                              <div className="min-w-0">
                                <div className="font-medium truncate">{lec.title}</div>
                                <div className="text-xs text-gray-500 truncate">{lec.duration ? `${lec.duration} min` : "Duration N/A"} • {lec.server}</div>
                              </div>
                              <div>
                                {lec.isFree ? (
                                  <button
                                    onClick={() => playInModal(lec.videoId)}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-600 text-white text-sm"
                                    aria-label={`Play ${lec.title}`}
                                  >
                                    <Play className="w-4 h-4" /> Play
                                  </button>
                                ) : (
                                  <button disabled className="px-3 py-1 rounded-md bg-gray-100 text-sm text-gray-500 cursor-not-allowed">
                                    Locked
                                  </button>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <h5 className="text-sm font-semibold mb-2">Notes</h5>
                      {moduleNotes.length === 0 ? (
                        <div className="text-sm text-gray-500">এই মডিউলের কোনো note নেই।</div>
                      ) : (
                        <ul className="space-y-2">
                          {moduleNotes.map((note) => (
                            <li key={note._id} className="flex items-center justify-between p-3 rounded-md bg-gray-50">
                              <div className="min-w-0">
                                <div className="font-medium truncate">{note.title}</div>
                                <div className="text-xs text-gray-500 truncate">{note.description}</div>
                              </div>
                              <div>
                                {/* Notes are locked per requirement */}
                                <button disabled className="px-3 py-1 rounded-md bg-gray-100 text-sm text-gray-500 cursor-not-allowed" title="Locked">
                                  Locked
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}

      {/* Modal for embedded playback */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Lecture video"
          onClick={closeModal}
        >
          <div className="bg-white rounded-lg overflow-hidden max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-3 border-b">
              <h4 className="text-lg font-medium">Lecture</h4>
              <div className="flex items-center gap-3">
                
                <button onClick={closeModal} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Close</button>
              </div>
            </div>

            <div className="w-full" style={{ aspectRatio: "16/9" }}>
              {iframeSrc ? (
                <iframe
                  title="Lecture video"
                  src={iframeSrc}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-6">
                  <div className="text-center">
                    <p className="mb-3 text-sm text-gray-700">Unable to prepare embedded player for this video.</p>
                    <a
                      href={currentVideoId ? `https://www.youtube.com/watch?v=${currentVideoId}` : "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white"
                    >
                      Open on YouTube
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-md bg-white ">
      <div className="w-full sm:w-36 flex-shrink-0 rounded-md bg-gray-50 overflow-hidden border flex items-center justify-center">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{examTitle || "Untitled Exam"}</div>
            <div className="text-xs text-gray-500 truncate">
              {examType} • {totalQuestion} question{totalQuestion !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="text-right text-xs sm:text-xs">
            <div
              className={`inline-block px-2 py-0.5 rounded-full text-white text-[11px] ${
                String(status).toLowerCase() === "published" ? "bg-green-600" : "bg-gray-500"
              }`}
            >
              {status}
            </div>
            <div className="text-gray-500 mt-1">{formatDateTime(scheduleDate)}</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          
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
    const date = dt.toLocaleDateString("en-GB");
    const time = dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${date}${time && time !== "Invalid Date" ? ` ${time}` : ""}`;
  } catch (e) {
    return String(d);
  }
}
