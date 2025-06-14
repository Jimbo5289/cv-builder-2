/* eslint-disable */
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { auth } = require('../middleware/auth');
const { logger } = require('../config/logger');

/**
 * @route POST /api/2fa/setup
 * @desc Setup Two-Factor Authentication
 * @access Private
 */
router.post('/setup', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if 2FA is already set up
    if (user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is already enabled for this account' });
    }

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `CVBuilder:${user.email}`
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Store the secret temporarily in the database
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false
      }
    });

    logger.info('2FA setup initiated', { userId });
    
    return res.status(200).json({
      message: '2FA setup initiated',
      qrCode: qrCodeUrl,
      secret: secret.base32
    });
  } catch (error) {
    logger.error('2FA setup error:', { error: error.message, stack: error.stack });
    return res.status(500).json({ message: 'Server error during 2FA setup' });
  }
});

/**
 * @route POST /api/2fa/verify
 * @desc Verify and enable Two-Factor Authentication
 * @access Private
 */
router.post('/verify', auth, async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has a secret saved
    if (!user.twoFactorSecret) {
      return res.status(400).json({ message: 'Please setup 2FA first' });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2 // Allow tokens 30 seconds before and after
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Enable 2FA for the user
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true
      }
    });

    logger.info('2FA enabled successfully', { userId });
    
    return res.status(200).json({ message: '2FA enabled successfully' });
  } catch (error) {
    logger.error('2FA verification error:', { error: error.message, stack: error.stack });
    return res.status(500).json({ message: 'Server error during 2FA verification' });
  }
});

/**
 * @route POST /api/2fa/disable
 * @desc Disable Two-Factor Authentication
 * @access Private
 */
router.post('/disable', auth, async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.user.id;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({ message: '2FA is not enabled for this account' });
    }

    // Verify the token one last time
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null
      }
    });

    logger.info('2FA disabled successfully', { userId });
    
    return res.status(200).json({ message: '2FA disabled successfully' });
  } catch (error) {
    logger.error('2FA disable error:', { error: error.message, stack: error.stack });
    return res.status(500).json({ message: 'Server error during 2FA disabling' });
  }
});

/**
 * @route GET /api/2fa/status
 * @desc Check if 2FA is enabled for the user
 * @access Private
 */
router.get('/status', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorEnabled: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ 
      twoFactorEnabled: user.twoFactorEnabled 
    });
  } catch (error) {
    logger.error('2FA status check error:', { error: error.message, stack: error.stack });
    return res.status(500).json({ message: 'Server error during 2FA status check' });
  }
});

/**
 * @route POST /api/2fa/validate
 * @desc Validate a 2FA token during login
 * @access Public
 */
router.post('/validate', async (req, res) => {
  try {
    const { userId, token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ message: 'User ID and token are required' });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA is not enabled for this account' });
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    return res.status(200).json({ verified: true });
  } catch (error) {
    logger.error('2FA validation error:', { error: error.message, stack: error.stack });
    return res.status(500).json({ message: 'Server error during 2FA validation' });
  }
});

module.exports = router; 