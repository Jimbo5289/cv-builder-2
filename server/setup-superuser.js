#!/usr/bin/env node

/**
 * Superuser Setup Script
 * 
 * This script sets up the superuser system for the CV Builder app.
 * It can be run on both development and production environments.
 */

const { PrismaClient } = require('@prisma/client');

// Initialize Prisma with connection error handling
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

async function setupSuperuser() {
  console.log('🚀 CV Builder Superuser Setup');
  console.log('═'.repeat(50));
  
  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if we need to add the role field
    console.log('\n🔍 Checking database schema...');
    
    try {
      // Try to query with role field
      const testUser = await prisma.user.findFirst({
        select: { id: true, email: true, role: true }
      });
      console.log('✅ Role field exists in schema');
    } catch (error) {
      if (error.message.includes('role')) {
        console.log('❌ Role field missing from database schema');
        console.log('\n📋 To fix this, you need to:');
        console.log('   1. Update your database schema with the role field');
        console.log('   2. Run: npx prisma db push (in development)');
        console.log('   3. Or deploy the updated schema to production');
        console.log('\n💡 The schema has been updated in your codebase.');
        console.log('   Deploy the latest code to apply the database changes.');
        return false;
      }
      throw error;
    }
    
    // Make jamesingleton1971@gmail.com a superuser
    console.log('\n👑 Setting up superuser privileges...');
    
    const targetEmail = 'jamesingleton1971@gmail.com';
    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (!user) {
      console.log(`❌ User ${targetEmail} not found in database`);
      console.log('   Please ensure this email is registered in the system first.');
      return false;
    }
    
    if (user.role === 'superuser') {
      console.log(`✅ ${targetEmail} is already a superuser`);
    } else {
      console.log(`📝 Updating ${targetEmail} from '${user.role || 'user'}' to 'superuser'...`);
      
      await prisma.user.update({
        where: { email: targetEmail },
        data: { role: 'superuser' }
      });
      
      console.log(`✅ Successfully made ${targetEmail} a superuser!`);
    }
    
    // Show current role distribution
    console.log('\n📊 Current user roles:');
    
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true }
    });
    
    const totalUsers = await prisma.user.count();
    
    roleStats.forEach(stat => {
      const icon = stat.role === 'superuser' ? '👑' : 
                   stat.role === 'admin' ? '🛡️' : '👤';
      const percentage = ((stat._count.role / totalUsers) * 100).toFixed(1);
      console.log(`   ${icon} ${(stat.role || 'user').padEnd(10)} ${stat._count.role.toString().padStart(3)} users (${percentage}%)`);
    });
    
    console.log(`\n📈 Total users: ${totalUsers}`);
    
    // Show what you can do now
    console.log('\n🎉 Setup Complete! Superuser capabilities enabled:');
    console.log('');
    console.log('🔧 Command Line Tools:');
    console.log('   • List all users:      node server/src/scripts/manage-superuser.js list');
    console.log('   • List only admins:    node server/src/scripts/manage-superuser.js list admin');
    console.log('   • Promote user:        node server/src/scripts/manage-superuser.js promote user@example.com admin jamesingleton1971@gmail.com');
    console.log('   • Delete user:         node server/src/scripts/manage-superuser.js delete user@example.com jamesingleton1971@gmail.com confirm');
    console.log('');
    console.log('🌐 Admin Panel Features:');
    console.log('   • View role badges for all users (👑 Superuser, 🛡️ Admin, 👤 User)');
    console.log('   • Delete any user account (including admins)');
    console.log('   • Access superuser-only API endpoints');
    console.log('');
    console.log('🔒 Security Features:');
    console.log('   • Cannot delete your own superuser account');
    console.log('   • Cannot demote your own superuser role');
    console.log('   • All deletions require email confirmation');
    console.log('   • Full audit logging of all superuser actions');
    
    return true;
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n🔍 Error details:', error);
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Database connection failed. This could mean:');
      console.log('   • Database server is not running');
      console.log('   • DATABASE_URL environment variable is incorrect');
      console.log('   • Network connectivity issues');
    }
    
    return false;
  }
}

// Main execution
async function main() {
  const success = await setupSuperuser();
  
  if (success) {
    console.log('\n✨ You can now manage users with superuser privileges!');
    console.log('   Visit your admin panel to see the new role-based interface.');
  } else {
    console.log('\n🚨 Setup incomplete. Please resolve the issues above and try again.');
  }
  
  await prisma.$disconnect();
  process.exit(success ? 0 : 1);
}

// Handle script execution
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { setupSuperuser }; 