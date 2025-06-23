/* eslint-disable */
const express = require('express');
const router = express.Router();
const { stripe, verifyWebhookSignature } = require('../../config/stripe.cjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const emailService = require('../services/emailService');
const { logger } = require('../config/logger');
const cuid = require('cuid');

// Note: Raw body parsing is already handled in index.js
// router.use(express.raw({ type: 'application/json' }));

// Handle Stripe webhook events
router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  // Make sure we are using the raw body for verification
  const rawBody = req.rawBody || req.body;

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
    const { customer, subscription, client_reference_id, mode, amount_total, currency, customer_details } = session;
    
    logger.info('Processing checkout session completed', {
      sessionId: session.id,
      mode,
      customer,
      client_reference_id,
      customer_email: customer_details?.email,
      metadata: session.metadata
    });
    
    // Get or create a user based on multiple identification methods
    let user = null;
    
    // Method 1: Try to find user by client_reference_id (most reliable)
    if (client_reference_id) {
      try {
        user = await prisma.user.findUnique({
          where: { id: client_reference_id }
        });
        
        if (user) {
          logger.info(`Found user by client_reference_id: ${user.id} (${user.email})`);
          
          // Update user with customer ID if we have one and it's missing
          if (customer && !user.customerId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { customerId: customer }
            });
            logger.info(`Updated user ${user.id} with customer ID: ${customer}`);
          }
        }
      } catch (error) {
        logger.error('Error finding user by client_reference_id:', error);
      }
    }
    
    // Method 2: Try to find user by Stripe customer ID
    if (!user && customer) {
      try {
        user = await prisma.user.findFirst({
          where: { customerId: customer }
        });
        
        if (user) {
          logger.info(`Found user by customer ID: ${user.id} (${user.email})`);
        }
      } catch (error) {
        logger.error('Error finding user by customer ID:', error);
      }
    }
    
    // Method 3: Try to find user by email from customer details
    if (!user && customer_details?.email) {
      try {
        user = await prisma.user.findUnique({
          where: { email: customer_details.email }
        });
        
        if (user) {
          logger.info(`Found user by email: ${user.id} (${user.email})`);
          
          // Update user with customer ID if we have one
          if (customer && !user.customerId) {
            await prisma.user.update({
              where: { id: user.id },
              data: { customerId: customer }
            });
            logger.info(`Updated user ${user.id} with customer ID: ${customer}`);
          }
        }
      } catch (error) {
        logger.error('Error finding user by email:', error);
      }
    }
    
    // Method 4: Try to find user by email from Stripe customer object
    if (!user && customer) {
      try {
        const stripeCustomer = await stripe.customers.retrieve(customer);
        if (stripeCustomer && stripeCustomer.email) {
          user = await prisma.user.findUnique({
            where: { email: stripeCustomer.email }
          });
          
          if (user) {
            logger.info(`Found user by Stripe customer email: ${user.id} (${user.email})`);
            
            // Update user with customer ID
            if (!user.customerId) {
              await prisma.user.update({
                where: { id: user.id },
                data: { customerId: customer }
              });
              logger.info(`Updated user ${user.id} with customer ID: ${customer}`);
            }
          }
        }
      } catch (error) {
        logger.error('Error retrieving Stripe customer or finding user by customer email:', error);
      }
    }
    
    // If we still don't have a user, this is a critical error - DO NOT create subscription
    if (!user) {
      logger.error('CRITICAL: Could not identify user for checkout session', {
        sessionId: session.id,
        customer,
        client_reference_id,
        customer_email: customer_details?.email,
        metadata: session.metadata
      });
      
             // Send alert to admins about failed user identification
       try {
         await emailService.sendContactFormEmail({
           name: 'System Alert',
           email: 'system@mycvbuilder.co.uk',
           subject: 'URGENT: Failed to identify user for subscription purchase'
         }, `
           A subscription purchase could not be processed because we could not identify the user.
           
           Session ID: ${session.id}
           Customer ID: ${customer}
           Client Reference ID: ${client_reference_id}
           Customer Email: ${customer_details?.email}
           Amount: ${amount_total ? (amount_total / 100) : 'unknown'}
           Currency: ${currency}
           Mode: ${mode}
           
           Please investigate immediately and manually create the subscription for the correct user.
         `);
       } catch (emailError) {
         logger.error('Failed to send admin alert:', emailError);
       }
      
      return; // Exit without creating subscription for wrong user
    }
    
    // Handle subscription checkout
    if (subscription && mode === 'subscription') {
      try {
        // Get the actual subscription details from Stripe
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription);
        
        await prisma.subscription.upsert({
          where: { 
            stripeSubscriptionId: subscription
          },
          update: {
            status: 'active',
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            stripeCustomerId: customer || '',
            stripePriceId: stripeSubscription.items.data[0]?.price?.id || '',
            stripeSessionId: session.id,
            updatedAt: new Date()
          },
          create: {
            id: cuid(),
            stripeSubscriptionId: subscription,
            userId: user.id,
            status: 'active',
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            stripeCustomerId: customer || '',
            stripePriceId: stripeSubscription.items.data[0]?.price?.id || '',
            stripeSessionId: session.id,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        
        logger.info(`Subscription successfully created/updated for user ${user.id} (${user.email}): ${subscription}`);
        
                 // Send success notification
         try {
           await emailService.sendSubscriptionConfirmation({
             email: user.email,
             name: user.name
           }, {
             planId: session.metadata?.planName || 'Premium Plan',
             status: 'active',
             currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000)
           });
         } catch (emailError) {
           logger.error('Failed to send subscription success email:', emailError);
         }
        
      } catch (dbError) {
        logger.error(`Database error processing subscription checkout: ${dbError.message}`);
        // Continue processing without throwing to ensure webhook completes
      }
    } 
    // Handle one-time payment checkout
    else if (mode === 'payment') {
      logger.info(`One-time payment completed for user ${user.id} (${user.email})`, { metadata: session.metadata });
      
      try {
        // Record the payment in the database using correct field names
        const payment = await prisma.payment.create({
          data: {
            id: cuid(),
            userId: user.id,
            stripePaymentId: session.id,
            amount: amount_total ? amount_total / 100 : 0, // Convert cents to dollars/pounds
            currency: currency || 'gbp', // Default to GBP
            status: 'succeeded'
          }
        });
        
        // Check if this is a 30-day access purchase and create TemporaryAccess record
        if (session.metadata && session.metadata.planType === '30day-access') {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          
          await prisma.temporaryAccess.create({
            data: {
              id: cuid(),
              userId: user.id,
              type: '30day-access',
              startTime: new Date(),
              endTime: expiryDate,
              stripeSessionId: session.id
            }
          });
          
          logger.info(`30-day access created for user ${user.id} (${user.email}), expires: ${expiryDate}`);
        }
        
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
                id: cuid(),
                userId: user.id,
                stripeSubscriptionId: subscription.id,
                status: subscription.status,
                currentPeriodStart,
                currentPeriodEnd,
                cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
                stripeCustomerId: subscription.customer || '',
                stripePriceId: subscription.plan?.id || '',
                createdAt: new Date(),
                updatedAt: new Date()
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
  try {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription },
      include: { user: true },
    });

    if (subscription && subscription.user) {
      await emailService.sendPaymentFailedNotification({
        email: subscription.user.email,
        name: subscription.user.name,
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
      });
      logger.info(`Payment failure notification sent to ${subscription.user.email}`);
    } else {
      logger.warn(`No subscription or user found for failed payment: ${invoice.id}`);
    }
  } catch (error) {
    logger.error(`Error handling failed payment: ${error.message}`);
    // Don't throw to avoid webhook failure
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
      const payment = await prisma.payment.create({
        data: {
          id: cuid(),
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