#!/usr/bin/env node

/**
 * Render-specific script to promote james@mycvbuilder.co.uk to superuser
 * Run this in Render shell with: node promote-james-render.js
 */

const { PrismaClient } = require('@prisma/client');

async function promoteJamesToSuperuser() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 [RENDER] Promoting james@mycvbuilder.co.uk to superuser...');
    console.log('📅 Timestamp:', new Date().toISOString());
    
    // Test database connection first
    console.log('🔍 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if user exists
    console.log('🔍 Looking for user james@mycvbuilder.co.uk...');
    const user = await prisma.user.findUnique({
      where: { email: 'james@mycvbuilder.co.uk' },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    
    if (!user) {
      console.log('❌ User james@mycvbuilder.co.uk not found!');
      console.log('');
      console.log('🔍 Let me check what users exist...');
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true },
        take: 10
      });
      console.log('📋 Found users:', allUsers);
      return;
    }
    
    console.log('✅ Found user:');
    console.log('   📧 Email:', user.email);
    console.log('   👤 Name:', user.name);
    console.log('   🎭 Current Role:', user.role);
    console.log('   📅 Created:', user.createdAt);
    
    if (user.role === 'superuser') {
      console.log('✅ User is already a superuser! No changes needed.');
      console.log('🎉 Admin panel should be accessible now.');
      return;
    }
    
    // Update to superuser
    console.log('⚡ Updating role to superuser...');
    const updatedUser = await prisma.user.update({
      where: { email: 'james@mycvbuilder.co.uk' },
      data: { role: 'superuser' }
    });
    
    console.log('');
    console.log('🎉 SUCCESS! Role updated successfully');
    console.log('   📧 Email:', updatedUser.email);
    console.log('   🎭 Previous role:', user.role);
    console.log('   👑 New role: superuser');
    console.log('   📅 Updated:', new Date().toISOString());
    console.log('');
    console.log('✅ You can now access the admin panel at:');
    console.log('   🌐 https://mycvbuilder.co.uk/admin');
    console.log('');
    console.log('🔑 You now have superuser privileges:');
    console.log('   ✅ View all registered users');
    console.log('   ✅ Delete any user account');
    console.log('   ✅ Change user roles');
    console.log('   ✅ Access superuser-only API endpoints');
    console.log('');
    console.log('🔄 Please refresh your browser to see the changes.');
    
  } catch (error) {
    console.error('❌ Error promoting user:', error.message);
    console.error('📋 Full error:', error);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('1. Check DATABASE_URL environment variable');
    console.error('2. Verify database accessibility');
    console.error('3. Ensure Prisma client is properly configured');
    console.error('4. Check if the user account exists');
  } finally {
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  }
}

// Run the promotion
console.log('🚀 Starting superuser promotion process...');
promoteJamesToSuperuser()
  .then(() => {
    console.log('✅ Promotion process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Promotion process failed:', error);
    process.exit(1);
  }); 