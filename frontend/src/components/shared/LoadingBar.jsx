// src/components/shared/LoadingBar.jsx
import { useEffect, useState } from "react";
import { useSelector }         from "react-redux";
import clsx                    from "clsx";

// Watch all loading states
const useAnyLoading = () => {
  const auth    = useSelector((s) => s.auth.isLoading);
  const user    = useSelector((s) => s.user.isLoading);
  const cands   = useSelector((s) => s.candidates.isLoading);
  const jobs    = useSelector((s) => s.jobs.isLoading);
  const apps    = useSelector((s) => s.applications.isLoading);
  const analytics = useSelector((s) => s.analytics.isLoading);
  const notifs  = useSelector((s) => s.notifications.isLoading);
  const admin   = useSelector((s) => s.admin?.isLoading);

  return auth || user || cands || jobs || apps || analytics || notifs || admin;
};

const LoadingBar = () => {
  const isLoading = useAnyLoading();
  const [visible, setVisible]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [fading, setFading]     = useState(false);

  useEffect(() => {
    let interval;
    let fadeTimeout;

    if (isLoading) {
      setVisible(true);
      setFading(false);
      setProgress(20);

      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 85) {
            clearInterval(interval);
            return 85;
          }
          return prev + Math.random() * 12;
        });
      }, 300);
    } else if (visible) {
      setProgress(100);
      fadeTimeout = setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setVisible(false);
          setProgress(0);
          setFading(false);
        }, 400);
      }, 200);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimeout);
    };
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div
      className={clsx(
        "fixed top-0 left-0 right-0 z-[100] h-0.5",
        "transition-opacity duration-400",
        fading ? "opacity-0" : "opacity-100"
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-primary-500 to-primary-400
                   transition-all duration-300 ease-out
                   shadow-[0_0_8px_rgba(59,130,246,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LoadingBar;