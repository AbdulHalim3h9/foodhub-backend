import { prisma } from "../src/lib/prisma";

async function createProviderProfile() {
  try {
    // First, get the current user (you'll need to update this with the actual user ID)
    const users = await prisma.user.findMany({
      where: {
        role: 'PROVIDER'
      }
    });

    console.log('Found PROVIDER users:', users.map(u => ({ id: u.id, email: u.email, role: u.role })));

    if (users.length === 0) {
      console.log('No PROVIDER users found. Creating one...');
      
      // Create a test provider user first
      const testUser = await prisma.user.create({
        data: {
          email: 'provider@test.com',
          name: 'Test Provider',
          role: 'PROVIDER',
          // You'll need to add password hash or use better-auth
        }
      });
      
      console.log('Created test user:', testUser);
    }

    // Get the first PROVIDER user
    const providerUser = users[0] || await prisma.user.findFirst({
      where: { role: 'PROVIDER' }
    });

    if (!providerUser) {
      console.log('No provider user found!');
      return;
    }

    console.log('Using provider user:', providerUser);

    // Check if provider profile already exists
    const existingProfile = await prisma.providerProfile.findFirst({
      where: { userId: providerUser.id }
    });

    if (existingProfile) {
      console.log('Provider profile already exists:', existingProfile);
      
      // Update it to active if it's not
      if (!existingProfile.isActive) {
        const updated = await prisma.providerProfile.update({
          where: { id: existingProfile.id },
          data: { isActive: true }
        });
        console.log('Updated provider profile to active:', updated);
      }
      return;
    }

    // Create provider profile
    const providerProfile = await prisma.providerProfile.create({
      data: {
        userId: providerUser.id,
        businessName: 'Test Restaurant',
        description: 'A test restaurant for meal creation',
        phone: '+1234567890',
        address: '123 Test Street, Test City',
        isActive: true, // Set to active for testing
      }
    });

    console.log('✅ Created provider profile:', providerProfile);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createProviderProfile();
