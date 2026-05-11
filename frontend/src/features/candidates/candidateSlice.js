// src/features/candidates/candidateSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import candidateService from "./candidateService";

// ─── Async Thunks ─────────────────────────────────────────────
export const fetchAllCandidates = createAsyncThunk(
  "candidates/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await candidateService.getAllCandidates(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch candidates."
      );
    }
  }
);

export const fetchCandidateById = createAsyncThunk(
  "candidates/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      return await candidateService.getCandidateById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch candidate."
      );
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────
const candidateSlice = createSlice({
  name: "candidates",
  initialState: {
    list:       [],
    selected:   null,
    isLoading:  false,
    isLoadingDetail: false,
    error:      null,
    pagination: { page: 1, pageSize: 10, total: 0 },
    filters: {
      search:     "",
      skills:     [],
      minExperience: "",
      maxExperience: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters     = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        search:        "",
        skills:        [],
        minExperience: "",
        maxExperience: "",
      };
      state.pagination.page = 1;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearSelected: (state) => {
      state.selected = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchAllCandidates.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchAllCandidates.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload   = action.payload;
        state.list      = Array.isArray(payload)
          ? payload
          : payload?.content || [];
        state.pagination.total = payload?.totalElements
          ?? state.list.length;
      })
      .addCase(fetchAllCandidates.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      })

      // fetchById
      .addCase(fetchCandidateById.pending, (state) => {
        state.isLoadingDetail = true;
        state.error           = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.isLoadingDetail = false;
        state.selected        = action.payload;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.isLoadingDetail = false;
        state.error           = action.payload;
      });
  },
});

export const {
  setFilters,
  clearFilters,
  setPagination,
  clearSelected,
  clearError,
} = candidateSlice.actions;

// ─── Selectors ────────────────────────────────────────────────
export const selectAllCandidates       = (state) => state.candidates.list;
export const selectSelectedCandidate   = (state) => state.candidates.selected;
export const selectCandidatesLoading   = (state) => state.candidates.isLoading;
export const selectCandidateDetailLoad = (state) => state.candidates.isLoadingDetail;
export const selectCandidateFilters    = (state) => state.candidates.filters;
export const selectCandidatePagination = (state) => state.candidates.pagination;
export const selectCandidateError      = (state) => state.candidates.error;

export default candidateSlice.reducer;