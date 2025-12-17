import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor, oneTap, organization, admin } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db/auth"; // your drizzle instance
import * as schema from "@/db/schema/auth";
import { adminClient } from "better-auth/client/plugins";
import { ac, manager } from "./permissions";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite",
    schema: {
      ...schema,
    },
  }),
  appName: "Wrestler of the Day",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      // accessType: "offline",
      // propt: "select_account consent"
    },
  },
  plugins: [
    twoFactor(),
    oneTap(),
    tanstackStartCookies(),
    organization(),
    admin({
      adminUserIds: ["RHwN7O1v7PbwkBc7bJuf9lOiQP67UB7e"],
      plugins: [
        adminClient({
          ac,
          roles: {
            manager,
          },
        }),
      ],
    }),
  ],
});
