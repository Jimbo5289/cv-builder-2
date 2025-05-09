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
  const { priceId, planInterval } = req.body;
  
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
    
    // Get the price from Stripe
    const price = await stripe.prices.retrieve(finalPriceId);
    
    if (!price) {
      return sendError(res, 'Invalid price ID', 400);
    }
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id,
        planId: finalPriceId
      },
      client_reference_id: req.user.id
    });

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
      'Failed to create checkout session', 
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