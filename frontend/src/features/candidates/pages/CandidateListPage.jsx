// src/features/candidates/pages/CandidateListPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector }     from "react-redux";
import { Users, LayoutGrid, List, Download } from "lucide-react";
import clsx from "clsx";
import {
  fetchAllCandidates,
  setFilters,
  clearFilters,
  setPagination,
  selectAllCandidates,
  selectCandidatesLoading,
  selectCandidateFilters,
  selectCandidatePagination,
} from "../candidateSlice";
import useDebounce  from "../../../hooks/useDebounce";
import usePagination from "../../../hooks/usePagination";

import PageHeader       from "../../../components/shared/PageHeader";
import SearchBar        from "../../../components/shared/SearchBar";
import Pagination       from "../../../components/shared/Pagination";
import Button           from "../../../components/ui/Button";
import Skeleton         from "../../../components/ui/Skeleton";
import EmptyState       from "../../../components/ui/EmptyState";
import CandidateCard    from "../components/CandidateCard";
import CandidateFilters from "../components/CandidateFilters";
import CandidateTableRow from "../components/CandidateTableRow";
import { SkeletonCard } from "../../../components/ui/Skeleton";

const VIEW_MODES = { GRID: "grid", TABLE: "table" };

const CandidateListPage = () => {
  const dispatch    = useDispatch();
  const candidates  = useSelector(selectAllCandidates);
  const isLoading   = useSelector(selectCandidatesLoading);
  const filters     = useSelector(selectCandidateFilters);
  const pagination  = useSelector(selectCandidatePagination);

  const [viewMode,    setViewMode]    = useState(VIEW_MODES.TABLE);
  const [searchValue, setSearchValue] = useState(filters.search || "");

  const debouncedSearch = useDebounce(searchValue, 400);

  // ── Fetch on filter/page change ──────────────────────────────
  useEffect(() => {
    dispatch(
      fetchAllCandidates({
        search:        debouncedSearch,
        skills:        filters.skills?.join(","),
        minExperience: filters.minExperience,
        maxExperience: filters.maxExperience,
        page:          pagination.page - 1,     // 0-indexed for Spring
        size:          pagination.pageSize,
      })
    );
  }, [dispatch, debouncedSearch, filters, pagination.page]);

  // ── Update search filter in Redux ────────────────────────────
  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // ── Client-side filtering (fallback if backend no filter) ────
  const filteredCandidates = useMemo(() => {
    let list = [...candidates];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.skills?.length > 0) {
      list = list.filter((c) =>
        filters.skills.every((skill) =>
          c.skills?.some((s) =>
            s.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    if (filters.minExperience !== "") {
      list = list.filter(
        (c) => c.experience >= Number(filters.minExperience)
      );
    }

    if (filters.maxExperience !== "") {
      list = list.filter(
        (c) => c.experience <= Number(filters.maxExperience)
      );
    }

    return list;
  }, [candidates, filters]);

  // ── Pagination ───────────────────────────────────────────────
  const {
    currentPage,
    totalPages,
    paginationRange,
    goToPage,
    startIndex,
    endIndex,
  } = usePagination(
    pagination.total || filteredCandidates.length,
    pagination.pageSize
  );

  const paginatedCandidates = pagination.total
    ? filteredCandidates         // server handles pagination
    : filteredCandidates.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    goToPage(page);
    dispatch(setPagination({ page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchValue("");
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* ── Header ───────────────────────────────────────── */}
      <PageHeader
        title="Candidates"
        subtitle={`${filteredCandidates.length} candidate${filteredCandidates.length !== 1 ? "s" : ""} in the system`}
        breadcrumbs={[{ label: "Dashboard" }, { label: "Candidates" }]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={14} />}
          >
            Export
          </Button>
        }
      />

      {/* ── Search + View Toggle ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => setSearchValue("")}
          placeholder="Search candidates by name or skill..."
          className="flex-1"
        />

        {/* View Mode Toggle */}
        <div className="flex items-center bg-surface-100 rounded-lg p-1 shrink-0">
          {[
            { mode: VIEW_MODES.TABLE, icon: <List   size={15} /> },
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

      {/* ── Filters ──────────────────────────────────────── */}
      <CandidateFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        resultCount={filteredCandidates.length}
        isLoading={isLoading}
      />

      {/* ── Content ──────────────────────────────────────── */}
      {isLoading ? (
        viewMode === VIEW_MODES.GRID ? (
          <LoadingGrid />
        ) : (
          <LoadingTable />
        )
      ) : filteredCandidates.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No candidates found"
          description={
            filters.search || filters.skills?.length > 0
              ? "Try adjusting your search or filters"
              : "No candidates are registered in the system yet"
          }
          action={
            (filters.search || filters.skills?.length > 0) && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )
          }
          className="card py-20"
        />
      ) : viewMode === VIEW_MODES.GRID ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
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
        <CandidateTable
          candidates={paginatedCandidates}
          currentPage={currentPage}
          totalPages={totalPages}
          paginationRange={paginationRange}
          onPageChange={handlePageChange}
          pageSize={pagination.pageSize}
        />
      )}
    </div>
  );
};

// ─── Candidate Table ──────────────────────────────────────────
const CandidateTable = ({
  candidates,
  currentPage,
  totalPages,
  paginationRange,
  onPageChange,
  pageSize,
}) => (
  <div className="card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-surface-50 border-b border-surface-200">
          <tr>
            {["#", "Candidate", "Experience", "Skills", "Actions"].map(
              (col) => (
                <th
                  key={col}
                  className="table-header text-left first:pl-4 last:text-right last:pr-4"
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-50">
          {candidates.map((candidate, index) => (
            <CandidateTableRow
              key={candidate.id}
              candidate={candidate}
              index={(currentPage - 1) * pageSize + index}
            />
          ))}
        </tbody>
      </table>
    </div>
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      paginationRange={paginationRange}
    />
  </div>
);

// ─── Loading States ───────────────────────────────────────────
const LoadingGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

const LoadingTable = () => (
  <div className="card overflow-hidden">
    <div className="p-4 border-b border-surface-200">
      <Skeleton className="h-8 w-full" />
    </div>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 px-4 py-4
                               border-b border-surface-100 last:border-0">
        <Skeleton className="w-8 h-8 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded-md" />
          <Skeleton className="h-5 w-14 rounded-md" />
        </div>
        <Skeleton className="h-7 w-16 rounded-lg" />
      </div>
    ))}
  </div>
);

export default CandidateListPage;