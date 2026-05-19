import { z } from "zod";

export const CurrentUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
});
export type CurrentUser = z.infer<typeof CurrentUserSchema>;

export const CurrentUserResponseSchema = z.object({
  data: CurrentUserSchema.nullable(),
});
