/* eslint-disable react/prop-types */
/* src/pages/CourseModules/LectureList.jsx */
import { useMemo, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetAllLectureQuery } from "../../../../redux/Features/Api/Lecture/lecture";

const ITEMS_PER_PAGE = 6;

function extractYouTubeId(input) {
  if (!input) return null;
  if (/^[\w-]{11}$/.test(input)) return input;
  try {
    const u = new URL(input);
    if (u.hostname.includes("youtu.be")) {
      const p = u.pathname.replace("/", "");
      if (/^[\w-]{11}$/.test(p)) return p;
    }
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;
      const parts = u.pathname.split("/");
      const idx = parts.indexOf("embed");
      if (idx >= 0 && parts[idx + 1] && /^[\w-]{11}$/.test(parts[idx + 1])) return parts[idx + 1];
    }
  // eslint-disable-next-line no-empty, no-unused-vars
  } catch (e) {}
  const m = String(input).match(/([\w-]{11})/);
  return m ? m[1] : null;
}

function buildYouTubeEmbedUrl(videoId) {
  if (!videoId) return null;
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`;
}

export default function LectureList({ moduleId = null, moduleIds = [] }) {
  const { userInfo } = useSelector((s) => s.auth || {});
  const { data: resp, isLoading, isError } = useGetAllLectureQuery();
  const lecturesRaw = resp?.data ?? [];

  const normalizedModuleId = useMemo(() => (moduleId ? String(moduleId) : null), [moduleId]);
  const normalizedModuleIds = useMemo(() => (moduleIds && moduleIds.length ? moduleIds.map((x) => String(x)) : []), [moduleIds]);

  const filtered = useMemo(() => {
    if (!lecturesRaw.length) return [];
    return lecturesRaw
      .filter((lec) => !lec.isDeleted && lec.status === "Published")
      .filter((lec) => {
        const m = lec.moduleId;
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
      .map((lec) => {
        const module = lec.moduleId && typeof lec.moduleId === "object" ? lec.moduleId : null;
        return {
          id: lec._id,
          title: lec.title,
          duration: lec.duration,
          isFree: lec.isFree,
          server: lec.server,
          videoId: lec.videoId,
          moduleTitle: module?.moduleTitle || "",
          moduleSlug: module?.slug || "",
          createdAt: lec.createdAt,
          description: lec.description || "",
        };
      });
  }, [lecturesRaw, normalizedModuleId, normalizedModuleIds]);

  const [activeLecture, setActiveLecture] = useState(null);
  const [page, setPage] = useState(1);
  const playerContainerRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    setPage(1);
  }, [normalizedModuleId, normalizedModuleIds.join(",")]);

  useEffect(() => {
    if (activeLecture && playerContainerRef.current) {
      playerContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeLecture]);

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
    return <div className="text-sm text-gray-500">No lectures found for the selected module(s).</div>;
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

  function openFullscreen() {
    const el = playerContainerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) el.msRequestFullscreen();
  }

  return (
    <section className="bg-white rounded-2xl p-3 sm:p-6">
      <style>{`
        .ll-marquee { display:inline-block; white-space:nowrap; animation: ll-move 12s linear infinite; }
        @keyframes ll-move { 0% { transform: translateX(-5%); } 50% { transform: translateX(105%); } 100% { transform: translateX(-5%); } }
        .ll-player { position: relative; width: 100%; overflow: hidden; border-radius: 8px; background: #000; }
        .ll-player-inner { position: relative; padding-top: 56.25%; height: 0; }
        .ll-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
        @media (max-width: 640px) { .ll-player-inner { padding-top: 56.25%; } .ll-thumb { height: 96px; } }
        @media (min-width: 641px) { .ll-thumb { height: 96px; } }
      `}</style>

      <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Lectures</h3>
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

      <div ref={playerContainerRef}>
        {activeLecture && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 gap-2">
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-gray-900">{activeLecture.title}</div>
                <div className="text-xs text-gray-500">{activeLecture.moduleTitle || ""}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-500 mr-2">{activeLecture.duration ? `${activeLecture.duration} mins` : ""}</div>
                <button onClick={() => setActiveLecture(null)} className="px-3 py-1 rounded bg-red-500 text-white shadow text-sm">Close</button>
              </div>
            </div>

            <div className="ll-player">
              <div style={{ position: "absolute", top: 8, left: 8, zIndex: 30 }}>
                <div className="text-xs text-white/90 bg-black/40 px-2 py-1 rounded">{activeLecture.moduleTitle || "Module"}</div>
              </div>

              <div style={{ position: "absolute", top: 8, right: 8, zIndex: 30 }}>
                <div className="text-xs text-white/90 bg-black/40 px-2 py-1 rounded">{activeLecture.duration ? `${activeLecture.duration}m` : ""}</div>
              </div>

              <div style={{ position: "absolute", left: 0, right: 0, top: 44, zIndex: 28, pointerEvents: "none" }}>
                <div style={{ overflow: "hidden" }}>
                  <div className="ll-marquee text-white/85 text-xs px-2">
                    {userInfo?.name ? `User: ${userInfo.name} • ${userInfo._id || ""}` : `Guest`}
                  </div>
                </div>
              </div>

              <div className="ll-player-inner">
                {(function () {
                  const raw = activeLecture.videoId;
                  const youtubeId = extractYouTubeId(raw);
                  const playerUrl = youtubeId ? buildYouTubeEmbedUrl(youtubeId) : null;
                  if (!playerUrl) {
                    return (
                      <div className="w-full h-40 flex flex-col items-center justify-center text-sm text-white bg-gray-700 p-4">
                        <div>No embeddable player for this lecture.</div>
                        <div className="mt-3 text-xs text-gray-200">Use the Play button to open original source in a new tab if available (not automatic).</div>
                      </div>
                    );
                  }
                  return (
                    <>
                      <iframe
                        ref={iframeRef}
                        title={activeLecture.title}
                        src={playerUrl}
                        className="ll-iframe"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        sandbox="allow-scripts allow-same-origin"
                      />
                      <div style={{ position: "absolute", bottom: 10, right: 10, zIndex: 40 }}>
                        <button
                          onClick={() => copyToClipboard(`https://www.youtube.com/watch?v=${extractYouTubeId(activeLecture.videoId)}`)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white text-gray-900 text-xs font-medium shadow"
                        >
                          Copy Link
                        </button>
                        <button
                          onClick={openFullscreen}
                          className="ml-2 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white text-gray-900 text-xs font-medium shadow"
                        >
                          Fullscreen
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {paginated.map((lec, idx) => {
          const youtubeId = extractYouTubeId(lec.videoId);
          return (
            <article key={lec.id || idx} className="bg-gray-50 rounded-lg p-3 flex gap-3 items-start">
              <div className="w-28 h-16 flex-shrink-0 rounded-md overflow-hidden bg-black/5">
                {youtubeId ? (
                  <img
                    src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt={lec.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No preview</div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 truncate">{lec.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {lec.moduleTitle && <span className="mr-2">Module: {lec.moduleTitle}</span>}
                      {lec.duration !== undefined && <span>{lec.duration} mins</span>}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="inline-flex items-center gap-2">
                      {lec.isFree ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">Free</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs">Paid</span>
                      )}
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => {
                          const playerUrl = youtubeId ? buildYouTubeEmbedUrl(youtubeId) : null;
                          if (playerUrl) {
                            setActiveLecture(lec);
                          } else if (lec.videoId) {
                            copyToClipboard(lec.videoId);
                            alert("No embeddable player. Link copied to clipboard.");
                          } else {
                            alert("No video URL available.");
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                      >
                        Play
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 5v14" />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          const youtubeUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : (lec.videoId || "");
                          if (youtubeUrl) {
                            copyToClipboard(youtubeUrl);
                          } else {
                            alert("No link available to copy.");
                          }
                        }}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>
                </div>

                {lec.description && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{String(lec.description).replace(/<[^>]*>?/gm, "")}</p>
                )}
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
    </section>
  );
}
