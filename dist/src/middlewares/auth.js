"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["PROVIDER"] = "PROVIDER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "You are not authorized!",
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET || "secret");
            const userData = await prisma_1.prisma.user.findUnique({
                where: {
                    email: decoded.email,
                },
            });
            if (!userData) {
                return res.status(401).json({
                    success: false,
                    message: "User not found!",
                });
            }
            if (userData.status !== "ACTIVE") {
                return res.status(401).json({
                    success: false,
                    message: "User is not active!",
                });
            }
            if (roles.length && !roles.includes(userData.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden! You don't have permission to access this resource!",
                });
            }
            req.user = decoded;
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.default = auth;
