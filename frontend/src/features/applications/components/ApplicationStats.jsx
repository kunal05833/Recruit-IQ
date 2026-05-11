// src/features/applications/components/ApplicationStats.jsx
import clsx from "clsx";
import { getStatusConfig, ALL_STATUSES } from "../utils/statusConfig";
import Skeleton from "../../../components/ui/Skeleton";

const ApplicationStats = ({ applications, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }

  const counts = ALL_STATUSES.reduce((acc, status) => {
    acc[status] = applications.filter(
      (a) => (a.status || "PENDING").toUpperCase() === status
    ).length;
    return acc;
  }, {});

  const total = applications.length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {ALL_STATUSES.map((status) => {
        const config = getStatusConfig(status);
        const count  = counts[status];
        const pct    = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <div
            key={status}
            className={clsx(
              "rounded-xl p-4 border space-y-2",
              config.bg,
              config.border
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg">{config.icon}</span>
              <span
                className={clsx(
                  "text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-white/60",
                  config.text
                )}
              >
                {pct}%
              </span>
            </div>
            <div>
              <p className={clsx("text-2xl font-bold", config.text)}>
                {count}
              </p>
              <p className={clsx("text-xs font-medium opacity-70", config.text)}>
                {config.label}
              </p>
            </div>

            {/* Mini Bar */}
            <div className="h-1 bg-white/40 rounded-full overflow-hidden">
              <div
                className={clsx(
                  "h-full rounded-full transition-all duration-700",
                  {
                    "bg-warning-500": status === "PENDING",
                    "bg-blue-500":    status === "REVIEWED",
                    "bg-success-500": status === "ACCEPTED",
                    "bg-danger-500":  status === "REJECTED",
                  }
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ApplicationStats;