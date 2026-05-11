// src/components/layout/Navbar.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, LogOut, User, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { logout, selectUserRole, selectAuth } from "../../features/auth/authSlice";
import {
  fetchUserProfile,
  selectUserProfile,
  clearProfile,
} from "../../redux/slices/userSlice";
import { ROLES } from "../../utils/constants";
import NotificationBell from "../shared/NotificationBell";
import Avatar   from "../ui/Avatar";
import Dropdown from "../ui/Dropdown";
import Badge    from "../ui/Badge";
import toast    from "react-hot-toast";

const getPageTitle = (pathname) => {
  const map = {
    "/admin":               "Admin Dashboard",
    "/admin/users":         "Manage Users",
    "/dashboard/recruiter": "Recruiter Dashboard",
    "/dashboard/candidate": "Candidate Dashboard",
    "/jobs":                "Jobs",
    "/jobs/create":         "Create Job",
    "/candidates":          "Candidates",
    "/applications":        "Applications",
    "/analytics":           "Analytics",
    "/notifications":       "Notifications",
    "/profile":             "Profile",
  };
  if (pathname.startsWith("/jobs/"))       return "Job Details";
  if (pathname.startsWith("/candidates/")) return "Candidate Profile";
  return map[pathname] || "Dashboard";
};

const Navbar = ({ onMobileMenuOpen, collapsed }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const profile   = useSelector(selectUserProfile);
  const role      = useSelector(selectUserRole);
  const auth      = useSelector(selectAuth);          // ← ADD
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    if (role === ROLES.CANDIDATE && !profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile, role]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearProfile());
    toast.success("Logged out successfully.");
    navigate("/auth/login", { replace: true });
  };

  const userMenuItems = [
    { type: "label", label: "My Account" },
    {
      label:   "View Profile",
      icon:    <User size={15} />,
      onClick: () => navigate("/profile"),
    },
    { type: "divider" },
    {
      label:   "Sign out",
      icon:    <LogOut size={15} />,
      danger:  true,
      onClick: handleLogout,
    },
  ];

  const ROLE_CONFIG = {
    [ROLES.ADMIN]:     { label: "Admin",     variant: "primary" },
    [ROLES.RECRUITER]: { label: "Recruiter", variant: "success" },
    [ROLES.CANDIDATE]: { label: "Candidate", variant: "warning" },
  };

  const roleConfig = ROLE_CONFIG[role] || { label: role, variant: "default" };

  // ── Display name fallback chain ───────────────────────────
  // 1. Candidate profile name (after resume upload)
  // 2. Auth user name (from login response)
  // 3. Email se pehla part (abc@gmail.com → "abc")
  // 4. Role label as last resort
  const displayName =
    profile?.name ||
    auth?.user?.name ||
    auth?.user?.email?.split("@")[0] ||
    roleConfig.label;                               // ← "Loading..." HATA DIYA

  return (
    <header
      className={clsx(
        "fixed top-0 right-0 z-30 h-16",
        "bg-white/90 backdrop-blur-sm",
        "border-b border-surface-200",
        "flex items-center px-4 sm:px-6",
        "transition-all duration-300",
        collapsed ? "left-[68px]" : "left-0 lg:left-64"
      )}
    >
      {/* ── Left ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMobileMenuOpen}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center
                     text-surface-500 hover:bg-surface-100 hover:text-surface-700
                     transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-surface-900 truncate">
            {pageTitle}
          </h2>
        </div>
      </div>

      {/* ── Right ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <NotificationBell />
        <div className="w-px h-5 bg-surface-200 mx-1" />

        <Dropdown
          align="right"
          items={userMenuItems}
          trigger={
            <button
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl
                         hover:bg-surface-100 transition-colors group"
            >
              <Avatar name={displayName} size="sm" />
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-sm font-semibold text-surface-800
                                 group-hover:text-surface-900 leading-tight
                                 max-w-[120px] truncate">
                  {displayName}
                </span>
                <Badge variant={roleConfig.variant} size="sm">
                  {roleConfig.label}
                </Badge>
              </div>
              <ChevronDown
                size={14}
                className="text-surface-400 group-hover:text-surface-600
                           hidden sm:block"
              />
            </button>
          }
        />
      </div>
    </header>
  );
};

export default Navbar;