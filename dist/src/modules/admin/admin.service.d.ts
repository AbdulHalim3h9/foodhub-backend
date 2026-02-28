export declare const adminService: {
    getAllUsers: ({ page, limit, skip, sortBy, sortOrder, search, role, status }: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
        search?: string;
        role?: string;
        status?: string;
    }) => Promise<{
        data: {
            role: import("../../../prisma/generated/prisma/enums").UserRole;
            phone: string | null;
            status: import("../../../prisma/generated/prisma/enums").UserStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            image: string | null;
            isActive: boolean;
            providerProfile: {
                businessName: string;
                id: string;
                createdAt: Date;
                isActive: boolean;
            } | null;
            _count: {
                orders: number;
                reviews: number;
            };
        }[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    updateUser: (userId: string, updateData: {
        name?: string;
        phone?: string;
        address?: string;
        role?: string;
        status?: string;
        isActive?: boolean;
    }) => Promise<{
        role: import("../../../prisma/generated/prisma/enums").UserRole;
        phone: string | null;
        status: import("../../../prisma/generated/prisma/enums").UserStatus;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        name: string;
        image: string | null;
        isActive: boolean;
        providerProfile: {
            businessName: string;
            id: string;
            createdAt: Date;
            isActive: boolean;
        } | null;
    }>;
    deleteUser: (userId: string) => Promise<{
        role: import("../../../prisma/generated/prisma/enums").UserRole;
        phone: string | null;
        status: import("../../../prisma/generated/prisma/enums").UserStatus;
        address: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image: string | null;
        isActive: boolean;
    }>;
    createCategory: (categoryData: {
        name: string;
        description?: string;
        image?: string;
        isActive?: boolean;
    }) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        image: string | null;
        isActive: boolean;
        description: string | null;
    }>;
    updateCategory: (categoryId: string, categoryData: {
        name?: string;
        description?: string;
        image?: string;
        isActive?: boolean;
    }) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        image: string | null;
        isActive: boolean;
        description: string | null;
    }>;
    deleteCategory: (categoryId: string) => Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        image: string | null;
        isActive: boolean;
        description: string | null;
    }>;
    getAllProviders: ({ page, limit, skip, sortBy, sortOrder, search, isActive, status }: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
        search?: string;
        isActive?: string;
        status?: string;
    }) => Promise<{
        data: ({
            user: {
                status: import("../../../prisma/generated/prisma/enums").UserStatus;
                id: string;
                createdAt: Date;
                email: string;
                name: string;
                image: string | null;
                isActive: boolean;
            };
            _count: {
                meals: number;
            };
        } & {
            phone: string;
            address: string;
            businessName: string;
            website: string | null;
            cuisine: string | null;
            openingHours: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            isActive: boolean;
            description: string | null;
            logo: string | null;
        })[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAllCategories: ({ page, limit, skip, sortBy, sortOrder, search, isActive, providerId }: {
        page: number;
        limit: number;
        skip: number;
        sortBy: string;
        sortOrder: string;
        search?: string;
        isActive?: string;
        providerId?: string;
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
//# sourceMappingURL=admin.service.d.ts.map