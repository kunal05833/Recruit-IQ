// src/features/analytics/analyticsService.js
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

const analyticsService = {
  getDashboardStats: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
    return data.data;  // ✅ FIX #5: was returning data (full ApiResponse), now returns data.data
  },
};

export default analyticsService;
