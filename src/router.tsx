// src/router.tsx
import { createRouter, ErrorComponent } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    defaultPreload: "intent",
    routeTree,
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
    defaultNotFoundComponent: () => (
      <div>
        <h1>Uh oh!</h1>
      </div>
    ),
    scrollRestoration: true,
  });

  return router;
}
