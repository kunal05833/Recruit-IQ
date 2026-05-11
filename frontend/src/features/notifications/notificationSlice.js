// src/features/notifications/notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";
import API_ENDPOINTS from "../../config/apiConfig";
import notificationService from "./notificationService";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications."
      );
    }
  }
);

// ✅ FIX: Lightweight fetch for notification bell — uses /recent endpoint
export const fetchRecentNotifications = createAsyncThunk(
  "notifications/fetchRecent",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getRecent();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recent notifications."
      );
    }
  }
);

// ✅ FIX: Persist markAsRead to backend before updating local state
export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      dispatch(markAsRead(id));
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// ✅ FIX: Persist markAllAsRead to backend before updating local state
export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllRead",
  async (_, { dispatch }) => {
    await notificationService.markAllAsRead();
    dispatch(markAllAsRead());
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list:        [],
    unreadCount: 0,
    isLoading:   false,
    error:       null,
    filter:      "all",
  },
  reducers: {
    markAllAsRead: (state) => {
      state.list        = state.list.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    markAsRead: (state, action) => {
      const notif = state.list.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read        = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAsUnread: (state, action) => {
      const notif = state.list.find((n) => n.id === action.payload);
      if (notif && notif.read) {
        notif.read = false;
        state.unreadCount += 1;
      }
    },
    deleteNotification: (state, action) => {
      const notif = state.list.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.list        = [];
      state.unreadCount = 0;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error     = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const list        = Array.isArray(action.payload) ? action.payload : [];
        state.isLoading   = false;
        state.list        = list;
        state.unreadCount = list.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload;
      });

    builder
      .addCase(fetchRecentNotifications.fulfilled, (state, action) => {
        const list        = Array.isArray(action.payload) ? action.payload : [];
        state.list        = list;
        state.unreadCount = list.filter((n) => !n.read).length;
      });
  },
});

export const {
  markAllAsRead, markAsRead, markAsUnread,
  deleteNotification, clearAllNotifications,
  setFilter, addNotification,
} = notificationSlice.actions;

export const selectNotifications = (state) => state.notifications.list;
export const selectUnreadCount   = (state) => state.notifications.unreadCount;
export const selectNotifLoading  = (state) => state.notifications.isLoading;
export const selectNotifFilter   = (state) => state.notifications.filter;

export default notificationSlice.reducer;
