/* eslint-disable */
const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const { handlePreflight, addCorsHeaders } = require('../middleware/cors');
const router = express.Router();
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');
const { z } = require('zod');
const { sendPasswordResetEmail } = require('../services/emailService');
const { addUserToMailingList } = require('../services/mailchimpService');
const { logger } = require('../config/logger');
const { requireTurnstileVerification } = require('../utils/turnstile');
// eslint-disable-next-line no-unused-vars
const database = require('../config/database');

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#-])[A-Za-z\d@$!%*?&#-]{8,}$/;

// Input validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#-])[A-Za-z\d@$!%*?&#-]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().nullable().optional().transform(val => val === null ? undefined : val),
  marketingConsent: z.boolean().optional().default(false)
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

const passwordResetSchema = z.object({
  email: z.string().email('Invalid email format')
});

const newPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#-])[A-Za-z\d@$!%*?&#-]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
});

// Input validation schema for profile update
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string()
    .optional()
    .refine(val => val === undefined || val === null || val === '' || /^[+\d\s()-]{7,20}$/.test(val), 
      { message: 'Phone number format is invalid' })
});

// Input validation middleware
// eslint-disable-next-line no-unused-vars
const validateRegistrationInput = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password.match(PASSWORD_REGEX)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    });
  }

  next();
};

// Add explicit preflight handling for authentication routes
router.options('/register', handlePreflight);
router.options('/login', handlePreflight);
router.options('/refresh-token', handlePreflight);
router.options('/logout', handlePreflight);
router.options('/profile', handlePreflight);

// Special debug endpoint for CORS testing
router.options('/test-cors', handlePreflight);
router.get('/test-cors', (req, res) => {
  // Add CORS headers
  addCorsHeaders(req, res);
  
  // Return useful debugging information
  res.status(200).json({
    success: true,
    message: 'CORS test successful',
    origin: req.headers.origin || 'No origin header',
    time: new Date().toISOString(),
    headers: {
      received: {
        origin: req.headers.origin,
        host: req.headers.host,
        referer: req.headers.referer
      },
      sent: {
        'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials'),
        'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods')
      }
    }
  });
});

// Debug endpoint for Mailchimp configuration
router.get('/debug/mailchimp', (req, res) => {
  addCorsHeaders(req, res);
  
  const hasApiKey = !!process.env.MAILCHIMP_API_KEY;
  const hasServerPrefix = !!process.env.MAILCHIMP_SERVER_PREFIX;
  const hasListId = !!process.env.MAILCHIMP_LIST_ID;
  
  res.json({
    configured: hasApiKey && hasServerPrefix && hasListId,
    apiKey: hasApiKey ? 'Set' : 'Missing',
    serverPrefix: hasServerPrefix ? process.env.MAILCHIMP_SERVER_PREFIX : 'Missing',
    listId: hasListId ? 'Set' : 'Missing',
    allConfigured: hasApiKey && hasServerPrefix && hasListId
  });
});

// Test Mailchimp integration directly
router.post('/debug/mailchimp-test', async (req, res) => {
  addCorsHeaders(req, res);
  
  try {
    const { email, name } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const testUser = {
      email: email,
      name: name || 'Test User'
    };
    
    const result = await addUserToMailingList(testUser);
    
    res.json({
      success: true,
      mailchimpResult: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Register user
router.post('/register', async (req, res) => {
  addCorsHeaders(req, res);
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name, phone, marketingConsent = false } = validatedData;

    logger.info('Registration attempt:', { email, name, marketingConsent });

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        logger.warn('Registration failed: Email already exists', { email });
        addCorsHeaders(req, res);
        return res.status(400).json({ error: 'Email already registered' });
      }
    } catch (dbError) {
      console.error('Database error during registration:', dbError);
      addCorsHeaders(req, res);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          marketingConsent: marketingConsent,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true
        }
      });

      // Generate tokens using utility functions
      const token = generateToken({ id: user.id });
      const refreshToken = generateRefreshToken({ id: user.id });

      // Add user to mailing list (non-blocking)
      addUserToMailingList(user).then(result => {
        logger.info('Mailchimp subscription result:', { 
          userId: user.id, 
          email: user.email, 
          success: result.success,
          message: result.message,
          mock: result.mock,
          alreadySubscribed: result.alreadySubscribed,
          testEmail: result.testEmail
        });
      }).catch(err => {
        logger.warn('Failed to add user to mailing list:', { 
          userId: user.id, 
          email: user.email, 
          error: err.message 
        });
      });

      logger.info('User registered successfully', { userId: user.id, email });
      return res.status(201).json({
        accessToken: token,
        refreshToken,
        user
      });
    } catch (createError) {
      logger.error('Error creating user:', { error: createError.message });
      
      // Check if this is a connection error
      if (createError.message.includes("Can't reach database server")) {
        return res.status(503).json({ 
          error: 'Database connection issue', 
          message: 'Unable to create account due to database connection issues. Please try again later.'
        });
      }
      
      // For other errors
      return res.status(500).json({ error: 'Database error', message: 'An error occurred while creating your account' });
    }
  } catch (validationError) {
    console.error('Validation error during registration:', validationError);
    addCorsHeaders(req, res);
    return res.status(400).json({ error: 'Invalid input' });
  }
});

// Login user
router.post('/login', authLimiter, async (req, res) => {
  // Add CORS headers to ensure browser accepts the response
  addCorsHeaders(req, res);
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Regular production authentication flow
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        password: true,
        isActive: true,
        failedLoginAttempts: true,
        lockedUntil: true,
        twoFactorEnabled: true,
        twoFactorSecret: true
      }
    });

    if (!user || !user.isActive) {
      logger.warn('Login failed: User not found or inactive', { email });
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      logger.warn('Login failed: Account locked', { email });
      return res.status(429).json({ 
        error: 'Account is temporarily locked. Please try again later.' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment login attempts
      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: {
            increment: 1
          }
        }
      });

      logger.warn('Login failed: Invalid password', { email });
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null
      }
    });

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      logger.info('User has 2FA enabled, requiring verification code', { userId: user.id });
      return res.json({
        requiresTwoFactor: true,
        userId: user.id
      });
    }

    // Generate tokens for non-2FA users
    const accessToken = generateToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date()
      }
    });

    logger.info('User logged in successfully', { userId: user.id });
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Login error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  addCorsHeaders(req, res);
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ 
        error: 'Refresh token required',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (error) {
      logger.info('Refresh token verification failed:', {
        error: error.name,
        message: error.message
      });
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Refresh token expired',
          message: 'Please log in again.',
          code: 'REFRESH_TOKEN_EXPIRED'
        });
      }
      
      return res.status(401).json({ 
        error: 'Invalid refresh token',
        message: 'Please log in again.',
        code: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        isActive: true
      }
    });

    if (!user || !user.isActive) {
      logger.warn('Refresh token failed: User not found or inactive', { userId: decoded.id });
      return res.status(401).json({ 
        error: 'User not found or inactive',
        message: 'Please log in again.',
        code: 'USER_INACTIVE'
      });
    }

    // Generate new tokens
    const newAccessToken = generateToken({ id: user.id });
    const newRefreshToken = generateRefreshToken({ id: user.id });

    logger.info('Token refreshed successfully', { userId: user.id });
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    logger.error('Token refresh error:', { error: error.message, stack: error.stack });
    res.status(500).json({ 
      error: 'Server error',
      message: 'Unable to refresh token',
      code: 'REFRESH_ERROR'
    });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const validatedData = passwordResetSchema.parse(req.body);
    const { email } = validatedData;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      logger.info('Password reset requested for non-existent email', { email });
      return res.json({ message: 'If an account exists, a password reset link will be sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    // Hash the token for storage (don't store plain tokens in the database)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    
    // Store the hashed token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry
      }
    });

    // Send reset email with the non-hashed token
    const emailResult = await sendPasswordResetEmail(
      user.email,
      user.name,
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
    );

    if (!emailResult.success) {
      logger.error('Failed to send password reset email', { 
        userId: user.id, 
        email,
        error: emailResult.error,
        isConfigIssue: emailResult.isConfigIssue
      });
      
      // Still return success to prevent email enumeration
      // But we could add monitoring/alerting here for failed emails
    } else {
      logger.info('Password reset email sent successfully', { userId: user.id, email });
    }
    
    res.json({ message: 'If an account exists, a password reset link will be sent' });
  } catch (error) {
    logger.error('Password reset request error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const validatedData = newPasswordSchema.parse(req.body);
    const { token, password } = validatedData;
    
    // Hash the provided token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!user) {
      logger.warn('Password reset failed: Invalid or expired token');
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    logger.info('Password reset successful', { userId: user.id });
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    logger.error('Password reset error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Change password route
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      logger.warn('Change password failed: Missing required fields', { userId });
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    // Validate new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#-])[A-Za-z\d@$!%*?&#-]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      logger.warn('Change password failed: Password does not meet requirements', { userId });
      return res.status(400).json({
        message: 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      logger.warn('Change password failed: User not found', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      logger.warn('Change password failed: Incorrect current password', { userId });
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    logger.info('Password changed successfully', { userId });
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    logger.error('Error changing password:', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({ message: 'Error changing password' });
  }
});

// Logout user
router.post('/logout', auth, async (req, res) => {
  try {
    logger.info('User logged out successfully', { userId: req.user.id });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      const mockUser = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        phone: req.user.phone, // Include phone in response
        createdAt: new Date()
      };
      return res.json(mockUser);
    }
    
    // Otherwise query the database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true, // Include phone in selection
        createdAt: true,
        subscriptions: {
          where: {
            status: { in: ['active', 'trialing'] },
            currentPeriodEnd: {
              gt: new Date() // Subscription period has not ended
            }
          },
          select: {
            id: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true,
            stripeSubscriptionId: true
          },
          orderBy: {
            currentPeriodEnd: 'desc'
          },
          take: 1
        },
        temporaryAccess: {
          where: {
            endTime: {
              gt: new Date() // Access has not expired
            }
          },
          select: {
            id: true,
            type: true,
            startTime: true,
            endTime: true
          },
          orderBy: {
            endTime: 'desc'
          },
          take: 1
        }
      }
    });

    if (!user) {
      logger.warn('Get current user failed: User not found', { userId: req.user.id });
      return res.status(404).json({ error: 'User not found' });
    }

    // Format the response to include subscription info
    const responseUser = {
      ...user,
      subscription: user.subscriptions && user.subscriptions.length > 0 ? user.subscriptions[0] : null,
      temporaryAccess: user.temporaryAccess && user.temporaryAccess.length > 0 ? user.temporaryAccess[0] : null
    };

    // Remove the subscriptions array from the response since we've flattened it
    delete responseUser.subscriptions;

    res.json(responseUser);
  } catch (error) {
    logger.error('Get current user error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/users/stats', auth, async (req, res) => {
  try {
    // For development mode, return mock data when specified
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_SUBSCRIPTION_DATA === 'true') {
      logger.info('Using mock statistics data in development mode');
      return res.json({
        cvsCreated: Math.floor(Math.random() * 10),
        analysesRun: Math.floor(Math.random() * 5),
        lastActive: new Date().toISOString()
      });
    }

    const userId = req.user.id;
    
    // Get CV count
    const cvCount = await prisma.cv.count({
      where: { userId }
    });
    
    // Get analyses count (if you have an analyses table)
    let analysesCount = 0;
    try {
      analysesCount = await prisma.analysis.count({
        where: { userId }
      });
    } catch (err) {
      // If analyses table doesn't exist, just use 0
      logger.warn('Analysis table may not exist, using count 0');
    }
    
    // Get last activity time
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        lastLoginAt: true,
        updatedAt: true 
      }
    });
    
    // Use the most recent activity timestamp
    const lastActive = user.lastLoginAt && user.lastLoginAt > user.updatedAt 
      ? user.lastLoginAt 
      : user.updatedAt;
    
    res.json({
      cvsCreated: cvCount,
      analysesRun: analysesCount,
      lastActive: lastActive
    });
  } catch (error) {
    logger.error('Get user stats error:', { error: error.message, stack: error.stack, userId: req.user.id });
    res.status(500).json({ error: 'Error fetching user statistics' });
  }
});

// Test Sentry error tracking (remove in production)
router.get('/test-sentry', (req, res) => {
  throw new Error('Test Sentry Error Tracking');
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
    
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Generate a new access token
    const accessToken = generateToken({ id: user.id });
    
    res.json({ accessToken });
  } catch (error) {
    logger.error('Token refresh error:', { error: error.message, stack: error.stack });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token has expired, please login again' });
    }
    
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Get user data by ID (for 2FA verification)
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate tokens
    const accessToken = generateToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });
    
    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date()
      }
    });
    
    logger.info('User data retrieved after 2FA verification', { userId: user.id });
    
    res.json({
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Get user error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      const mockUser = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        phone: req.user.phone, // Include phone in mock response
        createdAt: new Date()
      };
      return res.json(mockUser);
    }
    
    // Otherwise query the database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true, // Include phone in selection
        createdAt: true
      }
    });

    if (!user) {
      logger.warn('Get profile failed: User not found', { userId: req.user.id });
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user
    });
  } catch (error) {
    logger.error('Get profile error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    // Extract validated fields only
    const { name, email, phone } = req.body;
    
    // Log the profile update request in development mode
    if (process.env.NODE_ENV === 'development') {
      logger.info('Profile update request received:', {
        userId: req.user?.id,
        path: req.originalUrl,
        hasData: !!req.body,
        hasPhone: !!phone
      });
    }
    
    // Parse and validate the data
    let validatedData = {};
    try {
      validatedData = updateProfileSchema.parse({
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined
      });
    } catch (validationError) {
      logger.warn('Profile update validation failed', {
        error: validationError.errors,
        userId: req.user?.id
      });
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.errors
      });
    }

    // If there's no user ID (shouldn't happen with our auth middleware)
    if (!req.user?.id) {
      logger.error('Profile update failed: No user ID in request', {
        hasAuthToken: !!req.headers.authorization,
        path: req.originalUrl,
      });
      return res.status(401).json({ error: 'Authentication required' });
    }

    // In development with SKIP_AUTH_CHECK, just return success
    if (process.env.NODE_ENV === 'development' && 
        (process.env.SKIP_AUTH_CHECK === 'true' || req.user.id === 'dev-user-id')) {
      logger.info('Development mode: Simulating successful profile update', {
        data: validatedData
      });
      
      // Return the updated user data
      return res.json({
        success: true,
        message: 'Profile updated successfully (development mode)',
        user: {
          ...req.user,
          ...validatedData
        }
      });
    }

    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      return res.json({
        success: true,
        message: 'Profile updated successfully (dev mode)',
        user: {
          ...req.user,
          ...validatedData
        }
      });
    }

    // UPDATE: Keep the phone field for database updates
    const dataToUpdate = { ...validatedData };
    // No longer removing phone field as it's now supported in the schema
    
    // Update the user profile in the database with all fields including phone
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true, // Add phone to selected fields
        createdAt: true
      }
    });

    logger.info('User profile updated successfully', {
      userId: req.user.id,
      updatedFields: Object.keys(validatedData)
    });

    // Return the updated user
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Update profile error:', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id
    });
    
    // Return a friendly error message
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// The /users/profile endpoint should properly forward to the profile handler
router.put('/users/profile', auth, async (req, res) => {
  try {
    // Extract validated fields
    const { name, email, phone } = req.body;
    
    // Log the incoming data for debugging
    if (process.env.NODE_ENV === 'development') {
      logger.info('Profile update request received on /users/profile:', { 
        userId: req.user?.id,
        path: req.originalUrl,
        hasData: !!req.body,
        hasPhone: !!phone
      });
    }
    
    // Parse and validate the data
    let validatedData = {};
    try {
      validatedData = updateProfileSchema.parse({
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined
      });
    } catch (validationError) {
      logger.warn('Profile update validation failed on /users/profile', {
        error: validationError.errors,
        userId: req.user?.id
      });
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.errors
      });
    }

    // If there's no user ID (shouldn't happen with our auth middleware)
    if (!req.user?.id) {
      logger.error('Profile update failed on /users/profile: No user ID in request', {
        hasAuthToken: !!req.headers.authorization,
        path: req.originalUrl,
      });
      return res.status(401).json({ error: 'Authentication required' });
    }

    // In development with SKIP_AUTH_CHECK, just return success
    if (process.env.NODE_ENV === 'development' && 
        (process.env.SKIP_AUTH_CHECK === 'true' || req.user.id === 'dev-user-id')) {
      logger.info('Development mode: Simulating successful profile update on /users/profile', {
        data: validatedData
      });
      
      // Return the updated user data
      return res.json({
        success: true,
        message: 'Profile updated successfully (development mode)',
        user: {
          ...req.user,
          ...validatedData
        }
      });
    }

    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      return res.json({
        success: true,
        message: 'Profile updated successfully (dev mode)',
        user: {
          ...req.user,
          ...validatedData
        }
      });
    }

    // Update the user profile in the database 
    const dataToUpdate = { ...validatedData };
    // Keep phone field in the update data
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true, // Include phone in the response
        createdAt: true
      }
    });

    logger.info('User profile updated successfully via /users/profile endpoint', {
      userId: req.user.id,
      updatedFields: Object.keys(validatedData)
    });

    // Return the updated user
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Update profile error on /users/profile:', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id
    });
    
    // Return a friendly error message
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// Debug endpoint to check if user exists (temporary for troubleshooting)
router.get('/debug/user-exists/:email', async (req, res) => {
  addCorsHeaders(req, res);
  try {
    const email = req.params.email;
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        failedLoginAttempts: true,
        lockedUntil: true
      }
    });

    if (!user) {
      return res.json({ 
        exists: false, 
        message: 'User not found in database' 
      });
    }

    res.json({
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isActive: user.isActive,
        createdAt: user.createdAt,
        failedLoginAttempts: user.failedLoginAttempts,
        isLocked: user.lockedUntil && user.lockedUntil > new Date()
      }
    });
  } catch (error) {
    logger.error('Debug user check error:', { error: error.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// Temporary password reset endpoint for production troubleshooting
router.post('/temp-reset-password', async (req, res) => {
  addCorsHeaders(req, res);
  try {
    const { email, secretKey } = req.body;
    
    // Security check - only allow for specific email with secret
    if (email !== 'jamesingleton1971@gmail.com' || secretKey !== 'temp-reset-2025') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const bcrypt = require('bcryptjs');
    const newPassword = 'TempPassword123!';
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the user password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        password: hashedPassword,
        failedLoginAttempts: 0,
        lockedUntil: null,
        isActive: true
      },
      select: { id: true, email: true, name: true, isActive: true }
    });
    
    logger.info('Temporary password reset completed', { userId: updatedUser.id });
    
    res.json({
      success: true,
      message: 'Password reset successfully',
      user: updatedUser,
      tempPassword: newPassword
    });
    
  } catch (error) {
    logger.error('Temporary password reset error:', { error: error.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout endpoint to handle invalid tokens
router.post('/logout', (req, res) => {
  addCorsHeaders(req, res);
  try {
    // Clear any client-side tokens by sending instructions
    res.json({
      success: true,
      message: 'Logged out successfully',
      clearTokens: true
    });
  } catch (error) {
    logger.error('Logout error:', { error: error.message });
    res.status(500).json({ error: 'Server error' });
  }
});

// Token validation endpoint for troubleshooting
router.post('/validate-token', (req, res) => {
  addCorsHeaders(req, res);
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        valid: false, 
        error: 'No token provided',
        code: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      valid: true,
      userId: decoded.id || decoded.userId, // Handle both token formats
      expires: new Date(decoded.exp * 1000),
      issuedAt: new Date(decoded.iat * 1000),
      timeUntilExpiry: Math.max(0, decoded.exp - Math.floor(Date.now() / 1000))
    });
  } catch (error) {
    let errorCode = 'INVALID_TOKEN';
    let hint = 'Token expired or invalid';
    
    if (error.name === 'TokenExpiredError') {
      errorCode = 'TOKEN_EXPIRED';
      hint = 'Token has expired - please log in again';
    } else if (error.message.includes('invalid signature')) {
      errorCode = 'INVALID_SIGNATURE';
      hint = 'Server was restarted - please refresh and log in again';
    } else if (error.message.includes('jwt malformed')) {
      errorCode = 'MALFORMED_TOKEN';
      hint = 'Token format is invalid - please log in again';
    }
    
    // Log token validation failures as info (not warnings) to reduce noise
    logger.info('Token validation failed:', {
      error: error.name,
      message: error.message,
      code: errorCode,
      ip: req.ip
    });
    
    res.status(401).json({
      valid: false,
      error: error.message,
      code: errorCode,
      hint: hint
    });
  }
});

// Get user profile (for admin panel)
router.get('/profile', auth, async (req, res) => {
  addCorsHeaders(req, res);
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    logger.error('Get profile error:', { error: error.message, userId: req.user?.id });
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile (for admin panel)
router.put('/profile', auth, async (req, res) => {
  addCorsHeaders(req, res);
  try {
    const { email, name, currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // If changing password, validate current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set new password' });
      }

      // Verify current password
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { password: true }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Validate new password strength
      if (!newPassword.match(PASSWORD_REGEX)) {
        return res.status(400).json({
          error: 'New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        });
      }
    }

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ error: 'Email is already taken' });
      }
    }

    // Prepare update data
    const updateData = {
      email,
      name: name || null,
      updatedAt: new Date()
    };

    // Hash new password if provided
    if (newPassword) {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    logger.info('User profile updated via admin panel', {
      userId: req.user.id,
      updatedFields: Object.keys(updateData),
      passwordChanged: !!newPassword
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Update profile error (admin panel):', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id
    });
    
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// Request password reset
module.exports = router;