// src/services/resumeService.js
import axiosInstance from "./axiosInstance";

const resumeService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosInstance.post("/resume/upload", formData, {
      skipErrorToast: true,
      transformRequest: (data, headers) => {
        delete headers["Content-Type"]; // ← JSON header hata — axios FormData boundary khud set karega
        return data;
      },
    });
    return data.data;
  },

confirmProfile: async (profileData) => {
  const { data } = await axiosInstance.post("/profile/confirm", profileData);

  return data.data || data.profile || data.candidate || data || null;
},

  checkExists: async (candidateId) => {
    const { data } = await axiosInstance.get(
      `/resume/exists/${candidateId}`,
      { skipErrorToast: true }
    );
    return data.data?.exists || false;
  },

  getDownloadUrl: (candidateId) =>
    `${import.meta.env.VITE_API_BASE_URL}/resume/download/${candidateId}`,

  getViewUrl: (candidateId) =>
    `${import.meta.env.VITE_API_BASE_URL}/resume/view/${candidateId}`,
};

export default resumeService;