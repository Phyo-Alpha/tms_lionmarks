import z from "zod";
import {
  courseRunVenueSchema,
  courseVacancySchema,
  scheduleInfoTypeSchema,
  trainerSchema,
} from "../entity/course-run-by-id.entity";

const session = z.object({
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  modeOfTraining: z.string(),
  venue: courseRunVenueSchema
    .extend({
      primaryVenue: z.boolean(),
    })
    .optional(),
});

const courseRunTrainer = z.object({
  trainer: trainerSchema.extend({
    linkedSsecEQAs: z
      .array(
        z
          .object({
            description: z.string(),
            ssecEQA: z.object({
              code: z.string(),
            }),
          })
          .optional(),
      )
      .optional(),
  }),
});

const courseRun = z.object({
  sequenceNumber: z.number().int().nullable(),
  registration: z
    .object({
      opening: z.coerce.string(),
      closing: z.coerce.string(),
    })
    .nullable(),
  courseDates: z.object({
    start: z.coerce.string(),
    end: z.coerce.string(),
  }),
  scheduleInfoType: scheduleInfoTypeSchema,
  scheduleInfo: z.string(),
  venue: courseRunVenueSchema.optional(),
  intakeSize: z.number().int().optional(),
  threshold: z.number().int().optional(),
  registeredUserCount: z.number().int().optional(),
  modeOfTraining: z.string(),
  courseAdminEmail: z.email(),
  toAppendCourseApplicationURL: z.boolean().optional(),
  courseApplicationUrl: z.url().optional(),
  courseVacancy: courseVacancySchema,
  notShownToPublic: z.boolean().optional(),
  file: z
    .object({
      Name: z.string(),
      content: z.string(),
    })
    .optional(),
  sessions: z.array(session),
  linkCourseRunTrainer: z.array(
    z.object({
      trainer: courseRunTrainer.shape.trainer,
    }),
  ),
});

export const createCourseRunRequestDto = z.object({
  courseReferenceNumber: z.string(),
  trainingProvider: z.object({
    uen: z.string(),
  }),
  runs: z.array(courseRun),
});
