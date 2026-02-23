import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "https://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
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
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  // session: {
  //   expiresIn: 60 * 60 * 24 * 30, // 30 days
  //   updateAge: 60 * 60 * 24, // 1 day
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 300,
  //   },
  // },
});
