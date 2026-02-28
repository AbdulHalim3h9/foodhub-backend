"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const getMyProfile = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const result = await user_service_1.userService.getMyProfile(user.id);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const applyForProvider = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const result = await user_service_1.userService.applyForProvider(user.id, req.body);
        res.status(201).json({
            success: true,
            message: "Provider application submitted successfully! Your profile is now pending admin approval.",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const updateProviderProfile = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        console.log("🔧 [USER CONTROLLER] Updating provider profile for user:", user.email);
        console.log("📝 [USER CONTROLLER] Request body:", req.body);
        const result = await user_service_1.userService.updateProviderProfile(user.id, req.body);
        console.log("✅ [USER CONTROLLER] Provider profile updated successfully");
        res.status(200).json({
            success: true,
            message: "Provider profile updated successfully!",
            data: result
        });
    }
    catch (e) {
        console.error("💥 [USER CONTROLLER] Error updating provider profile:", e);
        next(e);
    }
};
const updateProfile = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const result = await user_service_1.userService.updateProfile(user.id, req.body);
        res.status(200).json({
            success: true,
            message: "Profile updated successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
exports.userController = {
    getMyProfile,
    updateProfile,
    updateProviderProfile,
    applyForProvider
};
//# sourceMappingURL=user.controller.js.map