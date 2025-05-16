import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    const mockSession = query.get('mock');
    
    async function verifySubscription() {
      try {
        setLoading(true);
        
        // If this is a mock session in development, just simulate success
        if (mockSession) {
          console.log('Mock subscription session detected');
          await refreshUser(); // Refresh user data to get updated subscription info
          setLoading(false);
          return;
        }
        
        // Otherwise verify the real session with the backend
        if (!sessionId) {
          throw new Error('No session ID found');
        }
        
        // Verify the subscription with the backend
        // This would typically check the session status with Stripe
        // For now, we'll just refresh the user data
        await refreshUser();
        setLoading(false);
      } catch (err) {
        console.error('Error verifying subscription:', err);
        setError(err.message || 'Failed to verify subscription');
        setLoading(false);
      }
    }
    
    verifySubscription();
  }, [location.search, refreshUser]);
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Verifying your subscription...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-red-800 mb-2">Subscription Error</h3>
                <p className="text-sm text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Subscription Activated!</h3>
                <p className="text-sm text-gray-600 mb-6">Thank you for subscribing to CV Builder Premium. Your subscription is now active and you have access to all premium features.</p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/analyse')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Try CV Analysis
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 