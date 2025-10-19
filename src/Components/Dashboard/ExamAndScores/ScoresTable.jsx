/* eslint-disable react/prop-types */
import AttemptRow from "./AttemptRow";

const ScoresTable = ({ attempts, onView }) => {
  if (!attempts || attempts.length === 0)
    return <div className="text-center text-gray-600 py-8">No attempts yet.</div>;

  return (
    <div className="space-y-4">
      <div className="hidden lg:block bg-transparent">
        <table className="w-full table-auto border-separate" style={{ borderSpacing: "0 10px" }}>
          <thead>
            <tr className="text-left text-sm text-gray-500">
              <th className="px-4 py-2">Student</th>
              <th className="px-4 py-2 text-center">Score</th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-center">Date</th>
              <th className="px-4 py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((att) => (
              <AttemptRow key={att._id} attempt={att} onView={onView} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="lg:hidden space-y-3">
        {attempts.map((att) => (
          <AttemptRow key={att._id} attempt={att} onView={onView} isCard />
        ))}
      </div>
    </div>
  );
};

export default ScoresTable;
