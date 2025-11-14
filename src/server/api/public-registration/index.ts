import { Elysia } from "elysia";
import { PublicRegistrationService } from "./service";
import { PublicRegistrationModel } from "./model";
import { elysiaDb } from "@/server/db";

export const publicRegistrationController = new Elysia({
  prefix: "/public/register",
  detail: {
    tags: ["Public Registration"],
  },
})
  .use(elysiaDb)
  .post(
    "/",
    async ({ db, body }) => {
      return PublicRegistrationService.create(db, body);
    },
    {
      body: PublicRegistrationModel.createBody,
      response: PublicRegistrationModel.createResponse,
    },
  );
