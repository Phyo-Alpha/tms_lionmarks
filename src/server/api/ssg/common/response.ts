import { z } from "zod";

const errorDetailSchema = z.object({
  code: z.string(),
  details: z.array(z.unknown()),
  errorId: z.string(),
  message: z.string(),
});

export const skillFutureErrorSchema = z.object({
  code: z.string(),
  details: z.array(z.unknown()),
  errorId: z.string(),
  message: z.string(),
});

/**
 *  Common response wrapper for all skill futures responses
 */
export const skillFutureResponse = <TData extends z.ZodTypeAny>(dataSchema: TData) =>
  z.object({
    status: z.number(),
    data: dataSchema,
    meta: z.union([z.record(z.string(), z.unknown()), z.string()]),
    error: z.union([z.object({}), skillFutureErrorSchema]),
    errors: z.array(errorDetailSchema).optional(),
  });

export type SkillFutureResponse<TData = unknown> = z.infer<
  ReturnType<typeof skillFutureResponse<z.ZodTypeAny>>
> & {
  data: TData;
};
