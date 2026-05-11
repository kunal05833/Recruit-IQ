// src/utils/constants.js
export const ROLES = {
  ADMIN:     "ADMIN",
  RECRUITER: "RECRUITER",
  CANDIDATE: "CANDIDATE",
};

export const ROLE_LABELS = {
  ADMIN:     "Admin",
  RECRUITER: "Recruiter",
  CANDIDATE: "Candidate",
};

export const APP_NAME = "Recruit-IQ";

export const PAGINATION = {
  DEFAULT_PAGE:      1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50],
};

export const STATUS = {
  PENDING:  "PENDING",
  REVIEWED: "REVIEWED",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

export const STATUS_COLORS = {
  PENDING:  { bg: "bg-warning-50",  text: "text-warning-600",  dot: "bg-warning-500"  },
  REVIEWED: { bg: "bg-info-50",     text: "text-info-600",     dot: "bg-info-500"     },
  ACCEPTED: { bg: "bg-success-50",  text: "text-success-600",  dot: "bg-success-500"  },
  REJECTED: { bg: "bg-danger-50",   text: "text-danger-600",   dot: "bg-danger-500"   },
};

export const ROUTES = {
  // Auth
  LOGIN:          "/auth/login",
  SIGNUP:         "/auth/signup",
  // Common
  DASHBOARD:      "/dashboard",
  PROFILE:        "/profile",
  NOTIFICATIONS:  "/notifications",
  // Admin
  ADMIN:          "/admin",
  ADMIN_USERS:    "/admin/users",
  // Jobs
  JOBS:           "/jobs",
  JOB_CREATE:     "/jobs/create",
  JOB_DETAIL:     (id = ":id") => `/jobs/${id}`,
  // Candidates
  CANDIDATES:     "/candidates",
  CANDIDATE_DETAIL: (id = ":id") => `/candidates/${id}`,
  // Applications
  APPLICATIONS:   "/applications",
  // Analytics
  ANALYTICS:      "/analytics",
};