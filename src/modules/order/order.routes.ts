// Orders Module

// Customer
// POST /api/orders - Create order (send cart items + delivery address + payment info)
// GET /api/orders - List my orders
// GET /api/orders/:id - Get order details

// Admin
// GET /api/orders/admin - View all orders platform-wide
// PATCH /api/orders/:orderId/status - Update order status

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
    "/provider/orders",
    auth(UserRole.PROVIDER),
    orderController.getProviderOrders
)

router.get(
    "/all",
    (req, res, next) => {
        console.log("Getting all orders");
        next();
    },
    auth(UserRole.ADMIN, UserRole.PROVIDER),
    orderController.getAllOrders
)

router.get(
    "/:orderId",
    auth(UserRole.CUSTOMER),
    orderController.getOrderById
)

router.patch(
    "/:orderId/status",
    auth(UserRole.ADMIN, UserRole.PROVIDER),
    orderController.updateOrderStatus
)

export const orderRouter: Router = router;
