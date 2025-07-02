/* eslint-disable */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { useLocation, Link } from 'react-router-dom';
import { useServer } from '../context/ServerContext';

const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Subscription() {
  const { user, getAuthHeader } = useAuth();
  const location = useLocation();
  const [subscription, setSubscription] = useState(null);
  const [temporaryAccess, setTemporaryAccess] = useState(null);
  const [accessType, setAccessType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showCancelOptions, setShowCancelOptions] = useState(false);
  const showUpgradePrompt = location.state?.upgrade;
  const redirectFrom = location.state?.from?.pathname;
  const showSuccessFromPayment = location.state?.showSuccess;
  const { apiUrl } = useServer();

  // Map from path to feature name
  const featureMap = {
    '/cv-analyze': 'Basic CV Analysis',
    '/cv-analyze-by-role': 'Industry-Specific CV Analysis',
    '/analyze': 'AI CV Analysis with Job Description Matching',
            '/create': 'MyCVBuilder Tool'
  };

  const getPremiumFeatureName = (path) => {
    return featureMap[path] || 'Premium Features';
  };

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      // Try with the main API URL first
      let success = await tryFetchSubscription(apiUrl);
      
      setLoading(false);
    };
    
    const tryFetchSubscription = async (baseUrl) => {
      try {
        console.log(`Trying to fetch premium status at ${baseUrl}/api/subscriptions/premium-status`);
        const response = await fetch(`${baseUrl}/api/subscriptions/premium-status`, {
          headers: {
            ...getAuthHeader()
          }
        });
        
        if (!response.ok) {
          console.error(`Failed to fetch premium status from ${baseUrl}:`, response.status);
          return false;
        } 
        
        const data = await response.json();
        console.log('Premium status data:', data);
        
        // Set the appropriate data based on access type
        setAccessType(data.accessType);
        setSubscription(data.subscriptionData);
        setTemporaryAccess(data.temporaryAccess);
        
        return true;
      } catch (err) {
        console.error(`Premium status fetch error at ${baseUrl}:`, err);
        return false;
      }
    };

    fetchSubscription();
  }, [user, apiUrl, getAuthHeader]);

  // Show success message when redirected from payment success
  useEffect(() => {
    if (showSuccessFromPayment) {
              setSuccessMessage('🎉 Payment successful! Your premium subscription is now active. Welcome to MyCVBuilder Premium!');
      // Clear the state to prevent showing the message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [showSuccessFromPayment]);

  const handleCancelSubscription = async (immediate = false) => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`${apiUrl}/api/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ immediate })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscription(data);
        setSuccessMessage(data.message);
        setShowCancelOptions(false);
      } else {
        setError(data.message || data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`${apiUrl}/api/subscriptions/reactivate`, {
        method: 'POST',
        headers: {
          ...getAuthHeader()
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscription(data);
        setSuccessMessage(data.message);
      } else {
        setError(data.message || data.error || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Failed to reactivate subscription:', error);
      setError('Failed to reactivate subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Hide loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Subscription Management</h1>
          {showUpgradePrompt && renderUpgradePrompt()}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-300">Loading subscription information...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderUpgradePrompt() {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Premium Feature Required</span>
              <br />
              The feature you attempted to access ({getPremiumFeatureName(redirectFrom)}) requires an active subscription.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Subscription Management</h1>
      
      {showUpgradePrompt && renderUpgradePrompt()}
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-400 hover:text-green-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main subscription content - Fixed conditional logic */}
      {!subscription && !temporaryAccess ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">No Active Subscription</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">You are currently on the free plan.</p>
          <Link
            to="/pricing"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            state={{ premium: showUpgradePrompt, from: redirectFrom, feature: getPremiumFeatureName(redirectFrom) }}
          >
            View Plans
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Current Plan</h2>
          
          {/* Display information based on access type */}
          {accessType === 'temporary' && temporaryAccess && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Plan</p>
                  <p className="font-semibold text-gray-900 dark:text-white">30-Day Access Pass</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-green-600 capitalize">Active</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Access Expires</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(temporaryAccess.endTime).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">One-time Purchase</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">30-Day Access Pass</h3>
                    <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                      Your 30-day access will expire on {new Date(temporaryAccess.endTime).toLocaleDateString()}. 
                      To continue using premium features, consider subscribing to one of our plans.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/pricing"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    View Subscription Plans
                  </Link>
                </div>
              </div>
            </>
          )}

          {/* Subscription information */}
          {accessType === 'subscription' && subscription && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Plan</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{subscription.planId || 'Premium Subscription'}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{subscription.status}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Current Period</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{' '}
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Auto-Renewal</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {subscription.cancelAtPeriodEnd ? 'Disabled' : 'Enabled'}
                  </p>
                </div>
              </div>

              {/* Only show cancellation options for active subscriptions */}
              {subscription.status === 'active' && (
                <>
                  {subscription.cancelAtPeriodEnd ? (
                    <div className="space-y-4">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Subscription Scheduled for Cancellation</h3>
                            <p className="mt-1 text-sm text-yellow-700">
                              Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}. 
                              You can reactivate it anytime before then.
                            </p>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleReactivateSubscription}
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                      >
                        {loading ? 'Processing...' : 'Reactivate Subscription'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {!showCancelOptions ? (
                        <button
                          onClick={() => setShowCancelOptions(true)}
                          disabled={loading}
                          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                        >
                          Cancel Subscription
                        </button>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Subscription</h3>
                          <p className="text-sm text-gray-600 mb-6">
                            Choose how you'd like to cancel your subscription:
                          </p>
                          
                          <div className="space-y-3">
                            <button
                              onClick={() => handleCancelSubscription(false)}
                              disabled={loading}
                              className="w-full bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 disabled:opacity-50 text-left"
                            >
                              <div className="font-medium">Cancel at Period End (Recommended)</div>
                              <div className="text-sm text-yellow-100">
                                Keep access until {new Date(subscription.currentPeriodEnd).toLocaleDateString()}, then cancel
                              </div>
                            </button>
                            
                            <button
                              onClick={() => handleCancelSubscription(true)}
                              disabled={loading}
                              className="w-full bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 text-left"
                            >
                              <div className="font-medium">Cancel Immediately</div>
                              <div className="text-sm text-red-100">
                                Lose access to premium features right away
                              </div>
                            </button>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => setShowCancelOptions(false)}
                              disabled={loading}
                              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                            >
                              Never mind, keep my subscription
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              
              {/* Show status message for non-active subscriptions */}
              {subscription.status !== 'active' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-600">
                    Subscription Status: <span className="font-medium capitalize">{subscription.status}</span>
                  </p>
                  {subscription.status === 'canceled' && subscription.canceledAt && (
                    <p className="text-sm text-gray-500 mt-1">
                      Canceled on {new Date(subscription.canceledAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
} 