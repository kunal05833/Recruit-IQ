// src/components/ui/Table.jsx
import clsx from "clsx";
import Skeleton   from "./Skeleton";
import EmptyState from "./EmptyState";

const Table = ({
  columns    = [],
  data       = [],
  isLoading  = false,
  emptyTitle = "No data found",
  emptyDesc  = "",
  emptyIcon  = "📭",
  rowKey     = "id",
  className,
  skeletonRows = 6,
}) => {
  return (
    <div className={clsx("card overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Head */}
          <thead className="bg-surface-50 border-b border-surface-200">
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key || i}
                  className={clsx(
                    "table-header",
                    col.align === "right"  && "text-right",
                    col.align === "center" && "text-center",
                    !col.align             && "text-left",
                    i === 0               && "pl-4",
                    i === columns.length - 1 && "pr-4",
                    col.className
                  )}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-surface-100 last:border-0"
                >
                  {columns.map((col, j) => (
                    <td key={j} className="table-cell">
                      <Skeleton
                        className={clsx(
                          "h-4",
                          col.skeletonClass || "w-3/4"
                        )}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    description={emptyDesc}
                    compact
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row[rowKey] || rowIndex}
                  className="border-b border-surface-100 last:border-0
                             hover:bg-surface-50 transition-colors group"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={col.key || colIndex}
                      className={clsx(
                        "table-cell",
                        col.align === "right"  && "text-right",
                        col.align === "center" && "text-center",
                        colIndex === 0               && "pl-4",
                        colIndex === columns.length - 1 && "pr-4",
                        col.cellClassName
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : row[col.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;