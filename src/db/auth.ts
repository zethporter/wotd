import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_BETTER_AUTH_CONNECTION_URL!,
    authToken: process.env.TURSO_BETTER_AUTH_TOKEN!,
  },
});
