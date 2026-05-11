// src/layouts/AuthLayout.jsx
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUserRole,
} from "../features/auth/authSlice";
import { getDashboardRoute } from "../utils/roleHelpers";
import { APP_NAME } from "../utils/constants";
import { Sparkles } from "lucide-react";

const AuthLayout = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectUserRole);

  // Already logged in → redirect to dashboard
  if (isAuthenticated && role) {
    return <Navigate to={getDashboardRoute(role)} replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left Panel — Branding ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden
                      bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0),
                              radial-gradient(circle at 75px 75px, white 2px, transparent 0)`,
            backgroundSize: "100px 100px",
          }}
        />

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary-400
                        rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-300
                        rounded-full opacity-15 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center
                            justify-center backdrop-blur-sm border border-white/30">
              <Sparkles size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              {APP_NAME}
            </span>
          </div>

          {/* Hero Text */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
                Hire smarter with
                <br />
                <span className="text-primary-200">AI-powered</span>
                <br />
                recruitment
              </h1>
              <p className="text-primary-200 text-lg leading-relaxed max-w-md">
                Match top talent with the right opportunities using intelligent
                algorithms and real-time analytics.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: "Active Jobs",       value: "2,400+" },
                { label: "Candidates",        value: "18,000+" },
                { label: "Placements",        value: "94%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4
                             border border-white/20"
                >
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-primary-200 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6
                          border border-white/20 space-y-3">
            <p className="text-white/90 text-sm leading-relaxed italic">
              "TalentAI reduced our time-to-hire by 60%. The AI matching
              is incredibly accurate — we found our best engineers through it."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-400
                              flex items-center justify-center text-white
                              text-xs font-bold">
                KK
              </div>
              <div>
                <p className="text-white text-sm font-medium">Kunal</p>
                <p className="text-primary-300 text-xs">Head of Talent, Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel — Auth Form ────────────────────────── */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2.5 px-6 pt-6">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center
                          justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold text-surface-900">{APP_NAME}</span>
        </div>

        {/* Form Area */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-xs text-surface-400">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;