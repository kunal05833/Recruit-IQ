// src/features/analytics/components/LineChart.jsx
import { Line } from "react-chartjs-2";
import { defaultLineOptions, CHART_COLORS } from "../../../utils/chartConfig";
import "../../../utils/chartConfig"; // ensure registered

const LineChart = ({
  labels   = [],
  datasets = [],
  height   = 260,
  options  = {},
}) => {
  const data = { labels, datasets };
  const merged = {
    ...defaultLineOptions,
    ...options,
    plugins: {
      ...defaultLineOptions.plugins,
      ...(options.plugins || {}),
    },
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={merged} />
    </div>
  );
};

export default LineChart;