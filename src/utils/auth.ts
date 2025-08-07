import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { twoFactor, oneTap } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { db } from "@/db/auth"; // your drizzle instance

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "mysql", "sqlite"
  }),
  appName: "Wrestler of the Day",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [twoFactor(), oneTap(), reactStartCookies()],
});
