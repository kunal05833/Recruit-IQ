// src/components/ui/Spinner.jsx
import clsx from "clsx";

const SIZE_CLASSES = {
  xs:  "w-3 h-3  border",
  sm:  "w-4 h-4  border-2",
  md:  "w-6 h-6  border-2",
  lg:  "w-8 h-8  border-2",
  xl:  "w-12 h-12 border-[3px]",
};

const COLOR_CLASSES = {
  primary: "border-primary-200 border-t-primary-600",
  white:   "border-white/30 border-t-white",
  surface: "border-surface-200 border-t-surface-600",
};

const Spinner = ({
  size  = "md",
  color = "primary",
  className,
}) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={clsx(
        "rounded-full animate-spin",
        SIZE_CLASSES[size],
        COLOR_CLASSES[color],
        className
      )}
    />
  );
};

export const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-50">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="xl" />
      <p className="text-sm text-surface-500 animate-pulse">Loading...</p>
    </div>
  </div>
);

export default Spinner;