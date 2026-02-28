export declare const categoryService: {
    getAllCategories: ({ page, limit, skip, sortBy, sortOrder, search, isActive }: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
        search?: string;
        isActive?: boolean;
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
            image: string | null;
            isActive: boolean;
            description: string | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
};
//# sourceMappingURL=category.service.d.ts.map