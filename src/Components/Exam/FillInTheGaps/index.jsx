/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useGetAllModelTestFillintheGapsQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamFillInTheGaps = ({ subject,userAnswers,setUserAnswers }) => {
  const { data } = useGetAllModelTestFillintheGapsQuery();

  const filteredQuestions = data?.data.filter(
    (q) =>
      q?.subjectId?.modelTest === subject?.modelTest?._id &&
      q?.subjectId?.slug === subject?.slug
  );

  const handleChange = (qId, value) => {
    const findQuestion = filteredQuestions.find((item) => item._id === qId);
    const saveData = {
      qId: qId,
      mark: findQuestion?.mark || 0,
      isCorrect: findQuestion?.answers?.includes(value),
      userAnswer: value
    };

    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex((item) => item.qId === qId);

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = saveData;
        return updated;
      } else {
        return [...prev, saveData];
      }
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-6">
        {subject?.title} – Fill in the Gaps
      </h2>

      {filteredQuestions?.map((item, index) => {
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
          </div>
        );
      })}

    </div>
  );
};

export default ExamFillInTheGaps;
