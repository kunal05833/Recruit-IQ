// src/features/jobs/components/JobTableRow.jsx
import { useNavigate } from "react-router-dom";
import { Eye, Briefcase, ChevronRight } from "lucide-react";
import clsx from "clsx";
import Badge      from "../../../components/ui/Badge";
import Button     from "../../../components/ui/Button";
import SkillBadge from "../../candidates/components/SkillBadge";
import { formatRelativeTime, truncate } from "../../../utils/formatters";
import useRole from "../../../hooks/useRole";

const JobTableRow = ({ job, onApply, isApplying, index }) => {
  const navigate       = useNavigate();
  const { isCandidate } = useRole();

  return (
    <tr
      className="hover:bg-surface-50 transition-colors duration-100
                 border-b border-surface-100 last:border-0 group"
    >
      {/* # */}
      <td className="table-cell text-surface-400 font-mono text-xs w-10">
        {index + 1}
      </td>

      {/* Job */}
      <td className="table-cell">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center
                          justify-center shrink-0">
            <Briefcase size={14} className="text-primary-500" />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold text-surface-800 truncate
                         cursor-pointer group-hover:text-primary-700
                         transition-colors max-w-[220px]"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              {job.title}
            </p>
            {job.description && (
              <p className="text-xs text-surface-500 truncate max-w-[200px]">
                {truncate(job.description, 60)}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Experience */}
      <td className="table-cell">
        <Badge variant="primary" size="sm">
          {job.experienceRequired}y+ exp
        </Badge>
      </td>

      {/* Skills */}
      <td className="table-cell">
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {job.skills?.slice(0, 2).map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" />
          ))}
          {job.skills?.length > 2 && (
            <span className="text-xs text-surface-400 px-1 font-medium">
              +{job.skills.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Posted */}
      <td className="table-cell text-xs text-surface-500 whitespace-nowrap">
        {formatRelativeTime(job.createdAt) || "—"}
      </td>

      {/* Actions */}
      <td className="table-cell">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye size={13} />}
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            View
          </Button>
          {isCandidate && onApply && (
            <Button
              size="sm"
              loading={isApplying}
              onClick={() => onApply(job.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Apply
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default JobTableRow;