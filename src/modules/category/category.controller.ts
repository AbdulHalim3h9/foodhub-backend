// Category controller - List categories (public), CRUD for admin
import type { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined

        // true or false
        const isActive = req.query.isActive
            ? req.query.isActive === 'true'
                ? true
                : req.query.isActive === 'false'
                    ? false
                    : undefined
            : undefined

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

        const params: any = {
            page, 
            limit, 
            skip, 
            sortBy, 
            sortOrder 
        }

        if (searchString) {
            params.search = searchString
        }

        if (typeof isActive === 'boolean') {
            params.isActive = isActive
        }

        const result = await categoryService.getAllCategories(params)
        
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await categoryService.createCategory(req.body)
        res.status(201).json({
            success: true,
            message: "Category created successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId || typeof categoryId !== 'string') {
            return res.status(400).json({
                error: "Valid category ID is required!"
            })
        }
        const result = await categoryService.updateCategory(categoryId, req.body)
        res.status(200).json({
            success: true,
            message: "Category updated successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { categoryId } = req.params;
        if (!categoryId || typeof categoryId !== 'string') {
            return res.status(400).json({
                error: "Valid category ID is required!"
            })
        }
        const result = await categoryService.deleteCategory(categoryId)
        res.status(200).json({
            success: true,
            message: "Category deleted successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export const categoryController = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
