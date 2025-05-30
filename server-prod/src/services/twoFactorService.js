const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { PrismaClient } = require('@prisma/client');
const winston = require('winston');
const { z } = require('zod');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/2fa-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/2fa-combined.log' })
  ]
});

// Initialize Prisma client
const prisma = new PrismaClient();

// Input validation schemas
const tokenSchema = z.string().length(6).regex(/^\d+$/);
const userIdSchema = z.string().refine(
  (val) => {
    // In development mode, allow 'dev-user-id' for testing
    if (process.env.NODE_ENV === 'development' && val === 'dev-user-id') {
      return true;
    }
    // Otherwise enforce UUID format
    try {
      z.string().uuid().parse(val);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: 'Invalid uuid',
  }
);

class TwoFactorService {
  /**
   * Generate a new 2FA secret for a user
   * @param {string} userId - User ID
   * @returns {Promise<{secret: string, qrCode: string}>} 2FA secret and QR code
   */
  async generateSecret(userId) {
    try {
      // Validate input
      const validatedUserId = userIdSchema.parse(userId);

      // Special handling for dev mode
      if (process.env.NODE_ENV === 'development' && validatedUserId === 'dev-user-id') {
        // Create a mock secret for development
        const secret = speakeasy.generateSecret({
          name: `CV Builder:dev@example.com`,
          issuer: 'CV Builder',
          length: 32
        });

        // Generate QR code
        const otpauthUrl = secret.otpauth_url;
        const qrCodeUrl = await QRCode.toDataURL(otpauthUrl, {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 300
        });

        logger.info('2FA secret generated for development user', { userId: validatedUserId });

        return {
          secret: secret.base32,
          qrCode: qrCodeUrl
        };
      }

      // Regular flow for production users
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: validatedUserId },
        select: { email: true, twoFactorEnabled: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (user.twoFactorEnabled) {
        throw new Error('2FA is already enabled for this user');
      }

      // Generate a secret using speakeasy
      const secret = speakeasy.generateSecret({
        name: `CV Builder:${user.email}`,
        issuer: 'CV Builder',
        length: 32 // Increased from default for better security
      });

      // Store the secret in the database
      await prisma.user.update({
        where: { id: validatedUserId },
        data: {
          twoFactorSecret: secret.base32,
          twoFactorEnabled: false
        }
      });

      // Generate QR code
      const otpauthUrl = secret.otpauth_url;
      const qrCodeUrl = await QRCode.toDataURL(otpauthUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 300
      });

      logger.info('2FA secret generated successfully', { userId: validatedUserId });

      return {
        secret: secret.base32,
        qrCode: qrCodeUrl
      };
    } catch (error) {
      logger.error('Failed to generate 2FA secret:', {
        error: error.message,
        userId
      });
      throw new Error('Failed to generate 2FA secret: ' + error.message);
    }
  }

  /**
   * Verify a 2FA token
   * @param {string} userId - User ID
   * @param {string} token - 2FA token
   * @returns {Promise<boolean>} Whether the token is valid
   */
  async verifyToken(userId, token) {
    try {
      // Validate input
      const validatedUserId = userIdSchema.parse(userId);
      const validatedToken = tokenSchema.parse(token);

      // Special handling for dev mode
      if (process.env.NODE_ENV === 'development' && validatedUserId === 'dev-user-id') {
        // In dev mode, accept any valid 6-digit token for simplicity
        // This is just for development testing!
        logger.info('2FA token validated for development user', { userId: validatedUserId });
        return true;
      }

      // Regular flow for production users
      // Get user's secret from database
      const user = await prisma.user.findUnique({
        where: { id: validatedUserId },
        select: { twoFactorSecret: true, twoFactorEnabled: true }
      });

      if (!user || !user.twoFactorSecret) {
        throw new Error('2FA not set up for this user');
      }

      // Verify the token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: validatedToken,
        window: 1, // Allow 30 seconds clock drift
        step: 30 // 30-second window
      });

      if (verified) {
        // If this is the first verification, enable 2FA
        if (!user.twoFactorEnabled) {
          await prisma.user.update({
            where: { id: validatedUserId },
            data: { twoFactorEnabled: true }
          });
          logger.info('2FA enabled for user', { userId: validatedUserId });
        }
      } else {
        logger.warn('Invalid 2FA token provided', { userId: validatedUserId });
      }

      return verified;
    } catch (error) {
      logger.error('Failed to verify 2FA token:', {
        error: error.message,
        userId
      });
      throw new Error('Failed to verify 2FA token: ' + error.message);
    }
  }

  /**
   * Validate 2FA token during login
   * @param {string} userId - User ID
   * @param {string} token - 2FA token
   * @returns {Promise<boolean>} Whether the token is valid
   */
  async validateLogin(userId, token) {
    try {
      // Validate input
      const validatedUserId = userIdSchema.parse(userId);
      const validatedToken = tokenSchema.parse(token);

      // Special handling for dev mode
      if (process.env.NODE_ENV === 'development' && validatedUserId === 'dev-user-id') {
        // In dev mode, accept any valid 6-digit token
        logger.info('2FA login validated for development user', { userId: validatedUserId });
        return true;
      }

      // Regular flow for production users
      const user = await prisma.user.findUnique({
        where: { id: validatedUserId },
        select: { twoFactorSecret: true, twoFactorEnabled: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      if (!user.twoFactorEnabled) {
        return true; // 2FA not enabled, allow login
      }

      if (!user.twoFactorSecret) {
        throw new Error('2FA is enabled but no secret is set');
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: validatedToken,
        window: 1,
        step: 30
      });

      if (!verified) {
        logger.warn('Invalid 2FA token during login', { userId: validatedUserId });
      }

      return verified;
    } catch (error) {
      logger.error('Failed to validate 2FA login:', {
        error: error.message,
        userId
      });
      throw new Error('Failed to validate 2FA login: ' + error.message);
    }
  }

  /**
   * Disable 2FA for a user
   * @param {string} userId - User ID
   * @param {string} token - 2FA token
   * @returns {Promise<boolean>} Whether 2FA was successfully disabled
   */
  async disable2FA(userId, token) {
    try {
      // Validate input
      const validatedUserId = userIdSchema.parse(userId);
      const validatedToken = tokenSchema.parse(token);

      // Special handling for dev mode
      if (process.env.NODE_ENV === 'development' && validatedUserId === 'dev-user-id') {
        // In dev mode, accept any valid 6-digit token and always succeed
        logger.info('2FA disabled for development user', { userId: validatedUserId });
        return true;
      }

      // Regular flow for production users
      // Verify one last time before disabling
      const isValid = await this.validateLogin(validatedUserId, validatedToken);
      
      if (!isValid) {
        throw new Error('Invalid 2FA token');
      }

      await prisma.user.update({
        where: { id: validatedUserId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null
        }
      });

      logger.info('2FA disabled for user', { userId: validatedUserId });
      return true;
    } catch (error) {
      logger.error('Failed to disable 2FA:', {
        error: error.message,
        userId
      });
      throw new Error('Failed to disable 2FA: ' + error.message);
    }
  }

  /**
   * Get backup codes for a user
   * @param {string} userId - User ID
   * @returns {Promise<string[]>} Array of backup codes
   */
  async generateBackupCodes(userId) {
    try {
      const validatedUserId = userIdSchema.parse(userId);

      // Generate 10 backup codes
      const backupCodes = Array.from({ length: 10 }, () => {
        return speakeasy.generateSecret({ length: 20 }).base32;
      });

      // Hash the backup codes before storing
      const hashedCodes = await Promise.all(
        backupCodes.map(code => this.hashBackupCode(code))
      );

      // Store hashed backup codes
      await prisma.user.update({
        where: { id: validatedUserId },
        data: {
          backupCodes: hashedCodes
        }
      });

      logger.info('Backup codes generated for user', { userId: validatedUserId });
      return backupCodes;
    } catch (error) {
      logger.error('Failed to generate backup codes:', {
        error: error.message,
        userId
      });
      throw new Error('Failed to generate backup codes: ' + error.message);
    }
  }

  /**
   * Verify a backup code
   * @param {string} userId - User ID
   * @param {string} code - Backup code
   * @returns {Promise<boolean>} Whether the code is valid
   */
  async verifyBackupCode(userId, code) {
    try {
      const validatedUserId = userIdSchema.parse(userId);

      const user = await prisma.user.findUnique({
        where: { id: validatedUserId },
        select: { backupCodes: true }
      });

      if (!user || !user.backupCodes) {
        return false;
      }

      const hashedCode = await this.hashBackupCode(code);
      const isValid = user.backupCodes.includes(hashedCode);

      if (isValid) {
        // Remove used backup code
        await prisma.user.update({
          where: { id: validatedUserId },
          data: {
            backupCodes: user.backupCodes.filter(c => c !== hashedCode)
          }
        });
        logger.info('Backup code used successfully', { userId: validatedUserId });
      } else {
        logger.warn('Invalid backup code provided', { userId: validatedUserId });
      }

      return isValid;
    } catch (error) {
      logger.error('Failed to verify backup code:', {
        error: error.message,
        userId
      });
      throw new Error('Failed to verify backup code: ' + error.message);
    }
  }

  /**
   * Hash a backup code
   * @param {string} code - Backup code
   * @returns {Promise<string>} Hashed code
   */
  async hashBackupCode(code) {
    // In a real implementation, use a proper hashing function
    // This is just a placeholder
    return code;
  }
}

module.exports = new TwoFactorService(); 