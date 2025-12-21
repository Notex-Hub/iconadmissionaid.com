/* eslint-disable react/prop-types */
import { useGetAllModelMcqTestQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamMCQ = ({ subject, selectedMCQAnswers, setSelectedMCQAnswers }) => {
    const { data, isLoading } = useGetAllModelMcqTestQuery();

    const filteredExam = data?.data.filter(
        (q) =>
            q?.subjectId?.modelTest === subject?.modelTest?._id &&
            q?.subjectId?.slug === subject?.slug
    );

    const handleSelect = (questionId, options, correctAnswer, option, index) => {
        setSelectedMCQAnswers((prev) => {
            const exists = prev.find((ans) => ans.questionId === questionId);
            if (exists) {
                return prev.map((ans) =>
                    ans.questionId === questionId
                        ? { ...ans, selectedOption: option, selectedIndex: index }
                        : ans
                );
            }
            return [
                ...prev,
                {
                    questionId,
                    title: subject.title,
                    slug: subject.slug,
                    options,
                    correctAnswer,
                    selectedOption: option,
                    selectedIndex: index,
                },
            ];
        });
    };

    if (isLoading) return <div className="flex justify-center py-20 font-semibold text-gray-400 italic">লোড হচ্ছে...</div>;

    return (
        <div className=" mx-auto px-3 md:px-6 py-10 bg-gray-50/50 min-h-screen">
        
            {(!filteredExam || filteredExam.length === 0) && (
                <div className="bg-white border-2 border-red-100 p-10 rounded-2xl text-center shadow-sm">
                    <p className="text-red-600 text-lg font-medium">
                        কোনো প্রশ্ন পাওয়া যায়নি। পরবর্তী বাটনে ক্লিক করুন।
                    </p>
                </div>
            )}

            <div className="space-y-12">
                {filteredExam?.map((item, index) => {
                    const currentSelection = selectedMCQAnswers.find(
                        (ans) => ans.questionId === item._id
                    );

                    return (
                        <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                            {/* Question Header */}
                            <div className="p-5 md:p-6 bg-white border-b border-gray-100">
                                <div className="flex gap-4">
                                    <span className="flex-shrink-0 w-10 h-10 bg-[#8B0000] text-white rounded-full flex items-center justify-center font-black text-lg shadow-md">
                                        {index + 1}
                                    </span>
                                    <div className="prose prose-p:m-0 prose-img:rounded-lg max-w-none text-gray-900 text-lg font-semibold leading-snug pt-1">
                                        <div dangerouslySetInnerHTML={{ __html: item.question }} />
                                    </div>
                                </div>

                                {item.questionImg && (
                                    <div className="mt-5 flex justify-center bg-gray-50 rounded-lg p-2 border border-dashed border-gray-300">
                                        <img src={item.questionImg} alt="Question" className="max-h-[350px] object-contain rounded" />
                                    </div>
                                )}
                            </div>

                            {/* Options Grid */}
                            <div className="p-5 md:p-8 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {item.options.map((opt, i) => {
                                        const letters = ["A", "B", "C", "D"];
                                        const isSelected = currentSelection?.selectedIndex === i;

                                        return (
                                            <label
                                                key={i}
                                                className={`
                                                    relative flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                                                    ${isSelected 
                                                        ? "border-[#8B0000] bg-red-50/30 shadow-[0_0_15px_rgba(139,0,0,0.1)]" 
                                                        : "border-gray-200 hover:border-[#8B0000]/40 hover:bg-gray-50"}
                                                `}
                                            >
                                                {/* Circular Letter Icon */}
                                                <div className={`
                                                    w-9 h-9 flex-shrink-0 rounded-full border-2 flex items-center justify-center font-bold transition-colors
                                                    ${isSelected ? "bg-[#8B0000] border-[#8B0000] text-white" : "border-gray-300 text-gray-500"}
                                                `}>
                                                    {letters[i]}
                                                </div>

                                                <div className="w-full">
                                                    <input
                                                        type="radio"
                                                        name={`q-${item._id}`}
                                                        className="hidden" 
                                                        checked={isSelected}
                                                        onChange={() =>
                                                            handleSelect(item._id, item.options, item.correctAnswer, letters[i].toLowerCase(), i)
                                                        }
                                                    />
                                                    <div 
                                                        className={`prose-p:m-0 prose-img:max-h-20 break-words ${isSelected ? "text-red-900 font-bold" : "text-gray-700 font-medium"}`}
                                                        dangerouslySetInnerHTML={{ __html: opt }}
                                                    />
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            
        </div>
    );
};

export default ExamMCQ;