// src/components/ui/Modal.jsx
import { useEffect, useRef } from "react";
import { X }                 from "lucide-react";
import clsx                  from "clsx";
import useOutsideClick       from "../../hooks/useOutsideClick";

const SIZE_CLASSES = {
  sm:   "max-w-sm",
  md:   "max-w-md",
  lg:   "max-w-lg",
  xl:   "max-w-xl",
  "2xl": "max-w-2xl",
  full: "max-w-full mx-4",
};

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size       = "md",
  closable   = true,
  className,
}) => {
  const contentRef = useRef(null);
  useOutsideClick(contentRef, closable ? onClose : () => {});

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ESC key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && closable) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, closable]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 p-4 bg-surface-900/50 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={contentRef}
        className={clsx(
          "relative w-full bg-white rounded-2xl shadow-soft-xl",
          "animate-fade-up flex flex-col max-h-[90vh]",
          SIZE_CLASSES[size],
          className
        )}
      >
        {/* Header */}
        {(title || closable) && (
          <div className="flex items-start justify-between px-6 py-5
                          border-b border-surface-100 shrink-0">
            <div>
              {title && (
                <h3 className="text-base font-semibold text-surface-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-surface-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
            {closable && (
              <button
                onClick={onClose}
                className="ml-4 shrink-0 w-8 h-8 rounded-lg flex items-center
                           justify-center text-surface-400
                           hover:bg-surface-100 hover:text-surface-600
                           transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 px-6 py-4 border-t border-surface-100
                          bg-surface-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;