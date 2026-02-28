"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
const cart_service_1 = require("./cart.service");
const getCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const result = await cart_service_1.cartService.getCart(user.id);
        res.status(200).json(result);
    }
    catch (e) {
        next(e);
    }
};
const addItemToCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const result = await cart_service_1.cartService.addItemToCart(user.id, req.body);
        res.status(201).json({
            success: true,
            message: "Item added to cart successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const updateItemQuantity = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { mealId } = req.params;
        const { quantity } = req.body;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            });
        }
        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                error: "Valid quantity greater than 0 is required!"
            });
        }
        const result = await cart_service_1.cartService.updateItemQuantity(user.id, mealId, quantity);
        res.status(200).json({
            success: true,
            message: "Item quantity updated successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const removeItemFromCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const { mealId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            });
        }
        const result = await cart_service_1.cartService.removeItemFromCart(user.id, mealId);
        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
const clearCart = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            });
        }
        const result = await cart_service_1.cartService.clearCart(user.id);
        res.status(200).json({
            success: true,
            message: "Cart cleared successfully!",
            data: result
        });
    }
    catch (e) {
        next(e);
    }
};
exports.cartController = {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
};
//# sourceMappingURL=cart.controller.js.map