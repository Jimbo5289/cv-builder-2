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
    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      const mockUser = {
        id: req.user.id,
        email: req.user.email || 'dev@example.com',
        name: req.body.name || req.user.name || 'Development User',
        phone: req.body.phone || req.user.phone || '',
        createdAt: new Date()
      };
      return res.json({
        success: true,
        message: 'Profile updated successfully (mock mode)',
        user: mockUser
      });
    }

    // Validate input
    const validatedData = updateProfileSchema.parse(req.body);
    
    // Remove undefined values
    const updateData = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.email !== undefined) updateData.email = validatedData.email;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;

    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Check if email is being changed and if it already exists
    if (updateData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id: req.user.id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Update the user profile in the database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
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
      updatedFields: Object.keys(updateData)
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

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      return res.json({
        cvsCreated: 3,
        analyzesRun: 1,
        lastActive: new Date()
      });
    }

    const userId = req.user.id;
    
    // Get CV count
    const cvCount = await prisma.cV.count({
      where: { userId }
    });

    // Get analysis count (with fallback if table doesn't exist)
    let analysisCount = 0;
    try {
      analysisCount = await prisma.analysis.count({
        where: { userId }
      });
    } catch (error) {
      logger.warn('Analysis table may not exist, using count 0');
    }

    // Get last activity (most recent CV update)
    const lastCV = await prisma.cV.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true }
    });

    res.json({
      cvsCreated: cvCount,
      analyzesRun: analysisCount,
      lastActive: lastCV?.updatedAt || null
    });
  } catch (error) {
    logger.error('Get user stats error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
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