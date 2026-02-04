import type { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }
        const result = await userService.getMyProfile(user.id as string)
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const applyForProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }
        
        const result = await userService.applyForProvider(user.id as string, req.body)
        res.status(201).json({
            success: true,
            message: "Provider application submitted successfully! Your profile is now pending admin approval.",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export const userController = {
    getMyProfile,
    applyForProvider
}
