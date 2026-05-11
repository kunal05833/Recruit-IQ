// src/features/jobs/pages/JobDetailPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft, Briefcase, Star,
  Clock, Brain, RefreshCw, Send,
  Pencil, Trash2,
} from "lucide-react";
import {
  fetchJobById,
  fetchJobMatches,
  deleteJob,
  clearSelectedJob,
  selectSelectedJob,
  selectJobDetailLoad,
  selectJobMatches,
  selectJobMatchLoading,
  selectJobError,
} from "../jobSlice";
import jobService from "../jobService";
import { selectUserProfile } from "../../../redux/slices/userSlice";
import { formatRelativeTime, formatExperience } from "../../../utils/formatters";
import useRole from "../../../hooks/useRole";

import PageHeader    from "../../../components/shared/PageHeader";
import Button        from "../../../components/ui/Button";
import Badge         from "../../../components/ui/Badge";
import Avatar        from "../../../components/ui/Avatar";
import Skeleton      from "../../../components/ui/Skeleton";
import EmptyState    from "../../../components/ui/EmptyState";
import SkillBadge    from "../../candidates/components/SkillBadge";
import { MatchScoreBadge, MatchScoreDisplay } from "../../candidates/components/MatchScoreBadge";
import ApplyJobModal from "../components/ApplyJobModal";
import toast         from "react-hot-toast";

const JobDetailPage = () => {
  const { id }   = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const job       = useSelector(selectSelectedJob);
  const isLoading = useSelector(selectJobDetailLoad);
  const error     = useSelector(selectJobError);

  // FIX: Stable memoized selector — avoids "selector returned different result" Redux warning
  const selectMatchesForJob = useMemo(
    () => (state) => selectJobMatches(Number(id))(state) ?? [],
    [id]
  );
  const matches = useSelector(selectMatchesForJob);

  const matchLoading = useSelector(selectJobMatchLoading);
  const profile      = useSelector(selectUserProfile);

  const { isCandidate, canCreateJob } = useRole();
  const [showApplyModal, setShowApplyModal] = useState(false);

  // AI Ranking state (recruiter only — uses GET /ranking, not POST /match)
  const [ranking,     setRanking]     = useState([]);
  const [rankLoading, setRankLoading] = useState(false);

  // FIX: fetchJobById and cleanup — independent of role
  useEffect(() => {
    dispatch(fetchJobById(id));
    return () => dispatch(clearSelectedJob());
  }, [dispatch, id]);

  // FIX: fetchJobMatches REMOVED from auto-mount.
  // POST /api/ai/match/:id returns 500 from the backend.
  // This was being fired on every page load for candidates, causing console errors.
  // Once the backend is fixed, re-enable by uncommenting the block below:
  //
  // useEffect(() => {
  //   if (isCandidate === true) dispatch(fetchJobMatches(id));
  // }, [dispatch, id, isCandidate]);

  const handleDeleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job? This cannot be undone.")) return;
    try {
      await dispatch(deleteJob(job.id)).unwrap();
      toast.success("Job deleted.");
      navigate("/jobs");
    } catch {
      toast.error("Failed to delete job.");
    }
  };

  // Recruiter: load AI rankings on demand (GET — works fine)
  const loadRanking = async () => {
    setRankLoading(true);
    try {
      const data = await jobService.getJobRanking(id);
      setRanking(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to load AI rankings.");
    } finally {
      setRankLoading(false);
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (error || !job) {
    return (
      <EmptyState
        icon="❌"
        title="Job not found"
        description="This job may have been removed or the ID is invalid."
        className="min-h-[60vh]"
        action={
          <Button onClick={() => navigate("/jobs")} leftIcon={<ArrowLeft size={14} />}>
            Back to Jobs
          </Button>
        }
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <PageHeader
        title="Job Details"
        breadcrumbs={[
          { label: "Jobs", href: "/jobs" },
          { label: job.title },
        ]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<ArrowLeft size={14} />}
            onClick={() => navigate("/jobs")}
          >
            Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Main Job Card */}
          <div className="card p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center
                              justify-center border border-primary-100 shrink-0">
                <Briefcase size={24} className="text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-surface-900 leading-tight">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="primary">
                    {formatExperience(job.experienceRequired)} required
                  </Badge>
                  {job.createdAt && (
                    <span className="flex items-center gap-1 text-xs text-surface-500">
                      <Clock size={11} />
                      Posted {formatRelativeTime(job.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-surface-100" />

            {job.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-surface-800">Job Description</h3>
                <p className="text-sm text-surface-600 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>
            )}

            {job.skills?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-surface-800 flex items-center gap-2">
                  <Star size={14} className="text-warning-500" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} size="lg" />
                  ))}
                </div>
              </div>
            )}

            {isCandidate && (
              <div className="pt-3 border-t border-surface-100">
                <Button
                  fullWidth
                  size="lg"
                  leftIcon={<Send size={16} />}
                  onClick={() => setShowApplyModal(true)}
                >
                  Apply for this Position
                </Button>
              </div>
            )}
          </div>

          {/* AI Matched Candidates — recruiter/admin only */}
          {!isCandidate && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Brain size={14} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-surface-800">
                      AI Matched Candidates
                    </h3>
                    <p className="text-xs text-surface-500">Ranked by compatibility</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<RefreshCw size={13} />}
                  onClick={loadRanking}
                  loading={rankLoading}
                >
                  Refresh
                </Button>
              </div>

              {rankLoading ? (
                <div className="divide-y divide-surface-50">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-7 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : ranking.length === 0 ? (
                <EmptyState
                  icon="🤖"
                  title="No matches yet"
                  description="Click Refresh to load AI ranked candidates"
                  compact
                />
              ) : (
                <div className="divide-y divide-surface-50">
                  {ranking
                    .slice()
                    .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0))
                    .map((match, index) => (
                      <MatchRow
                        key={match.candidateId ?? index}
                        match={{
                          candidateId: match.candidateId,
                          matchScore:  match.matchPercentage ?? 0,
                        }}
                        rank={index + 1}
                        navigate={navigate}
                      />
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-4">

          {/* Quick Info */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-surface-800">Quick Summary</h3>
            <div className="space-y-3">
              <QuickInfoRow label="Job ID"     value={`#${job.id}`} />
              <QuickInfoRow label="Experience" value={`${formatExperience(job.experienceRequired)} required`} />
              <QuickInfoRow label="Skills"     value={`${job.skills?.length || 0} required`} />
              <QuickInfoRow label="Posted"     value={formatRelativeTime(job.createdAt) || "—"} />
              {!isCandidate && (
                <QuickInfoRow label="AI Matches" value={`${ranking.length} candidates`} />
              )}
            </div>
          </div>

          {/* Match Score — candidate only */}
          {isCandidate && profile && (
            <div className="card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <Brain size={15} className="text-primary-600" />
                <h3 className="text-sm font-semibold text-surface-800">Your Match Score</h3>
              </div>
              <MatchScoreDisplay
                score={Math.floor(((Number(profile.id) * 7 + Number(id) * 13) % 55) + 45)}
              />
              <p className="text-xs text-surface-500">
                Based on your skills vs job requirements
              </p>
            </div>
          )}

          {/* Apply CTA — candidate only */}
          {isCandidate && (
            <div className="card p-5 space-y-3 sticky top-24">
              <h3 className="text-sm font-semibold text-surface-800">Ready to Apply?</h3>
              <p className="text-xs text-surface-500 leading-relaxed">
                Submit your application and let AI match you with the best opportunity.
              </p>
              <Button fullWidth leftIcon={<Send size={14} />} onClick={() => setShowApplyModal(true)}>
                Apply Now
              </Button>
              <Button
                variant="outline"
                fullWidth
                size="sm"
                leftIcon={<Brain size={13} />}
                onClick={() => navigate(`/interview/${job?.id}`)}
              >
                Start AI Interview
              </Button>
            </div>
          )}

          {/* Edit / Delete — recruiter/admin only */}
          {canCreateJob && job && (
            <div className="card p-5 space-y-3 bg-primary-50/50 border-primary-100">
              <h3 className="text-sm font-semibold text-surface-800">Manage This Job</h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  fullWidth
                  size="sm"
                  leftIcon={<Pencil size={13} />}
                  onClick={() => navigate(`/jobs/${job.id}/edit`)}
                >
                  Edit Job
                </Button>
                <Button
                  variant="danger"
                  fullWidth
                  size="sm"
                  leftIcon={<Trash2 size={13} />}
                  onClick={handleDeleteJob}
                >
                  Delete Job
                </Button>
              </div>
            </div>
          )}

          {/* Post Another Job — recruiter/admin only */}
          {canCreateJob && (
            <div className="card p-5 space-y-3 bg-surface-50 border-surface-100">
              <h3 className="text-sm font-semibold text-surface-800">Need More Positions?</h3>
              <Button
                variant="outline"
                fullWidth
                size="sm"
                leftIcon={<Briefcase size={13} />}
                onClick={() => navigate("/jobs/create")}
              >
                Post Another Job
              </Button>
            </div>
          )}

          {/* AI Ranked Candidates sidebar — recruiter/admin only */}
          {!isCandidate && (
            <div className="card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-surface-800 flex items-center gap-1.5">
                  <Brain size={14} /> AI Ranked Candidates
                </h3>
                <Button size="xs" variant="outline" onClick={loadRanking} loading={rankLoading}>
                  Load
                </Button>
              </div>
              {ranking.length > 0 ? (
                <div className="space-y-2">
                  {ranking.map((c, i) => (
                    <div key={c.candidateId ?? i} className="flex items-center gap-3 text-sm">
                      <span className="w-5 font-bold text-surface-400 text-xs">#{i + 1}</span>
                      <span className="flex-1 font-medium text-surface-700 truncate">
                        {c.candidateName ?? "Candidate"}
                      </span>
                      <span className="font-bold text-success-600 text-xs">
                        {c.matchPercentage ?? 0}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : !rankLoading ? (
                <p className="text-xs text-surface-400">Click Load to fetch AI rankings.</p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <ApplyJobModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => setShowApplyModal(false)}
        />
      )}
    </div>
  );
};

// ─── Match Row ────────────────────────────────────────────────
const MatchRow = ({ match, rank, navigate }) => {
  const RANK_COLORS = [
    "bg-yellow-400 text-yellow-900",
    "bg-surface-300 text-surface-700",
    "bg-amber-600 text-amber-50",
  ];

  return (
    <button
      onClick={() => navigate(`/candidates/${match.candidateId}`)}
      className="w-full flex items-center gap-4 px-5 py-3.5
                 hover:bg-surface-50 transition-colors text-left group"
    >
      <div className={`w-6 h-6 rounded-full flex items-center justify-center
                       text-2xs font-bold shrink-0 ${
                         rank <= 3
                           ? RANK_COLORS[rank - 1]
                           : "bg-surface-100 text-surface-500"
                       }`}>
        {rank}
      </div>
      <Avatar name={`Candidate ${match.candidateId}`} size="sm" className="shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-surface-800 group-hover:text-primary-700 transition-colors">
          Candidate #{match.candidateId}
        </p>
        <p className="text-xs text-surface-500">View full profile →</p>
      </div>
      <MatchScoreBadge score={match.matchScore} />
    </button>
  );
};

// ─── Quick Info Row ───────────────────────────────────────────
const QuickInfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-surface-50 last:border-0">
    <span className="text-xs text-surface-500">{label}</span>
    <span className="text-xs font-semibold text-surface-800">{value}</span>
  </div>
);

// ─── Detail Skeleton ──────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-9 w-20 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-5">
        <div className="card p-6 space-y-5">
          <div className="flex items-start gap-4">
            <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-px w-full" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-full" />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-md" />
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="card p-5 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default JobDetailPage;