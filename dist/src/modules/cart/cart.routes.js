"use strict";
// GET /api/cart - Get current user's cart
// POST /api/cart/items - Add item to cart
// PUT /api/cart/items/:mealId - Update quantity
// DELETE /api/cart/items/:mealId - Remove item
// DELETE /api/cart - Clear entire cart
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
exports.cartRouter = void 0;
const express_1 = __importStar(require("express"));
const cart_controller_1 = require("./cart.controller");
const auth_1 = __importStar(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), cart_controller_1.cartController.getCart);
router.post("/items", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), cart_controller_1.cartController.addItemToCart);
router.put("/items/:mealId", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), cart_controller_1.cartController.updateItemQuantity);
router.delete("/items/:mealId", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), cart_controller_1.cartController.removeItemFromCart);
router.delete("/", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), cart_controller_1.cartController.clearCart);
exports.cartRouter = router;
//# sourceMappingURL=cart.routes.js.map