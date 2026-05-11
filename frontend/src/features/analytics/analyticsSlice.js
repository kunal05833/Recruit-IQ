// src/features/analytics/analyticsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

// ── CANDIDATE only — do NOT call from recruiter pages ─────────
export const fetchDashboardStats = createAsyncThunk(
  "analytics/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.ANALYTICS.DASHBOARD);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analytics."
      );
    }
  }
);

// ── RECRUITER stats — only uses endpoints recruiters can access ─
export const fetchRecruiterStats = createAsyncThunk(
  "analytics/fetchRecruiterStats",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ FIX: Only call /jobs (allowed for RECRUITER)
      // /applications/my is CANDIDATE-only → removed
      const jobs = await axiosInstance.get(
        `${API_ENDPOINTS.JOBS.MY_POSTINGS}`,
        { skipErrorToast: true }
      );

      const totalJobs = Array.isArray(jobs.data?.data)
        ? jobs.data.data.length
        : (jobs.data?.data?.totalElements ?? 0);

      return {
        totalJobs,
        totalApplications: 0, // Loaded per-job on Applications page
        totalUsers:        0, // Admin only
      };
    } catch {
      // Fallback — jobs endpoint bhi fail ho to 0 dikhao
      return {
        totalJobs:         0,
        totalApplications: 0,
        totalUsers:        0,
      };
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    dashboard: {
      totalUsers:        0,
      totalJobs:         0,
      totalApplications: 0,
    },
    isLoading:   false,
    lastFetched: null,
    error:       null,
  },
  reducers: {
    clearAnalyticsError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // Candidate dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading   = false;
        state.dashboard   = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // Recruiter dashboard stats
    builder
      .addCase(fetchRecruiterStats.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchRecruiterStats.fulfilled, (state, action) => {
        state.isLoading   = false;
        state.dashboard   = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchRecruiterStats.rejected, (state) => {
        state.isLoading = false;
        state.error     = null;
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;

export const selectDashboardStats   = (state) => state.analytics.dashboard;
export const selectAnalyticsLoading = (state) => state.analytics.isLoading;
export const selectLastFetched      = (state) => state.analytics.lastFetched;

export default analyticsSlice.reducer;