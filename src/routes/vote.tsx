import { useState, Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFingerprint } from "@/components/fingerprint-provider";
import { getWrestlers, submitVote } from "@/serverFunctions/tursoFunctions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDebouncedValue } from "@tanstack/react-pacer";

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
        data: { cursor: pageParam, pageSize: 2, search: queryKey[1] },
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
        className="container mx-auto text-center"
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
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </Button>
      </div>
      <p>{wrestlerId}</p>
      <p>{search}</p>
      <p>{fingerprint}</p>
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
