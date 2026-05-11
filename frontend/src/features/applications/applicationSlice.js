// src/features/applications/applicationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import applicationService from "./applicationService";

// ── fetchAllApplications — role ke hisaab se sahi endpoint call karo ──
// ✅ FIX: isCandidate flag check karo
// Candidate  → GET /applications/my
// Recruiter  → GET /applications/job/{jobId} ya GET /applications (admin)
export const fetchAllApplications = createAsyncThunk(
  "applications/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { isCandidate, ...restParams } = params;
      if (isCandidate) {
        // ✅ Candidate: apni applications
        return await applicationService.getMyApplications(restParams);
      } else {
        // ✅ Recruiter/Admin: all applications (recruiter ke liye job-wise filter hoga)
        return await applicationService.getAllApplications(restParams);
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch applications."
      );
    }
  }
);

// Recruiter — fetch applications by job
export const fetchApplicationsByJob = createAsyncThunk(
  "applications/fetchByJob",
  async (jobId, { rejectWithValue }) => {
    try {
      return await applicationService.getApplicationsByJob(jobId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job applications."
      );
    }
  }
);

export const submitApplication = createAsyncThunk(
  "applications/submit",
  async (applicationData, { rejectWithValue }) => {
    try {
      return await applicationService.submitApplication(applicationData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit application."
      );
    }
  }
);

// Candidate — withdraw application
export const withdrawApplication = createAsyncThunk(
  "applications/withdraw",
  async (id, { rejectWithValue }) => {
    try {
      await applicationService.withdrawApplication(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to withdraw application."
      );
    }
  }
);

// Recruiter — update application status
export const updateApplicationStatus = createAsyncThunk(
  "applications/updateStatus",
  async ({ id, status, note = "" }, { rejectWithValue }) => {
    try {
      return await applicationService.updateApplicationStatus(id, status, note);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update application status."
      );
    }
  }
);

// Recruiter — shortlist candidate
export const shortlistCandidate = createAsyncThunk(
  "applications/shortlist",
  async ({ id, note = "" }, { rejectWithValue }) => {
    try {
      return await applicationService.shortlistCandidate(id, note);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to shortlist candidate."
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────
const applicationSlice = createSlice({
  name: "applications",
  initialState: {
    list:             [],
    isLoading:        false,
    isSubmitting:     false,
    isWithdrawing:    false,
    isUpdatingStatus: false,
    error:            null,
    submitError:      null,
    successMessage:   null,
    filters: {
      search: "",
      status: "",
      jobId:  "",
    },
    pagination: {
      page:     1,
      pageSize: 10,
      total:    0,
    },
  },
  reducers: {
    setAppFilters: (state, action) => {
      state.filters         = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearAppFilters: (state) => {
      state.filters         = { search: "", status: "", jobId: "" };
      state.pagination.page = 1;
    },
    setAppPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearApplicationError: (state) => {
      state.error       = null;
      state.submitError = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchAllApplications.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchAllApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload   = action.payload;
        state.list      = Array.isArray(payload)
          ? payload
          : payload?.content || [];
        state.pagination.total =
          payload?.totalElements ?? state.list.length;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // fetchByJob
    builder
      .addCase(fetchApplicationsByJob.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchApplicationsByJob.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload   = action.payload;
        state.list      = Array.isArray(payload)
          ? payload
          : payload?.content || [];
        state.pagination.total =
          payload?.totalElements ?? state.list.length;
      })
      .addCase(fetchApplicationsByJob.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // submit
    builder
      .addCase(submitApplication.pending, (state) => {
        state.isSubmitting = true;
        state.submitError  = null;
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.isSubmitting   = false;
        state.successMessage = action.payload?.message || "Application submitted!";
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitError  = action.payload;
      });

    // withdraw
    builder
      .addCase(withdrawApplication.pending, (state) => {
        state.isWithdrawing = true;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.isWithdrawing = false;
        state.list = state.list.filter((a) => a.id !== action.payload);
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.isWithdrawing = false;
        state.error         = action.payload;
      });

    // updateStatus
    builder
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isUpdatingStatus = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isUpdatingStatus = false;
        const updated = action.payload;
        if (updated) {
          const idx = state.list.findIndex((a) => a.id === updated.id);
          if (idx !== -1) state.list[idx] = updated;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isUpdatingStatus = false;
        state.error            = action.payload;
      });

    // shortlist
    builder.addCase(shortlistCandidate.fulfilled, (state, action) => {
      const updated = action.payload;
      if (updated) {
        const idx = state.list.findIndex((a) => a.id === updated.id);
        if (idx !== -1) state.list[idx] = updated;
      }
    });
  },
});

export const {
  setAppFilters,
  clearAppFilters,
  setAppPagination,
  clearApplicationError,
  clearSuccessMessage,
} = applicationSlice.actions;

export const selectAllApplications        = (state) => state.applications.list;
export const selectApplicationsLoading    = (state) => state.applications.isLoading;
export const selectApplicationSubmitting  = (state) => state.applications.isSubmitting;
export const selectApplicationWithdrawing = (state) => state.applications.isWithdrawing;
export const selectApplicationUpdating    = (state) => state.applications.isUpdatingStatus;
export const selectApplicationError       = (state) => state.applications.submitError;
export const selectApplicationFilters     = (state) => state.applications.filters;
export const selectApplicationPagination  = (state) => state.applications.pagination;

export default applicationSlice.reducer;