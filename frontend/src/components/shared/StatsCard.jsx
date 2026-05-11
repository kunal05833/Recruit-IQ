// src/components/shared/StatsCard.jsx
import clsx from "clsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import Skeleton from "../ui/Skeleton";

const StatsCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color     = "primary",
  loading   = false,
  className,
}) => {
  const COLOR_MAP = {
    primary: {
      icon: "bg-primary-50 text-primary-600",
      ring: "ring-primary-100",
    },
    success: {
      icon: "bg-success-50 text-success-600",
      ring: "ring-success-100",
    },
    warning: {
      icon: "bg-warning-50 text-warning-600",
      ring: "ring-warning-100",
    },
    danger: {
      icon: "bg-danger-50 text-danger-600",
      ring: "ring-danger-100",
    },
    info: {
      icon: "bg-info-50 text-info-600",
      ring: "ring-info-100",
    },
  };

  const colors = COLOR_MAP[color] || COLOR_MAP.primary;

  const TrendIcon =
    trend === "up"
      ? TrendingUp
      : trend === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    trend === "up"
      ? "text-success-600"
      : trend === "down"
      ? "text-danger-600"
      : "text-surface-500";

  if (loading) {
    return (
      <div className={clsx("card p-5 space-y-3", className)}>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "card p-5 hover:shadow-soft-md transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-surface-500">{title}</p>
        {icon && (
          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              "ring-1",
              colors.icon,
              colors.ring
            )}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-3xl font-bold text-surface-900 tracking-tight">
          {value}
        </p>

        {(subtitle || trendValue) && (
          <div className="flex items-center gap-2">
            {trendValue && (
              <div className={clsx("flex items-center gap-0.5 text-xs font-medium", trendColor)}>
                <TrendIcon size={12} />
                {trendValue}
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-surface-500">{subtitle}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;