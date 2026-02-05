// Orders Module

// Customer
// POST /api/orders - Create order (send cart items + delivery address + payment info)
// GET /api/orders - List my orders
// GET /api/orders/:id - Get order details

// Admin (optional but useful)
// GET /api/admin/orders - View all orders platform-wide

import express, { Router } from 'express';
import { orderController } from './order.controller';
import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

// Customer routes
router.post(
    "/",
    auth(UserRole.CUSTOMER),
    orderController.createOrder
)

router.get(
    "/",
    auth(UserRole.CUSTOMER),
    orderController.getMyOrders
)

router.get(
    "/:orderId",
    auth(UserRole.CUSTOMER),
    orderController.getOrderById
)

export const orderRouter: Router = router;
