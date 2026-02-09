// Cart service - Cart management for users
import { prisma } from "../../lib/prisma";

const getCart = async (userId: string) => {
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

    // Get cart items with meal details
    const cartItems = await prisma.cartItem.findMany({
        where: {
            userId: userId
        },
        include: {
            meal: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                    price: true,
                    cuisine: true,
                    isVegan: true,
                    isAvailable: true,
                    provider: {
                        select: {
                            id: true,
                            businessName: true,
                            phone: true,
                            address: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Calculate total amount
    const totalAmount = cartItems.reduce((total: number, item: any) => {
        if (!item.meal.isAvailable) {
            return total; // Skip unavailable items
        }
        return total + (Number(item.meal.price) * item.quantity);
    }, 0);

    // Filter out unavailable items
    const availableItems = cartItems.filter((item: any) => item.meal.isAvailable);

    return {
        items: availableItems,
        totalAmount,
        itemCount: availableItems.reduce((count: number, item: any) => count + item.quantity, 0)
    };
}

const addItemToCart = async (userId: string, itemData: {
    mealId: string;
    quantity: number;
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

    // Validate meal exists and is available
    const meal = await prisma.meal.findUnique({
        where: {
            id: itemData.mealId,
            isAvailable: true
        }
    });

    if (!meal) {
        throw new Error("Meal not found or not available!");
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
        where: {
            userId_mealId: {
                userId: userId,
                mealId: itemData.mealId
            }
        }
    });

    if (existingCartItem) {
        // Update quantity if item exists
        const updatedItem = await prisma.cartItem.update({
            where: {
                id: existingCartItem.id
            },
            data: {
                quantity: existingCartItem.quantity + itemData.quantity
            },
            include: {
                meal: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        price: true,
                        isAvailable: true
                    }
                }
            }
        });
        return updatedItem;
    } else {
        // Create new cart item
        const newCartItem = await prisma.cartItem.create({
            data: {
                userId: userId,
                mealId: itemData.mealId,
                quantity: itemData.quantity
            },
            include: {
                meal: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        price: true,
                        isAvailable: true
                    }
                }
            }
        });
        return newCartItem;
    }
}

const updateItemQuantity = async (userId: string, mealId: string, quantity: number) => {
    // Validate quantity
    if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0!");
    }

    // Check if cart item exists
    const cartItem = await prisma.cartItem.findUnique({
        where: {
            userId_mealId: {
                userId: userId,
                mealId: mealId
            }
        },
        include: {
            meal: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    price: true,
                    isAvailable: true
                }
            }
        }
    });

    if (!cartItem) {
        throw new Error("Item not found in cart!");
    }

    // Update quantity
    const updatedItem = await prisma.cartItem.update({
        where: {
            id: cartItem.id
        },
        data: {
            quantity: quantity
        },
        include: {
            meal: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    price: true,
                    isAvailable: true
                }
            }
        }
    });

    return updatedItem;
}

const removeItemFromCart = async (userId: string, mealId: string) => {
    // Check if cart item exists
    const cartItem = await prisma.cartItem.findUnique({
        where: {
            userId_mealId: {
                userId: userId,
                mealId: mealId
            }
        }
    });

    if (!cartItem) {
        throw new Error("Item not found in cart!");
    }

    // Remove item
    await prisma.cartItem.delete({
        where: {
            id: cartItem.id
        }
    });

    return { message: "Item removed from cart successfully!" };
}

const clearCart = async (userId: string) => {
    // Delete all cart items for user
    const result = await prisma.cartItem.deleteMany({
        where: {
            userId: userId
        }
    });

    return { 
        message: "Cart cleared successfully!",
        itemsRemoved: result.count 
    };
}

export const cartService = {
    getCart,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
}
