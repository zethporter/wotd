import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
// import { createResource, Show } from "solid-js";
import { useFingerprint } from "@/components/fingerprint-provider";
import { getWrestlers } from "@/serverFunctions/tursoFunctions";

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
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    queryFn: async ({ pageParam }) =>
      await getWrestlers({
        data: { cursor: pageParam, pageSize: 2, search: "" },
      }),
    initialPageParam: "",
    getNextPageParam: (lastPage, pages) => lastPage.pagination.lastCursor,
  });

  return status === "pending" ? (
    <p>Loading...</p>
  ) : status === "error" ? (
    <p>Error: {error.message}</p>
  ) : (
    <>
      {data.pages.map((group, i) => (
        <React.Fragment key={i}>
          {group.data.map((project) => (
            <p key={project.id}>{`${project.name} | ${project.school}`}</p>
          ))}
        </React.Fragment>
      ))}
      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </>
  );
}
