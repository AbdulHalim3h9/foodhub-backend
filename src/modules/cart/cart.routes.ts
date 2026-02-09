// GET /api/cart - Get current user's cart
// POST /api/cart/items - Add item to cart
// PUT /api/cart/items/:mealId - Update quantity
// DELETE /api/cart/items/:mealId - Remove item
// DELETE /api/cart - Clear entire cart

import express, { Router } from 'express';
import { cartController } from './cart.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get(
    "/",
    auth(UserRole.CUSTOMER),
    cartController.getCart
)

router.post(
    "/items",
    auth(UserRole.CUSTOMER),
    cartController.addItemToCart
)

router.put(
    "/items/:mealId",
    auth(UserRole.CUSTOMER),
    cartController.updateItemQuantity
)

router.delete(
    "/items/:mealId",
    auth(UserRole.CUSTOMER),
    cartController.removeItemFromCart
)

router.delete(
    "/",
    auth(UserRole.CUSTOMER),
    cartController.clearCart
)

export const cartRouter: Router = router;
