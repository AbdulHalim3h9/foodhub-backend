"use strict";
// Categories Module
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRouter = void 0;
// GET /api/categories - List all categories (public – used in filters, dropdowns)
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
// Public routes
router.get("/", category_controller_1.categoryController.getAllCategories);
exports.categoryRouter = router;
