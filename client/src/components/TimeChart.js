import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TimeChart = ({ data }) => {
  const chartData = {
    labels: ['Work', 'Otium', 'Eating', 'Exercise'],
    datasets: [
      {
        label: 'Time (Hours)',
        data: [
          (data.Work || 0) / 3600,
          (data.Otium || 0) / 3600,
          (data.Eating || 0) / 3600,
          (data.Exercise || 0) / 3600,
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Daily Activity Time (Hours)' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Hours' } },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TimeChart;
