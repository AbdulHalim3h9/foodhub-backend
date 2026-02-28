"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_1 = require("better-auth/node");
const auth_1 = require("./lib/auth");
const admin_routes_1 = require("./modules/admin/admin.routes");
const user_routes_1 = require("./modules/user/user.routes");
const provider_routes_1 = require("./modules/provider/provider.routes");
const category_routes_1 = require("./modules/category/category.routes");
const order_routes_1 = require("./modules/order/order.routes");
const cart_routes_1 = require("./modules/cart/cart.routes");
const meal_routes_1 = require("./modules/meal/meal.routes");
const review_routes_1 = require("./modules/review/review.routes");
const cuisine_routes_1 = require("./modules/cuisine/cuisine.routes");
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://localhost:3000"],
    credentials: true,
}));
app.use(express_1.default.json());
app.all("/api/auth/*splat", (0, node_1.toNodeHandler)(auth_1.auth));
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/api/admin", admin_routes_1.adminRouter);
app.use("/api/user", user_routes_1.userRouter);
app.use("/api/provider", provider_routes_1.providerRouter);
app.use("/api/categories", category_routes_1.categoryRouter);
app.use("/api/cuisines", cuisine_routes_1.cuisineRouter);
app.use("/api/orders", order_routes_1.orderRouter);
app.use("/api/cart", cart_routes_1.cartRouter);
app.use("/api/meals", meal_routes_1.mealRouter);
app.use("/api", review_routes_1.reviewRouter); // Review routes have their own prefix
// Global error handler (must be last)
app.use(globalErrorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map