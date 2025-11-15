import { z } from "zod";

export const deleteTrainerRequestDto = z.object({
  trainer: z.object({
    action: z.literal("delete"),
  }),
});

export type DeleteTrainerRequestDto = z.infer<typeof deleteTrainerRequestDto>;
