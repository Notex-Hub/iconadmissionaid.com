/* eslint-disable react/prop-types */
const EmptyScores = ({ onBack }) => (
  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
    <div className="mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h8M8 11h8M8 15h8M4 6h.01M4 10h.01M4 14h.01" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">No attempts yet</h3>
    <p className="text-sm text-gray-600 mb-4">
      No one has taken this exam yet. Encourage students to attempt the exam.
    </p>
    <button onClick={onBack} className="px-5 py-2 bg-[#c21010] text-white rounded-md">
      Back
    </button>
  </div>
);

export default EmptyScores;
