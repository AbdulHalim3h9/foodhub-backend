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

export const categoryController = {
    getAllCategories
}
