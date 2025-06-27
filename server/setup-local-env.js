#!/usr/bin/env node

/**
 * Local Environment Setup Helper
 * 
 * This script helps configure your local environment for the superuser system.
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Local Environment Setup Helper');
console.log('═'.repeat(50));

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const developmentEnvPath = path.join(__dirname, 'development.env');

if (!fs.existsSync(envPath)) {
  console.log('📄 Creating .env file from development.env...');
  
  if (fs.existsSync(developmentEnvPath)) {
    // Copy development.env to .env
    const developmentContent = fs.readFileSync(developmentEnvPath, 'utf8');
    fs.writeFileSync(envPath, developmentContent);
    console.log('✅ .env file created');
  } else {
    console.log('❌ development.env not found');
    process.exit(1);
  }
}

// Add DATABASE_URL if missing
let envContent = fs.readFileSync(envPath, 'utf8');

if (!envContent.includes('DATABASE_URL')) {
  console.log('📝 Adding DATABASE_URL configuration...');
  
  const databaseConfig = `

# Database Configuration (Production AWS RDS)
# TODO: Replace this with your actual DATABASE_URL from Render Environment Variables
# Format: postgresql://username:password@host:5432/database_name
DATABASE_URL="postgresql://REPLACE_WITH_YOUR_ACTUAL_DATABASE_URL_FROM_RENDER"

# Instructions to get your DATABASE_URL:
# 1. Go to Render Dashboard > Your Backend Service > Environment Tab
# 2. Copy the DATABASE_URL value
# 3. Replace the line above with: DATABASE_URL="your_actual_url_here"
`;

  fs.writeFileSync(envPath, envContent + databaseConfig);
  console.log('✅ DATABASE_URL configuration added to .env');
}

console.log('\n📋 Next Steps:');
console.log('');
console.log('1. 🌐 Go to your Render Dashboard:');
console.log('   https://dashboard.render.com/');
console.log('');
console.log('2. 📂 Navigate to your backend service');
console.log('');
console.log('3. ⚙️  Go to Environment tab');
console.log('');
console.log('4. 📋 Copy the DATABASE_URL value');
console.log('');
console.log('5. ✏️  Edit server/.env file and replace:');
console.log('   DATABASE_URL="postgresql://REPLACE_WITH..."');
console.log('   with your actual database URL');
console.log('');
console.log('6. 🧪 Test the setup:');
console.log('   cd server && node setup-superuser.js');
console.log('');

// Check if DATABASE_URL is set properly
if (envContent.includes('REPLACE_WITH_YOUR_ACTUAL_DATABASE_URL')) {
  console.log('⚠️  DATABASE_URL still needs to be configured!');
  console.log('   Follow the steps above to complete setup.');
} else {
  console.log('✅ DATABASE_URL appears to be configured');
  console.log('   You can now run: node setup-superuser.js');
}

console.log('\n💡 Note: Since you completed setup on Render already,');
console.log('   running locally is optional. The production system');
console.log('   is ready for use!'); 