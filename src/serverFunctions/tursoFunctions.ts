import { asc, count, eq, getTableColumns, gt, sql, or } from 'drizzle-orm'
import { db } from '../db/app'
import {
  wrestlersTable,
  votesTable,
  votersTable,
  type WrestlerUpdate,
  wrestlerUpdateSchema,
  type BaseWrestlers,
  baseWrestlersSchema,
} from '../db/schema/app'
import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { v7 as uuid } from 'uuid'
import pino from 'pino'

const logger = pino()

type GetWrestlers = {
  cursor: string
  pageSize?: number
  search?: string
}

export const getAllWrestlers = createServerFn({ method: 'GET' }).handler(
  async () => {
    const query = db.select().from(wrestlersTable)
    const wrestlers = await query.execute()
    return { data: wrestlers }
  },
)

export const getAllVotes = createServerFn({ method: 'GET' }).handler(
  async () => {
    const query = db.select().from(votesTable)
    const votes = await query.execute()
    return { data: votes }
  },
)

export const getWrestlers = createServerFn({ method: 'GET' })
  .inputValidator((data: GetWrestlers) => ({
    cursor: data.cursor,
    pageSize: data.pageSize ?? 2,
    search: data.search ?? '',
  }))
  .handler(async ({ data }) => {
    const { cursor, pageSize, search } = data

    const query = db
      .select()
      .from(wrestlersTable)
      .orderBy(asc(wrestlersTable.id)) // Always order by ID to ensure consistent pagination
      .limit(pageSize)

    if (search) {
      query.where(
        or(
          sql`${wrestlersTable.name} LIKE ${'%' + search + '%'}`,
          sql`${wrestlersTable.school} LIKE ${'%' + search + '%'}`,
        ),
      )
    }
    if (cursor) {
      // If a cursor is provided, fetch records where the ID is greater than the cursor
      query.where(gt(wrestlersTable.id, cursor))
    }

    const wrestlers = await query.execute()

    // Determine the next cursor. If there are wrestlers, it's the ID of the last one.
    // Otherwise, if the number of fetched wrestlers is less than pageSize, there are no more pages.
    const lastCursor =
      wrestlers.length === pageSize
        ? wrestlers[wrestlers.length - 1]?.id
        : undefined

    return {
      data: wrestlers,
      pagination: {
        lastCursor,
        pageSize,
      },
      search,
    }
  })

export type Vote = {
  wrestlerId: string
  fingerprint: string
}

export const submitVote = createServerFn({ method: 'POST' })
  .inputValidator((data: Vote) => data)
  .handler(async ({ data }) => {
    const query = db
      .select()
      .from(votersTable)
      .where(eq(votersTable.fingerprint, data.fingerprint))
    const voter = await query.execute()
    if (voter.length > 0) {
      throw redirect({
        to: '/already-voted',
      })
    }

    const voterRes = await db
      .insert(votersTable)
      .values({
        id: uuid(),
        fingerprint: data.fingerprint,
        email: 'None',
        votedOn: new Date().toISOString(),
      })
      .returning({ voterId: votersTable.id })

    const { voterId } = voterRes[0]!

    await db.insert(votesTable).values({
      id: uuid(),
      wrestlerId: data.wrestlerId,
      voterId: voterId,
    })
    throw redirect({
      to: '/voted',
    })
  })

export const updateWrestler = createServerFn({ method: 'POST' })
  .inputValidator((data: WrestlerUpdate) => {
    try {
      return wrestlerUpdateSchema.parse(data)
    } catch (error) {
      logger.error(error)
      throw new Error('failed validate input')
    }
  })
  .handler(async ({ data }) => {
    logger.info({ message: 'Updating Wrestler', data })
    const updateValues = Object.fromEntries(
      Object.entries(data.newValues).filter(([_, v]) => v != null),
    ) as Partial<typeof wrestlersTable.$inferInsert>

    const query = db
      .update(wrestlersTable)
      .set(updateValues)
      .where(eq(wrestlersTable.id, data.id))
      .returning({ id: wrestlersTable.id, name: wrestlersTable.name })

    const wrestler = await query.execute()

    if (wrestler.length === 0) {
      return { message: 'Wrestler no Found', code: 400 }
    }
    return { message: `Updated ${wrestler[0]!.name}`, code: 200 }
  })

export const addWrestlers = createServerFn({ method: 'POST' })
  .inputValidator((data: BaseWrestlers) => {
    try {
      return baseWrestlersSchema.parse(data)
    } catch (error) {
      logger.error(error)
      throw new Error('failed validate input to add Wrestler')
    }
  })
  .handler(async ({ data }) => {
    logger.info({ message: 'Adding Wrestler', data })
    const wrestlers = await db
      .insert(wrestlersTable)
      .values(data)
      .onConflictDoNothing()
      .returning({
        id: wrestlersTable.id,
        name: wrestlersTable.name,
        school: wrestlersTable.school,
      })

    if (wrestlers.length === 0) {
      return { message: 'Failed to add wrestler', code: 500 }
    }
    return {
      message: `Added Wrestler${wrestlers.length > 1 ? 's' : ''}`,
      code: 200,
      data: wrestlers,
    }
  })

export const deleteWrestler = createServerFn({ method: 'POST' })
  .inputValidator((data: string) => data)
  .handler(async ({ data }) => {
    logger.info({ message: 'Deleting Wrestler', data })
    const deleted = await db
      .delete(wrestlersTable)
      .where(eq(wrestlersTable.id, data))
      .returning({
        id: wrestlersTable.id,
        name: wrestlersTable.name,
        school: wrestlersTable.school,
      })
    if (deleted.length === 0) {
      return { message: 'Failed to delete wrestler', code: 500 }
    }
    return {
      message: `Deleted Wrestler${deleted.length > 1 ? 's' : ''}`,
      code: 200,
      data: deleted,
    }
  })

export const deleteAllWrestlers = createServerFn({ method: 'POST' }).handler(
  async () => {
    logger.info({ message: 'Deleting All Wrestler' })
    await db.delete(wrestlersTable)

    return {
      message: 'All Wrestlers Deleted',
      code: 200,
    }
  },
)
