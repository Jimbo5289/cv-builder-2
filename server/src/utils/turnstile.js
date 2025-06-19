/* eslint-disable */
/**
 * Cloudflare Turnstile verification utility
 * 
 * This utility handles server-side verification of Turnstile tokens
 * received from the frontend registration form.
 */

const { logger } = require('../config/logger');

/**
 * Verify a Turnstile token with Cloudflare's API
 * @param {string} token - The Turnstile token from the frontend
 * @param {string} remoteip - The user's IP address (optional)
 * @returns {Promise<{success: boolean, errorCodes?: string[]}>}
 */
async function verifyTurnstileToken(token, remoteip = null) {
  try {
    if (!token) {
      console.log('No Turnstile token provided');
      return { success: false, error: 'No verification token provided' };
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA';
    const verifyURL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    console.log('Verifying Turnstile token...');
    const response = await fetch(verifyURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`
    });

    if (!response.ok) {
      console.error('Turnstile verification request failed:', response.status);
      return { success: false, error: 'Verification service unavailable' };
    }

    const result = await response.json();
    console.log('Turnstile verification result:', { success: result.success, errorCodes: result['error-codes'] });

    return {
      success: result.success,
      errorCodes: result['error-codes'] || []
    };
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return { success: false, error: 'Verification failed' };
  }
}

/**
 * Get user-friendly error message from Turnstile error codes
 * @param {string[]} errorCodes - Array of error codes from Turnstile API
 * @returns {string} User-friendly error message
 */
function getTurnstileErrorMessage(errorCodes) {
  if (!errorCodes || errorCodes.length === 0) {
    return 'Security verification failed. Please try again.';
  }

  const errorMessages = {
    'missing-input-secret': 'Server configuration error. Please contact support.',
    'invalid-input-secret': 'Server configuration error. Please contact support.',
    'missing-input-response': 'Please complete the security verification.',
    'invalid-input-response': 'Security verification failed. Please try again.',
    'bad-request': 'Invalid request. Please refresh the page and try again.',
    'timeout-or-duplicate': 'Security verification expired. Please try again.',
    'internal-error': 'Temporary verification service error. Please try again.',
    'api-request-failed': 'Could not verify security challenge. Please try again.',
    'missing-secret-key': 'Server configuration error. Please contact support.'
  };

  // Return the first recognizable error message
  for (const code of errorCodes) {
    if (errorMessages[code]) {
      return errorMessages[code];
    }
  }

  return 'Security verification failed. Please try again.';
}

/**
 * Middleware to verify Turnstile token in requests
 * Use this middleware on routes that require human verification
 */
function requireTurnstileVerification(options = {}) {
  const { 
    skipInDevelopment = true,
    skipForDomainTransition = false,
    tokenField = 'turnstileToken',
    ipFromHeader = 'x-forwarded-for' 
  } = options;

  return async (req, res, next) => {
    // Skip verification in development if configured
    if (skipInDevelopment && process.env.NODE_ENV === 'development') {
      logger.info('Skipping Turnstile verification in development mode');
      return next();
    }

    // Skip verification temporarily during domain transition
    if (skipForDomainTransition) {
      logger.info('Skipping Turnstile verification during domain transition');
      return next();
    }

    const token = req.body[tokenField];
    const clientIP = req.headers[ipFromHeader] || req.connection.remoteAddress;

    const verification = await verifyTurnstileToken(token, clientIP);

    if (!verification.success) {
      const errorMessage = getTurnstileErrorMessage(verification.errorCodes);
      return res.status(400).json({
        error: 'Security verification failed',
        message: errorMessage,
        errorCodes: verification.errorCodes
      });
    }

    // Verification successful, continue to next middleware
    next();
  };
}

module.exports = {
  verifyTurnstileToken,
  getTurnstileErrorMessage,
  requireTurnstileVerification
}; 