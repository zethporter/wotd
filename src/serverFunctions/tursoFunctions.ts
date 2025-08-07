import { asc, count, eq, getTableColumns, gt, sql, or } from "drizzle-orm";
import { db } from "../db/app";
import {
  wrestlersSelectSchema,
  wrestlersTable,
  votersInsertSchema,
  votesInsertSchema,
  type VotesInsert,
  votesTable,
  votersTable,
} from "../db/schema/app";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { v7 as uuid } from "uuid";

type GetWrestlers = {
  cursor: string;
  pageSize?: number;
  search?: string;
};

export const getWrestlers = createServerFn({ method: "GET" })
  .validator((data: GetWrestlers) => ({
    cursor: data.cursor,
    pageSize: data.pageSize ?? 2,
    search: data.search ?? "",
  }))
  .handler(async ({ data }) => {
    const { cursor, pageSize, search } = data;

    const query = db
      .select()
      .from(wrestlersTable)
      .orderBy(asc(wrestlersTable.id)) // Always order by ID to ensure consistent pagination
      .limit(pageSize);

    if (search) {
      query.where(
        or(
          sql`${wrestlersTable.name} LIKE ${"%" + search + "%"}`,
          sql`${wrestlersTable.school} LIKE ${"%" + search + "%"}`,
        ),
      );
    }
    if (cursor) {
      // If a cursor is provided, fetch records where the ID is greater than the cursor
      query.where(gt(wrestlersTable.id, cursor));
    }

    const wrestlers = await query.execute();

    // Determine the next cursor. If there are wrestlers, it's the ID of the last one.
    // Otherwise, if the number of fetched wrestlers is less than pageSize, there are no more pages.
    const lastCursor =
      wrestlers.length === pageSize
        ? wrestlers[wrestlers.length - 1]?.id
        : undefined;

    return {
      data: wrestlers,
      pagination: {
        lastCursor,
        pageSize,
      },
      search,
    };
  });

export type Vote = {
  wrestlerId: string;
  fingerprint: string;
};

export const submitVote = createServerFn({ method: "POST" })
  .validator((data: Vote) => data)
  .handler(async ({ data }) => {
    const query = db
      .select()
      .from(votersTable)
      .where(eq(votersTable.fingerprint, data.fingerprint));
    const voter = await query.execute();
    console.log("voter response", JSON.stringify({ voter }, null, 2));
    if (voter.length > 0) {
      throw redirect({
        to: "/already-voted",
      });
    }

    const voterRes = await db
      .insert(votersTable)
      .values({
        id: uuid(),
        fingerprint: data.fingerprint,
        email: "None",
        votedOn: new Date().toISOString(),
      })
      .returning({ voterId: votersTable.id });

    const { voterId } = voterRes[0]!;

    await db.insert(votesTable).values({
      id: uuid(),
      wrestlerId: data.wrestlerId,
      voterId: voterId,
    });
    throw redirect({
      to: "/voted",
    });
  });
