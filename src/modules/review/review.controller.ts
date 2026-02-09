// Review controller - Submit review, get reviews for a meal (post-order only)
import type { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getMealReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { mealId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            })
        }

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

        const result = await reviewService.getMealReviews({
            mealId,
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        })
        
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { mealId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            })
        }

        const result = await reviewService.createReview(user.id as string, mealId, req.body)
        res.status(201).json({
            success: true,
            message: "Review submitted successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { mealId, reviewId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            })
        }

        if (!reviewId || typeof reviewId !== 'string') {
            return res.status(400).json({
                error: "Valid review ID is required!"
            })
        }

        const result = await reviewService.updateReview(user.id as string, reviewId, req.body)
        res.status(200).json({
            success: true,
            message: "Review updated successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { mealId, reviewId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            })
        }

        if (!reviewId || typeof reviewId !== 'string') {
            return res.status(400).json({
                error: "Valid review ID is required!"
            })
        }

        const result = await reviewService.deleteReview(user.id as string, reviewId)
        res.status(200).json({
            success: true,
            message: "Review deleted successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export const reviewController = {
    getMealReviews,
    createReview,
    updateReview,
    deleteReview
}
