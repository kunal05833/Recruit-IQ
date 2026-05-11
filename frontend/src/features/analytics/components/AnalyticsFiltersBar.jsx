// src/features/analytics/components/AnalyticsFiltersBar.jsx
import clsx from "clsx";
import { Calendar, RefreshCw } from "lucide-react";
import Button from "../../../components/ui/Button";

const TIME_RANGES = [
  { label: "7 Days",   value: "7d"  },
  { label: "30 Days",  value: "30d" },
  { label: "3 Months", value: "3m"  },
  { label: "6 Months", value: "6m"  },
  { label: "1 Year",   value: "1y"  },
];

const AnalyticsFiltersBar = ({
  selectedRange,
  onRangeChange,
  onRefresh,
  isLoading,
  lastFetched,
}) => {
  const formatLastFetched = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="card p-4 flex flex-col sm:flex-row items-start
                    sm:items-center justify-between gap-4">
      {/* Time Range Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-surface-500 mr-1">
          <Calendar size={14} />
          <span className="text-xs font-medium">Period:</span>
        </div>
        {TIME_RANGES.map((range) => (
          <button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-semibold",
              "border transition-all duration-150",
              selectedRange === range.value
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-surface-600 border-surface-200 hover:border-surface-300"
            )}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {lastFetched && (
          <p className="text-xs text-surface-400">
            Updated at {formatLastFetched(lastFetched)}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<RefreshCw size={13} />}
          onClick={onRefresh}
          loading={isLoading}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default AnalyticsFiltersBar;