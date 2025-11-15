import { z } from "zod";

const courseRunVenueSchema = z.object({
  block: z.string().optional(),
  street: z.string().optional(),
  floor: z.string(),
  unit: z.string(),
  building: z.string().optional(),
  postalCode: z.string(),
  room: z.string(),
  wheelChairAccess: z.boolean().optional(),
});

const sessionSchema = z.object({
  id: z.string(),
  venue: courseRunVenueSchema.optional(),
  deleted: z.boolean(),
  endDate: z.string(),
  endTime: z.string(),
  startDate: z.string(),
  startTime: z.string(),
  modeOfTraining: z.string(),
  attendanceTaken: z.boolean(),
});

export const listCourseSessionsResponseDataSchema = z.object({
  sessions: z.array(sessionSchema),
});

export type ListCourseSessionsResponseData = z.infer<typeof listCourseSessionsResponseDataSchema>;
