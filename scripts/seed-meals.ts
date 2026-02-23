import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🌱 Seeding meal data...");

  try {
    // 1. Create a Provider User
    const providerUser = await prisma.user.upsert({
      where: { email: "chef@foodhub.com" },
      update: {},
      create: {
        id: "provider_1",
        name: "Master Chef",
        email: "chef@foodhub.com",
        role: "PROVIDER",
        phone: "+1234567890",
        address: "123 Gourmet Way",
        status: "ACTIVE",
      },
    });

    console.log("✅ Provider user created/updated");

    // 2. Create Provider Profile
    const providerProfile = await prisma.providerProfile.upsert({
      where: { userId: providerUser.id },
      update: {},
      create: {
        userId: providerUser.id,
        businessName: "The Foodie Hub",
        description: "Quality meals from around the world",
        phone: "+1234567890",
        address: "123 Gourmet Way",
        logo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop",
      },
    });

    console.log("✅ Provider profile created/updated");

    // 3. Create Categories
    const categoriesData = [
      {
        name: "Italian",
        description: "Authentic pasta and pizzas",
        image:
          "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&h=300&fit=crop",
      },
      {
        name: "Asian",
        description: "Stir-fries and noodles",
        image:
          "https://images.unsplash.com/photo-1512058560366-9bb291363687?w=400&h=300&fit=crop",
      },
      {
        name: "Mexican",
        description: "Tacos and burritos",
        image:
          "https://images.unsplash.com/photo-1565299585323-38d6b0865597?w=400&h=300&fit=crop",
      },
      {
        name: "Fast Food",
        description: "Burgers and fries",
        image:
          "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop",
      },
    ];

    const categories = [];
    for (const cat of categoriesData) {
      const category = await prisma.category.upsert({
        where: { name: cat.name },
        update: { providerId: providerProfile.id }, // Ensure it's linked
        create: {
          ...cat,
          providerId: providerProfile.id,
        },
      });
      categories.push(category);
    }

    console.log(`✅ ${categories.length} categories created/updated`);

    // 4. Create Meals
    const mealsData = [
      {
        name: "Margherita Pizza",
        description:
          "Fresh mozzarella, basil, and San Marzano tomatoes on a hand-stretched crust.",
        price: 14.5,
        image:
          "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=800&h=600&fit=crop",
        ingredients:
          "Flour, Water, Yeast, Salt, Tomato Sauce, Mozzarella, Basil, Olive Oil",
        allergens: "Gluten, Dairy",
        prepTime: 20,
        cuisine: "Italian",
        isVegan: false,
        isFeatured: true,
        categoryName: "Italian",
      },
      {
        name: "Spaghetti Carbonara",
        description:
          "Creamy egg sauce with crispy pancetta, black pepper, and Pecorino Romano.",
        price: 16.95,
        image:
          "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop",
        ingredients: "Spaghetti, Eggs, Pancetta, Black Pepper, Cheese",
        allergens: "Gluten, Dairy, Eggs",
        prepTime: 15,
        cuisine: "Italian",
        isVegan: false,
        isFeatured: false,
        categoryName: "Italian",
      },
      {
        name: "Kung Pao Chicken",
        description:
          "Spicy stir-fried chicken with peanuts, vegetables, and chili peppers.",
        price: 13.99,
        image:
          "https://images.unsplash.com/photo-1525755662778-989d0b0981b9?w=800&h=600&fit=crop",
        ingredients: "Chicken, Peanuts, Bell Peppers, Onions, Chili, Soy Sauce",
        allergens: "Peanuts, Soy, Gluten",
        prepTime: 12,
        cuisine: "Chinese",
        isVegan: false,
        isFeatured: true,
        categoryName: "Asian",
      },
      {
        name: "Vegetable Pad Thai",
        description:
          "Classic rice noodles stir-fried with tofu, bean sprouts, and peanuts.",
        price: 12.5,
        image:
          "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
        ingredients:
          "Rice Noodles, Tofu, Bean Sprouts, Peanuts, Tamarind Sauce, Lime",
        allergens: "Peanuts, Soy",
        prepTime: 10,
        cuisine: "Thai",
        isVegan: true,
        isFeatured: false,
        categoryName: "Asian",
      },
      {
        name: "Steak Tacos",
        description:
          "Three grilled steak tacos topped with cilantro, onion, and fresh salsa.",
        price: 11.95,
        image:
          "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop",
        ingredients: "Corn Tortilla, Beef, Cilantro, Onion, Salsa, Lime",
        allergens: "None",
        prepTime: 15,
        cuisine: "Mexican",
        isVegan: false,
        isFeatured: true,
        categoryName: "Mexican",
      },
      {
        name: "Classic Cheeseburger",
        description:
          "Juicy beef patty with sharp cheddar, lettuce, tomato, and our secret sauce.",
        price: 10.99,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
        ingredients: "Beef, Bun, Cheese, Lettuce, Tomato, Onion, Special Sauce",
        allergens: "Gluten, Dairy",
        prepTime: 10,
        cuisine: "American",
        isVegan: false,
        isFeatured: false,
        categoryName: "Fast Food",
      },
    ];

    for (const meal of mealsData) {
      const category = categories.find((c) => c.name === meal.categoryName);
      if (!category) continue;

      await prisma.meal.upsert({
        where: { id: `meal_${meal.name.toLowerCase().replace(/\s+/g, "_")}` }, // Deterministic ID for upsert-like behavior
        update: {
          description: meal.description,
          price: meal.price,
          image: meal.image,
          ingredients: meal.ingredients,
          allergens: meal.allergens,
          prepTime: meal.prepTime,
          cuisine: meal.cuisine,
          isVegan: meal.isVegan,
          isFeatured: meal.isFeatured,
          categoryId: category.id,
          providerId: providerProfile.id,
        },
        create: {
          id: `meal_${meal.name.toLowerCase().replace(/\s+/g, "_")}`,
          name: meal.name,
          description: meal.description,
          price: meal.price,
          image: meal.image,
          ingredients: meal.ingredients,
          allergens: meal.allergens,
          prepTime: meal.prepTime,
          cuisine: meal.cuisine,
          isVegan: meal.isVegan,
          isFeatured: meal.isFeatured,
          categoryId: category.id,
          providerId: providerProfile.id,
        },
      });
    }

    console.log(`✅ ${mealsData.length} meals created/updated`);
    console.log("✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
