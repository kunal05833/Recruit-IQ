// src/features/jobs/jobService.js
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

// ─── Helper: Convert skills array → comma-separated string ───
// Backend JobRequest.requiredSkills expects String, not Array
const formatJobData = (jobData) => ({
  ...jobData,
  requiredSkills: Array.isArray(jobData.requiredSkills)
    ? jobData.requiredSkills.join(", ")   // ["React", "Java"] → "React, Java"
    : jobData.requiredSkills,
});

const jobService = {
  getAllJobs: async (params = {}) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.JOBS.BASE, { params });
    return data.data;
  },

  getJobById: async (id) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.JOBS.BY_ID(id));
    return data.data;
  },

  searchJobs: async (keyword, page = 0, size = 10) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.JOBS.SEARCH, {
      params: { keyword, page, size },
    });
    return data.data;
  },

  filterJobs: async (location, jobType, page = 0, size = 10) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.JOBS.FILTER, {
      params: { location, jobType, page, size },
    });
    return data.data;
  },

  // ✅ FIX: requiredSkills array → comma-separated string
  createJob: async (jobData) => {
    const { data } = await axiosInstance.post(
      API_ENDPOINTS.JOBS.BASE,
      formatJobData(jobData)
    );
    return data.data;
  },

  // ✅ FIX: requiredSkills array → comma-separated string
  updateJob: async (id, jobData) => {
    const { data } = await axiosInstance.put(
      API_ENDPOINTS.JOBS.BY_ID(id),
      formatJobData(jobData)
    );
    return data.data;
  },

  deleteJob: async (id) => {
    const { data } = await axiosInstance.delete(API_ENDPOINTS.JOBS.BY_ID(id));
    return data.data;
  },

  getMyPostings: async () => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.JOBS.MY_POSTINGS);
    return data.data;
  },

  // POST — backend requires POST for AI matching
  getJobMatches: async (jobId) => {
    const { data } = await axiosInstance.post(API_ENDPOINTS.JOBS.MATCH(jobId));
    return data.data;
  },

  getJobRanking: async (jobId) => {
    const { data } = await axiosInstance.get(API_ENDPOINTS.JOBS.RANKING(jobId));
    return data.data;
  },
};

export default jobService;