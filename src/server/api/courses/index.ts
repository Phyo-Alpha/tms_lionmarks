import { Elysia } from "elysia";
import { CourseService } from "./service";
import { CourseModel } from "./model";
import { authMiddleware, type AuthContext } from "@/server/lib/auth-middleware";
import { roleCheck } from "@/server/helpers/roleCheck";
import { elysiaDb } from "@/server/db";

export const coursesController = new Elysia({
  prefix: "/admin/courses",
  detail: {
    tags: ["Courses"],
  },
})
  .use(elysiaDb)
  .use(authMiddleware)
  .get(
    "/",
    async ({ db, query, user, session }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return CourseService.list(db, query);
    },
    {
      query: CourseModel.listQuery,
      response: CourseModel.listResponse,
      auth: true,
    },
  )
  .get(
    "/:id",
    async ({ db, user, session, params }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return CourseService.getById(db, params.id);
    },
    {
      params: CourseModel.idParam,
      response: CourseModel.detail,
      auth: true,
    },
  )
  .post(
    "/",
    async ({ db, user, session, body }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return CourseService.create(db, body);
    },
    {
      body: CourseModel.createBody,
      response: CourseModel.entity,
      auth: true,
    },
  )
  .patch(
    "/:id",
    async ({ db, user, session, body, params }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      return CourseService.update(db, params.id, body);
    },
    {
      params: CourseModel.idParam,
      body: CourseModel.updateBody,
      response: CourseModel.entity,
      auth: true,
    },
  )
  .delete(
    "/:id",
    async ({ db, user, session, params }) => {
      roleCheck({ user: user as AuthContext["user"], session });
      await CourseService.remove(db, params.id);
      return { message: "Course deleted" };
    },
    {
      params: CourseModel.idParam,
      response: CourseModel.deleteResponse,
      auth: true,
    },
  );
