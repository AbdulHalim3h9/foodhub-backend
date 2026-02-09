// Provider service - Provider-specific actions: menu management, order handling dashboard
import { prisma } from "../../lib/prisma";

const getAllProviders = async ({
    search,
    isActive,
    page,
    limit,
    skip,
    sortBy,
    sortOrder
}: {
    search?: string,
    isActive?: boolean,
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string
}) => {
    const andConditions: any[] = []

    if (search) {
        andConditions.push({
            OR: [
                {
                    businessName: {
                        contains: search,
                        mode: "insensitive"
                    }
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ]
        })
    }

    if (typeof isActive === 'boolean') {
        andConditions.push({
            isActive
        })
    }

    const providers = await prisma.providerProfile.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true
                }
            },
            _count: {
                select: { 
                    meals: true,
                    orders: true
                }
            }
        }
    });

    const total = await prisma.providerProfile.count({
        where: {
            AND: andConditions
        }
    })

    return {
        data: providers,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const createMenuItem = async (providerId: string, mealData: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    ingredients?: string;
    allergens?: string;
    prepTime?: number;
    cuisine?: string;
    isVegan?: boolean;
    categoryId: string;
}) => {
    // Verify provider exists and is active
    const provider = await prisma.providerProfile.findUnique({
        where: {
            id: providerId,
            isActive: true
        }
    });

    if (!provider) {
        throw new Error("Provider not found or inactive!");
    }

    // Verify category belongs to this provider
    const category = await prisma.category.findFirst({
        where: {
            id: mealData.categoryId,
            providerId
        }
    });

    if (!category) {
        throw new Error("Category not found or doesn't belong to this provider!");
    }

    // Create meal
    const result = await prisma.meal.create({
        data: {
            name: mealData.name,
            description: mealData.description || null,
            price: mealData.price,
            image: mealData.image || null,
            ingredients: mealData.ingredients || null,
            allergens: mealData.allergens || null,
            prepTime: mealData.prepTime || null,
            cuisine: mealData.cuisine || null,
            isVegan: mealData.isVegan || false,
            categoryId: mealData.categoryId,
            providerId
        }
    });

    return result;
}

const getProviderById = async (providerId: string) => {
    const provider = await prisma.providerProfile.findFirst({
        where: {
            id: providerId,
            isActive: true
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    createdAt: true
                }
            },
            meals: {
                where: {
                    isAvailable: true
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    _count: {
                        select: {
                            reviews: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            _count: {
                select: {
                    meals: true,
                    orders: true
                }
            }
        }
    });

    if (!provider) {
        throw new Error("Provider not found or inactive!");
    }

    // Calculate average rating for each meal
    const mealsWithRatings = await Promise.all(
        provider.meals.map(async (meal: any) => {
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

    // Calculate overall provider rating
    const allReviews = await prisma.review.findMany({
        where: { 
            meal: {
                providerId: providerId
            }
        },
        select: { rating: true }
    });

    const overallRating = allReviews.length > 0 
        ? allReviews.reduce((sum: number, review: any) => sum + review.rating, 0) / allReviews.length 
        : 0;

    return {
        ...provider,
        meals: mealsWithRatings,
        overallRating: parseFloat(overallRating.toFixed(1)),
        totalReviews: allReviews.length
    };
}

const updateMenuItem = async (providerId: string, mealId: string, mealData: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    ingredients?: string;
    allergens?: string;
    prepTime?: number;
    cuisine?: string;
    isVegan?: boolean;
    isAvailable?: boolean;
    categoryId?: string;
}) => {
    // Verify provider exists and is active
    const provider = await prisma.providerProfile.findUnique({
        where: {
            id: providerId,
            isActive: true
        }
    });

    if (!provider) {
        throw new Error("Provider not found or inactive!");
    }

    // Check if meal exists and belongs to this provider
    const existingMeal = await prisma.meal.findFirst({
        where: {
            id: mealId,
            providerId
        }
    });

    if (!existingMeal) {
        throw new Error("Meal not found or doesn't belong to this provider!");
    }

    // If updating category, verify it belongs to this provider
    if (mealData.categoryId && mealData.categoryId !== existingMeal.categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: mealData.categoryId,
                providerId
            }
        });

        if (!category) {
            throw new Error("Category not found or doesn't belong to this provider!");
        }
    }

    // Update meal
    const result = await prisma.meal.update({
        where: {
            id: mealId
        },
        data: {
            ...(mealData.name && { name: mealData.name }),
            ...(mealData.description !== undefined && { description: mealData.description }),
            ...(mealData.price !== undefined && { price: mealData.price }),
            ...(mealData.image !== undefined && { image: mealData.image }),
            ...(mealData.ingredients !== undefined && { ingredients: mealData.ingredients }),
            ...(mealData.allergens !== undefined && { allergens: mealData.allergens }),
            ...(mealData.prepTime !== undefined && { prepTime: mealData.prepTime }),
            ...(mealData.cuisine !== undefined && { cuisine: mealData.cuisine }),
            ...(mealData.isVegan !== undefined && { isVegan: mealData.isVegan }),
            ...(mealData.isAvailable !== undefined && { isAvailable: mealData.isAvailable }),
            ...(mealData.categoryId && { categoryId: mealData.categoryId })
        }
    });

    return result;
}

const deleteMenuItem = async (providerId: string, mealId: string) => {
    // Verify provider exists and is active
    const provider = await prisma.providerProfile.findUnique({
        where: {
            id: providerId,
            isActive: true
        }
    });

    if (!provider) {
        throw new Error("Provider not found or inactive!");
    }

    // Check if meal exists and belongs to this provider
    const existingMeal = await prisma.meal.findFirst({
        where: {
            id: mealId,
            providerId
        }
    });

    if (!existingMeal) {
        throw new Error("Meal not found or doesn't belong to this provider!");
    }

    // Check if meal has any orders
    const orderItemsCount = await prisma.orderItem.count({
        where: {
            mealId: mealId
        }
    });

    if (orderItemsCount > 0) {
        throw new Error("Cannot delete meal with existing orders!");
    }

    // Delete meal
    const result = await prisma.meal.delete({
        where: {
            id: mealId
        }
    });

    return result;
}

export const providerService = {
    getAllProviders,
    createMenuItem,
    getProviderById,
    updateMenuItem,
    deleteMenuItem
}
