// src/features/admin/components/AdminSystemStats.jsx
import {
  Users, Briefcase, FileText,
  TrendingUp, Shield, UserCheck,
} from "lucide-react";
import StatsCard from "../../../components/shared/StatsCard";
import { formatNumber } from "../../../utils/formatters";

const AdminSystemStats = ({
  users        = [],
  dashStats    = {},
  isLoading    = false,
}) => {
  // Derive from user list
  const adminCount     = users.filter((u) => u.role === "ADMIN").length;
  const recruiterCount = users.filter((u) => u.role === "RECRUITER").length;
  const candidateCount = users.filter((u) => u.role === "CANDIDATE").length;
  const totalUsers     = users.length || dashStats.totalUsers || 0;

  const stats = [
    {
      title:      "Total Users",
      value:      formatNumber(totalUsers),
      icon:       <Users size={18} />,
      color:      "primary",
      trend:      "up",
      trendValue: `${candidateCount} candidates`,
      subtitle:   "registered",
    },
    {
      title:      "Total Jobs",
      value:      formatNumber(dashStats.totalJobs || 0),
      icon:       <Briefcase size={18} />,
      color:      "success",
      trend:      "up",
      trendValue: "Active listings",
      subtitle:   "in system",
    },
    {
      title:      "Applications",
      value:      formatNumber(dashStats.totalApplications || 0),
      icon:       <FileText size={18} />,
      color:      "warning",
      trend:      "up",
      trendValue: "All time",
      subtitle:   "submitted",
    },
    {
      title:      "Admins",
      value:      formatNumber(adminCount),
      icon:       <Shield size={18} />,
      color:      "danger",
      subtitle:   `${recruiterCount} recruiters`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatsCard
          key={stat.title}
          {...stat}
          loading={isLoading}
        />
      ))}
    </div>
  );
};

export default AdminSystemStats;