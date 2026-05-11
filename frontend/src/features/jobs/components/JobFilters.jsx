// src/features/jobs/components/JobFilters.jsx
import { useState } from "react";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import clsx from "clsx";
import Input from "../../../components/ui/Input";
import SkillBadge from "../../candidates/components/SkillBadge";

const COMMON_SKILLS = [
  "React", "Java", "Python", "Node.js", "SQL",
  "AWS", "TypeScript", "Spring Boot", "MongoDB",
  "Docker", "Vue.js", "Angular", "Go", "Rust",
];

const JobFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
  isLoading,
}) => {
  const [skillInput,  setSkillInput]  = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const activeCount = [
    filters.skills?.length > 0,
    !!filters.minExperience,
    !!filters.maxExperience,
  ].filter(Boolean).length;

  const addSkill = (skill) => {
    if (!skill.trim()) return;
    const current = filters.skills || [];
    if (!current.includes(skill)) {
      onFilterChange({ skills: [...current, skill] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    onFilterChange({
      skills: (filters.skills || []).filter((s) => s !== skill),
    });

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  return (
    <div className="card p-4 space-y-4">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-semibold
                     text-surface-700 hover:text-surface-900 transition-colors"
        >
          <SlidersHorizontal size={15} className="text-surface-500" />
          Filters
          {activeCount > 0 && (
            <span className="text-2xs bg-primary-600 text-white
                             px-1.5 py-0.5 rounded-full font-bold">
              {activeCount}
            </span>
          )}
          <ChevronDown
            size={14}
            className={clsx(
              "text-surface-400 transition-transform duration-200",
              showFilters && "rotate-180"
            )}
          />
        </button>

        <div className="flex items-center gap-3">
          {resultCount !== undefined && (
            <span className="text-xs text-surface-500">
              {isLoading ? "..." : `${resultCount} jobs`}
            </span>
          )}
          {activeCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-danger-600 hover:text-danger-700
                         font-medium flex items-center gap-1 transition-colors"
            >
              <X size={12} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Body ───────────────────────────────── */}
      {showFilters && (
        <div className="space-y-5 pt-3 border-t border-surface-100 animate-fade-in">
          {/* Experience Range */}
          <div>
            <p className="text-xs font-semibold text-surface-600
                          uppercase tracking-wider mb-2.5">
              Required Experience
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Min Years"
                type="number"
                min="0"
                placeholder="0"
                value={filters.minExperience}
                onChange={(e) =>
                  onFilterChange({ minExperience: e.target.value })
                }
              />
              <Input
                label="Max Years"
                type="number"
                min="0"
                placeholder="10"
                value={filters.maxExperience}
                onChange={(e) =>
                  onFilterChange({ maxExperience: e.target.value })
                }
              />
            </div>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs font-semibold text-surface-600
                          uppercase tracking-wider mb-2.5">
              Required Skills
            </p>
            <Input
              placeholder="Type skill & press Enter..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />

            {filters.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {filters.skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => removeSkill(skill)}
                    className="inline-flex items-center gap-1 px-2 py-0.5
                               bg-primary-50 text-primary-700 border border-primary-200
                               rounded-md text-xs font-medium hover:bg-primary-100
                               transition-colors"
                  >
                    {skill}
                    <X size={10} className="text-primary-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick select */}
            <div className="mt-3">
              <p className="text-2xs text-surface-400 mb-1.5 font-medium">
                Quick select:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SKILLS.filter(
                  (s) => !filters.skills?.includes(s)
                ).map((skill) => (
                  <button
                    key={skill}
                    onClick={() => addSkill(skill)}
                    className="text-2xs px-2 py-0.5 bg-surface-100
                               text-surface-600 rounded-md hover:bg-surface-200
                               transition-colors font-medium border border-surface-200"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Active pills (collapsed) ──────────────────── */}
      {!showFilters && activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-surface-100">
          {filters.skills?.map((skill) => (
            <button
              key={skill}
              onClick={() => removeSkill(skill)}
              className="inline-flex items-center gap-1 px-2 py-0.5
                         bg-primary-50 text-primary-700 rounded-md
                         text-xs font-medium hover:bg-primary-100 transition-colors"
            >
              {skill}
              <X size={10} />
            </button>
          ))}
          {filters.minExperience && (
            <span className="px-2 py-0.5 bg-surface-100 text-surface-600
                             rounded-md text-xs font-medium">
              Min: {filters.minExperience}y
            </span>
          )}
          {filters.maxExperience && (
            <span className="px-2 py-0.5 bg-surface-100 text-surface-600
                             rounded-md text-xs font-medium">
              Max: {filters.maxExperience}y
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default JobFilters;