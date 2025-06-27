#!/usr/bin/env node

/**
 * Admin Password Reset Script
 * 
 * This script resets the password for your admin account so you can test the admin panel.
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function resetAdminPassword() {
  console.log('🔒 Admin Password Reset Tool');
  console.log('═'.repeat(50));
  
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    
    const adminEmail = 'jamesingleton1971@gmail.com';
    const newPassword = 'TempAdmin123!'; // Temporary password for testing
    
    console.log(`🔍 Looking for user: ${adminEmail}`);
    
    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (!user) {
      console.log(`❌ User ${adminEmail} not found`);
      return false;
    }
    
    console.log(`✅ Found user: ${user.name} (${user.email})`);
    console.log(`📋 Current role: ${user.role || 'user'}`);
    
    // Hash the new password
    console.log('🔐 Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the password
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password updated successfully!');
    console.log('');
    console.log('🎯 Login Credentials:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${newPassword}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after testing!');
    console.log('');
    console.log('🌐 You can now login to:');
    console.log('   https://mycvbuilder.co.uk/admin-panel/');
    
    return true;
    
  } catch (error) {
    console.error('❌ Password reset failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  const success = await resetAdminPassword();
  
  if (!success) {
    console.log('\n🚨 Password reset failed. Check the error above.');
  }
  
  await prisma.$disconnect();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { resetAdminPassword }; 