"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.providerController = void 0;
const provider_service_1 = require("./provider.service");
const prisma_1 = require("../../lib/prisma");
const paginationSortingHelper_1 = __importDefault(require("../../helpers/paginationSortingHelper"));
const createProviderProfile = async (req, res, next) => {
    try {
        const { userId, businessName, description, phone, address, website, cuisine, deliveryRadius, openingHours } = req.body;
        if (!userId || !businessName || !phone || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: userId, businessName, phone, address"
            });
        }
        const result = await provider_service_1.providerService.createProviderProfile({
            userId,
            businessName,
            description,
            phone,
            address,
            website,
            cuisine,
            deliveryRadius,
            openingHours
        });
        if (!result.success) {
            return res.status(500).json({
                success: false,
                message: result.error
            });
        }
        res.status(201).json({
            success: true,
            data: result.data,
            message: "Provider profile created successfully"
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllProviders = async (req, res, next) => {
    try {
        const { search } = req.query;
        const searchString = typeof search === 'string' ? search : undefined;
        // true or false
        const isActive = req.query.isActive
            ? req.query.isActive === 'true'
                ? true
                : req.query.isActive === 'false'
                    ? false
                    : undefined
            : undefined;
        const { page, limit, skip, sortBy, sortOrder } = (0, paginationSortingHelper_1.default)(req.query);
        const params = {
            page,
            limit,
            skip,
            sortBy,
            sortOrder
        };
        if (searchString) {
            params.search = searchString;
        }
        if (typeof isActive === 'boolean') {
            params.isActive = isActive;
        }
        const result = await provider_service_1.providerService.getAllProviders(params);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const createMenuItem = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        // Get provider profile for this user
        const providerProfile = await prisma_1.prisma.providerProfile.findFirst({
            where: {
                userId: user.id,
                isActive: true
            }
        });
        if (!providerProfile) {
            return res.status(403).json({
                error: "Provider profile not found or inactive!",
            });
        }
        const result = await provider_service_1.providerService.createMenuItem(providerProfile.id, req.body);
        res.status(201).json({
            success: true,
            message: "Menu item created successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const getProviderById = async (req, res, next) => {
    try {
        const { providerId } = req.params;
        if (!providerId || typeof providerId !== 'string') {
            return res.status(400).json({
                error: "Valid provider ID is required!"
            });
        }
        const result = await provider_service_1.providerService.getProviderById(providerId);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const updateMenuItem = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { mealId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            });
        }
        // Get provider profile for this user
        const providerProfile = await prisma_1.prisma.providerProfile.findFirst({
            where: {
                userId: user.id,
                isActive: true
            }
        });
        if (!providerProfile) {
            return res.status(403).json({
                error: "Provider profile not found or inactive!",
            });
        }
        const result = await provider_service_1.providerService.updateMenuItem(providerProfile.id, mealId, req.body);
        res.status(200).json({
            success: true,
            message: "Menu item updated successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const deleteMenuItem = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { mealId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            });
        }
        // Get provider profile for this user
        const providerProfile = await prisma_1.prisma.providerProfile.findFirst({
            where: {
                userId: user.id,
                isActive: true
            }
        });
        if (!providerProfile) {
            return res.status(403).json({
                error: "Provider profile not found or inactive!",
            });
        }
        const result = await provider_service_1.providerService.deleteMenuItem(providerProfile.id, mealId);
        res.status(200).json({
            success: true,
            message: "Menu item deleted successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
exports.providerController = {
    createProviderProfile,
    getAllProviders,
    createMenuItem,
    getProviderById,
    updateMenuItem,
    deleteMenuItem
};
//# sourceMappingURL=provider.controller.js.map