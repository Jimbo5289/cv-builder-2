const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const winston = require('winston');
const { z } = require('zod');

// Initialize Prisma client
const prisma = new PrismaClient();

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/auth-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/auth-combined.log' })
  ]
});

// Input validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  name: z.string().min(2)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Security constants
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  logger.error('JWT_SECRET is not set in environment variables');
  throw new Error('JWT_SECRET is not configured');
}

const TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

class AuthService {
  /**
   * Register a new user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @param {string} name - User's name
   * @returns {Promise<{user: Object, token: string, refreshToken: string}>}
   */
  async register(email, password, name) {
    try {
      // Validate input
      const validatedData = registerSchema.parse({ email, password, name });

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${validatedData.email}`);
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 12);

      // Create new user
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          name: validatedData.name
        }
      });

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user.id);

      logger.info(`New user registered: ${user.id}`);
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error('Registration error:', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Login user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<{user: Object, token: string, refreshToken: string}>}
   */
  async login(email, password) {
    try {
      // Validate input
      const validatedData = loginSchema.parse({ email, password });

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: validatedData.email }
      });

      if (!user) {
        logger.warn(`Login attempt with non-existent email: ${validatedData.email}`);
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);

      if (!isValidPassword) {
        logger.warn(`Failed login attempt for user: ${user.id}`);
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(user.id);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });

      logger.info(`User logged in: ${user.id}`);
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        accessToken,
        refreshToken
      };
    } catch (error) {
      logger.error('Login error:', { error: error.message, stack: error.stack });
      throw error;
    }
  }

  /**
   * Generate access and refresh tokens
   * @param {string} userId - User ID
   * @returns {{accessToken: string, refreshToken: string}}
   */
  generateTokens(userId) {
    const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    return { accessToken, refreshToken };
  }

  /**
   * Verify access token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      logger.error('Token verification failed:', { error: error.message });
      throw new Error('Invalid token');
    }
  }

  /**
   * Refresh access token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<{accessToken: string}>}
   */
  async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_SECRET);

      // Check if refresh token exists in database
      const storedToken = await prisma.refreshToken.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.userId,
          expiresAt: { gt: new Date() }
        }
      });

      if (!storedToken) {
        throw new Error('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

      return { accessToken };
    } catch (error) {
      logger.error('Token refresh failed:', { error: error.message });
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          customerId: true
        }
      });

      if (!user) {
        logger.warn(`User not found: ${userId}`);
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Get user error:', { error: error.message, userId });
      throw error;
    }
  }
}

module.exports = new AuthService(); 