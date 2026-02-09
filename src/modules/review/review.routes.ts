// Reviews Module

// GET /api/meals/:id/reviews - Get all reviews for a meal
// POST /api/meals/:id/reviews - Submit a review (after order delivered)
// PUT /api/meals/:id/reviews/:rid - Update own review
// DELETE /api/meals/:id/reviews/:rid - Delete own review

import express, { Router } from 'express';
import { reviewController } from './review.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

// Public route - get reviews for a meal
router.get(
    "/meals/:mealId/reviews",
    reviewController.getMealReviews
)

// Customer routes - manage own reviews
router.post(
    "/meals/:mealId/reviews",
    auth(UserRole.CUSTOMER),
    reviewController.createReview
)

router.put(
    "/meals/:mealId/reviews/:reviewId",
    auth(UserRole.CUSTOMER),
    reviewController.updateReview
)

router.delete(
    "/meals/:mealId/reviews/:reviewId",
    auth(UserRole.CUSTOMER),
    reviewController.deleteReview
)

export const reviewRouter: Router = router;
