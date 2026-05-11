// src/features/jobs/pages/JobListPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector }     from "react-redux";
import { useNavigate }                  from "react-router-dom";
import { Plus, LayoutGrid, List }       from "lucide-react";
import clsx from "clsx";
import {
  fetchAllJobs,
  searchJobs,
  filterJobs,
  setJobFilters,
  clearJobFilters,
  setJobPagination,
  selectAllJobs,
  selectJobsLoading,
  selectJobFilters,
  selectJobPagination,
} from "../jobSlice";
import {
  submitApplication,
  selectApplicationSubmitting,
} from "../../applications/applicationSlice";
import useDebounce   from "../../../hooks/useDebounce";
import usePagination from "../../../hooks/usePagination";
import useRole       from "../../../hooks/useRole";
import { selectUserProfile } from "../../../redux/slices/userSlice";

import PageHeader    from "../../../components/shared/PageHeader";
import SearchBar     from "../../../components/shared/SearchBar";
import Pagination    from "../../../components/shared/Pagination";
import Button        from "../../../components/ui/Button";
import EmptyState    from "../../../components/ui/EmptyState";
import Skeleton      from "../../../components/ui/Skeleton";
import JobCard       from "../components/JobCard";
import JobFilters    from "../components/JobFilters";
import JobTableRow   from "../components/JobTableRow";
import ApplyJobModal from "../components/ApplyJobModal";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import toast from "react-hot-toast";

const VIEW_MODES = { GRID: "grid", TABLE: "table" };

const JobListPage = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const jobs       = useSelector(selectAllJobs);
  const isLoading  = useSelector(selectJobsLoading);
  const filters    = useSelector(selectJobFilters);
  const pagination = useSelector(selectJobPagination);
  const isApplying = useSelector(selectApplicationSubmitting);
  const profile    = useSelector(selectUserProfile);

  const { canCreateJob, isCandidate } = useRole();

  const [viewMode,    setViewMode]    = useState(VIEW_MODES.TABLE);
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [applyModal,  setApplyModal]  = useState(null);
  const [applyingId,  setApplyingId]  = useState(null);

  const debouncedSearch = useDebounce(searchValue, 400);

  // ── Fetch ────────────────────────────────────────────────────
  useEffect(() => {
    // ✅ FIX: Route to correct API endpoint based on active filters
    if (debouncedSearch) {
      dispatch(searchJobs({ keyword: debouncedSearch, page: pagination.page - 1, size: pagination.pageSize }));
    } else if (filters.location || filters.jobType) {
      dispatch(filterJobs({ location: filters.location, jobType: filters.jobType, page: pagination.page - 1, size: pagination.pageSize }));
    } else {
      dispatch(fetchAllJobs({
        page:          pagination.page - 1,
        size:          pagination.pageSize,
        skills:        filters.skills?.join(","),
        minExperience: filters.minExperience,
        maxExperience: filters.maxExperience,
      }));
    }
  }, [dispatch, debouncedSearch, filters, pagination.page]);

  useEffect(() => {
    dispatch(setJobFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // ── Client-side filter ───────────────────────────────────────
  const filteredJobs = useMemo(() => {
    let list = [...jobs];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          j.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.skills?.length > 0) {
      list = list.filter((j) =>
        filters.skills.every((skill) =>
          j.skills?.some((s) =>
            s.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters.minExperience !== "") {
      list = list.filter(
        (j) => j.experienceRequired >= Number(filters.minExperience)
      );
    }

    if (filters.maxExperience !== "") {
      list = list.filter(
        (j) => j.experienceRequired <= Number(filters.maxExperience)
      );
    }

    return list;
  }, [jobs, filters]);

  // ── Pagination ───────────────────────────────────────────────
  const {
    currentPage,
    totalPages,
    paginationRange,
    goToPage,
    startIndex,
    endIndex,
  } = usePagination(
    pagination.total || filteredJobs.length,
    pagination.pageSize
  );

  const paginatedJobs = pagination.total
    ? filteredJobs
    : filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    goToPage(page);
    dispatch(setJobPagination({ page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Apply ────────────────────────────────────────────────────
  const handleApplyClick = (jobId) => {
    if (!profile) {
      toast.error("Please complete your profile before applying.");
      return;
    }
    const job = jobs.find((j) => j.id === jobId);
    setApplyModal(job);
  };

  const handleApplySuccess = () => {
    setApplyModal(null);
    setApplyingId(null);
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* Header */}
      <PageHeader
        title="Jobs"
        subtitle={`${filteredJobs.length} position${filteredJobs.length !== 1 ? "s" : ""} available`}
        breadcrumbs={[{ label: "Jobs" }]}
        actions={
          canCreateJob && (
            <Button
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => navigate("/jobs/create")}
            >
              Post Job
            </Button>
          )
        }
      />

      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue("")}
          placeholder="Search jobs by title, skill..."
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
                "flex items-center justify-center w-8 h-8 rounded-md transition-all duration-150",
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

      {/* Filters */}
      <JobFilters
        filters={filters}
        onFilterChange={(f) => dispatch(setJobFilters(f))}
        onClearFilters={() => {
          dispatch(clearJobFilters());
          setSearchValue("");
        }}
        resultCount={filteredJobs.length}
        isLoading={isLoading}
      />

      {/* Content */}
      {isLoading ? (
        viewMode === VIEW_MODES.GRID ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <JobTableSkeleton />
        )
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon="💼"
          title="No jobs found"
          description={
            filters.search || filters.skills?.length > 0
              ? "Try adjusting your filters"
              : canCreateJob
              ? "Post your first job!"
              : "No listings available."
          }
          className="card py-20"
          action={
            canCreateJob ? (
              <Button
                leftIcon={<Plus size={14} />}
                onClick={() => navigate("/jobs/create")}
              >
                Post Job
              </Button>
            ) : null
          }
        />
      ) : viewMode === VIEW_MODES.GRID ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={isCandidate ? handleApplyClick : undefined}
                isApplying={isApplying && applyingId === job.id}
              />
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
                  {["#","Job Title","Experience","Skills","Posted","Actions"].map((col) => (
                    <th key={col} className="table-header text-left first:pl-4 last:text-right last:pr-4">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job, index) => (
                  <JobTableRow
                    key={job.id}
                    job={job}
                    index={(currentPage - 1) * pagination.pageSize + index}
                    onApply={isCandidate ? handleApplyClick : undefined}
                    isApplying={isApplying && applyingId === job.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            paginationRange={paginationRange}
          />
        </div>
      )}

      {/* Apply Modal */}
      {applyModal && (
        <ApplyJobModal
          job={applyModal}
          onClose={() => setApplyModal(null)}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

// ─── Table Skeleton ───────────────────────────────────────────
const JobTableSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="p-4 bg-surface-50 border-b border-surface-200">
      <div className="flex gap-6">
        {[60, 200, 100, 160, 80, 100].map((w, i) => (
          <Skeleton key={i} className="h-4" style={{ width: w }} />
        ))}
      </div>
    </div>
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-surface-100 last:border-0">
        <Skeleton className="w-5 h-4" />
        <div className="flex items-center gap-3 flex-1">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
        <Skeleton className="h-3.5 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16 rounded-lg" />
          <Skeleton className="h-7 w-16 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export default JobListPage;