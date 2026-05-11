// src/features/applications/components/ApplicationEmptyState.jsx
import { useNavigate } from "react-router-dom";
import { Briefcase, FileText } from "lucide-react";
import EmptyState from "../../../components/ui/EmptyState";
import Button     from "../../../components/ui/Button";
import useRole    from "../../../hooks/useRole";

const ApplicationEmptyState = ({ hasFilters, onClearFilters }) => {
  const navigate       = useNavigate();
  const { isCandidate } = useRole();

  if (hasFilters) {
    return (
      <EmptyState
        icon="🔍"
        title="No applications match your filters"
        description="Try adjusting your status filter or search criteria"
        className="card py-20"
        action={
          <Button variant="secondary" size="sm" onClick={onClearFilters}>
            Clear Filters
          </Button>
        }
      />
    );
  }

  if (isCandidate) {
    return (
      <EmptyState
        icon="📋"
        title="No applications yet"
        description="Start applying to jobs to track your application status here"
        className="card py-20"
        action={
          <Button
            leftIcon={<Briefcase size={14} />}
            onClick={() => navigate("/jobs")}
          >
            Browse Available Jobs
          </Button>
        }
      />
    );
  }

  return (
    <EmptyState
      icon="📄"
      title="No applications received"
      description="Applications from candidates will appear here once they apply to your jobs"
      className="card py-20"
      action={
        <Button
          variant="secondary"
          leftIcon={<FileText size={14} />}
          onClick={() => navigate("/jobs")}
        >
          View Job Listings
        </Button>
      }
    />
  );
};

export default ApplicationEmptyState;