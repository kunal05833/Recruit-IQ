// src/features/admin/pages/AdminUsersPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector }     from "react-redux";
import { LayoutGrid, List, RefreshCw, UserPlus } from "lucide-react";
import clsx from "clsx";
import {
  fetchAllUsers,
  deleteUser,
  setAdminFilters,
  clearAdminFilters,
  setAdminPagination,
  selectAllUsers,
  selectAdminLoading,
  selectIsDeleting,
  selectDeletingId,
  selectAdminFilters,
  selectAdminPagination,
} from "../adminSlice";
import {
  fetchDashboardStats,
  selectDashboardStats,
} from "../../analytics/analyticsSlice";
import useDebounce   from "../../../hooks/useDebounce";
import usePagination from "../../../hooks/usePagination";

import PageHeader        from "../../../components/shared/PageHeader";
import SearchBar         from "../../../components/shared/SearchBar";
import Pagination        from "../../../components/shared/Pagination";
import Button            from "../../../components/ui/Button";
import Skeleton          from "../../../components/ui/Skeleton";
import EmptyState        from "../../../components/ui/EmptyState";
import UserTableRow      from "../components/UserTableRow";
import UserCard          from "../components/UserCard";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import AdminRoleFilter   from "../components/AdminRoleFilter";
import AdminSystemStats  from "../components/AdminSystemStats";
import toast             from "react-hot-toast";

const VIEW_MODES = { GRID: "grid", TABLE: "table" };

const AdminUsersPage = () => {
  const dispatch    = useDispatch();
  const users       = useSelector(selectAllUsers);
  const isLoading   = useSelector(selectAdminLoading);
  const isDeleting  = useSelector(selectIsDeleting);
  const deletingId  = useSelector(selectDeletingId);
  const filters     = useSelector(selectAdminFilters);
  const pagination  = useSelector(selectAdminPagination);
  const dashStats   = useSelector(selectDashboardStats);

  const [viewMode,     setViewMode]     = useState(VIEW_MODES.TABLE);
  const [searchValue,  setSearchValue]  = useState(filters.search || "");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(searchValue, 400);

  // ── Fetch data ───────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchAllUsers({
      search: debouncedSearch,
      role:   filters.role,
      page:   pagination.page - 1,
      size:   pagination.pageSize,
    }));
  }, [dispatch, debouncedSearch, filters.role, pagination.page]);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setAdminFilters({ search: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  // ── Client-side filter ───────────────────────────────────────
  const filteredUsers = useMemo(() => {
    let list = [...users];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          String(u.id).includes(q)
      );
    }

    if (filters.role) {
      list = list.filter(
        (u) => u.role?.toUpperCase() === filters.role
      );
    }

    return list;
  }, [users, filters]);

  // ── Role counts (for filter buttons) ─────────────────────────
  const userCounts = useMemo(() =>
    users.reduce((acc, u) => {
      const r = u.role?.toUpperCase() || "UNKNOWN";
      acc[r]  = (acc[r] || 0) + 1;
      return acc;
    }, {}),
  [users]);

  // ── Pagination ───────────────────────────────────────────────
  const {
    currentPage,
    totalPages,
    paginationRange,
    goToPage,
    startIndex,
    endIndex,
  } = usePagination(
    pagination.total || filteredUsers.length,
    pagination.pageSize
  );

  const paginatedUsers = pagination.total
    ? filteredUsers
    : filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    goToPage(page);
    dispatch(setAdminPagination({ page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Delete handlers ──────────────────────────────────────────
  const handleDeleteClick = (user) => {
    setDeleteTarget(user);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const result = await dispatch(deleteUser(deleteTarget.id));

    if (deleteUser.fulfilled.match(result)) {
      toast.success(`${deleteTarget.name} has been deleted.`);
      setDeleteTarget(null);
    } else {
      toast.error(result.payload || "Failed to delete user.");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleRefresh = () => {
    dispatch(fetchAllUsers({
      page: 0,
      size: pagination.pageSize,
    }));
  };

  const hasActiveFilters = !!filters.role || !!filters.search;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* ── Header ───────────────────────────────────────── */}
      <PageHeader
        title="User Management"
        subtitle="View, filter, and manage all registered users"
        breadcrumbs={[
          { label: "Admin",        href: "/admin"       },
          { label: "Manage Users"                       },
        ]}
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
          </div>
        }
      />

      {/* ── System Stats ─────────────────────────────────── */}
      <AdminSystemStats
        users={users}
        dashStats={dashStats}
        isLoading={isLoading}
      />

      {/* ── Role Filter ───────────────────────────────────── */}
      <div className="card p-4 space-y-3">
        <p className="text-xs font-semibold text-surface-500
                      uppercase tracking-wider">
          Filter by Role
        </p>
        <AdminRoleFilter
          selectedRole={filters.role}
          onRoleChange={(role) => {
            dispatch(setAdminFilters({ role }));
          }}
          userCounts={userCounts}
        />
      </div>

      {/* ── Search + View Toggle ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          onClear={() => {
            setSearchValue("");
            dispatch(setAdminFilters({ search: "" }));
          }}
          placeholder="Search by name, email, or ID..."
          className="flex-1"
        />

        {/* View Toggle */}
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

      {/* ── Result Count ─────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-600">
          Showing{" "}
          <span className="font-semibold text-surface-900">
            {filteredUsers.length}
          </span>{" "}
          user{filteredUsers.length !== 1 ? "s" : ""}
          {filters.role && (
            <span className="text-surface-500">
              {" "}— {filters.role.charAt(0) + filters.role.slice(1).toLowerCase()}s only
            </span>
          )}
        </p>
        {hasActiveFilters && (
          <button
            onClick={() => {
              dispatch(clearAdminFilters());
              setSearchValue("");
            }}
            className="text-xs text-danger-600 hover:text-danger-700
                       font-medium transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────── */}
      {isLoading ? (
        viewMode === VIEW_MODES.GRID ? (
          <UserGridSkeleton />
        ) : (
          <UserTableSkeleton />
        )
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon="👥"
          title={
            hasActiveFilters
              ? "No users match your filters"
              : "No users found"
          }
          description={
            hasActiveFilters
              ? "Try adjusting your search or role filter"
              : "No users are registered in the system yet"
          }
          className="card py-20"
          action={
            hasActiveFilters && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  dispatch(clearAdminFilters());
                  setSearchValue("");
                }}
              >
                Clear Filters
              </Button>
            )
          }
        />
      ) : viewMode === VIEW_MODES.GRID ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onDelete={handleDeleteClick}
                isDeleting={isDeleting && deletingId === user.id}
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
        /* ── Table View ─────────────────────────────────── */
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-50 border-b border-surface-200">
                <tr>
                  {[
                    "#",
                    "User",
                    "Role",
                    "ID",
                    "Joined",
                    "Status",
                    "Actions",
                  ].map((col, i) => (
                    <th
                      key={col}
                      className={clsx(
                        "table-header text-left",
                        i === 0 && "pl-4",
                        i === 6 && "text-right pr-4"
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user, index) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    index={
                      (currentPage - 1) * pagination.pageSize + index
                    }
                    onDelete={handleDeleteClick}
                    isDeleting={isDeleting && deletingId === user.id}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex flex-col sm:flex-row items-center
                          justify-between gap-3 px-4 py-3
                          border-t border-surface-100 bg-surface-50/50">
            <p className="text-xs text-surface-500">
              {startIndex + 1}–
              {Math.min(endIndex, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
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

      {/* ── Delete Confirm Modal ──────────────────────── */}
      {deleteTarget && (
        <DeleteConfirmModal
          user={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

// ─── Loading Skeletons ────────────────────────────────────────
const UserGridSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="card p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-full" />
          ))}
        </div>
        <div className="pt-1 border-t border-surface-100">
          <Skeleton className="h-8 w-full rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

const UserTableSkeleton = () => (
  <div className="card overflow-hidden">
    <div className="p-4 bg-surface-50 border-b border-surface-200">
      <div className="flex gap-6">
        {[40, 200, 80, 60, 100, 70, 120].map((w, i) => (
          <Skeleton key={i} className="h-4" style={{ width: w }} />
        ))}
      </div>
    </div>
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 px-4 py-4
                   border-b border-surface-100 last:border-0"
      >
        <Skeleton className="w-5 h-4" />
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-44" />
          </div>
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-3.5 w-12 font-mono" />
        <Skeleton className="h-3.5 w-24" />
        <div className="flex items-center gap-1.5">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-3.5 w-12" />
        </div>
        <div className="flex gap-2 ml-auto">
          <Skeleton className="h-7 w-14 rounded-lg" />
          <Skeleton className="h-7 w-18 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export default AdminUsersPage;