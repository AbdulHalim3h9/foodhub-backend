import { prisma } from "../../lib/prisma";

const getMyProfile = async (userId: string) => {
    const result = await prisma.user.findUnique({
        where: {
            id: userId,
            status: "ACTIVE"
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            phone: true,
            address: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            providerProfile: {
                select: {
                    id: true,
                    businessName: true,
                    description: true,
                    logo: true,
                    phone: true,
                    address: true,
                    isActive: true
                }
            }
        }
    });

    if (!result) {
        throw new Error("User not found!");
    }

    return result;
}

const applyForProvider = async (userId: string, providerData: {
    businessName: string;
    description?: string;
    phone: string;
    address: string;
    logo?: string;
}) => {
    // Check if user already has a provider profile
    const existingProfile = await prisma.providerProfile.findFirst({
        where: {
            userId
        }
    });

    if (existingProfile) {
        throw new Error("You already have a provider profile!");
    }

    // Create provider profile
    const result = await prisma.$transaction(async (tx) => {
        // Update user role to PROVIDER
        await tx.user.update({
            where: {
                id: userId
            },
            data: {
                role: "PROVIDER"
            }
        });

        // Create provider profile
        const providerProfile = await tx.providerProfile.create({
            data: {
                userId,
                businessName: providerData.businessName,
                description: providerData.description || null,
                phone: providerData.phone,
                address: providerData.address,
                logo: providerData.logo || null,
                isActive: false // Default to inactive, requires admin approval
            }
        });

        return providerProfile;
    });

    return result;
}

export const userService = {
    getMyProfile,
    applyForProvider
}
