// src/features/analytics/pages/CandidateDashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, FileText, Star,
  ArrowRight, Search, Bell,
  CheckCircle, Clock, XCircle,
  TrendingUp, Eye,
} from "lucide-react";
import {
  fetchAllJobs,
  selectAllJobs,
  selectJobsLoading,
} from "../../jobs/jobSlice";
import {
  fetchAllApplications,
  selectAllApplications,
  selectApplicationsLoading,
} from "../../applications/applicationSlice";
import {
  selectUserProfile,
} from "../../../redux/slices/userSlice";
import {
  generateMonthlyLabels,
  scaleToTotal,
} from "../../../utils/mockChartData";
import { formatDate, formatNumber, truncate } from "../../../utils/formatters";
import { CHART_COLORS } from "../../../utils/chartConfig";

import PageHeader  from "../../../components/shared/PageHeader";
import StatsCard   from "../../../components/shared/StatsCard";
import Button      from "../../../components/ui/Button";
import Badge       from "../../../components/ui/Badge";
import ChartCard   from "../components/ChartCard";
import LineChart   from "../components/LineChart";
import DoughnutChart from "../components/DoughnutChart";
import EmptyState  from "../../../components/ui/EmptyState";
import Skeleton    from "../../../components/ui/Skeleton";
import Avatar      from "../../../components/ui/Avatar";

const CandidateDashboard = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const profile   = useSelector(selectUserProfile);
  const jobs      = useSelector(selectAllJobs);
  const apps      = useSelector(selectAllApplications);
  const jobsLoad  = useSelector(selectJobsLoading);
  const appsLoad  = useSelector(selectApplicationsLoading);

  useEffect(() => {
    dispatch(fetchAllJobs());
    // ✅ FIX: isCandidate: true pass karo — GET /applications/my endpoint hit hoga
    // Pehle bina flag ke call ho raha tha → recruiter endpoint → 403
    dispatch(fetchAllApplications({ isCandidate: true }));
  }, [dispatch]);

  // ── Derived data ────────────────────────────────────────────
  const totalApps     = apps.length;
  const pendingApps   = apps.filter((a) => ["APPLIED", "UNDER_REVIEW"].includes(a.status)).length;
  const acceptedApps  = apps.filter((a) => ["SHORTLISTED", "HIRED"].includes(a.status)).length;
  const rejectedApps  = apps.filter((a) => a.status === "REJECTED").length;

  const monthLabels   = generateMonthlyLabels(6);
  const appActivity   = scaleToTotal(totalApps, 6);
  const recentJobs    = jobs.slice(0, 6);
  const myApps        = apps.slice(0, 5);
  const isLoading     = jobsLoad || appsLoad;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── Welcome Banner ───────────────────────────────── */}
      <WelcomeBanner
        name={profile?.name}
        greeting={greeting()}
        totalJobs={jobs.length}
        navigate={navigate}
      />

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Jobs Available"
          value={formatNumber(jobs.length)}
          icon={<Briefcase size={18} />}
          color="primary"
          subtitle="Browse & apply"
          loading={isLoading}
        />
        <StatsCard
          title="My Applications"
          value={formatNumber(totalApps)}
          icon={<FileText size={18} />}
          color="warning"
          subtitle="Total submitted"
          loading={isLoading}
        />
        <StatsCard
          title="Under Review"
          value={formatNumber(pendingApps)}
          icon={<Clock size={18} />}
          color="info"
          subtitle="Awaiting response"
          loading={isLoading}
        />
        <StatsCard
          title="Accepted"
          value={formatNumber(acceptedApps)}
          icon={<CheckCircle size={18} />}
          color="success"
          subtitle="Offers received"
          loading={isLoading}
        />
      </div>

      {/* ── Charts ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Application Activity */}
        <ChartCard
          title="Application Activity"
          subtitle="Your 6-month activity"
          loading={isLoading}
          className="lg:col-span-2"
        >
          <LineChart
            labels={monthLabels}
            datasets={[
              {
                label:            "Applications Sent",
                data:             appActivity,
                borderColor:      CHART_COLORS.primary.solid,
                backgroundColor:  CHART_COLORS.primary.light,
                borderWidth:      2.5,
                pointRadius:      4,
                pointHoverRadius: 6,
                fill:             true,
                tension:          0.4,
              },
            ]}
          />
        </ChartCard>

        {/* Application Status Breakdown */}
        <ChartCard
          title="My Applications"
          subtitle="Status breakdown"
          loading={isLoading}
        >
          {totalApps === 0 ? (
            <EmptyState
              icon="📊"
              title="No data yet"
              description="Apply to jobs to see your stats"
              compact
            />
          ) : (
            <DoughnutChart
              labels={["Pending", "Accepted", "Rejected"]}
              values={[pendingApps, acceptedApps, rejectedApps]}
              colors={[
                CHART_COLORS.warning.solid,
                CHART_COLORS.success.solid,
                CHART_COLORS.danger.solid,
              ]}
              height={190}
              centerLabel={{
                value: formatNumber(totalApps),
                label: "Applied",
              }}
            />
          )}
        </ChartCard>
      </div>

      {/* ── Job Recommendations & My Applications ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recommended Jobs */}
        <RecommendedJobsCard
          jobs={recentJobs}
          isLoading={jobsLoad}
          navigate={navigate}
        />

        {/* My Applications */}
        <MyApplicationsCard
          applications={myApps}
          isLoading={appsLoad}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

// ─── Welcome Banner ───────────────────────────────────────────
const WelcomeBanner = ({ name, greeting, totalJobs, navigate }) => (
  <div className="relative overflow-hidden rounded-2xl
                  bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800
                  p-6 sm:p-8">
    {/* Pattern */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 20px 20px,
                          white 1.5px, transparent 0)`,
        backgroundSize: "40px 40px",
      }}
    />
    <div className="absolute -right-8 -top-8 w-48 h-48 bg-white/10
                    rounded-full blur-2xl" />
    <div className="absolute -right-4 bottom-0 w-32 h-32 bg-primary-400/20
                    rounded-full blur-xl" />

    {/* Content */}
    <div className="relative z-10 flex flex-col sm:flex-row items-start
                    sm:items-center justify-between gap-4">
      <div className="space-y-1.5">
        <p className="text-primary-200 text-sm font-medium">
          {greeting} 👋
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {name || "Welcome back!"}
        </h2>
        <p className="text-primary-200 text-sm">
          <span className="text-white font-semibold">{totalJobs}</span>{" "}
          new job opportunities available for you today
        </p>
      </div>
      <Button
        variant="secondary"
        size="md"
        leftIcon={<Search size={15} />}
        onClick={() => navigate("/jobs")}
        className="shrink-0 bg-white text-primary-700 hover:bg-primary-50
                   border-0 shadow-soft-md"
      >
        Browse Jobs
      </Button>
    </div>
  </div>
);

// ─── Recommended Jobs Card ────────────────────────────────────
const RecommendedJobsCard = ({ jobs, isLoading, navigate }) => (
  <div className="card">
    <div className="flex items-center justify-between px-5 py-4
                    border-b border-surface-100">
      <div>
        <h3 className="text-sm font-semibold text-surface-800">
          Recommended Jobs
        </h3>
        <p className="text-xs text-surface-500 mt-0.5">
          Matched to your profile
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        rightIcon={<ArrowRight size={13} />}
        onClick={() => navigate("/jobs")}
      >
        View all
      </Button>
    </div>

    <div className="divide-y divide-surface-50">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
        ))
      ) : jobs.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No jobs available"
          description="Check back later for new opportunities"
          compact
        />
      ) : (
        jobs.map((job) => (
          <JobItem
            key={job.id}
            job={job}
            navigate={navigate}
          />
        ))
      )}
    </div>
  </div>
);

// ─── Job Item ─────────────────────────────────────────────────
const JobItem = ({ job, navigate }) => (
  <div className="flex items-center gap-3 px-5 py-3.5
                  hover:bg-surface-50 transition-colors group">
    {/* Icon */}
    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center
                    justify-center shrink-0">
      <Briefcase size={15} className="text-primary-500" />
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-surface-800 truncate">
        {job.title}
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-xs text-surface-500">
          {job.experienceRequired}y exp
        </span>
        {job.skills?.slice(0, 2).map((skill) => (
          <span
            key={skill}
            className="text-2xs bg-primary-50 text-primary-600
                       px-1.5 py-0.5 rounded-md font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>

    {/* Action */}
    <Button
      size="sm"
      variant="outline"
      onClick={() => navigate(`/jobs/${job.id}`)}
      className="shrink-0 text-xs"
    >
      Apply
    </Button>
  </div>
);

// ─── My Applications Card ─────────────────────────────────────
const MyApplicationsCard = ({ applications, isLoading, navigate }) => {
  const STATUS_CONFIG = {
    PENDING:  { variant: "warning", label: "Pending",  icon: <Clock size={12} />         },
    REVIEWED: { variant: "info",    label: "Reviewed", icon: <Eye size={12} />            },
    ACCEPTED: { variant: "success", label: "Accepted", icon: <CheckCircle size={12} />   },
    REJECTED: { variant: "danger",  label: "Rejected", icon: <XCircle size={12} />       },
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between px-5 py-4
                      border-b border-surface-100">
        <div>
          <h3 className="text-sm font-semibold text-surface-800">
            My Applications
          </h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Track your application status
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          rightIcon={<ArrowRight size={13} />}
          onClick={() => navigate("/applications")}
        >
          View all
        </Button>
      </div>

      <div className="divide-y divide-surface-50">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          ))
        ) : applications.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No applications yet"
            description="Start applying to jobs to track your progress"
            compact
            action={
              <Button
                size="sm"
                onClick={() => navigate("/jobs")}
              >
                Browse Jobs
              </Button>
            }
          />
        ) : (
          applications.map((app, index) => {
            const status = STATUS_CONFIG[app.status?.toUpperCase()] ||
                           STATUS_CONFIG.PENDING;
            return (
              <div
                key={app.id || index}
                className="flex items-center gap-3 px-5 py-3.5"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-100
                                flex items-center justify-center shrink-0">
                  <Briefcase size={14} className="text-surface-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-800 truncate">
                    {app.jobTitle || `Job #${app.jobId}`}
                  </p>
                  <p className="text-xs text-surface-500">
                    Applied {formatDate(app.appliedAt || app.createdAt)}
                  </p>
                </div>
                <Badge variant={status.variant} dot size="sm">
                  {status.label}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;