import { createFileRoute, useRouteContext } from "@tanstack/solid-router";
import { useInfiniteQuery } from "@tanstack/solid-query";
import { For, createSignal, Show } from "solid-js";
import { getWrestlers } from "@/serverFunctions/mongoFunctions";

export const Route = createFileRoute("/vote-submitted")({
  component: RouteComponent,
});

// src/components/PostsPage.tsx (or directly in src/routes/posts.tsx component)

interface Post {
  id: number;
  title: string;
  body: string;
}

function RouteComponent() {
  const [search, setSearch] = createSignal("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["wrestlers", search],
    queryFn: async ({ pageParam, queryKey }) => {
      // const res = await fetch('/api/projects?cursor=' + pageParam)
      // return res.json()
      return await getWrestlers(pageParam, 10, queryKey[1]);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (
        lastPage.pagination?.currentPage === lastPage.pagination?.totalPages
      ) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });

  return (
    <div>
      <h1>Posts</h1>

      <Show when={isLoading}>
        <p>Loading initial posts...</p>
      </Show>

      <Show when={isError}>
        <p>Error: {error?.message}</p>
      </Show>

      <Show when={data}>
        {/* <For each={data!.pages.flat()}>
          {(post) => (
            <div
              style={{ "border-bottom": "1px solid #ccc", padding: "10px 0" }}
            >
              <h3>{post.title}</h3>
              <p>{post.body.substring(0, 100)}...</p>
            </div>
          )}
        </For> */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </Show>

      <Show when={hasNextPage}>
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      </Show>

      {/* <Show
        when={
          !hasNextPage &&
          !isLoading &&
          !isError &&
          data?.pages.flat().length > 0
        }
      >
        <p>No more posts to load.</p>
      </Show> */}
    </div>
  );
}
