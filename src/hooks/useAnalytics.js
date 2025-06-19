import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { trackPageView, trackEvent, trackUserAction, trackConversion, trackFormInteraction } from '../utils/analytics';

/**
 * Custom hook for analytics tracking
 * Automatically tracks page views on route changes
 */
export const useAnalytics = () => {
  const location = useLocation();

  // Track page views automatically when location changes
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location]);

  return {
    trackEvent,
    trackUserAction,
    trackConversion,
    trackFormInteraction,
    trackPageView: (path, title) => trackPageView(path, title)
  };
};

/**
 * HOC to wrap components with automatic analytics tracking
 */
export const withAnalytics = (WrappedComponent) => {
  return function AnalyticsWrapper(props) {
    useAnalytics();
    return <WrappedComponent {...props} />;
  };
}; 