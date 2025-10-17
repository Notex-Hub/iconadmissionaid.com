/* eslint-disable react/prop-types */

import { LinearBar } from "./LineBar";
import { MicroCircle } from "./MicroCircle";


export function KPIBarCard({ title, value, trend = 0, subtitle = "", colorClass = "from-emerald-400 to-teal-400" }) {
  const trendUp = trend > 0;
  return (
    <div className="bg-white rounded-2xl p-5  shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded-full ${trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {trendUp ? `+${trend}%` : `${trend}%`}
            </span>
          </div>

          <div className="mt-3">
            <div className="flex items-end gap-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">{typeof value === "number" ? value : "--"}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
              </div>
              <div className="ml-auto">
                <MicroCircle value={typeof value === "number" ? value : 0} />
              </div>
            </div>

            <div className="mt-4">
              <LinearBar label="Last 30 days" value={typeof value === "number" ? value : 0} colorFrom={colorClass.split(" ")[0]} colorTo={colorClass.split(" ")[1]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}