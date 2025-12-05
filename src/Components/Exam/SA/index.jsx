/* eslint-disable react/prop-types */

import { useState } from "react";
import { useGetAllModelTestpassegeQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamSA = ({ subject,onNext }) => {
  const [index, setIndex] = useState(0);
  const { data } = useGetAllModelTestpassegeQuery();

  const filteredExam = data?.data.filter(
    (item) => item?.subjectId === subject?._id
  );

  if (!filteredExam || filteredExam.length === 0) {
    return <div>No Passage Found</div>;
  }

  const passage = filteredExam[0]; 
  const questions = passage.questions;


  const nextQuestion = () => {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    }
  };

  const prevQuestion = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Passage</h2>
      <p className="text-gray-700 mb-5">{passage.passage}</p>

      <h3 className="text-lg font-semibold">
        Question {index + 1} of {questions.length}
      </h3>

      <p className="mt-2">{questions[index].question}</p>

      <ul className="mt-3 space-y-2">
        {questions[index].options.map((op, i) => (
          <li
            key={i}
            className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
          >
            {op}
          </li>
        ))}
      </ul>

      <div className="flex justify-between mt-5">
        <button
          onClick={prevQuestion}
          disabled={index === 0}
          className={`px-4 py-2 rounded ${
            index === 0
              ? "bg-gray-300"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={index === questions.length - 1}
          className={`px-4 py-2 rounded ${
            index === questions.length - 1
              ? "bg-gray-300"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          Next
        </button>
      </div>
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

export default ExamSA;
