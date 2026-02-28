// Provider service - Provider-specific actions: menu management, order handling dashboard
import { prisma } from "../../lib/prisma";

const createProviderProfile = async (providerData: {
    userId: string;
    businessName: string;
    description?: string;
    phone: string;
    address: string;
    website?: string;
    cuisine?: string;
    deliveryRadius?: number;
    openingHours?: string;
}) => {
    try {
        const providerProfile = await prisma.providerProfile.create({
            data: {
                userId: providerData.userId,
                businessName: providerData.businessName,
                description: providerData.description || "",
                phone: providerData.phone,
                address: providerData.address,
                isActive: true,
            },
        });

        return { success: true, data: providerProfile };
    } catch (error) {
        console.error("Error creating provider profile:", error);
        return { success: false, error: "Failed to create provider profile" };
    }
};

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
    cuisineId?: string;
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

    // Verify category exists (admin-managed)
    const category = await prisma.category.findFirst({
        where: {
            id: mealData.categoryId,
            isActive: true
        }
    });

    if (!category) {
        throw new Error("Category not found or inactive!");
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
            cuisineId: mealData.cuisineId || null,
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

    return {
        ...provider,
        meals: [], // Return empty array for now since meals relation was removed
        overallRating: 0,
        totalReviews: 0
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
    cuisineId?: string;
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

    // If updating category, verify it exists (admin-managed)
    if (mealData.categoryId && mealData.categoryId !== existingMeal.categoryId) {
        const category = await prisma.category.findFirst({
            where: {
                id: mealData.categoryId,
                isActive: true
            }
        });

        if (!category) {
            throw new Error("Category not found or inactive!");
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
            ...(mealData.cuisineId !== undefined && { cuisineId: mealData.cuisineId }),
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
    const ordersCount = await prisma.order.count({
        where: {
            mealId: mealId
        }
    });

    if (ordersCount > 0) {
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
    createProviderProfile,
    createMenuItem,
    getProviderById,
    updateMenuItem,
    deleteMenuItem
}
