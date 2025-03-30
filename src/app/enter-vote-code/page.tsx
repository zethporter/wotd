"use client";
import Link from "next/link";

export default function EnterVoteCode() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4">
        <h1 className="text-center text-4xl font-bold md:text-5xl">
          Enter{" "}
          <span className="from-primary to-accent bg-gradient-to-r bg-clip-text font-extrabold text-transparent">
            Vote Code
          </span>{" "}
          from your email
        </h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const voteCode = form.elements.namedItem(
              "voteCode",
            ) as HTMLInputElement;
            // const validatedEmail = await handleEmailSubmit(email.value);
            console.log("voteCode!", voteCode);
          }}
          className="fieldset w-sm md:w-md"
        >
          <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2">
            <div className="grow">
              <label className="input input-lg md:input-xl input-secondary validator join-item w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>

                <input name="voteCode" type="text" placeholder="code" />
              </label>
              <div className="validator-hint hidden">
                Enter Vote code from your email
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-md md:btn-lg btn-circle btn-secondary"
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
            <Link href={"/"} className="link link-primary w-full text-center">
              Missing Code? Click here to request a code
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
