// Category service - Public category listing and CRUD for admin
import { prisma } from "../../lib/prisma";

const getAllCategories = async ({
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
  search,
  isActive,
}: {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
  search?: string;
  isActive?: boolean;
}) => {
  const where: any = {};

  // Apply filters
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: search,
          mode: "insensitive",
        },
      },
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

  const total = await prisma.category.count({ where });

  return {
    data: categories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          meals: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const createCategory = async (data: {
  name: string;
  description?: string;
  image?: string;
}) => {
  // Check if category with same name already exists
  const existingCategory = await prisma.category.findUnique({
    where: { name: data.name },
  });

  if (existingCategory) {
    throw new Error("Category with this name already exists");
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      description: data.description,
      image: data.image,
    },
    include: {
      _count: {
        select: {
          meals: true,
        },
      },
    },
  });

  return category;
};

const updateCategory = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  }
) => {
  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  // If updating name, check for duplicates
  if (data.name && data.name !== existingCategory.name) {
    const duplicateCategory = await prisma.category.findUnique({
      where: { name: data.name },
    });

    if (duplicateCategory) {
      throw new Error("Category with this name already exists");
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data,
    include: {
      _count: {
        select: {
          meals: true,
        },
      },
    },
  });

  return category;
};

const deleteCategory = async (id: string) => {
  // Check if category exists
  const existingCategory = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          meals: true,
        },
      },
    },
  });

  if (!existingCategory) {
    throw new Error("Category not found");
  }

  // Check if category has meals
  if (existingCategory._count.meals > 0) {
    throw new Error("Cannot delete category with associated meals");
  }

  await prisma.category.delete({
    where: { id },
  });

  return { message: "Category deleted successfully" };
};

export const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
