// src/features/jobs/components/JobCard.jsx
import { useNavigate } from "react-router-dom";
import {
  Briefcase, Clock, ChevronRight,
  Star, Users,
} from "lucide-react";
import clsx from "clsx";
import Button      from "../../../components/ui/Button";
import Badge       from "../../../components/ui/Badge";
import SkillBadge  from "../../candidates/components/SkillBadge";
import { truncate } from "../../../utils/formatters";
import { formatRelativeTime } from "../../../utils/formatters";
import useRole from "../../../hooks/useRole";

const JobCard = ({ job, onApply, isApplying, className }) => {
  const navigate = useNavigate();
  const { isCandidate, canCreateJob } = useRole();

  const handleViewDetail = () => navigate(`/jobs/${job.id}`);

  return (
    <div
      className={clsx(
        "card p-5 flex flex-col gap-4",
        "hover:shadow-soft-md hover:border-surface-300",
        "transition-all duration-200 group",
        className
      )}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center
                          justify-center shrink-0 border border-primary-100">
            <Briefcase size={18} className="text-primary-600" />
          </div>
          <div className="min-w-0">
            <h3
              className="text-sm font-semibold text-surface-900 truncate
                         group-hover:text-primary-700 transition-colors
                         cursor-pointer"
              onClick={handleViewDetail}
            >
              {job.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="primary" size="sm">
                {job.experienceRequired}y exp
              </Badge>
              {job.createdAt && (
                <span className="text-2xs text-surface-400 flex items-center gap-1">
                  <Clock size={10} />
                  {formatRelativeTime(job.createdAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Description ────────────────────────────────── */}
      {job.description && (
        <p className="text-xs text-surface-600 leading-relaxed line-clamp-2">
          {truncate(job.description, 120)}
        </p>
      )}

      {/* ── Skills ─────────────────────────────────────── */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => (
            <SkillBadge key={skill} skill={skill} size="sm" />
          ))}
          {job.skills.length > 4 && (
            <span className="text-xs text-surface-400 px-1.5 py-0.5
                             bg-surface-100 rounded-md font-medium">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      )}

      {/* ── Footer Actions ──────────────────────────────── */}
      <div className="flex items-center gap-2 pt-1 border-t border-surface-100">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ChevronRight size={13} />}
          onClick={handleViewDetail}
          className="flex-1"
        >
          View Details
        </Button>

        {isCandidate && onApply && (
          <Button
            size="sm"
            loading={isApplying}
            onClick={() => onApply(job.id)}
            className="flex-1"
          >
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default JobCard;