export declare const providerService: {
    getAllProviders: ({ search, isActive, page, limit, skip, sortBy, sortOrder }: {
        search?: string;
        isActive?: boolean;
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
    }) => Promise<{
        data: ({
            user: {
                id: string;
                email: string;
                name: string;
                image: string | null;
            };
            _count: {
                orders: number;
                meals: number;
            };
        } & {
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
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createProviderProfile: (providerData: {
        userId: string;
        businessName: string;
        description?: string;
        phone: string;
        address: string;
        website?: string;
        cuisine?: string;
        deliveryRadius?: number;
        openingHours?: string;
    }) => Promise<{
        success: boolean;
        data: {
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
        };
        error?: never;
    } | {
        success: boolean;
        error: string;
        data?: never;
    }>;
    createMenuItem: (providerId: string, mealData: {
        name: string;
        description?: string;
        price: number;
        image?: string;
        ingredients?: string;
        allergens?: string;
        prepTime?: number;
        cuisineId?: string;
        categoryId: string;
    }) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        image: string | null;
        providerId: string;
        description: string | null;
        categoryId: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        ingredients: string | null;
        allergens: string | null;
        prepTime: number | null;
        cuisineId: string | null;
        isVegan: boolean;
        isAvailable: boolean;
        isFeatured: boolean;
    }>;
    getProviderById: (providerId: string) => Promise<{
        meals: never[];
        overallRating: number;
        totalReviews: number;
        user: {
            id: string;
            createdAt: Date;
            email: string;
            name: string;
            image: string | null;
        };
        _count: {
            orders: number;
            meals: number;
        };
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
    updateMenuItem: (providerId: string, mealId: string, mealData: {
        name?: string;
        description?: string;
        price?: number;
        image?: string;
        ingredients?: string;
        allergens?: string;
        prepTime?: number;
        cuisineId?: string;
        categoryId?: string;
    }) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        image: string | null;
        providerId: string;
        description: string | null;
        categoryId: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        ingredients: string | null;
        allergens: string | null;
        prepTime: number | null;
        cuisineId: string | null;
        isVegan: boolean;
        isAvailable: boolean;
        isFeatured: boolean;
    }>;
    deleteMenuItem: (providerId: string, mealId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        image: string | null;
        providerId: string;
        description: string | null;
        categoryId: string | null;
        price: import("@prisma/client-runtime-utils").Decimal;
        ingredients: string | null;
        allergens: string | null;
        prepTime: number | null;
        cuisineId: string | null;
        isVegan: boolean;
        isAvailable: boolean;
        isFeatured: boolean;
    }>;
};
//# sourceMappingURL=provider.service.d.ts.map