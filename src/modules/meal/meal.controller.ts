// Meal controller - Meal listing (public + filtered), single meal, provider CRUD on own meals
import type { NextFunction, Request, Response } from "express";
import { mealService } from "./meal.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllMeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query,
    );

    // Extract additional filters
    const { category, priceMin, priceMax, search, cuisine } = req.query as {
      category?: string;
      priceMin?: string;
      priceMax?: string;
      search?: string;
      cuisine?: string;
    };

    const result = await mealService.getAllMeals({
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
      ...(category && { category }),
      ...(priceMin && { priceMin }),
      ...(priceMax && { priceMax }),
      ...(search && { search }),
      ...(cuisine && { cuisine }),
    });

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const getMealById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mealId } = req.params;
    if (!mealId || typeof mealId !== "string") {
      return res.status(400).json({
        error: "Valid meal ID is required!",
      });
    }

    const result = await mealService.getMealById(mealId);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const createMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({
        error: "Authentication required!",
      });
    }

    const {
      name,
      description,
      price,
      image,
      ingredients,
      allergens,
      prepTime,
      cuisineId,
      isFeatured,
      categoryId,
    } = req.body;

    // Validate required fields
    if (!name || !price || !categoryId) {
      return res.status(400).json({
        error: "Name, price, and category are required!",
      });
    }

    // Get the provider profile for this user
    const { prisma } = await import("../../lib/prisma");
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!providerProfile) {
      return res.status(403).json({
        error: "Provider profile not found! Please apply for provider status first.",
      });
    }

    if (!providerProfile.isActive) {
      return res.status(403).json({
        error: "Provider profile is not active! Please wait for admin approval.",
      });
    }

    const mealData = {
      name,
      description: description || null,
      price: parseFloat(price),
      image: image || null,
      ingredients: ingredients || null,
      allergens: allergens || null,
      prepTime: prepTime ? parseInt(prepTime) : null,
      cuisineId: cuisineId || null,
      isFeatured: isFeatured || false,
      categoryId,
      providerId: providerProfile.id, // Use ProviderProfile id, not User id
    };

    const result = await mealService.createMeal(mealData);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const updateMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { mealId } = req.params;

    if (!user || !user.id) {
      return res.status(401).json({
        error: "Authentication required!",
      });
    }

    if (!mealId || typeof mealId !== "string") {
      return res.status(400).json({
        error: "Valid meal ID is required!",
      });
    }

    // Get the provider profile for this user
    const { prisma } = await import("../../lib/prisma");
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!providerProfile) {
      return res.status(403).json({
        error: "Provider profile not found! Please apply for provider status first.",
      });
    }

    const updateData = req.body;
    
    // Convert price and prepTime if provided
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }
    if (updateData.prepTime) {
      updateData.prepTime = parseInt(updateData.prepTime);
    }

    const result = await mealService.updateMeal(mealId, updateData, providerProfile.id);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

const deleteMeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { mealId } = req.params;

    if (!user || !user.id) {
      return res.status(401).json({
        error: "Authentication required!",
      });
    }

    if (!mealId || typeof mealId !== "string") {
      return res.status(400).json({
        error: "Valid meal ID is required!",
      });
    }

    // Get the provider profile for this user
    const { prisma } = await import("../../lib/prisma");
    const providerProfile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
    });

    if (!providerProfile) {
      return res.status(403).json({
        error: "Provider profile not found! Please apply for provider status first.",
      });
    }

    const result = await mealService.deleteMeal(mealId, providerProfile.id);
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const mealController = {
  getAllMeals,
  getMealById,
  createMeal,
  updateMeal,
  deleteMeal,
};
