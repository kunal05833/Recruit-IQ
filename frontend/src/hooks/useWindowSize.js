// src/hooks/useWindowSize.js
import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState({
    width:  window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timeout;

    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSize({
          width:  window.innerWidth,
          height: window.innerHeight,
        });
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeout);
    };
  }, []);

  return {
    ...size,
    isMobile:  size.width < 640,
    isTablet:  size.width >= 640 && size.width < 1024,
    isDesktop: size.width >= 1024,
  };
};

export default useWindowSize;