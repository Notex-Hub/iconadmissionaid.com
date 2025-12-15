/* eslint-disable react/prop-types */
import { useGetAllModelMcqTestQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamMCQ = ({ subject,selectedMCQAnswers, setSelectedMCQAnswers }) => {
    const { data } = useGetAllModelMcqTestQuery();

    const filteredExam = data?.data.filter(
        (q) =>
            q?.subjectId?.modelTest === subject?.modelTest?._id &&
            q?.subjectId?.slug === subject?.slug
    );


 const handleSelect = (questionId, options, correctAnswer, option, index) => {
    setSelectedMCQAnswers((prev) => {
        const exists = prev.find(
            (ans) => ans.questionId === questionId
        );
        if (exists) {
            return prev.map((ans) =>
                ans.questionId === questionId
                    ? {
                          ...ans,
                          selectedOption: option,
                          selectedIndex: index,
                      }
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

    return (
        <div className="p-4 max-w-3xl mx-auto">
           <h2 className="text-xl font-semibold mb-6 text-center">
  {filteredExam?.length > 0 ? (
    <span>Questions {filteredExam.length}</span>
  ) : (
    <span className="text-red-500">
      কোনো প্রশ্ন নেই, Next ক্লিক করে পরবর্তী প্রশ্নে যান
    </span>
  )}
</h2>


            {filteredExam?.map((item, index) => (
                <div
                    key={item._id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-6"
                >
                    {/* Question */}
                    <p className="text-gray-800 font-medium mb-4">
                        {index + 1}.{" "}
                        <span
                            dangerouslySetInnerHTML={{ __html: item.question }}
                        />
                    </p>

                    {/* Question image */}
                    {item.questionImg && (
                        <img
                            src={item.questionImg}
                            alt="question"
                            className="w-full max-h-[350px] object-contain rounded-md border mb-4"
                        />
                    )}

                    {/* Options */}
                    <div className="space-y-3">
                        {item.options.map((opt, i) => {
                            const letters = ["a", "b", "c", "d"];

                            return (
                                <label
                                    key={i}
                                    className="flex items-center gap-3 p-3 border rounded-md cursor-pointer hover:border-gray-400"
                                >
                                 <input
                                    type="radio"
                                    name={`q-${item._id}`}
                                    checked={
                                        selectedMCQAnswers.find(
                                            (ans) => ans.questionId === item._id
                                        )?.selectedIndex === i
                                    }
                                    onChange={() =>
                                        handleSelect(
                                            item._id,
                                            item.options,
                                            item.correctAnswer,
                                            letters[i],
                                            i
                                        )
                                    }
                                />

                                    <span>
                                        {letters[i]}. {opt}
                                    </span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExamMCQ;
