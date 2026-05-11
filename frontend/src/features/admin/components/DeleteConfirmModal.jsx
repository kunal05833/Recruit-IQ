// src/features/admin/components/DeleteConfirmModal.jsx
import { AlertTriangle, Trash2, X } from "lucide-react";
import Button  from "../../../components/ui/Button";
import Avatar  from "../../../components/ui/Avatar";
import UserRoleBadge from "./UserRoleBadge";

const DeleteConfirmModal = ({
  user,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 p-4 bg-surface-900/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="bg-white rounded-2xl shadow-soft-xl w-full max-w-md
                   animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5
                        border-b border-surface-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-danger-50 flex items-center
                            justify-center">
              <Trash2 size={16} className="text-danger-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-surface-900">
                Delete User
              </h3>
              <p className="text-xs text-surface-500">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-surface-400 hover:bg-surface-100
                       hover:text-surface-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 p-4 bg-danger-50
                          border border-danger-200 rounded-xl">
            <AlertTriangle
              size={16}
              className="text-danger-500 shrink-0 mt-0.5"
            />
            <p className="text-sm text-danger-700 leading-relaxed">
              You are about to permanently delete this user account.
              All associated data will be removed and{" "}
              <strong>cannot be recovered</strong>.
            </p>
          </div>

          {/* User Preview */}
          <div className="flex items-center gap-3 p-4 bg-surface-50
                          rounded-xl border border-surface-200">
            <Avatar
              name={user.name}
              size="md"
              className="shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-surface-500 truncate">
                {user.email}
              </p>
            </div>
            <UserRoleBadge role={user.role} />
          </div>

          {/* Confirmation text */}
          <p className="text-sm text-surface-600 text-center">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-surface-900">
              {user.name}
            </span>
            ?
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-surface-100">
          <Button
            variant="secondary"
            fullWidth
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            fullWidth
            loading={isDeleting}
            leftIcon={!isDeleting && <Trash2 size={14} />}
            onClick={onConfirm}
          >
            {isDeleting ? "Deleting..." : "Delete User"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;