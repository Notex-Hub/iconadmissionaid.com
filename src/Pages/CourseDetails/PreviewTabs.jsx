/* src/pages/PreviewTabs.jsx */
/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import { useGetAllExamQuery } from "../../../redux/Features/Api/Exam/Exam";
import { useGetAllLectureQuery } from "../../../redux/Features/Api/Lecture/lecture";
import { useGetAllNoteQuery } from "../../../redux/Features/Api/note/Note";
import SyllabusList from "./SyllabusList";

export function PreviewTabs({ course, modules = [] }) {
  const [active, setActive] = useState("overview");

  const { data: lectureResponse } = useGetAllLectureQuery();
  const { data: notesResponse } = useGetAllNoteQuery();
  const { data: examResponse } = useGetAllExamQuery();

  const lectureData = lectureResponse?.data || [];
  const notesData = notesResponse?.data || [];
  const examData = examResponse?.data || [];

  // modules passed as-is; matching by moduleId happens in SyllabusList
  const modulesForCourse = modules || [];

  // group exams by module id
  const examsByModule = useMemo(() => {
    const map = {};
    (examData || []).forEach((ex) => {
      if (!ex) return;
      let mid = null;
      if (ex.moduleId && typeof ex.moduleId === "object") mid = ex.moduleId._id;
      else if (ex.moduleId) mid = String(ex.moduleId);
      else if (ex.module && ex.module.id) mid = String(ex.module.id);
      if (!mid) return;
      if (!map[mid]) map[mid] = [];
      map[mid].push(ex);
    });
    return map;
  }, [examData]);

  // ---------- modal & iframe handling ----------
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoIdOrUrl, setCurrentVideoIdOrUrl] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(""); // set only after user click (safer)

  // normalize input (full URL or id) -> video id
  const extractVideoId = (maybe) => {
    if (!maybe) return null;
    const s = String(maybe).trim();
    // if full URL
    try {
      if (s.startsWith("http://") || s.startsWith("https://")) {
        const url = new URL(s);
        // youtu.be short link
        if (url.hostname === "youtu.be") {
          const id = url.pathname.replace("/", "");
          return id || null;
        }
        // youtube.com links
        if (url.hostname.includes("youtube.com")) {
          const v = url.searchParams.get("v");
          if (v) return v;
          // /embed/VIDEOID
          const parts = url.pathname.split("/");
          const embedIndex = parts.indexOf("embed");
          if (embedIndex >= 0 && parts[embedIndex + 1]) return parts[embedIndex + 1];
        }
        // fallback: not a standard youtube URL
      }
    } catch (e) {
      // not a URL, treat as id below
    }
    // otherwise treat as id
    return s;
  };

  // build embed URL (privacy-friendly + origin + autoplay)
  const makeEmbedUrl = (videoId) => {
    if (!videoId) return "";
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      // using privacy-enhanced domain
      return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&autoplay=1&origin=${encodeURIComponent(origin)}`;
    } catch (e) {
      return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0&autoplay=1`;
    }
  };

  // called by SyllabusList when user clicks Play
  const handlePlayLecture = (videoIdOrUrl) => {
    const id = extractVideoId(videoIdOrUrl);
    if (!id) {
      // if cannot extract, still try opening the raw string in new tab as last resort
      setCurrentVideoIdOrUrl(videoIdOrUrl);
      setIframeSrc("");
      setShowVideoModal(true);
      return;
    }
    setCurrentVideoIdOrUrl(id);
    // only set iframe src now — user-initiated click
    const src = makeEmbedUrl(id);
    setIframeSrc(src);
    setShowVideoModal(true);
  };

  const closeVideo = () => {
    setShowVideoModal(false);
    setCurrentVideoIdOrUrl(null);
    // clear src to stop playback
    setIframeSrc("");
  };

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-2">
          <TabButton active={active === "overview"} onClick={() => setActive("overview")}>Overview</TabButton>
          <TabButton active={active === "syllabus"} onClick={() => setActive("syllabus")}>Syllabus</TabButton>
        </div>
      </div>

      <div>
        {active === "overview" && (
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold mb-2">Course overview</h3>
            <div dangerouslySetInnerHTML={{ __html: course?.descriptionHtml || "<p>No description</p>" }} />
          </div>
        )}

        {active === "syllabus" && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Course Syllabus</h3>
            <SyllabusList
              modules={modulesForCourse}
              examsByModule={examsByModule}
              lectures={lectureData}
              notes={notesData}
              onPlayLecture={handlePlayLecture}
            />
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Lecture video"
          onClick={closeVideo}
        >
          <div className="bg-white rounded-lg overflow-hidden max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-3 border-b">
              <h4 className="text-lg font-medium">Lecture</h4>
              <div className="flex items-center gap-3">
                <a
                  href={currentVideoIdOrUrl ? (currentVideoIdOrUrl.startsWith("http") ? currentVideoIdOrUrl : `https://www.youtube.com/watch?v=${currentVideoIdOrUrl}`) : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Open on YouTube
                </a>
                <button onClick={closeVideo} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Close</button>
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
                      href={currentVideoIdOrUrl ? (currentVideoIdOrUrl.startsWith("http") ? currentVideoIdOrUrl : `https://www.youtube.com/watch?v=${currentVideoIdOrUrl}`) : "#"}
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
    </section>
  );
}

function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-md text-sm font-medium ${active ? "bg-indigo-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}
    >
      {children}
    </button>
  );
}

export default PreviewTabs;
