// src/components/shared/RoleGuard.jsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserRole } from "../../features/auth/authSlice";
import { getDashboardRoute } from "../../utils/roleHelpers";

/**
 * RoleGuard
 * @param {string[]} allowedRoles - Array of allowed roles
 * @param {ReactNode} children
 * @param {string} redirectTo - Optional custom redirect path
 */
const RoleGuard = ({ allowedRoles = [], children, redirectTo }) => {
  const role = useSelector(selectUserRole);

  if (!role || !allowedRoles.includes(role)) {
    const fallback = redirectTo || getDashboardRoute(role);
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default RoleGuard;