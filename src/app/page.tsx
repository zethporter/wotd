"use client";
import { handleEmailSubmit } from "./actions";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-bold">Vote for Outstanding Wrestler</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const email = form.elements.namedItem("email") as HTMLInputElement;
            const validatedEmail = await handleEmailSubmit(email.value);
            console.log("validatedEmail!", validatedEmail);
          }}
          className="fieldset w-sm"
        >
          <div className="flex flex-row gap-4">
            <div>
              <label className="input input-xl input-primary validator join-item">
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
            <button type="submit" className="btn btn-xl btn-circle btn-primary">
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
        <div role="alert" className="alert alert-info alert-soft">
          To avoid people voting a million times. We unfortunately will have to
          send you a vote email. If you are having trouble with the link in your
          email. Please copy the code provided and click here.
        </div>
      </div>
    </main>
  );
}
