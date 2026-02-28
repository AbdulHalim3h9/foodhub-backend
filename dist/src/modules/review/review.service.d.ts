export declare const reviewService: {
    getMealReviews: ({ mealId, page, limit, skip, sortBy, sortOrder }: {
        mealId: string;
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
    }) => Promise<{
        data: ({
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
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createReview: (customerId: string, mealId: string, reviewData: {
        rating: number;
        comment?: string;
    }) => Promise<{
        meal: {
            id: string;
            name: string;
        };
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
    }>;
    updateReview: (customerId: string, reviewId: string, reviewData: {
        rating?: number;
        comment?: string;
    }) => Promise<{
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
    }>;
    deleteReview: (customerId: string, reviewId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        mealId: string;
        rating: number;
        comment: string | null;
    }>;
};
//# sourceMappingURL=review.service.d.ts.map