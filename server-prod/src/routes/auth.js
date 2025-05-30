const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const router = express.Router();
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');
const { z } = require('zod');
const { sendPasswordResetEmail } = require('../services/emailService');
const { logger } = require('../config/logger');
const database = require('../config/database');

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Input validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  name: z.string().min(2, 'Name must be at least 2 characters')
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
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
});

// Input validation middleware
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

// Register user
router.post('/register', async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name } = validatedData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      logger.warn('Registration failed: Email already exists', { email });
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info('User registered successfully', { userId: user.id, email });
    res.status(201).json({
      token,
      user
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    logger.error('Registration error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', authLimiter, async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // For development, check for development environment flag
    if (process.env.NODE_ENV === 'development') {
      logger.info('Development mode login bypass activated');
      
      // In development mode, bypass actual database authentication
      // and return a mock user with admin access
      const mockUser = {
        id: 'dev-user-id',
        name: 'Development User',
        email: email,
        isAdmin: true
      };
      
      // Generate tokens for the mock user
      const accessToken = generateToken({ id: mockUser.id });
      const refreshToken = generateRefreshToken({ id: mockUser.id });
      
      logger.info('Development user logged in successfully', { userId: mockUser.id });
      
      return res.json({
        user: mockUser,
        accessToken,
        refreshToken
      });
    }

    // Regular production authentication flow below
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isActive: true,
        failedLoginAttempts: true,
        lockedUntil: true
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

    logger.info('User logged in successfully', { userId: user.id });
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    logger.error('Login error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    if (!user) {
      logger.warn('Get current user failed: User not found', { userId: req.user.id });
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
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

module.exports = router; 