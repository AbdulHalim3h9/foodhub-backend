"use strict";
// Orders Module
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
exports.orderRouter = void 0;
// Customer
// POST /api/orders - Create order (send cart items + delivery address + payment info)
// GET /api/orders - List my orders
// GET /api/orders/:id - Get order details
// Admin
// GET /api/orders/admin - View all orders platform-wide
// PATCH /api/orders/:orderId/status - Update order status
const express_1 = __importStar(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importStar(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Customer routes
router.post("/", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), order_controller_1.orderController.createOrder);
router.get("/", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), order_controller_1.orderController.getMyOrders);
router.get("/provider/orders", (0, auth_1.default)(auth_1.UserRole.PROVIDER), order_controller_1.orderController.getProviderOrders);
router.get("/all", (req, res, next) => {
    console.log("Getting all orders");
    next();
}, (0, auth_1.default)(auth_1.UserRole.ADMIN, auth_1.UserRole.PROVIDER), order_controller_1.orderController.getAllOrders);
router.get("/:orderId", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), order_controller_1.orderController.getOrderById);
router.patch("/:orderId/status", (0, auth_1.default)(auth_1.UserRole.ADMIN, auth_1.UserRole.PROVIDER), order_controller_1.orderController.updateOrderStatus);
exports.orderRouter = router;
//# sourceMappingURL=order.routes.js.map