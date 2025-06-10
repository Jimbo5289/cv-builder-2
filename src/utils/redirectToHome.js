/**
 * Utility function to redirect to the home page
 * Can be used to handle cases where a user lands on a non-existent route
 */
export const redirectToHome = () => {
  window.location.href = '/';
};

/**
 * Checks if the current route exists in the application
 * If not, redirects to the home page
 * @param {Array} routes - Array of route objects with path properties
 */
export const validateCurrentRoute = (routes) => {
  const currentPath = window.location.pathname;
  
  // Special case for root path
  if (currentPath === '/') return;
  
  // Check if the current path matches any route
  const routeExists = routes.some(route => {
    // Exact match
    if (route.path === currentPath) return true;
    
    // Match with parameters (simple version)
    if (route.path.includes(':') && currentPath.startsWith(route.path.split(':')[0])) return true;
    
    return false;
  });
  
  // If route doesn't exist, redirect to home
  if (!routeExists) {
    console.warn(`Route not found: ${currentPath}, redirecting to home`);
    window.location.href = '/';
  }
}; 