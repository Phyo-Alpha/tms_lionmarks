import { Elysia } from "elysia";
import { RegistrationService } from "./service";
import { RegistrationModel } from "./model";
import { authMiddleware, type AuthContext } from "@/server/lib/auth-middleware";
import { roleCheck } from "@/server/helpers/roleCheck";
import { elysiaDb } from "@/server/db";

export const registrationsController = new Elysia({
  prefix: "/admin/registrations",
  detail: {
    tags: ["Course Registrations"],
  },
})
  .use(elysiaDb)
  .use(authMiddleware)
  .get(
    "/",
    async ({ db, query, user, session }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return RegistrationService.list(db, query);
    },
    {
      query: RegistrationModel.listQuery,
      response: RegistrationModel.listResponse,
      auth: true,
    },
  )
  .get(
    "/:id",
    async ({ db, user, session, params }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return RegistrationService.getById(db, params.id);
    },
    {
      params: RegistrationModel.idParam,
      response: RegistrationModel.entity,
      auth: true,
    },
  )
  .post(
    "/",
    async ({ db, user, session, body }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return RegistrationService.create(db, body);
    },
    {
      body: RegistrationModel.createBody,
      response: RegistrationModel.entity,
      auth: true,
    },
  )
  .patch(
    "/:id",
    async ({ db, user, session, body, params }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return RegistrationService.update(db, params.id, body);
    },
    {
      params: RegistrationModel.idParam,
      body: RegistrationModel.updateBody,
      response: RegistrationModel.entity,
      auth: true,
    },
  )
  .delete(
    "/:id",
    async ({ db, user, session, params }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      await RegistrationService.remove(db, params.id);
      return { message: "Course registration deleted" };
    },
    {
      params: RegistrationModel.idParam,
      response: RegistrationModel.deleteResponse,
      auth: true,
    },
  );
