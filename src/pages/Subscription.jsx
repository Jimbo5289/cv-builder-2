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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showUpgradePrompt = location.state?.upgrade;
  const redirectFrom = location.state?.from?.pathname;
  const { apiUrl } = useServer();

  // Map from path to feature name
  const featureMap = {
    '/cv-analyze': 'Basic CV Analysis',
    '/cv-analyze-by-role': 'Industry-Specific CV Analysis',
    '/analyze': 'AI CV Analysis with Job Description Matching',
    '/create': 'CV Builder Tool'
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
        console.log(`Trying to fetch subscription at ${baseUrl}/api/subscriptions`);
        const response = await fetch(`${baseUrl}/api/subscriptions`, {
          headers: {
            ...getAuthHeader()
          }
        });
        
        if (response.status === 404) {
          // No subscription found is not an error
          setSubscription(null);
          return true;
        }
        
        if (!response.ok) {
          // Log error but continue trying
          console.error(`Failed to fetch subscription from ${baseUrl}`);
          return false;
        } 
        
        const data = await response.json();
        setSubscription(data);
        return true;
      } catch (err) {
        console.error(`Subscription fetch error at ${baseUrl}:`, err);
        return false;
      }
    };

    fetchSubscription();
  }, [user, apiUrl, getAuthHeader]);

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      
      // Try all possible ports
      let success = false;
      let ports = [apiUrl];
      
      for (const url of new Set(ports)) { // Use Set to eliminate duplicates
        try {
          const response = await fetch(`${url}/api/subscriptions/cancel`, {
            method: 'POST',
            headers: {
              ...getAuthHeader()
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setSubscription(data);
            success = true;
            break;
          }
        } catch (error) {
          console.error(`Failed to cancel subscription at ${url}:`, error);
        }
      }
      
      if (!success) {
        console.error('Failed to cancel subscription on all ports');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setLoading(true);
      
      // Try all possible ports
      let success = false;
      let ports = [apiUrl];
      
      for (const url of new Set(ports)) { // Use Set to eliminate duplicates
        try {
          const response = await fetch(`${url}/api/subscriptions/reactivate`, {
            method: 'POST',
            headers: {
              ...getAuthHeader()
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setSubscription(data);
            success = true;
            break;
          }
        } catch (error) {
          console.error(`Failed to reactivate subscription at ${url}:`, error);
        }
      }
      
      if (!success) {
        console.error('Failed to reactivate subscription on all ports');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hide loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
        {showUpgradePrompt && renderUpgradePrompt()}
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
      
      {showUpgradePrompt && renderUpgradePrompt()}
      
      {!subscription ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">No Active Subscription</h2>
          <p className="mb-4">You are currently on the free plan.</p>
          <Link
            to="/pricing"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            state={{ premium: showUpgradePrompt, from: redirectFrom, feature: getPremiumFeatureName(redirectFrom) }}
          >
            View Plans
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Plan</p>
              <p className="font-semibold">{subscription.planId || 'Premium'}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-semibold capitalize">{subscription.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Current Period</p>
              <p className="font-semibold">
                {new Date(subscription.currentPeriodStart).toLocaleDateString()} -{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Auto-Renewal</p>
              <p className="font-semibold">
                {subscription.cancelAtPeriodEnd ? 'Disabled' : 'Enabled'}
              </p>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd ? (
            <button
              onClick={handleReactivateSubscription}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Reactivate Subscription'}
            </button>
          ) : (
            <button
              onClick={handleCancelSubscription}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Cancel Subscription'}
            </button>
          )}
        </div>
      )}
    </div>
  );
} 