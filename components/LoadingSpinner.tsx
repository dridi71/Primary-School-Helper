
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-teal-500"></div>
        <p className="text-lg text-gray-600">لحظات... العبقري الصغير يجهز لك المغامرة!</p>
    </div>
  );
};

export default LoadingSpinner;