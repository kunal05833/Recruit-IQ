// src/redux/store.js
import { configureStore }    from "@reduxjs/toolkit";
import authReducer            from "../features/auth/authSlice";
import candidateReducer       from "../features/candidates/candidateSlice";
import jobReducer             from "../features/jobs/jobSlice";
import applicationReducer     from "../features/applications/applicationSlice";
import analyticsReducer       from "../features/analytics/analyticsSlice";
import notificationReducer    from "../features/notifications/notificationSlice";
import userReducer            from "./slices/userSlice";
import adminReducer           from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    user:          userReducer,
    candidates:    candidateReducer,
    jobs:          jobReducer,
    applications:  applicationReducer,
    analytics:     analyticsReducer,
    notifications: notificationReducer,
    admin:         adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/refreshAccessToken/fulfilled"],
      },
    }),
  devTools: import.meta.env.DEV,
});

export default store;