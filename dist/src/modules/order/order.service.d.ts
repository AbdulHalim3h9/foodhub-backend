export declare const orderService: {
    createOrder: (userId: string, orderData: {
        mealId: string;
        quantity: number;
        deliveryAddress: string;
        deliveryPhone: string;
        specialInstructions?: string;
    }) => Promise<{
        meal: {
            id: string;
            name: string;
            image: string | null;
            description: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
        };
        provider: {
            phone: string;
            businessName: string;
            id: string;
        };
        customer: {
            phone: string | null;
            address: string | null;
            id: string;
            email: string;
            name: string;
        };
    } & {
        status: import("../../../prisma/generated/prisma/enums").OrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        providerId: string;
        customerId: string;
        mealId: string;
        orderNumber: string;
        quantity: number;
        pricePerItem: import("@prisma/client-runtime-utils").Decimal;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        deliveryAddress: string;
        deliveryPhone: string;
        specialInstructions: string | null;
        estimatedDeliveryTime: Date | null;
        actualDeliveryTime: Date | null;
    }>;
    getMyOrders: (userId: string, { page, limit, skip, sortBy, sortOrder }: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
    }) => Promise<{
        data: ({
            meal: {
                id: string;
                name: string;
                image: string | null;
                description: string | null;
                category: {
                    name: string;
                } | null;
                price: import("@prisma/client-runtime-utils").Decimal;
            };
            provider: {
                phone: string;
                address: string;
                businessName: string;
                id: string;
            };
        } & {
            status: import("../../../prisma/generated/prisma/enums").OrderStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            providerId: string;
            customerId: string;
            mealId: string;
            orderNumber: string;
            quantity: number;
            pricePerItem: import("@prisma/client-runtime-utils").Decimal;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            deliveryAddress: string;
            deliveryPhone: string;
            specialInstructions: string | null;
            estimatedDeliveryTime: Date | null;
            actualDeliveryTime: Date | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProviderOrders: (providerId: string, { page, limit, skip, sortBy, sortOrder, status }: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
        status?: string;
    }) => Promise<{
        data: ({
            meal: {
                id: string;
                name: string;
                image: string | null;
                description: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
            };
            customer: {
                phone: string | null;
                address: string | null;
                id: string;
                email: string;
                name: string;
            };
        } & {
            status: import("../../../prisma/generated/prisma/enums").OrderStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            providerId: string;
            customerId: string;
            mealId: string;
            orderNumber: string;
            quantity: number;
            pricePerItem: import("@prisma/client-runtime-utils").Decimal;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            deliveryAddress: string;
            deliveryPhone: string;
            specialInstructions: string | null;
            estimatedDeliveryTime: Date | null;
            actualDeliveryTime: Date | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOrderById: (orderId: string, userId: string) => Promise<{
        meal: {
            id: string;
            name: string;
            image: string | null;
            description: string | null;
            category: {
                name: string;
            } | null;
            price: import("@prisma/client-runtime-utils").Decimal;
        };
        provider: {
            phone: string;
            address: string;
            businessName: string;
            id: string;
        };
    } & {
        status: import("../../../prisma/generated/prisma/enums").OrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        providerId: string;
        customerId: string;
        mealId: string;
        orderNumber: string;
        quantity: number;
        pricePerItem: import("@prisma/client-runtime-utils").Decimal;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        deliveryAddress: string;
        deliveryPhone: string;
        specialInstructions: string | null;
        estimatedDeliveryTime: Date | null;
        actualDeliveryTime: Date | null;
    }>;
    getAllOrders: ({ limit, skip, sortBy, sortOrder, search, status, customerId, providerId }: {
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
        search?: string;
        status?: string;
        customerId?: string;
        providerId?: string;
    }) => Promise<{
        data: ({
            meal: {
                id: string;
                name: string;
                image: string | null;
                price: import("@prisma/client-runtime-utils").Decimal;
            };
            provider: {
                phone: string;
                businessName: string;
                id: string;
            };
            customer: {
                phone: string | null;
                id: string;
                email: string;
                name: string;
            };
        } & {
            status: import("../../../prisma/generated/prisma/enums").OrderStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            providerId: string;
            customerId: string;
            mealId: string;
            orderNumber: string;
            quantity: number;
            pricePerItem: import("@prisma/client-runtime-utils").Decimal;
            totalAmount: import("@prisma/client-runtime-utils").Decimal;
            deliveryAddress: string;
            deliveryPhone: string;
            specialInstructions: string | null;
            estimatedDeliveryTime: Date | null;
            actualDeliveryTime: Date | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateOrderStatus: (orderId: string, status: string) => Promise<{
        status: import("../../../prisma/generated/prisma/enums").OrderStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        providerId: string;
        customerId: string;
        mealId: string;
        orderNumber: string;
        quantity: number;
        pricePerItem: import("@prisma/client-runtime-utils").Decimal;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        deliveryAddress: string;
        deliveryPhone: string;
        specialInstructions: string | null;
        estimatedDeliveryTime: Date | null;
        actualDeliveryTime: Date | null;
    }>;
};
//# sourceMappingURL=order.service.d.ts.map