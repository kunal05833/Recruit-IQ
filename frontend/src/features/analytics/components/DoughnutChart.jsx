// src/features/analytics/components/DoughnutChart.jsx
import { Doughnut } from "react-chartjs-2";
import { defaultDoughnutOptions } from "../../../utils/chartConfig";
import "../../../utils/chartConfig";

const DoughnutChart = ({
  labels   = [],
  values   = [],
  colors   = [],
  height   = 220,
  options  = {},
  centerLabel,
}) => {
  const data = {
    labels,
    datasets: [
      {
        data:            values,
        backgroundColor: colors,
        borderColor:     "#fff",
        borderWidth:     3,
        hoverOffset:     6,
      },
    ],
  };

  const merged = {
    ...defaultDoughnutOptions,
    ...options,
    plugins: {
      ...defaultDoughnutOptions.plugins,
      ...(options.plugins || {}),
    },
  };

  return (
    <div className="relative" style={{ height }}>
      <Doughnut data={data} options={merged} />
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center
                        justify-center pointer-events-none">
          <p className="text-2xl font-bold text-surface-900">
            {centerLabel.value}
          </p>
          <p className="text-xs text-surface-500">{centerLabel.label}</p>
        </div>
      )}
    </div>
  );
};

export default DoughnutChart;