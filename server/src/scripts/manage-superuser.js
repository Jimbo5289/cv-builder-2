/**
 * Superuser Management Script
 * 
 * This script allows you to:
 * - Make yourself a superuser
 * - Promote/demote admin roles
 * - Delete admin/superuser accounts (superuser only)
 * - List all users with roles
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Available roles
const ROLES = {
  USER: 'user',
  ADMIN: 'admin', 
  SUPERUSER: 'superuser'
};

class SuperuserManager {
  /**
   * Make a user a superuser by email
   */
  async makeSuperuser(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, role: true }
      });
      
      if (!user) {
        console.log(`❌ User with email ${email} not found`);
        return false;
      }
      
      if (user.role === ROLES.SUPERUSER) {
        console.log(`✅ ${email} is already a superuser`);
        return true;
      }
      
      await prisma.user.update({
        where: { email },
        data: { role: ROLES.SUPERUSER }
      });
      
      console.log(`✅ Successfully made ${email} a superuser`);
      console.log(`   Previous role: ${user.role}`);
      console.log(`   New role: ${ROLES.SUPERUSER}`);
      return true;
    } catch (error) {
      console.error('❌ Error making superuser:', error.message);
      return false;
    }
  }
  
  /**
   * Set user role (superuser only operation)
   */
  async setUserRole(email, newRole, performedBy) {
    try {
      // Check if performer is superuser
      const performer = await prisma.user.findUnique({
        where: { email: performedBy },
        select: { role: true }
      });
      
      if (!performer || performer.role !== ROLES.SUPERUSER) {
        console.log(`❌ Only superusers can change user roles`);
        return false;
      }
      
      // Validate role
      if (!Object.values(ROLES).includes(newRole)) {
        console.log(`❌ Invalid role: ${newRole}. Valid roles: ${Object.values(ROLES).join(', ')}`);
        return false;
      }
      
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, role: true }
      });
      
      if (!user) {
        console.log(`❌ User with email ${email} not found`);
        return false;
      }
      
      if (user.role === newRole) {
        console.log(`✅ ${email} already has role: ${newRole}`);
        return true;
      }
      
      await prisma.user.update({
        where: { email },
        data: { role: newRole }
      });
      
      console.log(`✅ Successfully changed role for ${email}`);
      console.log(`   Previous role: ${user.role}`);
      console.log(`   New role: ${newRole}`);
      console.log(`   Changed by: ${performedBy}`);
      return true;
    } catch (error) {
      console.error('❌ Error changing user role:', error.message);
      return false;
    }
  }
  
  /**
   * Delete a user (superuser only, with safety checks)
   */
  async deleteUser(email, performedBy, confirmDelete = false) {
    try {
      // Check if performer is superuser
      const performer = await prisma.user.findUnique({
        where: { email: performedBy },
        select: { role: true, email: true }
      });
      
      if (!performer || performer.role !== ROLES.SUPERUSER) {
        console.log(`❌ Only superusers can delete users`);
        return false;
      }
      
      // Prevent self-deletion
      if (email === performedBy) {
        console.log(`❌ Cannot delete your own account`);
        return false;
      }
      
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          _count: {
            select: {
              cvs: true,
              subscriptions: true,
              payments: true
            }
          }
        }
      });
      
      if (!user) {
        console.log(`❌ User with email ${email} not found`);
        return false;
      }
      
      // Show user info and ask for confirmation
      console.log(`\n⚠️  DELETION WARNING ⚠️`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   CVs: ${user._count.cvs}`);
      console.log(`   Subscriptions: ${user._count.subscriptions}`);
      console.log(`   Payments: ${user._count.payments}`);
      
      if (!confirmDelete) {
        console.log(`\n❌ Use confirmDelete=true to proceed with deletion`);
        return false;
      }
      
      // Delete user and all related data (cascade delete should handle most)
      await prisma.user.delete({
        where: { email }
      });
      
      console.log(`✅ Successfully deleted user: ${email}`);
      console.log(`   Deleted by: ${performedBy}`);
      return true;
    } catch (error) {
      console.error('❌ Error deleting user:', error.message);
      return false;
    }
  }
  
  /**
   * List all users with their roles
   */
  async listUsers(roleFilter = null) {
    try {
      const where = roleFilter ? { role: roleFilter } : {};
      
      const users = await prisma.user.findMany({
        where,
        select: {
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLogin: true,
          _count: {
            select: {
              cvs: true,
              subscriptions: true
            }
          }
        },
        orderBy: [
          { role: 'desc' }, // superuser, admin, user
          { createdAt: 'desc' }
        ]
      });
      
      console.log(`\n📋 Users ${roleFilter ? `with role: ${roleFilter}` : '(all roles)'}`);
      console.log('═'.repeat(100));
      
      users.forEach(user => {
        const roleIcon = user.role === ROLES.SUPERUSER ? '👑' : 
                        user.role === ROLES.ADMIN ? '🛡️' : '👤';
        const statusIcon = user.isActive ? '✅' : '❌';
        
        console.log(`${roleIcon} ${user.email.padEnd(35)} | ${user.role.padEnd(10)} | ${statusIcon} | CVs: ${user._count.cvs} | Subs: ${user._count.subscriptions}`);
      });
      
      return users;
    } catch (error) {
      console.error('❌ Error listing users:', error.message);
      return [];
    }
  }
  
  /**
   * Quick setup - make yourself superuser
   */
  async quickSetup(email) {
    console.log('🚀 Quick Superuser Setup');
    console.log('═'.repeat(50));
    
    const success = await this.makeSuperuser(email);
    
    if (success) {
      console.log('\n✅ Setup complete! You now have superuser privileges.');
      console.log('\nSuperuser capabilities:');
      console.log('  • Delete any user account (including admins)');
      console.log('  • Promote/demote user roles');
      console.log('  • Full admin panel access');
      console.log('  • Manage other superusers');
    }
    
    return success;
  }
}

// CLI interface
async function main() {
  const manager = new SuperuserManager();
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🔧 Superuser Management Tool

Usage:
  node manage-superuser.js setup <your-email>                    - Make yourself superuser
  node manage-superuser.js list [role]                          - List users (optionally filter by role)
  node manage-superuser.js promote <email> <role> <your-email>  - Change user role
  node manage-superuser.js delete <email> <your-email> confirm  - Delete user (use 'confirm' to proceed)

Examples:
  node manage-superuser.js setup jamesingleton1971@gmail.com
  node manage-superuser.js list admin
  node manage-superuser.js promote test@example.com admin jamesingleton1971@gmail.com
  node manage-superuser.js delete test@example.com jamesingleton1971@gmail.com confirm

Roles: user, admin, superuser
`);
    process.exit(0);
  }
  
  const command = args[0];
  
  switch (command) {
    case 'setup':
      if (!args[1]) {
        console.log('❌ Please provide your email address');
        process.exit(1);
      }
      await manager.quickSetup(args[1]);
      break;
      
    case 'list':
      await manager.listUsers(args[1]);
      break;
      
    case 'promote':
      if (!args[1] || !args[2] || !args[3]) {
        console.log('❌ Usage: promote <email> <new-role> <your-email>');
        process.exit(1);
      }
      await manager.setUserRole(args[1], args[2], args[3]);
      break;
      
    case 'delete':
      if (!args[1] || !args[2]) {
        console.log('❌ Usage: delete <email> <your-email> [confirm]');
        process.exit(1);
      }
      const confirmDelete = args[3] === 'confirm';
      await manager.deleteUser(args[1], args[2], confirmDelete);
      break;
      
    default:
      console.log(`❌ Unknown command: ${command}`);
      process.exit(1);
  }
  
  await prisma.$disconnect();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SuperuserManager, ROLES }; 