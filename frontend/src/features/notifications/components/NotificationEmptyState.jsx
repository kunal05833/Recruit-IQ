// src/features/notifications/components/NotificationEmptyState.jsx
import clsx from "clsx";
import { Bell, CheckCircle } from "lucide-react";

const NotificationEmptyState = ({ filter }) => {
  const isAllRead = filter === "unread";

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className={clsx(
        "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
        isAllRead ? "bg-success-50" : "bg-surface-100"
      )}>
        {isAllRead
          ? <CheckCircle size={28} className="text-success-500" />
          : <Bell        size={28} className="text-surface-400" />
        }
      </div>

      <h3 className="text-base font-semibold text-surface-800 mb-1">
        {isAllRead
          ? "All caught up!"
          : filter === "read"
          ? "No read notifications"
          : "No notifications yet"
        }
      </h3>

      <p className="text-sm text-surface-500 max-w-xs leading-relaxed">
        {isAllRead
          ? "You have no unread notifications. Great job staying on top of things!"
          : filter === "read"
          ? "Notifications you've read will appear here."
          : "When you receive notifications, they will appear here."
        }
      </p>
    </div>
  );
};

export default NotificationEmptyState;