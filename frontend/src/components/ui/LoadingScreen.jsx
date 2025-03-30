// components/ui/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-blue-900 flex flex-col items-center justify-center z-50">
      <div className="text-4xl font-bold text-white mb-8">Retro Diner</div>
      
      <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full animate-pulse"
          style={{ width: '75%' }}
        ></div>
      </div>
      
      <div className="mt-4 text-blue-300 animate-pulse">Loading...</div>
    </div>
  );
};

export default LoadingScreen;
