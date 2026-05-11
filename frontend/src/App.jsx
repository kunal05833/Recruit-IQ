// src/App.jsx
import { Suspense }        from "react";
import { useSelector }     from "react-redux";
import AppRoutes           from "./routes/AppRoutes";
import ToastProvider       from "./components/shared/ToastProvider";
import ErrorBoundary       from "./components/shared/ErrorBoundary";
import ScrollToTop         from "./components/shared/ScrollToTop";
import LoadingBar          from "./components/shared/LoadingBar";
import { PageSpinner }     from "./components/ui/Spinner";

const App = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <LoadingBar />
      <Suspense fallback={<PageSpinner />}>
        <AppRoutes />
      </Suspense>
      <ToastProvider />
    </ErrorBoundary>
  );
};

export default App;