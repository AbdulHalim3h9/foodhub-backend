export declare const cuisineService: {
    getAllCuisines: ({ page, limit, skip, sortBy, sortOrder, search, }: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
        search?: string;
    }) => Promise<{
        data: ({
            _count: {
                meals: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
};
//# sourceMappingURL=cuisine.service.d.ts.map