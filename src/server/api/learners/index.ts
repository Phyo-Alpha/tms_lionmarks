import { Elysia } from "elysia";
import { LearnerService } from "./service";
import { LearnerModel } from "./model";
import { authMiddleware, type AuthContext } from "@/server/lib/auth-middleware";
import { roleCheck } from "@/server/helpers/roleCheck";
import { elysiaDb } from "@/server/db";

export const learnersController = new Elysia({
  prefix: "/admin/learners",
  detail: {
    tags: ["Learners"],
  },
})
  .use(elysiaDb)
  .use(authMiddleware)
  .get(
    "/",
    async ({ db, query, user, session }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return LearnerService.list(db, query);
    },
    {
      query: LearnerModel.listQuery,
      response: LearnerModel.listResponse,
      auth: true,
    },
  )
  .get(
    "/:id",
    async ({ db, user, session, params }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return LearnerService.getById(db, params.id);
    },
    {
      params: LearnerModel.idParam,
      response: LearnerModel.detail,
      auth: true,
    },
  )
  .post(
    "/",
    async ({ db, user, session, body }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return LearnerService.create(db, body);
    },
    {
      body: LearnerModel.createBody,
      response: LearnerModel.entity,
      auth: true,
    },
  )
  .patch(
    "/:id",
    async ({ db, user, session, body, params }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return LearnerService.update(db, params.id, body);
    },
    {
      params: LearnerModel.idParam,
      body: LearnerModel.updateBody,
      response: LearnerModel.entity,
      auth: true,
    },
  )
  .delete(
    "/:id",
    async ({ db, user, session, params }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      await LearnerService.remove(db, params.id);
      return { message: "Learner deleted" };
    },
    {
      params: LearnerModel.idParam,
      response: LearnerModel.deleteResponse,
      auth: true,
    },
  );
