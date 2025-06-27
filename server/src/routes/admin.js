/**
 * Admin Routes
 * 
 * This module provides endpoints for administrative operations.
 * These endpoints are restricted to admin users only.
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth: authMiddleware } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/security');
const { logger } = require('../config/logger');

// Initialize Prisma client
const prisma = new PrismaClient();

// Apply strict rate limiting to all admin routes
router.use(adminLimiter);

/**
 * Enhanced admin authentication middleware
 * Checks if the authenticated user has admin privileges with additional security
 */
const adminAuth = async (req, res, next) => {
  try {
    // Skip admin check in development mode if configured
    if (process.env.SKIP_AUTH_CHECK === 'true' && process.env.NODE_ENV === 'development') {
      logger.warn('Admin authentication check skipped in development mode', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path
      });
      return next();
    }
    
    // Check if user exists and is an admin
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('Admin access attempt without authentication', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path
      });
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        isActive: true 
      }
    });
    
    // Enhanced admin privilege checking - based on email only for now
    const isAuthorizedAdmin = user && (
      user.email === 'jamesingleton1971@gmail.com' // Your permanent admin access
    );
    
    if (!user) {
      logger.warn('Admin access attempt with invalid user', {
        userId,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path
      });
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.isActive) {
      logger.warn('Admin access attempt with inactive user', {
        userId,
        userEmail: user.email,
        ip: req.ip,
        path: req.path
      });
      return res.status(403).json({ error: 'Account is inactive' });
    }
    
    if (!isAuthorizedAdmin) {
      logger.error('Unauthorized admin access attempt', {
        userId,
        userEmail: user.email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        timestamp: new Date().toISOString()
      });
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    
    // Log successful admin access for audit trail
    logger.info('Admin access granted', {
      userId,
      userEmail: user.email,
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString()
    });
    
    // Add user info to request for further use
    req.adminUser = user;
    next();
  } catch (error) {
    logger.error('Admin authentication error', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      path: req.path
    });
    res.status(500).json({ error: 'Admin authentication failed' });
  }
};

/**
 * @route GET /api/admin/dashboard
 * @desc Get admin dashboard data
 * @access Admin only
 */
router.get('/dashboard', authMiddleware, adminAuth, async (req, res) => {
  try {
    // Get user statistics
    const userCount = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });
    
    // Get CV statistics
    const cvCount = await prisma.cV.count();
    
    // Get subscription statistics
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'active' }
    });
    
    res.status(200).json({
      users: {
        total: userCount,
        active: activeUsers
      },
      cvs: {
        total: cvCount
      },
      subscriptions: {
        active: activeSubscriptions
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to retrieve admin dashboard data' });
  }
});

/**
 * @route GET /api/admin/users
 * @desc Get all users (paginated)
 * @access Admin only
 */
router.get('/users', authMiddleware, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        isActive: true,
        lastLogin: true,
        marketingConsent: true,
        _count: {
          select: {
            cvs: true,
            subscriptions: true
          }
        }
      }
    });
    
    const totalUsers = await prisma.user.count();
    
    res.status(200).json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    res.status(500).json({ error: 'Failed to retrieve users list' });
  }
});

/**
 * @route GET /api/admin/users/:id
 * @desc Get detailed user information
 * @access Admin only
 */
router.get('/users/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        isActive: true,
        marketingConsent: true,
        customerId: true,
        cvs: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true
          }
        },
        subscriptions: {
          select: {
            id: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true
          }
        },
        temporaryAccess: {
          select: {
            id: true,
            endTime: true,
            createdAt: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Admin user detail error:', error);
    res.status(500).json({ error: 'Failed to retrieve user details' });
  }
});

/**
 * @route PUT /api/admin/users/:id
 * @desc Update user information
 * @access Admin only
 */
router.put('/users/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, isActive, marketingConsent } = req.body;
    
    // Validate input
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: { 
          email: email,
          NOT: { id: userId }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use by another user' });
      }
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(typeof isActive === 'boolean' && { isActive }),
        ...(typeof marketingConsent === 'boolean' && { marketingConsent }),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        marketingConsent: true,
        updatedAt: true
      }
    });
    
    logger.info('User updated by admin', {
      adminUserId: req.user.id,
      targetUserId: userId,
      changes: { name, email, isActive, marketingConsent }
    });
    
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Admin user update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * @route POST /api/admin/users/:id/export
 * @desc Export all user data (GDPR Right to Portability)
 * @access Admin only
 */
router.post('/users/:id/export', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get complete user data
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cvs: {
          include: {
            sections: true
          }
        },
        subscriptions: true,
        temporaryAccess: true
      }
    });
    
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove sensitive data before export
    const { password, twoFactorSecret, ...exportData } = userData;
    
    // Add export metadata
    const dataExport = {
      exportDate: new Date().toISOString(),
      exportedBy: 'admin',
      dataSubject: exportData.email,
      userData: exportData
    };
    
    logger.info('User data exported', {
      adminUserId: req.user.id,
      targetUserId: userId,
      exportDate: dataExport.exportDate
    });
    
    res.status(200).json(dataExport);
  } catch (error) {
    console.error('Admin user export error:', error);
    res.status(500).json({ error: 'Failed to export user data' });
  }
});

/**
 * @route DELETE /api/admin/users/:id
 * @desc Permanently delete user and all associated data (GDPR Right to Erasure)
 * @access Admin only
 */
router.delete('/users/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { confirmEmail } = req.body;
    
    // Get user to verify existence and email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Require email confirmation for safety
    if (confirmEmail !== user.email) {
      return res.status(400).json({ 
        error: 'Email confirmation required',
        message: 'Please provide the user\'s email address to confirm deletion'
      });
    }
    
    // Don't allow deletion of admin users
    if (user.email === 'jamesingleton1971@gmail.com' || user.email === 'admin@example.com') {
      return res.status(403).json({ 
        error: 'Cannot delete admin user',
        message: 'Admin users cannot be deleted through this interface'
      });
    }
    
    logger.info('Starting user deletion process', {
      adminUserId: req.user.id,
      targetUserId: userId,
      targetEmail: user.email
    });
    
    // Delete in correct order due to foreign key constraints
    try {
      // 1. Delete CV sections first (they reference CVs)
      await prisma.cVSection.deleteMany({
        where: {
          cv: {
            userId: userId
          }
        }
      });
      
      // 2. Delete CVs
      await prisma.cV.deleteMany({
        where: { userId: userId }
      });
      
      // 3. Delete subscriptions
      await prisma.subscription.deleteMany({
        where: { userId: userId }
      });
      
      // 4. Delete temporary access records
      await prisma.temporaryAccess.deleteMany({
        where: { userId: userId }
      });
      
      // 5. Finally delete the user
      await prisma.user.delete({
        where: { id: userId }
      });
      
      logger.info('User deletion completed successfully', {
        adminUserId: req.user.id,
        deletedUserId: userId,
        deletedUserEmail: user.email
      });
      
      res.status(200).json({
        success: true,
        message: 'User and all associated data has been permanently deleted',
        deletedUser: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        deletionDate: new Date().toISOString()
      });
      
    } catch (dbError) {
      logger.error('Database error during user deletion', {
        adminUserId: req.user.id,
        targetUserId: userId,
        error: dbError.message
      });
      
      res.status(500).json({
        error: 'Failed to delete user data',
        message: 'A database error occurred during deletion. Please try again.'
      });
    }
    
  } catch (error) {
    console.error('Admin user deletion error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

/**
 * @route POST /api/admin/users/:id/deactivate
 * @desc Deactivate user account (reversible)
 * @access Admin only
 */
router.post('/users/:id/deactivate', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        isActive: false,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });
    
    logger.info('User deactivated by admin', {
      adminUserId: req.user.id,
      targetUserId: userId
    });
    
    res.status(200).json({
      success: true,
      message: 'User account has been deactivated',
      user
    });
  } catch (error) {
    console.error('Admin user deactivation error:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

/**
 * @route POST /api/admin/users/:id/reactivate
 * @desc Reactivate user account
 * @access Admin only
 */
router.post('/users/:id/reactivate', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        isActive: true,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });
    
    logger.info('User reactivated by admin', {
      adminUserId: req.user.id,
      targetUserId: userId
    });
    
    res.status(200).json({
      success: true,
      message: 'User account has been reactivated',
      user
    });
  } catch (error) {
    console.error('Admin user reactivation error:', error);
    res.status(500).json({ error: 'Failed to reactivate user' });
  }
});

module.exports = router; 