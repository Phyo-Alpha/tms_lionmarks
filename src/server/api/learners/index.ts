import { Elysia } from "elysia";
import { LearnerService } from "./service";
import { LearnerModel } from "./model";
import { authMiddleware } from "@/server/lib/auth-middleware";
import { roleCheck } from "@/server/helpers/roleCheck";

export const learnersController = new Elysia({
  prefix: "/admin/learners",
  detail: {
    tags: ["Learners"],
  },
})
  .use(authMiddleware)
  .get(
    "/",
    async ({ db, query, auth }) => {
      roleCheck(auth);
      return LearnerService.list(db, query);
    },
    {
      query: LearnerModel.listQuery,
      response: LearnerModel.listResponse,
    },
  )
  .get(
    "/:id",
    async ({ db, auth, params }) => {
      roleCheck(auth);
      return LearnerService.getById(db, params.id);
    },
    {
      params: LearnerModel.idParam,
      response: LearnerModel.detail,
    },
  )
  .post(
    "/",
    async ({ db, auth, body }) => {
      roleCheck(auth);
      return LearnerService.create(db, body);
    },
    {
      body: LearnerModel.createBody,
      response: LearnerModel.entity,
    },
  )
  .patch(
    "/:id",
    async ({ db, auth, body, params }) => {
      roleCheck(auth);
      return LearnerService.update(db, params.id, body);
    },
    {
      params: LearnerModel.idParam,
      body: LearnerModel.updateBody,
      response: LearnerModel.entity,
    },
  )
  .delete(
    "/:id",
    async ({ db, auth, params }) => {
      roleCheck(auth);
      await LearnerService.remove(db, params.id);
      return { message: "Learner deleted" };
    },
    {
      params: LearnerModel.idParam,
      response: LearnerModel.deleteResponse,
    },
  );
