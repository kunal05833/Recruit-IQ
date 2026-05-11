// src/features/admin/adminService.js
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

const adminService = {
  getAllUsers: async (params = {}) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN.USERS, { params });
    return data.data;  // unwrap ApiResponse envelope
  },

  getUserById: async (id) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
    return data.data;
  },

  // PATCH /admin/users/:id/role
  updateUserRole: async (id, role) => {
    const { data } = await axiosInstance.patch(API_ENDPOINTS.ADMIN.USER_ROLE(id), { role });
    return data.data;
  },

  deleteUser: async (id) => {
    const { data } = await axiosInstance.delete(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
    return data.data;
  },
};

export default adminService;
