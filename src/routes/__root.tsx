// src/routes/__root.tsx
/// <reference types="vite/client" />
import { Outlet, createRootRoute } from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { QueryClientProvider } from "@tanstack/solid-query";
import { FingerprintProvider } from "@/providers/FingerprintProvider";

import appCss from "../styles/app.css?url";

import { queryClient } from "@/router";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "wotd",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <FingerprintProvider>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <TanStackRouterDevtools />
      </QueryClientProvider>
    </FingerprintProvider>
  );
}
