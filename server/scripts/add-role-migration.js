/**
 * Migration Script: Add Role Field to Users
 * 
 * This script safely adds the role field to existing users
 * and sets appropriate default roles.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateUserRoles() {
  console.log('🚀 Starting role migration...');
  
  try {
    // First, let's check if the role field exists
    const userWithRole = await prisma.user.findFirst({
      select: { role: true }
    }).catch(() => null);
    
    if (!userWithRole) {
      console.log('❌ Role field not found in schema. Please run prisma db push first.');
      return false;
    }
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true
      }
    });
    
    console.log(`📊 Found ${users.length} users to migrate`);
    
    let updated = 0;
    
    for (const user of users) {
      // Skip users who already have a role set
      if (user.role && user.role !== 'user') {
        console.log(`✓ ${user.email} already has role: ${user.role}`);
        continue;
      }
      
      // Set default role based on email
      let newRole = 'user';
      if (user.email === 'jamesingleton1971@gmail.com') {
        newRole = 'superuser'; // Make yourself superuser by default
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: { role: newRole }
      });
      
      console.log(`✓ Updated ${user.email} to role: ${newRole}`);
      updated++;
    }
    
    console.log(`\n✅ Migration complete!`);
    console.log(`   Updated ${updated} users`);
    console.log(`   Total users: ${users.length}`);
    
    // Show final role distribution
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    
    console.log('\n📈 Final role distribution:');
    roleStats.forEach(stat => {
      const icon = stat.role === 'superuser' ? '👑' : 
                   stat.role === 'admin' ? '🛡️' : '👤';
      console.log(`   ${icon} ${stat.role}: ${stat._count.role}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  migrateUserRoles()
    .then(success => {
      if (success) {
        console.log('\n🎉 You can now use the superuser management tools!');
        console.log('   Run: node server/src/scripts/manage-superuser.js');
      }
      process.exit(success ? 0 : 1);
    })
    .catch(console.error)
    .finally(() => prisma.$disconnect());
}

module.exports = { migrateUserRoles }; 