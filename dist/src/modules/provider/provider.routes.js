"use strict";
// Providers Module
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
exports.providerRouter = void 0;
// Public
// GET /api/providers - List all providers (with optional filters)
// GET /api/providers/:id - Get provider details + their active menu
// (own menu)
// POST /api/provider/menu - Create new menu item
// PUT /api/provider/menu/:id - Update own menu item
// DELETE /api/provider/menu/:id - Delete own menu item
// Provider
// GET /api/provider/orders - List incoming orders for this provider
// PATCH /api/provider/orders/:id - Update order status (accepted → preparing → ready → delivered)
// GET /api/provider/dashboard - List statistics for provider (orders, income)
const express_1 = __importStar(require("express"));
const provider_controller_1 = require("./provider.controller");
const auth_1 = __importStar(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/profile", provider_controller_1.providerController.createProviderProfile);
router.get("/", provider_controller_1.providerController.getAllProviders);
router.get("/:providerId", provider_controller_1.providerController.getProviderById);
router.post("/menu", (0, auth_1.default)(auth_1.UserRole.PROVIDER), provider_controller_1.providerController.createMenuItem);
router.put("/menu/:mealId", (0, auth_1.default)(auth_1.UserRole.PROVIDER), provider_controller_1.providerController.updateMenuItem);
router.delete("/menu/:mealId", (0, auth_1.default)(auth_1.UserRole.PROVIDER), provider_controller_1.providerController.deleteMenuItem);
exports.providerRouter = router;
//# sourceMappingURL=provider.routes.js.map