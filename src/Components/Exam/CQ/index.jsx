/* eslint-disable react/prop-types */
import { useGetAllModelCQTestQuery } from "../../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamCQ = ({ subject,userAnswers, setUserAnswers }) => {
  const { data } = useGetAllModelCQTestQuery();
  const filteredCQ = data?.data.filter(
    (q) =>
      q?.subjectId?.modelTest === subject?.modelTest?._id &&
      q?.subjectId?.slug === subject?.slug
  );

const handleChange = (qId, value, maxMark) => {
  const randomMark = value.trim() !== "" ? Math.floor(Math.random() * maxMark) + 1 : 0;

  setUserAnswers((prev) => {
    const newData = {
      qId,
      userAnswer: value,
      obtainedMark: randomMark,
      maxMark
    };
    const filteredPrev = prev.filter((item) => item.qId !== qId);
    return [...filteredPrev, newData];
  });
};

console.log("userAnswers",userAnswers)

  return (
    <div className="p-4">
  
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {subject?.title} – Creative Questions (CQ)
      </h2>

      {filteredCQ?.length === 0 && (
        <p className="text-gray-500">No CQ questions available.</p>
      )}
      {filteredCQ?.map((item, index) => {
        const userAnswerObj = userAnswers.find((ans) => ans.qId === item._id);
        return (
          <div
            key={item._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6"
          >
      
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className="bg-gray-100 px-3 py-1 rounded-md">
                Max Marks: <span className="font-semibold">{item.mark}</span>
              </span>
            </div>

            <h3 className="font-semibold text-lg text-gray-800 leading-relaxed mb-4">
              {index + 1}. {item.question}
            </h3>
            <textarea
              rows="5"
              className="w-full border border-gray-300 focus:border-red-600 focus:ring-red-600 rounded-lg px-4 py-3 outline-none transition shadow-sm"
              placeholder="Write your answer here..."
              value={userAnswerObj?.userAnswer || ""}
              onChange={(e) => handleChange(item._id, e.target.value, item.mark)}
            ></textarea>
          </div>
        );
      })}
    </div>
  );
};

export default ExamCQ;
