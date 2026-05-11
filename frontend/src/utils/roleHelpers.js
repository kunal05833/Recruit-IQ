// src/utils/roleHelpers.js
import { ROLES } from "./constants";

export const isAdmin     = (role) => role === ROLES.ADMIN;
export const isRecruiter = (role) => role === ROLES.RECRUITER;
export const isCandidate = (role) => role === ROLES.CANDIDATE;

export const canCreateJob   = (role) => [ROLES.ADMIN, ROLES.RECRUITER].includes(role);
export const canViewAdmin   = (role) => role === ROLES.ADMIN;
export const canApplyForJob = (role) => role === ROLES.CANDIDATE;
export const canViewAllApplications = (role) => [ROLES.ADMIN, ROLES.RECRUITER].includes(role);

export const getRoleBadgeColor = (role) => {
  const map = {
    ADMIN:     "bg-primary-100 text-primary-700",
    RECRUITER: "bg-success-50 text-success-700",
    CANDIDATE: "bg-warning-50 text-warning-700",
  };
  return map[role] || "bg-surface-100 text-surface-600";
};

export const getDashboardRoute = (role) => {
  const map = {
    ADMIN:     "/admin",
    RECRUITER: "/dashboard/recruiter",
    CANDIDATE: "/dashboard/candidate",
  };
  return map[role] || "/dashboard";
};