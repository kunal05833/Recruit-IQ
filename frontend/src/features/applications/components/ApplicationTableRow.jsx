// src/features/applications/components/ApplicationTableRow.jsx
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Eye, User, Briefcase, CheckCircle, XCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Avatar from "../../../components/ui/Avatar";
import Button from "../../../components/ui/Button";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import { formatRelativeTime } from "../../../utils/formatters";
import useRole from "../../../hooks/useRole";
import { updateApplicationStatus, withdrawApplication } from "../applicationSlice";

const ApplicationTableRow = ({ application, index }) => {
  const navigate        = useNavigate();
  const dispatch        = useDispatch();
  const { isCandidate } = useRole();

  const handleStatusChange = async (status) => {
    try {
      await dispatch(updateApplicationStatus({ id: application.id, status })).unwrap();
      toast.success(`Status updated to ${status}`);
    } catch (e) {
      toast.error("Failed to update status.");
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await dispatch(withdrawApplication(application.id)).unwrap();
      toast.success("Application withdrawn.");
    } catch (e) {
      toast.error("Failed to withdraw.");
    }
  };

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
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center
                          justify-center shrink-0">
            <Briefcase size={13} className="text-primary-500" />
          </div>
          <div className="min-w-0">
            <p
              className="text-sm font-semibold text-surface-800 truncate
                         max-w-[180px] cursor-pointer
                         group-hover:text-primary-700 transition-colors"
              onClick={() => navigate(`/jobs/${application.jobId}`)}
            >
              {application.jobTitle || `Job #${application.jobId}`}
            </p>
            <p className="text-xs text-surface-500">
              ID #{application.jobId}
            </p>
          </div>
        </div>
      </td>

      {/* Candidate (recruiter/admin only) */}
      {!isCandidate && (
        <td className="table-cell">
          <div className="flex items-center gap-2">
            <Avatar
              name={
                application.candidateName ||
                `Candidate ${application.candidateId}`
              }
              size="xs"
            />
            <div className="min-w-0">
              <p
                className="text-sm font-medium text-surface-700 truncate
                           max-w-[140px] cursor-pointer hover:text-primary-700
                           transition-colors"
                onClick={() =>
                  navigate(`/candidates/${application.candidateId}`)
                }
              >
                {application.candidateName ||
                  `Candidate #${application.candidateId}`}
              </p>
            </div>
          </div>
        </td>
      )}

      {/* Status */}
      <td className="table-cell">
        <ApplicationStatusBadge status={application.status} />
      </td>

      {/* Applied Date */}
      <td className="table-cell text-xs text-surface-500 whitespace-nowrap">
        {formatRelativeTime(
          application.appliedAt || application.createdAt
        ) || "—"}
      </td>

      {/* Actions */}
      <td className="table-cell text-right">
        <div className="flex items-center justify-end gap-1.5
                        opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye size={13} />}
            onClick={() => navigate(`/jobs/${application.jobId}`)}
          >
            Job
          </Button>
          {!isCandidate && (
            <>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<User size={13} />}
                onClick={() =>
                  navigate(`/candidates/${application.candidateId}`)
                }
              >
                Profile
              </Button>
              {/* ✅ FIX: Status update buttons for recruiters */}
              {application.status !== "SHORTLISTED" && application.status !== "HIRED" && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<CheckCircle size={13} />}
                  className="text-success-600 hover:bg-success-50"
                  onClick={() => handleStatusChange("SHORTLISTED")}
                >
                  Shortlist
                </Button>
              )}
              {application.status !== "REJECTED" && (
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<XCircle size={13} />}
                  className="text-danger-600 hover:bg-danger-50"
                  onClick={() => handleStatusChange("REJECTED")}
                >
                  Reject
                </Button>
              )}
            </>
          )}
          {/* ✅ FIX: Withdraw for candidates */}
          {isCandidate && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 size={13} />}
              className="text-danger-600 hover:bg-danger-50"
              onClick={handleWithdraw}
            >
              Withdraw
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ApplicationTableRow;