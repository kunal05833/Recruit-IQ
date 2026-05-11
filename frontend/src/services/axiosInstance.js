// src/services/axiosInstance.js
import axios from "axios";
import envConfig from "../config/envConfig";
import { store } from "../redux/store";
import { logout, refreshAccessToken } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: envConfig.API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isAuthEndpoint = originalRequest.url?.includes("/auth/");
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const state = store.getState();
        const refreshToken = state.auth?.refreshToken;

        if (!refreshToken) throw new Error("No refresh token available");

        const result = await store.dispatch(refreshAccessToken(refreshToken));

        if (refreshAccessToken.fulfilled.match(result)) {
          const newToken = result.payload.accessToken;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        toast.error("Session expired. Please log in again.");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    handleAPIError(error);
    return Promise.reject(error);
  }
);

// ─── Error Handler ────────────────────────────────────────────
const handleAPIError = (error) => {
  if (error.config?.skipErrorToast) return;  // ← YAHI FIX HAI

  if (error.response) {
    const { status, data } = error.response;

    switch (status) {
      case 400:
        break;
      case 403:
        toast.error("You don't have permission to perform this action.");
        break;
      case 404:
        toast.error("The requested resource was not found.");
        break;
      case 500:
        toast.error("Server error. Please try again later.");
        break;
      default:
        if (data?.message) toast.error(data.message);
    }
  } else if (error.request) {
    toast.error("Network error. Please check your connection.");
  }
};

export default axiosInstance;