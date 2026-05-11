// src/features/jobs/pages/JobEditPage.jsx — NEW FILE
// ✅ FIX #10: Recruiters can now edit jobs — reuses JobCreateForm with initialData
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { fetchJobById, updateJob, selectSelectedJob, selectJobDetailLoad } from "../jobSlice";
import JobCreateForm from "../components/JobCreateForm";
import Spinner from "../../../components/ui/Spinner";

const JobEditPage = () => {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const job       = useSelector(selectSelectedJob);
  const isLoading = useSelector(selectJobDetailLoad);

  useEffect(() => {
    dispatch(fetchJobById(id));
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateJob({ id, data: formData })).unwrap();
      toast.success("Job updated successfully!");
      navigate(`/jobs/${id}`);
    } catch (e) {
      toast.error(e || "Failed to update job.");
    }
  };

  if (isLoading || !job) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  return <JobCreateForm initialData={job} onSubmit={handleSubmit} isEdit />;
};

export default JobEditPage;
