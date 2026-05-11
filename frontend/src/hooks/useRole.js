// src/hooks/useRole.js
import { useSelector } from "react-redux";
import { selectUserRole } from "../features/auth/authSlice";
import {
  isAdmin,
  isRecruiter,
  isCandidate,
  canCreateJob,
  canViewAdmin,
  canApplyForJob,
  canViewAllApplications,
} from "../utils/roleHelpers";

const useRole = () => {
  const role = useSelector(selectUserRole);

  return {
    role,
    isAdmin:     isAdmin(role),
    isRecruiter: isRecruiter(role),
    isCandidate: isCandidate(role),
    canCreateJob:   canCreateJob(role),
    canViewAdmin:   canViewAdmin(role),
    canApplyForJob: canApplyForJob(role),
    canViewAllApplications: canViewAllApplications(role),
  };
};

export default useRole;