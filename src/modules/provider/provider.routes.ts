// Providers Module

// Public
// GET /api/providers - List all providers (with optional filters)
// GET /api/providers/:id - Get provider details + their active menu
// (own menu)
// POST /api/provider/menu - Create new menu item
// PUT /api/provider/menu/:id - Update own menu item
// DELETE /api/provider/menu/:id - Delete own menu item

// Provider
// GET /api/provider/orders - List incoming orders for this provider
// PATCH /api/provider/orders/:id - Update order status (accepted → preparing → ready → delivered)
// GET /api/provider/dashboard - List statistics for provider (orders, income)

import express, { Router } from 'express';
import { providerController } from './provider.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get(
    "/",
    providerController.getAllProviders
)

router.post(
    "/menu",
    auth(UserRole.PROVIDER),
    providerController.createMenuItem
)

export const providerRouter: Router = router;
