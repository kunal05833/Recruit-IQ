// src/features/admin/components/AdminRoleFilter.jsx
import clsx from "clsx";
import { Shield, Briefcase, User, Users } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "",          label: "All Users",  icon: <Users      size={13} /> },
  { value: "ADMIN",     label: "Admins",     icon: <Shield     size={13} /> },
  { value: "RECRUITER", label: "Recruiters", icon: <Briefcase  size={13} /> },
  { value: "CANDIDATE", label: "Candidates", icon: <User       size={13} /> },
];

const ROLE_ACTIVE_CLASSES = {
  "":          "bg-surface-900 text-white border-surface-900",
  ADMIN:       "bg-primary-600 text-white border-primary-600",
  RECRUITER:   "bg-success-600 text-white border-success-600",
  CANDIDATE:   "bg-warning-500 text-white border-warning-500",
};

const AdminRoleFilter = ({
  selectedRole,
  onRoleChange,
  userCounts = {},
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {ROLE_OPTIONS.map((option) => {
        const isActive = selectedRole === option.value;
        const count    = option.value
          ? userCounts[option.value] || 0
          : Object.values(userCounts).reduce((a, b) => a + b, 0);

        return (
          <button
            key={option.value}
            onClick={() => onRoleChange(option.value)}
            className={clsx(
              "inline-flex items-center gap-2 px-3.5 py-2",
              "rounded-xl text-xs font-semibold border",
              "transition-all duration-150",
              isActive
                ? ROLE_ACTIVE_CLASSES[option.value]
                : "bg-white text-surface-600 border-surface-200 hover:border-surface-300 hover:bg-surface-50"
            )}
          >
            {option.icon}
            {option.label}
            {count > 0 && (
              <span
                className={clsx(
                  "px-1.5 py-0.5 rounded-full text-2xs font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-surface-100 text-surface-600"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AdminRoleFilter;