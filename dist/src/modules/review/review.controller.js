"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const review_service_1 = require("./review.service");
const paginationSortingHelper_1 = __importDefault(require("../../helpers/paginationSortingHelper"));
const getMealReviews = async (req, res, next) => {
    try {
        const { mealId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            });
        }
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        const result = await review_service_1.reviewService.getMealReviews({
            mealId,
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        });
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const createReview = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { mealId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            });
        }
        const result = await review_service_1.reviewService.createReview(user.id, mealId, req.body);
        res.status(201).json({
            success: true,
            message: "Review submitted successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const updateReview = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { mealId, reviewId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            });
        }
        if (!reviewId || typeof reviewId !== 'string') {
            return res.status(400).json({
                error: "Valid review ID is required!"
            });
        }
        const result = await review_service_1.reviewService.updateReview(user.id, reviewId, req.body);
        res.status(200).json({
            success: true,
            message: "Review updated successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const deleteReview = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { mealId, reviewId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            });
        }
        if (!reviewId || typeof reviewId !== 'string') {
            return res.status(400).json({
                error: "Valid review ID is required!"
            });
        }
        const result = await review_service_1.reviewService.deleteReview(user.id, reviewId);
        res.status(200).json({
            success: true,
            message: "Review deleted successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
exports.reviewController = {
    getMealReviews,
    createReview,
    updateReview,
    deleteReview
};
//# sourceMappingURL=review.controller.js.map