/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGetAllModelCQTestQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamCQ = ({ subject, onNext }) => {
  const { data } = useGetAllModelCQTestQuery();

  const filteredCQ = data?.data.filter(
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
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {subject?.title} – Creative Questions (CQ)
      </h2>

      {/* If No Data */}
      {filteredCQ?.length === 0 && (
        <p className="text-gray-500">No CQ questions available.</p>
      )}

      {/* Question List */}
      {filteredCQ?.map((item, index) => (
        <div
          key={item._id}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6"
        >
          {/* Top meta info */}
          <div className="flex justify-between text-sm text-gray-600 mb-3">
            <span className="bg-gray-100 px-3 py-1 rounded-md">
              Marks: <span className="font-semibold">{item.mark}</span>
            </span>
           
          </div>

          {/* Question Text */}
          <h3 className="font-semibold text-lg text-gray-800 leading-relaxed mb-4">
            {index + 1}. {item.question}
          </h3>

          {/* Answer Input */}
          <textarea
            rows="5"
            className="w-full border border-gray-300 focus:border-red-600 focus:ring-red-600 rounded-lg px-4 py-3 outline-none transition shadow-sm"
            placeholder="Write your answer here..."
            onChange={(e) => handleChange(item._id, e.target.value)}
          ></textarea>
        </div>
      ))}

      
    </div>
  );
};

export default ExamCQ;
