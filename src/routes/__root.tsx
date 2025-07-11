// src/routes/__root.tsx
/// <reference types="vite/client" />
import { Outlet, createRootRoute } from "@tanstack/solid-router";
import { FingerprintProvider } from "@/providers/FingerprintProvider";

import appCss from "../styles/app.css?url";

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
      <Outlet />
    </FingerprintProvider>
  );
}
