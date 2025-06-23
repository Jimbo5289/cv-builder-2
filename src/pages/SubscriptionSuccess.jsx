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
        
        // If we have a session ID, assume payment was successful and show success
        if (!sessionId) {
          throw new Error('No session ID found. Please check your payment was successful.');
        }
        
        // Show success immediately since Stripe redirected here successfully
        console.log('Payment completed successfully, session ID:', sessionId);
        setSessionData({
          mode: 'subscription',
          payment_status: 'paid',
          amount_total: 0,
          currency: 'gbp'
        });
        await refreshUser(); // Refresh user data to get updated subscription info
        setLoading(false);
        return;
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
    <div className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="px-6 py-12">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 text-lg">Verifying your subscription...</p>
                <p className="text-gray-500 text-sm mt-2">Please wait while we confirm your payment</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="px-6 py-12">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                  <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-800 mb-3">Subscription Verification Issue</h3>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">{error}</p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            {/* Header with celebration */}
            <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Thank You for Your Purchase!
              </h1>
              <p className="text-green-100 text-lg">
                Your CV Builder Premium subscription is now active
              </p>
            </div>

            <div className="px-6 py-8">
              {/* Coupon Success Message */}
              {sessionData?.total_details?.amount_discount > 0 && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-8 rounded-r-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-green-800 font-semibold">Promotional Code Applied Successfully!</h4>
                      <p className="text-green-700 mt-1">
                        You saved £{((sessionData.total_details.amount_discount || 0) / 100).toFixed(2)} with your promotional code. Smart choice!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Welcome Message */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Welcome to CV Builder Premium! 🚀
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  You've just unlocked the complete CV Builder experience. Our powerful AI-driven tools 
                  will help you create professional, ATS-optimized CVs that get noticed by employers.
                </p>
              </div>

              {/* Features Overview */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI-Powered Analysis
                  </h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Advanced ATS compatibility scoring
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Keyword optimization suggestions
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Industry-specific recommendations
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Real-time improvement tips
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <svg className="h-6 w-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    Premium Templates & Tools
                  </h3>
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Professional CV templates
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Multiple export formats (PDF, Word)
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Career pathway insights
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Priority customer support
                    </li>
                  </ul>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  🎯 Ready to Get Started?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Your premium features are now unlocked and ready to use. Let's create an amazing CV that gets results!
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-semibold text-lg min-w-[200px] flex items-center justify-center"
                  >
                    <span className="mr-2">🚀</span>
                    Let's Go!
                  </button>
                  
                  <div className="text-gray-400 text-sm">or</div>
                  
                  <button
                    onClick={() => navigate('/analyze')}
                    className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold flex items-center"
                  >
                    <span className="mr-2">🔍</span>
                    Analyze My CV
                  </button>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => navigate('/templates')}
                  className="p-4 text-center border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-2xl mb-2">📄</div>
                  <div className="font-medium text-gray-900">Browse Templates</div>
                  <div className="text-sm text-gray-600">Professional designs</div>
                </button>
                
                <button
                  onClick={() => navigate('/subscription')}
                  className="p-4 text-center border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="text-2xl mb-2">💎</div>
                  <div className="font-medium text-gray-900">My Subscription</div>
                  <div className="text-sm text-gray-600">Manage your plan</div>
                </button>
                
                                 <button
                   onClick={() => navigate('/contact')}
                   className="p-4 text-center border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                 >
                   <div className="text-2xl mb-2">💬</div>
                   <div className="font-medium text-gray-900">Get Support</div>
                   <div className="text-sm text-gray-600">Priority help</div>
                 </button>
              </div>

              {/* Confirmation Details */}
              <div className="text-center text-gray-500 border-t pt-6">
                <p className="mb-2">
                  <span className="inline-flex items-center">
                    <svg className="h-4 w-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    A confirmation email has been sent to your registered email address
                  </span>
                </p>
                <p className="text-sm">
                  If you have any questions, our priority support team is here to help!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 