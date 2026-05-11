// src/components/ui/Button.jsx
import clsx from "clsx";
import { Loader2 } from "lucide-react";

const SIZE_CLASSES = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-lg gap-2",
  lg: "px-5 py-3 text-sm rounded-xl gap-2",
  xl: "px-6 py-3.5 text-base rounded-xl gap-2.5",
};

const VARIANT_CLASSES = {
  primary: `
    bg-primary-600 text-white shadow-sm
    hover:bg-primary-700 active:bg-primary-800
    focus-visible:ring-primary-500
    disabled:bg-primary-300
  `,
  secondary: `
    bg-surface-100 text-surface-700 border border-surface-200
    hover:bg-surface-200 active:bg-surface-300
    focus-visible:ring-surface-400
  `,
  ghost: `
    bg-transparent text-surface-600
    hover:bg-surface-100 active:bg-surface-200
    focus-visible:ring-surface-400
  `,
  danger: `
    bg-danger-600 text-white shadow-sm
    hover:bg-danger-700 active:bg-danger-800
    focus-visible:ring-danger-500
    disabled:bg-danger-300
  `,
  outline: `
    bg-transparent text-primary-600 border border-primary-300
    hover:bg-primary-50 active:bg-primary-100
    focus-visible:ring-primary-500
  `,
  success: `
    bg-success-600 text-white shadow-sm
    hover:bg-success-700 active:bg-success-800
    focus-visible:ring-success-500
  `,
};

const Button = ({
  children,
  variant  = "primary",
  size     = "md",
  loading  = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  type = "button",
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={clsx(
        // Base
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-150 select-none cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        // Size
        SIZE_CLASSES[size],
        // Variant
        VARIANT_CLASSES[variant],
        // Full Width
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin shrink-0" />
      ) : (
        leftIcon && (
          <span className="shrink-0">{leftIcon}</span>
        )
      )}
      {children}
      {!loading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;