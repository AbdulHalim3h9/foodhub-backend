export declare const userService: {
    getMyProfile: (userId: string) => Promise<{
        role: import("../../../prisma/generated/prisma/enums").UserRole;
        phone: string | null;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
        image: string | null;
        providerProfile: {
            phone: string;
            address: string;
            businessName: string;
            website: string | null;
            cuisine: string | null;
            openingHours: string | null;
            id: string;
            isActive: boolean;
            description: string | null;
            logo: string | null;
        } | null;
    }>;
    updateProfile: (userId: string, updateData: {
        name?: string;
        phone?: string;
        address?: string;
        image?: string;
    }) => Promise<{
        role: import("../../../prisma/generated/prisma/enums").UserRole;
        phone: string | null;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
        image: string | null;
        providerProfile: {
            phone: string;
            address: string;
            businessName: string;
            id: string;
            isActive: boolean;
            description: string | null;
            logo: string | null;
        } | null;
    }>;
    updateProviderProfile: (userId: string, updateData: {
        name?: string;
        phone?: string;
        address?: string;
        image?: string;
        businessName?: string;
        description?: string;
        logo?: string;
        providerPhone?: string;
        providerAddress?: string;
        website?: string;
        cuisine?: string;
        openingHours?: string;
    }) => Promise<{
        phone: string;
        address: string;
        businessName: string;
        website: string | null;
        cuisine: string | null;
        openingHours: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isActive: boolean;
        description: string | null;
        logo: string | null;
    }>;
    applyForProvider: (userId: string, providerData: {
        businessName: string;
        description?: string;
        phone: string;
        address: string;
        logo?: string;
    }) => Promise<{
        phone: string;
        address: string;
        businessName: string;
        website: string | null;
        cuisine: string | null;
        openingHours: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        isActive: boolean;
        description: string | null;
        logo: string | null;
    }>;
};
//# sourceMappingURL=user.service.d.ts.map