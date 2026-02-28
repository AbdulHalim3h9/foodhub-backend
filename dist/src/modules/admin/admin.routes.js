"use strict";
// Admin Module
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
// GET /api/admin/users - List all users
// PATCH /api/admin/users/:id - Update user
// GET /api/admin/providers - List providers + status
// GET /api/admin/categories - List all categories
// POST /api/admin/categories - Create new category
// PUT /api/admin/categories/:id - Update category
// DELETE /api/admin/categories/:id - Delete category
// To Do
// PATCH /api/admin/providers/:id/approve - Approve user becoming a provider
const express_1 = __importStar(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_1 = __importStar(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/users", (0, auth_1.default)(auth_1.UserRole.ADMIN), admin_controller_1.adminController.getAllUsers);
router.patch("/users/:userId", (0, auth_1.default)(auth_1.UserRole.ADMIN), admin_controller_1.adminController.updateUser);
router.patch("/users/:userId/status", (0, auth_1.default)(auth_1.UserRole.ADMIN), admin_controller_1.adminController.updateUserStatus);
router.delete("/users/:userId", (0, auth_1.default)(auth_1.UserRole.ADMIN), admin_controller_1.adminController.deleteUser);
// Provider management routes
router.get("/providers", (0, auth_1.default)(auth_1.UserRole.ADMIN), admin_controller_1.adminController.getAllProviders);
// Category management routes
router.get("/categories", (0, auth_1.default)(auth_1.UserRole.ADMIN), admin_controller_1.adminController.getAllCategories);
router.post("/categories", (0, auth_1.default)(auth_1.UserRole.ADMIN), admin_controller_1.adminController.createCategory);
router.put("/categories/:categoryId", (0, auth_1.default)(auth_1.UserRole.ADMIN), admin_controller_1.adminController.updateCategory);
router.delete("/categories/:categoryId", (0, auth_1.default)(auth_1.UserRole.ADMIN), admin_controller_1.adminController.deleteCategory);
exports.adminRouter = router;
//# sourceMappingURL=admin.routes.js.map