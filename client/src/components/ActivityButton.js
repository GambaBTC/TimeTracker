import React from 'react';

const ActivityButton = ({ title, currentActivity, onClick }) => {
  const isActive = currentActivity === title;
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg shadow-md text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
        isActive ? 'bg-green-500' : 'bg-blue-500'
      }`}
    >
      {isActive ? `${title}ing` : title}
    </button>
  );
};

export default ActivityButton;
