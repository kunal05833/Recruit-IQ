// src/features/admin/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await adminService.getAllUsers(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users.");
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      return await adminService.updateUserRole(id, role);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update role.");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await adminService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user.");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users:       [],
    isLoading:   false,
    isDeleting:  false,
    isUpdating:  false,
    deletingId:  null,
    error:       null,
    deleteError: null,
    updateError: null,
    pagination:  { page: 1, pageSize: 10, total: 0 },
    filters:     { search: "", role: "" },
  },
  reducers: {
    setAdminFilters: (state, action) => {
      state.filters         = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearAdminFilters: (state) => {
      state.filters = { search: "", role: "" };
      state.pagination.page = 1;
    },
    setAdminPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearAdminError: (state) => {
      state.error       = null;
      state.deleteError = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllUsers
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload   = action.payload;
        state.users     = Array.isArray(payload) ? payload : payload?.content || [];
        state.pagination.total = payload?.totalElements ?? state.users.length;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // updateUserRole
    builder
      .addCase(updateUserRole.pending, (state) => {
        state.isUpdating  = true;
        state.updateError = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isUpdating = false;
        const updated    = action.payload;
        state.users      = state.users.map((u) => u.id === updated.id ? updated : u);
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isUpdating  = false;
        state.updateError = action.payload;
      });

    // deleteUser
    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.isDeleting  = true;
        state.deletingId  = action.meta.arg;
        state.deleteError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deletingId = null;
        state.users      = state.users.filter((u) => u.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeleting  = false;
        state.deletingId  = null;
        state.deleteError = action.payload;
      });
  },
});

export const {
  setAdminFilters, clearAdminFilters,
  setAdminPagination, clearAdminError,
} = adminSlice.actions;

export const selectAllUsers        = (state) => state.admin.users;
export const selectAdminLoading    = (state) => state.admin.isLoading;
export const selectIsDeleting      = (state) => state.admin.isDeleting;
export const selectDeletingId      = (state) => state.admin.deletingId;
export const selectAdminError      = (state) => state.admin.error;
export const selectAdminFilters    = (state) => state.admin.filters;
export const selectAdminPagination = (state) => state.admin.pagination;

export default adminSlice.reducer;
