/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGetAllModelTestFillintheGapsQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamFillInTheGaps = ({ subject, onNext }) => {
  const { data } = useGetAllModelTestFillintheGapsQuery();
  const filteredQuestions = data?.data.filter(
    (q) => q?.subjectId?.modelTest === subject?.modelTest?._id
  );

  const [userAnswers, setUserAnswers] = useState({});
  const handleChange = (qId, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };


 

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">
        {subject?.title} – Fill in the Gaps
      </h2>

      {filteredQuestions?.length === 0 && (
        <p className="text-gray-500">No fill-in-the-gaps questions found.</p>
      )}

      {filteredQuestions?.map((item, index) => {
        // First gap only
        const questionText = item.question.split("___")[0];

        return (
          <div
            key={item._id}
            className="bg-white shadow-md border border-gray-200 rounded-xl p-5 mb-6"
          >
            <h3 className="font-semibold text-lg mb-3">
              {index + 1}. {questionText} ___
            </h3>

            <input
              type="text"
              placeholder="Write your answer"
              onChange={(e) => handleChange(item._id, e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
            />

            <p className="text-xs text-gray-500 mt-2">
              Correct answer count in backend: {item.answers.length}
            </p>
          </div>
        );
      })}

  
    </div>
  );
};

export default ExamFillInTheGaps;
