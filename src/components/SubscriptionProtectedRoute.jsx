import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useServer } from '../context/ServerContext';

function SubscriptionProtectedRoute({ children, skipCheck = false }) {
  const { isAuthenticated, user, getAuthHeader } = useAuth();
  const location = useLocation();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { apiUrl } = useServer();
  
  // Check if we're in development mode with mock subscription enabled
  const mockSubscription = import.meta.env.VITE_MOCK_SUBSCRIPTION_DATA === 'true';
  
  useEffect(() => {
    // If skipCheck is true or mockSubscription is enabled, we'll consider the user as having a subscription
    if (skipCheck || mockSubscription) {
      console.log('Skipping subscription check - using mock data or skipCheck enabled');
      setHasActiveSubscription(true);
      setLoading(false);
      return;
    }
    
    const checkSubscription = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      // Try with the main API URL first
      let success = await tryFetchSubscription(apiUrl);
      
      // If main API URL fails, try fallback ports
      if (!success) {
        for (const port of fallbackPorts) {
          const fallbackUrl = `http://localhost:${port}`;
          if (fallbackUrl !== apiUrl) { // Skip if already tried with this URL
            success = await tryFetchSubscription(fallbackUrl);
            if (success) break;
          }
        }
      }
      
      // If all attempts failed
      if (!success && !error) {
        setError('Error checking subscription status');
        toast.error('Failed to verify subscription. Please try again later.');
      }
      
      setLoading(false);
    };
    
    const tryFetchSubscription = async (baseUrl) => {
      try {
        console.log(`Trying to check subscription at ${baseUrl}/api/subscriptions/status`);
        const response = await fetch(`${baseUrl}/api/subscriptions/status`, {
          headers: {
            ...getAuthHeader(),
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setHasActiveSubscription(data.hasActiveSubscription);
          return true;
        } else if (response.status === 401) {
          // Authentication error - handled by auth context
          console.error('Authentication error while checking subscription');
          return false;
        } else {
          console.error('Failed to check subscription status:', response.status);
          return false;
        }
      } catch (error) {
        console.error(`Failed to check subscription at ${baseUrl}:`, error);
        return false;
      }
    };
    
    checkSubscription();
  }, [isAuthenticated, user, getAuthHeader, apiUrl, skipCheck, mockSubscription]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Verifying subscription...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mb-4">Subscription Error</h2>
          <p className="text-gray-600 text-center mb-6">We couldn't verify your subscription status. Please try again later.</p>
          <div className="flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!hasActiveSubscription && !skipCheck && !mockSubscription) {
    return <Navigate to="/subscription" state={{ upgrade: true, from: location }} replace />;
  }
  
  return children;
}

export default SubscriptionProtectedRoute; 