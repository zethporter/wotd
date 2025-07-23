// src/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouteContext, Link } from "@tanstack/react-router";
// import { useFingerprint } from "@/components/fingerprint-provider";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="min-h-screen relative">
        <div className="text-center flex flex-col gap-6 justify-start pt-56">
          <h1 className="text-4xl font-bold text-primary">
            Vote for Outstanding Wrestler
          </h1>
          <Link to={"/vote"}>
            <Button className="cursor-pointer text-lg font-semibold" size="lg">
              Vote Now
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
