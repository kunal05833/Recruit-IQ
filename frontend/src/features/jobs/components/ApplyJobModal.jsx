// src/features/jobs/components/ApplyJobModal.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, X, Briefcase, AlertCircle } from "lucide-react";
import {
  submitApplication,
  clearApplicationError,
  clearSuccessMessage,
  selectApplicationSubmitting,
  selectApplicationError,
} from "../../applications/applicationSlice";
import { selectAuth }        from "../../auth/authSlice";
import { selectUserProfile, selectCandidateId } from "../../../redux/slices/userSlice";
import Button     from "../../../components/ui/Button";
import Badge      from "../../../components/ui/Badge";
import SkillBadge from "../../candidates/components/SkillBadge";
import toast      from "react-hot-toast";

const ApplyJobModal = ({ job, onClose, onSuccess }) => {
  const dispatch     = useDispatch();
  const auth         = useSelector(selectAuth);
  const profile      = useSelector(selectUserProfile);
  const isSubmitting = useSelector(selectApplicationSubmitting);
  const error        = useSelector(selectApplicationError);

  // ✅ FIX: Dedicated selector — candidateId correctly resolve hoga
  // userSlice normalizeProfile mein candidateId ?? id priority set hai
  const candidateId  = useSelector(selectCandidateId);

  useEffect(() => {
    return () => {
      dispatch(clearApplicationError());
      dispatch(clearSuccessMessage());
    };
  }, [dispatch]);

  const handleApply = async () => {
    // ✅ FIX: candidateId null check — clear error message
    if (!candidateId) {
      toast.error(
        "Profile ID nahi mili. Profile page par jao aur resume dobara upload karo.",
        { duration: 4000 }
      );
      return;
    }

    // ✅ FIX: profile incomplete check — skills ya headline hona chahiye
    const hasProfile = !!(
      profile?.hasResume ||
      profile?.skills?.length > 0 ||
      profile?.headline ||
      profile?.experience
    );

    if (!hasProfile) {
      toast.error(
        "Pehle apna profile complete karo — Profile page par jao aur resume upload karo.",
        { duration: 5000 }
      );
      return;
    }

    const result = await dispatch(
      submitApplication({
        jobId:       job.id,
        candidateId, // ✅ correct candidateId — userId nahi
      })
    );

    if (submitApplication.fulfilled.match(result)) {
      toast.success("Application submit ho gayi! 🎉");
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-surface-900/50 backdrop-blur-sm
                 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-soft-xl w-full max-w-md animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5
                        border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center
                            justify-center">
              <Briefcase size={16} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-surface-900">
                Apply for Job
              </h3>
              <p className="text-xs text-surface-500">
                Review and confirm your application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-surface-400 hover:bg-surface-100
                       hover:text-surface-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">

          {/* ✅ Profile incomplete warning — apply button se pehle dikhao */}
          {!candidateId && (
            <div className="flex items-start gap-2.5 p-3 bg-warning-50
                            border border-warning-200 rounded-xl">
              <AlertCircle size={15} className="text-warning-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-warning-800">
                  Profile incomplete
                </p>
                <p className="text-xs text-warning-700 mt-0.5">
                  Profile page par jao aur resume upload karo — tab apply kar sakte ho.
                </p>
              </div>
            </div>
          )}

          {/* Job Summary */}
          <div className="bg-surface-50 rounded-xl p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-surface-500
                            uppercase tracking-wider mb-1">
                Position
              </p>
              <p className="text-base font-bold text-surface-900">
                {job.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {job.experienceRequired}y+ experience
              </Badge>
            </div>
            {job.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} size="sm" />
                ))}
              </div>
            )}
            {job.description && (
              <p className="text-xs text-surface-600 leading-relaxed line-clamp-3">
                {job.description}
              </p>
            )}
          </div>

          {/* Applicant Info */}
          <div className="space-y-2.5">
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
              Applying as
            </p>
            <div className="flex items-center gap-3 p-3 bg-primary-50
                            rounded-xl border border-primary-100">
              <div className="w-9 h-9 rounded-full bg-primary-200 flex items-center
                              justify-center text-primary-700 font-bold text-sm">
                {profile?.name?.charAt(0) || "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-900">
                  {profile?.name || "You"}
                </p>
                <p className="text-xs text-surface-500">
                  {profile?.email || auth?.user?.email || "—"}
                </p>
              </div>
              <div className="ml-auto">
                <Badge variant="success" dot>
                  Candidate
                </Badge>
              </div>
            </div>
          </div>

          {/* Backend Error */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 bg-danger-50
                            border border-danger-200 rounded-xl animate-fade-in">
              <AlertCircle size={15} className="text-danger-500 shrink-0 mt-0.5" />
              <p className="text-xs text-danger-700">{error}</p>
            </div>
          )}

          <p className="text-xs text-surface-500 text-center leading-relaxed">
            By applying, you confirm that your profile information
            is accurate and up-to-date.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-surface-100">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            loading={isSubmitting}
            disabled={!candidateId}       // ✅ profile nahi to button disabled
            leftIcon={!isSubmitting && <CheckCircle size={15} />}
            onClick={handleApply}
          >
            Confirm Application
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobModal;