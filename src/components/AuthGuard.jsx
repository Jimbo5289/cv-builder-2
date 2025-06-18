import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasStoredAuth, validateStoredAuth } from '../utils/authPersistence';

/**
 * Loading component for authentication checks
 */
const AuthLoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Checking authentication...</p>
    </div>
  </div>
);

/**
 * AuthGuard component that handles authentication flow more gracefully
 * Prevents unnecessary redirects during page refresh when user should remain authenticated
 */
const AuthGuard = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  useEffect(() => {
    // Give the auth context a moment to initialize from localStorage
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // If auth is not required, render children immediately
  if (!requireAuth) {
    return children;
  }
  
  // Show loading while auth context is initializing
  if (loading || !initialLoadComplete) {
    return <AuthLoadingComponent />;
  }
  
  // If user is authenticated, render children
  if (isAuthenticated && user) {
    return children;
  }
  
  // Check if we have valid stored auth data before redirecting
  // This prevents unnecessary redirects during auth context initialization
  if (hasStoredAuth() && validateStoredAuth()) {
    console.log('Valid auth data found in storage, waiting for auth context to catch up');
    return <AuthLoadingComponent />;
  }
  
  // Only redirect to login if we're sure the user is not authenticated
  console.log('No valid authentication found, redirecting to login');
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AuthGuard; 