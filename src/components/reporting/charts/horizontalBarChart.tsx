import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface HorizontalBarChartProps {
  data: { label: string; value: number }[];
  title?: string;
  xAxisLabel?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({ data, title, xAxisLabel }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: xAxisLabel || 'Value',
        data: data.map(item => item.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 2,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
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
      x: {
        beginAtZero: true,
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel
        }
      }
    }
  };

  return (
    <div style={{ 
      height: '350px', 
      padding: '15px',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    }}>
      <Bar data={chartData} options={{
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