// src/features/analytics/components/HiringFunnelChart.jsx
import clsx from "clsx";
import { formatNumber } from "../../../utils/formatters";

const FUNNEL_STAGES = [
  { key: "applied",   label: "Applied",     color: "bg-primary-500", textColor: "text-primary-700", pctColor: "text-primary-600" },
  { key: "reviewed",  label: "Reviewed",    color: "bg-indigo-500",  textColor: "text-indigo-700",  pctColor: "text-indigo-600"  },
  { key: "shortlist", label: "Shortlisted", color: "bg-warning-500", textColor: "text-warning-700", pctColor: "text-warning-600" },
  { key: "hired",     label: "Hired",       color: "bg-success-500", textColor: "text-success-700", pctColor: "text-success-600" },
];

const HiringFunnelChart = ({ funnel }) => {
  const maxVal = funnel.applied || 1;

  return (
    <div className="space-y-4">
      {FUNNEL_STAGES.map((stage, index) => {
        const value    = funnel[stage.key] || 0;
        const widthPct = Math.round((value / maxVal) * 100);
        const convRate = index === 0
          ? 100
          : funnel.applied > 0
            ? Math.round((value / funnel.applied) * 100)
            : 0;

        return (
          <div key={stage.key} className="space-y-1.5">
            {/* Label row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={clsx(
                  "w-2.5 h-2.5 rounded-full shrink-0",
                  stage.color
                )} />
                <span className="text-sm font-medium text-surface-700">
                  {stage.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={clsx(
                  "text-xs font-semibold",
                  stage.pctColor
                )}>
                  {convRate}%
                </span>
                <span className="text-sm font-bold text-surface-900 w-12 text-right">
                  {formatNumber(value)}
                </span>
              </div>
            </div>

            {/* Bar */}
            <div className="relative h-8 bg-surface-100 rounded-lg overflow-hidden">
              <div
                className={clsx(
                  "h-full rounded-lg transition-all duration-700",
                  stage.color,
                  "opacity-90"
                )}
                style={{ width: `${widthPct}%` }}
              />
              {value > 0 && (
                <div
                  className="absolute inset-y-0 flex items-center px-3"
                  style={{ left: `${Math.min(widthPct - 2, 2)}%` }}
                >
                  <span className="text-xs font-semibold text-white
                                   drop-shadow-sm">
                    {widthPct > 15 ? formatNumber(value) : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Conversion summary */}
      <div className="pt-3 border-t border-surface-100">
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Review Rate",
              value: funnel.applied > 0
                ? `${Math.round((funnel.reviewed / funnel.applied) * 100)}%`
                : "0%",
            },
            {
              label: "Shortlist Rate",
              value: funnel.applied > 0
                ? `${Math.round((funnel.shortlist / funnel.applied) * 100)}%`
                : "0%",
            },
            {
              label: "Hire Rate",
              value: funnel.applied > 0
                ? `${Math.round((funnel.hired / funnel.applied) * 100)}%`
                : "0%",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="text-center p-2.5 bg-surface-50 rounded-xl"
            >
              <p className="text-lg font-bold text-surface-900">
                {item.value}
              </p>
              <p className="text-2xs text-surface-500 mt-0.5">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HiringFunnelChart;