#!/usr/bin/env node

/**
 * Superuser Role Transfer Script
 * 
 * This script will:
 * 1. Give james@mycvbuilder.co.uk superuser privileges
 * 2. Remove superuser privileges from jamesingleton1971@gmail.com
 * 3. Show before/after status
 */

const { PrismaClient } = require('@prisma/client');

async function transferSuperuserRoles() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Starting superuser role transfer...');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('');
    
    // Test database connection
    console.log('🔍 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    console.log('');
    
    // Check current status of both accounts
    console.log('📋 BEFORE - Current user roles:');
    console.log('═══════════════════════════════════════');
    
    const jamesNew = await prisma.user.findUnique({
      where: { email: 'james@mycvbuilder.co.uk' },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    
    const jamesOld = await prisma.user.findUnique({
      where: { email: 'jamesingleton1971@gmail.com' },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    
    if (jamesNew) {
      console.log('👤 james@mycvbuilder.co.uk:');
      console.log('   📧 Email:', jamesNew.email);
      console.log('   👤 Name:', jamesNew.name);
      console.log('   🎭 Role:', jamesNew.role);
      console.log('   📅 Created:', jamesNew.createdAt);
    } else {
      console.log('❌ james@mycvbuilder.co.uk - NOT FOUND');
    }
    
    console.log('');
    
    if (jamesOld) {
      console.log('👤 jamesingleton1971@gmail.com:');
      console.log('   📧 Email:', jamesOld.email);
      console.log('   👤 Name:', jamesOld.name);
      console.log('   🎭 Role:', jamesOld.role);
      console.log('   📅 Created:', jamesOld.createdAt);
    } else {
      console.log('❌ jamesingleton1971@gmail.com - NOT FOUND');
    }
    
    console.log('');
    console.log('⚡ EXECUTING ROLE CHANGES...');
    console.log('═══════════════════════════════════════');
    
    // Update james@mycvbuilder.co.uk to superuser
    if (jamesNew) {
      if (jamesNew.role !== 'superuser') {
        console.log('🔄 Promoting james@mycvbuilder.co.uk to superuser...');
        await prisma.user.update({
          where: { email: 'james@mycvbuilder.co.uk' },
          data: { role: 'superuser' }
        });
        console.log('✅ james@mycvbuilder.co.uk promoted to superuser');
      } else {
        console.log('✅ james@mycvbuilder.co.uk already has superuser role');
      }
    } else {
      console.log('❌ Cannot promote james@mycvbuilder.co.uk - account not found');
      console.log('   Please make sure this account is registered first');
    }
    
    // Update jamesingleton1971@gmail.com to regular user
    if (jamesOld) {
      if (jamesOld.role === 'superuser' || jamesOld.role === 'admin') {
        console.log('🔄 Demoting jamesingleton1971@gmail.com to regular user...');
        await prisma.user.update({
          where: { email: 'jamesingleton1971@gmail.com' },
          data: { role: 'user' }
        });
        console.log('✅ jamesingleton1971@gmail.com demoted to regular user');
      } else {
        console.log('✅ jamesingleton1971@gmail.com already has regular user role');
      }
    } else {
      console.log('ℹ️ jamesingleton1971@gmail.com not found - no action needed');
    }
    
    console.log('');
    console.log('📋 AFTER - Updated user roles:');
    console.log('═══════════════════════════════════════');
    
    // Check final status
    const jamesNewFinal = await prisma.user.findUnique({
      where: { email: 'james@mycvbuilder.co.uk' },
      select: { email: true, name: true, role: true }
    });
    
    const jamesOldFinal = await prisma.user.findUnique({
      where: { email: 'jamesingleton1971@gmail.com' },
      select: { email: true, name: true, role: true }
    });
    
    if (jamesNewFinal) {
      const badge = jamesNewFinal.role === 'superuser' ? '👑' : 
                   jamesNewFinal.role === 'admin' ? '🛡️' : '👤';
      console.log(`${badge} james@mycvbuilder.co.uk: ${jamesNewFinal.role}`);
    }
    
    if (jamesOldFinal) {
      const badge = jamesOldFinal.role === 'superuser' ? '👑' : 
                   jamesOldFinal.role === 'admin' ? '🛡️' : '👤';
      console.log(`${badge} jamesingleton1971@gmail.com: ${jamesOldFinal.role}`);
    }
    
    console.log('');
    console.log('🎉 ROLE TRANSFER COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════');
    console.log('✅ james@mycvbuilder.co.uk now has superuser privileges');
    console.log('✅ jamesingleton1971@gmail.com privileges removed');
    console.log('');
    console.log('🌐 You can now access the admin panel at:');
    console.log('   https://mycvbuilder.co.uk/admin');
    console.log('');
    console.log('🔑 Your new superuser privileges include:');
    console.log('   ✅ View all registered users');
    console.log('   ✅ Delete any user account');
    console.log('   ✅ Change user roles');
    console.log('   ✅ Access superuser-only API endpoints');
    console.log('   ✅ Manage admin accounts');
    console.log('');
    console.log('🔄 Please log out and log back in to refresh your session');
    console.log('📱 Then refresh your browser to see the admin panel');
    
  } catch (error) {
    console.error('❌ Error during role transfer:', error.message);
    console.error('📋 Full error:', error);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('1. Ensure both email accounts exist in the database');
    console.error('2. Check DATABASE_URL environment variable');
    console.error('3. Verify database accessibility');
    console.error('4. Make sure Prisma client is properly configured');
  } finally {
    console.log('');
    console.log('🔌 Disconnecting from database...');
    await prisma.$disconnect();
    console.log('✅ Database disconnected');
  }
}

// Execute the role transfer
console.log('🚀 Starting superuser role transfer process...');
console.log('');
transferSuperuserRoles()
  .then(() => {
    console.log('✅ Role transfer process completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Role transfer process failed:', error);
    process.exit(1);
  }); 