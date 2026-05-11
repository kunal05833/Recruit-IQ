// src/components/shared/Breadcrumb.jsx
import { Link, useLocation }  from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import clsx from "clsx";

// Auto-generate breadcrumbs from path
const generateCrumbs = (pathname) => {
  const LABELS = {
    admin:        "Admin",
    users:        "Users",
    dashboard:    "Dashboard",
    recruiter:    "Recruiter",
    candidate:    "Candidate",
    jobs:         "Jobs",
    create:       "Create",
    candidates:   "Candidates",
    applications: "Applications",
    analytics:    "Analytics",
    notifications:"Notifications",
    profile:      "Profile",
  };

  const parts = pathname.split("/").filter(Boolean);

  return parts.map((part, index) => {
    const path  = "/" + parts.slice(0, index + 1).join("/");
    const label = LABELS[part] || (
      /^\d+$/.test(part) ? `#${part}` : part
    );
    const isLast = index === parts.length - 1;

    return { label, path, isLast };
  });
};

const Breadcrumb = ({ crumbs, className }) => {
  const { pathname } = useLocation();
  const items = crumbs || generateCrumbs(pathname);

  if (items.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx("flex items-center gap-1.5", className)}
    >
      {/* Home */}
      <Link
        to="/"
        className="text-surface-400 hover:text-surface-600 transition-colors"
      >
        <Home size={13} />
      </Link>

      {items.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-1.5">
          <ChevronRight size={12} className="text-surface-300" />
          {crumb.isLast ? (
            <span className="text-xs text-surface-500 font-medium">
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className="text-xs text-surface-500 hover:text-surface-700
                         font-medium transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;