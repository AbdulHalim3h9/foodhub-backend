// Categories Module

// GET /api/categories - List all categories (public – used in filters, dropdowns)

// Admin only:
// POST /api/admin/categories - Create new category
// PUT /api/admin/categories/:id - Update category
// DELETE /api/admin/categories/:id - Delete category

import express, { Router } from 'express';
import { categoryController } from './category.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

// Public routes
router.get(
    "/",
    categoryController.getAllCategories
)

// Admin routes
router.post(
    "/",
    auth(UserRole.ADMIN),
    categoryController.createCategory
)

router.put(
    "/:categoryId",
    auth(UserRole.ADMIN),
    categoryController.updateCategory
)

router.delete(
    "/:categoryId",
    auth(UserRole.ADMIN),
    categoryController.deleteCategory
)

export const categoryRouter: Router = router;

