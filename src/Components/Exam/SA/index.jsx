/* eslint-disable react/prop-types */
import { useState } from "react";
import { useGetAllModelTestpassegeQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamSA = ({ subject,selectedOptions,setSelectedOptions }) => {
  const [index, setIndex] = useState(0);
  const { data } = useGetAllModelTestpassegeQuery();
  const filteredExam = data?.data.filter(
    (item) => item?.subjectId === subject?._id
  );

  const passage = filteredExam?.[0];
  const questions = passage?.questions || [];

  if (!passage) {
    return <div>No Passage Found</div>;
  }

  const nextQuestion = () => {
    if (index < questions.length - 1) setIndex(index + 1);
  };

  const prevQuestion = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handleSelect = (qId, option,questions) => {
    setSelectedOptions((prev) => {
      const existing = prev.find((item) => item.questionId === qId);
      if (existing) {
  
        return prev.map((item) =>
          item.questionId === qId ? { questionId: qId, selectedOption: option,options:questions?.options,answer:questions?.answer,mark:questions?.mark} : item
        );
      } else {
        return [...prev, { questionId: qId, selectedOption: option,options:questions?.options,answer:questions?.answer,mark:questions?.mark}];
      }
    });
  };

  const getSelectedOption = (qId) => {
    return selectedOptions.find((item) => item.questionId === qId)?.selectedOption;
  };



  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-2">Passage</h2>
      <p className="text-gray-700 mb-5">{passage.passage}</p>

      {questions.length > 0 && (
        <>
          <h3 className="text-lg font-semibold">
            Question {index + 1} of {questions.length}
          </h3>
          <p className="mt-2">{questions[index].question}</p>

          <ul className="mt-3 space-y-2">
            {questions[index].options.map((op, i) => {
              const isSelected = getSelectedOption(questions[index]._id) === op;
              return (
                <li
                  key={i}
                  onClick={() => handleSelect(questions[index]._id, op,questions[index])}
                  className={`p-2 border rounded cursor-pointer ${
                    isSelected
                      ? "bg-blue-500 text-white border-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {op}
                </li>
              );
            })}
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
        </>
      )}

     
    </div>
  );
};

export default ExamSA;
