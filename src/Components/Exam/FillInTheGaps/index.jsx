/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGetAllModelTestFillintheGapsQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamFillInTheGaps = ({ subject,onNext }) => {
  const { data } = useGetAllModelTestFillintheGapsQuery();

  const filteredFillIntheGap = data?.data.filter(
    (q) => q?.subjectId?.modelTest === subject?.modelTest?._id
  );
  // eslint-disable-next-line no-unused-vars
  const [userAnswers, setUserAnswers] = useState({});

  const handleChange = (qId, index, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [index]: value,
      },
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{subject?.title} - Fill in The Gaps</h2>

      {filteredFillIntheGap?.length === 0 && (
        <p className="text-gray-500">No fill-in-the-gaps questions found.</p>
      )}

      {filteredFillIntheGap?.map((item, index) => {
        const parts = item.question.split("___");

        return (
          <div
            key={item._id}
            className="bg-white shadow rounded p-4 mb-4 border border-gray-200"
          >
            <h3 className="font-medium text-lg mb-2">
              {index + 1}. Fill the blanks
            </h3>

            <div className="ml-2">
              {parts.map((part, i) => (
                <span key={i}>
                  {part}

                  {i < parts.length - 1 && (
                    <input
                      type="text"
                      className="border px-2 py-1 mx-2 rounded w-40"
                      placeholder="answer"
                      onChange={(e) =>
                        handleChange(item._id, i, e.target.value)
                      }
                    />
                  )}
                </span>
              ))}
            </div>

            <div className="text-gray-500 mt-2 text-sm">
              Total Blanks: {item.answers.length}
            </div>
          </div>
        );
      })}
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

export default ExamFillInTheGaps;
