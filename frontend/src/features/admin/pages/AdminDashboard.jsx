// src/features/admin/pages/AdminDashboard.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate }              from "react-router-dom";
import {
  Users, Briefcase, FileText, TrendingUp,
  ShieldCheck, Plus, ArrowRight, Activity,
  UserCheck, BarChart3,
} from "lucide-react";
import {
  fetchDashboardStats,
  selectDashboardStats,
  selectAnalyticsLoading,
} from "../../analytics/analyticsSlice";
import {
  fetchAllUsers,
  selectAllUsers,
  selectAdminLoading,
} from "../adminSlice";
import {
  generateMonthlyLabels,
  generateApplicationTrend,
  generateHiringFunnelData,
  generateSkillsData,
  scaleToTotal,
} from "../../../utils/mockChartData";
import { formatNumber } from "../../../utils/formatters";
import { CHART_COLORS } from "../../../utils/chartConfig";

import PageHeader    from "../../../components/shared/PageHeader";
import StatsCard     from "../../../components/shared/StatsCard";
import Button        from "../../../components/ui/Button";
import Badge         from "../../../components/ui/Badge";
import Avatar        from "../../../components/ui/Avatar";
import Skeleton      from "../../../components/ui/Skeleton";
import UserRoleBadge from "../components/UserRoleBadge";
import ChartCard     from "../../analytics/components/ChartCard";
import LineChart     from "../../analytics/components/LineChart";
import BarChart      from "../../analytics/components/BarChart";
import DoughnutChart from "../../analytics/components/DoughnutChart";

const AdminDashboard = () => {
  const dispatch     = useDispatch();
  const navigate     = useNavigate();
  const stats        = useSelector(selectDashboardStats);
  const users        = useSelector(selectAllUsers);
  const statsLoading = useSelector(selectAnalyticsLoading);
  const usersLoading = useSelector(selectAdminLoading);

  const isLoading = statsLoading || usersLoading;

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAllUsers({ size: 5 }));
  }, [dispatch]);

  // ── Chart data ───────────────────────────────────────────────
  const monthLabels = generateMonthlyLabels(6);
  const appTrend    = generateApplicationTrend(stats.totalApplications);
  const funnel      = generateHiringFunnelData(stats.totalApplications);
  const skills      = generateSkillsData();
  const userGrowth  = scaleToTotal(stats.totalUsers, 6);

  // Role distribution
  const adminCount     = users.filter((u) => u.role === "ADMIN").length;
  const recruiterCount = users.filter((u) => u.role === "RECRUITER").length;
  const candidateCount = users.filter((u) => u.role === "CANDIDATE").length;

  const recentUsers = users.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── Header ───────────────────────────────────────── */}
      <PageHeader
        title="Admin Dashboard"
        subtitle="System-wide overview, analytics, and management"
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Users size={14} />}
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => navigate("/jobs/create")}
            >
              Post Job
            </Button>
          </>
        }
      />

      {/* ── Stats ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          icon={<Users size={18} />}
          color="primary"
          trend="up"
          trendValue="+12%"
          subtitle="vs last month"
          loading={isLoading}
        />
        <StatsCard
          title="Active Jobs"
          value={formatNumber(stats.totalJobs)}
          icon={<Briefcase size={18} />}
          color="success"
          trend="up"
          trendValue="+8%"
          subtitle="vs last month"
          loading={isLoading}
        />
        <StatsCard
          title="Applications"
          value={formatNumber(stats.totalApplications)}
          icon={<FileText size={18} />}
          color="warning"
          trend="up"
          trendValue="+23%"
          subtitle="vs last month"
          loading={isLoading}
        />
        <StatsCard
          title="Hire Rate"
          value={
            stats.totalApplications > 0
              ? `${((funnel.hired / stats.totalApplications) * 100).toFixed(1)}%`
              : "0%"
          }
          icon={<TrendingUp size={18} />}
          color="info"
          trend="up"
          trendValue="+2.4%"
          loading={isLoading}
        />
      </div>

      {/* ── Charts Row 1 ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title="Application Trend"
          subtitle="6-month volume"
          loading={isLoading}
          className="lg:col-span-2"
        >
          <LineChart
            labels={monthLabels}
            datasets={[
              {
                label:            "Applications",
                data:             appTrend,
                borderColor:      CHART_COLORS.primary.solid,
                backgroundColor:  CHART_COLORS.primary.light,
                borderWidth:      2.5,
                pointRadius:      4,
                fill:             true,
                tension:          0.4,
              },
              {
                label:            "Hired",
                data:             appTrend.map((v) => Math.floor(v * 0.12)),
                borderColor:      CHART_COLORS.success.solid,
                backgroundColor:  CHART_COLORS.success.light,
                borderWidth:      2.5,
                pointRadius:      4,
                fill:             true,
                tension:          0.4,
              },
            ]}
          />
        </ChartCard>

        <ChartCard
          title="User Roles"
          subtitle="Distribution breakdown"
          loading={isLoading}
        >
          <DoughnutChart
            labels={["Candidates", "Recruiters", "Admins"]}
            values={[candidateCount, recruiterCount, adminCount]}
            colors={[
              CHART_COLORS.primary.solid,
              CHART_COLORS.success.solid,
              CHART_COLORS.purple.solid,
            ]}
            height={200}
            centerLabel={{
              value: formatNumber(stats.totalUsers),
              label: "Total Users",
            }}
          />
        </ChartCard>
      </div>

      {/* ── Charts Row 2 ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="User Growth"
          subtitle="Monthly registrations"
          loading={isLoading}
        >
          <BarChart
            labels={monthLabels}
            datasets={[
              {
                label:           "New Users",
                data:            userGrowth,
                backgroundColor: CHART_COLORS.primary.solid,
                borderRadius:    6,
                borderSkipped:   false,
              },
            ]}
            options={{ plugins: { legend: { display: false } } }}
          />
        </ChartCard>

        <ChartCard
          title="Top Skills in Demand"
          subtitle="Across all job postings"
          loading={isLoading}
        >
          <BarChart
            labels={skills.labels}
            datasets={[
              {
                label:           "Jobs",
                data:            skills.values,
                backgroundColor: CHART_COLORS.indigo.solid,
                borderRadius:    6,
                borderSkipped:   false,
              },
            ]}
            options={{
              indexAxis: "y",
              plugins:   { legend: { display: false } },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { display: false } },
              },
            }}
          />
        </ChartCard>
      </div>

      {/* ── Bottom Row ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Users */}
        <RecentUsersCard
          users={recentUsers}
          isLoading={usersLoading}
          navigate={navigate}
        />

        {/* Quick Actions */}
        <QuickActionsCard navigate={navigate} />
      </div>
    </div>
  );
};

// ─── Recent Users Card ────────────────────────────────────────
const RecentUsersCard = ({ users, isLoading, navigate }) => (
  <div className="card">
    <div className="flex items-center justify-between px-5 py-4
                    border-b border-surface-100">
      <h3 className="text-sm font-semibold text-surface-800">
        Recent Users
      </h3>
      <Button
        variant="ghost"
        size="sm"
        rightIcon={<ArrowRight size={13} />}
        onClick={() => navigate("/admin/users")}
      >
        View all
      </Button>
    </div>
    <div className="divide-y divide-surface-50">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))
      ) : users.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-surface-500">No users yet</p>
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 px-5 py-3.5
                       hover:bg-surface-50 transition-colors"
          >
            <Avatar name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800 truncate">
                {user.name}
              </p>
              <p className="text-xs text-surface-500 truncate">
                {user.email}
              </p>
            </div>
            <UserRoleBadge role={user.role} />
          </div>
        ))
      )}
    </div>
  </div>
);

// ─── Quick Actions Card ───────────────────────────────────────
const QuickActionsCard = ({ navigate }) => {
  const actions = [
    {
      label:       "Manage Users",
      description: "View, edit, or remove system users",
      icon:        <ShieldCheck size={18} />,
      color:       "bg-primary-50 text-primary-600",
      path:        "/admin/users",
    },
    {
      label:       "Post a Job",
      description: "Create a new job listing",
      icon:        <Plus size={18} />,
      color:       "bg-success-50 text-success-600",
      path:        "/jobs/create",
    },
    {
      label:       "View Candidates",
      description: "Browse and manage candidate pool",
      icon:        <UserCheck size={18} />,
      color:       "bg-warning-50 text-warning-600",
      path:        "/candidates",
    },
    {
      label:       "Analytics",
      description: "Deep-dive into hiring reports",
      icon:        <BarChart3 size={18} />,
      color:       "bg-purple-50 text-purple-600",
      path:        "/analytics",
    },
  ];

  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-surface-800 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action) => (
          <button
            key={action.path}
            onClick={() => navigate(action.path)}
            className="flex items-start gap-3 p-4 rounded-xl border border-surface-200
                       hover:border-primary-200 hover:bg-primary-50/30
                       transition-all duration-150 text-left group"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center
                             justify-center shrink-0 ${action.color}`}>
              {action.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-800
                            group-hover:text-primary-700 transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-surface-500 mt-0.5 leading-snug">
                {action.description}
              </p>
            </div>
            <ArrowRight
              size={14}
              className="text-surface-300 group-hover:text-primary-500
                         group-hover:translate-x-0.5 transition-all mt-1 shrink-0"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;