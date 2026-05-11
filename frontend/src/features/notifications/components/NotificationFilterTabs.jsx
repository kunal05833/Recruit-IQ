// src/features/notifications/components/NotificationFilterTabs.jsx
import clsx from "clsx";

const TABS = [
  { value: "all",    label: "All"    },
  { value: "unread", label: "Unread" },
  { value: "read",   label: "Read"   },
];

const NotificationFilterTabs = ({
  activeFilter,
  onFilterChange,
  unreadCount,
  totalCount,
}) => {
  const getCounts = (tab) => {
    if (tab === "all")    return totalCount;
    if (tab === "unread") return unreadCount;
    return totalCount - unreadCount;
  };

  return (
    <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-xl w-fit">
      {TABS.map((tab) => {
        const count    = getCounts(tab.value);
        const isActive = activeFilter === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={clsx(
              "flex items-center gap-1.5 px-3.5 py-2 rounded-lg",
              "text-xs font-semibold transition-all duration-150",
              isActive
                ? "bg-white text-surface-900 shadow-soft-sm"
                : "text-surface-500 hover:text-surface-700"
            )}
          >
            {tab.label}
            {count > 0 && (
              <span className={clsx(
                "text-2xs px-1.5 py-0.5 rounded-full font-bold",
                isActive
                  ? tab.value === "unread"
                    ? "bg-primary-100 text-primary-700"
                    : "bg-surface-100 text-surface-600"
                  : "bg-surface-200 text-surface-500"
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default NotificationFilterTabs;