// src/hooks/usePageTitle.js
import { useEffect } from "react";
import { APP_NAME }  from "../utils/constants";

const usePageTitle = (title) => {
  useEffect(() => {
    const prev = document.title;
    document.title = title
      ? `${title} — ${APP_NAME}`
      : APP_NAME;

    return () => {
      document.title = prev;
    };
  }, [title]);
};

export default usePageTitle;