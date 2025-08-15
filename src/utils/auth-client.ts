import { createAuthClient } from "better-auth/react";

export const { useSession, signIn, signOut, signUp, getSession } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    redirectTo: "/manage",
  });
