"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryService = void 0;
// Category service - Public category listing
const prisma_1 = require("../../lib/prisma");
const getAllCategories = async ({ page, limit, skip, sortBy, sortOrder, search, isActive }) => {
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
        where.isActive = isActive;
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
exports.categoryService = {
    getAllCategories
};
//# sourceMappingURL=category.service.js.map