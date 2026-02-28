// Review service - Submit review, get reviews for a meal (post-order only)
import { prisma } from "../../lib/prisma";
const getMealReviews = async ({ mealId, page, limit, skip, sortBy, sortOrder }) => {
    // Check if meal exists
    const meal = await prisma.meal.findFirst({
        where: {
            id: mealId
        }
    });
    if (!meal) {
        throw new Error("Meal not found!");
    }
    const reviews = await prisma.review.findMany({
        take: limit,
        skip,
        where: {
            mealId: mealId
        },
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });
    const total = await prisma.review.count({
        where: {
            mealId: mealId
        }
    });
    return {
        data: reviews,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};
const createReview = async (customerId, mealId, reviewData) => {
    // Validate rating
    if (reviewData.rating < 1 || reviewData.rating > 5) {
        throw new Error("Rating must be between 1 and 5!");
    }
    // Check if meal exists
    const meal = await prisma.meal.findFirst({
        where: {
            id: mealId
        }
    });
    if (!meal) {
        throw new Error("Meal not found!");
    }
    // Check if customer has ordered this meal and the order is delivered
    const order = await prisma.order.findFirst({
        where: {
            mealId: mealId,
            customerId: customerId,
            status: "DELIVERED"
        },
        include: {
            customer: true
        }
    });
    if (!order) {
        throw new Error("You can only review meals from delivered orders!");
    }
    // Check if customer has already reviewed this meal
    const existingReview = await prisma.review.findFirst({
        where: {
            customerId: customerId,
            mealId: mealId
        }
    });
    if (existingReview) {
        throw new Error("You have already reviewed this meal!");
    }
    const result = await prisma.review.create({
        data: {
            rating: reviewData.rating,
            comment: reviewData.comment || null,
            customerId: customerId,
            mealId: mealId
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            },
            meal: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    return result;
};
const updateReview = async (customerId, reviewId, reviewData) => {
    // Validate rating if provided
    if (reviewData.rating !== undefined && (reviewData.rating < 1 || reviewData.rating > 5)) {
        throw new Error("Rating must be between 1 and 5!");
    }
    // Check if review exists and belongs to customer
    const existingReview = await prisma.review.findFirst({
        where: {
            id: reviewId,
            customerId: customerId
        }
    });
    if (!existingReview) {
        throw new Error("Review not found or doesn't belong to you!");
    }
    const result = await prisma.review.update({
        where: {
            id: reviewId
        },
        data: {
            ...(reviewData.rating !== undefined && { rating: reviewData.rating }),
            ...(reviewData.comment !== undefined && { comment: reviewData.comment })
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    image: true
                }
            }
        }
    });
    return result;
};
const deleteReview = async (customerId, reviewId) => {
    // Check if review exists and belongs to customer
    const existingReview = await prisma.review.findFirst({
        where: {
            id: reviewId,
            customerId: customerId
        }
    });
    if (!existingReview) {
        throw new Error("Review not found or doesn't belong to you!");
    }
    const result = await prisma.review.delete({
        where: {
            id: reviewId
        }
    });
    return result;
};
export const reviewService = {
    getMealReviews,
    createReview,
    updateReview,
    deleteReview
};
//# sourceMappingURL=review.service.js.map