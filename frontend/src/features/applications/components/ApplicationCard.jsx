// src/features/applications/components/ApplicationCard.jsx
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Briefcase, User, Calendar,
  ChevronRight, Hash, Trash2, CheckCircle,
} from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import Avatar   from "../../../components/ui/Avatar";
import Button   from "../../../components/ui/Button";
import SkillBadge from "../../candidates/components/SkillBadge";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import { getStatusConfig }    from "../utils/statusConfig";
import { formatDate, formatRelativeTime } from "../../../utils/formatters";
import useRole from "../../../hooks/useRole";
import {
  withdrawApplication,
  updateApplicationStatus,
  shortlistCandidate,
} from "../applicationSlice";

const ApplicationCard = ({ application, className }) => {
  const navigate        = useNavigate();
  const dispatch        = useDispatch();
  const { isCandidate } = useRole();
  const config          = getStatusConfig(application.status);

  // ✅ FIX: Candidate — withdraw
  const handleWithdraw = async () => {
    if (!window.confirm("Withdraw this application? This cannot be undone.")) return;
    try {
      await dispatch(withdrawApplication(application.id)).unwrap();
      toast.success("Application withdrawn.");
    } catch (e) {
      toast.error("Failed to withdraw application.");
    }
  };

  // ✅ FIX: Recruiter — shortlist
  const handleShortlist = async () => {
    try {
      await dispatch(shortlistCandidate({ id: application.id })).unwrap();
      toast.success("Candidate shortlisted!");
    } catch (e) {
      toast.error("Failed to shortlist candidate.");
    }
  };


  return (
    <div
      className={clsx(
        "card p-5 space-y-4",
        "hover:shadow-soft-md hover:border-surface-300",
        "transition-all duration-200",
        className
      )}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Icon */}
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center
                          justify-center border border-primary-100 shrink-0">
            <Briefcase size={18} className="text-primary-600" />
          </div>

          <div className="min-w-0">
            {/* Job Title */}
            <h3 className="text-sm font-semibold text-surface-900 truncate">
              {application.jobTitle || `Job #${application.jobId}`}
            </h3>

            {/* Candidate (for recruiter/admin) */}
            {!isCandidate && (
              <p className="text-xs text-surface-500 mt-0.5 flex items-center gap-1">
                <User size={10} />
                {application.candidateName || `Candidate #${application.candidateId}`}
              </p>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <ApplicationStatusBadge status={application.status} />
      </div>

      {/* ── Status Banner ───────────────────────────────── */}
      <div
        className={clsx(
          "flex items-center gap-2.5 p-3 rounded-xl border",
          config.bg,
          config.border
        )}
      >
        <span className="text-base shrink-0">{config.icon}</span>
        <div>
          <p className={clsx("text-xs font-semibold", config.text)}>
            {config.label}
          </p>
          <p className="text-xs text-surface-500 mt-0.5">
            {config.description}
          </p>
        </div>
      </div>

      {/* ── Meta Info ───────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3">
        <MetaItem
          icon={<Hash size={12} />}
          label="Application ID"
          value={application.id ? `#${application.id}` : "—"}
        />
        <MetaItem
          icon={<Calendar size={12} />}
          label="Applied"
          value={
            application.appliedAt || application.createdAt
              ? formatRelativeTime(application.appliedAt || application.createdAt)
              : "—"
          }
        />
        <MetaItem
          icon={<Briefcase size={12} />}
          label="Job ID"
          value={`#${application.jobId}`}
        />
        <MetaItem
          icon={<User size={12} />}
          label="Candidate ID"
          value={`#${application.candidateId}`}
        />
      </div>

      {/* ── Actions ─────────────────────────────────────── */}
      <div className="flex gap-2 pt-1 border-t border-surface-100">
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          leftIcon={<ChevronRight size={13} />}
          onClick={() => navigate(`/jobs/${application.jobId}`)}
        >
          View Job
        </Button>
        {!isCandidate && (
          <>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              leftIcon={<User size={13} />}
              onClick={() =>
                navigate(`/candidates/${application.candidateId}`)
              }
            >
              View Candidate
            </Button>
            {/* ✅ FIX: Shortlist button for recruiters */}
            {application.status !== "SHORTLISTED" && application.status !== "HIRED" && (
              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftIcon={<CheckCircle size={13} />}
                onClick={handleShortlist}
              >
                Shortlist
              </Button>
            )}
          </>
        )}
        {/* ✅ FIX: Withdraw button for candidates */}
        {isCandidate && application.status !== "HIRED" && (
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            leftIcon={<Trash2 size={13} />}
            onClick={handleWithdraw}
            className="text-danger-600 hover:bg-danger-50"
          >
            Withdraw
          </Button>
        )}
      </div>
    </div>
  );
};

// ─── Meta Item ────────────────────────────────────────────────
const MetaItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-2 p-2.5 bg-surface-50 rounded-lg">
    <span className="text-surface-400 mt-0.5 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-2xs text-surface-400 font-medium">{label}</p>
      <p className="text-xs font-semibold text-surface-700 truncate mt-0.5">
        {value}
      </p>
    </div>
  </div>
);

export default ApplicationCard;