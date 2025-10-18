/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

export function PurchaseCard({ p }) {
  const navigate = useNavigate();
  const course = p.courseId;
  const title = course?.course_title || course?.title || "Purchased (no course info)";
  const cover = course?.cover_photo || course?.cover || "/course-thumb.jpg";
  const createdAt = new Date(p.createdAt).toLocaleDateString();
  function openModules() {
    if (!course) return;
    const idOrSlug = course.slug || course._id;
    let uniIds = [];
    if (course.universityId) {
      if (Array.isArray(course.universityId)) uniIds = course.universityId.map(String);
      else if (typeof course.universityId === "string") uniIds = [course.universityId];
      else if (typeof course.universityId === "object" && course.universityId._id) uniIds = [course.universityId._id];
    }
    const uniParam = encodeURIComponent(uniIds.join(","));
    navigate(`/dashboard/course/modules/${encodeURIComponent(idOrSlug)}?university=${uniParam}`);
  }

  return (
    <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6">
      <div className="flex-shrink-0 w-full sm:w-36 h-24 sm:h-28 rounded-lg overflow-hidden bg-gray-100">
        <img src={cover} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-gray-900 dark:text-gray-100 text-lg sm:text-xl font-semibold leading-snug">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Purchased on <time dateTime={p.createdAt}>{createdAt}</time>
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
              {p.paymentInfo?.method || "Payment"}
            </span>
            {p.totalAmount !== undefined && (
              <span className="text-xs text-gray-500 dark:text-gray-400">Total: ৳{p.totalAmount}</span>
            )}
            {course?.isFree && (
              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">Free</span>
            )}
          </div>
        </div>

        <div className="mt-4 sm:mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={openModules}
              className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              aria-label={`View modules for ${title}`}
            >
              View Module
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="hidden cursor-pointer sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm"
              title="Copy link"
              aria-label="Copy purchase link"
            >
              Copy link
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(course?.cover_photo || course?.cover || "#", "_blank")}
              className="inline-flex items-center justify-center cursor-pointer w-10 h-10 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-200"
              aria-label="Preview cover"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A2 2 0 0122 9.618V18a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h8" />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </article>
  );
}
