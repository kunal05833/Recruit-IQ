// src/components/ui/EmptyState.jsx
import clsx from "clsx";

const EmptyState = ({
  icon,
  title,
  description,
  action,
  className,
  compact = false,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
    >
      {icon && (
        <div className={clsx(
          "flex items-center justify-center rounded-2xl",
          "bg-surface-100 text-surface-400 mb-4",
          compact ? "w-12 h-12" : "w-16 h-16"
        )}>
          <span className={compact ? "text-xl" : "text-3xl"}>
            {icon}
          </span>
        </div>
      )}

      <h3 className={clsx(
        "font-semibold text-surface-800 mb-1",
        compact ? "text-sm" : "text-base"
      )}>
        {title}
      </h3>

      {description && (
        <p className={clsx(
          "text-surface-500 max-w-sm leading-relaxed",
          compact ? "text-xs" : "text-sm"
        )}>
          {description}
        </p>
      )}

      {action && (
        <div className="mt-5">{action}</div>
      )}
    </div>
  );
};

export default EmptyState;