// Meal service - Meal listing (public + filtered), single meal, provider CRUD on own meals
import { prisma } from "../../lib/prisma";
// Get meals for specific provider (for provider dashboard)
const getProviderMeals = async ({ page, limit, skip, sortBy, sortOrder, category, categoryIds, priceMin, priceMax, search, cuisine, providerId, }) => {
    const where = {
        providerId: providerId, // Only show this provider's meals
    };
    // Apply filters
    if (category) {
        where.category = {
            name: { contains: category, mode: "insensitive" },
        };
    }
    if (categoryIds) {
        const categoryIdArray = categoryIds.split(',').filter(id => id.trim());
        if (categoryIdArray.length > 0) {
            where.categoryId = {
                in: categoryIdArray
            };
        }
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
    // Don't filter by isAvailable for provider dashboard (show all meals)
    // Remove this line to show inactive meals too
    // where.isAvailable = true;
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
    const mealsWithRatings = await Promise.all(meals.map(async (meal) => {
        const reviews = await prisma.review.findMany({
            where: { mealId: meal.id },
            select: { rating: true },
        });
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;
        return {
            ...meal,
            avgRating: parseFloat(avgRating.toFixed(1)),
            reviewCount: reviews.length,
        };
    }));
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
const getAllMeals = async ({ page, limit, skip, sortBy, sortOrder, category, categoryIds, priceMin, priceMax, search, cuisine, }) => {
    const where = {};
    // Apply filters
    if (category) {
        where.category = {
            name: { contains: category, mode: "insensitive" },
        };
    }
    if (categoryIds) {
        const categoryIdArray = categoryIds.split(',').filter(id => id.trim());
        if (categoryIdArray.length > 0) {
            where.categoryId = {
                in: categoryIdArray
            };
        }
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
    // Only show meals whose category is active, OR meals with no category
    // (categoryId is optional, so allow uncategorized meals to be visible)
    where.OR = [
        ...(where.OR ?? []),
        { category: { is: { isActive: true } } },
        { categoryId: null },
    ];
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
    const mealsWithRatings = await Promise.all(meals.map(async (meal) => {
        const reviews = await prisma.review.findMany({
            where: { mealId: meal.id },
            select: { rating: true },
        });
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;
        return {
            ...meal,
            avgRating: parseFloat(avgRating.toFixed(1)),
            reviewCount: reviews.length,
        };
    }));
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
const getMealById = async (mealId) => {
    const meal = await prisma.meal.findUnique({
        where: { id: mealId },
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
    const avgRating = allReviews.length > 0
        ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length
        : 0;
    const ratingCounts = allReviews.reduce((acc, review) => {
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
const createMeal = async (mealData) => {
    console.log("🔧 [MEAL SERVICE] Starting meal creation in service layer");
    console.log("📋 [MEAL SERVICE] Meal data received:", {
        name: mealData.name,
        description: mealData.description,
        price: mealData.price,
        image: mealData.image,
        ingredients: mealData.ingredients,
        allergens: mealData.allergens,
        prepTime: mealData.prepTime,
        cuisineId: mealData.cuisineId,
        isFeatured: mealData.isFeatured,
        categoryId: mealData.categoryId,
        providerId: mealData.providerId,
    });
    // Verify category exists if categoryId is provided
    if (mealData.categoryId) {
        console.log(`🔍 [MEAL SERVICE] Verifying category exists: ${mealData.categoryId}`);
        const category = await prisma.category.findUnique({
            where: { id: mealData.categoryId },
        });
        if (!category) {
            console.log(`❌ [MEAL SERVICE] Category not found: ${mealData.categoryId}`);
            throw new Error("Category not found!");
        }
        console.log(`✅ [MEAL SERVICE] Category found: ${category.name} (${category.id})`);
    }
    // Verify cuisine exists if provided
    if (mealData.cuisineId) {
        console.log(`🔍 [MEAL SERVICE] Verifying cuisine exists: ${mealData.cuisineId}`);
        const cuisine = await prisma.cuisine.findUnique({
            where: { id: mealData.cuisineId },
        });
        if (!cuisine) {
            console.log(`❌ [MEAL SERVICE] Cuisine not found: ${mealData.cuisineId}`);
            throw new Error("Cuisine not found!");
        }
        console.log(`✅ [MEAL SERVICE] Cuisine found: ${cuisine.name} (${cuisine.id})`);
    }
    else {
        console.log("ℹ️ [MEAL SERVICE] No cuisine ID provided - skipping cuisine verification");
    }
    // Create meal
    console.log("🍳 [MEAL SERVICE] Creating meal in database");
    try {
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
                categoryId: mealData.categoryId || null,
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
        console.log(`✅ [MEAL SERVICE] Meal created successfully in database:`, {
            mealId: meal.id,
            mealName: meal.name,
            price: meal.price,
            categoryName: meal.category?.name,
            providerName: meal.provider?.businessName,
            isFeatured: meal.isFeatured,
        });
        return {
            ...meal,
            categoryName: meal.category?.name,
            providerName: meal.provider?.businessName,
            isFeatured: meal.isFeatured,
        };
    }
    catch (dbError) {
        console.error("💥 [MEAL SERVICE] Database error during meal creation:", dbError);
        throw dbError;
    }
};
const updateMeal = async (mealId, updateData, providerProfileId) => {
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
const deleteMeal = async (mealId, providerProfileId) => {
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
    const orderCount = await prisma.order.count({
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
    getProviderMeals,
    getMealById,
    createMeal,
    updateMeal,
    deleteMeal,
};
//# sourceMappingURL=meal.service.js.map