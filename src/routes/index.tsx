// src/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouteContext, Link } from "@tanstack/react-router";
import { ModeToggle } from "@/components/mode-toggle";
import { useFingerprint } from "@/components/fingerprint-provider";

export const Route = createFileRoute("/")({
  component: Home,
  // loader: async () => await getCount(),
});

function Home() {
  const fp = useFingerprint();

  console.debug("fp", { fp });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="bg-base-200 min-h-screen">
        <div className="text-center flex flex-col gap-6 justify-start pt-56">
          <h1 className="text-4xl font-bold"> Vote for Outstanding Wrestler</h1>
          <Link
            to={"/vote"}
            className="btn btn-secondary btn-lg btn-soft w-fit self-center"
          >
            Vote Now!
          </Link>
          <ModeToggle />
        </div>
      </div>
    </main>
  );
}
