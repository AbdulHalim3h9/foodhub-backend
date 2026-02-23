import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clean existing data
    await prisma.orderItem.deleteMany();
    await prisma.review.deleteMany();
    await prisma.order.deleteMany();
    await prisma.meal.deleteMany();
    await prisma.category.deleteMany();
    await prisma.providerProfile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.verification.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();

    console.log('🧹 Cleaned existing data');

    // Create Categories
    const categories = await Promise.all([
      prisma.category.create({
        data: {
          name: 'Italian',
          description: 'Authentic Italian cuisine',
          image: '/categories/italian.jpg'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Chinese',
          description: 'Traditional Chinese dishes',
          image: '/categories/chinese.jpg'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Mexican',
          description: 'Spicy Mexican flavors',
          image: '/categories/mexican.jpg'
        }
      }),
      prisma.category.create({
        data: {
          name: 'American',
          description: 'Classic American comfort food',
          image: '/categories/american.jpg'
        }
      }),
      prisma.category.create({
        data: {
          name: 'Indian',
          description: 'Aromatic Indian cuisine',
          image: '/categories/indian.jpg'
        }
      })
    ]);

    console.log('📂 Created categories');

    // Create Users (Customers)
    const customerPassword = await bcrypt.hash('password123', 10);
    const customers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'john.doe@email.com',
          name: 'John Doe',
          phone: '+1234567890',
          address: '123 Main St, City, State',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          email: 'jane.smith@email.com',
          name: 'Jane Smith',
          phone: '+0987654321',
          address: '456 Oak Ave, Town, State',
          role: 'CUSTOMER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          email: 'mike.wilson@email.com',
          name: 'Mike Wilson',
          phone: '+1122334455',
          address: '789 Pine Rd, Village, State',
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
          email: 'mario.pizza@italian.com',
          name: 'Mario Pizza',
          phone: '+5556667777',
          address: '100 Pizza Plaza, Italy',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          email: 'chen.wok@chinese.com',
          name: 'Chen Wok',
          phone: '+8889990000',
          address: '50 Noodle Street, Beijing',
          role: 'PROVIDER',
          status: 'ACTIVE'
        }
      }),
      prisma.user.create({
        data: {
          email: 'carlos.taco@mexican.com',
          name: 'Carlos Taco',
          phone: '+7778889999',
          address: '200 Spice Road, Mexico City',
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
          description: 'Authentic Italian cuisine made with love',
          phone: '+5556667777',
          address: '100 Pizza Plaza, Italy',
          logo: '/logos/mario-pizza.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[1].id,
          businessName: 'Chen Chinese Restaurant',
          description: 'Traditional Chinese dishes passed down generations',
          phone: '+8889990000',
          address: '50 Noodle Street, Beijing',
          logo: '/logos/chen-wok.jpg'
        }
      }),
      prisma.providerProfile.create({
        data: {
          userId: providers[2].id,
          businessName: 'Carlos Mexican Cantina',
          description: 'Spicy and flavorful Mexican street food',
          phone: '+7778889999',
          address: '200 Spice Road, Mexico City',
          logo: '/logos/carlos-taco.jpg'
        }
      })
    ]);

    console.log('🏪 Created provider profiles');

    // Create Meals for Mario's Italian Kitchen
    const italianMeals = await Promise.all([
      prisma.meal.create({
        data: {
          name: 'Margherita Pizza',
          description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
          price: 12.99,
          image: '/meals/margherita-pizza.jpg',
          ingredients: 'Pizza dough, tomato sauce, mozzarella, fresh basil, olive oil',
          allergens: 'Gluten, Dairy',
          prepTime: 20,
          categoryId: categories[0].id,
          providerId: providerProfiles[0].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Spaghetti Carbonara',
          description: 'Creamy pasta with bacon and parmesan cheese',
          price: 14.99,
          image: '/meals/spaghetti-carbonara.jpg',
          ingredients: 'Spaghetti, eggs, bacon, parmesan, black pepper',
          allergens: 'Gluten, Dairy, Eggs',
          prepTime: 25,
          categoryId: categories[0].id,
          providerId: providerProfiles[0].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Tiramisu',
          description: 'Classic Italian dessert with coffee and mascarpone',
          price: 6.99,
          image: '/meals/tiramisu.jpg',
          ingredients: 'Ladyfingers, coffee, eggs, sugar, mascarpone cheese, cocoa',
          allergens: 'Gluten, Dairy, Eggs',
          prepTime: 5,
          categoryId: categories[0].id,
          providerId: providerProfiles[0].id
        }
      })
    ]);

    // Create Meals for Chen Chinese Restaurant
    const chineseMeals = await Promise.all([
      prisma.meal.create({
        data: {
          name: 'Kung Pao Chicken',
          description: 'Spicy stir-fried chicken with vegetables',
          price: 11.99,
          image: '/meals/kung-pao-chicken.jpg',
          ingredients: 'Chicken breast, bell peppers, onions, soy sauce, ginger, garlic',
          allergens: 'Soy',
          prepTime: 15,
          categoryId: categories[1].id,
          providerId: providerProfiles[1].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Beef Chow Mein',
          description: 'Stir-fried noodles with tender beef strips',
          price: 10.99,
          image: '/meals/beef-chow-mein.jpg',
          ingredients: 'Beef, egg noodles, soy sauce, vegetables, sesame oil',
          allergens: 'Soy, Gluten, Eggs',
          prepTime: 18,
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
          ingredients: 'Cabbage, carrots, bean sprouts, rice paper, chili sauce',
          allergens: 'Gluten',
          prepTime: 12,
          categoryId: categories[1].id,
          providerId: providerProfiles[1].id
        }
      })
    ]);

    // Create Meals for Carlos Mexican Cantina
    const mexicanMeals = await Promise.all([
      prisma.meal.create({
        data: {
          name: 'Beef Tacos',
          description: 'Three seasoned beef tacos with fresh salsa',
          price: 9.99,
          image: '/meals/beef-tacos.jpg',
          ingredients: 'Beef, corn tortillas, lettuce, tomatoes, onions, cilantro, salsa',
          allergens: 'Gluten',
          prepTime: 15,
          categoryId: categories[2].id,
          providerId: providerProfiles[2].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Chicken Burrito',
          description: 'Grilled chicken burrito with rice and beans',
          price: 11.99,
          image: '/meals/chicken-burrito.jpg',
          ingredients: 'Chicken, rice, beans, cheese, tortilla, sour cream',
          allergens: 'Dairy, Gluten',
          prepTime: 20,
          categoryId: categories[2].id,
          providerId: providerProfiles[2].id
        }
      }),
      prisma.meal.create({
        data: {
          name: 'Quesadilla',
          description: 'Crispy tortilla with melted cheese and jalapeños',
          price: 8.99,
          image: '/meals/quesadilla.jpg',
          ingredients: 'Flour tortilla, cheese, jalapeños, onions',
          allergens: 'Dairy, Gluten',
          prepTime: 10,
          categoryId: categories[2].id,
          providerId: providerProfiles[2].id
        }
      })
    ]);

    console.log('🍽️ Created meals');

    // Create Sample Orders
    const orders = await Promise.all([
      prisma.order.create({
        data: {
          orderNumber: 'ORD-001',
          customerId: customers[0].id,
          providerId: providerProfiles[0].id,
          status: 'DELIVERED',
          totalAmount: 25.98,
          deliveryAddress: '123 Main St, City, State',
          deliveryPhone: '+1234567890',
          specialInstructions: 'Extra napkins please'
        }
      }),
      prisma.order.create({
        data: {
          orderNumber: 'ORD-002',
          customerId: customers[1].id,
          providerId: providerProfiles[1].id,
          status: 'PREPARING',
          totalAmount: 22.98,
          deliveryAddress: '456 Oak Ave, Town, State',
          deliveryPhone: '+0987654321'
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
      })
    ]);

    console.log('🛒 Created order items');

    // Create Reviews
    await Promise.all([
      prisma.review.create({
        data: {
          customerId: customers[0].id,
          mealId: italianMeals[0].id,
          rating: 5,
          comment: 'Best pizza I\'ve ever had! Fresh ingredients and perfect crust.'
        }
      }),
      prisma.review.create({
        data: {
          customerId: customers[1].id,
          mealId: chineseMeals[0].id,
          rating: 4,
          comment: 'Very flavorful and spicy! Good portion size.'
        }
      }),
      prisma.review.create({
        data: {
          customerId: customers[2].id,
          mealId: mexicanMeals[0].id,
          rating: 5,
          comment: 'Authentic Mexican flavors! Tacos were perfectly seasoned.'
        }
      })
    ]);

    console.log('⭐ Created reviews');

    console.log('✅ Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${customers.length} customers`);
    console.log(`   - ${providers.length} providers`);
    console.log(`   - ${italianMeals.length + chineseMeals.length + mexicanMeals.length} meals`);
    console.log(`   - ${orders.length} orders`);
    console.log(`   - 3 reviews`);

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
