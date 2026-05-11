// src/features/applications/applicationService.js
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

const applicationService = {

  // ✅ FIX: CANDIDATE — apni applications (GET /applications/my)
  // Pehle getAllApplications bhi yahi call karta tha — recruiter ke liye 403 aata tha
  getMyApplications: async (params = {}) => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.APPLICATIONS.MY,
      { params }
    );
    return data.data;
  },

  // ✅ FIX: RECRUITER/ADMIN — sab applications (GET /applications/job/{jobId} ya BY_JOB)
  // jobId filter ho to specific job ki applications, nahi ho to recruiter ke saare jobs
  getAllApplications: async (params = {}) => {
    const { jobId, ...restParams } = params;

    if (jobId) {
      // Specific job ki applications
      const { data } = await axiosInstance.get(
        API_ENDPOINTS.APPLICATIONS.BY_JOB(jobId),
        { params: restParams }
      );
      return data.data;
    }

    // Koi jobId nahi — recruiter ke saare jobs ki applications
    // Backend endpoint: GET /applications (admin/recruiter)
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.APPLICATIONS.BASE ?? "/applications",
      { params: restParams }
    );
    return data.data;
  },

  // Recruiter: get applications for a specific job
  getApplicationsByJob: async (jobId) => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.APPLICATIONS.BY_JOB(jobId)
    );
    return data.data;
  },

  // Candidate: submit application
  submitApplication: async (applicationData) => {
    const { data } = await axiosInstance.post(
      API_ENDPOINTS.APPLICATIONS.APPLY,
      applicationData
    );
    return data.data;
  },

  // Candidate: withdraw application
  withdrawApplication: async (id) => {
    const { data } = await axiosInstance.delete(
      API_ENDPOINTS.APPLICATIONS.WITHDRAW(id)
    );
    return data.data;
  },

  // Recruiter: update application status
  updateApplicationStatus: async (id, status, note = "") => {
    const { data } = await axiosInstance.put(
      API_ENDPOINTS.APPLICATIONS.STATUS(id),
      { status, recruiterNote: note }
    );
    return data.data;
  },

  // Recruiter: shortlist candidate
  shortlistCandidate: async (id, note = "") => {
    const { data } = await axiosInstance.put(
      API_ENDPOINTS.APPLICATIONS.SHORTLIST(id),
      null,
      { params: { note } }
    );
    return data.data;
  },

  // Recruiter: get shortlisted candidates for a job
  getShortlisted: async (jobId, page = 0, size = 20) => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.APPLICATIONS.SHORTLISTED(jobId),
      { params: { page, size } }
    );
    return data.data;
  },

  // Recruiter: get application stats for a job
  getStats: async (jobId) => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.APPLICATIONS.STATS(jobId)
    );
    return data.data;
  },
};

export default applicationService;