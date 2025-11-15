import z from "zod";
import {
  courseRunVenueSchema,
  courseVacancySchema,
  scheduleInfoTypeSchema,
  trainerSchema,
} from "../entity/course-run-by-id.entity";

const updateSessionVenueSchema = courseRunVenueSchema.extend({
  primaryVenue: z.boolean(),
});

const updateSessionSchema = z.object({
  action: z.enum(["update", "delete"]),
  sessionId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  modeOfTraining: z.string(),
  venue: updateSessionVenueSchema.optional(),
});

const updateCourseRunTrainerSchema = z.object({
  trainer: trainerSchema.extend({
    linkedSsecEQAs: z
      .array(
        z.object({
          description: z.string(),
          ssecEQA: z.object({
            code: z.string(),
          }),
        }),
      )
      .optional(),
  }),
});

export const updateCourseRunRequestDto = z.object({
  course: z.object({
    courseReferenceNumber: z.string(),
    trainingProvider: z.object({
      uen: z.string(),
    }),
    run: z.object({
      action: z.literal("update"),
      sequenceNumber: z.number().int(),
      registrationDates: z.object({
        opening: z.number(),
        closing: z.number(),
      }),
      courseDates: z.object({
        start: z.union([z.number(), z.string()]),
        end: z.union([z.number(), z.string()]),
      }),
      scheduleInfoType: scheduleInfoTypeSchema,
      scheduleInfo: z.string(),
      venue: courseRunVenueSchema.optional(),
      intakeSize: z.number().int().optional(),
      threshold: z.number().int().optional(),
      registeredUserCount: z.number().int().optional(),
      modeOfTraining: z.string(),
      courseAdminEmail: z.string().email(),
      toAppendCourseApplicationURL: z.boolean().optional(),
      courseApplicationUrl: z.string().url().optional(),
      courseVacancy: courseVacancySchema,
      notShownToPublic: z.boolean().optional(),
      file: z
        .object({
          Name: z.string(),
          content: z.string(),
        })
        .optional(),
      sessions: z.array(updateSessionSchema).optional(),
      linkCourseRunTrainer: z.array(updateCourseRunTrainerSchema).optional(),
    }),
  }),
});

export type UpdateCourseRunRequestDto = z.infer<typeof updateCourseRunRequestDto>;
