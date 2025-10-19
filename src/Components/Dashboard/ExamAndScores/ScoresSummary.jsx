/* eslint-disable react/prop-types */
const ScoresSummary = ({ totalAttempts, yourAttempts, examTitle }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
    <div>
      <div className="text-sm text-gray-500">Exam</div>
      <div className="text-lg font-semibold text-gray-800">{examTitle}</div>
    </div>
    <div className="flex gap-6">
      <div className="text-center">
        <div className="text-sm text-gray-500">Total Attempts</div>
        <div className="text-xl font-bold text-[#7a0000]">{totalAttempts}</div>
      </div>
      <div className="text-center">
        <div className="text-sm text-gray-500">Your Attempts</div>
        <div className="text-xl font-bold text-green-600">{yourAttempts}</div>
      </div>
    </div>
  </div>
);

export default ScoresSummary;
