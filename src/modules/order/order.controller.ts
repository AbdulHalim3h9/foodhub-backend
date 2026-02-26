// Order controller - Create order, list my orders, get order details, update status (provider)
import type { NextFunction, Request, Response } from "express";
import { orderService } from "./order.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }
        console.log(req.body)
        const result = await orderService.createOrder(user.id as string, req.body)
        res.status(201).json({
            success: true,
            message: "Order created successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

        const result = await orderService.getMyOrders(user.id as string, {
            page, 
            limit, 
            skip, 
            sortBy, 
            sortOrder 
        })
        
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { orderId } = req.params;
        if (!orderId || typeof orderId !== 'string') {
            return res.status(400).json({
                error: "Valid order ID is required!"
            })
        }

        const result = await orderService.getOrderById(orderId, user.id as string)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

// Admin order management methods
const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
        
        // Extract additional filters
        const { search, status, customerId, providerId } = req.query as {
            search?: string;
            status?: string;
            customerId?: string;
            providerId?: string;
        }
        
        const result = await orderService.getAllOrders({
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(search && { search }),
            ...(status && { status }),
            ...(customerId && { customerId }),
            ...(providerId && { providerId })
        })
        
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { orderId } = req.params;
        if (!orderId || typeof orderId !== 'string') {
            return res.status(400).json({
                error: "Valid order ID is required!"
            })
        }

        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                error: "Status is required!"
            })
        }

        const result = await orderService.updateOrderStatus(orderId, status)
        res.status(200).json({
            success: true,
            message: "Order status updated successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export const orderController = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
}
