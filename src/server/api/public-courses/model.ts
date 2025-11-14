import { z } from "zod";
import { CourseModel } from "../courses/model";

export namespace PublicCourseModel {
  export const listQuery = z.object({
    published: z.coerce.boolean().optional(),
    limit: z.coerce.number().int().min(1).max(100).default(100),
  });

  export type ListQuery = z.infer<typeof listQuery>;

  export const listResponse = CourseModel.listResponse;
  export type ListResponse = z.infer<typeof listResponse>;
}
