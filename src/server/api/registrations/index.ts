import { Elysia } from "elysia";
import { RegistrationService } from "./service";
import { RegistrationModel } from "./model";
import { authMiddleware } from "@/server/lib/auth-middleware";
import { roleCheck } from "@/server/helpers/roleCheck";

export const registrationsController = new Elysia({
  prefix: "/admin/registrations",
  detail: {
    tags: ["Course Registrations"],
  },
})
  .use(authMiddleware)
  .get(
    "/",
    async ({ db, auth, query }) => {
      roleCheck(auth);
      return RegistrationService.list(db, query);
    },
    {
      query: RegistrationModel.listQuery,
      response: RegistrationModel.listResponse,
    },
  )
  .get(
    "/:id",
    async ({ db, auth, params }) => {
      roleCheck(auth);
      return RegistrationService.getById(db, params.id);
    },
    {
      params: RegistrationModel.idParam,
      response: RegistrationModel.entity,
    },
  )
  .post(
    "/",
    async ({ db, auth, body }) => {
      roleCheck(auth);
      return RegistrationService.create(db, body);
    },
    {
      body: RegistrationModel.createBody,
      response: RegistrationModel.entity,
    },
  )
  .patch(
    "/:id",
    async ({ db, auth, params, body }) => {
      roleCheck(auth);
      return RegistrationService.update(db, params.id, body);
    },
    {
      params: RegistrationModel.idParam,
      body: RegistrationModel.updateBody,
      response: RegistrationModel.entity,
    },
  )
  .delete(
    "/:id",
    async ({ db, auth, params }) => {
      roleCheck(auth);
      await RegistrationService.remove(db, params.id);
      return { message: "Course registration deleted" };
    },
    {
      params: RegistrationModel.idParam,
      response: RegistrationModel.deleteResponse,
    },
  );
