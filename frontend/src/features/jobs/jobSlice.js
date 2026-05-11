// src/features/jobs/jobSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import jobService from "./jobService";

// ─── Async Thunks ─────────────────────────────────────────────
export const fetchAllJobs = createAsyncThunk(
  "jobs/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await jobService.getAllJobs(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch jobs."
      );
    }
  }
);

export const fetchJobById = createAsyncThunk(
  "jobs/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await jobService.getJobById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job."
      );
    }
  }
);

export const createJob = createAsyncThunk(
  "jobs/create",
  async (jobData, { rejectWithValue }) => {
    try {
      return await jobService.createJob(jobData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create job."
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  "jobs/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await jobService.updateJob(id, data);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update job."
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  "jobs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await jobService.deleteJob(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete job."
      );
    }
  }
);

export const fetchMyPostings = createAsyncThunk(
  "jobs/myPostings",
  async (_, { rejectWithValue }) => {
    try {
      return await jobService.getMyPostings();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your postings."
      );
    }
  }
);

export const searchJobs = createAsyncThunk(
  "jobs/search",
  async ({ keyword, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      return await jobService.searchJobs(keyword, page, size);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search jobs."
      );
    }
  }
);

export const filterJobs = createAsyncThunk(
  "jobs/filter",
  async ({ location, jobType, page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      return await jobService.filterJobs(location, jobType, page, size);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to filter jobs."
      );
    }
  }
);

// FIX: fetchJobMatches — rejectWithValue used so Redux doesn't throw,
// and the rejected handler below does NOT set state.error (silent fail)
export const fetchJobMatches = createAsyncThunk(
  "jobs/fetchMatches",
  async (jobId, { rejectWithValue }) => {
    try {
      const matches = await jobService.getJobMatches(jobId);
      return { jobId, matches };
    } catch (error) {
      // Silent reject — don't bubble 500 as a global error
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch job matches."
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    list:            [],
    selected:        null,
    matches:         {},
    isLoading:       false,
    isLoadingDetail: false,
    isCreating:      false,
    isUpdating:      false,
    isDeleting:      false,
    isLoadingMatch:  false,
    matchError:      null,   // FIX: separate match error — doesn't pollute global error
    error:           null,
    createError:     null,
    pagination:      { page: 1, pageSize: 10, total: 0 },
    filters: {
      search:        "",
      skills:        [],
      minExperience: "",
      maxExperience: "",
    },
  },
  reducers: {
    setJobFilters: (state, action) => {
      state.filters         = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearJobFilters: (state) => {
      state.filters = {
        search:        "",
        skills:        [],
        minExperience: "",
        maxExperience: "",
      };
      state.pagination.page = 1;
    },
    setJobPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSelectedJob: (state) => {
      state.selected = null;
    },
    clearJobError: (state) => {
      state.error       = null;
      state.createError = null;
      state.matchError  = null;
    },
  },
  extraReducers: (builder) => {
    // ── fetchAll ──
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload   = action.payload;
        state.list      = Array.isArray(payload)
          ? payload
          : payload?.content || [];
        state.pagination.total =
          payload?.totalElements ?? state.list.length;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // ── fetchById ──
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.isLoadingDetail = true;
        state.error           = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.selected        = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error           = action.payload;
      });

    // ── createJob ──
    builder
      .addCase(createJob.pending, (state) => {
        state.isCreating  = true;
        state.createError = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload) {
          state.list.unshift(action.payload);
        }
      })
      .addCase(createJob.rejected, (state, action) => {
        state.isCreating  = false;
        state.createError = action.payload;
      });

    // ── updateJob ──
    builder
      .addCase(updateJob.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.isUpdating  = false;
        const updated     = action.payload;
        const idx         = state.list.findIndex(j => j.id === updated?.id);
        if (idx !== -1) state.list[idx] = updated;
        if (state.selected?.id === updated?.id) state.selected = updated;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.isUpdating = false;
        state.error      = action.payload;
      });

    // ── deleteJob ──
    builder
      .addCase(deleteJob.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.list       = state.list.filter(j => j.id !== action.payload);
        if (state.selected?.id === action.payload) state.selected = null;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.isDeleting = false;
        state.error      = action.payload;
      });

    // ── searchJobs ──
    builder
      .addCase(searchJobs.pending, (state) => { state.isLoading = true; })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload   = action.payload;
        state.list      = Array.isArray(payload) ? payload : payload?.content || [];
        state.pagination.total = payload?.totalElements ?? state.list.length;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // ── filterJobs ──
    builder
      .addCase(filterJobs.pending, (state) => { state.isLoading = true; })
      .addCase(filterJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload   = action.payload;
        state.list      = Array.isArray(payload) ? payload : payload?.content || [];
        state.pagination.total = payload?.totalElements ?? state.list.length;
      })
      .addCase(filterJobs.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // ── fetchMatches ──
    // FIX: rejected does NOT touch state.error — match failures are isolated
    builder
      .addCase(fetchJobMatches.pending, (state) => {
        state.isLoadingMatch = true;
        state.matchError     = null;
      })
      .addCase(fetchJobMatches.fulfilled, (state, action) => {
        state.isLoadingMatch                    = false;
        state.matchError                        = null;
        state.matches[action.payload.jobId]     = action.payload.matches;
      })
      .addCase(fetchJobMatches.rejected, (state, action) => {
        state.isLoadingMatch = false;
        // FIX: store in matchError only — global state.error is NOT touched
        // This prevents the job detail page from showing "Job not found" on match failure
        state.matchError     = action.payload ?? null;
      });
  },
});

export const {
  setJobFilters,
  clearJobFilters,
  setJobPagination,
  clearSelectedJob,
  clearJobError,
} = jobSlice.actions;

// ─── Selectors ────────────────────────────────────────────────
export const selectAllJobs        = (state) => state.jobs.list;
export const selectSelectedJob    = (state) => state.jobs.selected;
export const selectJobsLoading    = (state) => state.jobs.isLoading;
export const selectJobDetailLoad  = (state) => state.jobs.isLoadingDetail;
export const selectJobCreating    = (state) => state.jobs.isCreating;
export const selectJobCreateError = (state) => state.jobs.createError;
export const selectJobMatches     = (jobId) => (state) =>
  state.jobs.matches[jobId] || [];
export const selectJobMatchLoading = (state) => state.jobs.isLoadingMatch;
export const selectJobMatchError   = (state) => state.jobs.matchError;  // NEW
export const selectJobFilters      = (state) => state.jobs.filters;
export const selectJobPagination   = (state) => state.jobs.pagination;
export const selectJobError        = (state) => state.jobs.error;

export default jobSlice.reducer;