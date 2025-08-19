import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface AreaChartProps {
  data: { label: string; value: number }[];
  title?: string;
  yAxisLabel?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({ data, title, yAxisLabel }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: yAxisLabel || 'Value',
        data: data.map(item => item.value),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel
        }
      }
    }
  };

  return (
    <div style={{ 
      height: '350px', 
      padding: '15px',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    }}>
      <Line data={chartData} options={{
        ...options,
        plugins: {
          ...options.plugins,
          title: {
            ...options.plugins.title,
            font: { size: 16, weight: 'bold' as const },
            padding: 20
          }
        }
      }} />
    </div>
  );
};