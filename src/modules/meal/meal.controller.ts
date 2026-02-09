// Meal controller - Meal listing (public + filtered), single meal, provider CRUD on own meals
import type { NextFunction, Request, Response } from "express";
import { mealService } from "./meal.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllMeals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
        
        // Extract additional filters
        const { category, priceMin, priceMax, search, cuisine, isVegan } = req.query as {
            category?: string;
            priceMin?: string;
            priceMax?: string;
            search?: string;
            cuisine?: string;
            isVegan?: string;
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
            ...(isVegan && { isVegan })
        })
        
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const getMealById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mealId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            })
        }

        const result = await mealService.getMealById(mealId)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

export const mealController = {
    getAllMeals,
    getMealById
}
