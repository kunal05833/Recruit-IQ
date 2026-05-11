// src/components/shared/ToastProvider.jsx
import { Toaster } from "react-hot-toast";

const ToastProvider = () => (
  <Toaster
    position="top-right"
    gutter={10}
    containerStyle={{ top: 72 }}
    toastOptions={{
      duration: 4000,
      style: {
        background: "#fff",
        color:      "#0f172a",
        borderRadius: "0.75rem",
        border:     "1px solid #e2e8f0",
        boxShadow:  "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        fontSize:   "0.875rem",
        padding:    "12px 16px",
        fontFamily: "Inter, system-ui, sans-serif",
        maxWidth:   "400px",
      },
      success: {
        iconTheme: { primary: "#22c55e", secondary: "#fff" },
      },
      error: {
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
        duration:  5000,
      },
      loading: {
        iconTheme: { primary: "#3b82f6", secondary: "#eff6ff" },
      },
    }}
  />
);

export default ToastProvider;