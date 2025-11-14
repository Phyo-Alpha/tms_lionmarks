import { Elysia } from "elysia";
import { CourseService } from "../courses/service";
import { PublicCourseModel } from "./model";
import { elysiaDb } from "@/server/db";

export const publicCoursesController = new Elysia({
  prefix: "/public/courses",
  detail: {
    tags: ["Public Courses"],
  },
})
  .use(elysiaDb)
  .get(
    "/",
    async ({ db, query }) => {
      return CourseService.list(db, {
        page: 1,
        limit: query.limit,
        published: query.published ?? true,
        sort: "createdAt",
        order: "desc",
      });
    },
    {
      query: PublicCourseModel.listQuery,
      response: PublicCourseModel.listResponse,
    },
  );
