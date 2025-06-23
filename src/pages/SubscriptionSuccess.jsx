/* eslint-disable */
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useServer } from '../context/ServerContext';

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshUser, getAuthHeader, user } = useAuth();
  const { apiUrl } = useServer();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('processing'); // processing, active, failed
  const [webhookChecks, setWebhookChecks] = useState(0);
  const maxWebhookChecks = 4; // Check for 20 seconds (4 checks * 5 seconds)
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    const mockSession = query.get('mock');
    
    async function initializeSuccess() {
      try {
        // If this is a mock session in development, just simulate success
        if (mockSession) {
          console.log('Mock subscription session detected');
          setSessionData({
            mode: 'subscription',
            payment_status: 'paid',
            amount_total: 0,
            currency: 'gbp',
            customer_details: { email: 'mock@example.com' },
            total_details: { amount_discount: 7900 }
          });
          setSubscriptionStatus('active');
          setLoading(false);
          return;
        }
        
        // Check if we have a session ID
        if (!sessionId) {
          throw new Error('No session ID found. Please check your payment was successful.');
        }
        
        // Show success immediately since Stripe redirected here successfully
        console.log('Payment completed successfully, session ID:', sessionId);
        setSessionData({
          mode: 'subscription',
          payment_status: 'paid',
          amount_total: 0,
          currency: 'gbp',
          sessionId: sessionId
        });
        setLoading(false);
        
        // Ensure user authentication is valid before checking subscription
        await ensureAuthenticationValid();
        
        // Start checking for webhook processing
        checkSubscriptionStatus();
        
      } catch (err) {
        console.error('Error initializing subscription success:', err);
        setError(err.message || 'Failed to verify subscription');
        setLoading(false);
      }
    }
    
    initializeSuccess();
  }, [location.search]);

  // Ensure user authentication is valid after payment
  const ensureAuthenticationValid = async () => {
    try {
      console.log('Ensuring authentication is valid after payment...');
      
      // Check if we have a valid auth token
      const authHeader = getAuthHeader();
      if (!authHeader || !authHeader.Authorization) {
        console.log('No valid auth token found, refreshing user session...');
        await refreshUser();
        return;
      }

      // Test the token by making a quick auth check
      try {
        const response = await fetch(`${apiUrl}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          }
        });

        if (!response.ok) {
          console.log('Auth token validation failed, refreshing user session...');
          await refreshUser();
        } else {
          console.log('Auth token is valid');
        }
      } catch (authError) {
        console.log('Auth check failed, refreshing user session...', authError);
        await refreshUser();
      }
    } catch (error) {
      console.warn('Failed to ensure authentication validity:', error);
      // Continue anyway - user can manually refresh if needed
    }
  };

  // Progressive webhook status checking
  const checkSubscriptionStatus = async () => {
    const query = new URLSearchParams(location.search);
    const sessionId = query.get('session_id');
    
    if (!sessionId) {
      console.warn('No session ID available for webhook checking');
      setSubscriptionStatus('delayed');
      return;
    }
    
    try {
      console.log(`Checking if session ${sessionId} has been processed (attempt ${webhookChecks + 1}/${maxWebhookChecks})`);
      
      // Ensure we have a valid auth token before making the request
      const authHeader = getAuthHeader();
      if (!authHeader || !authHeader.Authorization) {
        console.warn('No valid auth token available, attempting to refresh user session');
        try {
          await refreshUser();
        } catch (refreshError) {
          console.error('Failed to refresh user session:', refreshError);
        }
      }

      // Check if this specific session has been processed by the webhook
      const response = await fetch(`${apiUrl}/api/checkout/session-processed/${sessionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Session processed response:', responseData);
        // Backend wraps response in { success: true, data: {...} }
        const data = responseData.data || responseData;
        if (data.sessionProcessed) {
          console.log('Session confirmed processed by webhook!');
          setSubscriptionStatus('active');
          
          // Refresh user data to get the latest subscription info
          try {
            console.log('Refreshing user data after successful subscription activation...');
            await refreshUser();
            console.log('User data refreshed successfully');
          } catch (refreshError) {
            console.warn('Failed to refresh user after session confirmation:', refreshError);
          }
          return;
        }
      } else {
        console.warn('Session processed check failed:', response.status, response.statusText);
        
        // If we get a 401 (unauthorized), try refreshing the user session
        if (response.status === 401) {
          console.log('Unauthorized response, attempting to refresh user session');
          try {
            await refreshUser();
          } catch (refreshError) {
            console.error('Failed to refresh user session after 401:', refreshError);
          }
        }
      }
      
      // If not processed yet and we haven't exceeded max checks, try again
      if (webhookChecks < maxWebhookChecks - 1) {
        setWebhookChecks(prev => prev + 1);
        setTimeout(() => {
          checkSubscriptionStatus();
        }, 5000); // Check every 5 seconds
      } else {
        console.log('Max webhook checks reached, checking user subscription status directly');
        await checkUserSubscriptionFallback();
      }
      
    } catch (error) {
      console.warn('Error checking session processed status:', error);
      // Don't show error to user - they've already paid successfully
      if (webhookChecks < maxWebhookChecks - 1) {
        setWebhookChecks(prev => prev + 1);
        setTimeout(() => {
          checkSubscriptionStatus();
        }, 5000);
      } else {
        await checkUserSubscriptionFallback();
      }
    }
  };

  // Fallback method to check user subscription status directly
  const checkUserSubscriptionFallback = async () => {
    try {
      console.log('Checking user subscription status as fallback');
      
      // Refresh user data to get latest subscription info
      await refreshUser();
      
      // Check if user now has an active subscription
      const response = await fetch(`${apiUrl}/api/subscriptions/premium-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.isSubscribed && data.subscription?.status === 'active') {
          console.log('User has active subscription confirmed via fallback check');
          setSubscriptionStatus('active');
          return;
        }
      }
      
      // If still no active subscription found, mark as delayed
      console.log('No active subscription found via fallback, marking as delayed');
      setSubscriptionStatus('delayed');
      
    } catch (error) {
      console.warn('Fallback subscription check failed:', error);
      setSubscriptionStatus('delayed');
    }
  };

  // Enhanced navigation with authentication check
  const handleContinue = async () => {
    try {
      console.log('User clicked continue, ensuring authentication is valid...');
      
      // Ensure authentication is valid before navigation
      await ensureAuthenticationValid();
      
      // Navigate to home
      navigate('/', { 
        replace: true,
        state: { fromPaymentSuccess: true }
      });
    } catch (error) {
      console.warn('Error during navigation preparation:', error);
      // Navigate anyway - user can handle auth issues on the next page
      navigate('/', { 
        replace: true,
        state: { fromPaymentSuccess: true }
      });
    }
  };
  
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
                Your payment was processed successfully
              </p>
              
              {/* Subscription Status Indicator */}
              <div className="mt-4">
                {subscriptionStatus === 'processing' && (
                  <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                    Activating your subscription...
                  </div>
                )}
                {subscriptionStatus === 'active' && (
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    <svg className="h-4 w-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Premium subscription is now active!
                  </div>
                )}
                {subscriptionStatus === 'delayed' && (
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <svg className="h-4 w-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Subscription activating shortly
                  </div>
                )}
              </div>
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

              {/* Delayed Activation Notice */}
              {subscriptionStatus === 'delayed' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-blue-800 font-semibold">Subscription Activating</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        Your subscription is being processed and will be active within a few minutes. 
                        You can start using premium features right away, and if you encounter any issues, 
                        simply refresh your browser.
                      </p>
                      <button
                        onClick={() => checkUserSubscriptionFallback()}
                        className="mt-3 inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Check Status Now
                      </button>
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
                    onClick={handleContinue}
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