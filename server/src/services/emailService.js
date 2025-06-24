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
    subject: '🎉 Welcome to MyCVBuilder.co.uk Premium! Your subscription is active',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="icon" type="image/png" href="${FRONTEND_URL}/images/mycvbuilder-logo.png">
          <title>Welcome to MyCVBuilder.co.uk Premium!</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { padding: 30px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; background-color: #f8fafc; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #3b82f6 0%, #10b981 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 5px; }
            .feature-box { background: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 8px; padding: 20px; margin: 15px 0; }
            .checkmark { color: #10b981; font-weight: bold; margin-right: 8px; }
            .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${FRONTEND_URL}/images/mycvbuilder-logo.png" alt="MyCVBuilder.co.uk Logo" style="max-width: 80px; height: auto; margin-bottom: 20px; border-radius: 8px;" />
              <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
              <h1 style="margin: 0; font-size: 28px;">Thank You for Your Purchase!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your MyCVBuilder.co.uk Premium subscription is now active</p>
            </div>
            <div class="content">
              <p style="font-size: 18px; margin-bottom: 25px;">Dear ${user.name || 'valued customer'},</p>
              
              <p style="font-size: 16px; margin-bottom: 25px;">
                Welcome to <span class="highlight">MyCVBuilder.co.uk Premium!</span> You've just unlocked our complete suite of AI-powered career tools designed to help you land your dream job.
              </p>

              <div class="feature-box">
                <h3 style="color: #1f2937; margin-top: 0; margin-bottom: 15px;">🚀 What's Now Available to You:</h3>
                <ul style="margin: 0; padding-left: 0; list-style: none;">
                  <li style="margin-bottom: 8px;"><span class="checkmark">✓</span>AI-powered CV analysis and optimization</li>
                  <li style="margin-bottom: 8px;"><span class="checkmark">✓</span>Advanced ATS compatibility scoring</li>
                  <li style="margin-bottom: 8px;"><span class="checkmark">✓</span>Premium professional templates</li>
                  <li style="margin-bottom: 8px;"><span class="checkmark">✓</span>Industry-specific keyword suggestions</li>
                  <li style="margin-bottom: 8px;"><span class="checkmark">✓</span>Career pathway insights and recommendations</li>
                  <li style="margin-bottom: 8px;"><span class="checkmark">✓</span>Priority customer support</li>
                  <li><span class="checkmark">✓</span>Multiple export formats (PDF, Word)</li>
                </ul>
              </div>

              <h3 style="color: #1f2937; margin-bottom: 15px;">📋 Your Subscription Details:</h3>
              <ul style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <li style="margin-bottom: 8px;"><strong>Plan:</strong> ${subscription.planId}</li>
                <li style="margin-bottom: 8px;"><strong>Status:</strong> <span style="color: #10b981; font-weight: 600;">${subscription.status}</span></li>
                <li><strong>Next billing date:</strong> ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${FRONTEND_URL}/" class="button">🚀 Let's Get Started!</a>
                <a href="${FRONTEND_URL}/analyze" class="button">🔍 Analyze Your CV</a>
              </div>

              <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <p style="margin: 0; color: #166534; font-weight: 600;">💡 Pro Tip:</p>
                <p style="margin: 10px 0 0 0; color: #166534;">Start by uploading your current CV for analysis. Our AI will provide personalized recommendations to improve your chances of landing interviews!</p>
              </div>

              <p style="font-size: 16px; margin-bottom: 15px;">
                Need help getting started? Our priority support team is standing by to assist you with any questions.
              </p>

                             <div style="text-align: center; margin: 25px 0;">
                 <a href="${FRONTEND_URL}/contact" class="button">Contact Support</a>
               </div>
            </div>
            <div class="footer">
              <p style="margin-bottom: 10px;">
                📧 A copy of this confirmation has been saved to your account
              </p>
              <p style="margin-bottom: 15px;">This is an automated message from MyCVBuilder.co.uk. If you have any questions, we're here to help!</p>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 11px; color: #6b7280; line-height: 1.4;">
                <p style="margin: 0 0 8px 0;"><strong>MyCVBuilder Ltd</strong> • Company Number: 16521310 • Trading as MyCVBuilder.co.uk</p>
                <p style="margin: 0 0 8px 0;">Registered Office: 4th Floor, Silverstream House, 45 Fitzroy Street, Fitzrovia, London, W1T 6EB, England</p>
                <p style="margin: 0 0 8px 0;">📧 <a href="mailto:support@mycvbuilder.co.uk" style="color: #4a90e2;">support@mycvbuilder.co.uk</a> • 🌐 <a href="https://mycvbuilder.co.uk" style="color: #4a90e2;">mycvbuilder.co.uk</a></p>
                <p style="margin: 0 0 8px 0;">You are receiving this email because you have a subscription with MyCVBuilder.co.uk. 
                   View our <a href="${FRONTEND_URL}/privacy-policy" style="color: #4a90e2;">Privacy Policy</a> and 
                   <a href="${FRONTEND_URL}/terms" style="color: #4a90e2;">Terms of Service</a>.</p>
                <p style="margin: 0;">To unsubscribe from marketing emails, <a href="${FRONTEND_URL}/unsubscribe?email=${encodeURIComponent(user.email)}&user=${user.id || user.email}" style="color: #4a90e2;">manage your preferences</a> or contact support.</p>
              </div>
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
              <img src="${FRONTEND_URL}/images/mycvbuilder-logo.png" alt="MyCVBuilder.co.uk Logo" style="max-width: 60px; height: auto; margin-bottom: 15px; border-radius: 6px;" />
              <h1>Payment Failed</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued customer'},</p>
              <p>We were unable to process your payment for MyCVBuilder.co.uk. To ensure uninterrupted service, please:</p>
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
    subject: 'Payment Confirmation - MyCVBuilder.co.uk',
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
              <img src="${FRONTEND_URL}/images/mycvbuilder-logo.png" alt="MyCVBuilder.co.uk Logo" style="max-width: 60px; height: auto; margin-bottom: 15px; border-radius: 6px;" />
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
              <p>You can now access your MyCVBuilder.co.uk features or download your enhanced CV.</p>
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

  temporaryAccessPurchase: (user, accessDetails) => ({
    subject: '30-Day Access Pass Activated - MyCVBuilder.co.uk',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #22c55e; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #22c55e; color: white; text-decoration: none; border-radius: 5px; }
            .highlight { background: #f0f9ff; padding: 15px; border-left: 4px solid #22c55e; margin: 20px 0; }
            .feature-list { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${FRONTEND_URL}/images/mycvbuilder-logo.png" alt="MyCVBuilder.co.uk Logo" style="max-width: 60px; height: auto; margin-bottom: 15px; border-radius: 6px;" />
              <h1>🎉 Your 30-Day Access Pass is Active!</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued customer'},</p>
              <p>Congratulations! Your 30-Day Access Pass has been successfully activated. You now have full access to all premium features for the next 30 days.</p>
              
              <div class="highlight">
                <h3>📅 Access Period</h3>
                <p><strong>Start Date:</strong> ${new Date(accessDetails.startTime).toLocaleDateString('en-GB')}</p>
                <p><strong>End Date:</strong> ${new Date(accessDetails.endTime).toLocaleDateString('en-GB')}</p>
                <p><em>Make the most of your premium access!</em></p>
              </div>

              <div class="feature-list">
                <h3>✨ What You Can Do Now:</h3>
                <ul>
                  <li>✅ Create unlimited professional CVs</li>
                  <li>✅ Access all premium templates</li>
                  <li>✅ Get comprehensive AI analysis and feedback</li>
                  <li>✅ Use advanced ATS optimization tools</li>
                  <li>✅ Download and print your CVs</li>
                  <li>✅ Get skills gap identification</li>
                  <li>✅ Receive upskill course recommendations</li>
                </ul>
              </div>

              <h3>🚀 Ready to Start?</h3>
              <p>Your premium features are now unlocked and ready to use. Start creating an amazing CV that gets results!</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${FRONTEND_URL}/dashboard" class="button">Start Creating CVs</a>
              </p>

              <p>If you have any questions or need assistance, our support team is here to help.</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
              <p>Visit <a href="${FRONTEND_URL}">MyCVBuilder.co.uk</a> | <a href="${FRONTEND_URL}/contact">Contact Support</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  payPerCvPurchase: (user, paymentDetails) => ({
    subject: 'Pay-Per-CV Purchase Confirmed - MyCVBuilder.co.uk',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .button { display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 5px; }
            .highlight { background: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0; }
            .feature-list { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${FRONTEND_URL}/images/mycvbuilder-logo.png" alt="MyCVBuilder.co.uk Logo" style="max-width: 60px; height: auto; margin-bottom: 15px; border-radius: 6px;" />
              <h1>📝 Your Pay-Per-CV Purchase is Ready!</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued customer'},</p>
              <p>Thank you for your Pay-Per-CV purchase! You can now create and download one professional CV with our guided process and basic ATS analysis.</p>
              
              <div class="highlight">
                <h3>💳 Purchase Details</h3>
                <p><strong>Amount:</strong> £${paymentDetails.amount.toFixed(2)}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</p>
                <p><strong>CV Downloads:</strong> 1 CV download included</p>
              </div>

              <div class="feature-list">
                <h3>📋 What's Included:</h3>
                <ul>
                  <li>✅ Guided CV creation process</li>
                  <li>✅ Access to standard templates</li>
                  <li>✅ Basic ATS scoring and feedback</li>
                  <li>✅ One CV download/print</li>
                  <li>✅ Professional formatting help</li>
                </ul>
              </div>

              <h3>🎯 Next Steps:</h3>
              <ol>
                <li>Click the button below to start creating your CV</li>
                <li>Fill in your information using our guided process</li>
                <li>Get basic ATS feedback and scoring</li>
                <li>Download your completed CV</li>
              </ol>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${FRONTEND_URL}/create" class="button">Create My CV</a>
              </p>

              <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <h4 style="color: #92400e; margin-top: 0;">💡 Need More Features?</h4>
                <p style="color: #92400e; margin-bottom: 0;">If you need to create multiple CVs or want access to advanced AI analysis, consider upgrading to our monthly or annual subscription for unlimited access to all premium features.</p>
              </div>

              <p>If you have any questions or need assistance, our support team is here to help.</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply directly to this email.</p>
              <p>Visit <a href="${FRONTEND_URL}">MyCVBuilder.co.uk</a> | <a href="${FRONTEND_URL}/contact">Contact Support</a></p>
            </div>
          </div>
        </body>
      </html>
    `
  }),

  subscriptionCancelled: (user) => ({
    subject: 'Subscription Cancelled - MyCVBuilder.co.uk',
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
              <img src="${FRONTEND_URL}/images/mycvbuilder-logo.png" alt="MyCVBuilder.co.uk Logo" style="max-width: 60px; height: auto; margin-bottom: 15px; border-radius: 6px;" />
              <h1>Subscription Cancelled</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued customer'},</p>
              <p>Your MyCVBuilder.co.uk subscription has been cancelled as requested.</p>
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
    subject: 'Reset Your Password - MyCVBuilder.co.uk',
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
              <img src="${FRONTEND_URL}/images/mycvbuilder-logo.png" alt="MyCVBuilder.co.uk Logo" style="max-width: 60px; height: auto; margin-bottom: 15px; border-radius: 6px;" />
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Dear ${user.name || 'valued user'},</p>
              <p>We received a request to reset your password for MyCVBuilder.co.uk. If you didn't make this request, you can safely ignore this email.</p>
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
              <img src="${FRONTEND_URL}/images/mycvbuilder-logo.png" alt="MyCVBuilder.co.uk Logo" style="max-width: 60px; height: auto; margin-bottom: 15px; border-radius: 6px;" />
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
              <p>This message was sent from the MyCVBuilder.co.uk contact form.</p>
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
      from: {
        name: 'MyCVBuilder.co.uk',
        address: process.env.EMAIL_FROM || 'support@mycvbuilder.co.uk'
      },
      to: validatedUser.email,
      subject,
      html,
      headers: {
        'X-Entity-Ref-ID': 'mycvbuilder-notification',
        'List-Unsubscribe': `<${FRONTEND_URL}/profile>`,
        'Organization': 'MyCVBuilder Ltd'
      }
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
 * Send 30-day access purchase confirmation email
 * @param {Object} user - User object
 * @param {Object} accessDetails - Access details including start and end time
 * @returns {Promise<void>}
 */
const sendTemporaryAccessConfirmation = async (user, accessDetails) => {
  return sendEmail(user, accessDetails, 'temporaryAccessPurchase');
};

/**
 * Send pay-per-cv purchase confirmation email
 * @param {Object} user - User object
 * @param {Object} paymentDetails - Payment details
 * @returns {Promise<void>}
 */
const sendPayPerCvConfirmation = async (user, paymentDetails) => {
  return sendEmail(user, paymentDetails, 'payPerCvPurchase');
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
      from: {
        name: 'MyCVBuilder.co.uk Contact Form',
        address: process.env.EMAIL_FROM || 'support@mycvbuilder.co.uk'
      },
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER || 'support@mycvbuilder.co.uk',
      replyTo: senderInfo.email,
      subject,
      html,
      headers: {
        'Organization': 'MyCVBuilder Ltd'
      }
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
  sendTemporaryAccessConfirmation,
  sendPayPerCvConfirmation,
  sendSubscriptionCancelledNotification,
  sendPasswordResetEmail,
  sendContactFormEmail
}; 