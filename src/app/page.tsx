"use client";
import Link from "next/link";
import { handleEmailSubmit } from "./actions";
import { toast } from "sonner";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4">
        <h1 className="text-center text-4xl font-bold md:text-5xl">
          Vote for Outstanding Wrestler
        </h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const emailToast = toast.loading("Validating Email", {
              id: "emailValidation",
            });
            const form = e.target as HTMLFormElement;
            const email = form.elements.namedItem("email") as HTMLInputElement;
            const validatedEmail = await handleEmailSubmit(email.value);
            if (validatedEmail.success) {
              toast.success(validatedEmail.message, { id: emailToast });
            } else {
              toast.error(JSON.stringify(validatedEmail.message), {
                id: emailToast,
              });
            }
          }}
          className="fieldset w-sm"
        >
          <div className="flex w-full flex-row items-center justify-center gap-4">
            <div>
              <label className="input input-lg md:input-xl input-primary validator join-item">
                <svg
                  className="h-[1em] opacity-50"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </g>
                </svg>
                <input name="email" type="text" placeholder="email" />
              </label>
              <div className="validator-hint hidden">
                Enter valid email address
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-md md:btn-lg btn-circle btn-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-7 stroke-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
              </svg>
            </button>
          </div>
        </form>
        <div className="flex flex-row flex-wrap justify-center gap-1">
          <div role="alert" className="alert alert-info alert-soft w-full">
            To avoid people voting a million times. We unfortunately will have
            to send you a vote email. If you are having trouble with the link in
            your email. Please copy the code provided and click below.
          </div>
          <Link href={"/enter-vote-code"} className="link link-secondary">
            Click here to enter vote code
          </Link>
        </div>
      </div>
    </main>
  );
}
