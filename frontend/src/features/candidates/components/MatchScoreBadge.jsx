// src/features/candidates/components/MatchScoreBadge.jsx
import clsx from "clsx";

const getScoreConfig = (score) => {
  if (score >= 85) return {
    color: "bg-success-50 text-success-700 border-success-200",
    bar:   "bg-success-500",
    label: "Excellent",
  };
  if (score >= 70) return {
    color: "bg-primary-50 text-primary-700 border-primary-200",
    bar:   "bg-primary-500",
    label: "Good",
  };
  if (score >= 50) return {
    color: "bg-warning-50 text-warning-700 border-warning-200",
    bar:   "bg-warning-500",
    label: "Fair",
  };
  return {
    color: "bg-danger-50 text-danger-700 border-danger-200",
    bar:   "bg-danger-400",
    label: "Low",
  };
};

// ─── Compact badge (for tables) ───────────────────────────────
export const MatchScoreBadge = ({ score, className }) => {
  const config = getScoreConfig(score);
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2.5 py-1",
        "rounded-full text-xs font-semibold border",
        config.color,
        className
      )}
    >
      <span>{score}%</span>
    </span>
  );
};

// ─── Detailed score display (for detail page) ─────────────────
export const MatchScoreDisplay = ({ score, className }) => {
  const config = getScoreConfig(score);

  return (
    <div className={clsx("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-surface-700">
          AI Match Score
        </span>
        <div className={clsx(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full",
          "text-sm font-bold border",
          config.color
        )}>
          {score}%
          <span className="text-xs font-medium opacity-75">
            {config.label}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2.5 bg-surface-100 rounded-full overflow-hidden">
        <div
          className={clsx(
            "h-full rounded-full transition-all duration-700",
            config.bar
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

export default MatchScoreBadge;