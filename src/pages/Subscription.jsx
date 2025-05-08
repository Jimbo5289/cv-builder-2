import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const stripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Subscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch('/api/subscription');
        if (!response.ok) throw new Error('Failed to fetch subscription');
        const data = await response.json();
        setSubscription(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to cancel subscription');
      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription/reactivate', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to reactivate subscription');
      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>
      
      {!subscription ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">No Active Subscription</h2>
          <p className="mb-4">You are currently on the free plan.</p>
          <a
            href="/pricing"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View Plans
          </a>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Plan</p>
              <p className="font-semibold">{subscription.planId}</p>
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