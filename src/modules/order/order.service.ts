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
            status: "ACTIVE"
        }
    });

    if (!user) {
        throw new Error("User not found or inactive!");
    }

    // Validate items and calculate total
    if (!orderData.items || orderData.items.length === 0) {
        throw new Error("Order must contain at least one item!");
    }

    const mealIds = orderData.items.map(item => item.mealId);
    const meals = await prisma.meal.findMany({
        where: {
            id: { in: mealIds },
            isAvailable: true
        }
    });

    if (meals.length !== mealIds.length) {
        throw new Error("Some meals are not available!");
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
                providerId: meals[0]!.providerId, // Assuming all meals from same provider
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
}

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

export const orderService = {
    createOrder,
    getMyOrders,
    getOrderById
}
