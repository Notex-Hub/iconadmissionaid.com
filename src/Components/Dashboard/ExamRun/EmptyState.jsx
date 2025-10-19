/* eslint-disable react/prop-types */
export const EmptyState = ({ onBack }) => {
  return (
    <div className="min-h-[320px] flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-8">
      <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V4a4 4 0 0 1 8 0v3" />
        </svg>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">কোনো প্রশ্ন পাওয়া যায়নি</h3>
      <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
        এই পরীক্ষার জন্য কোনো MCQ যোগ করা হয়নি বা আপাতত উপলব্ধ নেই। পরে ফিরে এসে চেক করুন অথবা অন্য কোনো পরীক্ষায় অংশগ্রহণ করুন।
      </p>

      <div className="flex gap-3">
        <button onClick={onBack} className="px-4 py-2 cursor-pointer rounded-lg bg-[#c21010] text-white">ফিরে যাও</button>
        <button onClick={() => window.location.href = "/"} className="px-4 py-2 cursor-pointer rounded-lg bg-gray-100">হোম</button>
      </div>
    </div>
  );
};
