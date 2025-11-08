import { z } from "zod";
import { insertCourseSchema, updateCourseSchema } from "@/server/db/schema/trainee-schema";

export namespace CourseModel {
  export const listQuery = z.object({
    search: z.string().optional(),
    published: z.coerce.boolean().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(["createdAt", "title", "startDate"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
  });

  export type ListQuery = z.infer<typeof listQuery>;

  export const createBody = insertCourseSchema;
  export type CreateBody = z.infer<typeof createBody>;

  export const updateBody = updateCourseSchema;
  export type UpdateBody = z.infer<typeof updateBody>;

  export const idParam = z.object({
    id: z.string().uuid(),
  });

  export type IdParam = z.infer<typeof idParam>;

  export const entity = z.object({
    id: z.string().uuid(),
    code: z.string(),
    title: z.string(),
    description: z.string().nullable().optional(),
    durationHours: z.number().int(),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    capacity: z.number().int().nullable().optional(),
    isPublished: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  });

  export const registrationSummary = z.object({
    id: z.string().uuid(),
    learnerId: z.string().uuid(),
    courseId: z.string().uuid(),
    status: z.enum(["enrolled", "in_progress", "completed", "withdrawn"]),
    registeredAt: z.coerce.date(),
    completedAt: z.coerce.date().nullable().optional(),
    score: z.number().int().nullable().optional(),
    certificateUrl: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    learner: z
      .object({
        id: z.string().uuid(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email(),
        status: z.enum(["active", "inactive", "suspended"]),
      })
      .optional(),
  });

  export const detail = entity.extend({
    registrations: z.array(registrationSummary),
  });

  export const listResponse = z.object({
    data: z.array(entity),
    pagination: z.object({
      page: z.number().int(),
      limit: z.number().int(),
      totalItems: z.number().int(),
      totalPages: z.number().int(),
    }),
  });

  export const deleteResponse = z.object({
    message: z.string(),
  });
}
