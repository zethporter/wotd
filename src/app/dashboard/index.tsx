import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useMemo } from "react";
import { useLiveQuery, count, eq, coalesce } from "@tanstack/react-db";
import { wrestlersCollection, votesCollection } from "@/routes/__root";
import { nullishWrestler } from "@/schema";

// import data from "./data.json";

export default function Page() {
  const { data: wrestlers } = useLiveQuery((q) => {
    const votes = q
      .from({ vote: votesCollection })
      .groupBy(({ vote }) => vote.wrestlerId)
      .select(({ vote }) => ({
        wrestlerId: vote.wrestlerId,
        totalVotes: count(vote.id),
      }));
    return q
      .from({ wrestler: wrestlersCollection })
      .leftJoin({ votes }, ({ wrestler, votes }) => {
        return eq(wrestler.id, votes.wrestlerId);
      })
      .select(({ wrestler, votes }) => ({
        wrestler,
        votes: coalesce(votes, { wrestlerId: wrestler.id, totalVotes: 0 }),
      }));
  });
  const { data: votes } = useLiveQuery((q) =>
    q
      .from({ vote: votesCollection })
      .select(({ vote }) => ({
        totalVotes: count(vote.id),
      }))
      .findOne(),
  );
  return (
    <SidebarProvider
      defaultOpen={false}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards
                totalVotes={votes?.totalVotes ?? 0}
                wrestler={
                  wrestlers.length > 0
                    ? nullishWrestler.parse(wrestlers[0]!.wrestler)
                    : null
                }
              />
              <DataTable
                data={wrestlers.filter((w) => w.wrestler !== undefined) as any}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
