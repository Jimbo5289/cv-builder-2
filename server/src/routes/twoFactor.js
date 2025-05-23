const express = require('express');
const auth = require('../middleware/auth');
const twoFactorService = require('../services/twoFactorService');
const { logger } = require('../config/logger');

const router = express.Router();

// Setup 2FA - generates secret and QR code
router.post('/setup', auth, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { secret, qrCode } = await twoFactorService.generateSecret(userId);
    
    res.json({
      message: 'Two-factor authentication setup initiated',
      secret,
      qrCode,
    });
  } catch (error) {
    logger.error('2FA Setup error:', { error: error.message, userId: req.user?.id });
    res.status(500).json({ message: 'Error setting up 2FA' });
  }
});

// Verify and enable 2FA
router.post('/verify', auth, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const verified = await twoFactorService.verifyToken(userId, token);

    if (verified) {
      res.json({ message: 'Two-factor authentication enabled successfully' });
    } else {
      res.status(400).json({ message: 'Invalid token' });
    }
  } catch (error) {
    logger.error('2FA Verification error:', { error: error.message, userId: req.user?.id });
    res.status(500).json({ message: 'Error verifying 2FA token' });
  }
});

// Validate token during login
router.post('/validate', async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }

    const isValid = await twoFactorService.validateLogin(userId, token);

    if (isValid) {
      res.json({ message: 'Token validated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    logger.error('2FA Validation error:', { error: error.message, userId: req.body?.userId });
    res.status(500).json({ message: 'Error validating 2FA token' });
  }
});

// Disable 2FA
router.post('/disable', auth, async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    await twoFactorService.disable2FA(userId, token);
    res.json({ message: 'Two-factor authentication disabled successfully' });
  } catch (error) {
    logger.error('2FA Disable error:', { error: error.message, userId: req.user?.id });
    res.status(500).json({ message: 'Error disabling 2FA' });
  }
});

module.exports = router; 