import { useState } from "react";
import DOMPurify from "dompurify";

/* eslint-disable react/prop-types */
export function FAQAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);
  function toggle(i) { setOpenIndex(prev => (prev === i ? null : i)); }
  if (!items || items.length === 0) return null;

  return (
    <div className="space-y-3">
      {items.map((it, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div
            role="button"
            tabIndex={0}
            onClick={() => toggle(idx)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(idx); } }}
            className="w-full flex items-center justify-between p-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D0000]"
            aria-expanded={openIndex === idx}
          >
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#5D0000] mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12l5 5L20 7"></path>
              </svg>
              <h4 className="text-base md:text-lg font-semibold" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(it.question)) }} />
            </div>
            <div className="ml-4 flex items-center gap-2">
              <span className="text-sm text-gray-500">{openIndex === idx ? "বন্ধ করুন" : "খুলো"}</span>
              <svg className={`w-5 h-5 transform transition-transform ${openIndex === idx ? "rotate-180" : "rotate-0"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <div className={`px-5 pb-4 transition-all duration-200 ${openIndex === idx ? "block" : "hidden"}`}>
            <div className="space-y-3 text-sm text-gray-700 mt-2">
              {Array.isArray(it.answer) ? it.answer.map((a, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 p-3 rounded-md">
                  <svg className="w-4 h-4 text-[#5D0000] mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12l5 5L20 7"></path>
                  </svg>
                  <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(a), { ALLOWED_TAGS: ["b","strong","i","em","u","br","a","span","p"], ALLOWED_ATTR: ["href","target","rel","class"] }) }} />
                </div>
              )) : (
                <div className="prose max-w-none text-sm" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(it.answer)) }} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}