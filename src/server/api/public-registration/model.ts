import { z } from "zod";

export namespace PublicRegistrationModel {
  export const createBody = z
    .object({
      firstName: z.string().min(1, "First Name is required"),
      lastName: z.string().min(1, "Last Name is required"),
      email: z.string().email("Invalid email address"),
      phone: z.string().min(3).max(30),
      countryCode: z.string().min(1, "Country code is required"),
      dob: z.coerce.date(),
      nationality: z.string().min(1, "Nationality is required"),
      address: z.string().min(1, "Home address is required"),
      qualification: z.string().optional(),
      englishCompetency: z.string().optional(),
      vaccinated: z.enum(["Yes", "No"]).optional(),
      courseId: z.string().uuid("Invalid course selected"),
      classStartDate: z.coerce.date().optional(),
      salesperson: z.string().optional(),
      hearAboutUs: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.dob && new Date(data.dob) > new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date of birth cannot be in the future",
          path: ["dob"],
        });
      }
    });

  export type CreateBody = z.infer<typeof createBody>;

  export const createResponse = z.object({
    id: z.string().uuid(),
    message: z.string(),
  });

  export type CreateResponse = z.infer<typeof createResponse>;
}
