import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface DoughnutChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, title }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map((item, index) => 
          item.color || `hsl(${(index * 360) / data.length}, 70%, 60%)`
        ),
        borderWidth: 2,
        cutout: '60%',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: !!title,
        text: title
      }
    }
  };

  return (
    <div style={{ 
      height: '350px', 
      padding: '15px',
      background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
    }}>
      <Doughnut data={chartData} options={{
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