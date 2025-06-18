const Sentry = require('@sentry/node');
// Remove all problematic dependencies
// const { ProfilingIntegration } = require('@sentry/profiling-node');
// const { NodeTracingIntegration } = require('@sentry/node');
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
    // Get default integrations using the new Sentry v9 API
    let defaultIntegrations = [];
    try {
      // Try the new way first (Sentry v9+)
      if (typeof Sentry.getDefaultIntegrations === 'function') {
        defaultIntegrations = Sentry.getDefaultIntegrations();
      } else if (Array.isArray(Sentry.defaultIntegrations)) {
        // Fallback for older versions
        defaultIntegrations = Sentry.defaultIntegrations;
      } else {
        // Last resort - empty array (Sentry will use its own defaults)
        defaultIntegrations = [];
      }
    } catch (integrationsError) {
      console.warn('Could not get Sentry default integrations, using empty array');
      defaultIntegrations = [];
    }

    const options = {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'development',
      
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      // We recommend adjusting this value in production
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1.0,
      
      // Use integrations safely
      integrations: defaultIntegrations,
      
      // Enable HTTP context in breadcrumbs
      sendDefaultPii: true,
      
      // Capture Release & Environment for versioning
      release: process.env.SENTRY_RELEASE || `cv-builder-server@${process.env.npm_package_version || '1.0.0'}`,
      
      // Set server name for easier identification
      serverName: process.env.HOSTNAME || 'cv-builder-api',
      
      // Configure which errors to capture
      ignoreErrors: [
        // Ignore certain errors that are not actionable
        'ECONNRESET',
        'ETIMEDOUT',
        'ECONNREFUSED',
        'Invalid login'
      ],

      // Before sending an event to Sentry
      beforeSend(event, hint) {
        // Don't send events in development unless explicitly enabled
        if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_ENABLE_DEV) {
          return null;
        }

        // Get the original exception
        const exception = hint && hint.originalException;
        
        // Check for email authentication errors
        if (exception && 
            exception.code === 'EAUTH' && 
            exception.command === 'AUTH PLAIN') {
          // Don't send email authentication errors to Sentry
          return null;
        }

        // Anonymize user data
        if (event.user) {
          event.user = {
            id: event.user.id ? Anonymizer.maskUserId(event.user.id) : undefined,
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