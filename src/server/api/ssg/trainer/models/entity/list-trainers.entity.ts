import { z } from "zod";

const photoSchema = z.object({
  name: z.string(),
  content: z.string(),
});

const roleSchema = z.object({
  role: z.object({
    id: z.number(),
    description: z.string(),
  }),
});

const idTypeSchema = z.object({
  code: z.string(),
  description: z.string(),
});

const qualificationLevelSchema = z.object({
  code: z.string(),
  description: z.string(),
});

const qualificationSchema = z.object({
  level: qualificationLevelSchema,
  description: z.string(),
});

const trainerSchema = z.object({
  id: z.string(),
  name: z.string(),
  uuid: z.uuid(),
  email: z.email(),
  photo: photoSchema.optional(),
  roles: z.array(roleSchema),
  idType: idTypeSchema,
  idNumber: z.string(),
  experience: z.string().optional(),
  linkedInURL: z.string().optional(),
  salutationId: z.number(),
  qualifications: z.array(qualificationSchema),
  domainAreaOfPractice: z.string(),
  totalCourseRunLinkWithTrainer: z.number().optional(),
});

const trainersDataSchema = z.object({
  trainers: z.array(trainerSchema),
});

export const listTrainersResponseDataSchema = trainersDataSchema;

export type ListTrainersResponseData = z.infer<typeof listTrainersResponseDataSchema>;
