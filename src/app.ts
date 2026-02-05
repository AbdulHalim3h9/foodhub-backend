import express from "express";
import type { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { adminRouter } from "./modules/admin/admin.routes";
import { userRouter } from "./modules/user/user.routes";
import { providerRouter } from "./modules/provider/provider.routes";
import { categoryRouter } from "./modules/category/category.routes";
import { orderRouter } from "./modules/order/order.routes";

const app: Application = express();

app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
app.use("/api/provider", providerRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);

export default app;