/**
 * Check and Fix User Roles Script
 * 
 * This script checks the current role assignments in the database
 * and ensures all users have proper role values set.
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndFixRoles() {
  try {
    console.log('🔍 Checking current user roles in database...\n');
    
    // Get all users with their current role values
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${allUsers.length} users total\n`);
    
    // Categorize users by role
    const usersByRole = {
      superuser: [],
      admin: [],
      user: [],
      null: []
    };
    
    allUsers.forEach(user => {
      const role = user.role || 'null';
      if (!usersByRole[role]) {
        usersByRole[role] = [];
      }
      usersByRole[role].push(user);
    });
    
    // Display current state
    console.log('📊 Current Role Distribution:');
    Object.entries(usersByRole).forEach(([role, users]) => {
      console.log(`  ${role}: ${users.length} users`);
      if (users.length > 0 && users.length <= 5) {
        users.forEach(user => {
          console.log(`    - ${user.email} (${user.id})`);
        });
      }
    });
    console.log();
    
    // Fix missing roles
    if (usersByRole.null.length > 0) {
      console.log('🔧 Fixing users with missing roles...\n');
      
      for (const user of usersByRole.null) {
        let newRole = 'user'; // Default role
        
        // Check if this should be a superuser/admin
        if (user.email === 'jamesingleton1971@gmail.com') {
          newRole = 'superuser';
          console.log(`  Setting ${user.email} as SUPERUSER`);
        } else if (user.email.includes('admin') || user.email.includes('test')) {
          // You might want to set specific test accounts as admin
          newRole = 'admin';
          console.log(`  Setting ${user.email} as ADMIN`);
        } else {
          console.log(`  Setting ${user.email} as USER`);
        }
        
        // Update the user's role
        await prisma.user.update({
          where: { id: user.id },
          data: { role: newRole }
        });
      }
      
      console.log(`\n✅ Updated ${usersByRole.null.length} users with missing roles`);
    } else {
      console.log('✅ All users already have role assignments');
    }
    
    // Final verification
    console.log('\n🔍 Final verification...');
    const updatedUsers = await prisma.user.findMany({
      select: {
        email: true,
        role: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const finalRoleCount = updatedUsers.reduce((acc, user) => {
      const role = user.role || 'null';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Final Role Distribution:');
    Object.entries(finalRoleCount).forEach(([role, count]) => {
      console.log(`  ${role}: ${count} users`);
    });
    
    // Show superusers and admins specifically
    const privilegedUsers = updatedUsers.filter(u => u.role === 'superuser' || u.role === 'admin');
    if (privilegedUsers.length > 0) {
      console.log('\n👑 Privileged Users:');
      privilegedUsers.forEach(user => {
        const badge = user.role === 'superuser' ? '👑' : '🛡️';
        console.log(`  ${badge} ${user.email} (${user.role})`);
      });
    }
    
    console.log('\n🎉 Role check and fix completed successfully!');
    
  } catch (error) {
    console.error('❌ Error checking/fixing roles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  checkAndFixRoles()
    .then(() => {
      console.log('\n✨ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { checkAndFixRoles }; 