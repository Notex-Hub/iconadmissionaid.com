/* eslint-disable react/prop-types */
import DOMPurify from "dompurify";

export function ParagraphIconH4List({ html }) {
  if (!html) return null;
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(html), "text/html");
  const pNodes = Array.from(doc.querySelectorAll("p"));
  const blocks = pNodes.map((p) => p.innerHTML && p.innerHTML.trim()).filter(Boolean);

  const Icon = () => (
    <svg className="w-5 h-5 text-[#5D0000] flex-shrink-0 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );

  return (
    <div className="space-y-3">
      {blocks.map((blk, idx) => {
        const safe = DOMPurify.sanitize(String(blk), { ALLOWED_TAGS: ["b","strong","i","em","u","br","a","span"], ALLOWED_ATTR: ["href","target","rel","class"] });
        return (
          <div key={idx} className="flex gap-3 items-start bg-white p-3 rounded-md">
            <Icon />
            <h4 className="text-lg font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: safe }} />
          </div>
        );
      })}
    </div>
  );
}
