/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound; 