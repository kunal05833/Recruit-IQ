// src/components/ui/Skeleton.jsx
import clsx from "clsx";

const Skeleton = ({ className, ...props }) => (
  <div
    className={clsx(
      "rounded-lg bg-gradient-to-r",
      "from-surface-100 via-surface-200 to-surface-100",
      "bg-[length:200%_100%]",
      "animate-skeleton",
      className
    )}
    {...props}
  />
);

export const SkeletonText = ({ lines = 3, className }) => (
  <div className={clsx("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={clsx(
          "h-4",
          i === lines - 1 ? "w-2/3" : "w-full"
        )}
      />
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <SkeletonText lines={3} />
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export default Skeleton;