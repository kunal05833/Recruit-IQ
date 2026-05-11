// src/features/applications/components/ApplicationStatusBadge.jsx
import clsx from "clsx";
import { getStatusConfig } from "../utils/statusConfig";

const ApplicationStatusBadge = ({
  status,
  size    = "md",
  showDot = true,
  className,
}) => {
  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: "text-2xs px-1.5 py-0.5 gap-1",
    md: "text-xs  px-2   py-0.5 gap-1.5",
    lg: "text-xs  px-2.5 py-1   gap-1.5",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-full border",
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
    >
      {showDot && (
        <span
          className={clsx(
            "rounded-full shrink-0",
            size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5",
            {
              "bg-warning-500": config.variant === "warning",
              "bg-blue-500":    config.variant === "info",
              "bg-success-500": config.variant === "success",
              "bg-danger-500":  config.variant === "danger",
            }
          )}
        />
      )}
      {config.label}
    </span>
  );
};

export default ApplicationStatusBadge;