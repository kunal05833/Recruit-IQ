// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import {
  LayoutDashboard, Users, Briefcase, FileText,
  BarChart3, Bell, ChevronLeft, ChevronRight,
  Sparkles, ShieldCheck,
} from "lucide-react";
import { selectUserRole, selectAuth } from "../../features/auth/authSlice"; // ← selectAuth ADD
import { selectUserProfile } from "../../redux/slices/userSlice";
import { ROLES, APP_NAME } from "../../utils/constants";
import Avatar  from "../ui/Avatar";
import Badge   from "../ui/Badge";
import Tooltip from "../ui/Tooltip";

// ─── Navigation Config ────────────────────────────────────────
const buildNavItems = (role) => {
  const base = [];

  if (role === ROLES.ADMIN) {
    base.push(
      { type: "label", label: "Overview" },
      { label: "Dashboard",    icon: <LayoutDashboard size={18} />, path: "/admin",       exact: true },
      { label: "Manage Users", icon: <ShieldCheck size={18} />,     path: "/admin/users" },
      { type: "label", label: "Recruitment" },
      { label: "Jobs",         icon: <Briefcase size={18} />,       path: "/jobs" },
      { label: "Candidates",   icon: <Users size={18} />,           path: "/candidates" },
      { label: "Applications", icon: <FileText size={18} />,        path: "/applications" },
      { type: "label", label: "Insights" },
      { label: "Analytics",    icon: <BarChart3 size={18} />,       path: "/analytics" },
      { label: "Notifications",icon: <Bell size={18} />,            path: "/notifications" },
    );
  }

  if (role === ROLES.RECRUITER) {
    base.push(
      { type: "label", label: "Overview" },
      { label: "Dashboard",    icon: <LayoutDashboard size={18} />, path: "/dashboard/recruiter", exact: true },
      { type: "label", label: "Recruitment" },
      { label: "Jobs",         icon: <Briefcase size={18} />,       path: "/jobs" },
      { label: "Candidates",   icon: <Users size={18} />,           path: "/candidates" },
      { label: "Applications", icon: <FileText size={18} />,        path: "/applications" },
      { type: "label", label: "Insights" },
      { label: "Analytics",    icon: <BarChart3 size={18} />,       path: "/analytics" },
      { label: "Notifications",icon: <Bell size={18} />,            path: "/notifications" },
    );
  }

  if (role === ROLES.CANDIDATE) {
    base.push(
      { type: "label", label: "Overview" },
      { label: "Dashboard",      icon: <LayoutDashboard size={18} />, path: "/dashboard/candidate", exact: true },
      { type: "label", label: "Opportunities" },
      { label: "Browse Jobs",    icon: <Briefcase size={18} />,       path: "/jobs" },
      { label: "My Applications",icon: <FileText size={18} />,        path: "/applications" },
      { type: "label", label: "Account" },
      { label: "Notifications",  icon: <Bell size={18} />,            path: "/notifications" },
    );
  }

  return base;
};

// ─── Sidebar ──────────────────────────────────────────────────
const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const role     = useSelector(selectUserRole);
  const profile  = useSelector(selectUserProfile);
  const auth     = useSelector(selectAuth);           // ← ADD
  const navItems = buildNavItems(role);

  // ── Display name fallback chain ───────────────────────────
  const displayName =
    profile?.name ||
    auth?.user?.name ||
    auth?.user?.email?.split("@")[0] ||
    roleLabel(role);                                  // ← "Loading..." HATA DIYA

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-surface-900/40 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={clsx(
          "fixed left-0 top-0 z-40 h-full",
          "bg-white border-r border-surface-200",
          "flex flex-col",
          "transition-all duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-64",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* ── Logo ───────────────────────────────────────── */}
        <div className={clsx(
          "flex items-center h-16 shrink-0 border-b border-surface-100",
          collapsed ? "px-4 justify-center" : "px-5"
        )}>
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center
                          justify-center shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="ml-2.5 flex-1 min-w-0 animate-fade-in">
              <span className="text-base font-bold text-surface-900 tracking-tight">
                {APP_NAME}
              </span>
            </div>
          )}
        </div>

        {/* ── Navigation ─────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto no-scrollbar py-4 px-3">
          {navItems.map((item, index) => {
            if (item.type === "label") {
              if (collapsed) return null;
              return (
                <p key={index} className="px-3 pt-5 pb-1.5 text-2xs font-semibold
                                          text-surface-400 uppercase tracking-widest
                                          first:pt-1 animate-fade-in">
                  {item.label}
                </p>
              );
            }
            return (
              <SidebarLink
                key={item.path}
                item={item}
                collapsed={collapsed}
                onMobileClose={onMobileClose}
              />
            );
          })}
        </nav>

        {/* ── User Profile ───────────────────────────────── */}
        <div className={clsx(
          "shrink-0 border-t border-surface-100",
          collapsed ? "p-3" : "p-4"
        )}>
          <NavLink
            to="/profile"
            className={({ isActive }) => clsx(
              "flex items-center gap-3 rounded-xl p-2 transition-colors",
              isActive ? "bg-primary-50" : "hover:bg-surface-50"
            )}
          >
            <Avatar name={displayName} size="sm" className="shrink-0" />
            {!collapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-semibold text-surface-800 truncate">
                  {displayName}                       {/* ← "Loading..." NAHI */}
                </p>
                <RoleBadge role={role} />
              </div>
            )}
          </NavLink>
        </div>

        {/* ── Collapse Toggle ─────────────────────────────── */}
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-20
                     w-6 h-6 bg-white border border-surface-200
                     rounded-full items-center justify-center
                     text-surface-500 hover:text-surface-700
                     hover:bg-surface-50 shadow-soft-sm
                     transition-all duration-150 z-50"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>
    </>
  );
};

// ─── Sidebar Link ─────────────────────────────────────────────
const SidebarLink = ({ item, collapsed, onMobileClose }) => {
  const location = useLocation();
  const isActive = item.exact
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path);

  const linkContent = (
    <NavLink
      to={item.path}
      onClick={onMobileClose}
      className={clsx(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
        "transition-all duration-150 mb-0.5 group",
        isActive
          ? "bg-primary-50 text-primary-700"
          : "text-surface-600 hover:bg-surface-50 hover:text-surface-900",
        collapsed && "justify-center px-2"
      )}
    >
      <span className={clsx(
        "shrink-0 transition-colors",
        isActive ? "text-primary-600" : "text-surface-400 group-hover:text-surface-600"
      )}>
        {item.icon}
      </span>
      {!collapsed && (
        <span className="flex-1 truncate animate-fade-in">{item.label}</span>
      )}
      {!collapsed && isActive && (
        <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
      )}
    </NavLink>
  );

  if (collapsed) {
    return <Tooltip content={item.label} position="right">{linkContent}</Tooltip>;
  }
  return linkContent;
};

// ─── Role Badge ───────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const config = {
    ADMIN:     { label: "Admin",     variant: "primary" },
    RECRUITER: { label: "Recruiter", variant: "success" },
    CANDIDATE: { label: "Candidate", variant: "warning" },
  };
  const { label, variant } = config[role] || { label: role, variant: "default" };
  return <Badge variant={variant} size="sm">{label}</Badge>;
};

// ─── Helper ───────────────────────────────────────────────────
const roleLabel = (role) => {
  const map = { ADMIN: "Admin", RECRUITER: "Recruiter", CANDIDATE: "Candidate" };
  return map[role] || "User";
};

export default Sidebar;