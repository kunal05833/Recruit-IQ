// src/features/notifications/notificationService.js
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

const notificationService = {
  getAll: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
    return data.data;
  },

  // ✅ FIX: Use /recent endpoint for bell dropdown (lightweight)
  getRecent: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.RECENT);
    return data.data;
  },

  // ✅ FIX: Fetch real unread count from backend
  getUnreadCount: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    return data.data?.count ?? 0;
  },

  // ✅ FIX: Persist read state to backend
  markAsRead: async (id) => {
    await axiosInstance.put(`/notifications/${id}/read`);
  },

  // ✅ FIX: Persist mark-all-read to backend
  markAllAsRead: async () => {
    await axiosInstance.put("/notifications/read-all");
  },
};

export default notificationService;
