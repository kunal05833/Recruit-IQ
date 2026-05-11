// src/features/applications/components/ApplicationFilters.jsx
import { X, Filter, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { ALL_STATUSES, getStatusConfig } from "../utils/statusConfig";
import ApplicationStatusBadge from "./ApplicationStatusBadge";

const ApplicationFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  resultCount,
  isLoading,
  showCandidateFilter = false,
}) => {
  const activeCount = [
    !!filters.status,
    !!filters.jobId,
  ].filter(Boolean).length;

  return (
    <div className="card p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* ── Status Filter ─────────────────────────── */}
        <div className="flex-1">
          <p className="text-xs font-semibold text-surface-500
                        uppercase tracking-wider mb-2">
            Filter by Status
          </p>
          <div className="flex flex-wrap gap-2">
            {/* All option */}
            <button
              onClick={() => onFilterChange({ status: "" })}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-medium border",
                "transition-all duration-150",
                !filters.status
                  ? "bg-surface-900 text-white border-surface-900"
                  : "bg-white text-surface-600 border-surface-200 hover:border-surface-300"
              )}
            >
              All Applications
            </button>

            {ALL_STATUSES.map((status) => {
              const config    = getStatusConfig(status);
              const isActive  = filters.status === status;
              return (
                <button
                  key={status}
                  onClick={() =>
                    onFilterChange({
                      status: isActive ? "" : status,
                    })
                  }
                  className={clsx(
                    "inline-flex items-center gap-1.5 px-3 py-1.5",
                    "rounded-lg text-xs font-medium border transition-all duration-150",
                    isActive
                      ? `${config.bg} ${config.text} ${config.border}`
                      : "bg-white text-surface-600 border-surface-200 hover:border-surface-300"
                  )}
                >
                  <span>{config.icon}</span>
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right Controls ─────────────────────────── */}
        <div className="flex items-center gap-3 shrink-0">
          {resultCount !== undefined && (
            <span className="text-xs text-surface-500 whitespace-nowrap">
              {isLoading ? "..." : `${resultCount} result${resultCount !== 1 ? "s" : ""}`}
            </span>
          )}
          {activeCount > 0 && (
            <button
              onClick={onClearFilters}
              className="text-xs text-danger-600 hover:text-danger-700
                         font-medium flex items-center gap-1 transition-colors
                         whitespace-nowrap"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters;