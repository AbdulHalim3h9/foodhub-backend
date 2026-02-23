import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
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
        defaultValue: "user",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "active",
        required: false,
      },
      address: {
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
    customSession(async ({ user, session }) => {
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: (user as any).role,
        },
        session,
      };
    }),
  ],
});
