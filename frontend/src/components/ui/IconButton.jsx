// src/components/ui/IconButton.jsx
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import Tooltip from "./Tooltip";

const SIZE_CLASSES = {
  xs: "w-6  h-6  rounded-md",
  sm: "w-7  h-7  rounded-lg",
  md: "w-9  h-9  rounded-lg",
  lg: "w-10 h-10 rounded-xl",
};

const VARIANT_CLASSES = {
  ghost:   "text-surface-500 hover:bg-surface-100 hover:text-surface-700",
  primary: "text-primary-600 hover:bg-primary-50  hover:text-primary-700",
  danger:  "text-danger-500  hover:bg-danger-50   hover:text-danger-700",
  success: "text-success-500 hover:bg-success-50  hover:text-success-700",
};

const IconButton = ({
  icon,
  tooltip,
  tooltipPosition = "top",
  size    = "md",
  variant = "ghost",
  loading = false,
  disabled = false,
  className,
  "aria-label": ariaLabel,
  ...props
}) => {
  const button = (
    <button
      disabled={disabled || loading}
      aria-label={ariaLabel || tooltip}
      className={clsx(
        "flex items-center justify-center",
        "transition-all duration-150",
        "focus:outline-none focus-visible:ring-2",
        "focus-visible:ring-primary-500 focus-visible:ring-offset-1",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {loading
        ? <Loader2 size={14} className="animate-spin" />
        : icon
      }
    </button>
  );

  if (tooltip) {
    return (
      <Tooltip content={tooltip} position={tooltipPosition}>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default IconButton;