import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  useGetAllModelCQTestQuery,
  useGetAllModelMcqTestQuery,
  useGetAllModelTestFillintheGapsQuery,
  useGetAllModelTestpassegeQuery,
} from "../../../redux/Features/Api/modeltestmcq/modeltestmcq";

const ExamRunner = () => {
  const { modelSlug, subjectId, sectionName } = useParams();
  const navigate = useNavigate();

  const { data: mcq } = useGetAllModelMcqTestQuery();
  const { data: gap } = useGetAllModelTestFillintheGapsQuery();
  const { data: cq } = useGetAllModelCQTestQuery();
  const { data: passages } = useGetAllModelTestpassegeQuery();

  const [answers, setAnswers] = useState({});

  let questions = [];
  if (sectionName === "MCQ") questions = mcq?.data.filter(q => q.subjectId?._id === subjectId);
  if (sectionName === "FillInTheGaps") questions = gap?.data.filter(q => q.subjectId?._id === subjectId);
  if (sectionName === "CQ") questions = cq?.data.filter(q => q.subjectId?._id === subjectId);
  if (sectionName === "SA") questions = passages?.data.filter(p => p.subjectId === subjectId);

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    console.log("User Answers:", answers);
    navigate(`/exam/next/${modelSlug}/${subjectId}/${sectionName}`);
  };

  if (!questions.length) return <div>Loading Questions...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{sectionName}</h1>

      {questions.map((q, idx) => (
        <div key={q._id} className="mb-6 p-4 border rounded shadow-sm">
          <p className="mb-2 font-medium">{idx + 1}. {q.question}</p>

          {sectionName === "MCQ" && q.options?.map((opt, i) => (
            <label key={i} className="block mb-1">
              <input
                type="radio"
                name={q._id}
                value={opt}
                checked={answers[q._id] === opt}
                onChange={(e) => handleChange(q._id, e.target.value)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}

          {sectionName === "FillInTheGaps" && (
            <input
              type="text"
              value={answers[q._id] || ""}
              onChange={(e) => handleChange(q._id, e.target.value)}
              placeholder="Type your answer"
              className="border p-2 w-full rounded"
            />
          )}

          {(sectionName === "CQ" || sectionName === "SA") && (
            <textarea
              value={answers[q._id] || ""}
              onChange={(e) => handleChange(q._id, e.target.value)}
              placeholder="Write your answer here"
              className="border p-2 w-full rounded h-24"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  );
};

export default ExamRunner;
