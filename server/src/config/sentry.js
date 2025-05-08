const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');
const Anonymizer = require('../utils/anonymizer');

let sentryInstance = null;

function initializeSentry() {
  // Skip Sentry initialization in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
    console.log('Sentry disabled in development mode');
    return null;
  }

  if (!process.env.SENTRY_DSN) {
    console.warn('SENTRY_DSN not found in environment variables. Error tracking will be disabled.');
    return null;
  }

  try {
    const options = {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
      
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      
      // Performance monitoring
      integrations: [
        // Initialize ProfilingIntegration only if it's available
        ProfilingIntegration ? new ProfilingIntegration() : null
      ].filter(Boolean), // Remove null values

      // Before sending an event to Sentry
      beforeSend(event) {
        // Don't send events in development unless explicitly enabled
        if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
          return null;
        }

        // Anonymize user data
        if (event.user) {
          event.user = {
            id: Anonymizer.maskUserId(event.user.id),
            email: event.user.email ? Anonymizer.hashEmail(event.user.email) : undefined,
            ip_address: event.user.ip_address ? Anonymizer.hashIp(event.user.ip_address) : undefined
          };
        }

        return event;
      }
    };

    Sentry.init(options);
    sentryInstance = Sentry;
    console.log('Sentry initialized successfully');
    return Sentry;
  } catch (error) {
    console.error('Error in Sentry configuration:', error);
    return null;
  }
}

// Initialize Sentry immediately
const instance = initializeSentry();

module.exports = {
  initializeSentry,
  getSentry: () => instance || sentryInstance
}; 