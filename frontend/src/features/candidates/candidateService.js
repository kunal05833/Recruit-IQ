// src/features/candidates/candidateService.js
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

const candidateService = {
  getAllCandidates: async (params = {}) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.CANDIDATES.BASE, { params });
    return data.data;  // unwrap ApiResponse envelope
  },

  getCandidateById: async (id) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.CANDIDATES.BY_ID(id));
    return data.data;
  },

  getCandidateByUserId: async (userId) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.CANDIDATES.BY_USER_ID(userId));
    return data.data;
  },
};

export default candidateService;
