import express, { Router } from "express";
import { cuisineController } from "./cuisine.controller";
const router = express.Router();
// Public routes
router.get("/", cuisineController.getAllCuisines);
export const cuisineRouter = router;
//# sourceMappingURL=cuisine.routes.js.map