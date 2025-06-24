#!/usr/bin/env node

const RoleRequirementsService = require('./src/services/roleRequirementsService');

async function populateRoles() {
  console.log('🚀 Starting role requirements population...');
  
  const roleService = new RoleRequirementsService();
  
  try {
    // Check current state
    console.log('📊 Checking current database state...');
    const existingRoles = await roleService.getAllAvailableRoles();
    console.log(`Current roles in database: ${existingRoles.length}`);
    
    // Populate all roles
    console.log('💾 Populating comprehensive role data...');
    const results = await roleService.populateAllRoles();
    
    console.log('✅ Population completed successfully!');
    console.log(`📈 Created/Updated:
    - Roles: ${results.roles}
    - Skills: ${results.skills}
    - Seniority levels: ${results.seniorities}
    - Keywords: ${results.keywords}`);
    
    // Verify results
    console.log('🔍 Verifying population...');
    const updatedRoles = await roleService.getAllAvailableRoles();
    console.log(`Total roles available: ${updatedRoles.length}`);
    
    // Test a few specific roles
    console.log('🧪 Testing specific role retrieval...');
    const testRoles = ['fashion-designer', 'software-developer', 'nurse'];
    
    for (const roleKey of testRoles) {
      const requirements = await roleService.getRoleRequirements(roleKey);
      console.log(`✓ ${roleKey}: ${requirements.specificSkills?.length || 0} skills, ${requirements.criticalKeywords?.length || 0} keywords`);
    }
    
    console.log('\n🎉 Role requirements population completed successfully!');
    console.log('The CV analysis system now has comprehensive data for accurate role-specific analysis.');
    
  } catch (error) {
    console.error('❌ Population failed:', error);
    process.exit(1);
  } finally {
    await roleService.prisma.$disconnect();
    process.exit(0);
  }
}

// Handle script execution
if (require.main === module) {
  populateRoles();
}

module.exports = { populateRoles }; 