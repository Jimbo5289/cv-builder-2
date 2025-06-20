const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🔄 Starting database migration...');
    
    // Check for duplicates first
    console.log('📋 Checking for duplicate stripeSubscriptionId values...');
    const duplicates = await prisma.$queryRaw`
      SELECT "stripeSubscriptionId", COUNT(*) as count 
      FROM "Subscription" 
      GROUP BY "stripeSubscriptionId" 
      HAVING COUNT(*) > 1
    `;
    
    if (duplicates.length > 0) {
      console.log('⚠️  Found duplicates:', duplicates);
      console.log('🧹 Removing duplicate subscriptions (keeping most recent)...');
      
      for (const duplicate of duplicates) {
        await prisma.$executeRaw`
          DELETE FROM "Subscription" s1 
          WHERE s1.id NOT IN (
            SELECT s2.id FROM "Subscription" s2 
            WHERE s2."stripeSubscriptionId" = ${duplicate.stripeSubscriptionId}
            ORDER BY s2."createdAt" DESC 
            LIMIT 1
          ) AND s1."stripeSubscriptionId" = ${duplicate.stripeSubscriptionId}
        `;
      }
      console.log('✅ Duplicates removed');
    } else {
      console.log('✅ No duplicates found');
    }
    
    // Add unique constraint
    console.log('🔧 Adding unique constraint to stripeSubscriptionId...');
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Subscription" 
        ADD CONSTRAINT "Subscription_stripeSubscriptionId_key" 
        UNIQUE ("stripeSubscriptionId")
      `;
      console.log('✅ Unique constraint added successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Unique constraint already exists');
      } else {
        throw error;
      }
    }
    
    // Verify constraint
    console.log('🔍 Verifying constraint...');
    const constraints = await prisma.$queryRaw`
      SELECT conname, contype 
      FROM pg_constraint 
      WHERE conrelid = 'Subscription'::regclass 
      AND conname = 'Subscription_stripeSubscriptionId_key'
    `;
    
    if (constraints.length > 0) {
      console.log('✅ Constraint verified successfully');
    } else {
      console.log('❌ Constraint verification failed');
    }
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration }; 