// src/components/ui/Card.jsx
import clsx from "clsx";

// ─── Base Card ────────────────────────────────────────────────
const Card = ({
  children,
  className,
  hover    = false,
  padding  = "md",
  border   = true,
  shadow   = true,
  rounded  = "xl",
  onClick,
  ...props
}) => {
  const PADDING_CLASSES = {
    none: "",
    sm:   "p-3",
    md:   "p-5",
    lg:   "p-6",
    xl:   "p-8",
  };

  const ROUNDED_CLASSES = {
    md:   "rounded-md",
    lg:   "rounded-lg",
    xl:   "rounded-xl",
    "2xl":"rounded-2xl",
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-white",
        border && "border border-surface-200",
        shadow && "shadow-soft",
        ROUNDED_CLASSES[rounded],
        PADDING_CLASSES[padding],
        hover && [
          "transition-all duration-200",
          "hover:shadow-soft-md hover:border-surface-300",
          onClick && "cursor-pointer",
        ],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// ─── Card Header ──────────────────────────────────────────────
export const CardHeader = ({
  title,
  subtitle,
  actions,
  className,
  divider = true,
}) => (
  <div
    className={clsx(
      "flex items-start justify-between gap-4",
      divider && "pb-4 mb-4 border-b border-surface-100",
      className
    )}
  >
    <div className="min-w-0">
      {title && (
        <h3 className="text-sm font-semibold text-surface-800 leading-tight">
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="text-xs text-surface-500 mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
    {actions && (
      <div className="shrink-0 flex items-center gap-2">
        {actions}
      </div>
    )}
  </div>
);

// ─── Card Body ────────────────────────────────────────────────
export const CardBody = ({ children, className }) => (
  <div className={clsx("flex-1", className)}>
    {children}
  </div>
);

// ─── Card Footer ──────────────────────────────────────────────
export const CardFooter = ({
  children,
  className,
  divider = true,
}) => (
  <div
    className={clsx(
      divider && "pt-4 mt-4 border-t border-surface-100",
      className
    )}
  >
    {children}
  </div>
);

// ─── Stat Card ────────────────────────────────────────────────
export const StatCard = ({
  title,
  value,
  icon,
  color    = "primary",
  change,
  changeLabel,
  className,
}) => {
  const COLOR_MAP = {
    primary: "bg-primary-50 text-primary-600",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    danger:  "bg-danger-50  text-danger-600",
    purple:  "bg-purple-50  text-purple-600",
  };

  return (
    <Card className={clsx("hover:shadow-soft-md transition-shadow", className)}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-surface-500">{title}</p>
        {icon && (
          <div className={clsx(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
            COLOR_MAP[color] || COLOR_MAP.primary
          )}>
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-surface-900">{value}</p>
      {(change !== undefined || changeLabel) && (
        <p className="text-xs text-surface-500 mt-1">{changeLabel}</p>
      )}
    </Card>
  );
};

// ─── Info Card ────────────────────────────────────────────────
export const InfoCard = ({
  label,
  value,
  icon,
  className,
}) => (
  <div
    className={clsx(
      "flex items-start gap-3 p-3 bg-surface-50",
      "rounded-xl border border-surface-100",
      className
    )}
  >
    {icon && (
      <div className="w-7 h-7 rounded-lg bg-surface-200 flex items-center
                      justify-center text-surface-500 shrink-0 mt-0.5">
        {icon}
      </div>
    )}
    <div className="min-w-0">
      <p className="text-2xs font-medium text-surface-400 mb-0.5">
        {label}
      </p>
      <p className="text-sm font-semibold text-surface-800 truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

// ─── Clickable Card ───────────────────────────────────────────
export const ClickableCard = ({
  children,
  onClick,
  active   = false,
  className,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={clsx(
      "w-full text-left bg-white rounded-xl border",
      "transition-all duration-150 p-4",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
      active
        ? "border-primary-400 bg-primary-50/50 shadow-soft ring-1 ring-primary-200"
        : "border-surface-200 hover:border-surface-300 hover:shadow-soft",
      className
    )}
  >
    {children}
  </button>
);

// ─── Glass Card ───────────────────────────────────────────────
export const GlassCard = ({ children, className }) => (
  <div
    className={clsx(
      "bg-white/80 backdrop-blur-sm",
      "border border-white/20",
      "rounded-2xl shadow-soft-lg",
      className
    )}
  >
    {children}
  </div>
);

// ─── Gradient Card ────────────────────────────────────────────
export const GradientCard = ({
  children,
  from  = "from-primary-600",
  via   = "via-primary-700",
  to    = "to-primary-800",
  className,
}) => (
  <div
    className={clsx(
      "relative overflow-hidden rounded-2xl p-6",
      "bg-gradient-to-br",
      from, via, to,
      className
    )}
  >
    {/* Pattern overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
        backgroundSize:  "50px 50px",
      }}
    />
    <div className="relative z-10">{children}</div>
  </div>
);

// ─── Empty Card ───────────────────────────────────────────────
export const EmptyCard = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <Card
    className={clsx(
      "flex flex-col items-center justify-center",
      "text-center py-16 px-6",
      className
    )}
  >
    {icon && (
      <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center
                      justify-center text-2xl mb-4">
        {icon}
      </div>
    )}
    {title && (
      <h3 className="text-base font-semibold text-surface-800 mb-1">
        {title}
      </h3>
    )}
    {description && (
      <p className="text-sm text-surface-500 max-w-xs leading-relaxed">
        {description}
      </p>
    )}
    {action && (
      <div className="mt-5">{action}</div>
    )}
  </Card>
);

export default Card;