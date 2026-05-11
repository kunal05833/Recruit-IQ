// src/components/shared/Pagination.jsx
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  paginationRange,
  className,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div
      className={clsx(
        "flex items-center justify-between px-4 py-3",
        "border-t border-surface-100",
        className
      )}
    >
      {/* Info */}
      <p className="text-xs text-surface-500">
        Page <span className="font-medium text-surface-700">{currentPage}</span>
        {" "}of{" "}
        <span className="font-medium text-surface-700">{totalPages}</span>
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <PageButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </PageButton>

        {/* Page Numbers */}
        {paginationRange?.map((page, index) =>
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="w-8 h-8 flex items-center justify-center
                         text-xs text-surface-400"
            >
              ···
            </span>
          ) : (
            <PageButton
              key={page}
              onClick={() => onPageChange(page)}
              active={page === currentPage}
            >
              {page}
            </PageButton>
          )
        )}

        {/* Next */}
        <PageButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </PageButton>
      </div>
    </div>
  );
};

// ─── Page Button ──────────────────────────────────────────────
const PageButton = ({ children, active, disabled, onClick, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      "w-8 h-8 flex items-center justify-center rounded-lg",
      "text-xs font-medium transition-all duration-100",
      "disabled:opacity-40 disabled:cursor-not-allowed",
      active
        ? "bg-primary-600 text-white shadow-sm"
        : "text-surface-600 hover:bg-surface-100"
    )}
    {...props}
  >
    {children}
  </button>
);

export default Pagination;