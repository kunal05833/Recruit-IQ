// src/features/auth/authService.js
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

const authService = {
  login: async (credentials) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return data.data;
  },

  signup: async (userData) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
    return data.data;
  },

  refresh: async (refreshToken) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return data.data;
  },

  // ✅ FIX #7: Change password — backend endpoint existed but had no service method
  changePassword: async ({ oldPassword, newPassword, confirmPassword }) => {
    const { data } = await axiosInstance.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword, newPassword, confirmPassword,
    });
    return data;
  },
};

export default authService;
