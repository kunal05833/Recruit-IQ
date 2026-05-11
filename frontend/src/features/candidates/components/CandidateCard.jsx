// src/features/candidates/components/CandidateCard.jsx
import { useNavigate } from "react-router-dom";
import { Eye, Star, Briefcase } from "lucide-react";
import clsx from "clsx";
import Avatar           from "../../../components/ui/Avatar";
import Button           from "../../../components/ui/Button";
import SkillBadge       from "./SkillBadge";
import ExperienceBadge  from "./ExperienceBadge";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { truncate }     from "../../../utils/formatters";

const CandidateCard = ({ candidate, matchScore, className }) => {
  const navigate = useNavigate();

  return (
    <div
      className={clsx(
        "card p-5 flex flex-col gap-4",
        "hover:shadow-soft-md hover:border-surface-300",
        "transition-all duration-200",
        className
      )}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={candidate.name} size="md" />
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-surface-900 truncate">
              {candidate.name}
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">
              ID #{candidate.id}
            </p>
          </div>
        </div>

        {/* Match Score */}
        {matchScore !== undefined && (
          <MatchScoreBadge score={matchScore} />
        )}
      </div>

      {/* ── Experience ─────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <Briefcase size={13} className="text-surface-400 shrink-0" />
        <ExperienceBadge years={candidate.experience} />
      </div>

      {/* ── Skills ─────────────────────────────────────── */}
      {candidate.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {candidate.skills.slice(0, 4).map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" />
          ))}
          {candidate.skills.length > 4 && (
            <span className="text-xs text-surface-400 px-1.5 py-0.5
                             bg-surface-100 rounded-md font-medium">
              +{candidate.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* ── Action ─────────────────────────────────────── */}
      <div className="pt-1 border-t border-surface-100">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          leftIcon={<Eye size={14} />}
          onClick={() => navigate(`/candidates/${candidate.id}`)}
        >
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default CandidateCard;