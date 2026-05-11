// src/components/shared/PageHeader.jsx
import clsx from "clsx";

const PageHeader = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  className,
}) => {
  return (
    <div className={clsx(
      "flex flex-col sm:flex-row sm:items-center",
      "justify-between gap-4 mb-6",
      className
    )}>
      <div className="space-y-1">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-1.5">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span className="text-surface-300 text-xs">/</span>
                )}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-xs text-surface-500 hover:text-surface-700
                               transition-colors font-medium"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-xs text-surface-400">
                    {crumb.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-xl font-bold text-surface-900 tracking-tight">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-sm text-surface-500">{subtitle}</p>
        )}
      </div>

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;