// src/router.tsx
import {
  createRouter as createTanStackRouter,
  ErrorComponent,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
// import { QueryClient } from "@tanstack/react-query";

// export const queryClient = new QueryClient();

export function createRouter() {
  const router = createTanStackRouter({
    defaultPreload: "intent",
    routeTree,
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    scrollRestoration: true,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
