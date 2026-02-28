"use strict";
// Reviews Module
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
exports.reviewRouter = void 0;
// GET /api/meals/:id/reviews - Get all reviews for a meal
// POST /api/meals/:id/reviews - Submit a review (after order delivered)
// PUT /api/meals/:id/reviews/:rid - Update own review
// DELETE /api/meals/:id/reviews/:rid - Delete own review
const express_1 = __importStar(require("express"));
const review_controller_1 = require("./review.controller");
const auth_1 = __importStar(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Public route - get reviews for a meal
router.get("/meals/:mealId/reviews", review_controller_1.reviewController.getMealReviews);
// Customer routes - manage own reviews
router.post("/meals/:mealId/reviews", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), review_controller_1.reviewController.createReview);
router.put("/meals/:mealId/reviews/:reviewId", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), review_controller_1.reviewController.updateReview);
router.delete("/meals/:mealId/reviews/:reviewId", (0, auth_1.default)(auth_1.UserRole.CUSTOMER), review_controller_1.reviewController.deleteReview);
exports.reviewRouter = router;
//# sourceMappingURL=review.routes.js.map