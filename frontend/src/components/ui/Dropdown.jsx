// src/components/ui/Dropdown.jsx
import { useRef, useState } from "react";
import clsx from "clsx";
import useOutsideClick from "../../hooks/useOutsideClick";
import { Check } from "lucide-react";

const Dropdown = ({
  trigger,
  items     = [],
  align     = "right",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);

  useOutsideClick(ref, () => setOpen(false));

  const ALIGN_CLASSES = {
    left:  "left-0",
    right: "right-0",
  };

  return (
    <div ref={ref} className={clsx("relative inline-block", className)}>
      {/* Trigger */}
      <div onClick={() => setOpen((prev) => !prev)}>
        {trigger}
      </div>

      {/* Menu */}
      {open && (
        <div
          className={clsx(
            "absolute top-full mt-2 z-50 min-w-[180px]",
            "bg-white rounded-xl border border-surface-200",
            "shadow-soft-lg py-1.5",
            "animate-fade-up",
            ALIGN_CLASSES[align]
          )}
        >
          {items.map((item, index) => {
            if (item.type === "divider") {
              return (
                <div
                  key={index}
                  className="my-1 h-px bg-surface-100"
                />
              );
            }

            if (item.type === "label") {
              return (
                <p
                  key={index}
                  className="px-3 py-1.5 text-2xs font-semibold text-surface-400
                             uppercase tracking-wider"
                >
                  {item.label}
                </p>
              );
            }

            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                disabled={item.disabled}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2",
                  "text-sm transition-colors duration-100 text-left",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  item.danger
                    ? "text-danger-600 hover:bg-danger-50"
                    : "text-surface-700 hover:bg-surface-50",
                  item.active && "bg-primary-50 text-primary-700"
                )}
              >
                {item.icon && (
                  <span className={clsx(
                    "shrink-0",
                    item.danger   ? "text-danger-500"  : "text-surface-400",
                    item.active   && "text-primary-500"
                  )}>
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                {item.active && (
                  <Check size={14} className="text-primary-500 shrink-0" />
                )}
                {item.badge && (
                  <span className="text-xs bg-primary-100 text-primary-700
                                   px-1.5 py-0.5 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dropdown;