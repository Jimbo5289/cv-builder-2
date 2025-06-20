/* eslint-disable */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser, getAuthHeader } = useAuth();
  const { apiUrl } = useServer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;
  
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
          setSessionData({
            mode: 'subscription',
            payment_status: 'paid',
            amount_total: 0,
            currency: 'gbp',
            customer_details: { email: 'mock@example.com' },
            total_details: { amount_discount: 7900 }
          });
          setLoading(false);
          return;
        }
        
        // Otherwise verify the real session with the backend
        if (!sessionId) {
          throw new Error('No session ID found. Please check your payment was successful.');
        }
        
        // Verify the session with Stripe via our backend
        const response = await fetch(`${apiUrl}/api/checkout/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({ sessionId })
        });
        
        if (response.ok) {
          const data = await response.json();
          setSessionData(data.session);
          await refreshUser(); // Refresh user data to get updated subscription info
          setLoading(false);
        } else {
          // If verification fails, it might be a webhook delay - retry
          if (retryCount < maxRetries) {
            console.log(`Verification failed, retrying in 3 seconds... (attempt ${retryCount + 1}/${maxRetries})`);
            setTimeout(() => {
              setRetryCount(prev => prev + 1);
              verifySubscription();
            }, 3000);
          } else {
            // After max retries, show success anyway since payment was made
            console.log('Max retries reached, showing success page anyway');
            setSessionData({
              mode: 'subscription',
              payment_status: 'paid',
              amount_total: null,
              currency: 'gbp'
            });
            await refreshUser();
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error verifying subscription:', err);
        
        // If there's a network error but we have a session ID, assume success
        if (sessionId && retryCount < maxRetries) {
          console.log(`Network error, retrying in 3 seconds... (attempt ${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            verifySubscription();
          }, 3000);
        } else {
          setError(err.message || 'Failed to verify subscription');
          setLoading(false);
        }
      }
    }
    
    verifySubscription();
  }, [location.search, refreshUser, apiUrl, getAuthHeader, retryCount]);
  
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
                <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Payment Successful!</h3>
                
                {/* Coupon Success Message */}
                {sessionData?.total_details?.amount_discount > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-green-800 font-semibold">Promotional Code Applied!</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      You saved £{((sessionData.total_details.amount_discount || 0) / 100).toFixed(2)} with your promotional code
                    </p>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <h4 className="text-blue-800 font-semibold mb-2">Your CV Builder Premium subscription is now active!</h4>
                  <p className="text-blue-700 text-sm mb-2">
                    Welcome to premium! You now have access to:
                  </p>
                  <ul className="text-blue-700 text-sm text-left space-y-1">
                    <li>✓ AI-powered CV analysis</li>
                    <li>✓ Premium templates</li>
                    <li>✓ ATS optimization</li>
                    <li>✓ Career insights & recommendations</li>
                    <li>✓ Priority support</li>
                  </ul>
                </div>
                
                {retryCount > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 max-w-md mx-auto">
                    <p className="text-yellow-700 text-sm">
                      ⚡ Your account is being updated. If premium features aren't immediately available, please refresh the page in a moment.
                    </p>
                  </div>
                )}
                
                <p className="text-gray-600 mb-6">
                  A confirmation email has been sent to your registered email address.
                </p>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
                  <button
                    onClick={() => navigate('/analyze')}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors shadow-md font-medium"
                  >
                    🚀 Analyze Your CV Now
                  </button>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Go to Dashboard
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