// src/features/auth/pages/LoginPage.jsx
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, ArrowRight } from "lucide-react";
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
  selectUserRole,
  clearAuthError,
} from "../authSlice";
import { getDashboardRoute } from "../../../utils/roleHelpers";
import { validators } from "../../../utils/validators";
import useForm from "../../../hooks/useForm";
import Button from "../../../components/ui/Button";
import Input  from "../../../components/ui/Input";
import toast  from "react-hot-toast";

const VALIDATION_RULES = {
  email:    [validators.required, validators.email],
  password: [validators.required],
};

const INITIAL_VALUES = { email: "", password: "" };

const LoginPage = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const isLoading       = useSelector(selectAuthLoading);
  const error           = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role            = useSelector(selectUserRole);

  const { values, errors, touched, handleChange, handleBlur, validate } =
    useForm(INITIAL_VALUES, VALIDATION_RULES);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(getDashboardRoute(role), { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  useEffect(() => {
    return () => { dispatch(clearAuthError()); };
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(loginUser(values));

    if (loginUser.fulfilled.match(result)) {
      toast.success("Welcome back!");
      // result.payload = { accessToken, refreshToken, role, ... } — already unwrapped
      navigate(getDashboardRoute(result.payload.role), { replace: true });
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-surface-900 tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-surface-500">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
          autoFocus
        />

        <div className="space-y-1.5">
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            leftIcon={<Lock size={16} />}
            required
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          loading={isLoading}
          rightIcon={<ArrowRight size={16} />}
          className="mt-2"
        >
          Sign in
        </Button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-surface-50 rounded-xl border border-surface-200">
        <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
          Demo credentials
        </p>
        <div className="space-y-2">
          {[
            { role: "Admin",     email: "admin@demo.com",     password: "password123" },
            { role: "Recruiter", email: "recruiter@demo.com", password: "password123" },
            { role: "Candidate", email: "candidate@demo.com", password: "password123" },
          ].map((demo) => (
            <DemoCredentialRow key={demo.role} {...demo} />
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-surface-500">
        Don't have an account?{" "}
        <Link
          to="/auth/signup"
          className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
};

const DemoCredentialRow = ({ role, email, password }) => {
  const ROLE_COLORS = {
    Admin:     "bg-primary-100 text-primary-700",
    Recruiter: "bg-success-50 text-success-700",
    Candidate: "bg-warning-50 text-warning-700",
  };

  return (
    <div className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-surface-100 transition-colors group">
      <div className="flex items-center gap-2">
        <span className={`text-2xs font-semibold px-1.5 py-0.5 rounded ${ROLE_COLORS[role]}`}>
          {role}
        </span>
        <span className="text-xs text-surface-600 font-mono">{email}</span>
      </div>
      <span className="text-xs text-surface-400 font-mono">{password}</span>
    </div>
  );
};

export default LoginPage;
