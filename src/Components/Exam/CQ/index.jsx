/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGetAllModelCQTestQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamCQ = ({ subject,onNext }) => {
  const { data } = useGetAllModelCQTestQuery();

  const filteredCQ = data?.data.filter(
    (q) => q?.subjectId?.modelTest === subject?.modelTest?._id
  );

  // eslint-disable-next-line no-unused-vars
  const [userAnswers, setUserAnswers] = useState({});

  const handleChange = (qId, value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: value,
    }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{subject?.title} - CQ</h2>

      {filteredCQ?.length === 0 && (
        <p className="text-gray-500">No CQ questions available.</p>
      )}

      {filteredCQ?.map((item, index) => (
        <div
          key={item._id}
          className="bg-white shadow rounded p-4 mb-4 border border-gray-200"
        >
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Marks: {item.mark}</span>
            <span>Time: {item.duration} sec</span>
          </div>

          <h3 className="font-medium text-lg mb-3">
            {index + 1}. {item.question}
          </h3>

          <textarea
            rows="4"
            className="border p-2 w-full rounded"
            placeholder="Write your answer here..."
            onChange={(e) => handleChange(item._id, e.target.value)}
          ></textarea>
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

export default ExamCQ;
