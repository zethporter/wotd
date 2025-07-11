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
      <div class="container mx-auto flex flex-col items-center justify-center gap-12 px-4">
        <h1 class="text-center text-4xl font-bold md:text-5xl">
          Vote for Outstanding Wrestler
        </h1>
        <div>{isLoading() ? "loading fingerprint" : fingerprint()}</div>
        {/* <form
          onSubmit={async (e) => {
            e.preventDefault();
            const emailToast = toast.loading("Validating Email", {
              id: "emailValidation",
            });
            const form = e.target as HTMLFormElement;
            const email = form.elements.namedItem("email") as HTMLInputElement;
            // const validatedEmail = await alert(email.value);
            const validatedEmail = {
              success: true,
              message: "email validated",
            };
            if (validatedEmail.success) {
              toast.success(validatedEmail.message, { id: emailToast });
            } else {
              toast.error("Invalid Email", {
                id: emailToast,
              });
            }
          }}
          class="fieldset w-sm"
        >
          <div class="flex w-full flex-row items-center justify-center gap-4">
            <div>
              <label class="input input-lg md:input-xl input-primary validator join-item">
                <svg
                  class="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    stroke-linejoin="round"
                    stroke-linecap="round"
                    stroke-width="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input name="email" type="text" placeholder="email" />
              </label>
              <div class="validator-hint hidden">Enter valid email address</div>
            </div>
            <button
              type="submit"
              class="btn btn-md md:btn-lg btn-circle btn-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-7 stroke-3"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
              </svg>
            </button>
          </div>
        </form> */}
        <Link to={"/vote"} class="btn btn-secondary btn-lg btn-soft">
          Vote!
        </Link>
        <div class="flex flex-row flex-wrap justify-center gap-1">
          <div role="alert" class="alert alert-info alert-soft w-full">
            To avoid people voting a million times. We unfortunately will have
            to send you a vote email. If you are having trouble with the link in
            your email. Please copy the code provided and click below.
          </div>
          <Link to={"/enter-vote-code"} class="link link-secondary">
            Click here to enter vote code
          </Link>
        </div>
      </div>
    </main>
  );
}
