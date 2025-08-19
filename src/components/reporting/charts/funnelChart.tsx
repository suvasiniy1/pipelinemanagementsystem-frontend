import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

interface FunnelData {
  stageName: string;
  dealCount: number;
  conversionRate: number;
  totalValue: number;
}

interface FunnelChartProps {
  data: FunnelData[];
}

export const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.stageName),
    datasets: [
      {
        label: 'Deal Count',
        data: data.map(item => item.dealCount),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Conversion Rate (%)',
        data: data.map(item => item.conversionRate),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        yAxisID: 'y1',
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
        display: true,
        text: 'Deal Conversion Funnel'
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Deal Count'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Conversion Rate (%)'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  return <div style={{ height: '300px' }}><Bar data={chartData} options={options} /></div>;


};