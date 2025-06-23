const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function fixSubscriptionPeriod() {
  try {
    console.log('🔍 Checking and fixing subscription period issue...\n');

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { 
        email: 'jamesingleton1971@gmail.com'
      },
      include: {
        subscription: true
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 User Details:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}\n`);

    if (!user.subscription || user.subscription.length === 0) {
      console.log('❌ No subscriptions found');
      return;
    }

    console.log('💳 Current Subscription Details:');
    
    for (const sub of user.subscription) {
      console.log(`\n--- Subscription ${sub.id} ---`);
      console.log(`   Stripe Subscription ID: ${sub.stripeSubscriptionId}`);
      console.log(`   Stripe Session ID: ${sub.stripeSessionId}`);
      console.log(`   Status: ${sub.status}`);
      console.log(`   Price ID: ${sub.stripePriceId}`);
      console.log(`   Current Period Start: ${sub.currentPeriodStart}`);
      console.log(`   Current Period End: ${sub.currentPeriodEnd}`);
      
      // Calculate current period length
      if (sub.currentPeriodStart && sub.currentPeriodEnd) {
        const start = new Date(sub.currentPeriodStart);
        const end = new Date(sub.currentPeriodEnd);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(`   Current Period Length: ${diffDays} days`);
        
        // Check if this is supposed to be an annual subscription
        const isAnnualPrice = sub.stripePriceId === 'price_1RTKgIKSDrkHMuUnTAJ8flI6';
        
        if (isAnnualPrice && diffDays < 350) {
          console.log(`   ⚠️  ISSUE DETECTED: Annual subscription only has ${diffDays} days!`);
          
          // Try to get the correct period from Stripe
          if (process.env.STRIPE_SECRET_KEY) {
            try {
              const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
              console.log(`\n🔗 Fetching correct period from Stripe...`);
              
              const stripeSubscription = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
              
              const correctStart = new Date(stripeSubscription.current_period_start * 1000);
              const correctEnd = new Date(stripeSubscription.current_period_end * 1000);
              const correctDiffTime = Math.abs(correctEnd - correctStart);
              const correctDiffDays = Math.ceil(correctDiffTime / (1000 * 60 * 60 * 24));
              
              console.log(`   Stripe Period Start: ${correctStart}`);
              console.log(`   Stripe Period End: ${correctEnd}`);
              console.log(`   Stripe Period Length: ${correctDiffDays} days`);
              console.log(`   Stripe Plan Interval: ${stripeSubscription.items.data[0]?.price?.recurring?.interval}`);
              
              if (correctDiffDays > 350) {
                console.log(`\n✅ Found correct annual period in Stripe. Updating database...`);
                
                const updatedSubscription = await prisma.subscription.update({
                  where: { id: sub.id },
                  data: {
                    currentPeriodStart: correctStart,
                    currentPeriodEnd: correctEnd,
                    updatedAt: new Date()
                  }
                });
                
                console.log(`✅ Successfully updated subscription period!`);
                console.log(`   New Period: ${correctStart} → ${correctEnd}`);
                console.log(`   New Length: ${correctDiffDays} days`);
                
                // Verify the update
                const verification = await prisma.subscription.findUnique({
                  where: { id: sub.id }
                });
                
                if (verification) {
                  const verifyStart = new Date(verification.currentPeriodStart);
                  const verifyEnd = new Date(verification.currentPeriodEnd);
                  const verifyDiffTime = Math.abs(verifyEnd - verifyStart);
                  const verifyDiffDays = Math.ceil(verifyDiffTime / (1000 * 60 * 60 * 24));
                  
                  console.log(`\n🔍 Verification:`)
                  console.log(`   Updated Period: ${verifyStart} → ${verifyEnd}`);
                  console.log(`   Updated Length: ${verifyDiffDays} days`);
                  
                  if (verifyDiffDays > 350) {
                    console.log(`✅ SUCCESS: Annual subscription period correctly updated!`);
                  } else {
                    console.log(`❌ FAILED: Update didn't work properly`);
                  }
                }
                
              } else {
                console.log(`❌ Stripe also shows short period (${correctDiffDays} days). This might be a Stripe configuration issue.`);
              }
              
            } catch (stripeError) {
              console.log(`❌ Stripe Error: ${stripeError.message}`);
            }
          } else {
            console.log(`❌ No Stripe secret key found in environment`);
          }
        } else if (isAnnualPrice) {
          console.log(`✅ Annual subscription period looks correct (${diffDays} days)`);
        } else {
          console.log(`ℹ️  Not an annual subscription (Price ID: ${sub.stripePriceId})`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error fixing subscription period:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixSubscriptionPeriod(); 