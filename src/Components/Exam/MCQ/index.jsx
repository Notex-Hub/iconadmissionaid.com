/* eslint-disable react/prop-types */
import { useGetAllModelMcqTestQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamMCQ = ({ subject,onNext }) => {
  const { data } = useGetAllModelMcqTestQuery();

  const filteredExam = data?.data.filter(
    (q) => q?.subjectId?.modelTest === subject?.modelTest?._id
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{subject?.title} - MCQ</h2>

      {filteredExam?.length === 0 && (
        <p className="text-gray-500">No questions found.</p>
      )}

      {filteredExam?.map((item, index) => (
        <div
          key={item._id}
          className="bg-white shadow rounded p-4 mb-4 border border-gray-200"
        >
          <h3 className="font-medium text-lg mb-2">
            {index + 1}. {item.question}
          </h3>
          {item.questionImg && (
            <img src={item.questionImg} alt="question" className="mb-2 w-40" />
          )}

          <div className="ml-4">
            {item.options.map((opt, i) => (
              <div key={i} className="mb-1">
                <input type="radio" name={`q-${index}`} className="mr-2" />
                {opt}
              </div>
            ))}
          </div>
        </div>
      ))}
    <div className="w-full flex justify-end items-center">
          <button
        onClick={onNext}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Next
      </button>
     </div>
    </div>
  );
};

export default ExamMCQ;
