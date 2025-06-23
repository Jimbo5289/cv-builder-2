const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { logger } = require('../config/logger');
const { auth } = require('../middleware/auth');

const prisma = new PrismaClient();

// GET user preferences (authenticated)
router.get('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        marketingConsent: true,
        email: true,
        name: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return preferences in format expected by frontend
    res.json({
      marketingEmails: user.marketingConsent,
      subscriptionUpdates: true, // These are always enabled for account security
      securityAlerts: true
    });
  } catch (error) {
    logger.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user preferences (authenticated)
router.put('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { marketingEmails } = req.body;
    
    // Update marketing consent in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        marketingConsent: marketingEmails
      },
      select: {
        marketingConsent: true
      }
    });

    logger.info(`User ${userId} updated marketing consent to: ${marketingEmails}`);

    res.json({
      marketingEmails: updatedUser.marketingConsent,
      subscriptionUpdates: true,
      securityAlerts: true
    });
  } catch (error) {
    logger.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST unsubscribe (for email links - no auth required but verified)
router.post('/', async (req, res) => {
  try {
    const { email, user: userIdentifier, type = 'marketing' } = req.body;
    
    if (!email || !userIdentifier) {
      return res.status(400).json({ error: 'Email and user identifier are required' });
    }

    // Find user by email and verify they match the identifier
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        marketingConsent: true
      }
    });

    if (!user) {
      logger.warn(`Unsubscribe attempt for non-existent email: ${email}`);
      // Don't reveal whether email exists - return success anyway
      return res.json({ success: true, message: 'Unsubscribe request processed' });
    }

    // Verify the user identifier matches either the user ID or email
    if (user.id !== userIdentifier && user.email !== userIdentifier) {
      logger.warn(`Unsubscribe attempt with invalid user identifier for ${email}`);
      return res.status(403).json({ error: 'Invalid user identifier' });
    }

    // Update marketing consent to false
    if (type === 'marketing') {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          marketingConsent: false
        }
      });

      logger.info(`User ${user.id} (${email}) unsubscribed from marketing emails via email link`);
    }

    res.json({ 
      success: true, 
      message: 'You have been successfully unsubscribed from marketing emails' 
    });
  } catch (error) {
    logger.error('Error processing unsubscribe request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 