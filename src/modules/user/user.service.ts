import { prisma } from "../../lib/prisma";

const getMyProfile = async (userId: string) => {
    const result = await prisma.user.findUnique({
        where: {
            id: userId,
            isActive: true
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
                    website: true,
                    cuisine: true,
                    openingHours: true,
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

const updateProviderProfile = async (userId: string, updateData: {
    // User profile fields
    name?: string;
    phone?: string;
    address?: string;
    image?: string;
    
    // Provider profile fields
    businessName?: string;
    description?: string;
    logo?: string;
    providerPhone?: string;
    providerAddress?: string;
    website?: string;
    cuisine?: string;
    openingHours?: string;
}) => {
    console.log("🔧 [USER SERVICE] Updating provider profile for user:", userId);
    console.log("📝 [USER SERVICE] Update data:", updateData);

    // Get provider profile first
    const providerProfile = await prisma.providerProfile.findFirst({
        where: { userId }
    });

    let result;
    if (!providerProfile) {
        console.log("📝 [USER SERVICE] Provider profile not found, creating new one...");
        // Create provider profile if it doesn't exist
        result = await prisma.providerProfile.create({
            data: {
                userId,
                businessName: updateData.businessName || "",
                description: updateData.description || "",
                phone: updateData.providerPhone || "",
                address: updateData.providerAddress || "",
                isActive: true,
            }
        });
        console.log("✅ [USER SERVICE] Created new provider profile:", result.id);
    } else {
        console.log("✅ [USER SERVICE] Found provider profile:", providerProfile.id);
        // Update existing provider profile
        result = await prisma.providerProfile.update({
            where: { id: providerProfile.id },
            data: {
                ...(updateData.businessName !== undefined && { businessName: updateData.businessName }),
                ...(updateData.description !== undefined && { description: updateData.description }),
                ...(updateData.providerPhone !== undefined && { phone: updateData.providerPhone }),
                ...(updateData.providerAddress !== undefined && { address: updateData.providerAddress }),
                ...(updateData.website !== undefined && { website: updateData.website }),
                ...(updateData.cuisine !== undefined && { cuisine: updateData.cuisine }),
                ...(updateData.openingHours !== undefined && { openingHours: updateData.openingHours }),
            }
        });
        console.log("✅ [USER SERVICE] Updated provider profile:", result.id);
    }

    // Update user profile if there's data
    const userData: any = {};
    if (updateData.name !== undefined) userData.name = updateData.name;
    if (updateData.phone !== undefined) userData.phone = updateData.phone;
    if (updateData.address !== undefined) userData.address = updateData.address;
    if (updateData.image !== undefined) userData.image = updateData.image;

    console.log("👤 [USER SERVICE] User data to update:", userData);

    // Update user profile
    const finalResult = await prisma.$transaction(async (tx) => {
        // Update user profile if there's data
        let updatedUser = null;
        if (Object.keys(userData).length > 0) {
            updatedUser = await tx.user.update({
                where: {
                    id: userId,
                    isActive: true
                },
                data: userData,
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
        }

        // Return the complete updated profile
        const finalProfile = await tx.user.findUnique({
            where: {
                id: userId,
                isActive: true
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
                        website: true,
                        cuisine: true,
                        openingHours: true,
                        isActive: true
                    }
                }
            }
        });

        if (!finalProfile) {
            throw new Error("Failed to retrieve updated profile!");
        }

        console.log("✅ [USER SERVICE] Provider profile updated successfully");
        return finalProfile;
    });

    return result;
}

const updateProfile = async (userId: string, updateData: {
    name?: string;
    phone?: string;
    address?: string;
    image?: string;
}) => {
    const result = await prisma.user.update({
        where: {
            id: userId,
            isActive: true
        },
        data: updateData,
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

export const userService = {
    getMyProfile,
    updateProfile,
    updateProviderProfile,
    applyForProvider
}
