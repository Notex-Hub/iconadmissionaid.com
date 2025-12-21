/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useGetAllModelTestFillintheGapsQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamFillInTheGaps = ({ subject, userAnswers, setUserAnswers }) => {
  const { data, isLoading } = useGetAllModelTestFillintheGapsQuery();

  const filteredQuestions = data?.data.filter(
    (q) =>
      q?.subjectId?.modelTest === subject?.modelTest?._id &&
      q?.subjectId?.slug === subject?.slug
  );

  const handleChange = (qId, value) => {
    const findQuestion = filteredQuestions.find((item) => item._id === qId);
    const saveData = {
      qId: qId,
      mark: findQuestion?.mark || 0,
      isCorrect: findQuestion?.answers?.some(
        (ans) => ans.toLowerCase().trim() === value.toLowerCase().trim()
      ),
      userAnswer: value,
    };

    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex((item) => item.qId === qId);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = saveData;
        return updated;
      } else {
        return [...prev, saveData];
      }
    });
  };

  const getExistingValue = (qId) => {
    return userAnswers.find((ans) => ans.qId === qId)?.userAnswer || "";
  };

  if (isLoading) return <div className="p-10 text-center text-gray-400 animate-pulse">Loading Gaps Questions...</div>;

  return (
    <div className=" mx-auto py-6">
      {/* Header Section */}
      <div className="mb-10 flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Fill In The Gaps
          </h2>
          <p className="text-sm text-gray-400 font-medium">Type the correct word in the blank spaces</p>
        </div>
        <div className="bg-red-50 text-[#8B0000] px-4 py-2 rounded-xl text-xs font-bold border border-red-100">
           {filteredQuestions?.length || 0} Questions
        </div>
      </div>

      <div className="space-y-6">
        {filteredQuestions?.map((item, index) => {
          const parts = item.question.split("___");

          return (
            <div
              key={item._id}
              className="group bg-white border border-gray-100 rounded-[1.5rem] p-6 md:p-8 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-10 h-10 bg-gray-50 text-gray-400 group-hover:bg-[#8B0000] group-hover:text-white rounded-xl flex items-center justify-center font-black transition-colors duration-300">
                  {index + 1}
                </div>

                {/* Question Content */}
                <div className="flex-grow w-full">
                  <div className="text-lg md:text-xl font-semibold text-gray-800 leading-relaxed mb-6">
                    {parts[0]}
                    <span className="inline-block mx-2  min-w-[120px] text-[#8B0000] italic">
                      {getExistingValue(item._id)}
                    </span>
                    {parts[1]}
                  </div>

                  {/* Input Field */}
                  <div className="relative">
                    <input
                      type="text"
                      value={getExistingValue(item._id)}
                      placeholder="Type your answer here..."
                      onChange={(e) => handleChange(item._id, e.target.value)}
                      className="w-full md:w-[300px] bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-gray-700 font-bold focus:bg-white focus:border-[#8B0000] focus:ring-4 focus:ring-red-50 outline-none transition-all placeholder:text-gray-300 placeholder:font-normal"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helpful Hint */}
      <div className="mt-10 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
             <span className="text-blue-500">💡</span>
          </div>
          <p className="text-xs text-blue-600 font-medium leading-relaxed">
             সঠিক শব্দটি ইনপুট বক্সে টাইপ করুন। বানান ভুলের দিকে সতর্ক থাকুন, কারণ এটি স্বয়ংক্রিয়ভাবে যাচাই করা হবে।
          </p>
      </div>
    </div>
  );
};

export default ExamFillInTheGaps;