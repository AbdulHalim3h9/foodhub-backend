// Provider controller - Provider-specific actions: menu management, order handling dashboard
import type { NextFunction, Request, Response } from "express";
import { providerService } from "./provider.service";
import { prisma } from "../../lib/prisma";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";

const getAllProviders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined

        // true or false
        const isActive = req.query.isActive
            ? req.query.isActive === 'true'
                ? true
                : req.query.isActive === 'false'
                    ? false
                    : undefined
            : undefined

        const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(req.query)

        const params: any = {
            page, 
            limit, 
            skip, 
            sortBy, 
            sortOrder 
        }

        if (searchString) {
            params.search = searchString
        }

        if (typeof isActive === 'boolean') {
            params.isActive = isActive
        }

        const result = await providerService.getAllProviders(params)
        
        res.status(200).json(result)
    } catch (e) {
        next(e)
    }
}

const createMenuItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                error: "Unauthorized!",
            })
        }

        // Get provider profile for this user
        const providerProfile = await prisma.providerProfile.findFirst({
            where: {
                userId: user.id,
                isActive: true
            }
        });

        if (!providerProfile) {
            return res.status(403).json({
                error: "Provider profile not found or inactive!",
            })
        }

        const result = await providerService.createMenuItem(providerProfile.id, req.body)
        res.status(201).json({
            success: true,
            message: "Menu item created successfully!",
            data: result
        })
    } catch (e) {
        next(e)
    }
}

export const providerController = {
    getAllProviders,
    createMenuItem
}
