// src/features/admin/components/UserTableRow.jsx
import { Trash2, Eye } from "lucide-react";
import clsx from "clsx";
import Avatar        from "../../../components/ui/Avatar";
import Button        from "../../../components/ui/Button";
import UserRoleBadge from "./UserRoleBadge";
import { formatDate } from "../../../utils/formatters";
import { useSelector } from "react-redux";
import { selectAuth }  from "../../auth/authSlice";

const UserTableRow = ({
  user,
  index,
  onDelete,
  isDeleting,
}) => {
  const auth       = useSelector(selectAuth);
  const isSelf     = auth?.user?.id === user.id ||
                     String(user.id) === String(auth?.user?.id);
  const isAdmin    = user.role === "ADMIN";

  return (
    <tr
      className={clsx(
        "border-b border-surface-100 last:border-0",
        "transition-colors duration-100 group",
        isSelf
          ? "bg-primary-50/30 hover:bg-primary-50/50"
          : "hover:bg-surface-50"
      )}
    >
      {/* # */}
      <td className="table-cell text-surface-400 font-mono text-xs w-10 pl-4">
        {index + 1}
      </td>

      {/* User */}
      <td className="table-cell">
        <div className="flex items-center gap-3">
          <Avatar
            name={user.name}
            size="sm"
            className="shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-surface-800 truncate
                            max-w-[160px]">
                {user.name}
              </p>
              {isSelf && (
                <span className="text-2xs bg-primary-100 text-primary-700
                                 px-1.5 py-0.5 rounded-full font-semibold">
                  You
                </span>
              )}
            </div>
            <p className="text-xs text-surface-500 truncate max-w-[160px]">
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="table-cell">
        <UserRoleBadge role={user.role} />
      </td>

      {/* ID */}
      <td className="table-cell text-xs text-surface-500 font-mono">
        #{user.id}
      </td>

      {/* Joined */}
      <td className="table-cell text-xs text-surface-500 whitespace-nowrap">
        {formatDate(user.createdAt) || "—"}
      </td>

      {/* Status */}
      <td className="table-cell">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-success-500" />
          <span className="text-xs text-surface-600">Active</span>
        </div>
      </td>

      {/* Actions */}
      <td className="table-cell pr-4">
        <div className="flex items-center justify-end gap-1.5
                        opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Eye size={13} />}
            disabled={isDeleting}
          >
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={13} />}
            disabled={isSelf || isDeleting}
            loading={isDeleting}
            onClick={() => !isSelf && onDelete(user)}
            className={clsx(
              !isSelf && "text-danger-600 hover:bg-danger-50",
              isSelf  && "opacity-30 cursor-not-allowed"
            )}
          >
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default UserTableRow;