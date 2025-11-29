/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useGetAllCourseQuery } from "../../../../redux/Features/Api/Course/CourseApi";

export default function ReferPage() {
  const { userInfo } = useSelector((state) => state.auth || {});
  const { data: courseResp, isLoading, isError } = useGetAllCourseQuery();
  const courses = courseResp?.data || [];

  const [loadingMap, setLoadingMap] = React.useState({});
  const [copiedMap, setCopiedMap] = React.useState({}); // ✅ new

  async function handleGenerateAndCopy(course) {
    if (!userInfo || !userInfo._id) {
      toast.error("⚠️ User not authenticated.");
      return;
    }

    const id = course._id;
    setLoadingMap((s) => ({ ...s, [id]: true }));

    const referLink = `https://iconadmissionaid.com/course/${course.slug}?courseId=${course._id}&ref=${userInfo._id}`;

    try {
      await navigator.clipboard.writeText(referLink);

      const bonus = Number(course?.referBouns || 0);
      toast.success(
        bonus > 0
          ? `✅ Refer link copied! You earn ${bonus} bonus for each purchase.`
          : "✅ Refer link copied to clipboard!"
      );

      // ✅ show "Copied!" in button
      setCopiedMap((s) => ({ ...s, [id]: true }));
      setTimeout(() => {
        setCopiedMap((s) => ({ ...s, [id]: false }));
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.info("⚠️ Could not copy automatically — here's the link:\n" + referLink);
    } finally {
      setLoadingMap((s) => ({ ...s, [id]: false }));
    }
  }

  if (isLoading) return <div className="p-6 text-gray-600">Loading courses...</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load courses.</div>;
  if (!courses?.length)
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Refer a course</h2>
        <p className="mt-3 text-gray-600">কোনো কোর্স পাওয়া যায়নি।</p>
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Refer a course</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => {
          const id = c._id;
          const bonus = Number(c?.referBouns || 0);
          const isCopying = !!loadingMap[id];
          const isCopied  = !!copiedMap[id];

          return (
            <article key={id} className="bg-white rounded-2xl shadow p-4 flex flex-col">
              <img
                src={c.cover_photo}
                alt={c.course_title}
                className="w-full   rounded-lg mb-3"
              />

              <h3 className="text-lg font-medium">{c.course_title}</h3>
              <p
                className="text-sm text-gray-500 mt-1 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: c.description || "" }}
              />

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <div>Duration: {c.duration || "-"}</div>
                <div>Price: {c.isFree ? "Free" : c.price ? `৳ ${c.price}` : "-"}</div>
              </div>

              {bonus > 0 && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-sm font-semibold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <path d="M12 3l2.3 4.7L20 9l-4 3.9.9 5.1L12 15.9 7.1 18l.9-5.1L4 9l5.7-1.3L12 3z" />
                    </svg>
                    Refer bonus: <span className="font-bold">{bonus} Tk.</span>
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    এই কোর্স রেফার করে একজন কিনলে আপনি {bonus} Tk. বোনাস পাবেন।
                  </p>
                </div>
              )}

              <button
                onClick={() => handleGenerateAndCopy(c)}
                disabled={isCopying}
                className={`w-full cursor-pointer mt-4 py-2 px-3 rounded-xl font-medium shadow-sm text-white transition 
                  ${isCopied ? "bg-emerald-600" : isCopying ? "bg-green-300" : "bg-green-600 hover:bg-green-700"}`}
                aria-live="polite"
              >
                {isCopied ? (
                  <span className="inline-flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Copied!
                  </span>
                ) : isCopying ? "Copying..." : "Copy Refer Link"}
              </button>

              <div className="mt-3 text-xs text-gray-400">
                By: {c.createdBy?.name || "-"}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
