// src/features/auth/pages/SignupPage.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User, Mail, Lock, Briefcase, ArrowRight, Check } from "lucide-react";
import {
  signupUser,
  selectAuthLoading,
  selectAuthError,
  clearAuthError,
} from "../authSlice";
import { validators } from "../../../utils/validators";
import { ROLES } from "../../../utils/constants";
import useForm from "../../../hooks/useForm";
import Button from "../../../components/ui/Button";
import Input  from "../../../components/ui/Input";
import clsx   from "clsx";
import toast  from "react-hot-toast";

// ─── Validation Rules ─────────────────────────────────────────
const VALIDATION_RULES = {
  name:     [validators.required, validators.minLength(2)],
  email:    [validators.required, validators.email],
  password: [validators.required, validators.minLength(6)],
  role:     [validators.required],
};

const INITIAL_VALUES = {
  name:     "",
  email:    "",
  password: "",
  role:     "CANDIDATE",
};

// ─── Role Options ─────────────────────────────────────────────
const ROLE_OPTIONS = [
  {
    value: ROLES.CANDIDATE,
    label: "Candidate",
    description: "Looking for opportunities",
    icon: "👤",
  },
  {
    value: ROLES.RECRUITER,
    label: "Recruiter",
    description: "Hiring top talent",
    icon: "🧑‍💼",
  },
];

const SignupPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const isLoading = useSelector(selectAuthLoading);
  const error     = useSelector(selectAuthError);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    validate,
  } = useForm(INITIAL_VALUES, VALIDATION_RULES);

  useEffect(() => {
    return () => { dispatch(clearAuthError()); };
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(signupUser(values));

    if (signupUser.fulfilled.match(result)) {
      toast.success("Account created! Please sign in.");
      navigate("/auth/login", { replace: true });
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 6)  score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: "",         color: "" },
      { label: "Weak",     color: "bg-danger-500"  },
      { label: "Fair",     color: "bg-warning-500" },
      { label: "Good",     color: "bg-info-500"    },
      { label: "Strong",   color: "bg-success-500" },
      { label: "Very Strong", color: "bg-success-600" },
    ];
    return { strength: score, ...levels[score] };
  };

  const pwStrength = getPasswordStrength(values.password);

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-surface-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-surface-500">
          Start your journey with TalentAI today
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Role Selector */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            I am a <span className="text-danger-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map((option) => (
              <RoleOption
                key={option.value}
                option={option}
                selected={values.role === option.value}
                onSelect={(val) => setFieldValue("role", val)}
              />
            ))}
          </div>
          {touched.role && errors.role && (
            <p className="text-xs text-danger-600 mt-1.5">{errors.role}</p>
          )}
        </div>

        {/* Name */}
        <Input
          label="Full name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name && errors.name}
          leftIcon={<User size={16} />}
          required
          autoComplete="name"
        />

        {/* Email */}
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          leftIcon={<Mail size={16} />}
          required
          autoComplete="email"
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            leftIcon={<Lock size={16} />}
            required
            autoComplete="new-password"
            hint="Minimum 6 characters"
          />

          {/* Password Strength Bar */}
          {values.password && (
            <div className="mt-2 space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={clsx(
                      "h-1 flex-1 rounded-full transition-all duration-300",
                      level <= pwStrength.strength
                        ? pwStrength.color
                        : "bg-surface-200"
                    )}
                  />
                ))}
              </div>
              {pwStrength.label && (
                <p className="text-xs text-surface-500">
                  Strength:{" "}
                  <span className="font-medium text-surface-700">
                    {pwStrength.label}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs text-surface-500 leading-relaxed">
          By creating an account, you agree to our{" "}
          <button type="button" className="text-primary-600 hover:underline font-medium">
            Terms of Service
          </button>{" "}
          and{" "}
          <button type="button" className="text-primary-600 hover:underline font-medium">
            Privacy Policy
          </button>.
        </p>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          rightIcon={<ArrowRight size={16} />}
        >
          Create account
        </Button>
      </form>

      {/* Sign In Link */}
      <p className="mt-8 text-center text-sm text-surface-500">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

// ─── Role Option Component ────────────────────────────────────
const RoleOption = ({ option, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(option.value)}
    className={clsx(
      "relative flex flex-col items-start gap-1 p-3.5 rounded-xl border-2",
      "transition-all duration-150 text-left w-full",
      selected
        ? "border-primary-500 bg-primary-50"
        : "border-surface-200 bg-white hover:border-surface-300 hover:bg-surface-50"
    )}
  >
    {selected && (
      <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-primary-500
                      rounded-full flex items-center justify-center">
        <Check size={10} className="text-white stroke-[3]" />
      </div>
    )}
    <span className="text-xl">{option.icon}</span>
    <span className={clsx(
      "text-sm font-semibold",
      selected ? "text-primary-700" : "text-surface-800"
    )}>
      {option.label}
    </span>
    <span className="text-xs text-surface-500 leading-tight">
      {option.description}
    </span>
  </button>
);

export default SignupPage;