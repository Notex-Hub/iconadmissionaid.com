import React from "react";

const ErrorIcon = () => (
  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
    <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01" />
      <circle cx="12" cy="12" r="9" strokeWidth="2" />
      <path d="M9 9l6 6M15 9l-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

const SmallCheckIcon = () => (
  <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M5 13l4 4L19 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProgressCardCompact = ({ subject = "English", percent = 45, correct = 25, total = 40, onView = () => {} }) => {
  const progressPct = Math.max(0, Math.min(100, percent));
  return (
    <div className="w-full max-w-sm bg-white border border-gray-100 rounded-lg shadow-sm p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ErrorIcon />
          <div>
            <div className="flex items-baseline gap-3">
              <div className="text-sm font-semibold text-gray-800">{subject}</div>
              <div className="text-xs text-gray-500">{progressPct}%</div>
            </div>
            <div className="mt-2 w-52">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500`}
                  style={{
                    width: `${progressPct}%`,
                    background: progressPct >= 50 ? "linear-gradient(90deg,#16a34a,#10b981)" : "linear-gradient(90deg,#ef4444,#f97316)"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-right">
          <div>Questions: <span className="font-medium text-gray-800">{total}</span></div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <SmallCheckIcon />
          <div>
            <div className="text-sm text-green-700 font-medium">Correct Answers: {correct}</div>
          </div>
        </div>

        <button
          onClick={onView}
          className="text-sm text-green-600 cursor-pointer hover:underline flex items-center gap-2"
        >
         
          View Question Details
        </button>
      </div>
    </div>
  );
};

export default ProgressCardCompact;
