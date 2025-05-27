const nodemailer = require('nodemailer');
const { logger } = require('../config/logger');
const { z } = require('zod');

// Input validation schemas
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().optional()
});

const subscriptionSchema = z.object({
  planId: z.string(),
  status: z.string(),
  currentPeriodEnd: z.date()
});

// Validate email environment variables
const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASSWORD', 'EMAIL_FROM'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  logger.warn(`Missing email configuration: ${missingVars.join(', ')}. Email functionality will fall back to mock mode.`);
}

// Use consistent URL for frontend
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';

// Email templates
const templates = {
  subscriptionConfirmation: (user, subscription) => ({
    subject: 'Subscription Confirmation - CV Builder',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #4a90e2; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to CV Builder!</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued customer'},</p>
              <p>Thank you for subscribing to CV Builder! Your subscription has been successfully activated.</p>
              <h2>Subscription Details:</h2>
              <ul>
                <li>Plan: ${subscription.planId}</li>
                <li>Status: ${subscription.status}</li>
                <li>Next billing date: ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}</li>
              </ul>
              <p>If you have any questions, our support team is here to help.</p>
              <p>
                <a href="${FRONTEND_URL}/support" class="button">Contact Support</a>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  paymentFailed: (user, invoice) => ({
    subject: 'Payment Failed - Action Required',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #e24a4a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #4a90e2; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Failed</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued customer'},</p>
              <p>We were unable to process your payment for CV Builder. To ensure uninterrupted service, please:</p>
              <ol>
                <li>Check your payment method</li>
                <li>Ensure sufficient funds are available</li>
                <li>Update your billing information if necessary</li>
              </ol>
              <p>
                <a href="${FRONTEND_URL}/billing" class="button">Update Payment Information</a>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  paymentSuccess: (user, payment) => ({
    subject: 'Payment Confirmation - CV Builder',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #4a90e2; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Payment Successful</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued customer'},</p>
              <p>Thank you for your payment! Your transaction has been successfully processed.</p>
              <h2>Payment Details:</h2>
              <ul>
                <li>Amount: ${payment.currency.toUpperCase() === 'GBP' ? '£' : payment.currency.toUpperCase()} ${payment.amount.toFixed(2)}</li>
                <li>Date: ${new Date().toLocaleDateString()}</li>
              </ul>
              <p>You can now access your CV Builder features or download your enhanced CV.</p>
              <p>
                <a href="${FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  subscriptionCancelled: (user) => ({
    subject: 'Subscription Cancelled - CV Builder',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #4a90e2; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Subscription Cancelled</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued customer'},</p>
              <p>Your CV Builder subscription has been cancelled as requested.</p>
              <p>We're sorry to see you go! If you change your mind, you can reactivate your subscription at any time.</p>
              <p>
                <a href="${FRONTEND_URL}/pricing" class="button">Reactivate Subscription</a>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),
  
  passwordReset: (user, resetLink) => ({
    subject: 'Reset Your Password - CV Builder',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #4a90e2; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued user'},</p>
              <p>We received a request to reset your password for CV Builder. If you didn't make this request, you can safely ignore this email.</p>
              <p>To reset your password, click the button below:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </p>
              <p>This link will expire in 1 hour for security reasons.</p>
              <p>If the button doesn't work, you can copy and paste this URL into your browser:</p>
              <p style="word-break: break-all;">${resetLink}</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }),
  
  contactForm: (senderInfo, message) => ({
    subject: `Contact Form: ${senderInfo.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Message</h1>
            </div>
            <div class="content">
              <h2>Sender Information:</h2>
              <ul>
                <li><strong>Name:</strong> ${senderInfo.name}</li>
                <li><strong>Email:</strong> ${senderInfo.email}</li>
                <li><strong>Subject:</strong> ${senderInfo.subject}</li>
              </ul>
              <h2>Message:</h2>
              <p>${message.split('\n').join('<br>')}</p>
            </div>
            <div class="footer">
              <p>This message was sent from the CV Builder contact form.</p>
            </div>
          </div>
        </body>
      </html>
    `
  })
};

// Create email transporter
let transporter = null;
let isEmailConfigured = false;
let authenticationFailed = false;
let lastTransporterInitAttempt = 0;
const TRANSPORTER_RETRY_INTERVAL = 3600000; // 1 hour in milliseconds

// Initialize and verify email transporter
const initializeTransporter = () => {
  // Skip initialization if previous attempt failed authentication and retry interval hasn't passed
  const now = Date.now();
  if (authenticationFailed && (now - lastTransporterInitAttempt < TRANSPORTER_RETRY_INTERVAL)) {
    return Promise.resolve(false);
  }
  
  lastTransporterInitAttempt = now;
  
  // Skip if essential config is missing
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER) {
    logger.warn('Email service not fully configured - some environment variables are missing. Using mock email service.');
    isEmailConfigured = false;
    return Promise.resolve(false);
  }

  try {
    // Configure transporter based on authentication type
    const transporterConfig = {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10),
      secure: process.env.EMAIL_SECURE === 'true',
      // Set higher timeout for email server connections
      connectionTimeout: 10000, // 10 seconds
      // Handle authentication errors gracefully
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || '', // Make password optional
      },
      // Add debug info if DEBUG_EMAIL is set
      debug: process.env.DEBUG_EMAIL === 'true',
      // Don't throw errors on invalid login
      tls: {
        rejectUnauthorized: false // Accept self-signed certificates
      }
    };

    // Configure OAuth2 auth if specified
    if (process.env.EMAIL_AUTH_TYPE === 'OAuth2') {
      if (process.env.EMAIL_CLIENT_ID && process.env.EMAIL_CLIENT_SECRET && process.env.EMAIL_REFRESH_TOKEN) {
        transporterConfig.auth = {
          type: 'OAuth2',
          user: process.env.EMAIL_USER,
          clientId: process.env.EMAIL_CLIENT_ID,
          clientSecret: process.env.EMAIL_CLIENT_SECRET,
          refreshToken: process.env.EMAIL_REFRESH_TOKEN,
        };
      } else {
        logger.warn('OAuth2 authentication selected but credentials are incomplete. Falling back to mock email service.');
        isEmailConfigured = false;
        return Promise.resolve(false);
      }
    }

    // Create the transporter with the configuration
    transporter = nodemailer.createTransport(transporterConfig);

    // Verify connection and authentication
    logger.info('Verifying email transporter configuration...');
    
    // Use a promise to handle the verify callback more gracefully
    return new Promise((resolve) => {
      transporter.verify((error, success) => {
        if (error) {
          // Check if it's an authentication error
          if (error.code === 'EAUTH' || 
              (error.response && error.response.includes('5.7.8')) || 
              error.message.includes('Invalid login')) {
            logger.error('Email authentication failed:', { 
              error: error.message,
              code: error.code,
              user: process.env.EMAIL_USER,
              host: process.env.EMAIL_HOST
            });
            authenticationFailed = true;
          } else {
            logger.error('Email transporter configuration error:', { 
              error: error.message,
              code: error.code || 'UNKNOWN' 
            });
          }
          
          // For any error, disable the real email service
          isEmailConfigured = false;
          transporter = null;
          resolve(false);
        } else {
          // Success
          logger.info('Email transporter is configured and ready to send messages');
          isEmailConfigured = true;
          authenticationFailed = false;
          resolve(true);
        }
      });
    });
  } catch (error) {
    logger.error('Failed to initialize email transporter:', error);
    isEmailConfigured = false;
    transporter = null;
    return Promise.resolve(false);
  }
};

// Initialize transporter, but don't block on it
try {
  initializeTransporter();
} catch (err) {
  logger.error('Async email transporter initialization failed:', err);
  isEmailConfigured = false;
  transporter = null;
}

// Mock email service for development when SMTP is not configured
const mockEmailService = (message, templateName) => {
  logger.info('Using mock email service', {
    to: message.to,
    subject: message.subject,
    reason: authenticationFailed ? 'Authentication failed' : 'SMTP not configured',
    templateName
  });
  
  // Log the full message content to help with debugging
  console.log('\n======= MOCK EMAIL SENT =======');
  console.log('To:', message.to);
  console.log('From:', message.from);
  console.log('Reply-To:', message.replyTo || 'N/A');
  console.log('Subject:', message.subject);
  
  if (templateName === 'contactForm') {
    // For contact forms, extract and display the actual message content
    try {
      const startMessageTag = '<h2>Message:</h2>';
      const endMessageTag = '</div>';
      const messageContent = message.html.substring(
        message.html.indexOf(startMessageTag) + startMessageTag.length,
        message.html.indexOf(endMessageTag, message.html.indexOf(startMessageTag))
      );
      console.log('\nMessage Content:');
      console.log(messageContent.replace(/<br>/g, '\n').replace(/<\/?p>/g, '').trim());
    } catch (err) {
      console.log('Content:', message.html.substring(0, 300) + '... [truncated]');
    }
  } else {
    console.log('Content:', message.html ? 'HTML Email' : message.text);
  }
  console.log('===============================\n');
  
  // Return a successful response for development
  return Promise.resolve({
    messageId: `mock-email-${Date.now()}@localhost`,
    mock: true
  });
};

/**
 * Send an email using the specified template
 * @param {Object} user - User object
 * @param {Object} data - Additional data for the template
 * @param {string} templateName - Name of the template to use
 * @returns {Promise<void>}
 */
const sendEmail = async (user, data, templateName) => {
  try {
    // Validate input
    const validatedUser = userSchema.parse(user);
    
    // Get template
    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template ${templateName} not found`);
    }

    // Generate email content
    const { subject, html } = template(validatedUser, data);

    // Create message object
    const message = {
      from: process.env.EMAIL_FROM || 'support@cvbuilder.com',
      to: validatedUser.email,
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || 'support@cvbuilder.com',
      subject,
      html
    };

    // If we're in development or email hasn't been configured successfully, use mock
    if (!isEmailConfigured || process.env.NODE_ENV === 'development') {
      // Try to initialize transporter again if more than the retry interval has passed
      const shouldRetryInit = !authenticationFailed || 
        (Date.now() - lastTransporterInitAttempt >= TRANSPORTER_RETRY_INTERVAL);
      
      if (shouldRetryInit) {
        await initializeTransporter();
      }
      
      // If still not configured, use mock
      if (!isEmailConfigured) {
        logger.warn('Email service not configured properly, using mock service instead');
        const mockInfo = await mockEmailService(message, templateName);
        return { success: true, messageId: mockInfo.messageId, mock: true };
      }
    }

    try {
      // Attempt to send email with real transporter
      const info = await transporter.sendMail(message);
      
      logger.info('Email sent successfully:', { 
        messageId: info.messageId,
        template: templateName,
        recipient: validatedUser.email
      });
      
      return { success: true, messageId: info.messageId };
    } catch (sendError) {
      // If sending fails, fall back to mock
      logger.error('Failed to send email with transporter, falling back to mock:', { 
        error: sendError.message,
        code: sendError.code || 'UNKNOWN'
      });
      
      // If it's an auth error, mark authentication as failed
      if (sendError.code === 'EAUTH' || sendError.message.includes('Invalid login')) {
        authenticationFailed = true;
        isEmailConfigured = false;
      }
      
      const mockInfo = await mockEmailService(message, templateName);
      return { success: true, messageId: mockInfo.messageId, mock: true, fallback: true };
    }
  } catch (error) {
    logger.error('Failed to prepare email:', {
      error: error.message,
      template: templateName,
      recipient: user?.email
    });
    
    // Return error instead of throwing to prevent route handlers from crashing
    return { 
      success: false, 
      error: error.message,
      isConfigIssue: !isEmailConfigured
    };
  }
};

/**
 * Send subscription confirmation email
 * @param {Object} user - User object
 * @param {Object} subscription - Subscription details
 * @returns {Promise<void>}
 */
const sendSubscriptionConfirmation = async (user, subscription) => {
  const validatedSubscription = subscriptionSchema.parse(subscription);
  return sendEmail(user, validatedSubscription, 'subscriptionConfirmation');
};

/**
 * Send payment failed notification email
 * @param {Object} user - User object
 * @param {Object} invoice - Invoice details
 * @returns {Promise<void>}
 */
const sendPaymentFailedNotification = async (user, invoice) => {
  return sendEmail(user, invoice, 'paymentFailed');
};

/**
 * Send payment success notification email
 * @param {Object} user - User object
 * @param {Object} payment - Payment details
 * @returns {Promise<void>}
 */
const sendPaymentSuccessNotification = async (user, payment) => {
  return sendEmail(user, payment, 'paymentSuccess');
};

/**
 * Send subscription cancelled notification email
 * @param {Object} user - User object
 * @returns {Promise<void>}
 */
const sendSubscriptionCancelledNotification = async (user) => {
  return sendEmail(user, null, 'subscriptionCancelled');
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @param {string} name - User's name
 * @param {string} resetLink - Password reset link
 * @returns {Promise<Object>} Result object with success status
 */
const sendPasswordResetEmail = async (email, name, resetLink) => {
  const user = { email, name };
  return sendEmail(user, resetLink, 'passwordReset');
};

/**
 * Send contact form email
 * @param {Object} senderInfo - Sender information (name, email, subject)
 * @param {string} message - Message content
 * @returns {Promise<Object>} Result object with success status
 */
const sendContactFormEmail = async (senderInfo, message) => {
  try {
    // Generate email content
    const { subject, html } = templates.contactForm(senderInfo, message);

    // Create email message
    const emailMessage = {
      from: process.env.EMAIL_FROM || 'support@cvbuilder.com',
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER || 'support@cvbuilder.com',
      replyTo: senderInfo.email,
      subject,
      html
    };

    // Check if transporter is available
    if (!isEmailConfigured && !initializeTransporter()) {
      logger.warn('Email service not configured properly for contact form, using mock service');
      const mockInfo = await mockEmailService(emailMessage, 'contactForm');
      return { success: true, messageId: mockInfo.messageId, mock: true };
    }

    // Send email using real transporter or fall back to mock
    const info = transporter ? await transporter.sendMail(emailMessage) : await mockEmailService(emailMessage, 'contactForm');
    
    logger.info('Contact form email sent successfully:', { 
      messageId: info.messageId,
      sender: senderInfo.email,
      mock: !!info.mock
    });
    
    return { success: true, messageId: info.messageId, mock: !!info.mock };
  } catch (error) {
    logger.error('Failed to send contact form email:', {
      error: error.message,
      sender: senderInfo.email
    });
    
    return { 
      success: false, 
      error: error.message,
      isConfigIssue: !isEmailConfigured
    };
  }
};

module.exports = {
  sendSubscriptionConfirmation,
  sendPaymentFailedNotification,
  sendPaymentSuccessNotification,
  sendSubscriptionCancelledNotification,
  sendPasswordResetEmail,
  sendContactFormEmail
}; 