// src/features/applications/utils/statusConfig.js
export const STATUS_CONFIG = {
  PENDING: {
    label:   "Pending",
    variant: "warning",
    dot:     true,
    bg:      "bg-warning-50",
    text:    "text-warning-700",
    border:  "border-warning-200",
    icon:    "⏳",
    description: "Application is awaiting review",
  },
  REVIEWED: {
    label:   "Reviewed",
    variant: "info",
    dot:     true,
    bg:      "bg-blue-50",
    text:    "text-blue-700",
    border:  "border-blue-200",
    icon:    "👀",
    description: "Application has been reviewed by recruiter",
  },
  ACCEPTED: {
    label:   "Accepted",
    variant: "success",
    dot:     true,
    bg:      "bg-success-50",
    text:    "text-success-700",
    border:  "border-success-200",
    icon:    "✅",
    description: "Congratulations! Your application was accepted",
  },
  REJECTED: {
    label:   "Rejected",
    variant: "danger",
    dot:     true,
    bg:      "bg-danger-50",
    text:    "text-danger-700",
    border:  "border-danger-200",
    icon:    "❌",
    description: "Application was not selected at this time",
  },
};

export const getStatusConfig = (status) =>
  STATUS_CONFIG[(status || "PENDING").toUpperCase()] || STATUS_CONFIG.PENDING;

export const ALL_STATUSES = Object.keys(STATUS_CONFIG);