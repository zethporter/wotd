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
import {
  getAllWrestlers,
  getAllVotes,
  updateWrestler,
  addWrestlers,
  deleteWrestler,
} from "@/serverFunctions/tursoFunctions";
import { Toaster } from "@/components/ui/sonner";

import appCss from "@/styles/app.css?url";
import { toast } from "sonner";
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
    onInsert: async ({ transaction }) => {
      const newWrestlers = transaction.mutations.map((m) => m.modified);
      const response = await addWrestlers({ data: newWrestlers });
      if (response.code === 200) {
        toast.success(response.message);
        return response.data;
      }
      if (response.code === 500) {
        toast.error(response.message);
        return { refetch: false };
      }
      toast.info("Something went wrong");
      return { refetch: false };
    },
    onUpdate: async ({ transaction }) => {
      const wrestlers = transaction.mutations.map((m) => ({
        id: m.key,
        changes: m.changes,
      }));
      for (const wrestler of wrestlers) {
        try {
          const response = await updateWrestler({
            data: { id: wrestler.id, newValues: wrestler.changes },
          });
          switch (response.code) {
            case 200:
              toast.success(response.message);
              break;
            case 400:
              toast.warning(response.message);
              break;
            default:
              toast.error("Something went wrong");
          }
        } catch {
          toast.error("Something went wronger");
        }
      }
    },
    onDelete: async ({ transaction }) => {
      const wrestlers = transaction.mutations.map((m) => m.key);
      for (const wrestler of wrestlers) {
        try {
          const response = await deleteWrestler({
            data: wrestler,
          });
          switch (response.code) {
            case 200:
              toast.success(response.message);
              break;
            case 500:
              toast.error(response.message);
              break;
            default:
              toast.error("Something went wrong");
          }
        } catch {
          toast.error("Something went wronger");
        }
      }
    },
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
              <Toaster />
            </body>
          </FingerprintProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </html>
  );
}
