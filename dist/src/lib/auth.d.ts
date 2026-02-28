export declare const auth: import("better-auth").Auth<{
    trustedOrigins: string[];
    database: (options: import("better-auth").BetterAuthOptions) => import("better-auth").DBAdapter<import("better-auth").BetterAuthOptions>;
    user: {
        additionalFields: {
            role: {
                type: "string";
                defaultValue: string;
                required: false;
            };
            phone: {
                type: "string";
                required: false;
            };
            status: {
                type: "string";
                defaultValue: string;
                required: false;
            };
            address: {
                type: "string";
                required: false;
            };
            businessName: {
                type: "string";
                required: false;
            };
            businessDescription: {
                type: "string";
                required: false;
            };
            businessPhone: {
                type: "string";
                required: false;
            };
            businessAddress: {
                type: "string";
                required: false;
            };
            website: {
                type: "string";
                required: false;
            };
            cuisine: {
                type: "string";
                required: false;
            };
            deliveryRadius: {
                type: "number";
                required: false;
            };
            openingHours: {
                type: "string";
                required: false;
            };
        };
    };
    emailAndPassword: {
        enabled: true;
    };
    session: {
        expiresIn: number;
        updateAge: number;
        cookieCache: {
            enabled: true;
            maxAge: number;
        };
    };
    plugins: [{
        id: "custom-session";
        hooks: {
            after: {
                matcher: (ctx: import("better-auth").HookEndpointContext) => boolean;
                handler: (inputContext: import("better-auth").MiddlewareInputContext<import("better-auth").MiddlewareOptions>) => Promise<{
                    user: {
                        id: string;
                        name: string;
                        email: string;
                        role: any;
                        emailVerified: any;
                    };
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                }[] | undefined>;
            }[];
        };
        endpoints: {
            getSession: import("better-auth").StrictEndpoint<"/get-session", {
                method: "GET";
                query: import("better-auth").ZodOptional<import("better-auth").ZodObject<{
                    disableCookieCache: import("better-auth").ZodOptional<import("better-auth").ZodUnion<[import("better-auth").ZodBoolean, import("better-auth").ZodPipe<import("better-auth").ZodString, import("better-auth").ZodTransform<boolean, string>>]>>;
                    disableRefresh: import("better-auth").ZodOptional<import("better-auth").ZodBoolean>;
                }, import("better-auth").$strip>>;
                metadata: {
                    CUSTOM_SESSION: boolean;
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            nullable: boolean;
                                            items: {
                                                $ref: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
                requireHeaders: true;
            }, {
                user: {
                    id: string;
                    name: string;
                    email: string;
                    role: any;
                    emailVerified: any;
                };
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                };
            } | null>;
        };
        $Infer: {
            Session: {
                user: {
                    id: string;
                    name: string;
                    email: string;
                    role: any;
                    emailVerified: any;
                };
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined;
                    userAgent?: string | null | undefined;
                };
            };
        };
        options: import("better-auth/plugins").CustomSessionPluginOptions | undefined;
    }];
}>;
//# sourceMappingURL=auth.d.ts.map