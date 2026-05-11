// src/components/ui/Input.jsx
import { forwardRef, useState } from "react";
import clsx from "clsx";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = forwardRef(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  type = "text",
  required = false,
  fullWidth = true,
  className,
  containerClassName,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword  = type === "password";
  const inputType   = isPassword ? (showPassword ? "text" : "password") : type;
  const inputId     = id || props.name;
  const hasError    = !!error;

  return (
    <div className={clsx("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-surface-700"
        >
          {label}
          {required && (
            <span className="text-danger-500 ml-0.5">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={clsx(
            "w-full px-3.5 py-2.5 text-sm text-surface-900",
            "bg-white border rounded-lg",
            "placeholder:text-surface-400",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            "disabled:bg-surface-50 disabled:text-surface-400 disabled:cursor-not-allowed",
            // Error State
            hasError
              ? "border-danger-400 focus:ring-danger-400"
              : "border-surface-300 focus:ring-primary-500",
            // Icon Padding
            leftIcon  && "pl-10",
            (rightIcon || isPassword) && "pr-10",
            !fullWidth && "w-auto",
            className
          )}
          {...props}
        />

        {/* Right Icon / Password Toggle */}
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            {showPassword
              ? <EyeOff size={16} />
              : <Eye     size={16} />
            }
          </button>
        ) : rightIcon ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            {rightIcon}
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {hasError && (
        <p className="flex items-center gap-1.5 text-xs text-danger-600 animate-fade-in">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}

      {/* Hint Text */}
      {hint && !hasError && (
        <p className="text-xs text-surface-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
export default Input;