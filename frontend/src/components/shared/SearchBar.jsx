// src/components/shared/SearchBar.jsx
import { useRef } from "react";
import clsx from "clsx";
import { Search, X } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className,
  size        = "md",
  autoFocus   = false,
}) => {
  const inputRef = useRef(null);

  const SIZE_CLASSES = {
    sm: "px-3 py-1.5 text-xs pl-8",
    md: "px-3.5 py-2.5 text-sm pl-9",
    lg: "px-4 py-3 text-sm pl-10",
  };

  const ICON_SIZE_CLASSES = {
    sm: "left-2.5 w-3.5 h-3.5",
    md: "left-3   w-4   h-4",
    lg: "left-3.5 w-4.5 h-4.5",
  };

  const handleClear = () => {
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={clsx("relative", className)}>
      <Search
        className={clsx(
          "absolute top-1/2 -translate-y-1/2 text-surface-400",
          "pointer-events-none",
          ICON_SIZE_CLASSES[size]
        )}
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={clsx(
          "w-full bg-white border border-surface-200 rounded-lg",
          "text-surface-900 placeholder:text-surface-400",
          "transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-primary-500",
          "focus:border-transparent",
          SIZE_CLASSES[size],
          value && "pr-8"
        )}
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2
                     text-surface-400 hover:text-surface-600
                     transition-colors p-0.5 rounded"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;