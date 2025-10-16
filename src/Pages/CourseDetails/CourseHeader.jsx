import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
export function CourseHeader({ course }) {
  const priceTag = course.isFree ? "Free" : course.offerPrice && course.offerPrice > 0 ? `BDT ${course.offerPrice}` : `BDT ${course.price}`;
  return (
    <div className="bg-white rounded-xl shadow p-6 relative overflow-hidden">
      <img src={course.cover_photo} alt={course.title} className="w-full h-44 md:h-56  rounded-md mb-4" />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{course.title}</h1>
          <div className="mt-2 text-sm text-gray-600">{course.category?.title || "Uncategorized"}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="bg-[#F3F4F6] px-3 py-1 rounded text-sm">{course.duration}</span>
            <span className="bg-[#F3F4F6] px-3 py-1 rounded text-sm capitalize">{course.course_type}</span>
            <span className="bg-[#F3F4F6] px-3 py-1 rounded text-sm">{priceTag}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border rounded">শেয়ার</button>
          <Link to={`/enroll/${course.slug || course.id}`} className="bg-[#16a34a] text-white px-4 py-2 rounded font-semibold">কোর্সটি নিন</Link>
        </div>
      </div>
    </div>
  );
}