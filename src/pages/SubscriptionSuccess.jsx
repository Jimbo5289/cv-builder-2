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
  const [purchaseType, setPurchaseType] = useState(null); // 'subscription', '30day-access', 'pay-per-cv'
  const [purchaseDetails, setPurchaseDetails] = useState(null);
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
          setPurchaseType('subscription');
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
          
          // Determine purchase type and set details
          if (data.hasSubscription && data.subscription) {
            setPurchaseType('subscription');
            setPurchaseDetails({
              type: 'subscription',
              subscription: data.subscription,
              planType: data.subscription.stripePriceId?.includes('annual') ? 'annual' : 'monthly'
            });
          } else if (data.hasTemporaryAccess && data.temporaryAccess) {
            setPurchaseType(data.temporaryAccess.type);
            setPurchaseDetails({
              type: data.temporaryAccess.type,
              temporaryAccess: data.temporaryAccess,
              endTime: data.temporaryAccess.endTime
            });
          } else {
            // Fallback to pay-per-cv if no specific type detected
            setPurchaseType('pay-per-cv');
            setPurchaseDetails({
              type: 'pay-per-cv'
            });
          }
          
          // Refresh user data to get the latest subscription info
          try {
            console.log('Refreshing user data after successful payment activation...');
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
      
      // Check if user now has an active subscription or temporary access
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
          setPurchaseType('subscription');
          setPurchaseDetails({
            type: 'subscription',
            subscription: data.subscription
          });
          return;
        } else if (data.temporaryAccess) {
          console.log('User has temporary access confirmed via fallback check');
          setSubscriptionStatus('active');
          setPurchaseType(data.temporaryAccess.type);
          setPurchaseDetails({
            type: data.temporaryAccess.type,
            temporaryAccess: data.temporaryAccess
          });
          return;
        }
      }
      
      // If still no active subscription or access found, mark as delayed
      console.log('No active subscription or access found via fallback, marking as delayed');
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
      
      // Navigate to appropriate page based on purchase type
      let navigationPath = '/';
      if (purchaseType === 'subscription') {
        navigationPath = '/dashboard';
      } else if (purchaseType === '30day-access') {
        navigationPath = '/dashboard';
      } else if (purchaseType === 'pay-per-cv') {
        navigationPath = '/create';
      }
      
      navigate(navigationPath, { 
        replace: true,
        state: { fromPaymentSuccess: true, purchaseType }
      });
    } catch (error) {
      console.warn('Error during navigation preparation:', error);
      // Navigate anyway - user can handle auth issues on the next page
      navigate('/', { 
        replace: true,
        state: { fromPaymentSuccess: true, purchaseType }
      });
    }
  };

  // Get purchase-specific success message
  const getSuccessMessage = () => {
    if (!purchaseType) return 'Thank You for Your Purchase!';
    
    switch (purchaseType) {
      case 'subscription':
        const isAnnual = purchaseDetails?.planType === 'annual' || 
                        purchaseDetails?.subscription?.stripePriceId?.includes('annual');
        return isAnnual ? 
          'Welcome to Your Annual Subscription!' : 
          'Welcome to Your Monthly Subscription!';
      case '30day-access':
        return 'Your 30-Day Access Pass is Active!';
      case 'pay-per-cv':
        return 'Your Pay-Per-CV Purchase is Complete!';
      default:
        return 'Thank You for Your Purchase!';
    }
  };

  // Get purchase-specific subtitle
  const getSuccessSubtitle = () => {
    if (!purchaseType) return 'Your payment was processed successfully';
    
    switch (purchaseType) {
      case 'subscription':
        return 'Your premium subscription is now active and ready to use';
      case '30day-access':
        return 'You now have full access to all premium features for 30 days';
      case 'pay-per-cv':
        return 'You can now create and download your professional CV';
      default:
        return 'Your payment was processed successfully';
    }
  };

  // Get purchase-specific status message
  const getStatusMessage = () => {
    if (subscriptionStatus === 'processing') {
      return 'Activating your purchase...';
    }
    
    if (subscriptionStatus === 'active') {
      switch (purchaseType) {
        case 'subscription':
          return 'Premium subscription is now active!';
        case '30day-access':
          return '30-Day Access Pass is now active!';
        case 'pay-per-cv':
          return 'Pay-Per-CV access is now ready!';
        default:
          return 'Your purchase is now active!';
      }
    }
    
    if (subscriptionStatus === 'delayed') {
      return 'Purchase activating shortly';
    }
    
    return 'Processing your purchase...';
  };

  // Get purchase-specific welcome message
  const getWelcomeMessage = () => {
    if (!purchaseType) return 'Welcome to CV Builder Premium! 🚀';
    
    switch (purchaseType) {
      case 'subscription':
        return 'Welcome to CV Builder Premium! 🚀';
      case '30day-access':
        return 'Welcome to Your 30-Day Premium Experience! ⭐';
      case 'pay-per-cv':
        return 'Let\'s Create Your Professional CV! 📝';
      default:
        return 'Welcome to CV Builder! 🚀';
    }
  };

  // Get purchase-specific description
  const getWelcomeDescription = () => {
    if (!purchaseType) return 'You now have access to powerful AI-driven tools to create professional, ATS-optimized CVs.';
    
    switch (purchaseType) {
      case 'subscription':
        return 'You\'ve unlocked the complete CV Builder experience. Our powerful AI-driven tools will help you create professional, ATS-optimized CVs that get noticed by employers.';
      case '30day-access':
        return 'For the next 30 days, you have full access to all premium features including advanced AI analysis, premium templates, and comprehensive CV optimization tools.';
      case 'pay-per-cv':
        return 'You can now create and download one professional CV with basic ATS analysis. Our guided process will help you build an effective CV that stands out.';
      default:
        return 'You now have access to powerful tools to create professional CVs.';
    }
  };

  // Get purchase-specific next steps
  const getNextSteps = () => {
    if (!purchaseType) return [];
    
    switch (purchaseType) {
      case 'subscription':
        return [
          'Access unlimited CV creation and editing',
          'Use advanced AI analysis and optimization',
          'Choose from premium templates',
          'Get priority customer support'
        ];
      case '30day-access':
        return [
          'Create unlimited CVs for 30 days',
          'Access all premium features and templates',
          'Get comprehensive AI analysis and feedback',
          'Download and print your optimized CVs'
        ];
      case 'pay-per-cv':
        return [
          'Start building your CV with our guided process',
          'Get basic ATS scoring and feedback',
          'Choose from standard templates',
          'Download your completed CV'
        ];
      default:
        return [
          'Start creating your professional CV',
          'Access available features',
          'Download your completed work'
        ];
    }
  };

  // Get appropriate call-to-action text
  const getCTAText = () => {
    if (!purchaseType) return 'Continue to Dashboard';
    
    switch (purchaseType) {
      case 'subscription':
        return 'Go to Dashboard';
      case '30day-access':
        return 'Start Creating CVs';
      case 'pay-per-cv':
        return 'Create My CV';
      default:
        return 'Continue';
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
                <p className="text-gray-600 text-lg">Verifying your purchase...</p>
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
                <h3 className="text-xl font-bold text-red-800 mb-3">Purchase Verification Issue</h3>
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
                {getSuccessMessage()}
              </h1>
              <p className="text-green-100 text-lg">
                {getSuccessSubtitle()}
              </p>
              
              {/* Purchase Status Indicator */}
              <div className="mt-4">
                {subscriptionStatus === 'processing' && (
                  <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                    {getStatusMessage()}
                  </div>
                )}
                {subscriptionStatus === 'active' && (
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    <svg className="h-4 w-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {getStatusMessage()}
                  </div>
                )}
                {subscriptionStatus === 'delayed' && (
                  <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm">
                    <svg className="h-4 w-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {getStatusMessage()}
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
                      <h4 className="text-blue-800 font-semibold">Purchase Activating</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        Your purchase is being processed and will be active within a few minutes. 
                        You can start using the features right away, and if you encounter any issues, 
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
                  {getWelcomeMessage()}
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  {getWelcomeDescription()}
                </p>
              </div>

              {/* Features Overview */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">What's Next?</h3>
                  </div>
                  <ul className="space-y-2">
                    {getNextSteps().map((step, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="ml-3 text-lg font-semibold text-gray-900">Need Help?</h3>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      Our support team is here to help you get the most out of your CV Builder experience.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <a 
                        href="/contact" 
                        className="inline-flex items-center px-3 py-2 border border-green-300 text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Support
                      </a>
                      <a 
                        href="/faq" 
                        className="inline-flex items-center px-3 py-2 border border-green-300 text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        View FAQ
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleContinue}
                  className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  {getCTAText()}
                </button>
                
                {/* Additional action for pay-per-cv users */}
                {purchaseType === 'pay-per-cv' && (
                  <button
                    onClick={() => navigate('/cv-tips')}
                    className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Get CV Tips
                  </button>
                )}
              </div>

              {/* Purchase-specific additional info */}
              {purchaseType === '30day-access' && purchaseDetails?.endTime && (
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-yellow-800 font-semibold">Access Duration</h4>
                      <p className="text-yellow-700 text-sm mt-1">
                        Your 30-day access will expire on {new Date(purchaseDetails.endTime).toLocaleDateString('en-GB', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}. Make the most of your premium features!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {purchaseType === 'pay-per-cv' && (
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-blue-800 font-semibold">Your Pay-Per-CV Purchase</h4>
                      <p className="text-blue-700 text-sm mt-1">
                        You can create and download one CV with basic ATS analysis. Need more? Consider upgrading to a subscription for unlimited access to all features.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  Questions about your purchase? Check your email for the receipt or{' '}
                  <a href="/contact" className="text-blue-600 hover:text-blue-500">contact our support team</a>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 