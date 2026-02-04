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

export const providerService = {
    getAllProviders,
    createMenuItem
}
