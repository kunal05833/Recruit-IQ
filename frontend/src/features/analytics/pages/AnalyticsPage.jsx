// src/features/analytics/pages/AnalyticsPage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users, Briefcase, FileText,
  TrendingUp, Download, Target,
} from "lucide-react";
import {
  fetchDashboardStats,
  fetchRecruiterStats,
  selectDashboardStats,
  selectAnalyticsLoading,
  selectLastFetched,
} from "../analyticsSlice";
import useRole from "../../../hooks/useRole";
import {
  generateMonthlyLabels,
  generateWeeklyLabels,
  generateHiringFunnelData,
  generateSkillsData,
  scaleToTotal,
} from "../../../utils/mockChartData";
import { formatNumber }      from "../../../utils/formatters";
import { CHART_COLORS }      from "../../../utils/chartConfig";
import PageHeader            from "../../../components/shared/PageHeader";
import Button                from "../../../components/ui/Button";
import MetricCard            from "../components/MetricCard";
import ChartCard             from "../components/ChartCard";
import LineChart             from "../components/LineChart";
import BarChart              from "../components/BarChart";
import DoughnutChart         from "../components/DoughnutChart";
import HiringFunnelChart     from "../components/HiringFunnelChart";
import SkillsDemandTable     from "../components/SkillsDemandTable";
import PerformanceKPIs       from "../components/PerformanceKPIs";
import AnalyticsFiltersBar   from "../components/AnalyticsFiltersBar";

const AnalyticsPage = () => {
  const dispatch    = useDispatch();
  const stats       = useSelector(selectDashboardStats);
  const isLoading   = useSelector(selectAnalyticsLoading);
  const lastFetched = useSelector(selectLastFetched);

  // ✅ FIX: Role check — recruiter aur candidate ke liye alag endpoints
  const { isCandidate, isAdmin } = useRole();

  const [timeRange, setTimeRange] = useState("6m");

  useEffect(() => {
    // ✅ FIX: Candidate/Admin → fetchDashboardStats  (GET /ai/analytics/dashboard)
    //         Recruiter       → fetchRecruiterStats  (GET /jobs/my-postings — allowed)
    // Pehle: hamesha fetchDashboardStats call hota tha → recruiter ke liye 403
    if (isCandidate || isAdmin) {
      dispatch(fetchDashboardStats());
    } else {
      // Recruiter
      dispatch(fetchRecruiterStats());
    }
  }, [dispatch, isCandidate, isAdmin]);

  const handleRefresh = () => {
    if (isCandidate || isAdmin) {
      dispatch(fetchDashboardStats());
    } else {
      dispatch(fetchRecruiterStats());
    }
  };

  // Chart data
  const rangeCount = { "7d": 7, "30d": 30, "3m": 3, "6m": 6, "1y": 12 }[timeRange] || 6;
  const useWeekly  = timeRange === "7d";
  const labels     = useWeekly
    ? generateWeeklyLabels()
    : generateMonthlyLabels(rangeCount);

  const appTrend  = scaleToTotal(stats.totalApplications, labels.length);
  const userGrowth = scaleToTotal(stats.totalUsers,       labels.length);
  const jobTrend  = scaleToTotal(stats.totalJobs,         labels.length);
  const hiredTrend = appTrend.map((v) => Math.floor(v * 0.12));

  const funnel         = generateHiringFunnelData(stats.totalApplications);
  const rawSkills      = generateSkillsData();
  const skillsForTable = rawSkills.labels.map((name, i) => ({
    name,
    count: rawSkills.values[i],
  }));

  const statusCounts = {
    pending:  Math.floor(stats.totalApplications * 0.45),
    reviewed: Math.floor(stats.totalApplications * 0.28),
    accepted: Math.floor(stats.totalApplications * 0.15),
    rejected: Math.floor(stats.totalApplications * 0.12),
  };

  const roleCounts = {
    candidate: Math.floor(stats.totalUsers * 0.72),
    recruiter: Math.floor(stats.totalUsers * 0.24),
    admin:     Math.floor(stats.totalUsers * 0.04),
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <PageHeader
        title="Analytics"
        subtitle="Deep insights into your hiring pipeline and system performance"
        breadcrumbs={[{ label: "Analytics" }]}
        actions={
          <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>
            Export Report
          </Button>
        }
      />

      {/* Time Range Filter */}
      <AnalyticsFiltersBar
        selectedRange={timeRange}
        onRangeChange={setTimeRange}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        lastFetched={lastFetched}
      />

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          change={12}
          changeLabel="vs last period"
          icon={<Users size={18} />}
          color="primary"
          loading={isLoading}
        />
        <MetricCard
          title="Active Jobs"
          value={formatNumber(stats.totalJobs)}
          change={8}
          changeLabel="vs last period"
          icon={<Briefcase size={18} />}
          color="success"
          loading={isLoading}
        />
        <MetricCard
          title="Applications"
          value={formatNumber(stats.totalApplications)}
          change={23}
          changeLabel="vs last period"
          icon={<FileText size={18} />}
          color="warning"
          loading={isLoading}
        />
        <MetricCard
          title="Hire Rate"
          value={
            stats.totalApplications > 0
              ? `${((funnel.hired / stats.totalApplications) * 100).toFixed(1)}%`
              : "0%"
          }
          change={2.4}
          changeLabel="vs last period"
          icon={<TrendingUp size={18} />}
          color="purple"
          loading={isLoading}
        />
      </div>

      {/* Performance KPIs */}
      <div>
        <h2 className="text-sm font-semibold text-surface-700 mb-3
                       flex items-center gap-2">
          <Target size={15} className="text-primary-500" />
          Performance Indicators
        </h2>
        <PerformanceKPIs loading={isLoading} />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Application vs Hire Trend"
          subtitle={`Volume over selected period (${labels.length} data points)`}
          loading={isLoading}
          className="lg:col-span-2"
        >
          <LineChart
            labels={labels}
            datasets={[
              {
                label:            "Applications",
                data:             appTrend,
                borderColor:      CHART_COLORS.primary.solid,
                backgroundColor:  CHART_COLORS.primary.light,
                borderWidth:      2.5,
                pointRadius:      4,
                pointHoverRadius: 6,
                fill:             true,
                tension:          0.4,
              },
              {
                label:            "Hired",
                data:             hiredTrend,
                borderColor:      CHART_COLORS.success.solid,
                backgroundColor:  CHART_COLORS.success.light,
                borderWidth:      2.5,
                pointRadius:      4,
                pointHoverRadius: 6,
                fill:             true,
                tension:          0.4,
              },
              {
                label:           "Jobs Posted",
                data:            jobTrend,
                borderColor:     CHART_COLORS.warning.solid,
                backgroundColor: "transparent",
                borderWidth:     2,
                borderDash:      [5, 5],
                pointRadius:     3,
                fill:            false,
                tension:         0.4,
              },
            ]}
            height={300}
          />
        </ChartCard>

        <ChartCard
          title="User Growth"
          subtitle="New registrations over time"
          loading={isLoading}
        >
          <BarChart
            labels={labels}
            datasets={[
              {
                label:           "New Users",
                data:            userGrowth,
                backgroundColor: labels.map((_, i) =>
                  i === labels.length - 1
                    ? CHART_COLORS.primary.solid
                    : CHART_COLORS.primary.light
                ),
                borderRadius:  6,
                borderSkipped: false,
              },
            ]}
            options={{ plugins: { legend: { display: false } } }}
          />
        </ChartCard>

        <ChartCard
          title="Application Status Breakdown"
          subtitle="Current status distribution"
          loading={isLoading}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="shrink-0">
              <DoughnutChart
                labels={["Pending", "Reviewed", "Accepted", "Rejected"]}
                values={Object.values(statusCounts)}
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
            </div>
            <div className="flex-1 space-y-3 w-full">
              {[
                { label: "Pending",  count: statusCounts.pending,  color: "bg-warning-500" },
                { label: "Reviewed", count: statusCounts.reviewed, color: "bg-indigo-500"  },
                { label: "Accepted", count: statusCounts.accepted, color: "bg-success-500" },
                { label: "Rejected", count: statusCounts.rejected, color: "bg-danger-500"  },
              ].map((item) => {
                const pct = stats.totalApplications > 0
                  ? Math.round((item.count / stats.totalApplications) * 100)
                  : 0;
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.color}`} />
                    <span className="text-xs text-surface-600 flex-1">{item.label}</span>
                    <span className="text-xs font-bold text-surface-900">
                      {formatNumber(item.count)}
                    </span>
                    <span className="text-xs text-surface-400 w-10 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ChartCard
          title="Hiring Funnel"
          subtitle="Full pipeline conversion"
          loading={isLoading}
          className="lg:col-span-2"
        >
          <HiringFunnelChart funnel={funnel} />
        </ChartCard>

        <ChartCard
          title="User Distribution"
          subtitle="By role type"
          loading={isLoading}
        >
          <DoughnutChart
            labels={["Candidates", "Recruiters", "Admins"]}
            values={Object.values(roleCounts)}
            colors={[
              CHART_COLORS.primary.solid,
              CHART_COLORS.success.solid,
              CHART_COLORS.purple.solid,
            ]}
            height={180}
            centerLabel={{ value: formatNumber(stats.totalUsers), label: "Users" }}
          />
          <div className="mt-4 space-y-2.5 pt-4 border-t border-surface-100">
            {[
              { label: "Candidates", count: roleCounts.candidate, color: "bg-primary-500" },
              { label: "Recruiters", count: roleCounts.recruiter, color: "bg-success-500" },
              { label: "Admins",     count: roleCounts.admin,     color: "bg-purple-500"  },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xs text-surface-600 flex-1">{item.label}</span>
                <span className="text-xs font-bold text-surface-900">
                  {formatNumber(item.count)}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Skills & AI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Top In-Demand Skills"
          subtitle="Based on job listings"
          loading={isLoading}
        >
          <SkillsDemandTable skills={skillsForTable} />
        </ChartCard>

        <ChartCard
          title="AI Match Score Distribution"
          subtitle="Candidate-job compatibility"
          loading={isLoading}
        >
          <BarChart
            labels={["< 50%", "50–64%", "65–74%", "75–84%", "85–94%", "95–100%"]}
            datasets={[
              {
                label:           "Candidates",
                data:            [8, 15, 22, 31, 18, 6],
                backgroundColor: [
                  CHART_COLORS.danger.solid,
                  CHART_COLORS.warning.solid,
                  CHART_COLORS.warning.solid,
                  CHART_COLORS.primary.solid,
                  CHART_COLORS.success.solid,
                  CHART_COLORS.success.solid,
                ],
                borderRadius:  6,
                borderSkipped: false,
              },
            ]}
            options={{
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  title: { display: true, text: "Number of Matches",
                           color: "#94a3b8", font: { size: 11 } },
                },
              },
            }}
          />
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-surface-100">
            {[
              { label: "Avg Score",    value: "74%" },
              { label: "High Matches", value: "24%" },
              { label: "Perfect Fits", value: "6%"  },
            ].map((s) => (
              <div key={s.label} className="text-center p-2 bg-surface-50 rounded-xl">
                <p className="text-base font-bold text-surface-900">{s.value}</p>
                <p className="text-2xs text-surface-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;