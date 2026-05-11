// src/hooks/useAuth.js
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  selectAuth,
  selectIsAuthenticated,
  selectUserRole,
  selectAuthLoading,
  selectAuthError,
  logout,
  logoutUser,
} from "../features/auth/authSlice";
import { clearProfile } from "../redux/slices/userSlice";
import { getDashboardRoute } from "../utils/roleHelpers";
import toast from "react-hot-toast";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const auth            = useSelector(selectAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectUserRole);
  const isLoading       = useSelector(selectAuthLoading);
  const error           = useSelector(selectAuthError);

  // ✅ FIX #1: Call backend logout API before clearing state
  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearProfile());
    navigate("/auth/login", { replace: true });
    toast.success("You have been logged out.");
  };

  const redirectToDashboard = () => {
    const route = getDashboardRoute(role);
    navigate(route, { replace: true });
  };

  return {
    auth,
    isAuthenticated,
    role,
    isLoading,
    error,
    logout: handleLogout,
    redirectToDashboard,
  };
};

export default useAuth;
