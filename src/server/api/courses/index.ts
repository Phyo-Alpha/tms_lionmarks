import { Elysia } from "elysia";
import { CourseService } from "./service";
import { CourseModel } from "./model";
import { authMiddleware } from "@/server/lib/auth-middleware";
import { roleCheck } from "@/server/helpers/roleCheck";

export const coursesController = new Elysia({
  prefix: "/admin/courses",
  detail: {
    tags: ["Courses"],
  },
})
  .use(authMiddleware)
  .get(
    "/",
    async ({ db, auth, query }) => {
      roleCheck(auth);
      return CourseService.list(db, query);
    },
    {
      query: CourseModel.listQuery,
      response: CourseModel.listResponse,
    },
  )
  .get(
    "/:id",
    async ({ db, auth, params }) => {
      roleCheck(auth);
      return CourseService.getById(db, params.id);
    },
    {
      params: CourseModel.idParam,
      response: CourseModel.detail,
    },
  )
  .post(
    "/",
    async ({ db, auth, body }) => {
      roleCheck(auth);
      return CourseService.create(db, body);
    },
    {
      body: CourseModel.createBody,
      response: CourseModel.entity,
    },
  )
  .patch(
    "/:id",
    async ({ db, auth, params, body }) => {
      roleCheck(auth);
      return CourseService.update(db, params.id, body);
    },
    {
      params: CourseModel.idParam,
      body: CourseModel.updateBody,
      response: CourseModel.entity,
    },
  )
  .delete(
    "/:id",
    async ({ db, auth, params }) => {
      roleCheck(auth);
      await CourseService.remove(db, params.id);
      return { message: "Course deleted" };
    },
    {
      params: CourseModel.idParam,
      response: CourseModel.deleteResponse,
    },
  );
