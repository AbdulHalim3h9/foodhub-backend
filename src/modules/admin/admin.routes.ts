// Admin Module

// GET /api/admin/users - List all users
// PATCH /api/admin/users/:id - Update user

// GET /api/admin/orders - All orders overview
// GET /api/admin/providers - List providers + status

// GET /api/admin/categories - List all categories
// POST /api/admin/categories - Create new category
// PUT /api/admin/categories/:id - Update category
// DELETE /api/admin/categories/:id - Delete category

// To Do
// PATCH /api/admin/providers/:id/approve - Approve user becoming a provider

import express, { Router } from 'express';
import { adminController } from './admin.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get(
    "/users",
    auth(UserRole.ADMIN),
    adminController.getAllUsers
)

router.patch(
    "/users/:userId",
    auth(UserRole.ADMIN),
    adminController.updateUser
)

// Provider management routes
router.get(
    "/providers",
    auth(UserRole.ADMIN),
    adminController.getAllProviders
)

// Category management routes
router.get(
    "/categories",
    auth(UserRole.ADMIN),
    adminController.getAllCategories
)

router.post(
    "/categories",
    auth(UserRole.ADMIN),
    adminController.createCategory
)

router.put(
    "/categories/:categoryId",
    auth(UserRole.ADMIN),
    adminController.updateCategory
)

router.delete(
    "/categories/:categoryId",
    auth(UserRole.ADMIN),
    adminController.deleteCategory
)

export const adminRouter: Router = router;
