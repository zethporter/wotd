import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";

export const votersTable = sqliteTable("voters", {
  id: text("id").primaryKey(),
  fingerptint: text("fingerptint").notNull(),
  email: text("email"),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  votedOn: text("voted_on"),
});
export const votersSelectSchema = createSelectSchema(votersTable);
export const votersInsertSchema = createInsertSchema(votersTable);

export const wrestlersTable = sqliteTable("wrestlers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  school: text("school").notNull(),
});
export const wrestlersSelectSchema = createSelectSchema(wrestlersTable);
export const wrestlersInsertSchema = createInsertSchema(wrestlersTable);

export const votesTable = sqliteTable("votes", {
  id: text("id").primaryKey(),
  voterId: text("voter_id").references(() => votersTable.id, {
    onDelete: "cascade",
  }),
  wrestlerId: text("wrestler_id").references(() => wrestlersTable.id, {
    onDelete: "cascade",
  }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
export const votesSelectSchema = createSelectSchema(votesTable);
export const votesInsertSchema = createInsertSchema(votesTable);
