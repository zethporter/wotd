// src/routes/index.tsx
import * as fs from "node:fs";
import { createFileRoute, useRouter, Link } from "@tanstack/solid-router";
import { createServerFn } from "@tanstack/solid-start";
import { useFingerprint } from "@/providers/FingerprintProvider";

const toast = {
  success: (message: string, options: any) => {
    alert(message);
  },
  error: (message: string, options: any) => {
    alert(message);
  },
  loading: (message: string, options: any) => {
    alert(message);
  },
};

// const filePath = "count.txt";

// async function readCount() {
//   return parseInt(
//     await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
//   );
// }

// const getCount = createServerFn({
//   method: "GET",
// }).handler(() => {
//   return readCount();
// });

// const updateCount = createServerFn({ method: "POST" })
//   .validator((d: number) => d)
//   .handler(async ({ data }) => {
//     const count = await readCount();
//     await fs.promises.writeFile(filePath, `${count + data}`);
//   });

export const Route = createFileRoute("/")({
  component: Home,
  // loader: async () => await getCount(),
});

function Home() {
  const { fingerprint, isLoading } = useFingerprint();

  // Initialize an agent at application startup.

  return (
    <main class="flex min-h-screen flex-col items-center justify-center">
      <div class="bg-base-200 min-h-screen">
        <div class="text-center flex flex-col gap-6 justify-start pt-56">
          <h1 class="text-4xl font-bold"> Vote for Outstanding Wrestler</h1>
          <Link
            to={"/vote"}
            class="btn btn-secondary btn-lg btn-soft w-fit self-center"
          >
            Vote Now!
          </Link>
        </div>
      </div>
    </main>
  );
}
