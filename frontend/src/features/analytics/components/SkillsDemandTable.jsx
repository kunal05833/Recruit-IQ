// src/features/analytics/components/SkillsDemandTable.jsx
import clsx from "clsx";
import SkillBadge from "../../candidates/components/SkillBadge";

const SkillsDemandTable = ({ skills = [] }) => {
  const maxCount = Math.max(...skills.map((s) => s.count), 1);

  return (
    <div className="space-y-2.5">
      {skills.map((skill, index) => {
        const pct = Math.round((skill.count / maxCount) * 100);
        return (
          <div
            key={skill.name}
            className="flex items-center gap-3 group"
          >
            {/* Rank */}
            <span className="text-xs font-bold text-surface-400 w-5
                             text-right shrink-0">
              {index + 1}
            </span>

            {/* Skill Name */}
            <div className="w-24 shrink-0">
              <SkillBadge skill={skill.name} size="sm" />
            </div>

            {/* Bar */}
            <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full
                           transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Count */}
            <span className="text-xs font-semibold text-surface-700
                             w-8 text-right shrink-0">
              {skill.count}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsDemandTable;