const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createCategoryForProvider() {
  try {
    // Get the provider profile ID from the logs
    const providerId = 'cmm4wsqa30000iuklt3guien6';
    
    // Create a default category for this provider
    const category = await prisma.category.create({
      data: {
        name: 'General',
        description: 'General category for all meals',
        providerId: providerId
      }
    });
    
    console.log('✅ Created category:', category);
    console.log('Category ID:', category.id);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCategoryForProvider();
