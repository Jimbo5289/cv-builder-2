import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useServer } from './ServerContext';
import toast from 'react-hot-toast';

const PremiumBundleContext = createContext(null);

export function PremiumBundleProvider({ children }) {
  const { user } = useAuth();
  const { serverUrl } = useServer();
  const [bundleUsed, setBundleUsed] = useState(false);
  const [bundleActive, setBundleActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check premium bundle status on mount and when user changes
  useEffect(() => {
    if (user) {
      checkBundleStatus();
    } else {
      setBundleActive(false);
      setBundleUsed(false);
      setIsLoading(false);
    }
  }, [user]);

  // Check if user has an active premium bundle
  const checkBundleStatus = async () => {
    try {
      setIsLoading(true);
      
      // Try to get from localStorage first (for development/offline mode)
      const localBundleStatus = localStorage.getItem(`premium_bundle_${user.id}`);
      if (localBundleStatus) {
        const { active, used } = JSON.parse(localBundleStatus);
        setBundleActive(active);
        setBundleUsed(used);
        setIsLoading(false);
        return;
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
        localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify(mockBundleData));
        setBundleActive(mockBundleData.active);
        setBundleUsed(mockBundleData.used);
        setIsLoading(false);
        return;
      }
      
      // Fetch from server
      const response = await fetch(`${serverUrl}/api/subscription/premium-bundle-status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch premium bundle status');
      }
      
      const data = await response.json();
      
      // Update state with fetched data
      setBundleActive(data.active);
      setBundleUsed(data.used);
      
      // Save to localStorage for offline access
      localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify({
        active: data.active,
        used: data.used
      }));
    } catch (error) {
      console.error('Error checking premium bundle status:', error);
      // For development fallback
      if (import.meta.env.DEV) {
        const mockBundleData = {
          active: true,
          used: false
        };
        localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify(mockBundleData));
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
        localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify({
          active: true,
          used: true
        }));
        toast.success('CV successfully exported! Premium bundle has been used.');
        return true;
      }
      
      // In production, call the API
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${serverUrl}/api/subscription/use-premium-bundle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Revert local state if API call fails
        setBundleUsed(false);
        throw new Error('Failed to mark premium bundle as used');
      }
      
      // Update localStorage
      localStorage.setItem(`premium_bundle_${user.id}`, JSON.stringify({
        active: true,
        used: true
      }));
      
      toast.success('CV successfully exported! Premium bundle has been used.');
      return true;
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
  const context = useContext(PremiumBundleContext);
  if (!context) {
    throw new Error('usePremiumBundle must be used within a PremiumBundleProvider');
  }
  return context;
} 