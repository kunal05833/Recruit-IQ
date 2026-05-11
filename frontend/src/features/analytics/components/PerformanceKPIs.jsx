// src/features/analytics/components/PerformanceKPIs.jsx
import clsx from "clsx";
import { TrendingUp, TrendingDown } from "lucide-react";

const KPI_DATA = [
  {
    label:   "Avg Time to Hire",
    value:   "14 days",
    change:  -12,
    good:    "down",
    unit:    "faster than last month",
  },
  {
    label:   "Application to Interview",
    value:   "32%",
    change:  +5,
    good:    "up",
    unit:    "conversion rate",
  },
  {
    label:   "Offer Acceptance Rate",
    value:   "78%",
    change:  +3,
    good:    "up",
    unit:    "of offers accepted",
  },
  {
    label:   "Cost per Hire",
    value:   "$3,240",
    change:  -8,
    good:    "down",
    unit:    "vs last quarter",
  },
];

const PerformanceKPIs = ({ loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {KPI_DATA.map((kpi) => {
        const isGood = kpi.good === "up"
          ? kpi.change > 0
          : kpi.change < 0;

        const TrendIcon  = kpi.change > 0 ? TrendingUp : TrendingDown;
        const trendColor = isGood
          ? "text-success-600 bg-success-50"
          : "text-danger-600 bg-danger-50";

        return (
          <div key={kpi.label} className="card p-4 space-y-2">
            <p className="text-xs font-medium text-surface-500">
              {kpi.label}
            </p>
            <p className="text-2xl font-bold text-surface-900">
              {kpi.value}
            </p>
            <div className="flex items-center gap-2">
              <span className={clsx(
                "inline-flex items-center gap-1 text-xs font-semibold",
                "px-2 py-0.5 rounded-full",
                trendColor
              )}>
                <TrendIcon size={10} />
                {Math.abs(kpi.change)}%
              </span>
              <span className="text-2xs text-surface-400">{kpi.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PerformanceKPIs;