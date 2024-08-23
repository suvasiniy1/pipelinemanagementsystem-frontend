import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

type params = {
  values: Array<number>;
  labels: Array<string>;
  displayLegend?: boolean;
  frequencey?: string;
  selectedTab:string;
};
export const BarChart = (props: params) => {
  const { labels, values, displayLegend, frequencey, selectedTab, ...others } = props;

  const options = {
    scales: {
      x: {
        beginAtZero: true,
        display: true,
        grid: { display: false },
        steps: 0.25,
        stepValue: 1,
        min: 0,
      },
      y: {
        display: true,
        beginAtZero: true,
        grid: { display: false },
        steps: 0.25,
        stepValue: 1,
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: displayLegend ?? false,
      },
    },
  };

  return (
    <Bar
      data={{
        labels: labels,
        datasets: [
          {
            label: `# of ${selectedTab}`,
            barThickness: 10,
            data: values,
            borderWidth: 1,
          },
        ],
      }}
      options={options}
    ></Bar>
  );
};
