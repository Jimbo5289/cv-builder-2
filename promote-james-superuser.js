#!/usr/bin/env node

/**
 * Quick script to promote james@mycvbuilder.co.uk to superuser
 * Run this from the project root with: node promote-james-superuser.js
 */

const { PrismaClient } = require('@prisma/client');

async function promoteJamesToSuperuser() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Promoting james@mycvbuilder.co.uk to superuser...');
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'james@mycvbuilder.co.uk' },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (!user) {
      console.log('❌ User james@mycvbuilder.co.uk not found!');
      console.log('   Make sure you have registered this account first.');
      return;
    }
    
    console.log('✅ Found user:', {
      email: user.email,
      name: user.name,
      currentRole: user.role
    });
    
    if (user.role === 'superuser') {
      console.log('✅ User is already a superuser! No changes needed.');
      return;
    }
    
    // Update to superuser
    await prisma.user.update({
      where: { email: 'james@mycvbuilder.co.uk' },
      data: { role: 'superuser' }
    });
    
    console.log('🎉 SUCCESS! james@mycvbuilder.co.uk is now a superuser');
    console.log('   Previous role:', user.role);
    console.log('   New role: superuser');
    console.log('');
    console.log('✅ You can now access the admin panel at:');
    console.log('   https://mycvbuilder.co.uk/admin');
    console.log('');
    console.log('✅ You now have access to:');
    console.log('   - View all registered users');
    console.log('   - Delete any user account');
    console.log('   - Change user roles');
    console.log('   - Access superuser-only features');
    
  } catch (error) {
    console.error('❌ Error promoting user:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Make sure your DATABASE_URL is set correctly');
    console.error('2. Ensure the database is accessible');
    console.error('3. Check that the user account exists');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the promotion
promoteJamesToSuperuser(); 