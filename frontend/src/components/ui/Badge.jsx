// src/components/ui/Badge.jsx
import clsx from "clsx";

const VARIANT_CLASSES = {
  default:  "bg-surface-100 text-surface-600",
  primary:  "bg-primary-100 text-primary-700",
  success:  "bg-success-50  text-success-700",
  warning:  "bg-warning-50  text-warning-700",
  danger:   "bg-danger-50   text-danger-700",
  info:     "bg-info-50     text-info-700",
};

const SIZE_CLASSES = {
  sm: "px-1.5 py-0.5 text-2xs",
  md: "px-2   py-0.5 text-xs",
  lg: "px-2.5 py-1   text-xs",
};

const Badge = ({
  children,
  variant = "default",
  size    = "md",
  dot     = false,
  className,
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 font-medium rounded-full",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full shrink-0",
            {
              "bg-surface-400": variant === "default",
              "bg-primary-500": variant === "primary",
              "bg-success-500": variant === "success",
              "bg-warning-500": variant === "warning",
              "bg-danger-500":  variant === "danger",
              "bg-info-500":    variant === "info",
            }
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;