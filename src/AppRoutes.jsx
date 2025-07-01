/* eslint-disable */

/**
 * @component AppRoutes
 * @description Main routing component that handles the application's route configuration and rendering.
 * This component is responsible for:
 * - Setting up the React Router routes based on the configuration in routes.jsx
 * - Handling protected routes that require authentication
 * - Providing loading states during route transitions
 * - Implementing a fallback 404 page for invalid routes
 * - Optimizing router performance through the RouterOptimizer component
 * 
 * The component dynamically maps the routes configuration array to Route components.
 * It also implements route protection by wrapping protected routes with authentication checks.
 * 
 * @context AuthContext - Used to check authentication state for protected routes
 * 
 * @returns {JSX.Element} The configured Routes component with all application routes
 */
import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import routes from './routes';
import RouterOptimizer from './components/RouterOptimizer';
import AuthGuard from './components/AuthGuard';
import { validateCurrentRoute } from './utils/redirectToHome';
import { trackPageView } from './utils/analytics';

/**
 * @component LoadingComponent
 * @description Displays a loading spinner when routes are being lazy-loaded
 * Used as a fallback for Suspense during code-splitting and route transitions
 * 
 * @returns {JSX.Element} A centered loading spinner with text
 */
const LoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

/**
 * @component NotFound
 * @description 404 page displayed when users navigate to non-existent routes
 * Provides a user-friendly error message and a link back to the home page
 * 
 * @returns {JSX.Element} A styled 404 error page
 */
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
    <div className="text-center max-w-md p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">The page you are looking for doesn't exist or has been moved.</p>
      <a 
        href="/" 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Go Back Home
      </a>
    </div>
  </div>
);

/**
 * @component ProtectedRoute
 * @description Higher-order component that restricts access to authenticated users only
 * Redirects unauthenticated users to the login page while preserving the original navigation
 * 
 * @param {Object} props - Component props
 * @param {JSX.Element} props.element - The component to render if authentication passes
 * @param {boolean} props.requiresAuth - Whether authentication is required
 * 
 * @returns {JSX.Element} Either the protected component or a redirect to login
 */
const ProtectedRoute = ({ element, requiresAuth }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  
  if (loading) return <LoadingComponent />;
  
  // Check if we have a token in localStorage even if auth state isn't loaded yet
  // This prevents redirecting to login on page refresh when user should stay logged in
  const hasToken = localStorage.getItem('token');
  const hasUser = localStorage.getItem('user');
  
  // If we have both token and user data in localStorage, consider user authenticated
  // This prevents the redirect-to-login issue on page refresh
  if (hasToken && hasUser && !isAuthenticated && !loading) {
    console.log('User has valid localStorage data, preventing redirect to login');
    return <LoadingComponent />;
  }
  
  return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} replace />;
};

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route changes
    if (typeof window !== 'undefined' && window.gtag) {
      console.log('Tracking page view:', location.pathname);
      trackPageView(location.pathname, document.title);
    }
  }, [location]);
}

const AppRoutes = () => {
  const location = useLocation();
  
  // Add page tracking for analytics
  usePageTracking();
  
  // Safely check if routes is valid
  if (!Array.isArray(routes) || routes.length === 0) {
    console.error('Routes is not a valid array!', routes);
    return <NotFound />;
  }
  
  return (
    <Suspense fallback={<LoadingComponent />}>
      {/* Use the comprehensive RouterOptimizer instead of just the compatibility handler */}
      <RouterOptimizer />
      
      <Routes>
        {routes.map((route) => {
          const { path, Component, protected: requiresAuth } = route;
          
          // Skip invalid routes
          if (!path || !Component) {
            console.warn('Invalid route configuration:', route);
            return null;
          }
          
          return (
            <Route 
              key={path} 
              path={path} 
              element={
                requiresAuth ? (
                  <AuthGuard requireAuth={requiresAuth}>
                    <Component />
                  </AuthGuard>
                ) : (
                  <Component />
                )
              } 
            />
          );
        })}
        
        {/* Fallback route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
