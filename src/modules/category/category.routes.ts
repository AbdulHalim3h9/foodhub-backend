// Categories Module

// GET /api/categories - List all categories (public – used in filters, dropdowns)
// POST /api/categories - Create category (admin only)
// GET /api/categories/:id - Get category by ID (admin only)
// PUT /api/categories/:id - Update category (admin only)
// DELETE /api/categories/:id - Delete category (admin only)

import express, { Router } from "express";
import { categoryController } from "./category.controller";

const router = express.Router();

// Public routes
router.get("/", categoryController.getAllCategories);

// Admin routes (add auth middleware later)
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export const categoryRouter: Router = router;
