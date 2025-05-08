const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const emailService = require('../services/emailService');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Middleware to handle raw body
router.use(express.raw({ type: 'application/json' }));

// Handle Stripe webhook events
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body;

  try {
    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      endpointSecret
    );

    // Handle the event with retry logic
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        switch (event.type) {
          case 'checkout.session.completed':
            const session = event.data.object;
            await handleCheckoutSessionCompleted(session);
            break;
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
            const subscription = event.data.object;
            await handleSubscriptionUpdated(subscription);
            break;
          case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            await handleSubscriptionDeleted(deletedSubscription);
            break;
          case 'invoice.payment_failed':
            await handlePaymentFailed(event.data.object);
            break;
          case 'invoice.payment_succeeded':
            await handlePaymentSucceeded(event.data.object);
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
        break; // Success, exit retry loop
      } catch (error) {
        retries++;
        if (retries === maxRetries) {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

async function handleCheckoutSessionCompleted(session) {
  const { customer, subscription } = session;
  
  // Update user's subscription in database
  await prisma.subscription.upsert({
    where: { stripeId: subscription },
    update: {
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    create: {
      stripeId: subscription,
      userId: session.client_reference_id,
      status: 'active',
      planId: session.metadata.planId,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Send confirmation email
  const user = await prisma.user.findUnique({
    where: { id: session.client_reference_id },
  });

  if (user) {
    await emailService.sendSubscriptionConfirmation({
      email: user.email,
      name: user.name,
      planId: session.metadata.planId,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  }
}

async function handleSubscriptionUpdated(subscription) {
  await prisma.subscription.update({
    where: { stripeId: subscription.id },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });
}

async function handleSubscriptionDeleted(subscription) {
  await prisma.subscription.update({
    where: { stripeId: subscription.id },
    data: {
      status: 'canceled',
      cancelAtPeriodEnd: false,
    },
  });
}

async function handlePaymentFailed(invoice) {
  const subscription = await prisma.subscription.findUnique({
    where: { stripeId: invoice.subscription },
    include: { user: true },
  });

  if (subscription && subscription.user) {
    await emailService.sendPaymentFailedNotification({
      email: subscription.user.email,
      name: subscription.user.name,
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
    });
  }
}

async function handlePaymentSucceeded(invoice) {
  await prisma.payment.create({
    data: {
      userId: invoice.customer,
      stripeId: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency,
      status: 'succeeded',
      invoiceId: invoice.id,
    },
  });
}

module.exports = router; 