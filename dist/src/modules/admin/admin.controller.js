"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const admin_service_1 = require("./admin.service");
const paginationSortingHelper_1 = __importDefault(require("../../helpers/paginationSortingHelper"));
const getAllUsers = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        // Extract additional filters
        const { search, role, status } = req.query;
        const result = await admin_service_1.adminService.getAllUsers({
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(search && { search }),
            ...(role && { role }),
            ...(status && { status })
        });
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const updateUser = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                error: "Valid user ID is required!"
            });
        }
        const result = await admin_service_1.adminService.updateUser(userId, req.body);
        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const createCategory = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const result = await admin_service_1.adminService.createCategory(req.body);
        res.status(201).json({
            success: true,
            message: "Category created successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const updateCategory = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { categoryId } = req.params;
        if (!categoryId || typeof categoryId !== 'string') {
            return res.status(400).json({
                error: "Valid category ID is required!"
            });
        }
        const result = await admin_service_1.adminService.updateCategory(categoryId, req.body);
        res.status(200).json({
            success: true,
            message: "Category updated successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const deleteCategory = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { categoryId } = req.params;
        if (!categoryId || typeof categoryId !== 'string') {
            return res.status(400).json({
                error: "Valid category ID is required!"
            });
        }
        const result = await admin_service_1.adminService.deleteCategory(categoryId);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const getAllCategories = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        // Extract additional filters
        const { search, isActive, providerId } = req.query;
        const result = await admin_service_1.adminService.getAllCategories({
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(search && { search }),
            ...(isActive && { isActive }),
            ...(providerId && { providerId })
        });
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const getAllProviders = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        // Extract additional filters
        const { search, isActive, status } = req.query;
        const result = await admin_service_1.adminService.getAllProviders({
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(search && { search }),
            ...(isActive && { isActive }),
            ...(status && { status })
        });
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const updateUserStatus = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                error: "Valid user ID is required!"
            });
        }
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                error: "Status is required!"
            });
        }
        const result = await admin_service_1.adminService.updateUser(userId, { status });
        res.status(200).json({
            success: true,
            message: "User status updated successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const deleteUser = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { userId } = req.params;
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({
                error: "Valid user ID is required!"
            });
        }
        const result = await admin_service_1.adminService.deleteUser(userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
exports.adminController = {
    getAllUsers,
    updateUser,
    updateUserStatus,
    deleteUser,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllProviders,
    getAllCategories,
};
//# sourceMappingURL=admin.controller.js.map