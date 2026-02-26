// Meal service - Meal listing (public + filtered), single meal, provider CRUD on own meals
import { prisma } from "../../lib/prisma";

const getAllMeals = async ({
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
  category,
  priceMin,
  priceMax,
  search,
  cuisine,
}: {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
  category?: string;
  priceMin?: string;
  priceMax?: string;
  search?: string;
  cuisine?: string;
}) => {
  const where: any = {};

  // Apply filters
  if (category) {
    where.category = {
      name: { contains: category, mode: "insensitive" },
    };
  }

  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) {
      where.price.gte = parseFloat(priceMin);
    }
    if (priceMax) {
      where.price.lte = parseFloat(priceMax);
    }
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { ingredients: { contains: search, mode: "insensitive" } },
    ];
  }

  if (cuisine) {
    where.cuisine = { contains: cuisine, mode: "insensitive" };
  }

  // Only show available meals
  where.isAvailable = true;

  const [meals, total] = await Promise.all([
    prisma.meal.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        provider: {
          select: {
            id: true,
            businessName: true,
            logo: true,
          },
        },
      },
    }),
    prisma.meal.count({ where }),
  ]);

  // Calculate average rating for each meal
  const mealsWithRatings = await Promise.all(
    meals.map(async (meal) => {
      const reviews = await prisma.review.findMany({
        where: { mealId: meal.id },
        select: { rating: true },
      });

      const avgRating =
        reviews.length > 0
          ? reviews.reduce(
              (sum: number, review: any) => sum + review.rating,
              0,
            ) / reviews.length
          : 0;

      return {
        ...meal,
        avgRating: parseFloat(avgRating.toFixed(1)),
        reviewCount: reviews.length,
      };
    }),
  );

  return {
    data: mealsWithRatings,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMealById = async (mealId: string) => {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId, isAvailable: true },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      provider: {
        select: {
          id: true,
          businessName: true,
          phone: true,
          address: true,
          isActive: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      reviews: {
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10, // Limit to recent 10 reviews
      },
    },
  });

  if (!meal) {
    throw new Error("Meal not found or not available!");
  }

  // Calculate rating summary
  const allReviews = await prisma.review.findMany({
    where: { mealId: mealId },
    select: { rating: true },
  });

  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce(
          (sum: number, review: any) => sum + review.rating,
          0,
        ) / allReviews.length
      : 0;

  const ratingCounts = allReviews.reduce((acc: any, review: any) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const ratingSummary = {
    average: parseFloat(avgRating.toFixed(1)),
    totalReviews: allReviews.length,
    distribution: {
      5: ratingCounts[5] || 0,
      4: ratingCounts[4] || 0,
      3: ratingCounts[3] || 0,
      2: ratingCounts[2] || 0,
      1: ratingCounts[1] || 0,
    },
  };

  return {
    ...meal,
    ratingSummary,
  };
};

const createMeal = async (mealData: {
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  ingredients: string | null;
  allergens: string | null;
  prepTime: number | null;
  cuisineId: string | null;
  isFeatured: boolean;
  categoryId: string;
  providerId: string;
}) => {
  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: mealData.categoryId },
  });

  if (!category) {
    throw new Error("Category not found!");
  }

  // Verify cuisine exists if provided
  if (mealData.cuisineId) {
    const cuisine = await prisma.cuisine.findUnique({
      where: { id: mealData.cuisineId },
    });

    if (!cuisine) {
      throw new Error("Cuisine not found!");
    }
  }

  // Create meal
  const meal = await prisma.meal.create({
    data: {
      name: mealData.name,
      description: mealData.description,
      price: mealData.price,
      image: mealData.image,
      ingredients: mealData.ingredients,
      allergens: mealData.allergens,
      prepTime: mealData.prepTime,
      cuisineId: mealData.cuisineId,
      isFeatured: mealData.isFeatured,
      isAvailable: true, // Default to available
      categoryId: mealData.categoryId,
      providerId: mealData.providerId,
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      provider: {
        select: {
          id: true,
          businessName: true,
          logo: true,
        },
      },
    },
  });

  return meal;
};

const updateMeal = async (
  mealId: string,
  updateData: any,
  providerProfileId: string
) => {
  // First check if meal exists and user owns it
  const existingMeal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!existingMeal) {
    throw new Error("Meal not found!");
  }

  if (existingMeal.providerId !== providerProfileId) {
    throw new Error("You can only update your own meals!");
  }

  // If categoryId is provided, verify it exists
  if (updateData.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: updateData.categoryId },
    });

    if (!category) {
      throw new Error("Category not found!");
    }
  }

  // Update meal
  const updatedMeal = await prisma.meal.update({
    where: { id: mealId },
    data: updateData,
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      provider: {
        select: {
          id: true,
          businessName: true,
          logo: true,
        },
      },
    },
  });

  return updatedMeal;
};

const deleteMeal = async (mealId: string, providerProfileId: string) => {
  // First check if meal exists and user owns it
  const existingMeal = await prisma.meal.findUnique({
    where: { id: mealId },
  });

  if (!existingMeal) {
    throw new Error("Meal not found!");
  }

  if (existingMeal.providerId !== providerProfileId) {
    throw new Error("You can only delete your own meals!");
  }

  // Check if meal has any orders
  const orderCount = await prisma.orderItem.count({
    where: { mealId },
  });

  if (orderCount > 0) {
    throw new Error("Cannot delete meal that has been ordered!");
  }

  // Delete meal
  await prisma.meal.delete({
    where: { id: mealId },
  });

  return { message: "Meal deleted successfully!" };
};

export const mealService = {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};
