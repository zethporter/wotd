import { z } from "zod";

export const voter = z.object({
  _id: z.string().nullish(),
  id: z.string(),
  email: z.string(),
  created: z.string().date(),
  voted: z.string().date().nullable(),
});
export type Voter = z.infer<typeof voter>;
