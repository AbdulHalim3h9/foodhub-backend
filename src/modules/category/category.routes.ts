// Categories Module

// GET /api/categories - List all categories (public – used in filters, dropdowns)

import express, { Router } from 'express';
import { categoryController } from './category.controller';

const router = express.Router();

// Public routes
router.get(
    "/",
    categoryController.getAllCategories
)

export const categoryRouter: Router = router;

