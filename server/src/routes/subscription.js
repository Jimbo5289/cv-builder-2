const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const { logger } = require('../config/logger');

const prisma = new PrismaClient();

// Get current user's subscription
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get the most recent active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] }
      },
      orderBy: {
        currentPeriodEnd: 'desc'
      }
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    
    res.json(subscription);
  } catch (error) {
    logger.error('Error fetching subscription:', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Check if user has active subscription
router.get('/status', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // For development purposes, allow bypassing subscription check
    if (process.env.NODE_ENV !== 'production' && (process.env.MOCK_SUBSCRIPTION_DATA === 'true')) {
      logger.info('Using mock subscription data in development mode');
      return res.json({
        hasActiveSubscription: true,
        subscriptionData: {
          id: 'mock-subscription',
          userId: userId,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false
        }
      });
    }
    
    // Count active subscriptions
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] },
        currentPeriodEnd: {
          gt: new Date() // Subscription period has not ended
        }
      }
    });
    
    // Return subscription status
    res.json({
      hasActiveSubscription: !!activeSubscription,
      subscriptionData: activeSubscription || null
    });
  } catch (error) {
    logger.error('Error checking subscription status:', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel subscription
router.post('/cancel', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active'
      }
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    
    // Update subscription to cancel at period end
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: true }
    });
    
    res.json(updatedSubscription);
  } catch (error) {
    logger.error('Error canceling subscription:', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reactivate subscription
router.post('/reactivate', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find the subscription marked for cancellation
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        cancelAtPeriodEnd: true
      }
    });
    
    if (!subscription) {
      return res.status(404).json({ error: 'No subscription found for reactivation' });
    }
    
    // Update subscription to not cancel at period end
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { cancelAtPeriodEnd: false }
    });
    
    res.json(updatedSubscription);
  } catch (error) {
    logger.error('Error reactivating subscription:', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create checkout session
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      });
      customerId = customer.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?canceled=true`,
      metadata: {
        userId: user.id
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create customer portal session
router.post('/create-portal-session', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// Premium Bundle Endpoints
router.get('/premium-bundle-status', auth, async (req, res) => {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_SUBSCRIPTION_DATA === 'true') {
      logger.info('Using mock premium bundle status in development');
      return res.json({
        active: true,
        used: false
      });
    }

    // Get the user's premium bundle status from the database
    const premiumBundle = await prisma.premiumBundle.findFirst({
      where: {
        userId: req.user.id,
        active: true
      }
    });

    res.json({
      active: !!premiumBundle,
      used: premiumBundle ? premiumBundle.used : false
    });
  } catch (error) {
    logger.error('Error getting premium bundle status:', error);
    res.status(500).json({ error: 'Failed to get premium bundle status' });
  }
});

router.post('/use-premium-bundle', auth, async (req, res) => {
  try {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_SUBSCRIPTION_DATA === 'true') {
      logger.info('Using mock premium bundle usage in development');
      return res.json({
        success: true,
        message: 'Premium bundle marked as used'
      });
    }

    // Get the user's premium bundle
    const premiumBundle = await prisma.premiumBundle.findFirst({
      where: {
        userId: req.user.id,
        active: true,
        used: false
      }
    });

    if (!premiumBundle) {
      return res.status(404).json({ error: 'No active unused premium bundle found' });
    }

    // Mark the bundle as used
    await prisma.premiumBundle.update({
      where: {
        id: premiumBundle.id
      },
      data: {
        used: true,
        usedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Premium bundle marked as used'
    });
  } catch (error) {
    logger.error('Error marking premium bundle as used:', error);
    res.status(500).json({ error: 'Failed to mark premium bundle as used' });
  }
});

module.exports = router; 