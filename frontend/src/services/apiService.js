// src/services/apiService.js
import axiosInstance from "./axiosInstance";
import API_ENDPOINTS from "../config/apiConfig";

/**
 * Centralized API service — all responses unwrap ApiResponse envelope (.data.data)
 */
const apiService = {
  // ── Auth ──────────────────────────────────────────────────────
  auth: {
    login:   (data)         => axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN,   data),
    signup:  (data)         => axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP,  data),
    refresh: (refreshToken) => axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }),
  },

  // ── User Profile ──────────────────────────────────────────────
  users: {
    getProfile: () => axiosInstance.get(API_ENDPOINTS.USERS.PROFILE),
  },

  // ── Candidates ────────────────────────────────────────────────
  candidates: {
    getAll:        (params)  => axiosInstance.get(API_ENDPOINTS.CANDIDATES.BASE, { params }),
    getById:       (id)      => axiosInstance.get(API_ENDPOINTS.CANDIDATES.BY_ID(id)),
    getByUserId:   (userId)  => axiosInstance.get(API_ENDPOINTS.CANDIDATES.BY_USER_ID(userId)),
  },

  // ── Jobs ──────────────────────────────────────────────────────
  jobs: {
    getAll:     (params) => axiosInstance.get(API_ENDPOINTS.JOBS.BASE, { params }),
    getById:    (id)     => axiosInstance.get(API_ENDPOINTS.JOBS.BY_ID(id)),
    create:     (data)   => axiosInstance.post(API_ENDPOINTS.JOBS.BASE, data),
    getMatches: (jobId)  => axiosInstance.post(API_ENDPOINTS.JOBS.MATCH(jobId)),  // POST
    getRanking: (jobId)  => axiosInstance.get(API_ENDPOINTS.JOBS.RANKING(jobId)),
  },

  // ── Applications ──────────────────────────────────────────────
  applications: {
    getMy:         (params) => axiosInstance.get(API_ENDPOINTS.APPLICATIONS.MY, { params }),
    getByJob:      (jobId)  => axiosInstance.get(API_ENDPOINTS.APPLICATIONS.BY_JOB(jobId)),
    getShortlisted:(jobId)  => axiosInstance.get(API_ENDPOINTS.APPLICATIONS.SHORTLISTED(jobId)),
    getStats:      (jobId)  => axiosInstance.get(API_ENDPOINTS.APPLICATIONS.STATS(jobId)),
    submit:        (data)   => axiosInstance.post(API_ENDPOINTS.APPLICATIONS.APPLY, data),
    withdraw:      (id)     => axiosInstance.delete(API_ENDPOINTS.APPLICATIONS.WITHDRAW(id)),
  },

  // ── Notifications ─────────────────────────────────────────────
  notifications: {
    getAll: () => axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.BASE),
  },

  // ── Analytics ─────────────────────────────────────────────────
  analytics: {
    getDashboard: () => axiosInstance.get(API_ENDPOINTS.ANALYTICS.DASHBOARD),
  },

  // ── Admin ─────────────────────────────────────────────────────
  admin: {
    getUsers:       (params) => axiosInstance.get(API_ENDPOINTS.ADMIN.USERS, { params }),
    getUserById:    (id)     => axiosInstance.get(API_ENDPOINTS.ADMIN.USER_BY_ID(id)),
    updateUserRole: (id, role) => axiosInstance.patch(API_ENDPOINTS.ADMIN.USER_ROLE(id), { role }),
    deleteUser:     (id)     => axiosInstance.delete(API_ENDPOINTS.ADMIN.USER_BY_ID(id)),
  },
};

export default apiService;
