// src/routes/routeConfig.js
import { ROLES } from "../utils/constants";

export const ROUTE_CONFIG = {
  // Public routes
  AUTH: {
    path:    "/auth",
    children: {
      LOGIN:  { path: "login"  },
      SIGNUP: { path: "signup" },
    },
  },

  // Protected routes
  ADMIN: {
    path:         "/admin",
    allowedRoles: [ROLES.ADMIN],
    children: {
      USERS:     { path: "users"     },
      ANALYTICS: { path: "analytics" },
    },
  },

  RECRUITER: {
    path:         "/dashboard/recruiter",
    allowedRoles: [ROLES.RECRUITER, ROLES.ADMIN],
  },

  CANDIDATE: {
    path:         "/dashboard/candidate",
    allowedRoles: [ROLES.CANDIDATE],
  },

  JOBS: {
    path:         "/jobs",
    allowedRoles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.CANDIDATE],
    children: {
      CREATE: { path: "create",  allowedRoles: [ROLES.ADMIN, ROLES.RECRUITER] },
      DETAIL: { path: ":id"   },
    },
  },

  CANDIDATES: {
    path:         "/candidates",
    allowedRoles: [ROLES.ADMIN, ROLES.RECRUITER],
    children: {
      DETAIL: { path: ":id" },
    },
  },

  APPLICATIONS: {
    path:         "/applications",
    allowedRoles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.CANDIDATE],
  },

  NOTIFICATIONS: {
    path:         "/notifications",
    allowedRoles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.CANDIDATE],
  },

  PROFILE: {
    path:         "/profile",
    allowedRoles: [ROLES.ADMIN, ROLES.RECRUITER, ROLES.CANDIDATE],
  },
};