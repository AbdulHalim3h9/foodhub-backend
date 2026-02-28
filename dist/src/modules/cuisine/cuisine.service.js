"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cuisineService = void 0;
const prisma_1 = require("../../lib/prisma");
const getAllCuisines = async ({ page, limit, skip, sortBy, sortOrder, search, }) => {
    const where = {};
    if (search) {
        where.name = {
            contains: search,
            mode: "insensitive",
        };
    }
    const cuisines = await prisma_1.prisma.cuisine.findMany({
        take: limit,
        skip,
        where,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            _count: {
                select: {
                    meals: true,
                },
            },
        },
    });
    const total = await prisma_1.prisma.cuisine.count({ where });
    return {
        data: cuisines,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};
exports.cuisineService = {
    getAllCuisines,
};
//# sourceMappingURL=cuisine.service.js.map