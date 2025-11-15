import z from "zod";

export const deleteCourseRunRequestDto = z.object({
  course: z.object({
    courseReferenceNumber: z.string(),
    trainingProvider: z.object({
      uen: z.string(),
    }),
    run: z.object({
      action: z.literal("delete"),
    }),
  }),
});

export type DeleteCourseRunRequestDto = z.infer<typeof deleteCourseRunRequestDto>;
