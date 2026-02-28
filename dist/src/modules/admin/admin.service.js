"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
// Admin service - Admin-only: manage users, view all orders, manage categories
const prisma_1 = require("../../lib/prisma");
const getAllUsers = async ({ page, limit, skip, sortBy, sortOrder, search, role, status }) => {
    const where = {};
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
    const users = await prisma_1.prisma.user.findMany({
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
    const total = await prisma_1.prisma.user.count({ where });
    return {
        data: users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const updateUser = async (userId, updateData) => {
    // Check if user exists
    const existingUser = await prisma_1.prisma.user.findUnique({
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
    const data = {};
    if (updateData.name !== undefined)
        data.name = updateData.name;
    if (updateData.phone !== undefined)
        data.phone = updateData.phone || null;
    if (updateData.address !== undefined)
        data.address = updateData.address || null;
    if (updateData.role !== undefined)
        data.role = updateData.role;
    if (updateData.status !== undefined)
        data.status = updateData.status;
    if (updateData.isActive !== undefined)
        data.isActive = updateData.isActive;
    const result = await prisma_1.prisma.user.update({
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
};
// Category management methods
const createCategory = async (categoryData) => {
    // Check if category with same name already exists
    const existingCategory = await prisma_1.prisma.category.findFirst({
        where: {
            name: categoryData.name
        }
    });
    if (existingCategory) {
        throw new Error("Category with this name already exists!");
    }
    const result = await prisma_1.prisma.category.create({
        data: {
            name: categoryData.name,
            description: categoryData.description || null,
            image: categoryData.image || null,
            isActive: categoryData.isActive !== undefined ? categoryData.isActive : true
        }
    });
    return result;
};
const updateCategory = async (categoryId, categoryData) => {
    // Check if category exists
    const existingCategory = await prisma_1.prisma.category.findUnique({
        where: {
            id: categoryId
        }
    });
    if (!existingCategory) {
        throw new Error("Category not found!");
    }
    // If updating name, check for duplicates
    if (categoryData.name && categoryData.name !== existingCategory.name) {
        const duplicateCategory = await prisma_1.prisma.category.findFirst({
            where: {
                name: categoryData.name
            }
        });
        if (duplicateCategory) {
            throw new Error("Category with this name already exists!");
        }
    }
    const result = await prisma_1.prisma.category.update({
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
};
const deleteCategory = async (categoryId) => {
    // Check if category exists
    const existingCategory = await prisma_1.prisma.category.findUnique({
        where: {
            id: categoryId
        }
    });
    if (!existingCategory) {
        throw new Error("Category not found!");
    }
    // Check if category has meals associated with it
    const mealsCount = await prisma_1.prisma.meal.count({
        where: {
            categoryId: categoryId
        }
    });
    if (mealsCount > 0) {
        throw new Error("Cannot delete category with associated meals!");
    }
    // Delete category
    const result = await prisma_1.prisma.category.delete({
        where: {
            id: categoryId
        }
    });
    return result;
};
const getAllCategories = async ({ page, limit, skip, sortBy, sortOrder, search, isActive, providerId }) => {
    const where = {};
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
        // Filter categories that have meals from this provider
        const categoryIdsWithProviderMeals = await prisma_1.prisma.meal.findMany({
            where: { providerId },
            select: { categoryId: true }
        });
        const uniqueCategoryIds = [...new Set(categoryIdsWithProviderMeals.map(m => m.categoryId).filter(Boolean))];
        if (uniqueCategoryIds.length > 0) {
            where.id = { in: uniqueCategoryIds };
        }
        else {
            where.id = { in: [] }; // No categories for this provider
        }
    }
    const categories = await prisma_1.prisma.category.findMany({
        take: limit,
        skip,
        where,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            _count: {
                select: {
                    meals: true
                }
            }
        }
    });
    const total = await prisma_1.prisma.category.count({ where });
    return {
        data: categories,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const getAllProviders = async ({ page, limit, skip, sortBy, sortOrder, search, isActive, status }) => {
    const where = {};
    // Apply filters
    if (search) {
        where.OR = [
            {
                businessName: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                user: {
                    name: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            },
            {
                user: {
                    email: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            }
        ];
    }
    if (isActive !== undefined) {
        where.isActive = isActive === 'true';
    }
    if (status) {
        where.user = {
            status: status
        };
    }
    const providers = await prisma_1.prisma.providerProfile.findMany({
        take: limit,
        skip,
        where,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    status: true,
                    isActive: true,
                    createdAt: true
                }
            },
            _count: {
                select: {
                    meals: true
                }
            }
        }
    });
    const total = await prisma_1.prisma.providerProfile.count({ where });
    return {
        data: providers,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const deleteUser = async (userId) => {
    console.log("Backend: Attempting to delete user:", userId);
    // Check if user exists
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { id: userId }
    });
    if (!existingUser) {
        console.log("Backend: User not found:", userId);
        throw new Error("User not found!");
    }
    console.log("Backend: User exists:", existingUser.name);
    // Check if user has associated orders
    const ordersCount = await prisma_1.prisma.order.count({
        where: {
            customerId: userId
        }
    });
    console.log("Backend: User has", ordersCount, "orders");
    if (ordersCount > 0) {
        console.log("Backend: Cannot delete user with orders");
        throw new Error("Cannot delete user with associated orders!");
    }
    // Delete user
    console.log("Backend: Deleting user record:", userId);
    const result = await prisma_1.prisma.user.delete({
        where: { id: userId }
    });
    console.log("Backend: User deleted successfully:", userId);
    return result;
};
exports.adminService = {
    getAllUsers,
    updateUser,
    deleteUser,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllProviders,
    getAllCategories,
};
//# sourceMappingURL=admin.service.js.map