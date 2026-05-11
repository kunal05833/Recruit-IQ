// src/features/analytics/components/BarChart.jsx
import { Bar } from "react-chartjs-2";
import { defaultBarOptions } from "../../../utils/chartConfig";
import "../../../utils/chartConfig";

const BarChart = ({
  labels   = [],
  datasets = [],
  height   = 260,
  options  = {},
}) => {
  const data   = { labels, datasets };
  const merged = {
    ...defaultBarOptions,
    ...options,
    plugins: {
      ...defaultBarOptions.plugins,
      ...(options.plugins || {}),
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={merged} />
    </div>
  );
};

export default BarChart;