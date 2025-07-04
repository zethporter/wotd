"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { validateVoteCode } from "@/app/actions";
import { toast } from "sonner";

import { getWrestlers, submitVote } from "@/app/actions";
import { type Wrestler } from "@/schema";
import VoteItem from "./VoteItem";
import { ActionFailedError } from "@/lib/errors";

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

export default function VotePage() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  // need to check `voteId` to make sure it is valid

  const handleVote = async () => {
    try {
      const id = searchParams.get("id");
      const voteId = searchParams.get("voteId");

      if (id !== null && voteId !== null) {
        toast.loading("Submitting Vote", { id: "votingToast" });
        await submitVote(voteId, id);
      } else {
        toast.error("missing some information. Please try again.", {
          id: "votingToast",
        });
      }
    } catch (e) {
      if (e instanceof ActionFailedError) {
        toast.error(e.message);
      } else {
        toast.dismiss();
        console.log(JSON.stringify(e), { id: "votingToast" });
      }
    }
  };

  useEffect(() => {
    async function validator() {
      const voteId = searchParams.get("voteId");
      const validated = await validateVoteCode(voteId);
      setLoading(validated === "validated");
    }
    validator().catch(() => console.log("someting went wrong"));
  }, [searchParams]);

  if (!loading) {
    return <div>validating...</div>;
  }

  return (
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
        <motion.div
          animate={searchParams.has("id") ? { y: 0 } : { y: "100vh" }}
          transition={{
            type: "spring", // Use a spring transition
            stiffness: 130, // Adjust stiffness for more/less bounce
            damping: 18, // Adjust damping to control wobble
          }}
          className="fixed bottom-10 flex w-full justify-center"
        >
          <button
            onClick={() => handleVote()}
            type="button"
            className="btn btn-primary btn-lg btn-wide"
          >
            Submit Vote
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
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </motion.div>
      </div>
    </main>
  );
}
