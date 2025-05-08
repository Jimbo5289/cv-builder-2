const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const database = require('../config/database');

// Stripe webhook handler
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.error('No Stripe signature found in request');
    return res.status(400).json({ error: 'No signature found' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Log successful webhook verification
    console.log(`Webhook verified: ${event.type}`);
  } catch (err) {
    console.error('Webhook signature verification failed:', {
      error: err.message,
      signature: sig,
      timestamp: new Date().toISOString()
    });
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Validate event type
  const validEventTypes = [
    'checkout.session.completed',
    'customer.subscription.deleted',
    'customer.subscription.updated',
    'customer.subscription.created'
  ];

  if (!validEventTypes.includes(event.type)) {
    console.warn(`Received unhandled event type: ${event.type}`);
    return res.status(200).json({ received: true });
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        await handleSubscriptionUpdated(updatedSubscription);
        break;
      case 'customer.subscription.created':
        const newSubscription = event.data.object;
        await handleSubscriptionCreated(newSubscription);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', {
      error: error.message,
      eventType: event.type,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

async function handleCheckoutSessionCompleted(session) {
  try {
    const customer = await stripe.customers.retrieve(session.customer);
    const user = await database.client.user.findUnique({
      where: { email: customer.email }
    });

    if (!user) {
      console.error('User not found for customer:', customer.email);
      return;
    }

    await database.client.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'active',
        stripeCustomerId: customer.id,
        subscriptionEndDate: new Date(session.subscription_end * 1000)
      }
    });

    console.log('Successfully processed checkout session:', {
      userId: user.id,
      customerId: customer.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error handling checkout session completed:', {
      error: error.message,
      sessionId: session.id,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    const user = await database.client.user.findFirst({
      where: { stripeCustomerId: subscription.customer }
    });

    if (!user) {
      console.error('User not found for subscription:', subscription.id);
      return;
    }

    await database.client.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'inactive',
        subscriptionEndDate: new Date()
      }
    });

    console.log('Successfully processed subscription deletion:', {
      userId: user.id,
      subscriptionId: subscription.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error handling subscription deleted:', {
      error: error.message,
      subscriptionId: subscription.id,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    const user = await database.client.user.findFirst({
      where: { stripeCustomerId: subscription.customer }
    });

    if (!user) {
      console.error('User not found for subscription update:', subscription.id);
      return;
    }

    await database.client.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionEndDate: new Date(subscription.current_period_end * 1000)
      }
    });

    console.log('Successfully processed subscription update:', {
      userId: user.id,
      subscriptionId: subscription.id,
      status: subscription.status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error handling subscription update:', {
      error: error.message,
      subscriptionId: subscription.id,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

async function handleSubscriptionCreated(subscription) {
  try {
    const user = await database.client.user.findFirst({
      where: { stripeCustomerId: subscription.customer }
    });

    if (!user) {
      console.error('User not found for new subscription:', subscription.id);
      return;
    }

    await database.client.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: subscription.status,
        subscriptionEndDate: new Date(subscription.current_period_end * 1000)
      }
    });

    console.log('Successfully processed new subscription:', {
      userId: user.id,
      subscriptionId: subscription.id,
      status: subscription.status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error handling new subscription:', {
      error: error.message,
      subscriptionId: subscription.id,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

module.exports = router; 