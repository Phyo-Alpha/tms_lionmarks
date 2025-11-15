import { z } from "zod";

export const listTrainersRequestDto = z.object({
  pageSize: z.coerce.number().int().positive().default(20),
  page: z.coerce.number().int().default(0),
  keyword: z.string().optional(),
});

export type ListTrainersRequestDto = z.infer<typeof listTrainersRequestDto>;
