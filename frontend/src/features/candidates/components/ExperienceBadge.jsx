// src/features/candidates/components/ExperienceBadge.jsx
import clsx from "clsx";
import { formatExperience } from "../../../utils/formatters";

const getExpColor = (years) => {
  if (!years || years === 0) return "bg-surface-100 text-surface-600";
  if (years <= 2)             return "bg-success-50  text-success-700";
  if (years <= 5)             return "bg-primary-50  text-primary-700";
  return                             "bg-purple-50   text-purple-700";
};

const getExpLabel = (years) => {
  if (!years || years === 0) return "Fresher";
  if (years <= 2)             return "Junior";
  if (years <= 5)             return "Mid-level";
  return                             "Senior";
};

const ExperienceBadge = ({ years, showLevel = true, className }) => (
  <span
    className={clsx(
      "inline-flex items-center gap-1 text-xs font-medium",
      "px-2 py-0.5 rounded-full",
      getExpColor(years),
      className
    )}
  >
    {showLevel && (
      <span className="font-semibold">{getExpLabel(years)}</span>
    )}
    <span className="opacity-80">{formatExperience(years)}</span>
  </span>
);

export default ExperienceBadge;