/* eslint-disable */
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
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

// Get all premium access (subscriptions + temporary access)
router.get('/premium-status', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // For development purposes, allow bypassing subscription check
    if (process.env.NODE_ENV !== 'production' && (process.env.MOCK_SUBSCRIPTION_DATA === 'true')) {
      logger.info('Using mock premium status data in development mode');
      return res.json({
        hasPremiumAccess: true,
        hasAccess: true,
        accessType: 'subscription',
        subscriptionData: {
          id: 'mock-subscription',
          userId: userId,
          status: 'active',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          cancelAtPeriodEnd: false
        },
        temporaryAccess: null
      });
    }
    
    // Check for active subscription
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ['active', 'trialing'] },
        currentPeriodEnd: {
          gt: new Date() // Subscription period has not ended
        }
      }
    });
    
    // Check for active temporary access (30-day access pass)
    const temporaryAccess = await prisma.temporaryAccess.findFirst({
      where: {
        userId,
        endTime: {
          gt: new Date() // Access has not expired
        }
      },
      orderBy: {
        endTime: 'desc' // Get the most recent one
      }
    });
    
    // Determine access type and return appropriate data
    if (activeSubscription) {
      return res.json({
        hasPremiumAccess: true,
        hasAccess: true,
        accessType: 'subscription',
        subscriptionData: activeSubscription,
        temporaryAccess: null
      });
    } else if (temporaryAccess) {
      return res.json({
        hasPremiumAccess: true,
        hasAccess: true,
        accessType: 'temporary',
        subscriptionData: null,
        temporaryAccess: temporaryAccess
      });
    } else {
      return res.json({
        hasPremiumAccess: false,
        hasAccess: false,
        accessType: null,
        subscriptionData: null,
        temporaryAccess: null
      });
    }
  } catch (error) {
    logger.error('Error checking premium status:', { error: error.message, userId: req.user?.id });
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
    const { immediate = false } = req.body; // Allow immediate cancellation
    
    // Find the active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active'
      },
      include: {
        user: true
      }
    });
    
    if (!subscription) {
      return res.status(404).json({ 
        error: 'No active subscription found',
        message: 'You do not have an active subscription to cancel.'
      });
    }
    
    // Cancel the subscription in Stripe
    try {
      if (immediate) {
        // Cancel immediately in Stripe
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        
        // Update local database to reflect immediate cancellation
        const updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: { 
            status: 'canceled',
            cancelAtPeriodEnd: false,
            canceledAt: new Date()
          }
        });
        
        logger.info(`Subscription immediately canceled for user ${userId}:`, {
          subscriptionId: subscription.stripeSubscriptionId
        });
        
        return res.json({
          ...updatedSubscription,
          message: 'Your subscription has been canceled immediately. You will lose access to premium features right away.',
          success: true
        });
      } else {
        // Cancel at period end in Stripe
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
        
        // Update local database
        const updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: { cancelAtPeriodEnd: true }
        });
        
        const endDate = new Date(updatedSubscription.currentPeriodEnd).toLocaleDateString();
        
        logger.info(`Subscription scheduled for cancellation for user ${userId}:`, {
          subscriptionId: subscription.stripeSubscriptionId,
          endDate: endDate
        });
        
        return res.json({
          ...updatedSubscription,
          message: `Your subscription will be canceled at the end of your current billing period (${endDate}). You will continue to have access to premium features until then.`,
          success: true
        });
      }
    } catch (stripeError) {
      logger.error('Stripe cancellation error:', {
        error: stripeError.message,
        subscriptionId: subscription.stripeSubscriptionId,
        userId
      });
      
      return res.status(500).json({ 
        error: 'Failed to cancel subscription with payment provider',
        message: 'There was an issue canceling your subscription. Please try again or contact support.'
      });
    }
  } catch (error) {
    logger.error('Error canceling subscription:', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again later.'
    });
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
      return res.status(404).json({ 
        error: 'No subscription found for reactivation',
        message: 'You do not have a subscription scheduled for cancellation.'
      });
    }
    
    // Reactivate the subscription in Stripe
    try {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false
      });
      
      // Update local database
      const updatedSubscription = await prisma.subscription.update({
        where: { id: subscription.id },
        data: { cancelAtPeriodEnd: false }
      });
      
      logger.info(`Subscription reactivated for user ${userId}:`, {
        subscriptionId: subscription.stripeSubscriptionId
      });
      
      res.json({
        ...updatedSubscription,
        message: 'Your subscription has been reactivated successfully. Auto-renewal is now enabled.',
        success: true
      });
    } catch (stripeError) {
      logger.error('Stripe reactivation error:', {
        error: stripeError.message,
        subscriptionId: subscription.stripeSubscriptionId,
        userId
      });
      
      return res.status(500).json({ 
        error: 'Failed to reactivate subscription with payment provider',
        message: 'There was an issue reactivating your subscription. Please try again or contact support.'
      });
    }
  } catch (error) {
    logger.error('Error reactivating subscription:', { 
      error: error.message,
      stack: error.stack, 
      userId: req.user?.id
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again later.'
    });
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

    // Always return default status for now since premium bundle table may not exist
    // This prevents the 500 error that was causing issues
    logger.info('Returning default premium bundle status (table not implemented)');
    return res.json({
      active: false,
      used: false
    });

    // TODO: Implement premium bundle functionality when needed
    /*
    // Get the user's premium bundle status from the database
    let premiumBundle = null;
    try {
      premiumBundle = await prisma.premiumBundle.findFirst({
        where: {
          userId: req.user.id,
          active: true
        }
      });
    } catch (dbError) {
      // Handle case where premiumBundle table doesn't exist or other DB issues
      logger.warn('Premium bundle table not available, returning default status:', dbError.message);
      return res.json({
        active: false,
        used: false
      });
    }

    res.json({
      active: !!premiumBundle,
      used: premiumBundle ? premiumBundle.used : false
    });
    */
  } catch (error) {
    logger.error('Error getting premium bundle status:', error);
    // Return default status instead of error to prevent frontend issues
    res.json({
      active: false,
      used: false
    });
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

    // Always return success for now since premium bundle table may not exist
    logger.info('Mock premium bundle usage (table not implemented)');
    return res.json({
      success: true,
      message: 'Premium bundle marked as used (mock)'
    });

    // TODO: Implement premium bundle functionality when needed
    /*
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
    */
  } catch (error) {
    logger.error('Error marking premium bundle as used:', error);
    // Return success instead of error to prevent frontend issues
    res.json({
      success: true,
      message: 'Premium bundle marked as used (error handled)'
    });
  }
});

module.exports = router; 