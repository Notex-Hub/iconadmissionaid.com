/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import SectionText from "../../Ui/SectionText";
import Button from "../../Ui/Button";
import { useGetAllLectureQuery } from "../../../../redux/Features/Api/Lecture/lecture";

// Helper function to post form data
const postFreeTest = async ({ name: n, number: num, intersted: intr = "" }) => {
  const payload = { name: n, number: num, intersted: intr, crmStatus:"Pending", status:"Processing" };
  const res = await fetch(
    "https://sandbox.iconadmissionaid.com/api/v1/free-test/create-free-test",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || `Free-test API error (${res.status})`);
  }
  return data;
};

// Modal form before video plays
const LectureAccessForm = ({ onSubmit, onClose }) => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !number) {
      setError("দয়া করে নাম ও নম্বর পূরণ করুন");
      return;
    }
    try {
      setLoading(true);
      await postFreeTest({ name, number, intersted: "Free Lecture" });
      onSubmit();
    } catch (err) {
      setError(err.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-center mb-4">
          ফ্রি লেকচার দেখতে ফর্মটি পূরণ করুন
        </h3>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
              placeholder="তোমার নাম লিখো"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">মোবাইল নম্বর</label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-green-200"
              placeholder="তোমার মোবাইল নম্বর"
            />
          </div>
          <div className="flex justify-between items-center pt-3">
            <Button
              text={loading ? "সাবমিট হচ্ছে..." : "সাবমিট"}
              type="submit"
              disabled={loading}
            />
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              বাতিল
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LecturePlayCard = ({ lecture, onClose }) => {
  if (!lecture) return null;
  const youtubeEmbed = lecture.videoId && lecture.server?.toLowerCase() === "youtube";
  const thumbnail = lecture.videoId
    ? `https://img.youtube.com/vi/${lecture.videoId}/hqdefault.jpg`
    : "/public/lecture/default.png";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-white">
        <div className="flex items-start justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold">{lecture.title}</h3>
            <p className="text-sm text-gray-600">{lecture.moduleId?.moduleTitle ?? "Module"}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium hover:bg-gray-100"
          >
            Close
          </button>
        </div>
        <div className="bg-black relative" style={{ paddingTop: "56.25%" }}>
          {youtubeEmbed ? (
            <iframe
              title={lecture.title}
              src={`https://www.youtube.com/embed/${lecture.videoId}?rel=0&autoplay=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <img src={thumbnail} alt="thumbnail" className="w-1/2 rounded-md object-cover" />
            </div>
          )}
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Duration: <span className="font-medium">{lecture.duration ?? "-"} min</span>
          </div>
          <div className="text-sm text-gray-500">Server: {lecture.server ?? "N/A"}</div>
        </div>
      </div>
    </div>
  );
};

const OurFreeLectures = () => {
  const { data: lectureData, isLoading, isError } = useGetAllLectureQuery();
  const lectures = lectureData?.data ?? [];
  const freeLectures = useMemo(() => lectures.filter((l) => l?.isFree === true), [lectures]);

  const [activeLecture, setActiveLecture] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [pendingLecture, setPendingLecture] = useState(null);

  const handlePlayClick = (lecture) => {
    setPendingLecture(lecture);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    setActiveLecture(pendingLecture);
    setPendingLecture(null);
    setShowForm(false);
  };

  return (
    <div className="container mx-auto px-4 overflow-x-hidden">
      <div className="text-center my-12 md:my-16">
        <SectionText title="আমাদের সকল ফ্রি লেকচারসমূহ" />
        <p className="mt-3 text-lg md:text-xl font-medium text-gray-700 max-w-2xl mx-auto">
          ফ্রি লেকচার দেখতে প্লে আইকনে ক্লিক করো, আগে ছোট ফর্মটি পূরণ করো।
        </p>
      </div>

      {isLoading && <div className="text-center py-8 text-gray-600">লোড হচ্ছে...</div>}
      {isError && <div className="text-center py-8 text-red-500">লেকচার লোড করতে সমস্যা হয়েছে।</div>}

      {!isLoading && !isError && (
        <>
          {freeLectures.length === 0 ? (
            <div className="text-center py-8 text-gray-600">কোনো ফ্রি লেকচার পাওয়া যায়নি।</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
              {freeLectures.map((lecture) => {
                const thumb = lecture.videoId
                  ? `https://img.youtube.com/vi/${lecture.videoId}/mqdefault.jpg`
                  : "/public/lecture/default.png";

                return (
                  <article
                    key={lecture._id}
                    className="group bg-white rounded-2xl shadow-sm overflow-hidden border hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="relative">
                      <img
                        src={thumb}
                        alt={lecture.title}
                        className="w-full h-44 object-cover"
                      />
                      <button
                        onClick={() => handlePlayClick(lecture)}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-md hover:scale-105 transform transition-transform"
                        aria-label={`Play ${lecture.title}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6.5 5.5v9l7-4.5-7-4.5z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {lecture.isFree && (
                        <span className="absolute left-3 top-3 bg-green-600 text-white px-2 py-1 text-xs rounded">Free</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="text-md font-semibold line-clamp-2">{lecture.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{lecture.moduleId?.moduleTitle ?? "Module"}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-sm text-gray-600">{lecture.duration ?? "-"} min</div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {showForm && (
        <LectureAccessForm
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {activeLecture && (
        <LecturePlayCard lecture={activeLecture} onClose={() => setActiveLecture(null)} />
      )}
    </div>
  );
};

export default OurFreeLectures;