// Category service - Public category listing
import { prisma } from "../../lib/prisma";

const getAllCategories = async ({
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
    search,
    isActive
}: {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string,
    search?: string,
    isActive?: boolean
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
        where.isActive = isActive;
    }

    const categories = await prisma.category.findMany({
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

export const categoryService = {
    getAllCategories
}
