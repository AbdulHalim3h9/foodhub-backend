// Public / Customer facing
// GET /api/meals - List meals (support filters: ?category= &priceMin= &priceMax= &search= &sort=)
// GET /api/meals/:id - Get single meal details + reviews summary

// Provider / Admin (authenticated)
// POST /api/meals - Create new meal (provider/admin only)
// PUT /api/meals/:id - Update meal (provider/admin only)
// DELETE /api/meals/:id - Delete meal (provider/admin only)

import express, { Router } from 'express';
import { mealController } from './meal.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

// Public routes
router.get(
    "/",
    mealController.getAllMeals
)

router.get(
    "/:mealId",
    mealController.getMealById
)

// Protected routes (Provider/Admin only)
router.post(
    "/",
    auth(UserRole.PROVIDER, UserRole.ADMIN),
    mealController.createMeal
)

router.put(
    "/:mealId",
    auth(UserRole.PROVIDER, UserRole.ADMIN),
    mealController.updateMeal
)

router.delete(
    "/:mealId",
    auth(UserRole.PROVIDER, UserRole.ADMIN),
    mealController.deleteMeal
)

export const mealRouter: Router = router;
