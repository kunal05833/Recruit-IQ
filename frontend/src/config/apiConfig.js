// src/config/apiConfig.js
const API_ENDPOINTS = {
  // ── Auth ──────────────────────────────────────────────────────
  AUTH: {
    LOGIN:           "/auth/login",
    SIGNUP:          "/auth/register",
    REFRESH:         "/auth/refresh",
    LOGOUT:          "/auth/logout",
    CHANGE_PASSWORD: "/auth/change-password",
  },

  // ── User Profile ──────────────────────────────────────────────
  USERS: {
    PROFILE: "/profile/me",
    CONFIRM: "/profile/confirm",
  },

  // ── Profile ───────────────────────────────────────────────────
  PROFILE: {
    ME:      "/profile/me",
    CONFIRM: "/profile/confirm",
  },

  // ── Candidates ────────────────────────────────────────────────
  CANDIDATES: {
    BASE:       "/candidates",
    BY_ID:      (id)     => `/candidates/${id}`,
    BY_USER_ID: (userId) => `/candidates/user/${userId}`,
  },

  // ── Jobs ──────────────────────────────────────────────────────
  JOBS: {
    BASE:        "/jobs",
    BY_ID:       (id)    => `/jobs/${id}`,
    SEARCH:      "/jobs/search",
    FILTER:      "/jobs/filter",
    MY_POSTINGS: "/jobs/my-postings",
    MATCH:       (jobId) => `/ai/match/${jobId}`,
    RANKING:     (jobId) => `/ai/match/job/${jobId}/ranking`,
  },

  // ── Applications ──────────────────────────────────────────────
  APPLICATIONS: {
    BASE:        "/applications",
    APPLY:       "/applications/apply",
    MY:          "/applications/my",
    WITHDRAW:    (id)    => `/applications/${id}/withdraw`,
    BY_JOB:      (jobId) => `/applications/job/${jobId}`,
    SHORTLISTED: (jobId) => `/applications/job/${jobId}/shortlisted`,
    STATS:       (jobId) => `/applications/job/${jobId}/stats`,
    STATUS:      (id)    => `/applications/${id}/status`,
    SHORTLIST:   (id)    => `/applications/${id}/shortlist`,
  },

  // ── Notifications ─────────────────────────────────────────────
  NOTIFICATIONS: {
    BASE:         "/notifications",
    RECENT:       "/notifications/recent",
    UNREAD_COUNT: "/notifications/unread-count",
    READ:         (id)   => `/notifications/${id}/read`,
    READ_ALL:     "/notifications/read-all",
  },

  // ── Analytics ─────────────────────────────────────────────────
  ANALYTICS: {
    DASHBOARD:   "/ai/analytics/dashboard",
    JOB_RANKING: (jobId) => `/ai/analytics/job/${jobId}/ranking`,
  },

  // ── AI ────────────────────────────────────────────────────────
  AI: {
    INTERVIEW_GENERATE:    (jobId) => `/ai/interview/generate/${jobId}`,
    INTERVIEW_QUESTIONS:   (jobId) => `/ai/interview/questions/${jobId}`,
    INTERVIEW_ANSWER:      "/ai/interview/answer",
    ANALYTICS_DASHBOARD:   "/ai/analytics/dashboard",
    ANALYTICS_JOB_RANKING: (jobId) => `/ai/analytics/job/${jobId}/ranking`,
    MATCH_JOB:             (jobId) => `/ai/match/${jobId}`,
    MATCH_RANKING:         (jobId) => `/ai/match/job/${jobId}/ranking`,
  },

  // ── Resume ────────────────────────────────────────────────────
  RESUME: {
    UPLOAD:   "/resume/upload",
    EXISTS:   (candidateId) => `/resume/exists/${candidateId}`,
    DOWNLOAD: (candidateId) => `/resume/download/${candidateId}`,
    VIEW:     (candidateId) => `/resume/view/${candidateId}`,
  },

  // ── Admin ─────────────────────────────────────────────────────
  ADMIN: {
    USERS:      "/admin/users",
    USER_BY_ID: (id) => `/admin/users/${id}`,
    USER_ROLE:  (id) => `/admin/users/${id}/role`,
  },
};

export default API_ENDPOINTS;