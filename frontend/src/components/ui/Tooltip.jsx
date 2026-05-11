// src/components/ui/Tooltip.jsx
import { useState } from "react";
import clsx from "clsx";

const POSITION_CLASSES = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full  left-1/2 -translate-x-1/2 mt-2",
  left:   "right-full top-1/2 -translate-y-1/2 mr-2",
  right:  "left-full  top-1/2 -translate-y-1/2 ml-2",
};

const Tooltip = ({
  children,
  content,
  position = "top",
  className,
}) => {
  const [visible, setVisible] = useState(false);

  if (!content) return children;

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={clsx(
            "absolute z-50 px-2 py-1 text-xs font-medium",
            "bg-surface-900 text-white rounded-md whitespace-nowrap",
            "pointer-events-none animate-fade-in",
            POSITION_CLASSES[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;