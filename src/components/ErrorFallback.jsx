import React from 'react';
import * as Sentry from '@sentry/react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Something went wrong
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've been notified and are working to fix the issue.
          </p>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Details
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {error.message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => {
              // Report error to Sentry
              Sentry.captureException(error);
              resetErrorBoundary();
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback; 