// src/router.tsx
import {
  createRouter as createTanStackRouter,
  ErrorComponent,
} from "@tanstack/solid-router";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
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
