import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
export function Sidebar({ course }) {
  const hasOffer = course.offerPrice && course.offerPrice > 0;
  const displayPrice = course.isFree ? "Free" : hasOffer ? `BDT ${course.offerPrice} TK` : `BDT ${course.price || 0} TK`;

  const includes = [
    `${course.course_tag?.length ? course.course_tag.join(", ") : "Course Content"}`,
    "৮০টি লাইভ ক্লাস",
    "ক্লাস রেকর্ডিং (2x স্পিডে রিভিশন)",
    "মক টেস্ট ও ডেইলি অ্যাসাইনমেন্ট",
    "ডাউট সলভ সেশন"
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-lg shadow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500">Price</div>
            <div className="text-2xl font-bold text-[#008000]">{displayPrice}</div>
            {hasOffer && <div className="text-sm line-through text-gray-400">BDT {course.price} TK</div>}
          </div>
        </div>

        <Link to={`/enroll/${course.slug || course.id}`} className="block">
          <button className="w-full bg-[#16a34a] text-white font-semibold py-3 rounded-lg hover:opacity-95 transition">কোর্সটি নিন</button>
        </Link>

        <div className="mt-3 flex gap-2">
          <button className="flex-1 border rounded py-2 text-sm">Preview</button>
          <button className="flex-1 border rounded py-2 text-sm">Contact</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="font-semibold mb-3">এই কোর্সে যা আছে</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          {includes.map((it, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#5D0000] mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12l5 5L20 7" />
              </svg>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-sm text-gray-600">
        <div className="font-semibold mb-2">Need Help?</div>
        <div>Hotline: +8801799-056414</div>
        <div className="mt-2">
          <Link to="/support" className="text-sm underline">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
