// src/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { FingerprintProvider } from "@/components/fingerprint-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { getAllWrestlers, getAllVotes } from "@/serverFunctions/tursoFunctions";

// Create a client
export const queryClient = new QueryClient();

// Create TanStack DB instance
export const wrestlersCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["allWrestlers"],
    queryFn: async () => {
      const wrestlersData = await getAllWrestlers();
      return wrestlersData.data;
    },
    queryClient,
    getKey: (item) => item.id,
  }),
);

export const votesCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["votes"],
    queryFn: async () => {
      const votesData = await getAllVotes();
      return votesData.data;
    },
    queryClient,
    getKey: (item) => item.id,
  }),
);

import appCss from "@/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <FingerprintProvider
            defaultFingerprint={null}
            storageKey="calculated-fingerprint"
          >
            <body>
              {children}
              <Scripts />
              <ModeToggle />
            </body>
          </FingerprintProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </html>
  );
}
