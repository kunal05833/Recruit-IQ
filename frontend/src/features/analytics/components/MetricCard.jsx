// src/features/analytics/components/MetricCard.jsx
import clsx from "clsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Skeleton from "../../../components/ui/Skeleton";

const MetricCard = ({
  title,
  value,
  change,
  changeLabel,
  icon,
  color     = "primary",
  loading   = false,
  size      = "md",
  className,
}) => {
  const COLOR_MAP = {
    primary: {
      icon:   "bg-primary-50 text-primary-600 ring-primary-100",
      value:  "text-surface-900",
    },
    success: {
      icon:   "bg-success-50 text-success-600 ring-success-100",
      value:  "text-surface-900",
    },
    warning: {
      icon:   "bg-warning-50 text-warning-600 ring-warning-100",
      value:  "text-surface-900",
    },
    danger: {
      icon:   "bg-danger-50 text-danger-600 ring-danger-100",
      value:  "text-surface-900",
    },
    purple: {
      icon:   "bg-purple-50 text-purple-600 ring-purple-100",
      value:  "text-surface-900",
    },
    indigo: {
      icon:   "bg-indigo-50 text-indigo-600 ring-indigo-100",
      value:  "text-surface-900",
    },
  };

  const colors = COLOR_MAP[color] || COLOR_MAP.primary;

  const isPositive = change > 0;
  const isNegative = change < 0;
  const TrendIcon  = isPositive
    ? TrendingUp
    : isNegative
    ? TrendingDown
    : Minus;

  const trendColor = isPositive
    ? "text-success-600 bg-success-50"
    : isNegative
    ? "text-danger-600 bg-danger-50"
    : "text-surface-500 bg-surface-100";

  if (loading) {
    return (
      <div className={clsx("card p-5 space-y-3", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  return (
    <div className={clsx(
      "card p-5 hover:shadow-soft-md transition-shadow duration-200",
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-surface-500 leading-tight">
          {title}
        </p>
        {icon && (
          <div className={clsx(
            "w-10 h-10 rounded-xl flex items-center justify-center",
            "ring-1 shrink-0",
            colors.icon
          )}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <p className={clsx(
        "font-bold tracking-tight mb-2",
        size === "lg" ? "text-4xl" : "text-3xl",
        colors.value
      )}>
        {value}
      </p>

      {/* Change */}
      {(change !== undefined || changeLabel) && (
        <div className="flex items-center gap-2 flex-wrap">
          {change !== undefined && (
            <span className={clsx(
              "inline-flex items-center gap-1 text-xs font-semibold",
              "px-2 py-0.5 rounded-full",
              trendColor
            )}>
              <TrendIcon size={11} />
              {Math.abs(change)}%
            </span>
          )}
          {changeLabel && (
            <span className="text-xs text-surface-400">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MetricCard;