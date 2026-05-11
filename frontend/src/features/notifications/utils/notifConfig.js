// src/features/notifications/utils/notifConfig.js
export const NOTIF_TYPES = {
  APPLICATION_SUBMITTED: {
    icon:    "📨",
    label:   "Application Submitted",
    color:   "bg-primary-50 text-primary-600",
    border:  "border-primary-200",
  },
  APPLICATION_REVIEWED: {
    icon:    "👀",
    label:   "Application Reviewed",
    color:   "bg-indigo-50 text-indigo-600",
    border:  "border-indigo-200",
  },
  APPLICATION_ACCEPTED: {
    icon:    "🎉",
    label:   "Application Accepted",
    color:   "bg-success-50 text-success-600",
    border:  "border-success-200",
  },
  APPLICATION_REJECTED: {
    icon:    "❌",
    label:   "Not Selected",
    color:   "bg-danger-50 text-danger-600",
    border:  "border-danger-200",
  },
  JOB_POSTED: {
    icon:    "💼",
    label:   "New Job Posted",
    color:   "bg-warning-50 text-warning-600",
    border:  "border-warning-200",
  },
  NEW_MATCH: {
    icon:    "🤖",
    label:   "New AI Match",
    color:   "bg-purple-50 text-purple-600",
    border:  "border-purple-200",
  },
  SYSTEM: {
    icon:    "🔔",
    label:   "System Notification",
    color:   "bg-surface-100 text-surface-600",
    border:  "border-surface-200",
  },
};

export const getNotifConfig = (type) =>
  NOTIF_TYPES[(type || "SYSTEM").toUpperCase()] || NOTIF_TYPES.SYSTEM;

// Generate mock notifications since API returns real data
export const generateMockNotifications = (count = 12) => {
  const types = Object.keys(NOTIF_TYPES);
  const messages = {
    APPLICATION_SUBMITTED: "Your application has been submitted successfully.",
    APPLICATION_REVIEWED:  "A recruiter has reviewed your application.",
    APPLICATION_ACCEPTED:  "Congratulations! Your application was accepted.",
    APPLICATION_REJECTED:  "Your application was not selected this time.",
    JOB_POSTED:            "A new job matching your skills has been posted.",
    NEW_MATCH:             "AI found a new high-scoring job match for you.",
    SYSTEM:                "System maintenance scheduled for this weekend.",
  };

  return Array.from({ length: count }, (_, i) => {
    const type = types[i % types.length];
    const daysAgo = Math.floor(Math.random() * 14);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 12) + 8);

    return {
      id:        i + 1,
      type,
      message:   messages[type],
      read:      i > 3,
      createdAt: date.toISOString(),
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};