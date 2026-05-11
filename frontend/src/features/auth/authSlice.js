// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

const initialState = {
  user:         JSON.parse(localStorage.getItem("user")) || null, // ← ADD
  accessToken:  localStorage.getItem("accessToken")  || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  role:         localStorage.getItem("role")         || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading:    false,
  error:        null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (refreshToken, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Token refresh failed."
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (e) {
      console.warn("Logout API failed, clearing local state anyway");
    } finally {
      dispatch(logout());
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user            = null;
      state.accessToken     = null;
      state.refreshToken    = null;
      state.role            = null;
      state.isAuthenticated = false;
      state.error           = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");          // ← ADD
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      const { accessToken, refreshToken, role } = action.payload;
      state.accessToken     = accessToken;
      state.refreshToken    = refreshToken;
      state.role            = role;
      state.isAuthenticated = true;

      localStorage.setItem("accessToken",  accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role",         role);
    },
  },
  extraReducers: (builder) => {
    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { accessToken, refreshToken, role, name, email } = action.payload; // ← name, email ADD

        // ── User object save karo ─────────────────────────
        const user = { name, email };                 // ← ADD
        state.user            = user;                 // ← ADD
        state.isLoading       = false;
        state.isAuthenticated = true;
        state.accessToken     = accessToken;
        state.refreshToken    = refreshToken;
        state.role            = role;

        localStorage.setItem("accessToken",  accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("role",         role);
        localStorage.setItem("user", JSON.stringify(user)); // ← ADD
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // ── Signup ──
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    // ── Refresh Token ──
    builder
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const { accessToken, refreshToken } = action.payload;
        state.accessToken  = accessToken;
        state.refreshToken = refreshToken;
        localStorage.setItem("accessToken",  accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.user            = null;
        state.accessToken     = null;
        state.refreshToken    = null;
        state.role            = null;
        state.isAuthenticated = false;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user");          // ← ADD
      });
  },
});

export const { logout, clearAuthError, setCredentials } = authSlice.actions;

export const selectAuth            = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole        = (state) => state.auth.role;
export const selectAccessToken     = (state) => state.auth.accessToken;
export const selectAuthLoading     = (state) => state.auth.isLoading;
export const selectAuthError       = (state) => state.auth.error;
export const selectUserName        = (state) => state.auth.user?.name; // ← ADD

export default authSlice.reducer;