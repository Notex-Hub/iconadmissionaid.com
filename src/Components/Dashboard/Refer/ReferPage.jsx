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

  async function handleGenerateAndCopy(course) {
    if (!userInfo || !userInfo._id) {
      toast.error("⚠️ User not authenticated.");
      return;
    }

    const id = course._id;
    setLoadingMap((s) => ({ ...s, [id]: true }));

    try {
      const referLink = `https://iconadmissionaid.com/course/${course.slug}?courseId=${course._id}&ref=${userInfo._id}`;
      
      // ✅ Always create the link first, then copy it
      await navigator.clipboard.writeText(referLink);
      
      // ✅ Trigger toast after successful copy
      toast.success("✅ Refer link copied to clipboard!");
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
        {courses.map((c) => (
          <article
            key={c._id}
            className="bg-white rounded-2xl shadow p-4 flex flex-col"
          >
            <img
              src={c.cover_photo}
              alt={c.course_title}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />

            <h3 className="text-lg font-medium">{c.course_title}</h3>
            <p
              className="text-sm text-gray-500 mt-1 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: c.description || "" }}
            />

            <div className="mt-3 text-sm text-gray-600">
              <div>Duration: {c.duration || "-"}</div>
              <div>Price: {c.isFree ? "Free" : c.price ? `৳ ${c.price}` : "-"}</div>
            </div>

            <button
              onClick={() => handleGenerateAndCopy(c)}
              disabled={!!loadingMap[c._id]}
              className={`w-full mt-4 py-2 px-3 cursor-pointer rounded-xl font-medium shadow-sm text-white ${
                loadingMap[c._id]
                  ? "bg-green-300"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loadingMap[c._id] ? "Copying..." : "Copy Refer Link"}
            </button>

            <div className="mt-3 text-xs text-gray-400">
              By: {c.createdBy?.name || "-"}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
