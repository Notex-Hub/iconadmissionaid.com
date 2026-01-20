/* eslint-disable react/prop-types */
import { useGetAllModelCQTestQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamCQ = ({ subject, userAnswers, setUserAnswers }) => {
  const { data, isLoading } = useGetAllModelCQTestQuery();

  const filteredCQ = data?.data.filter(
    (q) =>
      q?.subjectId?.modelTest === subject?.modelTest?._id &&
      q?.subjectId?.slug === subject?.slug
  );

  const handleChange = (qId, value, maxMark) => {
    // নোট: সৃজনশীল প্রশ্নের মার্ক সাধারণত টিচার দেয়, এখানে লজিক অনুযায়ী মার্ক হ্যান্ডেল করা হয়েছে
    const randomMark = value.trim() !== "" ? Math.floor(Math.random() * maxMark) + 1 : 0;

    setUserAnswers((prev) => {
      const newData = {
        qId,
        userAnswer: value,
        obtainedMark: randomMark,
        maxMark
      };
      const filteredPrev = prev.filter((item) => item.qId !== qId);
      return [...filteredPrev, newData];
    });
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <div className="w-12 h-12 border-4 border-red-50 border-t-[#8B0000] rounded-full animate-spin"></div>
      <p className="text-gray-400 font-bold tracking-widest text-xs">LOADING QUESTIONS...</p>
    </div>
  );

  const stripHtml = (html) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};


  return (
    <div className="mx-auto px-2 pb-10">
  

      {filteredCQ?.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[2.5rem] p-20 text-center">
            <p className="text-gray-400 font-medium italic">No creative questions found for this subject.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {filteredCQ?.map((item, index) => {
            const userAnswerObj = userAnswers.find((ans) => ans.qId === item._id);
            const charCount = userAnswerObj?.userAnswer?.length || 0;

            return (
              <div
                key={item._id}
                className="group relative bg-white rounded-[2rem] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.05)] border border-gray-100 transition-all duration-500 hover:shadow-[0_30px_70px_-20px_rgba(139,0,0,0.1)]"
              >
                {/* Top Label Bar */}
                <div className="flex items-center justify-between px-8 py-4 border-b border-gray-50 bg-gray-50/30 rounded-t-[2rem]">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
                    Question #{index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-bold text-[#8B0000] bg-white border border-red-100 px-3 py-1 rounded-full shadow-sm">
                        Max Marks: {item.mark}
                     </span>
                  </div>
                </div>

                <div className="p-8 md:p-10">
                  {/* The Question */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug mb-8 group-hover:text-black transition-colors">
  {stripHtml(item.question)}
</h3>


                  {/* Writing Area */}
                  <div className="relative">
                    <textarea
                      rows="8"
                      className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-2xl px-6 py-5 text-gray-700 font-medium text-lg leading-relaxed outline-none transition-all duration-300 focus:bg-white focus:border-[#8B0000] focus:ring-8 focus:ring-red-50/50 placeholder:text-gray-300 placeholder:font-normal resize-none"
                      placeholder="Start typing your structured answer here..."
                      value={userAnswerObj?.userAnswer || ""}
                      onChange={(e) => handleChange(item._id, e.target.value, item.mark)}
                    ></textarea>

                    {/* Word/Char Count Indicator */}
                    <div className="absolute bottom-4 right-6 flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${charCount > 0 ? "bg-green-500 animate-pulse" : "bg-gray-200"}`}></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            {charCount} Characters
                        </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExamCQ;