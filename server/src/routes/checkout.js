/* eslint-disable */
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth: authMiddleware } = require('../middleware/auth');
const { logger } = require('../config/logger');
const { sendSuccess, sendError, asyncHandler } = require('../utils/responseHandler');

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Stripe more robustly
let stripe = null;
try {
  // Try to import and initialize Stripe
  const Stripe = require('stripe');
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      timeout: 20000,
    });
    logger.info('Stripe initialized successfully');
  } else {
    logger.warn('STRIPE_SECRET_KEY not found in environment variables');
  }
} catch (error) {
  logger.error('Failed to initialize Stripe:', error.message);
}

// Validate coupon/promotion code
router.post('/validate-coupon', authMiddleware, asyncHandler(async (req, res) => {
  const { couponCode } = req.body;
  
  logger.info('Coupon validation request received:', {
    couponCode: couponCode ? '***' : 'empty', // Don't log actual codes for security
    userId: req.user?.id,
    hasStripe: !!stripe
  });

  if (!couponCode || !couponCode.trim()) {
    return sendError(res, 'Coupon code is required', 400);
  }

  try {
    // Check for development mode with mock data enabled
    const isDevelopment = process.env.NODE_ENV === 'development';
    const useMockData = process.env.MOCK_SUBSCRIPTION_DATA === 'true';
    
    // If Stripe is not available or we're in mock mode, return mock validation
    if (!stripe || (isDevelopment && useMockData)) {
      logger.info('Using mock coupon validation - Stripe not available or mock mode enabled');
      
      // Mock validation - accept specific test codes
      const mockValidCodes = ['TEST123', 'MOCK50', 'DEMO2025'];
      const isValidMock = mockValidCodes.includes(couponCode.trim().toUpperCase());
      
      if (isValidMock) {
        return sendSuccess(res, {
          valid: true,
          couponId: `mock_coupon_${couponCode.toLowerCase()}`,
          discount: '50% off',
          description: 'Mock discount for testing'
        }, 'Mock coupon validated');
      } else {
        return sendError(res, 'Invalid coupon code', 400);
      }
    }

    // Production Stripe validation
    if (!stripe) {
      logger.error('Stripe service not initialized - missing configuration');
      return sendError(res, 'Payment service unavailable - configuration error', 503);
    }

    try {
      // First, try to find the promotion code
      const promotionCodes = await stripe.promotionCodes.list({
        code: couponCode.trim(),
        limit: 1,
        active: true
      });

      if (promotionCodes.data.length === 0) {
        logger.info('Promotion code not found', { code: 'redacted' });
        return sendError(res, 'Invalid coupon code', 400);
      }

      const promotionCode = promotionCodes.data[0];
      const coupon = promotionCode.coupon;

      // Check if the coupon is valid and not expired
      if (!coupon.valid) {
        logger.info('Coupon is not valid', { couponId: coupon.id });
        return sendError(res, 'This coupon is no longer valid', 400);
      }

      // Check expiration
      if (coupon.redeem_by && coupon.redeem_by * 1000 < Date.now()) {
        logger.info('Coupon has expired', { couponId: coupon.id });
        return sendError(res, 'This coupon has expired', 400);
      }

      // Check usage limits
      if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
        logger.info('Coupon usage limit reached', { couponId: coupon.id });
        return sendError(res, 'This coupon has reached its usage limit', 400);
      }

      // Check promotion code specific limits
      if (promotionCode.max_redemptions && promotionCode.times_redeemed >= promotionCode.max_redemptions) {
        logger.info('Promotion code usage limit reached', { promotionCodeId: promotionCode.id });
        return sendError(res, 'This promotion code has been fully redeemed', 400);
      }

      // Format discount information
      let discountText = '';
      if (coupon.percent_off) {
        discountText = `${coupon.percent_off}% off`;
      } else if (coupon.amount_off) {
        const amount = (coupon.amount_off / 100).toFixed(2);
        discountText = `${coupon.currency.toUpperCase()} ${amount} off`;
      }

      logger.info('Coupon validation successful', {
        couponId: coupon.id,
        promotionCodeId: promotionCode.id,
        discount: discountText,
        userId: req.user.id
      });

      return sendSuccess(res, {
        valid: true,
        couponId: coupon.id,
        promotionCodeId: promotionCode.id,
        discount: discountText,
        description: coupon.name || 'Special discount applied',
        duration: coupon.duration,
        percentOff: coupon.percent_off,
        amountOff: coupon.amount_off,
        currency: coupon.currency
      }, 'Coupon validated successfully');

    } catch (stripeError) {
      logger.error('Stripe coupon validation error:', { error: stripeError.message });
      
      if (stripeError.code === 'resource_missing') {
        return sendError(res, 'Invalid coupon code', 400);
      }
      
      return sendError(res, 'Unable to validate coupon. Please try again.', 500);
    }

  } catch (error) {
    logger.error('Coupon validation failed', {
      userId: req.user?.id,
      error: error.message,
      stack: error.stack
    });
    
    return sendError(res, 'Unable to validate coupon. Please try again.', 500);
  }
}));

// Create a checkout session
router.post('/create-session', authMiddleware, asyncHandler(async (req, res) => {
  const { priceId, planInterval, planType, planName, accessDuration, couponCode } = req.body;
  
  logger.info('Checkout session request received:', {
    priceId,
    planInterval,
    planType,
    planName,
    userId: req.user?.id,
    hasStripe: !!stripe,
    hasCoupon: !!couponCode
  });

  // Debug environment variables
  logger.info('Environment variables check:', {
    STRIPE_PRICE_ENHANCED_CV_DOWNLOAD: !!process.env.STRIPE_PRICE_ENHANCED_CV_DOWNLOAD,
    STRIPE_PRICE_CV_DOWNLOAD: !!process.env.STRIPE_PRICE_CV_DOWNLOAD,
    STRIPE_PRICE_MONTHLY: !!process.env.STRIPE_PRICE_MONTHLY,
    STRIPE_PRICE_ANNUAL: !!process.env.STRIPE_PRICE_ANNUAL,
    NODE_ENV: process.env.NODE_ENV,
    MOCK_SUBSCRIPTION_DATA: process.env.MOCK_SUBSCRIPTION_DATA
  });

  if (!priceId && !planInterval && !planType) {
    return sendError(res, 'Either Price ID, plan interval (monthly/annual), or plan type is required', 400);
  }

  try {
    // Check for development mode with mock data enabled
    const isDevelopment = process.env.NODE_ENV === 'development';
    const useMockData = process.env.MOCK_SUBSCRIPTION_DATA === 'true';
    const stripeAvailable = !!stripe;
    
    logger.info('Checkout mode decision:', {
      isDevelopment,
      useMockData,
      stripeAvailable,
      willUseMock: !stripe || (isDevelopment && useMockData)
    });
    
    // If Stripe is not available or we're in mock mode, use mock checkout
    if (!stripe || (isDevelopment && useMockData)) {
      logger.info('Using mock checkout session - Stripe not available or mock mode enabled');
      
      try {
        // Get user id - for development mode, create a mock user if needed
        const userId = req.user?.id || 'dev-user-id';
        
        // If priceId is not provided, get the appropriate one from env based on planInterval
        let finalPriceId = priceId;
        if (!finalPriceId) {
          if (planInterval === 'monthly') {
            finalPriceId = process.env.STRIPE_PRICE_MONTHLY || 'price_mock_monthly';
          } else if (planInterval === 'annual') {
            finalPriceId = process.env.STRIPE_PRICE_ANNUAL || 'price_mock_annual';
          } else {
            finalPriceId = 'price_mock_default';
          }
        }
        
        // Handle different plan types in mock mode
        if (planType === 'pay-per-cv') {
          // For Pay-Per-CV, create a one-time purchase record
          try {
            await prisma.purchase.create({
              data: {
                userId: userId,
                productId: finalPriceId,
                productName: 'Pay-Per-CV',
                amount: 499, // £4.99 in pence
                currency: 'GBP',
                status: 'completed',
                type: 'one-time',
                remainingDownloads: 1,
                purchaseDate: new Date()
              }
            });
          } catch (dbError) {
            logger.warn('Database error in mock mode, continuing:', dbError.message);
          }
        }
        else if (planType === '30day-access') {
          // For 30-Day Access, create a temporary access record (30 days from purchase)
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          
          try {
            await prisma.temporaryAccess.create({
              data: {
                userId: userId,
                type: '30day-access',
                startTime: new Date(),
                endTime: expiryDate,
                status: 'active',
                purchaseId: 'mock_purchase_' + Date.now()
              }
            });
          } catch (dbError) {
            logger.warn('Database error in mock mode, continuing:', dbError.message);
          }
        }
        else {
          // For subscriptions, create a subscription record
          try {
            await prisma.subscription.upsert({
              where: {
                id: `mock_subscription_${userId}`
              },
              update: {
                status: 'active',
                planId: finalPriceId,
                planName: planName || (planInterval === 'monthly' ? 'Monthly Subscription' : 'Yearly Subscription'),
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + (planInterval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
                customerId: 'mock_customer_' + userId,
                subscriptionId: 'mock_subscription_' + Date.now(),
                stripePriceId: finalPriceId,
                stripeSubscriptionId: 'mock_subscription_' + Date.now(),
                stripeCustomerId: 'mock_customer_' + userId
              },
              create: {
                id: `mock_subscription_${userId}`,
                userId: userId,
                status: 'active',
                planId: finalPriceId,
                planName: planName || (planInterval === 'monthly' ? 'Monthly Subscription' : 'Yearly Subscription'),
                currentPeriodStart: new Date(),
                currentPeriodEnd: new Date(Date.now() + (planInterval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
                customerId: 'mock_customer_' + userId,
                subscriptionId: 'mock_subscription_' + Date.now(),
                stripePriceId: finalPriceId,
                stripeSubscriptionId: 'mock_subscription_' + Date.now(),
                stripeCustomerId: 'mock_customer_' + userId
              }
            });
          } catch (dbError) {
            logger.warn('Database error in mock mode, continuing:', dbError.message);
          }
        }
        
        // Return a mock successful response
        return sendSuccess(res, { 
          url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/subscription/success?mock=true`,
          sessionId: 'mock_session_' + Date.now() 
        }, 'Mock checkout session created');
      } catch (error) {
        logger.error('Error in mock checkout:', error.message);
        
        // Even if mock fails, return a success response for development
        return sendSuccess(res, { 
          url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/subscription/success?mock=true&bypass=true`,
          sessionId: 'mock_session_' + Date.now() 
        }, 'Mock checkout session created (bypass mode)');
      }
    }

    // Production Stripe checkout flow
    if (!stripe) {
      logger.error('Stripe service not initialized - missing configuration');
      return sendError(res, 'Payment service unavailable - configuration error', 503);
    }

    // If priceId is not provided, get the appropriate one from env based on planType and planInterval
    let finalPriceId = priceId;
    if (!finalPriceId) {
      if (planType === 'pay-per-cv') {
        finalPriceId = process.env.STRIPE_PRICE_CV_DOWNLOAD;
      } else if (planType === '30day-access') {
        finalPriceId = process.env.STRIPE_PRICE_ENHANCED_CV_DOWNLOAD;
      } else if (planInterval === 'monthly') {
        finalPriceId = process.env.STRIPE_PRICE_MONTHLY;
      } else if (planInterval === 'annual') {
        finalPriceId = process.env.STRIPE_PRICE_ANNUAL;
      }
      
      if (!finalPriceId) {
        return sendError(res, `Price configuration not found for planType: ${planType}, planInterval: ${planInterval}`, 400);
      }
    }
    
    logger.info(`Creating Stripe checkout session with price ID: ${finalPriceId}`);
    
    // Get the price from Stripe to validate it exists
    let price;
    try {
      price = await stripe.prices.retrieve(finalPriceId);
    } catch (stripeError) {
      logger.error(`Stripe price retrieval failed: ${stripeError.message}`);
      return sendError(res, `Invalid price ID: ${finalPriceId}. Please ensure Stripe products are set up correctly.`, 400);
    }
    
    if (!price) {
      return sendError(res, 'Invalid price ID', 400);
    }
    
    // Determine checkout mode based on plan type
            const isSubscription = planType !== 'pay-per-cv' && planType !== '30day-access';
    const checkoutMode = isSubscription ? 'subscription' : 'payment';
    
    // Create the checkout session
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: checkoutMode,
      success_url: `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription-cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id,
        planId: finalPriceId,
        planType: planType || (planInterval ? 'subscription' : 'one-time'),
        planName: planName || '',
        accessDuration: accessDuration || '',
        couponCode: couponCode || ''
      },
      client_reference_id: req.user.id
    };
    
    // Add promotion code if provided and valid
    if (couponCode && couponCode.trim()) {
      try {
        // Validate the promotion code exists and is active
        const promotionCodes = await stripe.promotionCodes.list({
          code: couponCode.trim(),
          limit: 1,
          active: true
        });

        if (promotionCodes.data.length > 0) {
          const promotionCode = promotionCodes.data[0];
          const coupon = promotionCode.coupon;

          // Check if the coupon is still valid
          if (coupon.valid && 
              (!coupon.redeem_by || coupon.redeem_by * 1000 > Date.now()) &&
              (!coupon.max_redemptions || coupon.times_redeemed < coupon.max_redemptions) &&
              (!promotionCode.max_redemptions || promotionCode.times_redeemed < promotionCode.max_redemptions)) {
            
            sessionConfig.discounts = [{ promotion_code: promotionCode.id }];
            
            logger.info('Promotion code applied to checkout session', {
              promotionCodeId: promotionCode.id,
              couponId: coupon.id,
              userId: req.user.id
            });
          } else {
            logger.warn('Promotion code is no longer valid', {
              promotionCodeId: promotionCode.id,
              userId: req.user.id
            });
            return sendError(res, 'The coupon code is no longer valid or has been fully redeemed', 400);
          }
        } else {
          logger.warn('Promotion code not found', {
            userId: req.user.id
          });
          return sendError(res, 'Invalid coupon code', 400);
        }
      } catch (couponError) {
        logger.error('Error validating promotion code for checkout:', {
          error: couponError.message,
          userId: req.user.id
        });
        return sendError(res, 'Unable to apply coupon code. Please try again.', 500);
      }
    }
    
    const session = await stripe.checkout.sessions.create(sessionConfig);

    logger.info('Stripe checkout session created successfully', {
      userId: req.user.id,
      sessionId: session.id,
      priceId: finalPriceId,
    });

    return sendSuccess(res, { url: session.url, sessionId: session.id }, 'Checkout session created');
  } catch (error) {
    logger.error('Checkout session creation failed', {
      userId: req.user?.id,
      error: error.message,
      stack: error.stack
    });
    
    return sendError(
      res, 
      error.message || 'Failed to create checkout session', 
      500
    );
  }
}));

// Get subscription status
router.get('/subscription-status', authMiddleware, asyncHandler(async (req, res) => {
  try {
    // In development mode with mock data, return mock subscription
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_SUBSCRIPTION_DATA === 'true') {
      return sendSuccess(res, { 
        isSubscribed: true,
        subscription: {
          id: 'mock_subscription',
          status: 'active',
          planName: 'Development Plan',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        subscriptions: {
          where: {
            status: { in: ['active', 'trialing'] }
          },
          orderBy: {
            currentPeriodEnd: 'desc'
          },
          take: 1
        }
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    const activeSubscription = user.subscriptions[0] || null;

    return sendSuccess(res, { 
      isSubscribed: !!activeSubscription,
      subscription: activeSubscription,
    });
  } catch (error) {
    logger.error('Getting subscription status failed', {
      userId: req.user?.id,
      error: error.message,
    });
    
    return sendError(res, 'Failed to get subscription status', 500);
  }
}));

// Get subscription plans (public endpoint)
router.get('/plans', asyncHandler(async (req, res) => {
  try {
    // Define fallback plans for when Stripe is not available
    const fallbackPlans = [
      {
        id: 'monthly',
        name: 'Monthly Plan',
        description: 'Full access to CV Builder for one month',
        price: 9.99,
        currency: 'GBP',
        interval: 'month',
        priceId: process.env.STRIPE_PRICE_MONTHLY || 'price_mock_monthly',
        features: [
          'Access to all CV templates',
          'PDF export',
          'Email support',
          'AI-powered CV analysis'
        ]
      },
      {
        id: 'annual',
        name: 'Annual Plan',
        description: 'Full access to CV Builder for one year (save 20%)',
        price: 95.88,
        currency: 'GBP',
        interval: 'year',
        priceId: process.env.STRIPE_PRICE_ANNUAL || 'price_mock_annual',
        features: [
          'Access to all CV templates',
          'PDF export',
          'Priority email support',
          'AI-powered CV analysis',
          '20% discount compared to monthly plan'
        ]
      },
      {
        id: 'pay-per-cv',
        name: 'Single CV Download',
        description: 'Create and download a single CV with basic ATS analysis',
        price: 4.99,
        currency: 'GBP',
        interval: 'one-time',
        priceId: process.env.STRIPE_PRICE_CV_DOWNLOAD || 'price_mock_single',
        features: [
          'Basic CV builder',
          'Basic ATS analysis & scoring',
          'Standard templates',
          'One CV download/print'
        ]
      },
      {
        id: '30day-access',
                  name: '30-Day Access Pass',
          description: 'Complete 30-day access to all premium features',
        price: 19.99,
        currency: 'GBP',
        interval: 'one-time',
        priceId: process.env.STRIPE_PRICE_ENHANCED_CV_DOWNLOAD || 'price_mock_1month',
        features: [
          'Complete 1-month access to all premium features',
          'Perfect for intensive job searching'
        ]
      }
    ];

    // If Stripe is not available, return fallback plans
    if (!stripe) {
      logger.warn('Stripe not available, returning fallback plans');
      return sendSuccess(res, { plans: fallbackPlans });
    }

    // If Stripe price IDs are not set, return fallback plans
    if (!process.env.STRIPE_PRICE_MONTHLY || !process.env.STRIPE_PRICE_ANNUAL) {
      logger.warn('Stripe price IDs not configured, returning fallback plans');
      return sendSuccess(res, { plans: fallbackPlans });
    }

    // Try to fetch prices from Stripe
    try {
      const pricePromises = [];
      
      if (process.env.STRIPE_PRICE_MONTHLY) {
        pricePromises.push(stripe.prices.retrieve(process.env.STRIPE_PRICE_MONTHLY, { expand: ['product'] }));
      }
      if (process.env.STRIPE_PRICE_ANNUAL) {
        pricePromises.push(stripe.prices.retrieve(process.env.STRIPE_PRICE_ANNUAL, { expand: ['product'] }));
      }

      const prices = await Promise.allSettled(pricePromises);
      
      const plans = [];
      
      // Process monthly price
      if (prices[0] && prices[0].status === 'fulfilled') {
        const monthlyPrice = prices[0].value;
        plans.push({
          id: 'monthly',
          name: monthlyPrice.product.name || 'Monthly Plan',
          description: monthlyPrice.product.description || 'Full access for one month',
          price: monthlyPrice.unit_amount / 100,
          currency: monthlyPrice.currency.toUpperCase(),
          interval: 'month',
          priceId: monthlyPrice.id,
          features: monthlyPrice.product.metadata?.features ? 
            monthlyPrice.product.metadata.features.split(',') : fallbackPlans[0].features
        });
      } else {
        plans.push(fallbackPlans[0]);
      }
      
      // Process annual price
      if (prices[1] && prices[1].status === 'fulfilled') {
        const annualPrice = prices[1].value;
        plans.push({
          id: 'annual',
          name: annualPrice.product.name || 'Annual Plan',
          description: annualPrice.product.description || 'Full access for one year',
          price: annualPrice.unit_amount / 100,
          currency: annualPrice.currency.toUpperCase(),
          interval: 'year',
          priceId: annualPrice.id,
          features: annualPrice.product.metadata?.features ? 
            annualPrice.product.metadata.features.split(',') : fallbackPlans[1].features
        });
      } else {
        plans.push(fallbackPlans[1]);
      }

      // Add the one-time plans
      plans.push(fallbackPlans[2]); // pay-per-cv
              plans.push(fallbackPlans[3]); // 30day-access

      return sendSuccess(res, { plans });
    } catch (stripeError) {
      logger.error('Failed to fetch plans from Stripe', { error: stripeError.message });
      return sendSuccess(res, { plans: fallbackPlans });
    }
  } catch (error) {
    logger.error('Getting subscription plans failed', { error: error.message });
    return sendError(res, 'Failed to get subscription plans', 500);
  }
}));

module.exports = router; 