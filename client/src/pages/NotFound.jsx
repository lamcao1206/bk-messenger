import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <FaExclamationTriangle className="w-20 h-20 text-blue-500 mx-auto mb-4" />
        <p className="text-3xl text-gray-600 mb-8">Oops! Page not found.</p>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" className="inline-block px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-300">
          Go Back Home
        </a>
      </div>
    </div>
  );
}
