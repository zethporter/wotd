// src/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouteContext, Link } from "@tanstack/react-router";
// import { useFingerprint } from "@/components/fingerprint-provider";
import { Button } from "@/components/ui/button";
import { AuroraText } from "@/components/magicui/aurora-text";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="min-h-screen relative">
        <div className="text-center flex flex-col gap-6 justify-start pt-56">
          <h1 className="text-4xl font-bold text-primary flex flex-col gap-2">
            <span>Vote for</span>{" "}
            <AuroraText
              colors={["#3a5ba0", "#f7c873", "#6ea3c1", "#a04a6c"]}
              speed={0.7}
            >
              Outstanding Wrestler
            </AuroraText>
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
