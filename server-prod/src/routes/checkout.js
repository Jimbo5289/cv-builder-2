const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { stripe } = require('../config/stripe');
const authMiddleware = require('../middleware/auth');
const { logger } = require('../config/logger');
const { sendSuccess, sendError, asyncHandler } = require('../utils/responseHandler');

const router = express.Router();
const prisma = new PrismaClient();

// Create a checkout session
router.post('/create-session', authMiddleware, asyncHandler(async (req, res) => {
  const { priceId, planInterval, planType, planName, accessDuration } = req.body;
  
  if (!priceId && !planInterval) {
    return sendError(res, 'Either Price ID or plan interval (monthly/annual) is required', 400);
  }

  try {
    if (!stripe) {
      logger.error('Stripe service not initialized');
      return sendError(res, 'Payment service unavailable', 503);
    }

    // If priceId is not provided, get the appropriate one from env based on planInterval
    let finalPriceId = priceId;
    if (!finalPriceId) {
      if (planInterval === 'monthly') {
        finalPriceId = process.env.STRIPE_PRICE_MONTHLY;
      } else if (planInterval === 'annual') {
        finalPriceId = process.env.STRIPE_PRICE_ANNUAL;
      } else {
        return sendError(res, 'Invalid plan interval', 400);
      }
    }
    
    logger.info(`Attempting to create checkout session with price ID: ${finalPriceId}, plan type: ${planType || 'subscription'}`);
    
    // Check for development mode with mock data enabled
    const isDevelopment = process.env.NODE_ENV === 'development';
    const useMockData = process.env.MOCK_SUBSCRIPTION_DATA === 'true';
    
    if (isDevelopment && useMockData) {
      logger.info(`Using mock checkout session in development for plan: ${planName || planType || 'subscription'}`);
      
      try {
        // Get user id - for development mode, create a mock user if needed
        const userId = req.user?.id || 'dev-user-id';
        
        // Handle different plan types
        if (planType === 'pay-per-cv') {
          // For Pay-Per-CV, create a one-time purchase record
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
        } 
        else if (planType === '30day-access') {
          // For 30-Day Access, create a temporary access record (30 days from purchase)
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          
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
        }
        else {
          // For subscriptions, create a subscription record
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
        }
        
        // Return a mock successful response
        return sendSuccess(res, { 
          url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/subscription/success?mock=true`,
          sessionId: 'mock_session_' + Date.now() 
        }, 'Mock checkout session created');
      } catch (dbError) {
        logger.error('Database error creating mock subscription:', { error: dbError.message });
        
        // In development mode with mock data, just create a fake success response even if DB fails
        return sendSuccess(res, { 
          url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/subscription/success?mock=true&bypass=true`,
          sessionId: 'mock_session_' + Date.now() 
        }, 'Mock checkout session created (bypass mode)');
      }
    }
    
    // For production: Get the price from Stripe
    let price;
    try {
      price = await stripe.prices.retrieve(finalPriceId);
    } catch (stripeError) {
      logger.error(`Stripe price retrieval failed: ${stripeError.message}`);
      return sendError(res, `Invalid price ID: ${finalPriceId}`, 400);
    }
    
    if (!price) {
      return sendError(res, 'Invalid price ID', 400);
    }
    
    // Determine checkout mode based on plan type
          const isSubscription = planType !== 'pay-per-cv' && planType !== '30day-access';
    const checkoutMode = isSubscription ? 'subscription' : 'payment';
    
    // Create the appropriate checkout session based on plan type
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: checkoutMode,
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id,
        planId: finalPriceId,
        planType: planType || (planInterval ? 'subscription' : 'one-time'),
        planName: planName || '',
        accessDuration: accessDuration || ''
      },
      client_reference_id: req.user.id
    };
    
    const session = await stripe.checkout.sessions.create(sessionConfig);

    logger.info('Checkout session created', {
      userId: req.user.id,
      sessionId: session.id,
      priceId: finalPriceId,
    });

    return sendSuccess(res, { url: session.url, sessionId: session.id }, 'Checkout session created');
  } catch (error) {
    logger.error('Checkout session creation failed', {
      userId: req.user.id,
      error: error.message,
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
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { 
        subscription: true 
      },
    });

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, { 
      isSubscribed: !!user.subscription,
      subscription: user.subscription,
    });
  } catch (error) {
    logger.error('Getting subscription status failed', {
      userId: req.user.id,
      error: error.message,
    });
    
    return sendError(res, 'Failed to get subscription status', 500);
  }
}));

// Get subscription plans (public endpoint)
router.get('/plans', asyncHandler(async (req, res) => {
  try {
    if (!stripe) {
      logger.error('Stripe service not initialized');
      return sendError(res, 'Payment service unavailable', 503);
    }

    // Define fallback plans if Stripe is not configured
    const fallbackPlans = [
      {
        id: 'monthly',
        name: 'Monthly Plan',
        description: 'Full access to CV Builder for one month',
        price: 9.99,
        currency: 'GBP',
        interval: 'month',
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
        features: [
          'Access to all CV templates',
          'PDF export',
          'Priority email support',
          'AI-powered CV analysis',
          '20% discount compared to monthly plan'
        ]
      }
    ];

    // If Stripe keys are not set, return fallback plans
    if (!process.env.STRIPE_PRICE_MONTHLY || !process.env.STRIPE_PRICE_ANNUAL) {
      logger.warn('Using fallback plans as Stripe price IDs are not configured');
      return sendSuccess(res, { plans: fallbackPlans });
    }

    // Otherwise fetch prices from Stripe
    try {
      const [monthlyPrice, annualPrice] = await Promise.all([
        stripe.prices.retrieve(process.env.STRIPE_PRICE_MONTHLY, { expand: ['product'] }),
        stripe.prices.retrieve(process.env.STRIPE_PRICE_ANNUAL, { expand: ['product'] })
      ]);

      const plans = [
        {
          id: 'monthly',
          name: monthlyPrice.product.name,
          description: monthlyPrice.product.description,
          price: monthlyPrice.unit_amount / 100, // Convert from cents to currency units
          currency: monthlyPrice.currency.toUpperCase(),
          interval: 'month',
          priceId: monthlyPrice.id,
          features: monthlyPrice.product.metadata.features ? 
            monthlyPrice.product.metadata.features.split(',') : fallbackPlans[0].features
        },
        {
          id: 'annual',
          name: annualPrice.product.name,
          description: annualPrice.product.description,
          price: annualPrice.unit_amount / 100, // Convert from cents to currency units
          currency: annualPrice.currency.toUpperCase(),
          interval: 'year',
          priceId: annualPrice.id,
          features: annualPrice.product.metadata.features ? 
            annualPrice.product.metadata.features.split(',') : fallbackPlans[1].features
        }
      ];

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