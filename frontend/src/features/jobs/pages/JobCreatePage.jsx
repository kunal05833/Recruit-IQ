// src/features/jobs/pages/JobCreatePage.jsx
import { useNavigate } from "react-router-dom";
import PageHeader      from "../../../components/shared/PageHeader";
import JobCreateForm   from "../components/JobCreateForm";

const JobCreatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-up">
      <PageHeader
        title="Post a New Job"
        subtitle="Fill in the details to create a new job listing"
        breadcrumbs={[
          { label: "Jobs", href: "/jobs" },
          { label: "Create" },
        ]}
      />
      <JobCreateForm />
    </div>
  );
};

export default JobCreatePage;