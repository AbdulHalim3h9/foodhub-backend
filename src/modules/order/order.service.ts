// Order service - Create order, list my orders, get order details, update status (provider)
import { prisma } from "../../lib/prisma";

const createOrder = async (userId: string, orderData: {
    items: {
        mealId: string;
        quantity: number;
    }[];
    deliveryAddress: string;
    deliveryPhone: string;
    specialInstructions?: string;
}) => {
    // Validate user exists and is active
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
            isActive: true
        }
    });

    if (!user) {
        throw new Error("User not found or inactive!");
    }

    // Validate items and calculate total
    if (!orderData.items || orderData.items.length === 0) {
        throw new Error("Order must contain at least one item!");
    }

    // Get unique meal IDs to handle multiple quantities of same meal
    const mealIds = [...new Set(orderData.items.map(item => item.mealId))];
    
    const meals = await prisma.meal.findMany({
        where: {
            id: { in: mealIds },
            isAvailable: true
        }
    });

    if (meals.length !== mealIds.length) {
        throw new Error("Some meals are not available!");
    }

    // Validate all meals are from same provider
    const providerIds = [...new Set(meals.map(meal => meal.providerId))];
    if (providerIds.length > 1) {
        throw new Error("All meals must be from same provider!");
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItems = orderData.items.map(item => {
        const meal = meals.find(m => m.id === item.mealId);
        if (!meal) {
            throw new Error(`Meal ${item.mealId} not found!`);
        }
        const itemTotal = Number(meal.price) * item.quantity;
        totalAmount += itemTotal;
        return {
            mealId: item.mealId,
            quantity: item.quantity,
            price: meal.price
        };
    });

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order with transaction
    const result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                orderNumber,
                customerId: userId,
                providerId: providerIds[0]!, // All meals from same provider
                status: "PENDING",
                totalAmount,
                deliveryAddress: orderData.deliveryAddress,
                deliveryPhone: orderData.deliveryPhone,
                specialInstructions: orderData.specialInstructions || null,
                estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
            }
        });

        // Create order items
        await tx.orderItem.createMany({
            data: orderItems.map(item => ({
                orderId: order.id,
                mealId: item.mealId,
                quantity: item.quantity,
                price: item.price
            }))
        });

        return order;
    });

    return result;
};

const getMyOrders = async (userId: string, {
    page,
    limit,
    skip,
    sortBy,
    sortOrder
}: {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string
}) => {
    const orders = await prisma.order.findMany({
        take: limit,
        skip,
        where: {
            customerId: userId
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            provider: {
                select: {
                    id: true,
                    businessName: true,
                    phone: true,
                    address: true
                }
            },
            items: {
                include: {
                    meal: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            price: true
                        }
                    }
                }
            }
        }
    });

    const total = await prisma.order.count({
        where: {
            customerId: userId
        }
    });

    return {
        data: orders,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getOrderById = async (orderId: string, userId: string) => {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            customerId: userId
        },
        include: {
            provider: {
                select: {
                    id: true,
                    businessName: true,
                    phone: true,
                    address: true,
                    user: {
                        select: {
                            name: true,
                            image: true
                        }
                    }
                }
            },
            items: {
                include: {
                    meal: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            image: true,
                            price: true,
                            cuisine: true,
                            isVegan: true
                        }
                    }
                }
            }
        }
    });

    if (!order) {
        throw new Error("Order not found!");
    }

    return order;
}

// Admin order management methods
const getAllOrders = async ({
    limit,
    skip,
    sortBy,
    sortOrder,
    search,
    status,
    customerId,
    providerId
}: {
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
    search?: string;
    status?: string;
    customerId?: string;
    providerId?: string;
}) => {
    const where: any = {};

    // Apply filters
    if (search) {
        where.OR = [
            { id: { contains: search, mode: 'insensitive' } },
            { customer: { name: { contains: search, mode: 'insensitive' } } },
            { customer: { email: { contains: search, mode: 'insensitive' } } },
            { provider: { name: { contains: search, mode: 'insensitive' } } },
        ];
    }

    if (status) {
        where.status = status;
    }

    if (customerId) {
        where.customerId = customerId;
    }

    if (providerId) {
        where.providerId = providerId;
    }

    const orders = await prisma.order.findMany({
        take: limit,
        skip,
        where,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                }
            },
            provider: {
                select: {
                    id: true,
                    businessName: true,
                    phone: true,
                    user: {
                        select: {
                            email: true,
                        }
                    }
                }
            },
            items: {
                include: {
                    meal: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                        }
                    }
                }
            }
        }
    });

    const total = await prisma.order.count({ where });

    return {
        data: orders,
        pagination: {
            total,
            page: Math.floor(skip / limit) + 1,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const updateOrderStatus = async (orderId: string, status: string) => {
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
        where: { id: orderId }
    });

    if (!existingOrder) {
        throw new Error("Order not found!");
    }

    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status! Must be one of: PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED");
    }

    const result = await prisma.order.update({
        where: { id: orderId },
        data: { status: status as any }
    });

    return result;
}

export const orderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
}
