"use client";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  HydrationBoundary,
  dehydrate,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
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

  if (status === "pending") return <p>Loading...</p>;
  if (status === "error") return <p>Something went wrong</p>;

  return (
    <div className="flex flex-col gap-2">
      {data.pages.map((page) =>
        page.data.map((wrestler: Wrestler) => (
          <VoteItem key={wrestler.id} wrestler={wrestler} />
        )),
      )}
      <button
        disabled={!hasNextPage}
        type="button"
        onClick={() => fetchNextPage()}
        className="btn btn-wide btn-secondary btn-soft mx-auto"
      >
        Load More
      </button>
    </div>
  );
};

export default function HomePage() {
  const [search, setSearch] = useState<string>("");
  const { voteId } = useParams();
  const searchParams = useSearchParams();
  // need to check `voteId` to make sure it is valid

  return (
    <AnimatePresence>
      <main className="flex min-h-screen">
        <div className="container mx-auto flex flex-col items-center gap-12 px-4 py-10">
          <h1 className="text-center text-2xl font-bold md:text-5xl">
            Vote for Outstanding Wrestler
          </h1>
          <label className="input input-lg md:input-xl w-full self-start">
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
          {searchParams.has("id") && (
            <motion.button
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="btn btn-primary btn-lg btn-wide fixed right-[50%] bottom-10 translate-x-[50%]"
              type="button"
            >
              Submit Vote
            </motion.button>
          )}
        </div>
      </main>
    </AnimatePresence>
  );
}
