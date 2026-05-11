// src/features/jobs/components/JobCreateForm.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, FileText, Star,
  Plus, X, Send, ArrowLeft,
} from "lucide-react";
import {
  createJob,
  selectJobCreating,
  selectJobCreateError,
} from "../jobSlice";
import { validators } from "../../../utils/validators";
import useForm from "../../../hooks/useForm";
import Button     from "../../../components/ui/Button";
import Input      from "../../../components/ui/Input";
import SkillBadge from "../../candidates/components/SkillBadge";
import toast      from "react-hot-toast";

// ─── Validation Rules ─────────────────────────────────────────
const VALIDATION_RULES = {
  title:               [validators.required, validators.minLength(3)],
  description:         [validators.required, validators.minLength(20)],
  experienceRequired:  [validators.required, validators.positiveNumber],
};

const INITIAL_VALUES = {
  title:              "",
  description:        "",
  experienceRequired: "",
};

const SUGGESTED_SKILLS = [
  "React", "Java", "Python", "Node.js", "TypeScript",
  "SQL", "AWS", "Spring Boot", "MongoDB", "Docker",
  "Vue.js", "Angular", "GraphQL", "Kubernetes", "Redis",
];

// ✅ FIX: Accept isEdit and onSubmit as props
const JobCreateForm = ({ isEdit = false, onSubmit = null, initialValues = null }) => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const isCreating  = useSelector(selectJobCreating);
  const createError = useSelector(selectJobCreateError);

  const [skills,     setSkills]     = useState(initialValues?.requiredSkills || []);
  const [skillInput, setSkillInput] = useState("");

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
  } = useForm(
    initialValues || INITIAL_VALUES,
    VALIDATION_RULES
  );

  // ── Skill helpers ────────────────────────────────────────────
  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const removeSkill = (skill) =>
    setSkills((prev) => prev.filter((s) => s !== skill));

  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
    if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (skills.length === 0) {
      toast.error("Please add at least one required skill.");
      return;
    }

    const jobData = {
      title:              values.title.trim(),
      description:        values.description.trim(),
      requiredSkills:     skills,
      experienceRequired: Number(values.experienceRequired),
    };

    // ✅ FIX: isEdit and onSubmit now properly received as props
    if (isEdit && onSubmit) {
      await onSubmit(jobData);
      return;
    }

    const result = await dispatch(createJob(jobData));

    if (createJob.fulfilled.match(result)) {
      toast.success("Job posted successfully!");
      reset();
      setSkills([]);
      navigate("/jobs");
    } else {
      toast.error(result.payload || "Failed to create job. Please try again.");
    }
  };

  const suggestedNotAdded = SUGGESTED_SKILLS.filter(
    (s) => !skills.includes(s)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* ── Section 1: Job Info ──────────────────────── */}
      <div className="card p-6 space-y-5">
        <SectionHeader
          icon={<Briefcase size={16} />}
          title="Job Information"
          subtitle="Basic details about the position"
        />

        <Input
          label="Job Title"
          name="title"
          placeholder="e.g. Senior Frontend Developer"
          value={values.title}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.title && errors.title}
          required
          autoFocus
          leftIcon={<Briefcase size={15} />}
        />

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-surface-700">
            Job Description
            <span className="text-danger-500 ml-0.5">*</span>
          </label>
          <textarea
            name="description"
            rows={5}
            placeholder="Describe the role, responsibilities, and requirements..."
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-input resize-none leading-relaxed ${
              touched.description && errors.description
                ? "border-danger-400 focus:ring-danger-400"
                : ""
            }`}
          />
          {touched.description && errors.description && (
            <p className="text-xs text-danger-600 flex items-center gap-1">
              <X size={11} />
              {errors.description}
            </p>
          )}
          <p className="text-xs text-surface-400 text-right">
            {values.description.length} characters
          </p>
        </div>

        {/* Experience */}
        <Input
          label="Required Experience (years)"
          name="experienceRequired"
          type="number"
          min="0"
          max="30"
          placeholder="e.g. 3"
          value={values.experienceRequired}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.experienceRequired && errors.experienceRequired}
          required
          hint="Enter 0 for entry-level / fresher positions"
        />
      </div>

      {/* ── Section 2: Skills ────────────────────────── */}
      <div className="card p-6 space-y-5">
        <SectionHeader
          icon={<Star size={16} />}
          title="Required Skills"
          subtitle="Add the technical skills required for this position"
        />

        {/* Skill Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-surface-700">
            Add Skills
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              placeholder="Type a skill and press Enter..."
              className="form-input flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              size="md"
              leftIcon={<Plus size={14} />}
              onClick={() => addSkill(skillInput)}
              disabled={!skillInput.trim()}
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-surface-400">
            Press Enter or comma to add multiple skills
          </p>
        </div>

        {/* Added Skills */}
        {skills.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2.5">
              Added Skills ({skills.length})
            </p>
            <div className="flex flex-wrap gap-2 p-3 bg-surface-50 rounded-xl border border-surface-200">
              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="inline-flex items-center gap-1 px-2.5 py-1
                             bg-white border border-surface-300 rounded-lg
                             text-xs font-medium text-surface-700
                             hover:border-danger-300 hover:text-danger-600
                             hover:bg-danger-50 transition-colors group"
                >
                  {skill}
                  <X size={11} className="text-surface-400 group-hover:text-danger-500" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Skills */}
        {suggestedNotAdded.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-2.5">
              Suggested Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedNotAdded.slice(0, 10).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className="inline-flex items-center gap-1 px-2.5 py-1
                             bg-surface-100 text-surface-600 rounded-lg
                             text-xs font-medium hover:bg-primary-50
                             hover:text-primary-700 transition-colors border
                             border-surface-200"
                >
                  <Plus size={10} />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Warning if no skills */}
        {skills.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-warning-50
                          border border-warning-200 rounded-xl text-warning-700">
            <Star size={14} className="shrink-0" />
            <p className="text-xs">At least one skill is required to post a job.</p>
          </div>
        )}
      </div>

      {/* ── Preview Card ─────────────────────────────── */}
      {(values.title || values.description || skills.length > 0) && (
        <div className="card p-5 border-primary-200 bg-primary-50/30">
          <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
            Preview
          </p>
          <div className="space-y-2">
            {values.title && (
              <h3 className="text-base font-bold text-surface-900">{values.title}</h3>
            )}
            {values.experienceRequired && (
              <p className="text-xs text-surface-500">
                {values.experienceRequired}+ years experience required
              </p>
            )}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} size="sm" />
                ))}
              </div>
            )}
            {values.description && (
              <p className="text-xs text-surface-600 leading-relaxed pt-1">
                {values.description.slice(0, 150)}
                {values.description.length > 150 && "..."}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Actions ──────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          leftIcon={<ArrowLeft size={15} />}
          onClick={() => navigate("/jobs")}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="lg"
          fullWidth
          loading={isCreating}
          leftIcon={!isCreating && <Send size={15} />}
        >
          {isCreating
            ? (isEdit ? "Updating Job..." : "Posting Job...")
            : (isEdit ? "Update Job"    : "Post Job")}
        </Button>
      </div>
    </form>
  );
};

// ─── Section Header ───────────────────────────────────────────
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-start gap-3 pb-2 border-b border-surface-100">
    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center
                    justify-center text-primary-600 shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-surface-800">{title}</h3>
      {subtitle && (
        <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>
      )}
    </div>
  </div>
);

export default JobCreateForm;