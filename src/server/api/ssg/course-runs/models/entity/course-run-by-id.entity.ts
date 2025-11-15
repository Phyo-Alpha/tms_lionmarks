import { z } from "zod";

/* ---------------------------- Common Schemas ---------------------------- */

export const courseRunVenueSchema = z.object({
  block: z.string().optional(),
  street: z.string().optional(),
  floor: z.string(),
  unit: z.string(),
  building: z.string().optional(),
  postalCode: z.string(),
  room: z.string(),
  wheelChairAccess: z.boolean().optional(),
});

export const trainerRoleSchema = z.object({
  id: z.number(),
  description: z.string(),
});

export const trainerTypeSchema = z.object({
  code: z.string(),
  description: z.string(),
});

export const idTypeSchema = z.object({
  code: z.string(),
  description: z.string(),
});

export const courseVacancySchema = z.object({
  code: z.string(),
  description: z.string(),
});

export const scheduleInfoTypeSchema = z.object({
  code: z.string(),
  description: z.string(),
});

export const fileSchema = z.object({
  name: z.string().optional(),
  content: z.string().optional(),
});

export const fileSchemaWithCapitalName = z.object({
  Name: z.string().optional(),
  content: z.string().optional(),
});

export const linkedSsecEQASchema = z.object({
  description: z.string(),
  ssecEQA: z.object({
    code: z.string(),
  }),
});

export const ssecEQASchema = z.object({
  ssecEQA: z.object({
    code: z.string(),
    description: z.string(),
  }),
});

export const trainerSchema = z.object({
  trainerType: trainerTypeSchema,
  indexNumber: z.number().int().optional(),
  id: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
  idNumber: z.string(),
  idType: idTypeSchema,
  roles: z.array(
    z.object({
      role: trainerRoleSchema,
    }),
  ),
  inTrainingProviderProfile: z.boolean().optional(),
  domainAreaOfPractice: z.string().optional(),
  experience: z.string().optional(),
  linkedInURL: z.string().optional(),
  organizationKey: z.string().optional(),
  salutationId: z.number().int().optional(),
  photo: fileSchema.optional(),
  uuid: z.string().optional(),
  linkedSsecEQAs: z.array(linkedSsecEQASchema.optional()).optional(),
  ssecEQAs: z.array(ssecEQASchema).optional(),
});

export const linkCourseRunTrainerSchema = z.object({
  trainer: trainerSchema,
});

/* ---------------------------- Get By ID Specific Schemas ---------------------------- */

const periodSchema = z.object({
  from: z.number(),
  to: z.number(),
  taggingCode: z.string(),
  taggingDescription: z.string(),
});

const supportMetaSchema = z.object({
  createBy: z.string(),
  createDate: z.string(),
  updateBy: z.string(),
  updateDate: z.string(),
});

const supportSchema = z.object({
  detailsId: z.number(),
  referenceNumber: z.string(),
  period: periodSchema,
  effectiveDate: z.number(),
  category: z.string(),
  supportCode: z.string(),
  meta: supportMetaSchema,
});

const runSchema = z.object({
  id: z.number(),
  referenceNumber: z.string(),
  registrationOpeningDate: z.number().optional(),
  registrationClosingDate: z.number().optional(),
  courseStartDate: z.union([z.number(), z.string()]),
  courseEndDate: z.union([z.number(), z.string()]),
  scheduleInfoType: scheduleInfoTypeSchema,
  scheduleInfo: z.string(),
  venue: courseRunVenueSchema.optional(),
  intakeSize: z.number().optional(),
  threshold: z.number().optional(),
  registeredUserCount: z.number().optional(),
  organizationKey: z.string().optional(),
  modeOfTraining: z.string(),
  courseAdminEmail: z.string().email(),
  qrCodeLink: z.string().url().optional(),
  file: fileSchema.optional(),
  attendanceTaken: z.boolean().optional(),
  linkCourseRunTrainer: z.array(linkCourseRunTrainerSchema),
  courseVacancy: courseVacancySchema,
});

const courseSchema = z.object({
  referenceNumber: z.string(),
  externalReferenceNumber: z.string().optional(),
  title: z.string(),
  deleteFlag: z.boolean().optional(),
  expireFlag: z.boolean().optional(),
  support: z.array(supportSchema).optional(),
  run: runSchema,
});

export const getCourseRunByIdResponseDataSchema = z.object({
  course: courseSchema,
});

export type GetCourseRunByIdResponseData = z.infer<typeof getCourseRunByIdResponseDataSchema>;
