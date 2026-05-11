// src/components/shared/ErrorBoundary.jsx
import { Component } from "react";
import { RefreshCw, Home, AlertTriangle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError:  false,
      error:     null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log to console in dev
    if (import.meta.env.DEV) {
      console.group("🔴 ErrorBoundary caught:");
      console.error("Error:",     error);
      console.error("Info:",      errorInfo);
      console.groupEnd();
    }
  }

  handleReset = () => {
    this.setState({
      hasError:  false,
      error:     null,
      errorInfo: null,
    });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({
      hasError:  false,
      error:     null,
      errorInfo: null,
    });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-50 flex items-center
                        justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6 animate-fade-up">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-danger-50 rounded-3xl flex items-center
                              justify-center border border-danger-100">
                <AlertTriangle size={36} className="text-danger-500" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-surface-900">
                Something went wrong
              </h1>
              <p className="text-surface-500 text-sm leading-relaxed">
                An unexpected error occurred. Our team has been notified.
                Please try refreshing the page or return to the dashboard.
              </p>
            </div>

            {/* Error Details (dev only) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="text-left bg-surface-100 rounded-xl p-4
                                  border border-surface-200">
                <summary className="text-xs font-semibold text-surface-600
                                    cursor-pointer mb-2">
                  Error Details (dev only)
                </summary>
                <pre className="text-2xs text-danger-700 overflow-auto
                                max-h-32 font-mono leading-relaxed">
                  {this.state.error.toString()}
                  {"\n\n"}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2.5
                           bg-surface-100 text-surface-700 rounded-lg
                           text-sm font-medium hover:bg-surface-200
                           transition-colors border border-surface-200"
              >
                <Home size={15} />
                Go Home
              </button>
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5
                           bg-primary-600 text-white rounded-lg
                           text-sm font-medium hover:bg-primary-700
                           transition-colors shadow-sm"
              >
                <RefreshCw size={15} />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ─── Feature-level boundary (lighter UI) ─────────────────────
export const FeatureErrorBoundary = ({ children, featureName }) => (
  <ErrorBoundary featureName={featureName}>
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;