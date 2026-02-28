import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { adminRouter } from "./modules/admin/admin.routes";
import { userRouter } from "./modules/user/user.routes";
import { providerRouter } from "./modules/provider/provider.routes";
import { categoryRouter } from "./modules/category/category.routes";
import { orderRouter } from "./modules/order/order.routes";
import { cartRouter } from "./modules/cart/cart.routes";
import { mealRouter } from "./modules/meal/meal.routes";
import { reviewRouter } from "./modules/review/review.routes";
import { cuisineRouter } from "./modules/cuisine/cuisine.routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
const app = express();
app.use(cors({
    origin: ["http://localhost:3000", "https://localhost:3000"],
    credentials: true,
}));
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get("/", (req, res) => {
    res.send("Hello, World!");
});
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/provider", providerRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/cuisines", cuisineRouter);
app.use("/api/orders", orderRouter);
app.use("/api/cart", cartRouter);
app.use("/api/meals", mealRouter);
app.use("/api", reviewRouter); // Review routes have their own prefix
// Global error handler (must be last)
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map