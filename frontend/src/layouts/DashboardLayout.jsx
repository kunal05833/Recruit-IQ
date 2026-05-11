// src/layouts/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import clsx from "clsx";
import Sidebar from "../components/layout/Sidebar";
import Navbar  from "../components/layout/Navbar";
import { selectAuth } from "../features/auth/authSlice";
import { connectWebSocket, disconnectWebSocket } from "../services/websocketService";

const SIDEBAR_COLLAPSED_KEY = "sidebar_collapsed";

const DashboardLayout = () => {
  const location = useLocation();

  // Desktop collapse state (persisted)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SIDEBAR_COLLAPSED_KEY)) || false;
    } catch {
      return false;
    }
  });

  // Mobile open state
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ FIX #11: Connect WebSocket for real-time notifications
  const auth = useSelector(selectAuth);
  useEffect(() => {
    if (auth.isAuthenticated && auth.accessToken) {
      connectWebSocket(auth.user?.id || auth.accessToken, auth.accessToken);
    }
    return () => disconnectWebSocket();
  }, [auth.isAuthenticated]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Persist collapse state
  const handleToggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-surface-50 flex">
      {/* ── Sidebar ──────────────────────────────────────── */}
      <Sidebar
        collapsed={collapsed}
        onToggle={handleToggleCollapse}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main Area ────────────────────────────────────── */}
      <div
        className={clsx(
          "flex-1 flex flex-col min-h-screen min-w-0",
          "transition-all duration-300",
          // Push content right of sidebar on desktop
          collapsed ? "lg:ml-[68px]" : "lg:ml-64"
        )}
      >
        {/* Navbar */}
        <Navbar
          onMobileMenuOpen={() => setMobileOpen(true)}
          collapsed={collapsed}
        />

        {/* Page Content */}
        <main
          className={clsx(
            "flex-1 overflow-auto",
            "pt-16",                  // Offset for fixed navbar
            "animate-fade-in"
          )}
        >
          <div className="page-container">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 border-t border-surface-100
                           bg-white/50 backdrop-blur-sm">
          <div className="page-container py-4">
            <div className="flex flex-col sm:flex-row items-center
                            justify-between gap-2">
              <p className="text-xs text-surface-400">
                © {new Date().getFullYear()} TalentAI. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <button className="text-xs text-surface-400 hover:text-surface-600 transition-colors">
                  Privacy Policy
                </button>
                <button className="text-xs text-surface-400 hover:text-surface-600 transition-colors">
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;