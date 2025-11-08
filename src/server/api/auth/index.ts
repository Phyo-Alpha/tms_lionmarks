import { elysiaDb } from "@/server/db";
import { Elysia } from "elysia";
import { AuthModel } from "./model";
import { Auth } from "./service";

export const auth = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Auth"],
  },
})
  .use(elysiaDb)
  .post(
    "/check-user",
    async ({ db, body }) => {
      return await Auth.checkUser(db, body);
    },
    {
      body: AuthModel.checkUser.body,
      response: AuthModel.checkUser.response,
      detail: {
        description: "Check if a user exists by email address. This is a public endpoint.",
      },
    },
  );
