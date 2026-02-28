import { mealService } from "./meal.service";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
const getProviderMeals = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.id) {
            return res.status(401).json({
                error: "Authentication required!",
            });
        }
        console.log(`📋 [PROVIDER MEALS] Fetching meals for provider: ${user.email} (Role: ${user.role})`);
        // Get the provider profile for this user
        const { prisma } = await import("../../lib/prisma");
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId: user.id },
        });
        if (!providerProfile) {
            console.log(`❌ [PROVIDER MEALS] No provider profile found for user: ${user.id}`);
            return res.status(403).json({
                error: "Please complete your provider profile first to manage meals. You can set up your profile at: /dashboard/profile",
                action: "complete_profile",
                profileUrl: "/dashboard/profile"
            });
        }
        console.log(`✅ [PROVIDER MEALS] Using provider profile: ${providerProfile.id} (${providerProfile.businessName})`);
        // Parse pagination and filter parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "desc";
        // Extract additional filters
        const { category, categoryIds, priceMin, priceMax, search, cuisine } = req.query;
        console.log(`🔍 [PROVIDER MEALS] Filters:`, {
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            category,
            categoryIds,
            priceMin,
            priceMax,
            search,
            cuisine,
        });
        const result = await mealService.getProviderMeals({
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            providerId: providerProfile.id, // Pass provider profile ID
            ...(category && { category }),
            ...(categoryIds && { categoryIds }),
            ...(priceMin && { priceMin }),
            ...(priceMax && { priceMax }),
            ...(search && { search }),
            ...(cuisine && { cuisine }),
        });
        console.log(`✅ [PROVIDER MEALS] Retrieved ${result.data.length} meals for provider ${providerProfile.businessName}`);
        res.status(200).json(result);
    }
    catch (e) {
        console.error("💥 [PROVIDER MEALS] Error:", e);
        next(e);
    }
};
const getAllMeals = async (req, res, next) => {
    try {
        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query);
        // Extract additional filters
        const { category, categoryIds, priceMin, priceMax, search, cuisine } = req.query;
        const result = await mealService.getAllMeals({
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
            ...(category && { category }),
            ...(categoryIds && { categoryIds }),
            ...(priceMin && { priceMin }),
            ...(priceMax && { priceMax }),
            ...(search && { search }),
            ...(cuisine && { cuisine }),
        });
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const getMealById = async (req, res, next) => {
    try {
        const { mealId } = req.params;
        if (!mealId || typeof mealId !== "string") {
            return res.status(400).json({
                error: "Valid meal ID is required!",
            });
        }
        const result = await mealService.getMealById(mealId);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const createMeal = async (req, res, next) => {
    try {
        console.log("🍽️ [CREATE MEAL] Starting meal creation process");
        const user = req.user;
        if (!user || !user.id) {
            console.log("❌ [CREATE MEAL] Authentication failed - no user found");
            return res.status(401).json({
                error: "Authentication required!",
            });
        }
        console.log(`👤 [CREATE MEAL] User authenticated: ${user.email} (ID: ${user.id}, Role: ${user.role})`);
        const { name, description, price, image, ingredients, allergens, prepTime, cuisineId, isFeatured, categoryId, } = req.body;
        console.log(`📝 [CREATE MEAL] Request data:`, {
            name,
            description,
            price,
            image,
            ingredients,
            allergens,
            prepTime,
            cuisineId,
            isFeatured,
            categoryId,
        });
        // Validate required fields
        if (!name || !price) {
            console.log("❌ [CREATE MEAL] Validation failed - missing required fields:", {
                hasName: !!name,
                hasPrice: !!price,
            });
            return res.status(400).json({
                error: "Name and price are required!",
            });
        }
        console.log("✅ [CREATE MEAL] Basic validation passed");
        // Get the provider profile for this user
        const { prisma } = await import("../../lib/prisma");
        console.log(`🔍 [CREATE MEAL] Looking up provider profile for user: ${user.id}`);
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId: user.id },
        });
        if (!providerProfile) {
            console.log(`❌ [CREATE MEAL] No provider profile found for user: ${user.id}`);
            return res.status(403).json({
                error: "Provider profile not found! Please apply for provider status first.",
            });
        }
        console.log(`✅ [CREATE MEAL] Provider profile found: ${providerProfile.id} (${providerProfile.businessName})`);
        if (!providerProfile.isActive) {
            console.log(`❌ [CREATE MEAL] Provider profile not active: ${providerProfile.id}`);
            return res.status(403).json({
                error: "Provider profile is not active! Please wait for admin approval.",
            });
        }
        console.log(`✅ [CREATE MEAL] Provider profile is active`);
        const mealData = {
            name,
            description: description || null,
            price: parseFloat(price),
            image: image || null,
            ingredients: ingredients || null,
            allergens: allergens || null,
            prepTime: prepTime ? parseInt(prepTime) : null,
            cuisineId: cuisineId || null,
            isFeatured: isFeatured || false,
            categoryId: categoryId || null,
            providerId: providerProfile.id, // Use ProviderProfile id, not User id
        };
        console.log(`🍳 [CREATE MEAL] Prepared meal data:`, {
            ...mealData,
            providerId: providerProfile.id,
        });
        console.log("🚀 [CREATE MEAL] Calling meal service to create meal");
        const result = await mealService.createMeal(mealData);
        console.log(`✅ [CREATE MEAL] Meal created successfully:`, {
            mealId: result.id,
            mealName: result.name,
            providerId: result.providerId,
            categoryId: result.categoryId,
        });
        res.status(201).json(result);
    }
    catch (e) {
        console.error("💥 [CREATE MEAL] Error during meal creation:", e);
        next(e);
    }
};
const updateMeal = async (req, res, next) => {
    try {
        const user = req.user;
        const { mealId } = req.params;
        if (!user || !user.id) {
            return res.status(401).json({
                error: "Authentication required!",
            });
        }
        if (!mealId || typeof mealId !== "string") {
            return res.status(400).json({
                error: "Valid meal ID is required!",
            });
        }
        // Get the provider profile for this user
        const { prisma } = await import("../../lib/prisma");
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId: user.id },
        });
        if (!providerProfile) {
            return res.status(403).json({
                error: "Provider profile not found! Please apply for provider status first.",
            });
        }
        const updateData = req.body;
        // Convert price and prepTime if provided
        if (updateData.price) {
            updateData.price = parseFloat(updateData.price);
        }
        if (updateData.prepTime) {
            updateData.prepTime = parseInt(updateData.prepTime);
        }
        const result = await mealService.updateMeal(mealId, updateData, providerProfile.id);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const deleteMeal = async (req, res, next) => {
    try {
        const user = req.user;
        const { mealId } = req.params;
        if (!user || !user.id) {
            return res.status(401).json({
                error: "Authentication required!",
            });
        }
        if (!mealId || typeof mealId !== "string") {
            return res.status(400).json({
                error: "Valid meal ID is required!",
            });
        }
        // Get the provider profile for this user
        const { prisma } = await import("../../lib/prisma");
        const providerProfile = await prisma.providerProfile.findUnique({
            where: { userId: user.id },
        });
        if (!providerProfile) {
            return res.status(403).json({
                error: "Provider profile not found! Please apply for provider status first.",
            });
        }
        const result = await mealService.deleteMeal(mealId, providerProfile.id);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
export const mealController = {
    getAllMeals,
    getProviderMeals,
    getMealById,
    createMeal,
    updateMeal,
    deleteMeal,
};
//# sourceMappingURL=meal.controller.js.map