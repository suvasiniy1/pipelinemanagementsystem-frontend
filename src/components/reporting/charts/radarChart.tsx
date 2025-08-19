import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface RadarChartProps {
  data: { label: string; value: number }[];
  title?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, title }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Deal Count',
        data: data.map(item => item.value),
        backgroundColor: 'rgba(255, 193, 7, 0.3)',
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 4,
        pointBackgroundColor: 'rgba(255, 193, 7, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 193, 7, 1)',
        pointRadius: 8,
        pointHoverRadius: 10,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold' as const
        },
        padding: 20
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        pointLabels: {
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div style={{ 
      height: '350px', 
      padding: '10px',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      color: '#333'
    }}>
      <Radar data={chartData} options={options} />
    </div>
  );
};