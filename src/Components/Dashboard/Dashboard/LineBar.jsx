/* eslint-disable react/prop-types */

export function LinearBar({ value = 0, colorFrom = "from-emerald-400", colorTo = "to-teal-400", label = "", showPercent = true }) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-medium text-gray-700">{label}</div>
        {showPercent && <div className="text-xs text-gray-500">{pct}%</div>}
      </div>
      <div className="h-2 rounded-full bg-gray-100 overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorFrom} ${colorTo} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}