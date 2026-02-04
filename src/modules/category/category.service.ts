// Category service - List categories (public), CRUD for admin
import { prisma } from "../../lib/prisma";

const getAllCategories = async ({
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
                    name: {
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

    const categories = await prisma.category.findMany({
        take: limit,
        skip,
        where: {
            AND: andConditions
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            provider: {
                select: {
                    id: true,
                    businessName: true,
                    user: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            _count: {
                select: { 
                    meals: true
                }
            }
        }
    });

    const total = await prisma.category.count({
        where: {
            AND: andConditions
        }
    })

    return {
        data: categories,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const createCategory = async (categoryData: {
    name: string;
    description?: string;
    image?: string;
    providerId: string;
}) => {
    // Verify provider exists and is active
    const provider = await prisma.providerProfile.findUnique({
        where: {
            id: categoryData.providerId,
            isActive: true
        }
    });

    if (!provider) {
        throw new Error("Provider not found or inactive!");
    }

    // Check if category name already exists for this provider
    const existingCategory = await prisma.category.findFirst({
        where: {
            name: categoryData.name,
            providerId: categoryData.providerId
        }
    });

    if (existingCategory) {
        throw new Error("Category with this name already exists for this provider!");
    }

    const result = await prisma.category.create({
        data: {
            name: categoryData.name,
            description: categoryData.description || null,
            image: categoryData.image || null,
            providerId: categoryData.providerId
        }
    });

    return result;
}

const updateCategory = async (categoryId: string, categoryData: {
    name?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
}) => {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
        where: {
            id: categoryId
        }
    });

    if (!existingCategory) {
        throw new Error("Category not found!");
    }

    // If updating name, check for duplicates
    if (categoryData.name && categoryData.name !== existingCategory.name) {
        const duplicateCategory = await prisma.category.findFirst({
            where: {
                name: categoryData.name,
                providerId: existingCategory.providerId,
                id: { not: categoryId }
            }
        });

        if (duplicateCategory) {
            throw new Error("Category with this name already exists for this provider!");
        }
    }

    const result = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: {
            ...(categoryData.name && { name: categoryData.name }),
            ...(categoryData.description !== undefined && { description: categoryData.description }),
            ...(categoryData.image !== undefined && { image: categoryData.image }),
            ...(categoryData.isActive !== undefined && { isActive: categoryData.isActive })
        }
    });

    return result;
}

const deleteCategory = async (categoryId: string) => {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
        where: {
            id: categoryId
        },
        include: {
            _count: {
                select: {
                    meals: true
                }
            }
        }
    });

    if (!existingCategory) {
        throw new Error("Category not found!");
    }

    // Check if category has meals
    if (existingCategory._count.meals > 0) {
        throw new Error("Cannot delete category with existing meals. Please remove or reassign meals first.");
    }

    const result = await prisma.category.delete({
        where: {
            id: categoryId
        }
    });

    return result;
}

export const categoryService = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
