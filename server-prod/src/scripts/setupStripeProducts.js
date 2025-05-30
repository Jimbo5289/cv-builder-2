const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pricing = require('../config/pricing');

async function setupStripeProducts() {
  try {
    // Create main product
    const product = await stripe.products.create({
      name: 'CV Builder',
      description: 'Professional CV building and optimization service',
      metadata: {
        type: 'service'
      }
    });

    // Create prices for each plan
    for (const [key, plan] of Object.entries(pricing.plans)) {
      const priceData = {
        product: product.id,
        currency: plan.currency,
        metadata: {
          planType: key
        }
      };

      if (plan.type === 'one_time') {
        priceData.unit_amount = Math.round(plan.price * 100);
      } else {
        priceData.recurring = {
          interval: plan.interval
        };
        priceData.unit_amount = Math.round(plan.price * 100);
      }

      await stripe.prices.create(priceData);
      console.log(`Created price for ${plan.name}`);
    }

    // Create add-on products and prices
    for (const [key, addon] of Object.entries(pricing.addons)) {
      const addonProduct = await stripe.products.create({
        name: addon.name,
        description: addon.description,
        metadata: {
          type: 'addon'
        }
      });

      await stripe.prices.create({
        product: addonProduct.id,
        currency: addon.currency,
        unit_amount: Math.round(addon.price * 100),
        metadata: {
          addonType: key
        }
      });

      console.log(`Created add-on ${addon.name}`);
    }

    console.log('Stripe products and prices setup completed successfully');
  } catch (error) {
    console.error('Error setting up Stripe products:', error);
    throw error;
  }
}

// Run the setup if this script is executed directly
if (require.main === module) {
  setupStripeProducts().catch(console.error);
}

module.exports = setupStripeProducts; 