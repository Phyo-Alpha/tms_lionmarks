import z from "zod";

export namespace CoursesRunsSSGModels {
  const courseRunVenue = z.object({
    block: z.string().optional(),
    street: z.string().optional(),
    floor: z.string(),
    unit: z.string(),
    building: z.string().optional(),
    postalCode: z.string(),
    room: z.string(),
    wheelChairAccess: z.boolean().optional(),
  });

  const session = z.object({
    startDate: z.string(),
    endDate: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    modeOfTraining: z.string(),
    venue: courseRunVenue
      .extend({
        primaryVenue: z.boolean(),
      })
      .optional(),
  });

  const trainerRole = z.object({
    id: z.number(),
    description: z.string(),
  });

  const courseRunTrainer = z.object({
    trainer: z.object({
      trainerType: z.object({
        code: z.string(),
        description: z.string(),
      }),
      indexNumber: z.number().int().optional(),
      id: z.string().optional(),
      name: z.string(),
      email: z.email(),
      idNumber: z.string(),
      idType: z.object({
        code: z.string(),
        description: z.string(),
      }),
      roles: z.array(
        z.object({
          role: trainerRole,
        }),
      ),
      inTrainingProviderProfile: z.boolean().optional(),
      domainAreaOfPractice: z.string().optional(),
      experience: z.string().optional(),
      linkedInURL: z.url().optional(),
      salutationId: z.number().int().optional(),
      photo: z
        .object({
          name: z.string(),
          content: z.string(),
        })
        .optional(),
      linkedSsecEQAs: z.array(
        z
          .object({
            description: z.string(),
            ssecEQA: z.object({
              code: z.string(),
            }),
          })
          .optional(),
      ),
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
    scheduleInfoType: z.object({
      description: z.string(),
      code: z.string(),
    }),
    scheduleInfo: z.string(),
    venue: courseRunVenue.optional(),
    intakeSize: z.number().int().optional(),
    threshold: z.number().int().optional(),
    registeredUserCount: z.number().int().optional(),
    modeOfTraining: z.string(),
    courseAdminEmail: z.email(),
    toAppendCourseApplicationURL: z.boolean().optional(),
    courseApplicationUrl: z.url().optional(),
    courseVacancy: z.object({
      code: z.string(),
      description: z.string(),
    }),
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
        trainer: courseRunTrainer,
      }),
    ),
  });

  export const createCourseRunEntity = z.object({
    courseReferenceNumber: z.string(),
    trainingProvider: z.object({
      uen: z.string(),
    }),
    runs: z.array(courseRun),
  });
}
