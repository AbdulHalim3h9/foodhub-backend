// Cart controller - Cart management for users
import type { NextFunction, Request, Response } from "express";
import { cartService } from "./cart.service";

const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const result = await cartService.getCart(user.id as string)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const addItemToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const result = await cartService.addItemToCart(user.id as string, req.body)
        res.status(201).json({
            success: true,
            message: "Item added to cart successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const updateItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { mealId } = req.params;
        const { quantity } = req.body;

        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            })
        }

        if (!quantity || quantity <= 0) {
            return res.status(400).json({
                error: "Valid quantity greater than 0 is required!"
            })
        }

        const result = await cartService.updateItemQuantity(user.id as string, mealId, quantity)
        res.status(200).json({
            success: true,
            message: "Item quantity updated successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const removeItemFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const { mealId } = req.params;
        if (!mealId || typeof mealId !== 'string') {
            return res.status(400).json({
                error: "Valid meal ID is required!"
            })
        }

        const result = await cartService.removeItemFromCart(user.id as string, mealId)
        res.status(200).json({
            success: true,
            message: "Item removed from cart successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        const result = await cartService.clearCart(user.id as string)
        res.status(200).json({
            success: true,
            message: "Cart cleared successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export const cartController = {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
}
