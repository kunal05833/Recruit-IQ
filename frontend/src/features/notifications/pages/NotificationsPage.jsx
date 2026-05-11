// src/features/notifications/pages/NotificationsPage.jsx
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell, CheckCheck, Trash2,
  RefreshCw,
} from "lucide-react";
import {
  fetchNotifications,
  markAllAsRead,
  markAllNotificationsRead,
  markNotificationRead,
  clearAllNotifications,
  setFilter,
  selectNotifications,
  selectUnreadCount,
  selectNotifLoading,
  selectNotifFilter,
} from "../notificationSlice";
import { generateMockNotifications } from "../utils/notifConfig";
import { addNotification }   from "../notificationSlice";

import PageHeader                from "../../../components/shared/PageHeader";
import Button                    from "../../../components/ui/Button";
import Skeleton                  from "../../../components/ui/Skeleton";
import NotificationItem          from "../components/NotificationItem";
import NotificationFilterTabs    from "../components/NotificationFilterTabs";
import NotificationEmptyState    from "../components/NotificationEmptyState";
import toast                     from "react-hot-toast";

const NotificationsPage = () => {
  const dispatch     = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount  = useSelector(selectUnreadCount);
  const isLoading    = useSelector(selectNotifLoading);
  const filter       = useSelector(selectNotifFilter);

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchNotifications()).then((result) => {
      // If API returns empty (not implemented), load mocks
      if (
        fetchNotifications.fulfilled.match(result) &&
        Array.isArray(result.payload) &&
        result.payload.length === 0
      ) {
        generateMockNotifications(12).forEach((n) =>
          dispatch(addNotification(n))
        );
      }
    });
  }, [dispatch]);

  // ── Filter notifications ─────────────────────────────────────
  const filteredNotifications = useMemo(() => {
    switch (filter) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "read":
        return notifications.filter((n) => n.read);
      default:
        return notifications;
    }
  }, [notifications, filter]);

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
    toast.success("All notifications marked as read.");
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
    toast.success("All notifications cleared.");
  };

  const handleRefresh = () => {
    dispatch(fetchNotifications());
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      {/* ── Header ───────────────────────────────────────── */}
      <PageHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
            : "You're all caught up!"
        }
        breadcrumbs={[{ label: "Notifications" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw size={13} />}
              onClick={handleRefresh}
              loading={isLoading}
            >
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<CheckCheck size={13} />}
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Trash2 size={13} />}
                onClick={handleClearAll}
                className="text-danger-600 hover:bg-danger-50"
              >
                Clear all
              </Button>
            )}
          </div>
        }
      />

      {/* ── Stats Bar ────────────────────────────────────── */}
      <NotifStatsBar
        total={notifications.length}
        unread={unreadCount}
        read={notifications.length - unreadCount}
      />

      {/* ── Filter Tabs + Content ─────────────────────────── */}
      <div className="card overflow-hidden">
        {/* Tabs Header */}
        <div className="flex items-center justify-between px-5 py-4
                        border-b border-surface-100">
          <NotificationFilterTabs
            activeFilter={filter}
            onFilterChange={(f) => dispatch(setFilter(f))}
            unreadCount={unreadCount}
            totalCount={notifications.length}
          />

          {filteredNotifications.length > 0 && (
            <p className="text-xs text-surface-400">
              {filteredNotifications.length} item
              {filteredNotifications.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <NotificationSkeleton />
        ) : filteredNotifications.length === 0 ? (
          <NotificationEmptyState filter={filter} />
        ) : (
          <div className="divide-y divide-surface-50">
            {filteredNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Stats Bar ────────────────────────────────────────────────
const NotifStatsBar = ({ total, unread, read }) => (
  <div className="grid grid-cols-3 gap-4">
    {[
      {
        label: "Total",
        value: total,
        bg:    "bg-surface-50",
        text:  "text-surface-900",
        icon:  "🔔",
      },
      {
        label: "Unread",
        value: unread,
        bg:    "bg-primary-50",
        text:  "text-primary-700",
        icon:  "📬",
      },
      {
        label: "Read",
        value: read,
        bg:    "bg-success-50",
        text:  "text-success-700",
        icon:  "✅",
      },
    ].map((stat) => (
      <div
        key={stat.label}
        className={`card p-4 text-center ${stat.bg} border-0`}
      >
        <p className="text-xl mb-0.5">{stat.icon}</p>
        <p className={`text-2xl font-bold ${stat.text}`}>
          {stat.value}
        </p>
        <p className="text-xs text-surface-500 mt-0.5">
          {stat.label}
        </p>
      </div>
    ))}
  </div>
);

// ─── Loading Skeleton ─────────────────────────────────────────
const NotificationSkeleton = () => (
  <div className="divide-y divide-surface-100">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-start gap-3 p-4">
        <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export default NotificationsPage;