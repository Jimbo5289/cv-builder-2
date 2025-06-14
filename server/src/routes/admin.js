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

// Initialize Prisma client
const prisma = new PrismaClient();

/**
 * Admin authentication middleware
 * Checks if the authenticated user has admin privileges
 */
const adminAuth = async (req, res, next) => {
  try {
    // Skip admin check in development mode if configured
    if (process.env.SKIP_AUTH_CHECK === 'true' && process.env.NODE_ENV === 'development') {
      console.log('Warning: Skipping admin authentication check in development mode');
      return next();
    }
    
    // Check if user exists and is an admin
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isAdmin: true }
    });
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin authentication error:', error);
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

module.exports = router; 