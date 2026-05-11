// src/features/admin/components/UserRoleBadge.jsx
import clsx from "clsx";
import { Shield, Briefcase, User } from "lucide-react";

const ROLE_CONFIG = {
  ADMIN: {
    label:  "Admin",
    bg:     "bg-primary-50",
    text:   "text-primary-700",
    border: "border-primary-200",
    icon:   <Shield   size={11} />,
  },
  RECRUITER: {
    label:  "Recruiter",
    bg:     "bg-success-50",
    text:   "text-success-700",
    border: "border-success-200",
    icon:   <Briefcase size={11} />,
  },
  CANDIDATE: {
    label:  "Candidate",
    bg:     "bg-warning-50",
    text:   "text-warning-700",
    border: "border-warning-200",
    icon:   <User     size={11} />,
  },
};

const UserRoleBadge = ({ role, className }) => {
  const config =
    ROLE_CONFIG[(role || "").toUpperCase()] || {
      label:  role || "Unknown",
      bg:     "bg-surface-100",
      text:   "text-surface-600",
      border: "border-surface-200",
      icon:   <User size={11} />,
    };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-0.5",
        "text-xs font-medium rounded-full border",
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default UserRoleBadge;