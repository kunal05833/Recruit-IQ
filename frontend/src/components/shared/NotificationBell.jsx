// src/components/shared/NotificationBell.jsx
import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector }    from "react-redux";
import { useNavigate }                 from "react-router-dom";
import { Bell, Check, ArrowRight }     from "lucide-react";
import clsx                            from "clsx";
import {
  fetchNotifications,
  fetchRecentNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  markAllAsRead,
  markAsRead,
  addNotification,
  selectNotifications,
  selectUnreadCount,
  selectNotifLoading,
} from "../../features/notifications/notificationSlice";
import { generateMockNotifications } from "../../features/notifications/utils/notifConfig";
import { getNotifConfig }            from "../../features/notifications/utils/notifConfig";
import useOutsideClick               from "../../hooks/useOutsideClick";
import { formatRelativeTime }        from "../../utils/formatters";
import Spinner                       from "../ui/Spinner";

const NotificationBell = () => {
  const dispatch      = useDispatch();
  const navigate      = useNavigate();
  const [open, setOpen] = useState(false);
  const ref           = useRef(null);

  const notifications = useSelector(selectNotifications);
  const unreadCount   = useSelector(selectUnreadCount);
  const isLoading     = useSelector(selectNotifLoading);

  useOutsideClick(ref, () => setOpen(false));

  useEffect(() => {
    dispatch(fetchNotifications()).then((result) => {
      if (
        fetchNotifications.fulfilled.match(result) &&
        Array.isArray(result.payload) &&
        result.payload.length === 0
      ) {
        generateMockNotifications(8).forEach((n) =>
          dispatch(addNotification(n))
        );
      }
    });
  }, [dispatch]);

  const preview = notifications.slice(0, 5);

  return (
    <div ref={ref} className="relative">
      {/* Bell */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={clsx(
          "relative w-9 h-9 rounded-lg flex items-center justify-center",
          "transition-colors duration-150",
          open
            ? "bg-surface-100 text-surface-800"
            : "text-surface-500 hover:bg-surface-100 hover:text-surface-700"
        )}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px]
                           bg-danger-500 text-white text-2xs font-bold
                           rounded-full flex items-center justify-center px-1
                           ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50
                        w-80 sm:w-96 bg-white rounded-xl
                        border border-surface-200 shadow-soft-lg
                        animate-fade-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3
                          border-b border-surface-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-surface-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="text-2xs bg-primary-100 text-primary-700
                                 font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllNotificationsRead())}
                className="text-xs text-primary-600 hover:text-primary-700
                           font-semibold flex items-center gap-1 transition-colors"
              >
                <Check size={11} />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto no-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="sm" />
              </div>
            ) : preview.length === 0 ? (
              <div className="flex flex-col items-center py-10">
                <div className="w-10 h-10 bg-surface-100 rounded-xl
                                flex items-center justify-center mb-3">
                  <Bell size={18} className="text-surface-400" />
                </div>
                <p className="text-sm font-medium text-surface-700">
                  No notifications
                </p>
                <p className="text-xs text-surface-400 mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-surface-50">
                {preview.map((notif) => {
                  const config = getNotifConfig(notif.type);
                  return (
                    <button
                      key={notif.id}
                      onClick={() => {
                        if (!notif.read) dispatch(markNotificationRead(notif.id));
                        setOpen(false);
                      }}
                      className={clsx(
                        "w-full flex items-start gap-3 px-4 py-3.5 text-left",
                        "transition-colors",
                        notif.read
                          ? "hover:bg-surface-50"
                          : "bg-primary-50/50 hover:bg-primary-50"
                      )}
                    >
                      {/* Icon */}
                      <div className="w-8 h-8 rounded-lg flex items-center
                                      justify-center text-sm shrink-0 mt-0.5
                                      border"
                           style={{ background: "white" }}>
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={clsx(
                          "text-xs leading-snug line-clamp-2",
                          notif.read
                            ? "text-surface-600"
                            : "text-surface-900 font-medium"
                        )}>
                          {notif.message || notif.title || "New notification"}
                        </p>
                        <p className="text-2xs text-surface-400 mt-1">
                          {formatRelativeTime(notif.createdAt)}
                        </p>
                      </div>

                      {/* Dot */}
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-primary-500
                                        shrink-0 mt-1.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-surface-100 px-4 py-3">
              <button
                onClick={() => {
                  navigate("/notifications");
                  setOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2
                           text-xs font-semibold text-primary-600
                           hover:text-primary-700 transition-colors"
              >
                View all notifications
                <ArrowRight size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;