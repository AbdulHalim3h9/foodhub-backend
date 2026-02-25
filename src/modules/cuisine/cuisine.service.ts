import { prisma } from "../../lib/prisma";

const getAllCuisines = async ({
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
  search,
}: {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
  search?: string;
}) => {
  const where: any = {};

  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  const cuisines = await prisma.cuisine.findMany({
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

  const total = await prisma.cuisine.count({ where });

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

export const cuisineService = {
  getAllCuisines,
};
