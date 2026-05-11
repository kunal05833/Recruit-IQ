// src/features/notifications/components/NotificationItem.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  MoreHorizontal, Check, Eye,
  EyeOff, Trash2,
} from "lucide-react";
import clsx from "clsx";
import {
  markAsRead,
  markAsUnread,
  deleteNotification,
} from "../notificationSlice";
import { getNotifConfig }   from "../utils/notifConfig";
import { formatRelativeTime } from "../../../utils/formatters";
import useOutsideClick       from "../../../hooks/useOutsideClick";
import { useRef }            from "react";

const NotificationItem = ({ notification, compact = false }) => {
  const dispatch  = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef   = useRef(null);
  const config    = getNotifConfig(notification.type);

  useOutsideClick(menuRef, () => setShowMenu(false));

  const handleMarkRead = (e) => {
    e.stopPropagation();
    dispatch(markAsRead(notification.id));
    setShowMenu(false);
  };

  const handleMarkUnread = (e) => {
    e.stopPropagation();
    dispatch(markAsUnread(notification.id));
    setShowMenu(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deleteNotification(notification.id));
    setShowMenu(false);
  };

  const handleClick = () => {
    if (!notification.read) {
      dispatch(markAsRead(notification.id));
    }
  };

  return (
    <div
      onClick={handleClick}
      className={clsx(
        "flex items-start gap-3 p-4 transition-colors duration-100",
        "border-b border-surface-100 last:border-0 group cursor-pointer",
        notification.read
          ? "hover:bg-surface-50"
          : "bg-primary-50/40 hover:bg-primary-50/60"
      )}
    >
      {/* Icon */}
      <div className={clsx(
        "w-9 h-9 rounded-xl flex items-center justify-center",
        "text-base shrink-0 border",
        config.color,
        config.border
      )}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Type Label */}
            <p className="text-2xs font-semibold text-surface-400
                           uppercase tracking-wider mb-0.5">
              {config.label}
            </p>

            {/* Message */}
            <p className={clsx(
              "text-sm leading-snug",
              notification.read
                ? "text-surface-600"
                : "text-surface-900 font-medium"
            )}>
              {notification.message ||
               notification.title ||
               "New notification"}
            </p>

            {/* Time */}
            <p className="text-xs text-surface-400 mt-1">
              {formatRelativeTime(
                notification.createdAt || notification.timestamp
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Unread dot */}
            {!notification.read && (
              <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
            )}

            {/* Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu((p) => !p);
                }}
                className={clsx(
                  "w-7 h-7 rounded-lg flex items-center justify-center",
                  "text-surface-400 transition-colors",
                  "opacity-0 group-hover:opacity-100",
                  "hover:bg-surface-200 hover:text-surface-600"
                )}
              >
                <MoreHorizontal size={14} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-1 z-50
                                w-44 bg-white rounded-xl border border-surface-200
                                shadow-soft-lg py-1 animate-fade-up">
                  {notification.read ? (
                    <MenuButton
                      icon={<EyeOff size={13} />}
                      label="Mark as unread"
                      onClick={handleMarkUnread}
                    />
                  ) : (
                    <MenuButton
                      icon={<Check size={13} />}
                      label="Mark as read"
                      onClick={handleMarkRead}
                    />
                  )}
                  <div className="my-1 h-px bg-surface-100" />
                  <MenuButton
                    icon={<Trash2 size={13} />}
                    label="Delete"
                    onClick={handleDelete}
                    danger
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuButton = ({ icon, label, onClick, danger = false }) => (
  <button
    onClick={onClick}
    className={clsx(
      "w-full flex items-center gap-2.5 px-3 py-2",
      "text-xs font-medium transition-colors text-left",
      danger
        ? "text-danger-600 hover:bg-danger-50"
        : "text-surface-700 hover:bg-surface-50"
    )}
  >
    <span className={danger ? "text-danger-500" : "text-surface-400"}>
      {icon}
    </span>
    {label}
  </button>
);

export default NotificationItem;