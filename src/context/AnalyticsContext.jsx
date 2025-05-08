import { createContext, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackPageView } from '../utils/analytics';
import * as Sentry from '@sentry/react';

const AnalyticsContext = createContext(null);

export function AnalyticsProvider({ children }) {
  const location = useLocation();

  const trackUserAction = useCallback((action, properties = {}) => {
    trackEvent(action, {
      ...properties,
      path: location.pathname,
      timestamp: new Date().toISOString()
    });

    // Add breadcrumb to Sentry
    Sentry.addBreadcrumb({
      category: 'user_action',
      message: action,
      level: 'info',
      data: {
        ...properties,
        path: location.pathname
      }
    });
  }, [location]);

  const trackError = useCallback((error, properties = {}) => {
    // Let Sentry handle error tracking
    Sentry.captureException(error, {
      extra: {
        ...properties,
        path: location.pathname
      }
    });
  }, [location]);

  const trackPerformance = useCallback((metric) => {
    trackEvent('performance', {
      ...metric,
      path: location.pathname,
      timestamp: new Date().toISOString()
    });

    // Track performance in Sentry
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `Performance metric: ${metric.type}`,
      level: 'info',
      data: {
        ...metric,
        path: location.pathname
      }
    });
  }, [location]);

  const value = {
    trackUserAction,
    trackError,
    trackPerformance
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
} 