import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        // Handle successful checkout
        await handleSuccessfulSubscription(session);
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Handle subscription updates
        await handleSubscriptionUpdate(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error(`Error processing webhook: ${err.message}`);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

async function handleSuccessfulSubscription(session) {
  const userId = session.metadata.userId;
  
  // Update user's subscription status in your database
  // This is where you would implement your database logic
  // Example:
  // await db.user.update({
  //   where: { id: userId },
  //   data: {
  //     subscriptionStatus: 'active',
  //     subscriptionId: session.subscription,
  //     customerId: session.customer
  //   }
  // });
}

async function handleSubscriptionUpdate(subscription) {
  // Update subscription status in your database
  // This is where you would implement your database logic
  // Example:
  // await db.user.update({
  //   where: { customerId: subscription.customer },
  //   data: {
  //     subscriptionStatus: subscription.status,
  //     subscriptionId: subscription.id
  //   }
  // });
} 