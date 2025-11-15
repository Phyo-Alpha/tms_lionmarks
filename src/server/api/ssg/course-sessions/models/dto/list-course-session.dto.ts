import { z } from "zod";

export const listCourseSessionsRequestDto = z.object({
  uen: z.string(),
  courseReferenceNumber: z.string(),
  sessionMonth: z
    .string()
    .regex(/^\d{6}$/, "sessionMonth must be in MMYYYY format")
    .optional(),
  includeExpiredCourses: z.coerce.boolean().optional(),
});

export type ListCourseSessionsRequestDto = z.infer<typeof listCourseSessionsRequestDto>;
