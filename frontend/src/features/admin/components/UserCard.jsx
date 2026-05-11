// src/features/admin/components/UserCard.jsx
import { Trash2, Shield, Mail, Hash } from "lucide-react";
import clsx from "clsx";
import Avatar        from "../../../components/ui/Avatar";
import Button        from "../../../components/ui/Button";
import UserRoleBadge from "./UserRoleBadge";
import { formatDate } from "../../../utils/formatters";
import { useSelector } from "react-redux";
import { selectAuth }  from "../../auth/authSlice";

const UserCard = ({ user, onDelete, isDeleting, className }) => {
  const auth   = useSelector(selectAuth);
  const isSelf = String(user.id) === String(auth?.user?.id);

  return (
    <div
      className={clsx(
        "card p-5 space-y-4",
        "hover:shadow-soft-md hover:border-surface-300",
        "transition-all duration-200",
        isSelf && "border-primary-200 bg-primary-50/20",
        className
      )}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <Avatar name={user.name} size="md" />
            {/* Online Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3
                            bg-success-500 rounded-full border-2 border-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-sm font-semibold text-surface-900 truncate">
                {user.name}
              </p>
              {isSelf && (
                <span className="text-2xs bg-primary-100 text-primary-700
                                 px-1.5 py-0.5 rounded-full font-bold">
                  You
                </span>
              )}
            </div>
            <UserRoleBadge role={user.role} className="mt-1" />
          </div>
        </div>
      </div>

      {/* ── Info Grid ───────────────────────────────────── */}
      <div className="space-y-2.5">
        <InfoItem
          icon={<Mail size={12} />}
          label="Email"
          value={user.email}
          mono={false}
        />
        <InfoItem
          icon={<Hash size={12} />}
          label="User ID"
          value={`#${user.id}`}
          mono
        />
        <InfoItem
          icon={<Shield size={12} />}
          label="Joined"
          value={formatDate(user.createdAt) || "—"}
        />
      </div>

      {/* ── Action ──────────────────────────────────────── */}
      {!isSelf && (
        <div className="pt-1 border-t border-surface-100">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            leftIcon={<Trash2 size={13} />}
            loading={isDeleting}
            onClick={() => onDelete(user)}
            className="text-danger-600 hover:bg-danger-50 hover:text-danger-700"
          >
            Delete User
          </Button>
        </div>
      )}

      {isSelf && (
        <div className="pt-1 border-t border-surface-100">
          <p className="text-xs text-center text-surface-400 italic">
            Cannot delete your own account
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Info Item ────────────────────────────────────────────────
const InfoItem = ({ icon, label, value, mono = false }) => (
  <div className="flex items-start gap-2">
    <span className="text-surface-400 mt-0.5 shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-2xs text-surface-400">{label}</p>
      <p
        className={clsx(
          "text-xs font-medium text-surface-700 truncate",
          mono && "font-mono"
        )}
      >
        {value || "—"}
      </p>
    </div>
  </div>
);

export default UserCard;