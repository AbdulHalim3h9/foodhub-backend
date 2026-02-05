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

export const adminService = {
    getAllUsers,
    updateUser
}
