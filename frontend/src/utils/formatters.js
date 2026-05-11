// src/utils/formatters.js
import { format, formatDistanceToNow, parseISO } from "date-fns";

// ─── Date Formatters ──────────────────────────────────────────
export const formatDate = (date, pattern = "MMM dd, yyyy") => {
  if (!date) return "—";
  try {
    const parsed = typeof date === "string" ? parseISO(date) : date;
    return format(parsed, pattern);
  } catch {
    return "—";
  }
};

export const formatDateTime = (date) => {
  if (!date) return "—";
  try {
    const parsed = typeof date === "string" ? parseISO(date) : date;
    return format(parsed, "MMM dd, yyyy • hh:mm a");
  } catch {
    return "—";
  }
};

export const formatRelativeTime = (date) => {
  if (!date) return "—";
  try {
    const parsed = typeof date === "string" ? parseISO(date) : date;
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return "—";
  }
};

export const formatShortDate = (date) => {
  if (!date) return "—";
  try {
    const parsed = typeof date === "string" ? parseISO(date) : date;
    return format(parsed, "dd MMM");
  } catch {
    return "—";
  }
};

// ─── Number Formatters ────────────────────────────────────────
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return new Intl.NumberFormat("en-US").format(num);
};

export const formatCompactNumber = (num) => {
  if (num === null || num === undefined) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

export const formatPercent = (value, decimals = 0) => {
  if (value === null || value === undefined) return "0%";
  return `${Number(value).toFixed(decimals)}%`;
};

export const formatCurrency = (amount, currency = "USD") => {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style:    "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ─── String Formatters ────────────────────────────────────────
export const truncate = (str, length = 80) => {
  if (!str) return "";
  return str.length > length
    ? `${str.substring(0, length)}...`
    : str;
};

export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

export const formatRole = (role) => {
  const map = {
    ADMIN:     "Admin",
    RECRUITER: "Recruiter",
    CANDIDATE: "Candidate",
  };
  return map[role] || role;
};

// ─── Experience Formatter ─────────────────────────────────────
export const formatExperience = (years) => {
  if (!years && years !== 0) return "—";
  if (years === 0) return "Fresher";
  if (years === 1) return "1 year";
  return `${years} years`;
};

export const formatExperienceLevel = (years) => {
  if (!years && years !== 0) return "Unknown";
  if (years === 0) return "Entry Level";
  if (years <= 2)  return "Junior";
  if (years <= 5)  return "Mid-Level";
  if (years <= 8)  return "Senior";
  return "Lead / Principal";
};

// ─── Skills Formatter ─────────────────────────────────────────
export const formatSkillsList = (skills, max = 3) => {
  if (!Array.isArray(skills) || skills.length === 0) return "—";
  const shown   = skills.slice(0, max).join(", ");
  const remaining = skills.length - max;
  return remaining > 0 ? `${shown} +${remaining}` : shown;
};

// ─── File Size Formatter ──────────────────────────────────────
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let size    = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// ─── Status Formatter ─────────────────────────────────────────
export const formatStatus = (status) => {
  if (!status) return "—";
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

// ─── Name Initials ────────────────────────────────────────────
export const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

// ─── Score Formatter ──────────────────────────────────────────
export const formatMatchScore = (score) => {
  if (score === null || score === undefined) return "—";
  return `${score}%`;
};

export const getScoreLabel = (score) => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Low";
};