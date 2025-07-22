import { createFileRoute } from "@tanstack/react-router";
// import { createResource, Show } from "solid-js";
// import { useFingerprint } from "@/providers/FingerprintProvider";

export const Route = createFileRoute("/vote")({
  component: RouteComponent,
});
// src/routes/index.tsx

// Function to generate the fingerprint
// This function will only be executed on the client
// async function getFingerprint() {
//   if (typeof window !== "undefined") {
//     const FingerprintJS = await import("@fingerprintjs/fingerprintjs");
//     const fp = await FingerprintJS.load();
//     const result = await fp.get();
//     return result.visitorId;
//   }
//   return null; // Return null if not on the client
// }

export default function RouteComponent() {
  // const { fingerprint, isLoading } = useFingerprint();

  return (
    <div>
      <h1>Welcome to the Fingerprinting Page!</h1>

      {/* <Show when={isLoading()} fallback={<p>{fingerprint()}</p>}>
        <p>Loading fingerprint...</p>
      </Show> */}

      <p>
        This fingerprint is generated client-side using{" "}
        <code>@fingerprintjs/fingerprintjs</code>.
      </p>
    </div>
  );
}
