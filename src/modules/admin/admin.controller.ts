// Admin controller - Admin-only: manage users, view all orders, manage categories
import type { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
        
        // Extract additional filters
        const { search, role, status } = req.query as {
            search?: string;
            role?: string;
            status?: string;
        };

        const result = await adminService.getAllUsers({
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(search && { search }),
            ...(role && { role }),
            ...(status && { status })
        })
        
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                error: "Valid user ID is required!"
            })
        }

        const result = await adminService.updateUser(userId, req.body)
        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const result = await adminService.createCategory(req.body)
        res.status(201).json({
            success: true,
            message: "Category created successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { categoryId } = req.params;
        if (!categoryId || typeof categoryId !== 'string') {
            return res.status(400).json({
                error: "Valid category ID is required!"
            })
        }

        const result = await adminService.updateCategory(categoryId, req.body)
        res.status(200).json({
            success: true,
            message: "Category updated successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { categoryId } = req.params;
        if (!categoryId || typeof categoryId !== 'string') {
            return res.status(400).json({
                error: "Valid category ID is required!"
            })
        }

        const result = await adminService.deleteCategory(categoryId)
        res.status(200).json({
            success: true,
            message: "Category deleted successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
        
        // Extract additional filters
        const { search, isActive, providerId } = req.query as {
            search?: string;
            isActive?: string;
            providerId?: string;
        };

        const result = await adminService.getAllCategories({
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(search && { search }),
            ...(isActive && { isActive }),
            ...(providerId && { providerId })
        })
        
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const getAllProviders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)
        
        // Extract additional filters
        const { search, isActive, status } = req.query as {
            search?: string;
            isActive?: string;
            status?: string;
        };

        const result = await adminService.getAllProviders({
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(search && { search }),
            ...(isActive && { isActive }),
            ...(status && { status })
        })
        
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                error: "Valid user ID is required!"
            })
        }

        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                error: "Status is required!"
            })
        }

        const result = await adminService.updateUser(userId, { status })
        res.status(200).json({
            success: true,
            message: "User status updated successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                error: "Valid user ID is required!"
            })
        }

        const result = await adminService.deleteUser(userId)
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

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
        
        const result = await adminService.getAllOrders({
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

        const result = await adminService.updateOrderStatus(orderId, status)
        res.status(200).json({
            success: true,
            message: "Order status updated successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export const adminController = {
    getAllUsers,
    updateUser,
    updateUserStatus,
    deleteUser,
    getAllOrders,
    updateOrderStatus,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllProviders,
    getAllCategories,
};
