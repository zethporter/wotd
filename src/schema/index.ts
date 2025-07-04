import { z } from "zod";

export const voter = z.object({
  _id: z.string().nullish(),
  id: z.string(),
  email: z.string(),
  created: z.string().date(),
  voted: z.string().date().nullable(),
});
export type Voter = z.infer<typeof voter>;

export const vote = z.object({
  voteKey: z.string(),
  wrestlerId: z.string(),
  voteDateTime: z.string(),
});
export type Vote = z.infer<typeof vote>;

export const wrestler = z.object({
  id: z.string(),
  name: z.string(),
  school: z.string(),
});
export type Wrestler = z.infer<typeof wrestler>;

export const a_wrestler = z.array(wrestler);
