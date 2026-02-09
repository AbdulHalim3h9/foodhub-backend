// Public / Customer facing
// GET /api/meals - List meals (support filters: ?category= &priceMin= &priceMax= &search= &sort=)
// GET /api/meals/:id - Get single meal details + reviews summary

import express, { Router } from 'express';
import { mealController } from './meal.controller';

const router = express.Router();

router.get(
    "/",
    mealController.getAllMeals
)

router.get(
    "/:mealId",
    mealController.getMealById
)

export const mealRouter: Router = router;
