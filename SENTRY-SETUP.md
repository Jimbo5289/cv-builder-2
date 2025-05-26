# Sentry Setup Guide

This document provides instructions for setting up Sentry error monitoring for both the frontend and backend of the CV Builder application.

## Backend Setup

Add the following environment variables to `server/development.env` (for development) or your production environment:

```env
# Sentry Backend Settings
SENTRY_DSN=https://YOUR_SENTRY_DSN_HERE@o123456.ingest.sentry.io/123456
SENTRY_ENVIRONMENT=development  # or production
SENTRY_ENABLE_DEV=false  # set to true to enable Sentry in development
SENTRY_RELEASE=cv-builder-server@1.0.0
SENTRY_ORG=your-org-name
SENTRY_AUTH_TOKEN=your-auth-token
```

## Frontend Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Sentry Frontend Settings
VITE_SENTRY_DSN=https://YOUR_SENTRY_DSN_HERE@o123456.ingest.sentry.io/123456
VITE_SENTRY_ENVIRONMENT=development  # or production
VITE_SENTRY_ENABLE_DEV=false  # set to true to enable Sentry in development
VITE_SENTRY_RELEASE=cv-builder@1.0.0
VITE_APP_VERSION=1.0.0
```

## Obtaining Sentry DSN

1. Create a project in Sentry (or use an existing one)
2. Navigate to Project Settings > Client Keys (DSN)
3. Copy the DSN value and replace `YOUR_SENTRY_DSN_HERE` in the environment variables

## Testing Sentry Integration

### Frontend Test

Add the following code to any component to test Sentry error reporting:

```jsx
<button 
  onClick={() => {
    try {
      throw new Error('Test Sentry Error');
    } catch (error) {
      import('./config/sentry').then(({ captureException }) => {
        captureException(error);
        alert('Test error sent to Sentry');
      });
    }
  }}
>
  Test Sentry
</button>
```

### Backend Test

Add the following code to any route to test Sentry error reporting:

```js
app.get('/test-sentry', (req, res) => {
  try {
    throw new Error('Test Sentry Error');
  } catch (error) {
    const { getSentry } = require('./src/config/sentry');
    const Sentry = getSentry();
    if (Sentry) {
      Sentry.captureException(error);
      res.send('Test error sent to Sentry');
    } else {
      res.status(500).send('Sentry not initialized');
    }
  }
});
``` 