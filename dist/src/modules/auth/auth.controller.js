"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    try {
        const result = await auth_service_1.authService.register(req.body);
        const { refreshToken, accessToken, user } = result;
        res.cookie("refreshToken", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: "User registered successfully!",
            data: {
                accessToken,
                user,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Registration failed",
        });
    }
};
const login = async (req, res) => {
    try {
        const result = await auth_service_1.authService.login(req.body);
        const { refreshToken, accessToken } = result;
        res.cookie("refreshToken", refreshToken, {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            data: {
                accessToken,
            },
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Login failed",
        });
    }
};
exports.authController = {
    register,
    login,
};
