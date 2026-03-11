"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const prisma_1 = require("../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const register = async (payload) => {
    const isUserExists = await prisma_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (isUserExists) {
        throw new Error("User with this email already exists!");
    }
    const hashedPassword = await bcryptjs_1.default.hash(payload.password, 12);
    const result = await prisma_1.prisma.user.create({
        data: {
            id: crypto.randomUUID(),
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            role: payload.role || "CUSTOMER",
        },
    });
    const { password, ...userWithoutPassword } = result;
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: result.id,
        email: result.email,
        role: result.role,
    }, process.env.JWT_ACCESS_SECRET || "secret", process.env.JWT_ACCESS_EXPIRES_IN || "1d");
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        id: result.id,
        email: result.email,
        role: result.role,
    }, process.env.JWT_REFRESH_SECRET || "secret_refresh", process.env.JWT_REFRESH_EXPIRES_IN || "30d");
    return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    };
};
const login = async (payload) => {
    const userData = await prisma_1.prisma.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!userData) {
        throw new Error("User not found!");
    }
    if (userData.status !== "ACTIVE") {
        throw new Error("User is not active!");
    }
    const isPasswordMatched = await bcryptjs_1.default.compare(payload.password, userData.password);
    if (!isPasswordMatched) {
        throw new Error("Password incorrect!");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, process.env.JWT_ACCESS_SECRET || "secret", process.env.JWT_ACCESS_EXPIRES_IN || "1d");
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, process.env.JWT_REFRESH_SECRET || "secret_refresh", process.env.JWT_REFRESH_EXPIRES_IN || "30d");
    return {
        accessToken,
        refreshToken,
    };
};
exports.authService = {
    register,
    login,
};
