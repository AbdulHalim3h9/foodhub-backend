"use strict";
// Public / Customer facing
// GET /api/meals - List meals (support filters: ?category= &priceMin= &priceMax= &search= &sort=)
// GET /api/meals/:id - Get single meal details + reviews summary
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
exports.mealRouter = void 0;
// Provider / Admin (authenticated)
// POST /api/meals - Create new meal (provider/admin only)
// PUT /api/meals/:id - Update meal (provider/admin only)
// DELETE /api/meals/:id - Delete meal (provider/admin only)
// GET /api/meals/provider/meals - Get provider's own meals
const express_1 = __importStar(require("express"));
const meal_controller_1 = require("./meal.controller");
const auth_1 = __importStar(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Public routes
router.get("/", meal_controller_1.mealController.getAllMeals);
router.get("/:mealId", meal_controller_1.mealController.getMealById);
// Protected routes (Provider/Admin only)
router.get("/provider/meals", (0, auth_1.default)(auth_1.UserRole.PROVIDER, auth_1.UserRole.ADMIN), meal_controller_1.mealController.getProviderMeals);
router.post("/", (0, auth_1.default)(auth_1.UserRole.PROVIDER), meal_controller_1.mealController.createMeal);
router.put("/:mealId", (0, auth_1.default)(auth_1.UserRole.PROVIDER, auth_1.UserRole.ADMIN), meal_controller_1.mealController.updateMeal);
router.delete("/:mealId", (0, auth_1.default)(auth_1.UserRole.PROVIDER, auth_1.UserRole.ADMIN), meal_controller_1.mealController.deleteMeal);
exports.mealRouter = router;
//# sourceMappingURL=meal.routes.js.map