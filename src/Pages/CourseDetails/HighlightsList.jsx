export function HighlightsList() {
  const items = [
    "পরীক্ষার জন্য কোন বিষয়কে কোন ট্রিক দিয়ে দ্রুত শিখবেন",
    "টাইম ম্যানেজমেন্ট ও পরীক্ষার শর্টকাট",
    "বিগত বছরের প্রশ্নের সিদ্ধান্তমূলক সলভ",
    "প্রতিদিন ও সাপ্তাহিক মক টেস্ট"
  ];
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-3">কোর্সটি করে যা শিখবেন</h3>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <svg className="w-5 h-5 text-[#16a34a] mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
            <span className="text-sm text-gray-700">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}