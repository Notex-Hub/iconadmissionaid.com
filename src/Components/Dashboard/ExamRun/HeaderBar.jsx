/* eslint-disable react/prop-types */
export const HeaderBar = ({ title, durationMinutes, secondsLeft, answeredCount, totalQuestions }) => {
  const formatTime = (secs) => {
    const mm = Math.floor(secs / 60).toString().padStart(2, "0");
    const ss = (secs % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const progressPercent = totalQuestions === 0 ? 0 : Math.round((answeredCount / totalQuestions) * 100);

  return (
    <div className="bg-[#7a0000] text-white rounded-t-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-gray-200 mt-1">Answer all questions to the best of your ability</p>
        </div>

        <div className="text-right text-sm">
          <div>Duration: {durationMinutes ? `${durationMinutes} min` : "N/A"}</div>
          <div className="mt-2 font-mono text-lg">{formatTime(secondsLeft)}</div>
        </div>
      </div>

      <div className="mt-3 bg-red-700/30 h-2 rounded overflow-hidden">
        <div className="h-2 bg-white/90" style={{ width: `${progressPercent}%`, transition: "width 300ms" }} />
      </div>
      <div className="text-xs text-red-100 mt-2">
        {answeredCount}/{totalQuestions} answers — {progressPercent}% completed
      </div>
    </div>
  );
};