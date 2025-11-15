import z from "zod";

export const GetAllCoursesRequestDto = z.object({
  pageSize: z.coerce.number().int().positive().default(10),
  page: z.coerce.number().int().default(0),
  keyword: z.string(),
  /**TODO: add the rest */
});
