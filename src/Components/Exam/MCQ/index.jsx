/* eslint-disable react/prop-types */
import { useGetAllModelMcqTestQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";


// eslint-disable-next-line no-unused-vars
const ExamMCQ = ({ subject, onNext }) => {
    const { data } = useGetAllModelMcqTestQuery();
    const filteredExam = data?.data.filter(
        (q) => q?.subjectId?.modelTest === subject?.modelTest?._id
    );

    return (
        <>
            <div className="p-4 max-w-3xl mx-auto">

                <h2 className="text-xl font-semibold mb-6">
                    Questions ({filteredExam?.length || 0}/40 answers)
                </h2>

                {filteredExam?.map((item, index) => (
                    <div
                        key={item._id}
                        className="bg-white  rounded-lg border border-gray-200 shadow-sm p-5 mb-6"
                    >

                        {/* Question text */}
                        <p className="text-gray-800 font-medium mb-4">
                            {index + 1}.{" "}
                            <span dangerouslySetInnerHTML={{ __html: item.question }} />
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
                                        htmlFor={`${item._id}-${i}`}
                                        className="flex items-center gap-3 p-3 border border-gray-200 rounded-md cursor-pointer hover:border-gray-400 transition-all"
                                    >
                                        <input
                                            id={`${item._id}-${i}`}
                                            type="radio"
                                            name={`q-${index}`}
                                            className="h-4 w-4 text-red-600"
                                        />
                                        <span className="text-gray-700">
                                            {letters[i]}. {opt}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Submit Button */}
                {/* <button
        onClick={onNext}
        className="mt-6 w-full bg-red-700 text-white py-4 rounded-md font-semibold text-lg hover:bg-red-800 transition"
      >
        Submit english Section →
      </button> */}
            </div>
        </>

    );
};

export default ExamMCQ;
