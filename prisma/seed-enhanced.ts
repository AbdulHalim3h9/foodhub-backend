import { prisma } from "../src/lib/prisma";
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  try {
    // Clean existing data in correct order (respect foreign key constraints)
    await prisma.orderItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.meal.deleteMany();
    await prisma.category.deleteMany();
    await prisma.cuisine.deleteMany();
    await prisma.providerProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();

    console.log('🧹 Cleaned existing data');

    // Create Cuisines
    const cuisines = await Promise.all([
      prisma.cuisine.create({ data: { name: 'Italian' } }),
      prisma.cuisine.create({ data: { name: 'Chinese' } }),
      prisma.cuisine.create({ data: { name: 'Mexican' } }),
      prisma.cuisine.create({ data: { name: 'American' } }),
      prisma.cuisine.create({ data: { name: 'Indian' } }),
      prisma.cuisine.create({ data: { name: 'Japanese' } }),
      prisma.cuisine.create({ data: { name: 'Thai' } }),
      prisma.cuisine.create({ data: { name: 'Mediterranean' } })
    ]);

    console.log('🍽️ Created cuisines');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: 'admin@foodhub.com',
        name: 'Admin User',
        phone: '+1111111111',
        address: '123 Admin Street, Tech City',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    console.log('👑 Created admin user');

    // Create Users (Customers)
    const customerPassword = await bcrypt.hash('password123', 10);
    const customers = await Promise.all([
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'john.doe@email.com',
          name: 'John Doe',
          phone: '+1234567890',
          address: '123 Main St, New York, NY 10001',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'jane.smith@email.com',
          name: 'Jane Smith',
          phone: '+0987654321',
          address: '456 Oak Ave, Los Angeles, CA 90001',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'mike.wilson@email.com',
          name: 'Mike Wilson',
          phone: '+1122334455',
          address: '789 Pine Rd, Chicago, IL 60601',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'sarah.jones@email.com',
          name: 'Sarah Jones',
          phone: '+2233445566',
          address: '321 Elm St, Houston, TX 77001',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'david.brown@email.com',
          name: 'David Brown',
          phone: '+3344556677',
          address: '654 Maple Dr, Phoenix, AZ 85001',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'emily.davis@email.com',
          name: 'Emily Davis',
          phone: '+4455667788',
          address: '987 Cedar Ln, Boston, MA 02101',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'robert.miller@email.com',
          name: 'Robert Miller',
          phone: '+5566778899',
          address: '147 Birch St, Seattle, WA 98101',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'lisa.anderson@email.com',
          name: 'Lisa Anderson',
          phone: '+6677889900',
          address: '258 Spruce Way, Portland, OR 97201',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'james.taylor@email.com',
          name: 'James Taylor',
          phone: '+7788990011',
          address: '369 Willow Dr, Denver, CO 80201',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'mary.thomas@email.com',
          name: 'Mary Thomas',
          phone: '+8899001122',
          address: '741 Pine Ridge, Miami, FL 33101',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'chris.jackson@email.com',
          name: 'Chris Jackson',
          phone: '+9900112233',
          address: '852 Oak Valley, Atlanta, GA 30301',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'patricia.white@email.com',
          name: 'Patricia White',
          phone: '+0011223344',
          address: '963 Maple Heights, Dallas, TX 75201',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'michael.harris@email.com',
          name: 'Michael Harris',
          phone: '+1122334455',
          address: '147 Cedar Grove, Philadelphia, PA 19101',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'jennifer.martin@email.com',
          name: 'Jennifer Martin',
          phone: '+2233445566',
          address: '258 Birch Trail, Washington, DC 20001',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'william.garcia@email.com',
          name: 'William Garcia',
          phone: '+3344556677',
          address: '369 Spruce Path, Baltimore, MD 21201',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'linda.martinez@email.com',
          name: 'Linda Martinez',
          phone: '+4455667788',
          address: '741 Willow Lane, San Diego, CA 92101',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'richard.rodriguez@email.com',
          name: 'Richard Rodriguez',
          phone: '+5566778899',
          address: '852 Pine Court, Las Vegas, NV 89101',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'nancy.lopez@email.com',
          name: 'Nancy Lopez',
          phone: '+6677889900',
          address: '963 Oak Manor, Minneapolis, MN 55401',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'david.wilson@email.com',
          name: 'David Wilson',
          phone: '+7788990011',
          address: '147 Birch Park, Tampa, FL 33601',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'karen.anderson@email.com',
          name: 'Karen Anderson',
          phone: '+8899001122',
          address: '258 Spruce Road, Orlando, FL 32801',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'mark.thomas@email.com',
          name: 'Mark Thomas',
          phone: '+9900112233',
          address: '369 Willow Way, Sacramento, CA 95801',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'sandra.jackson@email.com',
          name: 'Sandra Jackson',
          phone: '+0011223344',
          address: '741 Pine Street, Salt Lake City, UT 84101',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'jason.white@email.com',
          name: 'Jason White',
          phone: '+1122334455',
          address: '852 Oak Avenue, Kansas City, MO 64101',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'stephanie.harris@email.com',
          name: 'Stephanie Harris',
          phone: '+2233445566',
          address: '963 Maple Drive, St. Louis, MO 63101',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      })
    ]);

    console.log('👥 Created customers');

    // Create Users (Providers)
    const providerPassword = await bcrypt.hash('provider123', 10);
    const providers = await Promise.all([
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'mario.pizza@italian.com',
          name: 'Mario Pizza',
          phone: '+5556667777',
          address: '100 Pizza Plaza, New York, NY 10001',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'chen.wok@chinese.com',
          name: 'Chen Wok',
          phone: '+8889990000',
          address: '50 Noodle Street, San Francisco, CA 94101',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'carlos.taco@mexican.com',
          name: 'Carlos Taco',
          phone: '+7778889999',
          address: '200 Spice Road, Los Angeles, CA 90001',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'joe.burger@american.com',
          name: 'Joe Burger',
          phone: '+6667778888',
          address: '300 Grill Ave, Chicago, IL 60601',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'raj.curry@indian.com',
          name: 'Raj Curry',
          phone: '+9990001111',
          address: '400 Spice Lane, Houston, TX 77001',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'akira.sushi@japanese.com',
          name: 'Akira Sushi',
          phone: '+1112223333',
          address: '75 Sakura Street, Seattle, WA 98101',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'somchai.thai@thai.com',
          name: 'Somchai Thai',
          phone: '+2223334444',
          address: '150 Bangkok Blvd, Portland, OR 97201',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'yannis.greek@greek.com',
          name: 'Yannis Greek',
          phone: '+3334445555',
          address: '25 Athens Ave, Denver, CO 80201',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'marco.pasta@italian2.com',
          name: 'Marco Pasta',
          phone: '+4445556666',
          address: '325 Rome Road, Miami, FL 33101',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'li.dimsum@chinese2.com',
          name: 'Li Dimsum',
          phone: '+5556667777',
          address: '450 Beijing Way, Atlanta, GA 30301',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'diego.tacos@mexican2.com',
          name: 'Diego Tacos',
          phone: '+6667778888',
          address: '175 Mexico Street, Dallas, TX 75201',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'frank.bbq@american2.com',
          name: 'Frank BBQ',
          phone: '+7778889999',
          address: '500 Smokehouse Lane, Philadelphia, PA 19101',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'priya.biryani@indian2.com',
          name: 'Priya Biryani',
          phone: '+8889990000',
          address: '225 Spice Garden, Baltimore, MD 21201',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'kenzo.ramen@japanese2.com',
          name: 'Kenzo Ramen',
          phone: '+9990001111',
          address: '350 Tokyo Street, San Diego, CA 92101',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'niran.padthai@thai2.com',
          name: 'Niran Padthai',
          phone: '+0011223344',
          address: '475 Phuket Road, Las Vegas, NV 89101',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'george.souvlaki@greek2.com',
          name: 'George Souvlaki',
          phone: '+1122334455',
          address: '600 Crete Corner, Minneapolis, MN 55401',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'giovanni.pizza@italian3.com',
          name: 'Giovanni Pizza',
          phone: '+2233445566',
          address: '725 Milan Avenue, Tampa, FL 33601',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: 'wei.noodles@chinese3.com',
          name: 'Wei Noodles',
          phone: '+3344556677',
          address: '825 Shanghai Street, Orlando, FL 32801',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      })
    ]);

    console.log('👨‍🍳 Created providers');

    // Create Provider Profiles
    const providerProfiles = await Promise.all([
      prisma.providerProfile.create({
        data: {
          userId: providers[0].id,
          businessName: "Mario's Italian Kitchen",
          description: 'Authentic Italian cuisine made with love and fresh ingredients. Family recipes passed down for generations.',
          phone: '+5556667777',
          address: '100 Pizza Plaza, New York, NY 10001',
          logo: '/logos/mario-pizza.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[1].id,
          businessName: "Chen's Chinese Restaurant",
          description: 'Traditional Chinese cuisine with authentic flavors and recipes from various regions of China.',
          phone: '+8889990000',
          address: '50 Noodle Street, San Francisco, CA 94101',
          logo: '/logos/chen-chinese.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[2].id,
          businessName: "Carlos Mexican Cantina",
          description: 'Spicy and flavorful Mexican dishes with fresh ingredients and traditional cooking methods.',
          phone: '+7778889999',
          address: '200 Spice Road, Los Angeles, CA 90001',
          logo: '/logos/carlos-mexican.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[3].id,
          businessName: "Joe's American Diner",
          description: 'Classic American comfort food with a modern twist. Burgers, fries, and everything you love.',
          phone: '+6667778888',
          address: '300 Grill Ave, Chicago, IL 60601',
          logo: '/logos/joe-american.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[4].id,
          businessName: "Raj Indian Palace",
          description: 'Aromatic Indian cuisine with tandoori specialties and regional curries from across India.',
          phone: '+9990001111',
          address: '400 Spice Lane, Houston, TX 77001',
          logo: '/logos/raj-curry.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[5].id,
          businessName: "Akira Sushi Bar",
          description: 'Fresh and authentic Japanese sushi and sashimi made by master chefs with the finest ingredients.',
          phone: '+1112223333',
          address: '75 Sakura Street, Seattle, WA 98101',
          logo: '/logos/akira-sushi.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[6].id,
          businessName: "Somchai Thai Kitchen",
          description: 'Traditional Thai cuisine with perfect balance of sweet, sour, salty, and spicy flavors.',
          phone: '+2223334444',
          address: '150 Bangkok Blvd, Portland, OR 97201',
          logo: '/logos/somchai-thai.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[7].id,
          businessName: "Yannis Greek Taverna",
          description: 'Mediterranean Greek cuisine with fresh seafood, grilled meats, and traditional dishes.',
          phone: '+3334445555',
          address: '25 Athens Ave, Denver, CO 80201',
          logo: '/logos/yannis-greek.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[8].id,
          businessName: "Marco's Pasta House",
          description: 'Homemade Italian pasta and wood-fired pizzas with recipes from Northern Italy.',
          phone: '+4445556666',
          address: '325 Rome Road, Miami, FL 33101',
          logo: '/logos/marco-pasta.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[9].id,
          businessName: "Li's Dim Sum Palace",
          description: 'Authentic Cantonese dim sum and traditional Chinese steamed dishes.',
          phone: '+5556667777',
          address: '450 Beijing Way, Atlanta, GA 30301',
          logo: '/logos/li-dimsum.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[10].id,
          businessName: "Diego's Taco Stand",
          description: 'Street-style Mexican tacos with authentic recipes and fresh local ingredients.',
          phone: '+6667778888',
          address: '175 Mexico Street, Dallas, TX 75201',
          logo: '/logos/diego-tacos.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[11].id,
          businessName: "Frank's BBQ Smokehouse",
          description: 'Slow-smoked American BBQ with ribs, brisket, and all the classic sides.',
          phone: '+7778889999',
          address: '500 Smokehouse Lane, Philadelphia, PA 19101',
          logo: '/logos/frank-bbq.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[12].id,
          businessName: "Priya's Biryani House",
          description: 'Authentic Indian biryani and curries with recipes passed down through generations.',
          phone: '+8889990000',
          address: '225 Spice Garden, Baltimore, MD 21201',
          logo: '/logos/priya-biryani.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[13].id,
          businessName: "Kenzo Ramen Shop",
          description: 'Traditional Japanese ramen with rich broths and fresh noodles made daily.',
          phone: '+9990001111',
          address: '350 Tokyo Street, San Diego, CA 92101',
          logo: '/logos/kenzo-ramen.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[14].id,
          businessName: "Niran's Thai Kitchen",
          description: 'Modern Thai cuisine with traditional techniques and fresh local ingredients.',
          phone: '+0011223344',
          address: '475 Phuket Road, Las Vegas, NV 89101',
          logo: '/logos/niran-thai.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[15].id,
          businessName: "George's Greek Grill",
          description: 'Mediterranean Greek cuisine with grilled specialties and homemade dips.',
          phone: '+1122334455',
          address: '600 Crete Corner, Minneapolis, MN 55401',
          logo: '/logos/george-greek.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[16].id,
          businessName: "Giovanni's Pizza Trattoria",
          description: 'Neapolitan-style pizzas and Southern Italian classics in a cozy atmosphere.',
          phone: '+2233445566',
          address: '725 Milan Avenue, Tampa, FL 33601',
          logo: '/logos/giovanni-pizza.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[17].id,
          businessName: "Wei's Noodle House",
          description: 'Hand-pulled Chinese noodles and traditional Szechuan dishes with bold flavors.',
          phone: '+3344556677',
          address: '825 Shanghai Street, Orlando, FL 32801',
          logo: '/logos/wei-noodles.jpg'
        }
      })
    ]);

    console.log('🏪 Created provider profiles');

// ... (rest of the code remains the same)
    // Create Categories (each provider gets their own category)
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Italian Cuisine',
          description: 'Authentic Italian cuisine with pasta, pizza, and more',
          image: '/categories/italian.jpg',
          providerId: providerProfiles[0].id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Chinese Cuisine',
          description: 'Traditional Chinese dishes from various regions',
          image: '/categories/chinese.jpg',
          providerId: providerProfiles[1].id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Mexican Cuisine',
          description: 'Spicy Mexican flavors with tacos, burritos, and more',
          image: '/categories/mexican.jpg',
          providerId: providerProfiles[2].id
        }
      }),
      prisma.category.create({
        data: {
          name: 'American Cuisine',
          description: 'Classic American comfort food and burgers',
          image: '/categories/american.jpg',
          providerId: providerProfiles[3].id
        }
      }),
      prisma.category.create({
        data: {
          name: 'Indian Cuisine',
          description: 'Aromatic Indian cuisine with curries and tandoori',
          image: '/categories/indian.jpg',
          providerId: providerProfiles[4].id
        }
      })
    ]);

    console.log('📂 Created categories');

    // Create Meals for each provider with cuisine relationships
    const allMeals = [];

    // Italian Meals
    const italianMeals = await Promise.all([
      prisma.meal.create({
        data: {
          name: 'Margherita Pizza',
          description: 'Classic pizza with fresh mozzarella, tomatoes, and basil on a crispy thin crust',
          price: 12.99,
          image: '/meals/margherita-pizza.jpg',
          ingredients: 'Pizza dough, tomato sauce, fresh mozzarella, fresh basil, olive oil, sea salt',
          allergens: 'Gluten, Dairy',
          prepTime: 20,
          isFeatured: true,
          cuisineId: cuisines[0].id,
          categoryId: categories[0].id,
          providerId: providerProfiles[0].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Spaghetti Carbonara',
          description: 'Creamy pasta with crispy bacon and parmesan cheese, made the traditional way',
          price: 14.99,
          image: '/meals/spaghetti-carbonara.jpg',
          ingredients: 'Spaghetti, eggs, bacon, parmesan cheese, black pepper, olive oil',
          allergens: 'Gluten, Dairy, Eggs',
          prepTime: 25,
          isFeatured: true,
          cuisineId: cuisines[0].id,
          categoryId: categories[0].id,
          providerId: providerProfiles[0].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Tiramisu',
          description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
          price: 6.99,
          image: '/meals/tiramisu.jpg',
          ingredients: 'Ladyfingers, espresso, eggs, sugar, mascarpone cheese, cocoa powder',
          allergens: 'Gluten, Dairy, Eggs, Caffeine',
          prepTime: 5,
          cuisineId: cuisines[0].id,
          categoryId: categories[0].id,
          providerId: providerProfiles[0].id
        }
      })
    ]);
    allMeals.push(...italianMeals);

    // Chinese Meals
    const chineseMeals = await Promise.all([
      prisma.meal.create({
        data: {
          name: 'Kung Pao Chicken',
          description: 'Spicy stir-fried chicken with vegetables and peanuts in a savory sauce',
          price: 11.99,
          image: '/meals/kung-pao-chicken.jpg',
          ingredients: 'Chicken breast, bell peppers, onions, peanuts, soy sauce, ginger, garlic, chili',
          allergens: 'Soy, Peanuts',
          prepTime: 15,
          isFeatured: true,
          cuisineId: cuisines[1].id,
          categoryId: categories[1].id,
          providerId: providerProfiles[1].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Beef Chow Mein',
          description: 'Stir-fried noodles with tender beef strips and fresh vegetables',
          price: 10.99,
          image: '/meals/beef-chow-mein.jpg',
          ingredients: 'Beef, egg noodles, soy sauce, bean sprouts, bell peppers, onions, sesame oil',
          allergens: 'Soy, Gluten, Eggs',
          prepTime: 18,
          cuisineId: cuisines[1].id,
          categoryId: categories[1].id,
          providerId: providerProfiles[1].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Spring Rolls',
          description: 'Crispy vegetable spring rolls with sweet chili sauce',
          price: 7.99,
          image: '/meals/spring-rolls.jpg',
          ingredients: 'Cabbage, carrots, bean sprouts, mushrooms, rice paper, chili sauce',
          allergens: 'Gluten',
          prepTime: 12,
          cuisineId: cuisines[1].id,
          categoryId: categories[1].id,
          providerId: providerProfiles[1].id
        }
      })
    ]);
    allMeals.push(...chineseMeals);

    // Mexican Meals
    const mexicanMeals = await Promise.all([
      prisma.meal.create({
        data: {
          name: 'Beef Tacos',
          description: 'Three seasoned beef tacos with fresh salsa, lettuce, and cheese',
          price: 9.99,
          image: '/meals/beef-tacos.jpg',
          ingredients: 'Ground beef, corn tortillas, lettuce, tomatoes, onions, cilantro, salsa, cheddar cheese',
          allergens: 'Gluten, Dairy',
          prepTime: 15,
          isFeatured: true,
          cuisineId: cuisines[2].id,
          categoryId: categories[2].id,
          providerId: providerProfiles[2].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Chicken Burrito',
          description: 'Grilled chicken burrito with rice, beans, cheese, and guacamole',
          price: 11.99,
          image: '/meals/chicken-burrito.jpg',
          ingredients: 'Grilled chicken, rice, black beans, cheese, tortilla, sour cream, guacamole, salsa',
          allergens: 'Dairy, Gluten',
          prepTime: 20,
          cuisineId: cuisines[2].id,
          categoryId: categories[2].id,
          providerId: providerProfiles[2].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Quesadilla',
          description: 'Crispy tortilla with melted cheese, jalapeños, and served with sour cream',
          price: 8.99,
          image: '/meals/quesadilla.jpg',
          ingredients: 'Flour tortilla, cheese, jalapeños, onions, sour cream, salsa',
          allergens: 'Dairy, Gluten',
          prepTime: 10,
          cuisineId: cuisines[2].id,
          categoryId: categories[2].id,
          providerId: providerProfiles[2].id
        }
      })
    ]);
    allMeals.push(...mexicanMeals);

    console.log('🍽️ Created meals');

    // Create Orders with different statuses
    const orders = await Promise.all([
      prisma.order.create({
        data: {
          orderNumber: 'ORD-001',
          customerId: customers[0].id,
          providerId: providerProfiles[0].id,
          status: 'DELIVERED',
          totalAmount: 25.98,
          deliveryAddress: '123 Main St, New York, NY 10001',
          deliveryPhone: '+1234567890',
          specialInstructions: 'Extra napkins please, and no onions!',
          estimatedDeliveryTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          actualDeliveryTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
        }
      }),
      prisma.order.create({
        data: {
          orderNumber: 'ORD-002',
          customerId: customers[1].id,
          providerId: providerProfiles[1].id,
          status: 'PREPARING',
          totalAmount: 22.98,
          deliveryAddress: '456 Oak Ave, Los Angeles, CA 90001',
          deliveryPhone: '+0987654321',
          specialInstructions: 'Extra spicy please!',
          estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000)
        }
      }),
      prisma.order.create({
        data: {
          orderNumber: 'ORD-003',
          customerId: customers[2].id,
          providerId: providerProfiles[2].id,
          status: 'OUT_FOR_DELIVERY',
          totalAmount: 31.98,
          deliveryAddress: '789 Pine Rd, Chicago, IL 60601',
          deliveryPhone: '+1122334455',
          specialInstructions: 'Leave at door, ring doorbell twice',
          estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000)
        }
      }),
      prisma.order.create({
        data: {
          orderNumber: 'ORD-004',
          customerId: customers[3].id,
          providerId: providerProfiles[3].id,
          status: 'PENDING',
          totalAmount: 19.98,
          deliveryAddress: '321 Elm St, Houston, TX 77001',
          deliveryPhone: '+2233445566',
          specialInstructions: 'No pickles on burger please'
        }
      }),
      prisma.order.create({
        data: {
          orderNumber: 'ORD-005',
          customerId: customers[4].id,
          providerId: providerProfiles[4].id,
          status: 'CONFIRMED',
          totalAmount: 27.98,
          deliveryAddress: '654 Maple Dr, Phoenix, AZ 85001',
          deliveryPhone: '+3344556677',
          specialInstructions: 'Mild spice level please',
          estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000)
        }
      })
    ]);

    console.log('📦 Created orders');

    // Create Order Items
    await Promise.all([
      prisma.orderItem.create({
        data: {
          orderId: orders[0].id,
          mealId: italianMeals[0].id,
          quantity: 2,
          price: 12.99
        }
      }),
      prisma.orderItem.create({
        data: {
          orderId: orders[1].id,
          mealId: chineseMeals[1].id,
          quantity: 1,
          price: 10.99
        }
      }),
      prisma.orderItem.create({
        data: {
          orderId: orders[1].id,
          mealId: chineseMeals[2].id,
          quantity: 1,
          price: 7.99
        }
      }),
      prisma.orderItem.create({
        data: {
          orderId: orders[2].id,
          mealId: mexicanMeals[0].id,
          quantity: 2,
          price: 9.99
        }
      }),
      prisma.orderItem.create({
        data: {
          orderId: orders[2].id,
          mealId: mexicanMeals[1].id,
          quantity: 1,
          price: 11.99
        }
      })
    ]);

    console.log('🛒 Created order items');

    // Create Cart Items
    await Promise.all([
      prisma.cartItem.create({
        data: {
          userId: customers[0].id,
          mealId: italianMeals[0].id,
          quantity: 1
        }
      }),
      prisma.cartItem.create({
        data: {
          userId: customers[0].id,
          mealId: italianMeals[1].id,
          quantity: 1
        }
      }),
      prisma.cartItem.create({
        data: {
          userId: customers[1].id,
          mealId: chineseMeals[0].id,
          quantity: 2
        }
      }),
      prisma.cartItem.create({
        data: {
          userId: customers[2].id,
          mealId: mexicanMeals[1].id,
          quantity: 1
        }
      })
    ]);

    console.log('🛒 Created cart items');

    // Create Reviews
    await Promise.all([
      prisma.review.create({
        data: {
          customerId: customers[0].id,
          mealId: italianMeals[0].id,
          rating: 5,
          comment: 'Best pizza I\'ve ever had! Fresh ingredients and perfect crust. Will definitely order again!'
        }
      }),
      prisma.review.create({
        data: {
          customerId: customers[1].id,
          mealId: chineseMeals[0].id,
          rating: 4,
          comment: 'Very flavorful and spicy! Good portion size. Could be a little less oily though.'
        }
      }),
      prisma.review.create({
        data: {
          customerId: customers[2].id,
          mealId: mexicanMeals[0].id,
          rating: 5,
          comment: 'Authentic Mexican flavors! Tacos were perfectly seasoned and the salsa was amazing.'
        }
      })
    ]);

    console.log('⭐ Created reviews');

    console.log('✅ Comprehensive database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${cuisines.length} cuisines`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - 1 admin user`);
    console.log(`   - ${customers.length} customers`);
    console.log(`   - ${providers.length} providers`);
    console.log(`   - ${providerProfiles.length} provider profiles`);
    console.log(`   - ${allMeals.length} meals`);
    console.log(`   - ${orders.length} orders`);
    console.log(`   - 5 order items`);
    console.log(`   - 4 cart items`);
    console.log(`   - 3 reviews`);
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log('   Admin: admin@foodhub.com / admin123');
    console.log('   Customer: john.doe@email.com / password123');
    console.log('   Provider: mario.pizza@italian.com / provider123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
