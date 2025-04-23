"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  HydrationBoundary,
  dehydrate,
  useInfiniteQuery,
} from "@tanstack/react-query";
// import { getQueryClient } from '@/app/get-query-client'

import { getWrestlers } from "@/app/actions";
import { type Wrestler } from "@/schema";
import VoteItem from "./VoteItem";

const WrestlersList = ({ search }: { search: string }) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["wrestlers", search],
    queryFn: async ({ pageParam, queryKey }) => {
      // const res = await fetch('/api/projects?cursor=' + pageParam)
      // return res.json()
      return await getWrestlers(pageParam, 10, queryKey[1]);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length === 0) {
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

  if (status === "pending") return <p>Loading...</p>;
  if (status === "error") return <p>Something went wrong</p>;

  return (
    <div>
      {data.pages.map((page) =>
        page.data.map((wrestler: Wrestler) => (
          <VoteItem key={wrestler.id} wrestler={wrestler} />
        )),
      )}
      <button
        disabled={!hasNextPage}
        type="button"
        onClick={() => fetchNextPage()}
        className="btn btn-wide glass"
      >
        Load More
      </button>

      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div className="toast">
        <div className="alert alert-info alert-soft">
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [search, setSearch] = useState<string>("");

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="container mx-auto flex flex-col gap-12 px-4">
        <h1 className="text-center text-4xl font-bold md:text-5xl">
          Vote for Outstanding Wrestler
        </h1>
        <label className="input">
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
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="search"
            placeholder="Search"
          />
        </label>
        <WrestlersList search={search} />
      </div>
    </main>
  );
}
