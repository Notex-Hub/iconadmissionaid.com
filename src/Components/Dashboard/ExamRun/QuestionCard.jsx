/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
export const QuestionCard = ({ q, value, onChange, index, globalIndex }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="mb-3 text-sm text-gray-600">
        <div className="font-semibold mb-2">Q{globalIndex}. </div>
        <div dangerouslySetInnerHTML={{ __html: q.question }} />
      </div>

      <div className="space-y-2">
        {q.options?.map((opt, idx) => {
          const optId = `${q._id}_opt_${idx}`;
          return (
            <label
              key={optId}
              className="flex items-center gap-3 p-3 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="radio"
                name={q._id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(q._id, opt)}
                className="w-4 h-4 text-red-600"
              />
              <span className="text-gray-800">{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
