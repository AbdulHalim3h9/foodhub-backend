// Order service - Create order, list my orders, get order details, update status (provider)
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../../prisma/generated/prisma/client";
const createOrder = async (userId, orderData) => {
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
    // Validate quantity
    if (!orderData.quantity || orderData.quantity <= 0) {
        throw new Error("Quantity must be greater than 0!");
    }
    // Get meal details and validate it exists
    const meal = await prisma.meal.findUnique({
        where: { id: orderData.mealId }
    });
    if (!meal) {
        throw new Error("Meal not found!");
    }
    // Calculate total amount using Decimal
    const pricePerItem = new Prisma.Decimal(meal.price.toString());
    const totalAmount = pricePerItem.mul(orderData.quantity);
    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    // Create order
    const result = await prisma.order.create({
        data: {
            orderNumber,
            customerId: userId,
            providerId: meal.providerId,
            mealId: orderData.mealId,
            quantity: orderData.quantity,
            pricePerItem: pricePerItem,
            totalAmount: totalAmount,
            status: "PENDING",
            deliveryAddress: orderData.deliveryAddress,
            deliveryPhone: orderData.deliveryPhone,
            specialInstructions: orderData.specialInstructions || null,
            estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
        },
        include: {
            meal: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                    price: true
                }
            },
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true
                }
            },
            provider: {
                select: {
                    id: true,
                    businessName: true,
                    phone: true
                }
            }
        }
    });
    return result;
};
const getMyOrders = async (userId, { page, limit, skip, sortBy, sortOrder }) => {
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
            meal: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                    price: true,
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            provider: {
                select: {
                    id: true,
                    businessName: true,
                    phone: true,
                    address: true
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
};
const getProviderOrders = async (providerId, { page, limit, skip, sortBy, sortOrder, status }) => {
    console.log(`🔍 [PROVIDER ORDERS] Fetching orders for providerId: ${providerId}`);
    console.log(`🔍 [PROVIDER ORDERS] Filters:`, { page, limit, skip, sortBy, sortOrder, status });
    const where = {
        providerId
    };
    // Apply status filter if provided
    if (status) {
        where.status = status;
    }
    console.log(`🔍 [PROVIDER ORDERS] Query where clause:`, where);
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
                    address: true
                }
            },
            meal: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    price: true,
                    description: true
                }
            }
        }
    });
    console.log(`🔍 [PROVIDER ORDERS] Found ${orders.length} orders`);
    const total = await prisma.order.count({
        where
    });
    console.log(`🔍 [PROVIDER ORDERS] Total orders count: ${total}`);
    return {
        data: orders,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const getOrderById = async (orderId, userId) => {
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            customerId: userId
        },
        include: {
            meal: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                    price: true,
                    category: {
                        select: {
                            name: true
                        }
                    }
                }
            },
            provider: {
                select: {
                    id: true,
                    businessName: true,
                    phone: true,
                    address: true
                }
            }
        }
    });
    if (!order) {
        throw new Error("Order not found!");
    }
    return order;
};
// Admin order management methods
const getAllOrders = async ({ limit, skip, sortBy, sortOrder, search, status, customerId, providerId }) => {
    const where = {};
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
                    phone: true
                }
            },
            meal: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    image: true
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
};
const updateOrderStatus = async (orderId, status) => {
    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
        where: { id: orderId }
    });
    if (!existingOrder) {
        throw new Error("Order not found!");
    }
    if (existingOrder.status === 'DELIVERED') {
        throw new Error("Delivered orders cannot be updated!");
    }
    // Validate status
    const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
        throw new Error("Invalid status! Must be one of: PENDING, CONFIRMED, PREPARING, READY, OUT_FOR_DELIVERY, DELIVERED, CANCELLED");
    }
    const result = await prisma.order.update({
        where: { id: orderId },
        data: { status: status }
    });
    return result;
};
export const orderService = {
    createOrder,
    getMyOrders,
    getProviderOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};
//# sourceMappingURL=order.service.js.map