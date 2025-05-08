const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Stripe = require('stripe');
const authMiddleware = require('../middleware/auth');
const { logger } = require('../config/logger');
const { sendSuccess, sendError, asyncHandler } = require('../utils/responseHandler');

const router = express.Router();
const prisma = new PrismaClient();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a checkout session
router.post('/create-session', authMiddleware, asyncHandler(async (req, res) => {
  const { priceId } = req.body;
  
  if (!priceId) {
    return sendError(res, 'Price ID is required', 400);
  }

  try {
    // Get the price from Stripe
    const price = await stripe.prices.retrieve(priceId);
    
    if (!price) {
      return sendError(res, 'Invalid price ID', 400);
    }
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: req.user.id,
      },
    });

    logger.info('Checkout session created', {
      userId: req.user.id,
      sessionId: session.id,
      priceId,
    });

    return sendSuccess(res, { url: session.url }, 'Checkout session created');
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

module.exports = router; 