import React from 'react';

const StatCard = ({ label, value, icon: Icon, color = 'accent' }) => {
  const colorClasses = {
    accent: 'bg-accent text-white',
    blue: 'bg-blue-500 text-white',
    purple: 'bg-purple-500 text-white',
    orange: 'bg-orange-500 text-white',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-accent">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-primary mt-1 sm:mt-2">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-2 sm:p-3 rounded-lg flex-shrink-0 ml-3`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
