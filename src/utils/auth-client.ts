import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";

export const { useSession, signIn, signOut, signUp, getSession, admin } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    redirectTo: "/manage",
    plugins: [adminClient(), organizationClient()],
  });
