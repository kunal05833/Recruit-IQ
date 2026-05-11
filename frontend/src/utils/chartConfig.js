
// src/utils/chartConfig.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ─── Global Chart Defaults ────────────────────────────────────
ChartJS.defaults.font.family  = "Inter, system-ui, sans-serif";
ChartJS.defaults.font.size    = 12;
ChartJS.defaults.color        = "#64748b";
ChartJS.defaults.borderColor  = "#f1f5f9";

// ─── Shared Chart Options ─────────────────────────────────────
export const defaultLineOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  interaction: {
    mode:      "index",
    intersect: false,
  },
  plugins: {
    legend: {
      display:  true,
      position: "top",
      labels: {
        usePointStyle: true,
        pointStyle:    "circle",
        padding:       20,
        font: { size: 12, weight: "500" },
        color: "#475569",
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleColor:      "#f8fafc",
      bodyColor:       "#cbd5e1",
      borderColor:     "#1e293b",
      borderWidth:     1,
      padding:         12,
      cornerRadius:    10,
      displayColors:   true,
      usePointStyle:   true,
    },
  },
  scales: {
    x: {
      grid:  { display: false },
      ticks: { color: "#94a3b8", font: { size: 11 } },
      border:{ display: false },
    },
    y: {
      grid:  { color: "#f1f5f9", drawBorder: false },
      ticks: { color: "#94a3b8", font: { size: 11 }, padding: 8 },
      border:{ display: false, dash: [4, 4] },
    },
  },
};

export const defaultBarOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display:  true,
      position: "top",
      labels: {
        usePointStyle: true,
        pointStyle:    "rectRounded",
        padding:       20,
        font: { size: 12, weight: "500" },
        color: "#475569",
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleColor:      "#f8fafc",
      bodyColor:       "#cbd5e1",
      padding:         12,
      cornerRadius:    10,
    },
  },
  scales: {
    x: {
      grid:   { display: false },
      ticks:  { color: "#94a3b8", font: { size: 11 } },
      border: { display: false },
    },
    y: {
      grid:   { color: "#f1f5f9" },
      ticks:  { color: "#94a3b8", font: { size: 11 }, padding: 8 },
      border: { display: false },
    },
  },
};

export const defaultDoughnutOptions = {
  responsive:          true,
  maintainAspectRatio: false,
  cutout:              "70%",
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        pointStyle:    "circle",
        padding:       16,
        font: { size: 12 },
        color: "#475569",
      },
    },
    tooltip: {
      backgroundColor: "#0f172a",
      titleColor:      "#f8fafc",
      bodyColor:       "#cbd5e1",
      padding:         12,
      cornerRadius:    10,
    },
  },
};

// ─── Color Palette ────────────────────────────────────────────
export const CHART_COLORS = {
  primary:  { solid: "#3b82f6", light: "rgba(59,130,246,0.12)"  },
  success:  { solid: "#22c55e", light: "rgba(34,197,94,0.12)"   },
  warning:  { solid: "#f59e0b", light: "rgba(245,158,11,0.12)"  },
  danger:   { solid: "#ef4444", light: "rgba(239,68,68,0.12)"   },
  purple:   { solid: "#a855f7", light: "rgba(168,85,247,0.12)"  },
  indigo:   { solid: "#6366f1", light: "rgba(99,102,241,0.12)"  },
  teal:     { solid: "#14b8a6", light: "rgba(20,184,166,0.12)"  },
  orange:   { solid: "#f97316", light: "rgba(249,115,22,0.12)"  },
};