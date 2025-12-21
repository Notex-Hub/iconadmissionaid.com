/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGetAllModelTestpassegeQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamSA = ({ subject, selectedOptions, setSelectedOptions }) => {
  const [index, setIndex] = useState(0);
  const { data, isLoading } = useGetAllModelTestpassegeQuery();
  
  // ফিল্টারিং লজিক
  const filteredExam = data?.data.filter(
    (item) => item?.subjectId === subject?._id
  );

  const passage = filteredExam?.[0];
  const questions = passage?.questions || [];

  if (isLoading) return <div className="p-10 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Loading Reading Passage...</div>;

  if (!passage) {
    return (
      <div className="p-12 bg-white rounded-3xl border-2 border-dashed border-gray-200 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-300 font-bold">!</span>
        </div>
        <p className="text-gray-500 font-medium">এই সেকশনের জন্য কোনো প্যাসেজ পাওয়া যায়নি।</p>
      </div>
    );
  }

  const handleSelect = (qId, option, currentQuestion) => {
    setSelectedOptions((prev) => {
      const existing = prev.find((item) => item.questionId === qId);
      const answerData = {
        questionId: qId,
        selectedOption: option,
        options: currentQuestion?.options,
        answer: currentQuestion?.answer,
        mark: currentQuestion?.mark,
      };

      if (existing) {
        return prev.map((item) => (item.questionId === qId ? answerData : item));
      } else {
        return [...prev, answerData];
      }
    });
  };

  const getSelectedOption = (qId) => {
    return selectedOptions.find((item) => item.questionId === qId)?.selectedOption;
  };

  const letters = ["A", "B", "C", "D"];

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-6 mb-10">
      
      {/* Left Column: Passage Area */}
      <div className="w-full lg:w-[55%] lg:sticky lg:top-44 h-fit">
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="px-8 py-5 bg-[#8B0000] flex justify-between items-center">
            <h2 className="text-white text-xs font-black uppercase tracking-[0.2em]">Reading Passage</h2>
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                <div className="w-2 h-2 rounded-full bg-white/60"></div>
            </div>
          </div>
          <div className="p-8 md:p-10 max-h-[65vh] overflow-y-auto leading-relaxed text-gray-700 font-serif text-xl selection:bg-red-100 custom-scrollbar">
             <div className="first-letter:text-5xl first-letter:font-bold first-letter:text-[#8B0000] first-letter:mr-3 first-letter:float-left">
                {passage.passage}
             </div>
          </div>
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-bold text-gray-400 uppercase">Interactive Reading Mode Active</span>
          </div>
        </div>
      </div>

      {/* Right Column: Question Area */}
      <div className="w-full lg:w-[45%] flex flex-col gap-6">
        
        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-10 relative overflow-hidden">
            {/* Question Background Watermark */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-9xl font-black select-none">
                Q{index + 1}
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <span className="bg-red-50 text-[#8B0000] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100">
                        Task {index + 1} of {questions.length}
                    </span>
                    <div className="text-[10px] font-bold text-gray-300 uppercase">Assessment Mode</div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-10">
                   {questions[index]?.question}
                </h3>

                <div className="grid gap-4">
                {questions[index]?.options.map((op, i) => {
                    const isSelected = getSelectedOption(questions[index]._id) === op;
                    return (
                    <button
                        key={i}
                        onClick={() => handleSelect(questions[index]._id, op, questions[index])}
                        className={`group relative flex items-center gap-5 p-5 rounded-2xl border-2 transition-all duration-300
                        ${isSelected 
                            ? "border-[#8B0000] bg-[#8B0000]/[0.02] translate-x-2" 
                            : "border-gray-50 bg-gray-50 hover:border-gray-200 hover:bg-white"}
                        `}
                    >
                        <div className={`w-11 h-11 flex-shrink-0 rounded-xl border-2 flex items-center justify-center font-black transition-all duration-300
                        ${isSelected ? "bg-[#8B0000] border-[#8B0000] text-white rotate-6" : "bg-white border-gray-100 text-gray-400 group-hover:text-gray-600"}
                        `}>
                        {letters[i]}
                        </div>
                        <span className={`text-left text-base leading-snug ${isSelected ? "text-gray-900 font-bold" : "text-gray-600 font-medium"}`}>
                        {op}
                        </span>
                    </button>
                    );
                })}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between mt-12 gap-4">
                    <button
                        onClick={() => { if(index > 0) setIndex(index - 1); }}
                        disabled={index === 0}
                        className={`flex-1 flex justify-center items-center py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all
                        ${index === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:bg-gray-50 hover:text-gray-800"}`}
                    >
                        Back
                    </button>
                    
                    <button
                        onClick={() => { if(index < questions.length - 1) setIndex(index + 1); }}
                        disabled={index === questions.length - 1}
                        className={`flex-[2] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-lg
                        ${index === questions.length - 1 
                        ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                        : "bg-[#8B0000] text-white shadow-red-50 hover:bg-red-900 hover:-translate-y-1 active:scale-95"}`}
                    >
                        {index === questions.length - 1 ? "End of Section" : "Save & Continue"}
                    </button>
                </div>
            </div>
        </div>

        {/* Bottom Dot Progress */}
        <div className="flex justify-center gap-3 py-2">
            {questions.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-[#8B0000]" : "w-2 bg-gray-200 hover:bg-gray-300"}`} 
                />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ExamSA;