const { PrismaClient } = require('@prisma/client');

async function applyMigration() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Starting database migration for session tracking...');
    
    // Check if the columns already exist
    const subscriptionColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Subscription' AND column_name = 'stripeSessionId'
    `;
    
    const temporaryAccessColumns = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'TemporaryAccess' AND column_name = 'stripeSessionId'
    `;
    
    // Add stripeSessionId to Subscription table if it doesn't exist
    if (subscriptionColumns.length === 0) {
      console.log('📝 Adding stripeSessionId column to Subscription table...');
      await prisma.$executeRaw`
        ALTER TABLE "Subscription" 
        ADD COLUMN "stripeSessionId" TEXT;
      `;
      console.log('✅ Added stripeSessionId to Subscription table');
    } else {
      console.log('ℹ️  stripeSessionId column already exists in Subscription table');
    }
    
    // Add stripeSessionId to TemporaryAccess table if it doesn't exist
    if (temporaryAccessColumns.length === 0) {
      console.log('📝 Adding stripeSessionId column to TemporaryAccess table...');
      await prisma.$executeRaw`
        ALTER TABLE "TemporaryAccess" 
        ADD COLUMN "stripeSessionId" TEXT;
      `;
      console.log('✅ Added stripeSessionId to TemporaryAccess table');
    } else {
      console.log('ℹ️  stripeSessionId column already exists in TemporaryAccess table');
    }
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
applyMigration()
  .then(() => {
    console.log('✨ Database migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }); 