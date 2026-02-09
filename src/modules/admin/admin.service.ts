// Admin service - Admin-only: manage users, view all orders, manage categories
import { prisma } from "../../lib/prisma";

const getAllUsers = async ({
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search,
    role,
    status
}: {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string,
    search?: string,
    role?: string,
    status?: string
}) => {
    const where: any = {};

    // Apply filters
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } }
        ];
    }

    if (role) {
        where.role = role;
    }

    if (status) {
        where.status = status;
    }

    const users = await prisma.user.findMany({
        take: limit,
        skip,
        where,
        orderBy: {
            [sortBy]: sortOrder
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            phone: true,
            status: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            providerProfile: {
                select: {
                    id: true,
                    businessName: true,
                    isActive: true,
                    createdAt: true
                }
            },
            _count: {
                select: {
                    orders: true,
                    reviews: true
                }
            }
        }
    });

    const total = await prisma.user.count({ where });

    return {
        data: users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const updateUser = async (userId: string, updateData: {
    name?: string;
    phone?: string;
    address?: string;
    role?: string;
    status?: string;
    isActive?: boolean;
}) => {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!existingUser) {
        throw new Error("User not found!");
    }

    // Validate role if provided
    if (updateData.role) {
        const validRoles = ['CUSTOMER', 'PROVIDER', 'ADMIN'];
        if (!validRoles.includes(updateData.role)) {
            throw new Error("Invalid role! Must be one of: CUSTOMER, PROVIDER, ADMIN");
        }
    }

    // Validate status if provided
    if (updateData.status) {
        const validStatuses = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];
        if (!validStatuses.includes(updateData.status)) {
            throw new Error("Invalid status! Must be one of: ACTIVE, INACTIVE, SUSPENDED");
        }
    }

    // Prepare update data with proper handling of optional fields
    const data: any = {};
    
    if (updateData.name !== undefined) data.name = updateData.name;
    if (updateData.phone !== undefined) data.phone = updateData.phone || null;
    if (updateData.address !== undefined) data.address = updateData.address || null;
    if (updateData.role !== undefined) data.role = updateData.role;
    if (updateData.status !== undefined) data.status = updateData.status;
    if (updateData.isActive !== undefined) data.isActive = updateData.isActive;

    const result = await prisma.user.update({
        where: { id: userId },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            phone: true,
            address: true,
            status: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            providerProfile: {
                select: {
                    id: true,
                    businessName: true,
                    isActive: true,
                    createdAt: true
                }
            }
        }
    });

    return result;
}

// Category management methods
const createCategory = async (categoryData: {
    name: string;
    description?: string;
    image?: string;
    providerId?: string;
    isActive?: boolean;
}) => {
    // Check if category with same name already exists for this provider
    if (categoryData.providerId) {
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: categoryData.name,
                providerId: categoryData.providerId
            }
        });

        if (existingCategory) {
            throw new Error("Category with this name already exists for this provider!");
        }
    }

    const result = await prisma.category.create({
        data: {
            name: categoryData.name,
            description: categoryData.description || null,
            image: categoryData.image || null,
            providerId: categoryData.providerId || "", // Empty string if no provider
            isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
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
                providerId: existingCategory.providerId
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
        }
    });

    if (!existingCategory) {
        throw new Error("Category not found!");
    }

    // Check if category has meals associated with it
    const mealsCount = await prisma.meal.count({
        where: {
            categoryId: categoryId
        }
    });

    if (mealsCount > 0) {
        throw new Error("Cannot delete category with associated meals!");
    }

    // Delete category
    const result = await prisma.category.delete({
        where: {
            id: categoryId
        }
    });

    return result;
}

const getAllCategories = async ({
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search,
    isActive,
    providerId
}: {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string,
    search?: string,
    isActive?: string,
    providerId?: string
}) => {
    const where: any = {};

    // Apply filters
    if (search) {
        where.OR = [
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
        ];
    }

    if (isActive !== undefined) {
        where.isActive = isActive === 'true';
    }

    if (providerId) {
        where.providerId = providerId;
    }

    const categories = await prisma.category.findMany({
        take: limit,
        skip,
        where,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            provider: {
                select: {
                    id: true,
                    businessName: true,
                    isActive: true
                }
            },
            _count: {
                select: {
                    meals: true
                }
            }
        }
    });

    const total = await prisma.category.count({ where });

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

export const adminService = {
    getAllUsers,
    updateUser,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategories
}
