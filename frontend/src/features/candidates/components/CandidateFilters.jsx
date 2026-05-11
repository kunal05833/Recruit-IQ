// src/features/candidates/components/CandidateFilters.jsx
import { useState } from "react";
import { X, Filter, ChevronDown } from "lucide-react";
import clsx from "clsx";
import Button    from "../../../components/ui/Button";
import Input     from "../../../components/ui/Input";
import SkillBadge from "./SkillBadge";

// Common skills for quick-select
const COMMON_SKILLS = [
  "React", "Java", "Python", "Node.js", "SQL",
  "AWS", "TypeScript", "Spring Boot", "MongoDB",
  "Docker", "Kubernetes", "GraphQL",
];

const CandidateFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
  isLoading,
}) => {
  const [skillInput,  setSkillInput]  = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const activeFilterCount = [
    filters.skills?.length > 0,
    !!filters.minExperience,
    !!filters.maxExperience,
  ].filter(Boolean).length;

  // Add skill to filter
  const addSkill = (skill) => {
    if (!skill.trim()) return;
    const current = filters.skills || [];
    if (!current.includes(skill)) {
      onFilterChange({ skills: [...current, skill] });
    }
    setSkillInput("");
  };

  // Remove skill from filter
  const removeSkill = (skill) => {
    onFilterChange({
      skills: (filters.skills || []).filter((s) => s !== skill),
    });
  };

  // Handle skill input keyboard
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  return (
    <div className="card p-4 space-y-4">
      {/* ── Filter Header ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm font-semibold
                     text-surface-700 hover:text-surface-900
                     transition-colors"
        >
          <Filter size={15} className="text-surface-500" />
          Filters
          {activeFilterCount > 0 && (
            <span className="text-2xs bg-primary-600 text-white
                             px-1.5 py-0.5 rounded-full font-bold">
              {activeFilterCount}
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
              {isLoading ? "..." : `${resultCount} results`}
            </span>
          )}
          {activeFilterCount > 0 && (
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
        <div className="space-y-5 pt-2 border-t border-surface-100 animate-fade-in">
          {/* Experience Range */}
          <div>
            <p className="text-xs font-semibold text-surface-600
                          uppercase tracking-wider mb-2.5">
              Experience (Years)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Min (e.g. 0)"
                type="number"
                min="0"
                value={filters.minExperience}
                onChange={(e) =>
                  onFilterChange({ minExperience: e.target.value })
                }
                label="Minimum"
              />
              <Input
                placeholder="Max (e.g. 10)"
                type="number"
                min="0"
                value={filters.maxExperience}
                onChange={(e) =>
                  onFilterChange({ maxExperience: e.target.value })
                }
                label="Maximum"
              />
            </div>
          </div>

          {/* Skills Filter */}
          <div>
            <p className="text-xs font-semibold text-surface-600
                          uppercase tracking-wider mb-2.5">
              Filter by Skills
            </p>

            {/* Skill Input */}
            <Input
              placeholder="Type skill & press Enter..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />

            {/* Selected Skills */}
            {filters.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {filters.skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => removeSkill(skill)}
                    className="inline-flex items-center gap-1 px-2 py-0.5
                               bg-primary-50 text-primary-700 border border-primary-200
                               rounded-md text-xs font-medium hover:bg-primary-100
                               transition-colors group"
                  >
                    {skill}
                    <X
                      size={10}
                      className="text-primary-400 group-hover:text-primary-600"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick-Select Common Skills */}
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
                               transition-colors font-medium border
                               border-surface-200"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Active Filter Pills (collapsed) ───────────── */}
      {!showFilters && activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-surface-100">
          {filters.skills?.map((skill) => (
            <button
              key={skill}
              onClick={() => removeSkill(skill)}
              className="inline-flex items-center gap-1 px-2 py-0.5
                         bg-primary-50 text-primary-700 rounded-md
                         text-xs font-medium hover:bg-primary-100
                         transition-colors"
            >
              {skill}
              <X size={10} />
            </button>
          ))}
          {filters.minExperience && (
            <span className="px-2 py-0.5 bg-surface-100 text-surface-600
                             rounded-md text-xs font-medium">
              Min exp: {filters.minExperience}y
            </span>
          )}
          {filters.maxExperience && (
            <span className="px-2 py-0.5 bg-surface-100 text-surface-600
                             rounded-md text-xs font-medium">
              Max exp: {filters.maxExperience}y
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateFilters;