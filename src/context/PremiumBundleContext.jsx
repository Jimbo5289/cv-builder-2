import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useServer } from './ServerContext';
import toast from 'react-hot-toast';

const PremiumBundleContext = createContext({
  bundleActive: false,
  bundleUsed: false,
  isLoading: true,
  markBundleAsUsed: () => Promise.resolve(false),
  checkBundleStatus: () => Promise.resolve()
});

export function PremiumBundleProvider({ children }) {
  const { user } = useAuth();
  const { serverUrl } = useServer();
  const [bundleUsed, setBundleUsed] = useState(false);
  const [bundleActive, setBundleActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check premium bundle status on mount and when user changes
  useEffect(() => {
    try {
      if (user) {
        checkBundleStatus();
      } else {
        setBundleActive(false);
        setBundleUsed(false);
        setIsLoading(false);
        setError(null);
      }
    } catch (e) {
      console.error('Error in premium bundle effect:', e);
      setIsLoading(false);
      setError('Failed to initialize premium bundle');
    }
  }, [user]);

  // Check if user has an active premium bundle
  const checkBundleStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Skip checks if no user
      if (!user || !user.id) {
        setBundleActive(false);
        setBundleUsed(false);
        setIsLoading(false);
        return;
      }
      
      // Try to get from localStorage first (for development/offline mode)
      try {
        const localBundleStatus = localStorage.getItem(`premium_bundle_${user.id}`);
        if (localBundleStatus) {
          const { active, used } = JSON.parse(localBundleStatus);
          setBundleActive(active);
          setBundleUsed(used);
          setIsLoading(false);
          return;
        }
      } catch (localStorageError) {
        console.error('Error reading bundle status from localStorage:', localStorageError);
        // Remove potentially corrupted data
        localStorage.removeItem(`premium_bundle_${user.id}`);
      }

      // In production, call the API
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      // Development mode for testing
      if (import.meta.env.DEV && import.meta.env.VITE_SKIP_AUTH === 'true') {
        console.log('DEV MODE: Using mock premium bundle data');
        const mockBundleData = {
          active: true,
          used: false
        };
        
        try {
          localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify(mockBundleData));
        } catch (e) {
          console.error('Failed to save mock bundle data to localStorage:', e);
        }
        
        setBundleActive(mockBundleData.active);
        setBundleUsed(mockBundleData.used);
        setIsLoading(false);
        return;
      }
      
      // Fetch from server
      try {
        // Set up timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${serverUrl}/api/subscriptions/premium-bundle-status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch premium bundle status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update state with fetched data
        setBundleActive(data.active);
        setBundleUsed(data.used);
        
        // Save to localStorage for offline access
        try {
          localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify({
            active: data.active,
            used: data.used
          }));
        } catch (storageError) {
          console.error('Failed to save bundle data to localStorage:', storageError);
        }
      } catch (fetchError) {
        console.error('Error fetching bundle status from server:', fetchError);
        throw fetchError;
      }
    } catch (error) {
      console.error('Error checking premium bundle status:', error);
      setError('Failed to check premium bundle status');
      
      // For development fallback
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Using fallback premium bundle data after error');
        const mockBundleData = {
          active: true,
          used: false
        };
        
        try {
          localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify(mockBundleData));
        } catch (e) {
          console.error('Failed to save fallback bundle data:', e);
        }
        
        setBundleActive(mockBundleData.active);
        setBundleUsed(mockBundleData.used);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mark the premium bundle as used
  const markBundleAsUsed = async () => {
    try {
      if (!bundleActive || bundleUsed) {
        return false;
      }
      
      // Update local state immediately for responsive UI
      setBundleUsed(true);
      
      // For development mode
      if (import.meta.env.DEV) {
        try {
          localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify({
            active: true,
            used: true
          }));
        } catch (e) {
          console.error('Failed to update bundle status in localStorage:', e);
        }
        
        toast.success('CV successfully exported! Premium bundle has been used.');
        return true;
      }
      
      // In production, call the API
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      try {
        // Set up timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(`${serverUrl}/api/subscriptions/use-premium-bundle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          // Revert local state if API call fails
          setBundleUsed(false);
          throw new Error(`Failed to mark premium bundle as used: ${response.status}`);
        }
        
        // Update localStorage
        try {
          localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify({
            active: true,
            used: true
          }));
        } catch (storageError) {
          console.error('Failed to update bundle status in localStorage:', storageError);
        }
        
        toast.success('CV successfully exported! Premium bundle has been used.');
        return true;
      } catch (fetchError) {
        // Revert local state if request fails
        setBundleUsed(false);
        throw fetchError;
      }
    } catch (error) {
      console.error('Error marking premium bundle as used:', error);
      toast.error(error.message || 'Failed to process your request');
      return false;
    }
  };

  const value = {
    bundleActive,
    bundleUsed,
    isLoading,
    error,
    markBundleAsUsed,
    checkBundleStatus
  };

  return (
    <PremiumBundleContext.Provider value={value}>
      {children}
    </PremiumBundleContext.Provider>
  );
}

export function usePremiumBundle() {
  try {
    const context = useContext(PremiumBundleContext);
    if (!context) {
      throw new Error('usePremiumBundle must be used within a PremiumBundleProvider');
    }
    return context;
  } catch (e) {
    console.error('Error in usePremiumBundle hook:', e);
    // Return default values if context fails
    return {
      bundleActive: false,
      bundleUsed: false,
      isLoading: false,
      error: 'Failed to access premium bundle context',
      markBundleAsUsed: () => {
        toast.error('Premium bundle service unavailable');
        return Promise.resolve(false);
      },
      checkBundleStatus: () => Promise.resolve()
    };
  }
} 