import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor, oneTap } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "@/db/auth"; // your drizzle instance
import * as schema from "@/db/schema/auth";

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
  plugins: [twoFactor(), oneTap(), reactStartCookies()],
});
