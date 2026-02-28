export declare const cartService: {
    getCart: (userId: string) => Promise<{
        items: ({
            meal: {
                cuisine: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                } | null;
                id: string;
                name: string;
                image: string | null;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
                isVegan: boolean;
                isAvailable: boolean;
                provider: {
                    phone: string;
                    address: string;
                    businessName: string;
                    id: string;
                };
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            mealId: string;
            quantity: number;
        })[];
        totalAmount: number;
        itemCount: number;
    }>;
    addItemToCart: (userId: string, itemData: {
        mealId: string;
        quantity: number;
    }) => Promise<{
        meal: {
            id: string;
            name: string;
            image: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            isAvailable: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        mealId: string;
        quantity: number;
    }>;
    updateItemQuantity: (userId: string, mealId: string, quantity: number) => Promise<{
        meal: {
            id: string;
            name: string;
            image: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            isAvailable: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        mealId: string;
        quantity: number;
    }>;
    removeItemFromCart: (userId: string, mealId: string) => Promise<{
        message: string;
    }>;
    clearCart: (userId: string) => Promise<{
        message: string;
        itemsRemoved: number;
    }>;
};
//# sourceMappingURL=cart.service.d.ts.map