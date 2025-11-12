import React from 'react';
import { Heart } from 'lucide-react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-gray-700 font-medium">{message}</p>
        <p className="text-sm text-gray-500 mt-2">Please wait while we prepare your guidance...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;