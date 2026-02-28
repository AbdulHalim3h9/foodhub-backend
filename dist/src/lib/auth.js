"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const plugins_1 = require("better-auth/plugins");
// If your Prisma file is located elsewhere, you can change the path
const prisma_2 = require("./prisma");
exports.auth = (0, better_auth_1.betterAuth)({
    trustedOrigins: ["http://localhost:3000", "https://localhost:3000"],
    database: (0, prisma_1.prismaAdapter)(prisma_2.prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "CUSTOMER",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            },
            address: {
                type: "string",
                required: false,
            },
            // Provider-specific fields
            businessName: {
                type: "string",
                required: false,
            },
            businessDescription: {
                type: "string",
                required: false,
            },
            businessPhone: {
                type: "string",
                required: false,
            },
            businessAddress: {
                type: "string",
                required: false,
            },
            website: {
                type: "string",
                required: false,
            },
            cuisine: {
                type: "string",
                required: false,
            },
            deliveryRadius: {
                type: "number",
                required: false,
            },
            openingHours: {
                type: "string",
                required: false,
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 30, // 30 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
            enabled: true,
            maxAge: 300, // 5 minutes
        },
    },
    plugins: [
        (0, plugins_1.customSession)(async ({ user, session }) => {
            return {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    emailVerified: user.emailVerified,
                },
                session,
            };
        }),
    ],
});
//# sourceMappingURL=auth.js.map