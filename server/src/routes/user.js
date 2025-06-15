const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { logger } = require('../config/logger');

// Import auth middleware
const { auth } = require('../middleware/auth');

// Initialize Prisma client
const prisma = new PrismaClient();

// Input validation schema for profile update
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string()
    .optional()
    .refine(val => val === undefined || val === null || val === '' || /^[+\d\s()-]{7,20}$/.test(val), 
      { message: 'Phone number format is invalid' })
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      const mockUser = {
        id: req.user.id,
        email: req.user.email || 'dev@example.com',
        name: req.user.name || 'Development User',
        phone: req.user.phone || '',
        createdAt: new Date()
      };
      return res.json({ user: mockUser });
    }
    
    // Otherwise query the database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true
      }
    });

    if (!user) {
      logger.warn('Get profile failed: User not found', { userId: req.user.id });
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get profile error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // Log the profile update request
    if (process.env.NODE_ENV === 'development') {
      logger.info('Profile update request received on /api/users/profile:', {
        userId: req.user?.id,
        hasData: !!req.body,
        hasPhone: !!phone,
        phoneValue: phone
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

    // Check if user is authenticated
    if (!req.user?.id) {
      logger.error('Profile update failed: No user ID in request');
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      logger.info('Development mode: Simulating successful profile update', {
        data: validatedData
      });
      
      return res.json({
        success: true,
        message: 'Profile updated successfully (development mode)',
        user: {
          id: req.user.id,
          email: req.user.email || 'dev@example.com',
          name: validatedData.name || req.user.name || 'Development User',
          phone: validatedData.phone || req.user.phone || '',
          createdAt: new Date()
        }
      });
    }

    // Update the user profile in the database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true
      }
    });

    logger.info('User profile updated successfully', {
      userId: req.user.id,
      updatedFields: Object.keys(validatedData)
    });

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
    
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// Debug endpoint to verify database data (development only)
router.get('/debug/database-check', auth, async (req, res) => {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ error: 'Debug endpoint only available in development' });
    }

    logger.info('Database check requested for user:', { userId: req.user?.id });

    // In development mode with mock database
    if (process.env.MOCK_DATABASE === 'true') {
      return res.json({
        message: 'Mock database mode - data not persisted to AWS',
        mode: 'development',
        mockUser: req.user,
        note: 'In production, this would show real AWS RDS data'
      });
    }

    // Try to fetch user from actual database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true
      }
    });

    if (!user) {
      return res.json({
        message: 'User not found in database',
        userId: req.user.id,
        status: 'not_found'
      });
    }

    res.json({
      message: 'User data successfully retrieved from AWS RDS database',
      status: 'found',
      userData: user,
      databaseConnection: 'AWS RDS PostgreSQL',
      lastUpdated: user.updatedAt
    });

  } catch (error) {
    logger.error('Database check error:', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id
    });
    
    res.json({
      message: 'Database check failed',
      error: error.message,
      status: 'error',
      note: 'This might indicate a database connection issue'
    });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      logger.info('Using mock statistics data in development mode');
      return res.json({
        cvsCreated: Math.floor(Math.random() * 10) + 1,
        analysesRun: Math.floor(Math.random() * 5) + 1,
        lastActive: new Date().toISOString()
      });
    }

    const userId = req.user.id;
    
    // Get CV count
    let cvCount = 0;
    try {
      cvCount = await prisma.cV.count({
        where: { userId }
      });
    } catch (err) {
      logger.warn('CV table may not exist or accessible, using count 0');
    }
    
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
        lastLogin: true,
        updatedAt: true 
      }
    });
    
    // Use the most recent activity timestamp
    const lastActive = user && user.lastLogin && user.lastLogin > user.updatedAt 
      ? user.lastLogin 
      : user?.updatedAt || new Date();
    
    res.json({
      cvsCreated: cvCount,
      analysesRun: analysesCount,
      lastActive: lastActive
    });
  } catch (error) {
    logger.error('Get user stats error:', { 
      error: error.message, 
      stack: error.stack, 
      userId: req.user?.id 
    });
    
    // Return mock data instead of error to prevent frontend issues
    res.json({
      cvsCreated: 0,
      analysesRun: 0,
      lastActive: new Date().toISOString()
    });
  }
});

// Get expiration notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = [];
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      // Return mock notification for development
      return res.json({ 
        notifications: [{
          type: 'subscription',
          title: 'Subscription Expiring Soon',
          message: 'Your Monthly Subscription will expire in 5 days.',
          daysRemaining: 5,
          expiryDate: new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000)),
          severity: 'warning'
        }]
      });
    }

    // Check for expiring subscriptions
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.user.id,
        status: { in: ['active', 'trialing'] },
        currentPeriodEnd: {
          gt: now,
          lte: sevenDaysFromNow
        }
      }
    });

    for (const subscription of activeSubscriptions) {
      const daysRemaining = Math.ceil((subscription.currentPeriodEnd - now) / (1000 * 60 * 60 * 24));
      const severity = daysRemaining <= 3 ? 'error' : 'warning';
      
      notifications.push({
        type: 'subscription',
        title: 'Subscription Expiring Soon',
        message: `Your ${subscription.planId || 'subscription'} will ${subscription.cancelAtPeriodEnd ? 'end' : 'renew'} in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`,
        daysRemaining,
        expiryDate: subscription.currentPeriodEnd,
        severity,
        autoRenew: !subscription.cancelAtPeriodEnd
      });
    }

    // Check for expiring temporary access
    const temporaryAccess = await prisma.temporaryAccess.findMany({
      where: {
        userId: req.user.id,
        endTime: {
          gt: now,
          lte: sevenDaysFromNow
        }
      }
    });

    for (const access of temporaryAccess) {
      const daysRemaining = Math.ceil((access.endTime - now) / (1000 * 60 * 60 * 24));
      const severity = daysRemaining <= 3 ? 'error' : 'warning';
      
      let accessTypeName = 'Premium Access';
      if (access.type === '30day-access') {
        accessTypeName = '30-Day Access Pass';
      } else if (access.type === 'pay-per-cv') {
        accessTypeName = 'Pay-Per-CV Access';
      }
      
      notifications.push({
        type: 'temporary_access',
        title: 'Premium Access Expiring Soon',
        message: `Your ${accessTypeName} will expire in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`,
        daysRemaining,
        expiryDate: access.endTime,
        severity,
        accessType: access.type
      });
    }

    res.json({ notifications });
  } catch (error) {
    logger.error('Get notifications error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
