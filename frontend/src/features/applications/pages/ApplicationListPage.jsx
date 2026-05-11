// src/features/applications/pages/ApplicationListPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector }     from "react-redux";
import { LayoutGrid, List, Download, RefreshCw } from "lucide-react";
import clsx from "clsx";
import {
  fetchAllApplications,
  setAppFilters,
  clearAppFilters,
  setAppPagination,
  selectAllApplications,
  selectApplicationsLoading,
  selectApplicationFilters,
  selectApplicationPagination,
} from "../applicationSlice";
import useDebounce   from "../../../hooks/useDebounce";
import usePagination from "../../../hooks/usePagination";
import useRole       from "../../../hooks/useRole";

import PageHeader            from "../../../components/shared/PageHeader";
import SearchBar             from "../../../components/shared/SearchBar";
import Pagination            from "../../../components/shared/Pagination";
import Button                from "../../../components/ui/Button";
import Skeleton              from "../../../components/ui/Skeleton";
import ApplicationCard       from "../components/ApplicationCard";
import ApplicationTableRow   from "../components/ApplicationTableRow";
import ApplicationFilters    from "../components/ApplicationFilters";
import ApplicationStats      from "../components/ApplicationStats";
import ApplicationEmptyState from "../components/ApplicationEmptyState";

const VIEW_MODES = { GRID: "grid", TABLE: "table" };

const ApplicationListPage = () => {
  const dispatch    = useDispatch();
  const apps        = useSelector(selectAllApplications);
  const isLoading   = useSelector(selectApplicationsLoading);
  const filters     = useSelector(selectApplicationFilters);
  const pagination  = useSelector(selectApplicationPagination);

  const { isCandidate } = useRole();

  const [viewMode,    setViewMode]    = useState(VIEW_MODES.TABLE);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const debouncedSearch = useDebounce(searchValue, 400);

  // ✅ FIX: Role-based fetch
  // Candidate  → GET /applications/my       (sirf apni applications)
  // Recruiter  → GET /applications/job/{id} ya GET /applications (admin/recruiter endpoint)
  // Pehle: fetchAllApplications hamesha call hota tha → recruiter ke liye 403
  const loadApplications = (extraParams = {}) => {
    dispatch(
      fetchAllApplications({
        search: debouncedSearch,
        status: filters.status,
        jobId:  filters.jobId,
        page:   pagination.page - 1,
        size:   pagination.pageSize,
        // ✅ isCandidate flag backend service mein use hoga endpoint decide karne ke liye
        isCandidate,
        ...extraParams,
      })
    );
  };

  useEffect(() => {
    loadApplications();
  }, [dispatch, debouncedSearch, filters, pagination.page, isCandidate]);

  useEffect(() => {
    dispatch(setAppFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // Client-side filter
  const filteredApps = useMemo(() => {
    let list = [...apps];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.jobTitle?.toLowerCase().includes(q) ||
          a.candidateName?.toLowerCase().includes(q) ||
          String(a.jobId).includes(q) ||
          String(a.candidateId).includes(q)
      );
    }

    if (filters.status) {
      list = list.filter(
        (a) => (a.status || "PENDING").toUpperCase() === filters.status
      );
    }

    if (filters.jobId) {
      list = list.filter(
        (a) => String(a.jobId) === String(filters.jobId)
      );
    }

    return list;
  }, [apps, filters]);

  const {
    currentPage,
    totalPages,
    paginationRange,
    goToPage,
    startIndex,
    endIndex,
  } = usePagination(
    pagination.total || filteredApps.length,
    pagination.pageSize
  );

  const paginatedApps = pagination.total
    ? filteredApps
    : filteredApps.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    goToPage(page);
    dispatch(setAppPagination({ page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    !!filters.status || !!filters.jobId || !!filters.search;

  const handleClearFilters = () => {
    dispatch(clearAppFilters());
    setSearchValue("");
  };

  const handleRefresh = () => loadApplications({ page: 0 });

  const tableColumns = isCandidate
    ? ["#", "Job Position", "Status", "Applied", "Actions"]
    : ["#", "Job Position", "Candidate", "Status", "Applied", "Actions"];

  return (
    <div className="space-y-5 animate-fade-up">
      <PageHeader
        title={isCandidate ? "My Applications" : "All Applications"}
        subtitle={
          isCandidate
            ? "Track the status of your job applications"
            : "Manage and review all candidate applications"
        }
        breadcrumbs={[{ label: "Applications" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              onClick={handleRefresh}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Download size={14} />}
            >
              Export
            </Button>
          </div>
        }
      />

      <ApplicationStats applications={apps} isLoading={isLoading} />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue("")}
          placeholder={
            isCandidate
              ? "Search by job title..."
              : "Search by job, candidate..."
          }
          className="flex-1"
        />

        <div className="flex items-center bg-surface-100 rounded-lg p-1 shrink-0">
          {[
            { mode: VIEW_MODES.TABLE, icon: <List       size={15} /> },
            { mode: VIEW_MODES.GRID,  icon: <LayoutGrid size={15} /> },
          ].map(({ mode, icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={clsx(
                "flex items-center justify-center w-8 h-8 rounded-md",
                "transition-all duration-150",
                viewMode === mode
                  ? "bg-white text-primary-600 shadow-soft-sm"
                  : "text-surface-500 hover:text-surface-700"
              )}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <ApplicationFilters
        filters={filters}
        onFilterChange={(f) => dispatch(setAppFilters(f))}
        onClearFilters={handleClearFilters}
        resultCount={filteredApps.length}
        isLoading={isLoading}
      />

      {isLoading ? (
        viewMode === VIEW_MODES.GRID ? (
          <GridSkeleton />
        ) : (
          <TableSkeleton isCandidate={isCandidate} />
        )
      ) : filteredApps.length === 0 ? (
        <ApplicationEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      ) : viewMode === VIEW_MODES.GRID ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedApps.map((app, index) => (
              <ApplicationCard key={app.id || index} application={app} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            paginationRange={paginationRange}
            className="bg-white rounded-xl border border-surface-200"
          />
        </>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  {tableColumns.map((col) => (
                    <th
                      key={col}
                      className="table-header text-left first:pl-4 last:text-right last:pr-4"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedApps.map((app, index) => (
                  <ApplicationTableRow
                    key={app.id || index}
                    application={app}
                    index={(currentPage - 1) * pagination.pageSize + index}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between
                          px-4 py-3 border-t border-surface-100
                          bg-surface-50/50">
            <p className="text-xs text-surface-500">
              Showing{" "}
              <span className="font-medium text-surface-700">
                {startIndex + 1}–{Math.min(endIndex, filteredApps.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-surface-700">
                {filteredApps.length}
              </span>{" "}
              applications
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              paginationRange={paginationRange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Skeletons
const GridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="card p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-12 rounded-lg" />
          ))}
        </div>
        <div className="flex gap-2 pt-1 border-t border-surface-100">
          <Skeleton className="h-8 flex-1 rounded-lg" />
          <Skeleton className="h-8 flex-1 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

const TableSkeleton = ({ isCandidate }) => (
  <div className="card overflow-hidden">
    <div className="p-4 bg-surface-50 border-b border-surface-200">
      <div className="flex gap-6">
        {(isCandidate ? [40, 200, 100, 100, 100] : [40, 180, 140, 100, 100, 100])
          .map((w, i) => (
            <Skeleton key={i} className="h-4" style={{ width: w }} />
          ))}
      </div>
    </div>
    {Array.from({ length: 7 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 px-4 py-4
                   border-b border-surface-100 last:border-0"
      >
        <Skeleton className="w-5 h-4" />
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="w-7 h-7 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        {!isCandidate && (
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        )}
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-3.5 w-24" />
        <div className="flex gap-1.5">
          <Skeleton className="h-7 w-14 rounded-lg" />
          {!isCandidate && <Skeleton className="h-7 w-18 rounded-lg" />}
        </div>
      </div>
    ))}
  </div>
);

export default ApplicationListPage;