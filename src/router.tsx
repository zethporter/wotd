// src/router.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import {
  createRouter as createTanStackRouter,
  ErrorComponent,
} from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient();

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    context: {
      queryClient,
    },
    Wrap: () => QueryClientProvider({ client: queryClient }),
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
