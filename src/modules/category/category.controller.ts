// Category controller - List categories (public), CRUD for admin
import type { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;

    // true or false
    const isActive = req.query.isActive
      ? req.query.isActive === "true"
        ? true
        : req.query.isActive === "false"
          ? false
          : undefined
      : undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    const params: any = {
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    };

    if (searchString) {
      params.search = searchString;
    }

    if (typeof isActive === "boolean") {
      params.isActive = isActive;
    }

    const result = await categoryService.getAllCategories(params);

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    res.status(200).json(category);
  } catch (e) {
    next(e);
  }
};

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, description, image } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await categoryService.createCategory({
      name: name.trim(),
      description: description?.trim(),
      image: image?.trim(),
    });

    res.status(201).json(category);
  } catch (e) {
    next(e);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    const updateData: any = {};
    
    if (name !== undefined) {
      if (!name || name.trim() === '') {
        return res.status(400).json({ message: "Category name cannot be empty" });
      }
      updateData.name = name.trim();
    }
    
    if (description !== undefined) {
      updateData.description = description?.trim();
    }
    
    if (image !== undefined) {
      updateData.image = image?.trim();
    }
    
    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    const category = await categoryService.updateCategory(id, updateData);
    res.status(200).json(category);
  } catch (e) {
    next(e);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategory(id);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const categoryController = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
