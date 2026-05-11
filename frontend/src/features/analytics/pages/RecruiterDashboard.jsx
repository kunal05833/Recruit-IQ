// src/features/analytics/pages/RecruiterDashboard.jsx
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, FileText, Users,
  TrendingUp, Plus, ArrowRight,
} from "lucide-react";
import {
  fetchRecruiterStats,
  selectDashboardStats,
  selectAnalyticsLoading,
} from "../analyticsSlice";
import { fetchAllJobs, selectAllJobs } from "../../jobs/jobSlice";
import {
  generateMonthlyLabels,
  generateApplicationTrend,
  generateHiringFunnelData,
  generateWeeklyLabels,
  scaleToTotal,
} from "../../../utils/mockChartData";
import { formatNumber } from "../../../utils/formatters";
import { CHART_COLORS } from "../../../utils/chartConfig";

import PageHeader    from "../../../components/shared/PageHeader";
import StatsCard     from "../../../components/shared/StatsCard";
import Button        from "../../../components/ui/Button";
import Badge         from "../../../components/ui/Badge";
import ChartCard     from "../components/ChartCard";
import LineChart     from "../components/LineChart";
import BarChart      from "../components/BarChart";
import DoughnutChart from "../components/DoughnutChart";
import EmptyState    from "../../../components/ui/EmptyState";
import Skeleton      from "../../../components/ui/Skeleton";

const RecruiterDashboard = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const stats     = useSelector(selectDashboardStats);
  const jobs      = useSelector(selectAllJobs);
  const isLoading = useSelector(selectAnalyticsLoading);

  useEffect(() => {
    dispatch(fetchRecruiterStats());
    dispatch(fetchAllJobs());
    // NOTE: fetchAllApplications removed — Recruiter uses /applications/job/:id
    // not /applications/my (which is CANDIDATE only)
  }, [dispatch]);

  // ── Derived chart data ──────────────────────────────────────
  // ✅ FIX #8: Memoize chart data — prevents flickering on re-render
  const monthLabels = useMemo(() => generateMonthlyLabels(6), []);
  const weekLabels  = useMemo(() => generateWeeklyLabels(), []);
  const appTrend    = useMemo(() => generateApplicationTrend(stats.totalApplications), [stats.totalApplications]);
  const weeklyApps  = useMemo(() => scaleToTotal(stats.totalApplications, 7), [stats.totalApplications]);
  const funnel      = useMemo(() => generateHiringFunnelData(stats.totalApplications), [stats.totalApplications]);

  // Application status breakdown
  const statusData = {
    pending:  Math.floor(stats.totalApplications * 0.45),
    reviewed: Math.floor(stats.totalApplications * 0.28),
    accepted: Math.floor(stats.totalApplications * 0.15),
    rejected: Math.floor(stats.totalApplications * 0.12),
  };

  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── Header ───────────────────────────────────────── */}
      <PageHeader
        title="Recruiter Dashboard"
        subtitle="Track your hiring pipeline and candidate activity"
        actions={
          <Button
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => navigate("/jobs/create")}
          >
            Post New Job
          </Button>
        }
      />

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Active Jobs"
          value={formatNumber(stats.totalJobs)}
          icon={<Briefcase size={18} />}
          color="primary"
          trend="up"
          trendValue="+3 this week"
          loading={isLoading}
        />
        <StatsCard
          title="Total Applications"
          value={formatNumber(stats.totalApplications)}
          icon={<FileText size={18} />}
          color="warning"
          trend="up"
          trendValue="+18 today"
          loading={isLoading}
        />
        <StatsCard
          title="Candidates Pool"
          value={formatNumber(stats.totalUsers)}
          icon={<Users size={18} />}
          color="success"
          trend="up"
          trendValue="+5%"
          subtitle="vs last month"
          loading={isLoading}
        />
        <StatsCard
          title="Acceptance Rate"
          value={
            stats.totalApplications > 0
              ? `${((statusData.accepted / stats.totalApplications) * 100).toFixed(1)}%`
              : "0%"
          }
          icon={<TrendingUp size={18} />}
          color="info"
          trend="up"
          trendValue="+1.2%"
          loading={isLoading}
        />
      </div>

      {/* ── Charts Row 1 ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Activity */}
        <ChartCard
          title="This Week's Activity"
          subtitle="Daily application volume"
          loading={isLoading}
          className="lg:col-span-2"
        >
          <BarChart
            labels={weekLabels}
            datasets={[
              {
                label:           "Applications",
                data:            weeklyApps,
                backgroundColor: CHART_COLORS.primary.solid,
                borderRadius:    6,
                borderSkipped:   false,
              },
            ]}
            options={{ plugins: { legend: { display: false } } }}
          />
        </ChartCard>

        {/* Application Status */}
        <ChartCard
          title="Application Status"
          subtitle="Current breakdown"
          loading={isLoading}
        >
          <DoughnutChart
            labels={["Pending", "Reviewed", "Accepted", "Rejected"]}
            values={Object.values(statusData)}
            colors={[
              CHART_COLORS.warning.solid,
              CHART_COLORS.indigo.solid,
              CHART_COLORS.success.solid,
              CHART_COLORS.danger.solid,
            ]}
            height={200}
            centerLabel={{
              value: formatNumber(stats.totalApplications),
              label: "Total",
            }}
          />
        </ChartCard>
      </div>

      {/* ── Charts Row 2 ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Application Trend */}
        <ChartCard
          title="Application Trend"
          subtitle="6-month overview"
          loading={isLoading}
        >
          <LineChart
            labels={monthLabels}
            datasets={[
              {
                label:           "Applications",
                data:            appTrend,
                borderColor:     CHART_COLORS.primary.solid,
                backgroundColor: CHART_COLORS.primary.light,
                borderWidth:     2.5,
                pointRadius:     4,
                fill:            true,
                tension:         0.4,
              },
            ]}
          />
        </ChartCard>

        {/* Hiring Funnel */}
        <ChartCard
          title="Hiring Funnel"
          subtitle="Stage-by-stage progression"
          loading={isLoading}
        >
          <FunnelDisplay funnel={funnel} />
        </ChartCard>
      </div>

      {/* ── Recent Jobs ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4">
        <RecentJobsCard
          jobs={recentJobs}
          isLoading={isLoading}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

// ─── Hiring Funnel Visual ─────────────────────────────────────
const FunnelDisplay = ({ funnel }) => {
  const stages = [
    { label: "Applied",     value: funnel.applied,   color: "bg-primary-500", pct: 100 },
    { label: "Reviewed",    value: funnel.reviewed,  color: "bg-indigo-500",  pct: Math.round((funnel.reviewed  / funnel.applied) * 100) || 0 },
    { label: "Shortlisted", value: funnel.shortlist, color: "bg-warning-500", pct: Math.round((funnel.shortlist / funnel.applied) * 100) || 0 },
    { label: "Hired",       value: funnel.hired,     color: "bg-success-500", pct: Math.round((funnel.hired     / funnel.applied) * 100) || 0 },
  ];

  return (
    <div className="space-y-3 pt-2">
      {stages.map((stage) => (
        <div key={stage.label} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-surface-700">
              {stage.label}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-surface-900">
                {formatNumber(stage.value)}
              </span>
              <span className="text-2xs text-surface-400 w-8 text-right">
                {stage.pct}%
              </span>
            </div>
          </div>
          <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${stage.color}`}
              style={{ width: `${stage.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Recent Jobs Card ─────────────────────────────────────────
const RecentJobsCard = ({ jobs, isLoading, navigate }) => (
  <div className="card">
    <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
      <h3 className="text-sm font-semibold text-surface-800">Recent Jobs</h3>
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
            <Skeleton className="w-8 h-8 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))
      ) : jobs.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No jobs yet"
          description="Post your first job to get started"
          compact
          action={
            <Button size="sm" onClick={() => navigate("/jobs/create")}>
              Post Job
            </Button>
          }
        />
      ) : (
        jobs.map((job) => (
          <button
            key={job.id}
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="w-full flex items-center gap-3 px-5 py-3.5
                       hover:bg-surface-50 transition-colors text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center
                            justify-center shrink-0">
              <Briefcase size={14} className="text-primary-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800 truncate
                            group-hover:text-primary-700 transition-colors">
                {job.title}
              </p>
              <p className="text-xs text-surface-500">
                {job.experienceRequired}y exp •{" "}
                {job.skills?.slice(0, 2).join(", ")}
                {job.skills?.length > 2 && " ..."}
              </p>
            </div>
            <ArrowRight
              size={14}
              className="text-surface-300 group-hover:text-primary-500
                         group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </button>
        ))
      )}
    </div>
  </div>
);

export default RecruiterDashboard;