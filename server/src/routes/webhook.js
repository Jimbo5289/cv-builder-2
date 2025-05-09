const express = require('express');
const router = express.Router();
const { stripe, verifyWebhookSignature } = require('../config/stripe');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const emailService = require('../services/emailService');
const { logger } = require('../config/logger');
const cuid = require('cuid');

// Middleware to handle raw body
router.use(express.raw({ type: 'application/json' }));

// Handle Stripe webhook events
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const rawBody = req.body;

  try {
    if (!stripe) {
      logger.error('Webhook received but Stripe is not initialized');
      return res.status(503).json({ error: 'Stripe service unavailable' });
    }

    // Verify webhook signature
    let event;
    try {
      event = verifyWebhookSignature(rawBody, sig);
    } catch (err) {
      logger.error('Webhook signature verification failed:', { error: err.message });
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event with retry logic
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      try {
        switch (event.type) {
          case 'checkout.session.completed':
            const session = event.data.object;
            await handleCheckoutSessionCompleted(session);
            logger.info('Processed checkout.session.completed event', { sessionId: session.id });
            break;
          case 'customer.subscription.created':
          case 'customer.subscription.updated':
            const subscription = event.data.object;
            await handleSubscriptionUpdated(subscription);
            logger.info(`Processed ${event.type} event`, { subscriptionId: subscription.id });
            break;
          case 'customer.subscription.deleted':
            const deletedSubscription = event.data.object;
            await handleSubscriptionDeleted(deletedSubscription);
            logger.info('Processed customer.subscription.deleted event', { subscriptionId: deletedSubscription.id });
            break;
          case 'invoice.payment_failed':
            await handlePaymentFailed(event.data.object);
            logger.info('Processed invoice.payment_failed event', { invoiceId: event.data.object.id });
            break;
          case 'invoice.payment_succeeded':
            await handlePaymentSucceeded(event.data.object);
            logger.info('Processed invoice.payment_succeeded event', { invoiceId: event.data.object.id });
            break;
          default:
            logger.info(`Unhandled event type ${event.type}`);
        }
        break; // Success, exit retry loop
      } catch (error) {
        retries++;
        logger.error(`Error processing webhook (attempt ${retries}/${maxRetries}):`, { 
          error: error.message, 
          eventType: event.type 
        });
        
        if (retries === maxRetries) {
          throw error;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }

    res.json({ received: true });
  } catch (err) {
    logger.error('Webhook Error:', { error: err.message });
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

async function handleCheckoutSessionCompleted(session) {
  try {
    const { customer, subscription, client_reference_id, mode, amount_total, currency } = session;
    
    // Get or create a user based on the customer ID
    let user;
    
    if (client_reference_id) {
      // Try to find an existing user by ID
      user = await prisma.user.findUnique({
        where: { id: client_reference_id }
      });
      
      if (user) {
        logger.info(`Found existing user by client_reference_id: ${user.id}`);
      }
    }
    
    if (!user && customer) {
      // Try to find an existing user by customer ID
      user = await prisma.user.findFirst({
        where: { customerId: customer }
      });
      
      if (user) {
        logger.info(`Found existing user for customer ${customer}: ${user.id}`);
      } else {
        // Try to find the admin user
        user = await prisma.user.findFirst({
          where: { email: 'admin@example.com' }
        });
        
        if (user) {
          logger.info(`Using admin user for customer ${customer}: ${user.id}`);
          
          // Update the admin user with the customer ID
          await prisma.user.update({
            where: { id: user.id },
            data: { customerId: customer }
          });
        } else {
          // Create a new admin user if needed
          user = await prisma.user.create({
            data: {
              id: cuid(),
              email: 'admin@example.com',
              name: 'Admin User',
              customerId: customer,
              password: '$2b$10$dummyhashedpassword', // Just a placeholder
              isActive: true
            }
          });
          logger.info(`Created admin user for customer ${customer}: ${user.id}`);
        }
      }
    }
    
    // If we still don't have a user, log an error and return
    if (!user) {
      logger.error(`Could not find or create a user for session ${session.id}`);
      return;
    }
    
    // Handle subscription checkout
    if (subscription && mode === 'subscription') {
      try {
        await prisma.subscription.upsert({
          where: { 
            stripeSubscriptionId: subscription
          },
          update: {
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            stripeCustomerId: customer || '',
            stripePriceId: session.price?.id || ''
          },
          create: {
            stripeSubscriptionId: subscription,
            userId: user.id,
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            stripeCustomerId: customer || '',
            stripePriceId: session.price?.id || ''
          }
        });
        logger.info(`Subscription created/updated for user ${user.id}: ${subscription}`);
      } catch (dbError) {
        logger.error(`Database error processing subscription checkout: ${dbError}`);
        // Continue processing without throwing to ensure webhook completes
      }
    } 
    // Handle one-time payment checkout
    else if (mode === 'payment') {
      logger.info(`One-time payment completed for user ${user.id}`);
      
      try {
        // Record the payment in the database using correct field names
        const payment = await prisma.payment.create({
          data: {
            userId: user.id,
            stripePaymentId: session.id,
            amount: amount_total ? amount_total / 100 : 0, // Convert cents to dollars/pounds
            currency: currency || 'gbp', // Default to GBP
            status: 'succeeded'
          }
        });
        
        // Send a payment success email
        await emailService.sendPaymentSuccessNotification({
          email: user.email,
          name: user.name
        }, {
          amount: amount_total ? amount_total / 100 : 0,
          currency: currency || 'gbp' // Default to GBP
        });
        logger.info(`Payment success email sent to ${user.email}`);
      } catch (error) {
        logger.error(`Error processing one-time payment: ${error}`);
        // Don't throw the error to avoid failing the whole webhook
      }
    }
  } catch (error) {
    logger.error(`Error processing checkout session: ${error}`);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    // Safely convert Unix timestamps to JavaScript dates
    let currentPeriodStart = new Date();
    let currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now as fallback
    
    // Check if timestamps exist and are valid numbers before converting
    if (subscription.current_period_start && typeof subscription.current_period_start === 'number') {
      currentPeriodStart = new Date(subscription.current_period_start * 1000);
    }
    
    if (subscription.current_period_end && typeof subscription.current_period_end === 'number') {
      currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    }
    
    // First find the subscription by stripeSubscriptionId
    const existingSubscription = await prisma.subscription.findFirst({
      where: { 
        stripeSubscriptionId: subscription.id 
      }
    });
    
    if (existingSubscription) {
      // Update the existing subscription
      await prisma.subscription.update({
        where: { 
          id: existingSubscription.id 
        },
        data: {
          status: subscription.status,
          currentPeriodStart,
          currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancel_at_period_end || false
        }
      });
      logger.info(`Subscription updated: ${subscription.id}`);
    } else {
      // If subscription doesn't exist yet, find or create the user
      let user;
      
      // Try to find the user by customer ID
      if (subscription.customer) {
        user = await prisma.user.findFirst({
          where: { customerId: subscription.customer }
        });
        
        if (!user) {
          // Check for admin user
          user = await prisma.user.findFirst({
            where: { email: 'admin@example.com' }
          });
          
          if (user) {
            // Update admin user with customer ID
            await prisma.user.update({
              where: { id: user.id },
              data: { customerId: subscription.customer }
            });
          } else {
            // Create a new admin user if needed
            user = await prisma.user.create({
              data: {
                id: cuid(),
                email: 'admin@example.com',
                name: 'Admin User',
                customerId: subscription.customer,
                password: '$2b$10$dummyhashedpassword', // Just a placeholder
                isActive: true
              }
            });
          }
        }
        
        if (user) {
          try {
            // Create the subscription
            await prisma.subscription.create({
              data: {
                userId: user.id,
                stripeSubscriptionId: subscription.id,
                status: subscription.status,
                currentPeriodStart,
                currentPeriodEnd,
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
                stripeCustomerId: subscription.customer || '',
                stripePriceId: subscription.plan?.id || ''
              }
            });
            logger.info(`New subscription created for customer ${subscription.customer}: ${subscription.id}`);
          } catch (dbError) {
            logger.error(`Database error creating subscription: ${dbError}`);
            // Continue processing without throwing to ensure webhook completes
          }
        } else {
          logger.warn(`Could not find or create a user for subscription ${subscription.id}`);
        }
      } else {
        logger.warn(`Subscription ${subscription.id} has no customer ID, cannot create subscription record`);
      }
    }
  } catch (error) {
    logger.error(`Error updating subscription: ${error}`);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    // Find the subscription by stripeSubscriptionId
    const existingSubscription = await prisma.subscription.findFirst({
      where: { 
        stripeSubscriptionId: subscription.id 
      }
    });
    
    if (existingSubscription) {
      // Update the subscription status to canceled
      await prisma.subscription.update({
        where: { 
          id: existingSubscription.id 
        },
        data: {
          status: 'canceled',
          canceledAt: new Date()
        }
      });
      logger.info(`Subscription canceled: ${subscription.id}`);
    } else {
      logger.warn(`Subscription not found for cancellation: ${subscription.id}`);
    }
  } catch (error) {
    logger.error(`Error canceling subscription: ${error}`);
    throw error;
  }
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
  try {
    // Extract relevant data from the invoice
    const { customer, amount_paid, currency, id } = invoice;
    const amount = amount_paid / 100; // Convert cents to dollars/pounds

    // Use invoice.charge or invoice.id as stripePaymentId
    const paymentId = invoice.charge || invoice.id;
    
    // Try to find the user by customer ID
    let user = await prisma.user.findFirst({
      where: { 
        customerId: customer 
      }
    });

    // If user not found, find or create admin user
    if (!user) {
      // Try to find the admin user
      user = await prisma.user.findFirst({
        where: { email: 'admin@example.com' }
      });
      
      if (user) {
        logger.info(`Using admin user ${user.id} for customer ${customer}`);
        
        // Update admin user with customer ID
        await prisma.user.update({
          where: { id: user.id },
          data: { customerId: customer }
        });
      } else {
        // Create a new admin user if one doesn't exist
        user = await prisma.user.create({
          data: {
            id: cuid(),
            email: 'admin@example.com',
            name: 'Admin User',
            customerId: customer,
            password: '$2b$10$dummyhashedpassword', // Replace with proper hashing
            isActive: true
          }
        });
        logger.info(`Created admin user for customer ${customer}: ${user.id}`);
      }
    } else {
      logger.info(`Found user ${user.id} for customer ${customer}`);
    }

    try {
      // Create payment record - use only fields that match the schema
      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentId: paymentId,
          amount: amount || 0,
          currency: currency || 'gbp', // Default to GBP 
          status: 'succeeded'
        }
      });
      
      logger.info(`Payment recorded successfully for invoice ${id}`);
      
      // Send payment success email
      await emailService.sendPaymentSuccessNotification({
        email: user.email,
        name: user.name
      }, {
        amount: amount || 0,
        currency: currency || 'gbp' // Default to GBP
      });
      logger.info(`Payment success email sent to ${user.email}`);
    } catch (dbError) {
      logger.error(`Database error recording payment: ${dbError}`);
      // Continue processing without throwing to ensure webhook completes
    }
  } catch (error) {
    logger.error(`Error recording payment: ${error}`);
    throw error;
  }
}

module.exports = router; 