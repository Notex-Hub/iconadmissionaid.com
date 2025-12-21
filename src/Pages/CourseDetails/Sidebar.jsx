import React from "react";
import { Link } from "react-router-dom";
import { useGetAllPurchaseQuery } from "../../../redux/Features/Api/Purchase/Purchase";
import { useSelector } from "react-redux";

/* eslint-disable react/prop-types */
export function Sidebar({ course }) {
  // 🔹 HARD normalize (IMPORTANT)
  const safeCourse = course ?? {};

  const {
    price = 0,
    offerPrice = 0,
    isFree = false,
    slug,
    _id,
    id,
    course_tag = [],
  } = safeCourse;

  const { userInfo } = useSelector((state) => state.auth || {});
  const userId = userInfo?._id || userInfo?.id || null;

  // 🔹 Purchases
  const { data: purchaseResp, isLoading, isError } =
    useGetAllPurchaseQuery({ studentId: userId }, { skip: !userId });

  const purchases = Array.isArray(purchaseResp)
    ? purchaseResp
    : purchaseResp?.data ?? [];

  const normalizeId = (v) => (v == null ? "" : String(v));
  const normalizeSlug = (s) =>
    s ? String(s).trim().toLowerCase() : "";

  const courseIdCandidates = [
    safeCourse?._id,
    safeCourse?.id,
    safeCourse?.courseId?._id,
  ]
    .map(normalizeId)
    .filter(Boolean);

  const courseSlug = normalizeSlug(
    safeCourse?.slug ||
      safeCourse?.course_title ||
      safeCourse?.title
  );

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

      if (
        pCourseId &&
        courseIdCandidates.includes(normalizeId(pCourseId))
      )
        return true;

      if (courseSlug && pCourseSlug === courseSlug) return true;

      return false;
    });
  }, [purchases, userId, courseIdCandidates, courseSlug]);

  // 🔹 Price logic (SAFE)
  const hasOffer = Number(offerPrice) > 0;

  const displayPrice = isFree
    ? "Free"
    : hasOffer
    ? `BDT ${offerPrice} TK`
    : `BDT ${price} TK`;

  const enrollUrl = `/enroll/${slug || _id || id || ""}`;
  const viewCourseUrl = `/dashboard/my-courses`;

  return (
    <div className="space-y-4">
      {/* PRICE CARD */}
      <div className="bg-white p-5 rounded-lg shadow">
        <div className="mb-3">
          <div className="text-xs text-gray-500">Price</div>
          <div className="text-2xl font-bold text-[#008000]">
            {displayPrice}
          </div>

          {hasOffer && !isFree && (
            <div className="text-sm line-through text-gray-400">
              BDT {price} TK
            </div>
          )}
        </div>

        {isLoading ? (
          <button className="w-full bg-gray-200 py-3 rounded-lg" disabled>
            Loading...
          </button>
        ) : isError ? (
          <button className="w-full bg-gray-200 py-3 rounded-lg" disabled>
            Try again later
          </button>
        ) : ownsCourse ? (
          <Link to={viewCourseUrl}>
            <button className="w-full bg-red-600 text-white py-3 rounded-lg">
              View Course
            </button>
          </Link>
        ) : (
          <Link to={enrollUrl}>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg">
              কোর্সটি নিন
            </button>
          </Link>
        )}
      </div>

      {/* CONTENT LIST */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-semibold mb-3">এই কোর্সে যা আছে</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>
            {course_tag.length
              ? course_tag.join(", ")
              : "Course Content"}
          </li>
        </ul>
      </div>
    </div>
  );
}
