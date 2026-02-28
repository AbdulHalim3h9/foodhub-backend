export declare const mealService: {
    getAllMeals: ({ page, limit, skip, sortBy, sortOrder, category, categoryIds, priceMin, priceMax, search, cuisine, }: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
        category?: string;
        categoryIds?: string;
        priceMin?: string;
        priceMax?: string;
        search?: string;
        cuisine?: string;
    }) => Promise<{
        data: {
            avgRating: number;
            reviewCount: number;
            category: {
                id: string;
                name: string;
            } | null;
            provider: {
                businessName: string;
                id: string;
                logo: string | null;
            };
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
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProviderMeals: ({ page, limit, skip, sortBy, sortOrder, category, categoryIds, priceMin, priceMax, search, cuisine, providerId, }: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
        category?: string;
        categoryIds?: string;
        priceMin?: string;
        priceMax?: string;
        search?: string;
        cuisine?: string;
        providerId: string;
    }) => Promise<{
        data: {
            avgRating: number;
            reviewCount: number;
            category: {
                id: string;
                name: string;
            } | null;
            provider: {
                businessName: string;
                id: string;
                logo: string | null;
            };
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
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getMealById: (mealId: string) => Promise<{
        ratingSummary: {
            average: number;
            totalReviews: number;
            distribution: {
                5: any;
                4: any;
                3: any;
                2: any;
                1: any;
            };
        };
        reviews: ({
            customer: {
                id: string;
                name: string;
                image: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            mealId: string;
            rating: number;
            comment: string | null;
        })[];
        category: {
            id: string;
            name: string;
            description: string | null;
        } | null;
        provider: {
            phone: string;
            address: string;
            businessName: string;
            id: string;
            user: {
                name: string;
                image: string | null;
            };
            isActive: boolean;
        };
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
    createMeal: (mealData: {
        name: string;
        description: string | null;
        price: number;
        image: string | null;
        ingredients: string | null;
        allergens: string | null;
        prepTime: number | null;
        cuisineId: string | null;
        isFeatured: boolean;
        categoryId: string | null;
        providerId: string;
    }) => Promise<{
        categoryName: string | undefined;
        providerName: string;
        isFeatured: boolean;
        category: {
            id: string;
            name: string;
        } | null;
        provider: {
            businessName: string;
            id: string;
            logo: string | null;
        };
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
    }>;
    updateMeal: (mealId: string, updateData: any, providerProfileId: string) => Promise<{
        category: {
            id: string;
            name: string;
        } | null;
        provider: {
            businessName: string;
            id: string;
            logo: string | null;
        };
    } & {
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
    deleteMeal: (mealId: string, providerProfileId: string) => Promise<{
        message: string;
    }>;
};
//# sourceMappingURL=meal.service.d.ts.map