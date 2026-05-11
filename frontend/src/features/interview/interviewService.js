// src/features/interview/interviewService.js — NEW FILE
// ✅ FIX #3: AI Interview feature — backend has full implementation, frontend had 0%
import axiosInstance from "../../services/axiosInstance";

const interviewService = {
  // Generate 5 AI questions for a job (CANDIDATE only)
  generateQuestions: async (jobId) => {
    const { data } = await axiosInstance.post(`/ai/interview/generate/${jobId}`);
    return data.data;
  },

  // Fetch existing questions for a job
  getQuestions: async (jobId) => {
    const { data } = await axiosInstance.get(`/ai/interview/questions/${jobId}`);
    return data.data;
  },

  // Submit answer for AI evaluation
  submitAnswer: async (questionId, answer) => {
    const { data } = await axiosInstance.post("/ai/interview/answer", {
      questionId, answer,
    });
    return data.data; // { score, confidenceScore, communicationScore, feedback }
  },
};

export default interviewService;
