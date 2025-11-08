import { z } from "zod";

export const AuthModel = {
  checkUser: {
    body: z.object({
      email: z.email(),
    }),
    response: z.object({
      exists: z.boolean(),
      email: z.string(),
      message: z.string(),
    }),
  },
} as const;

export type CheckUserBody = z.infer<typeof AuthModel.checkUser.body>;
export type CheckUserResponse = z.infer<typeof AuthModel.checkUser.response>;
