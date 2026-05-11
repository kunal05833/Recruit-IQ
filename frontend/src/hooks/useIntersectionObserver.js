// src/hooks/useIntersectionObserver.js
import { useState, useEffect, useRef } from "react";

const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px",
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return { ref, isVisible, hasBeenVisible };
};

export default useIntersectionObserver;