import React from "react";
import { Link } from "react-router-dom";
import { useGetAllPurchaseQuery } from "../../../redux/Features/Api/Purchase/Purchase";
import { useSelector } from "react-redux";

/* eslint-disable react/prop-types */
export function Sidebar({ course = {} }) {
  const { userInfo } = useSelector((state) => state.auth || {});
  const userId = userInfo?._id || userInfo?.id || null;

  // ✅ Fetch purchase using studentId
  const { data: purchaseResp, isLoading, isError } = useGetAllPurchaseQuery(
    { studentId: userId },
    { skip: !userId }
  );

  // ✅ Normalize response
  const purchases = Array.isArray(purchaseResp)
    ? purchaseResp
    : purchaseResp?.data ?? [];

  // ✅ Helper for IDs
  const normalizeId = (v) => (v == null ? "" : String(v).trim());
  const normalizeSlug = (s) => (s ? String(s).trim().toLowerCase() : "");

  // ✅ Candidate course IDs
  const courseIdCandidates = [
    course._id,
    course.id,
    course.courseId?._id,
  ]
    .map(normalizeId)
    .filter(Boolean);

  const courseSlug = normalizeSlug(
    course.slug || course.course_title || course.title
  );

  // ✅ Check if user owns the course
  const ownsCourse = React.useMemo(() => {
    if (!userId || !purchases.length) return false;

    return purchases.some((p) => {
      const pStudentId = normalizeId(p?.studentId?._id || p?.studentId);
      if (pStudentId !== normalizeId(userId)) return false;

      const pCourse = p?.courseId;
      const pCourseId = normalizeId(pCourse?._id || pCourse);
      const pCourseSlug = normalizeSlug(
        pCourse?.slug || pCourse?.course_title
      );

      // ✅ Match by ID
      if (
        pCourseId &&
        courseIdCandidates.some((cId) => cId === normalizeId(pCourseId))
      ) {
        return true;
      }

      // ✅ Match by slug/title
      if (courseSlug && pCourseSlug === courseSlug) return true;

      return false;
    });
  }, [purchases, userId, courseIdCandidates, courseSlug]);

  const hasOffer = !!course?.offerPrice && Number(course.offerPrice) > 0;
  const isFree = !!course?.isFree;

  const displayPrice = isFree
    ? "Free"
    : hasOffer
    ? `BDT ${course.offerPrice} TK`
    : `BDT ${course.price ?? 0} TK`;

  const enrollUrl = `/enroll/${course.slug || course._id || course.id}`;
  const viewCourseUrl = `/dashboard/my-courses`;

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-lg shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500">Price</div>
            <div className="text-2xl font-bold text-[#008000]">
              {displayPrice}
            </div>
            {hasOffer && (
              <div className="text-sm line-through text-gray-400">
                BDT {course?.price ?? 0} TK
              </div>
            )}
          </div>
        </div>

        {isLoading ? (
          <button
            className="w-full bg-gray-200 text-gray-600 font-semibold py-3 rounded-lg"
            disabled
          >
            Loading...
          </button>
        ) : isError ? (
          <button
            className="w-full bg-gray-200 text-gray-600 font-semibold py-3 rounded-lg"
            disabled
          >
            Try again later
          </button>
        ) : ownsCourse ? (
          <Link to={viewCourseUrl}>
            <button className="w-full bg-gradient-to-r from-[#6A0000] via-[#B10000] to-[#FF0000]  cursor-pointer text-white font-semibold py-3 rounded-lg hover:opacity-95 transition">
              View Course
            </button>
          </Link>
        ) : (
          <Link to={enrollUrl}>
            <button className="w-full bg-[#16a34a] text-white cursor-pointer font-semibold py-3 rounded-lg hover:opacity-95 transition">
              কোর্সটি নিন
            </button>
          </Link>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-semibold mb-3">এই কোর্সে যা আছে</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-[#5D0000] mt-1"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path d="M5 12l5 5L20 7" />
            </svg>
            <span>
              {course?.course_tag?.length
                ? course.course_tag.join(", ")
                : "Course Content"}
            </span>
          </li>

          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#5D0000] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l5 5L20 7" />
            </svg>
            <span>৮০টি লাইভ ক্লাস</span>
          </li>

          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#5D0000] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l5 5L20 7" />
            </svg>
            <span>ক্লাস রেকর্ডিং (2x স্পিডে রিভিশন)</span>
          </li>

          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#5D0000] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l5 5L20 7" />
            </svg>
            <span>মক টেস্ট ও ডেইলি অ্যাসাইনমেন্ট</span>
          </li>

          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-[#5D0000] mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l5 5L20 7" />
            </svg>
            <span>ডাউট সলভ সেশন</span>
          </li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-sm text-gray-600">
        <div className="font-semibold mb-2">Need Help?</div>
        <div>Hotline: +8801799-056414</div>

        <div className="mt-2">
          <Link to="/" className="text-sm underline">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
