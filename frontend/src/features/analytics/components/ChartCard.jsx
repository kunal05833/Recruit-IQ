// src/features/analytics/components/ChartCard.jsx
import clsx from "clsx";
import Skeleton from "../../../components/ui/Skeleton";

const ChartCard = ({
  title,
  subtitle,
  children,
  loading   = false,
  actions,
  className,
  height    = 260,
}) => {
  return (
    <div className={clsx("card p-5", className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-surface-800">{title}</h3>
          {subtitle && (
            <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="shrink-0">{actions}</div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <Skeleton className="w-full rounded-xl" style={{ height }} />
      ) : (
        children
      )}
    </div>
  );
};

export default ChartCard;