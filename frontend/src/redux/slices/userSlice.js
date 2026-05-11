// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";

// ✅ Backend fix ke baad /profile/me proper data dega
// Koi localStorage hack nahi — clean implementation
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue, getState }) => {
    try {
      const role = getState().auth.role;
      if (role !== "CANDIDATE") return null;

      const { data } = await axiosInstance.get(
        API_ENDPOINTS.USERS.PROFILE,
        { skipErrorToast: true }
      );

      return data.data ?? data ?? null;
    } catch (error) {
      // 404 = profile nahi bani — error nahi, null return karo
      if (error.response?.status === 404) return null;
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile."
      );
    }
  }
);

// ✅ Profile normalize — candidateId hamesha set hoga
const normalizeProfile = (p) => {
  if (!p) return null;
  if (typeof p === "object" && Object.keys(p).length === 0) return null;

  return {
    ...p,
    // Backend DTO mein id = candidateId hai
    id:          p.id ?? null,
    candidateId: p.id ?? null,
    hasResume: !!(
      p.skills?.length > 0 ||
      p.headline            ||
      p.experience          ||
      p.resumeUrl
    ),
  };
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile:   null,
    isLoading: false,
    error:     null,
  },
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error   = null;
    },
    setProfile: (state, action) => {
      state.profile = normalizeProfile(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile   = normalizeProfile(action.payload);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload ?? null;
      });
  },
});

export const { clearProfile, setProfile } = userSlice.actions;

export const selectUserProfile = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError   = (state) => state.user.error;
export const selectCandidateId = (state) =>
  state.user.profile?.candidateId ?? state.user.profile?.id ?? null;

export default userSlice.reducer;