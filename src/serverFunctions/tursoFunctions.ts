import { asc, count, eq, getTableColumns, gt, sql, or } from "drizzle-orm";
import { db } from "../db/index";
import { wrestlersSelectSchema, wrestlersTable } from "../db/schema";
import { redirect } from "@tanstack/react-router";
import { ActionFailedError } from "@/lib/errors";
import { createServerFn } from "@tanstack/react-start";

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

    console.log("Running handler for `getWrestlers");
    const query = db
      .select()
      .from(wrestlersTable)
      .orderBy(asc(wrestlersTable.id)) // Always order by ID to ensure consistent pagination
      .limit(pageSize);

    if (search) {
      console.log("Searching for: ", search);
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

    console.log(
      "Ran query to get wrestlers",
      JSON.stringify(wrestlers, null, 2),
    );

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
