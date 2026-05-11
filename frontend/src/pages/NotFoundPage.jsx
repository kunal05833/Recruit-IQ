// src/pages/NotFoundPage.jsx
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/ui/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-surface-50 px-4">
      <div className="text-center max-w-md animate-fade-up">
        {/* Illustration */}
        <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center
                        justify-center mx-auto mb-6 border border-primary-100">
          <span className="text-4xl">🔍</span>
        </div>

        <h1 className="text-6xl font-bold text-surface-900 mb-3">404</h1>
        <h2 className="text-xl font-semibold text-surface-700 mb-3">
          Page not found
        </h2>
        <p className="text-surface-500 text-sm leading-relaxed mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            Go back
          </Button>
          <Button
            leftIcon={<Home size={16} />}
            onClick={() => navigate("/")}
          >
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;