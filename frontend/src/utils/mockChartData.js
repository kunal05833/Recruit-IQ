// src/utils/mockChartData.js
// These supplement the real API stats with chart-compatible
// time-series data since the API returns aggregate numbers.

export const generateMonthlyLabels = (count = 6) => {
  const months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];
  const now    = new Date();
  const result = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push(months[d.getMonth()]);
  }
  return result;
};

export const generateWeeklyLabels = () =>
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Scale mock data relative to real total
export const scaleToTotal = (total, count = 6) => {
  if (!total || total === 0) return Array(count).fill(0);
  const base   = Math.floor(total / count);
  const result = [];
  let   remaining = total;
  for (let i = 0; i < count - 1; i++) {
    const variance = Math.floor(base * 0.4 * (Math.random() - 0.5));
    const val      = Math.max(0, base + variance);
    result.push(val);
    remaining -= val;
  }
  result.push(Math.max(0, remaining));
  return result;
};

export const generateApplicationTrend = (total) =>
  scaleToTotal(total, 6);

export const generateHiringFunnelData = (total) => {
  const applied   = total;
  const reviewed  = Math.floor(total * 0.65);
  const shortlist = Math.floor(total * 0.35);
  const hired     = Math.floor(total * 0.12);
  return { applied, reviewed, shortlist, hired };
};

export const generateSkillsData = () => ({
  labels: ["React", "Java", "Python", "Node.js", "SQL", "AWS"],
  values: [42, 38, 31, 27, 24, 19],
});