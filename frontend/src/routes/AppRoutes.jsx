// src/routes/AppRoutes.jsx
import { lazy, Suspense }    from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AuthLayout      from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute  from "../components/shared/ProtectedRoute";
import RoleGuard       from "../components/shared/RoleGuard";
import ErrorBoundary   from "../components/shared/ErrorBoundary";
import { PageSpinner } from "../components/ui/Spinner";
import LoginPage       from "../features/auth/pages/LoginPage";
import SignupPage      from "../features/auth/pages/SignupPage";
import { ROLES }       from "../utils/constants";

// ─── Lazy Pages ───────────────────────────────────────────────
const lazy_ = (fn) => lazy(fn);

const AdminDashboard     = lazy_(() => import("../features/admin/pages/AdminDashboard"));
const AdminUsersPage     = lazy_(() => import("../features/admin/pages/AdminUsersPage"));
const RecruiterDashboard = lazy_(() => import("../features/analytics/pages/RecruiterDashboard"));
const CandidateDashboard = lazy_(() => import("../features/analytics/pages/CandidateDashboard"));
const CandidateListPage  = lazy_(() => import("../features/candidates/pages/CandidateListPage"));
const CandidateDetailPage = lazy_(() => import("../features/candidates/pages/CandidateDetailPage"));
const JobListPage        = lazy_(() => import("../features/jobs/pages/JobListPage"));
const JobDetailPage      = lazy_(() => import("../features/jobs/pages/JobDetailPage"));
const JobCreatePage      = lazy_(() => import("../features/jobs/pages/JobCreatePage"));
// ✅ FIX #10: Job edit page
const JobEditPage        = lazy_(() => import("../features/jobs/pages/JobEditPage"));
const ApplicationListPage = lazy_(() => import("../features/applications/pages/ApplicationListPage"));
const AnalyticsPage      = lazy_(() => import("../features/analytics/pages/AnalyticsPage"));
const NotificationsPage  = lazy_(() => import("../features/notifications/pages/NotificationsPage"));
const ProfilePage        = lazy_(() => import("../pages/ProfilePage"));
const NotFoundPage       = lazy_(() => import("../pages/NotFoundPage"));
// ✅ FIX #3: AI Interview page
const AIInterviewPage    = lazy_(() => import("../features/interview/pages/AIInterviewPage"));

// ─── Suspense Wrapper ─────────────────────────────────────────
const Page = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<PageSpinner />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

// ─── Route Definitions ────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Root */}
    <Route index element={<Navigate to="/auth/login" replace />} />

    {/* ── Auth ─────────────────────────────────────────── */}
    <Route path="/auth" element={<AuthLayout />}>
      <Route index   element={<Navigate to="login" replace />} />
      <Route path="login"  element={<LoginPage  />} />
      <Route path="signup" element={<SignupPage />} />
    </Route>

    {/* ── Protected ────────────────────────────────────── */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <Page>
            <DashboardLayout />
          </Page>
        </ProtectedRoute>
      }
    >
      {/* ── Admin ──────────────────────────────────────── */}
      <Route
        path="admin"
        element={
          <RoleGuard allowedRoles={[ROLES.ADMIN]}>
            <Page><AdminDashboard /></Page>
          </RoleGuard>
        }
      />
      <Route
        path="admin/users"
        element={
          <RoleGuard allowedRoles={[ROLES.ADMIN]}>
            <Page><AdminUsersPage /></Page>
          </RoleGuard>
        }
      />

      {/* ── Dashboards ─────────────────────────────────── */}
      <Route
        path="dashboard/recruiter"
        element={
          <RoleGuard allowedRoles={[ROLES.RECRUITER, ROLES.ADMIN]}>
            <Page><RecruiterDashboard /></Page>
          </RoleGuard>
        }
      />
      <Route
        path="dashboard/candidate"
        element={
          <RoleGuard allowedRoles={[ROLES.CANDIDATE]}>
            <Page><CandidateDashboard /></Page>
          </RoleGuard>
        }
      />

      {/* ── Candidates ─────────────────────────────────── */}
      <Route
        path="candidates"
        element={
          <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECRUITER]}>
            <Page><CandidateListPage /></Page>
          </RoleGuard>
        }
      />
      <Route
        path="candidates/:id"
        element={
          <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECRUITER]}>
            <Page><CandidateDetailPage /></Page>
          </RoleGuard>
        }
      />

      {/* ── Jobs ───────────────────────────────────────── */}
      <Route
        path="jobs"
        element={<Page><JobListPage /></Page>}
      />
      <Route
        path="jobs/create"
        element={
          <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECRUITER]}>
            <Page><JobCreatePage /></Page>
          </RoleGuard>
        }
      />
      {/* ✅ FIX #10: Job edit route */}
      <Route
        path="jobs/:id/edit"
        element={
          <RoleGuard allowedRoles={[ROLES.RECRUITER, ROLES.ADMIN]}>
            <Page><JobEditPage /></Page>
          </RoleGuard>
        }
      />
      <Route
        path="jobs/:id"
        element={<Page><JobDetailPage /></Page>}
      />

      {/* ── Applications ───────────────────────────────── */}
      <Route
        path="applications"
        element={<Page><ApplicationListPage /></Page>}
      />

      {/* ── Analytics ──────────────────────────────────── */}
      <Route
        path="analytics"
        element={
          <RoleGuard allowedRoles={[ROLES.ADMIN, ROLES.RECRUITER]}>
            <Page><AnalyticsPage /></Page>
          </RoleGuard>
        }
      />

      {/* ── Notifications ──────────────────────────────── */}
      <Route
        path="notifications"
        element={<Page><NotificationsPage /></Page>}
      />

      {/* ✅ FIX #3: AI Interview route — CANDIDATE only */}
      <Route
        path="interview/:jobId"
        element={
          <RoleGuard allowedRoles={[ROLES.CANDIDATE]}>
            <Page><AIInterviewPage /></Page>
          </RoleGuard>
        }
      />

      {/* ── Profile ────────────────────────────────────── */}
      <Route
        path="profile"
        element={<Page><ProfilePage /></Page>}
      />
    </Route>

    {/* ── 404 ──────────────────────────────────────────── */}
    <Route
      path="*"
      element={
        <Page><NotFoundPage /></Page>
      }
    />
  </Routes>
);

export default AppRoutes;
