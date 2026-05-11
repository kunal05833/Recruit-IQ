// src/features/candidates/components/CandidateTableRow.jsx
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import Avatar          from "../../../components/ui/Avatar";
import Button          from "../../../components/ui/Button";
import SkillBadge      from "./SkillBadge";
import ExperienceBadge from "./ExperienceBadge";
import { MatchScoreBadge } from "./MatchScoreBadge";

const CandidateTableRow = ({ candidate, matchScore, index }) => {
  const navigate = useNavigate();

  return (
    <tr
      className="hover:bg-surface-50 transition-colors duration-100
                 border-b border-surface-100 last:border-0 group"
    >
      {/* # */}
      <td className="table-cell text-surface-400 font-mono text-xs w-12">
        {index + 1}
      </td>

      {/* Candidate */}
      <td className="table-cell">
        <div className="flex items-center gap-3">
          <Avatar name={candidate.name} size="sm" />
          <div>
            <p className="text-sm font-semibold text-surface-800">
              {candidate.name}
            </p>
            <p className="text-xs text-surface-500">
              ID #{candidate.id}
            </p>
          </div>
        </div>
      </td>

      {/* Experience */}
      <td className="table-cell">
        <ExperienceBadge years={candidate.experience} />
      </td>

      {/* Skills */}
      <td className="table-cell">
        <div className="flex flex-wrap gap-1">
          {candidate.skills?.slice(0, 3).map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" />
          ))}
          {candidate.skills?.length > 3 && (
            <span className="text-xs text-surface-400 px-1 font-medium">
              +{candidate.skills.length - 3}
            </span>
          )}
        </div>
      </td>

      {/* Match Score */}
      {matchScore !== undefined && (
        <td className="table-cell">
          <MatchScoreBadge score={matchScore} />
        </td>
      )}

      {/* Actions */}
      <td className="table-cell text-right">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Eye size={13} />}
          onClick={() => navigate(`/candidates/${candidate.id}`)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View
        </Button>
      </td>
    </tr>
  );
};

export default CandidateTableRow;