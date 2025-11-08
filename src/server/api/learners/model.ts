import { z } from "zod";
import {
  insertLearnerSchema,
  updateLearnerSchema,
} from "@/server/db/schema/trainee-schema";

export namespace LearnerModel {
  export const listQuery = z.object({
    search: z.string().optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(["createdAt", "firstName", "lastName"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
  });

  export type ListQuery = z.infer<typeof listQuery>;

  export const createBody = insertLearnerSchema;
  export type CreateBody = z.infer<typeof createBody>;

  export const updateBody = updateLearnerSchema;
  export type UpdateBody = z.infer<typeof updateBody>;

  export const idParam = z.object({
    id: z.string().uuid(),
  });

  export type IdParam = z.infer<typeof idParam>;

  export const entity = z.object({
    id: z.string().uuid(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string().nullable().optional(),
    organization: z.string().nullable().optional(),
    status: z.enum(["active", "inactive", "suspended"]),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    metadata: z.string().nullable().optional(),
  });

  export const registration = z.object({
    id: z.string().uuid(),
    learnerId: z.string().uuid(),
    courseId: z.string().uuid(),
    status: z.enum(["enrolled", "in_progress", "completed", "withdrawn"]),
    registeredAt: z.coerce.date(),
    completedAt: z.coerce.date().nullable().optional(),
    score: z.number().int().nullable().optional(),
    certificateUrl: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  });

  export const detail = entity.extend({
    registrations: z.array(registration),
  });

  export const deleteResponse = z.object({
    message: z.string(),
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
}
