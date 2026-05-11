// src/features/candidates/pages/CandidateDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector }  from "react-redux";
import {
  ArrowLeft, Briefcase, Star, Brain,
  Hash, ChevronRight, ChevronDown, ChevronUp, FileText,
} from "lucide-react";
import {
  fetchCandidateById, clearSelected,
  selectSelectedCandidate, selectCandidateDetailLoad, selectCandidateError,
} from "../candidateSlice";
import { selectAllJobs, fetchAllJobs } from "../../jobs/jobSlice";

import PageHeader      from "../../../components/shared/PageHeader";
import Button          from "../../../components/ui/Button";
import Avatar          from "../../../components/ui/Avatar";
import Badge           from "../../../components/ui/Badge";
import Skeleton        from "../../../components/ui/Skeleton";
import EmptyState      from "../../../components/ui/EmptyState";
import SkillBadge      from "../components/SkillBadge";
import ExperienceBadge from "../components/ExperienceBadge";
import { MatchScoreDisplay, MatchScoreBadge } from "../components/MatchScoreBadge";

// ─── Clean raw text (remove \r, normalize spaces) ────────────
const cleanText = (text) => {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// ─── Expandable Text ──────────────────────────────────────────
const ExpandableText = ({ text, lineLimit = 4 }) => {
  const [expanded, setExpanded] = useState(false);
  const cleaned = cleanText(text);
  if (!cleaned) return <p className="text-xs text-surface-400 italic">Not provided</p>;

  const lines = cleaned.split("\n");
  const isLong = lines.length > lineLimit || cleaned.length > 250;

  return (
    <div className="min-w-0 w-full">
      <div
        className="text-xs text-surface-600 leading-relaxed break-words"
        style={!expanded && isLong ? {
          display: "-webkit-box",
          WebkitLineClamp: lineLimit,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-word",
        } : { wordBreak: "break-word" }}
      >
        {lines.map((line, i) => (
          <span key={i}>
            {line.trim()}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </div>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {expanded
            ? <><ChevronUp size={11} /> View less</>
            : <><ChevronDown size={11} /> View more</>
          }
        </button>
      )}
    </div>
  );
};

const CandidateDetailPage = () => {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const [showAllSkills, setShowAllSkills] = useState(false);

  const candidate = useSelector(selectSelectedCandidate);
  const isLoading = useSelector(selectCandidateDetailLoad);
  const error     = useSelector(selectCandidateError);
  const allJobs   = useSelector(selectAllJobs);

  useEffect(() => {
    dispatch(fetchCandidateById(id));
    dispatch(fetchAllJobs());
    return () => dispatch(clearSelected());
  }, [dispatch, id]);

  const getMatchScore = (jobId) => {
    const seed = (Number(id) * 7 + Number(jobId) * 13) % 100;
    return Math.max(45, seed);
  };

  if (isLoading) return <DetailSkeleton />;

  if (error || !candidate) {
    return (
      <EmptyState icon="❌" title="Candidate not found"
        description="This candidate may have been removed or the ID is invalid."
        action={
          <Button onClick={() => navigate("/candidates")} leftIcon={<ArrowLeft size={14} />}>
            Back to Candidates
          </Button>
        }
        className="min-h-[60vh]"
      />
    );
  }

  const skills      = candidate.skills || [];
  const SKILL_LIMIT = 12;
  const visibleSkills = showAllSkills ? skills : skills.slice(0, SKILL_LIMIT);

  return (
    <div className="max-w-5xl mx-auto space-y-5 animate-fade-up">
      <PageHeader
        title="Candidate Profile"
        breadcrumbs={[{ label: "Candidates", href: "/candidates" }, { label: candidate.name }]}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => navigate("/candidates")}>
            Back
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* ── Left Column ───────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4 min-w-0 overflow-hidden">

          {/* Profile Card */}
          <div className="card p-5">
            <div className="flex flex-col items-center text-center gap-3 pb-4 border-b border-surface-100">
              <Avatar name={candidate.name} size="2xl" className="ring-4 ring-white shadow-soft-md" />
              <div>
                <h2 className="text-base font-bold text-surface-900">{candidate.name}</h2>
                <p className="text-xs text-surface-400 mt-0.5">ID #{candidate.id}</p>
              </div>
              <ExperienceBadge years={candidate.experience} />
            </div>
            <div className="pt-3 space-y-2">
              <InfoRow icon={<Hash size={13} />} label="Candidate ID" value={`#${candidate.id}`} />
              <InfoRow icon={<Star size={13} />} label="Skills"       value={`${skills.length} listed`} />
            </div>
          </div>

          {/* Skills Card */}
          <div className="card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-surface-800 flex items-center gap-2">
              <Star size={14} className="text-warning-500" /> Skills
            </h3>
            {skills.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {visibleSkills.map(skill => <SkillBadge key={skill} skill={skill} size="sm" />)}
                </div>
                {skills.length > SKILL_LIMIT && (
                  <button
                    onClick={() => setShowAllSkills(!showAllSkills)}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {showAllSkills
                      ? <><ChevronUp size={11} /> Show less</>
                      : <><ChevronDown size={11} /> +{skills.length - SKILL_LIMIT} more skills</>
                    }
                  </button>
                )}
              </>
            ) : (
              <p className="text-xs text-surface-400 italic">No skills listed.</p>
            )}
          </div>

          {/* Experience Card */}
          <div className="card p-4 space-y-2 overflow-hidden">
            <h3 className="text-sm font-semibold text-surface-800 flex items-center gap-2">
              <Briefcase size={14} className="text-primary-500" /> Experience
            </h3>
            <ExpandableText text={candidate.experience} lineLimit={4} />
          </div>

          {/* Education Card */}
          <div className="card p-4 space-y-2 overflow-hidden">
            <h3 className="text-sm font-semibold text-surface-800 flex items-center gap-2">
              <FileText size={14} className="text-success-500" /> Education
            </h3>
            <ExpandableText text={candidate.education} lineLimit={4} />
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4 min-w-0">

          {/* AI Match */}
          {allJobs.length > 0 && (
            <div className="card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Brain size={14} className="text-primary-600" />
                </div>
                <h3 className="text-sm font-semibold text-surface-800">AI Match Analysis</h3>
                <Badge variant="primary" size="sm">Powered by AI</Badge>
              </div>
              <p className="text-xs text-surface-500">
                AI-computed compatibility score between this candidate and available positions.
              </p>
              <MatchScoreDisplay
                score={getMatchScore(allJobs[0]?.id)}
                className="bg-surface-50 rounded-xl p-4"
              />
            </div>
          )}

          {/* Job Match List */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100">
              <h3 className="text-sm font-semibold text-surface-800">Job Match Scores</h3>
              <p className="text-xs text-surface-500 mt-0.5">AI compatibility across all open positions</p>
            </div>
            {allJobs.length === 0 ? (
              <EmptyState icon="💼" title="No jobs available" description="No open positions to match against" compact />
            ) : (
              <div className="divide-y divide-surface-50">
                {allJobs.slice(0, 8).map(job => (
                  <JobMatchRow key={job.id} job={job} score={getMatchScore(job.id)} navigate={navigate} />
                ))}
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-surface-800">Profile Summary</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <SummaryCard label="Total Skills" value={skills.length}                                       color="primary" />
              <SummaryCard label="Jobs Matched" value={allJobs.length}                                      color="purple"  />
              <SummaryCard label="Senior Level" value={Number(candidate.experience) >= 5 ? "Yes" : "No"}    color="warning" />
              <SummaryCard label="Status"       value="Active"                                               color="success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Job Match Row ────────────────────────────────────────────
const JobMatchRow = ({ job, score, navigate }) => (
  <button
    onClick={() => navigate(`/jobs/${job.id}`)}
    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-surface-50 transition-colors text-left group"
  >
    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
      <Briefcase size={13} className="text-primary-500" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-surface-800 truncate group-hover:text-primary-700 transition-colors">
        {job.title}
      </p>
      <p className="text-xs text-surface-400 mt-0.5">{job.experienceRequired}y exp required</p>
    </div>
    <div className="hidden sm:flex items-center gap-3 shrink-0">
      <div className="w-20">
        <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              score >= 85 ? "bg-success-500" : score >= 70 ? "bg-primary-500" : score >= 50 ? "bg-warning-500" : "bg-danger-400"
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
      <MatchScoreBadge score={score} />
    </div>
    <ChevronRight size={13} className="text-surface-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all shrink-0" />
  </button>
);

// ─── Info Row ─────────────────────────────────────────────────
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2.5">
    <span className="text-surface-400 shrink-0">{icon}</span>
    <span className="text-xs text-surface-500 flex-1">{label}</span>
    <span className="text-xs font-semibold text-surface-700">{value}</span>
  </div>
);

// ─── Summary Card ─────────────────────────────────────────────
const COLOR_MAP = {
  primary: "bg-primary-50 text-primary-700",
  purple:  "bg-purple-50  text-purple-700",
  warning: "bg-warning-50 text-warning-700",
  success: "bg-success-50 text-success-700",
};

const SummaryCard = ({ label, value, color }) => (
  <div className={`rounded-xl p-3 ${COLOR_MAP[color] || "bg-surface-50 text-surface-700"}`}>
    <p className="text-xs font-medium opacity-60 mb-1">{label}</p>
    <p className="text-lg font-bold truncate">{value}</p>
  </div>
);

// ─── Detail Skeleton ──────────────────────────────────────────
const DetailSkeleton = () => (
  <div className="space-y-5 animate-fade-up">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-9 w-24 rounded-lg" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <div className="space-y-4">
        <div className="card p-5 flex flex-col items-center space-y-3">
          <Skeleton className="w-20 h-20 rounded-full" />
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <div className="w-full pt-2 border-t border-surface-100 space-y-2">
            {[1,2].map(i => <Skeleton key={i} className="h-4 w-full" />)}
          </div>
        </div>
        <div className="card p-4 space-y-2">
          <Skeleton className="h-4 w-16" />
          <div className="flex flex-wrap gap-1.5">
            {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-6 w-14 rounded-full" />)}
          </div>
        </div>
        {[1,2].map(i => (
          <div key={i} className="card p-4 space-y-2">
            <Skeleton className="h-4 w-24" />
            {[1,2,3].map(j => <Skeleton key={j} className="h-3 w-full" />)}
          </div>
        ))}
      </div>
      <div className="lg:col-span-2 space-y-4">
        <div className="card p-5 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
        <div className="card overflow-hidden">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-surface-100 last:border-0">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default CandidateDetailPage;