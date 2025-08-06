import { useState, Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useFingerprint } from "@/components/fingerprint-provider";
import {
  getWrestlers as gw,
  submitVote as sv,
} from "@/serverFunctions/tursoFunctions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export const Route = createFileRoute("/vote")({
  component: RouteComponent,
});

export default function RouteComponent() {
  const { fingerprint } = useFingerprint();
  const [wrestlerId, setWrestlerId] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [debouncedValue] = useDebouncedValue(search, {
    wait: 1000,
  });

  return (
    <VoteContent
      wrestlerId={wrestlerId}
      setWrestlerId={setWrestlerId}
      search={search}
      setSearch={setSearch}
      searchValue={debouncedValue}
      fingerprint={fingerprint}
    />
  );
}

const VoteContent = ({
  wrestlerId,
  setWrestlerId,
  search,
  setSearch,
  searchValue,
  fingerprint,
}: {
  wrestlerId: string | null;
  setWrestlerId: React.Dispatch<React.SetStateAction<string | null>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  searchValue: string;
  fingerprint: string | null;
}) => {
  const getWrestlers = useServerFn(gw);
  const submitVote = useServerFn(sv);
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["projects", searchValue],
    queryFn: async ({ pageParam, queryKey }) =>
      await getWrestlers({
        data: { cursor: pageParam, pageSize: 20, search: queryKey[1] },
      }),
    initialPageParam: "",
    getNextPageParam: (lastPage, pages) => lastPage.pagination.lastCursor,
  });

  if (status === "pending") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 h-screen">
      <Input
        className="w-2xl max-w-10/12 mx-auto text-center"
        value={search}
        placeholder="Search for a wrestler or school"
        onChange={(e) => setSearch(e.target.value)}
      />
      <RadioGroup value={wrestlerId} onValueChange={(e) => setWrestlerId(e)}>
        {data.pages.map((group, i) =>
          group.data.map((wrestler) => (
            <div key={wrestler.id} className="flex items-center gap-3">
              <RadioGroupItem
                className="size-6"
                value={wrestler.id}
                id={wrestler.id}
              />
              <Label className="text-xl" htmlFor={wrestler.id}>
                <span className="font-semibold">{wrestler.name}</span>
                <Badge className="text-sm" variant="outline">
                  {wrestler.school}
                </Badge>
              </Label>
            </div>
          )),
        )}
      </RadioGroup>
      <div>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetching}
          variant="destructive"
          className={twMerge(clsx(hasNextPage ? "" : "hidden"))}
        >
          {isFetchingNextPage ? "Loading more..." : "Load More"}
        </Button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      <Button
        type="button"
        disabled={!wrestlerId || !fingerprint}
        onClick={() =>
          submitVote({
            data: { wrestlerId: wrestlerId!, fingerprint: fingerprint! },
          })
        }
      >
        Vote!
      </Button>
    </div>
  );
};
