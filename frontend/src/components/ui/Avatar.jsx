// src/components/ui/Avatar.jsx
import clsx from "clsx";

const SIZE_CLASSES = {
  xs:  "w-6  h-6  text-2xs",
  sm:  "w-8  h-8  text-xs",
  md:  "w-10 h-10 text-sm",
  lg:  "w-12 h-12 text-base",
  xl:  "w-16 h-16 text-xl",
  "2xl": "w-20 h-20 text-2xl",
};

const COLOR_CLASSES = [
  "bg-primary-100 text-primary-700",
  "bg-success-50  text-success-700",
  "bg-warning-50  text-warning-700",
  "bg-danger-50   text-danger-700",
  "bg-purple-100  text-purple-700",
  "bg-pink-50     text-pink-700",
  "bg-indigo-100  text-indigo-700",
  "bg-teal-50     text-teal-700",
];

// Deterministic color from name string
const getColorFromName = (name = "") => {
  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLOR_CLASSES[index % COLOR_CLASSES.length];
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

const Avatar = ({
  name,
  src,
  size      = "md",
  className,
  online,
}) => {
  const initials  = getInitials(name);
  const colorClass = getColorFromName(name);

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={clsx(
          "rounded-full flex items-center justify-center",
          "font-semibold select-none overflow-hidden",
          SIZE_CLASSES[size],
          !src && colorClass,
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Online Indicator */}
      {online !== undefined && (
        <span
          className={clsx(
            "absolute bottom-0 right-0 block rounded-full",
            "ring-2 ring-white",
            size === "xs" || size === "sm" ? "w-1.5 h-1.5" : "w-2.5 h-2.5",
            online ? "bg-success-500" : "bg-surface-300"
          )}
        />
      )}
    </div>
  );
};

export default Avatar;