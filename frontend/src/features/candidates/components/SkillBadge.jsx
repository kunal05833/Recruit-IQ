// src/features/candidates/components/SkillBadge.jsx
import clsx from "clsx";

// Deterministic color per skill name
const SKILL_COLORS = [
  "bg-blue-50    text-blue-700   border-blue-200",
  "bg-violet-50  text-violet-700 border-violet-200",
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-amber-50   text-amber-700  border-amber-200",
  "bg-rose-50    text-rose-700   border-rose-200",
  "bg-cyan-50    text-cyan-700   border-cyan-200",
  "bg-indigo-50  text-indigo-700 border-indigo-200",
  "bg-pink-50    text-pink-700   border-pink-200",
  "bg-teal-50    text-teal-700   border-teal-200",
  "bg-orange-50  text-orange-700 border-orange-200",
];

const getSkillColor = (skill = "") => {
  const index = skill
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return SKILL_COLORS[index % SKILL_COLORS.length];
};

const SkillBadge = ({ skill, size = "md", className }) => {
  const colorClass = getSkillColor(skill);

  const sizeClasses = {
    sm: "text-2xs px-1.5 py-0.5",
    md: "text-xs  px-2   py-0.5",
    lg: "text-xs  px-2.5 py-1",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-md border",
        colorClass,
        sizeClasses[size],
        className
      )}
    >
      {skill}
    </span>
  );
};

export default SkillBadge;