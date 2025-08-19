import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface LineChartProps {
  data: { label: string; value: number }[];
  title?: string;
  yAxisLabel?: string;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title, yAxisLabel }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: yAxisLabel || 'Value',
        data: data.map(item => item.value),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
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
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
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