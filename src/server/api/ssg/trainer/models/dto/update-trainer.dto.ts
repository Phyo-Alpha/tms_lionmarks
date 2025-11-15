import { z } from "zod";

const idTypeSchema = z
  .object({
    code: z.enum(["SB", "SP", "SO", "FP", "OT"]),
    description: z.enum([
      "Singapore Pink Identification Card",
      "Singapore Blue Identification Card",
      "FIN/Work Permit",
      "Foreign Passport",
      "Others",
    ]),
  })
  .refine(
    (data) => {
      switch (data.code) {
        case "SB":
          return data.description === "Singapore Pink Identification Card";
        case "SP":
          return data.description === "Singapore Blue Identification Card";
        case "SO":
          return data.description === "FIN/Work Permit";
        case "FP":
          return data.description === "Foreign Passport";
        case "OT":
          return data.description === "Others";
        default:
          return false;
      }
    },
    {
      message: "The code and description must match",
      path: ["idType", "description"],
    },
  );

const fileSchema = z.object({
  name: z.string().optional(),
  content: z.string().optional(),
});

const trainerRoleSchema = z.object({
  id: z.enum(["trainer", "assessor"]).transform((val) => {
    if (val === "trainer") return 1;
    return 2;
  }),
  description: z.string(),
});

const qualificationSchema = z.object({
  level: z.object({
    code: z.string(),
  }),
  description: z.string(),
});

export const updateTrainerRequestDto = z.object({
  trainer: z.object({
    name: z.string(),
    email: z.string().email(),
    photo: fileSchema.optional(),
    roles: z
      .array(
        z.object({
          role: trainerRoleSchema,
        }),
      )
      .min(1),
    action: z.literal("update"),
    idType: idTypeSchema,
    idNumber: z.string(),
    experience: z.string().optional(),
    linkedInURL: z.string().url().optional(),
    salutationId: z.enum(["Mr", "Ms", "Mdm", "Mrs", "Dr", "Prof"]).transform((val) => {
      switch (val) {
        case "Mr":
          return 1;
        case "Ms":
          return 2;
        case "Mdm":
          return 3;
        case "Mrs":
          return 4;
        case "Dr":
          return 5;
        case "Prof":
          return 6;
      }
    }),
    qualifications: z.array(qualificationSchema).min(1),
    domainAreaOfPractice: z.string(),
  }),
});

export type UpdateTrainerRequestDto = z.infer<typeof updateTrainerRequestDto>;
