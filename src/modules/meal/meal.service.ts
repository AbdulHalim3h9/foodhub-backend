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
    isVegan
}: {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string,
    category?: string,
    priceMin?: string,
    priceMax?: string,
    search?: string,
    cuisine?: string,
    isVegan?: string
}) => {
    const where: any = {
        isAvailable: true
    };

    // Apply filters
    if (category) {
        where.category = {
            name: { contains: category, mode: 'insensitive' }
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
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { ingredients: { contains: search, mode: 'insensitive' } }
        ];
    }

    if (cuisine) {
        where.cuisine = { contains: cuisine, mode: 'insensitive' };
    }

    if (isVegan !== undefined) {
        where.isVegan = isVegan === 'true';
    }

    const meals = await prisma.meal.findMany({
        take: limit,
        skip,
        where,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true
                }
            },
            provider: {
                select: {
                    id: true,
                    businessName: true,
                    phone: true,
                    address: true,
                    isActive: true
                }
            },
            _count: {
                select: {
                    reviews: true
                }
            }
        }
    });

    // Calculate average rating for each meal
    const mealsWithRatings = await Promise.all(
        meals.map(async (meal) => {
            const reviews = await prisma.review.findMany({
                where: { mealId: meal.id },
                select: { rating: true }
            });

            const avgRating = reviews.length > 0 
                ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
                : 0;

            return {
                ...meal,
                avgRating: parseFloat(avgRating.toFixed(1)),
                reviewCount: reviews.length
            };
        })
    );

    const total = await prisma.meal.count({ where });

    return {
        data: mealsWithRatings,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getMealById = async (mealId: string) => {
    const meal = await prisma.meal.findFirst({
        where: {
            id: mealId,
            isAvailable: true
        },
        include: {
            category: {
                select: {
                    id: true,
                    name: true,
                    description: true
                }
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
                            image: true
                        }
                    }
                }
            },
            reviews: {
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            image: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 10 // Limit to recent 10 reviews
            }
        }
    });

    if (!meal) {
        throw new Error("Meal not found or not available!");
    }

    // Calculate rating summary
    const allReviews = await prisma.review.findMany({
        where: { mealId: mealId },
        select: { rating: true }
    });

    const avgRating = allReviews.length > 0 
        ? allReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / allReviews.length 
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
            1: ratingCounts[1] || 0
        }
    };

    return {
        ...meal,
        ratingSummary
    };
}

export const mealService = {
    getAllMeals,
    getMealById
}
