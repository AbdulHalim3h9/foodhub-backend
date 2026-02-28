"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const paginationSortingHelper_1 = __importDefault(require("../../helpers/paginationSortingHelper"));
const createOrder = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        console.log(req.body);
        const result = await order_service_1.orderService.createOrder(user.id, req.body);
        res.status(201).json({
            success: true,
            message: "Order created successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const getMyOrders = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        const result = await order_service_1.orderService.getMyOrders(user.id, {
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        });
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const getOrderById = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { orderId } = req.params;
        if (!orderId || typeof orderId !== 'string') {
            return res.status(400).json({
                error: "Valid order ID is required!"
            });
        }
        const result = await order_service_1.orderService.getOrderById(orderId, user.id);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const getProviderOrders = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        // Get provider profile for this user
        const { prisma } = await Promise.resolve().then(() => __importStar(require("../../lib/prisma")));
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId: user.id },
        });
        console.log(`🔍 [PROVIDER ORDERS] User ID: ${user.id}`);
        console.log(`🔍 [PROVIDER ORDERS] Provider profile:`, providerProfile);
        if (!providerProfile) {
            return res.status(403).json({
                error: "Provider profile not found!",
            });
        }
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        // Extract status filter
        const { status } = req.query;
        const result = await order_service_1.orderService.getProviderOrders(providerProfile.id, {
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(status && { status })
        });
        console.log(`🔍 [PROVIDER ORDERS] Final result:`, result);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
// Admin order management methods
const getAllOrders = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        // Extract additional filters
        const { search, status, customerId, providerId } = req.query;
        const result = await order_service_1.orderService.getAllOrders({
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(search && { search }),
            ...(status && { status }),
            ...(customerId && { customerId }),
            ...(providerId && { providerId })
        });
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const updateOrderStatus = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { orderId } = req.params;
        if (!orderId || typeof orderId !== 'string') {
            return res.status(400).json({
                error: "Valid order ID is required!"
            });
        }
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                error: "Status is required!"
            });
        }
        const result = await order_service_1.orderService.updateOrderStatus(orderId, status);
        res.status(200).json({
            success: true,
            message: "Order status updated successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
exports.orderController = {
    createOrder,
    getMyOrders,
    getProviderOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
//# sourceMappingURL=order.controller.js.map