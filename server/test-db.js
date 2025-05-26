/**
 * Simple Database Test Script for CV Builder
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDatabase() {
  console.log('Testing database connection...');
  
  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to PostgreSQL database');
    
    // Try to count users
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    // Create a test user if none exist
    if (userCount === 0) {
      console.log('Creating a test user...');
      
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'hashedpassword',
          isActive: true,
        }
      });
      
      console.log('✅ Test user created with ID:', testUser.id);
    }
    
    // Check templates
    const templateCount = await prisma.cVTemplate.count();
    console.log(`Found ${templateCount} CV templates in the database`);
    
    // Create default templates if none exist
    if (templateCount === 0) {
      console.log('Creating default templates...');
      
      await prisma.cVTemplate.createMany({
        data: [
          {
            name: 'Professional',
            description: 'Clean, minimal design for corporate roles',
            thumbnail: '/images/templates/photos/professional.jpg',
            isDefault: true,
            isPremium: false
          },
          {
            name: 'Creative',
            description: 'Modern layout with visual elements for creative industries',
            thumbnail: '/images/templates/photos/creative.jpg',
            isDefault: false,
            isPremium: false
          },
          {
            name: 'Executive',
            description: 'Sophisticated layout for senior leadership positions',
            thumbnail: '/images/templates/photos/executive.jpg',
            isDefault: false,
            isPremium: true
          },
          {
            name: 'Academic',
            description: 'Research-focused template with publication formatting',
            thumbnail: '/images/templates/photos/academic.jpg',
            isDefault: false,
            isPremium: true
          }
        ]
      });
      
      console.log('✅ Default templates created');
    }
    
    // Disconnect when done
    await prisma.$disconnect();
    console.log('Database test completed successfully');
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}

// Run the test
testDatabase(); 