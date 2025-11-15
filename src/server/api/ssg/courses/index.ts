import { elysiaDb } from "@/server/db";
import { roleCheck } from "@/server/helpers/roleCheck";
import { AuthContext, authMiddleware } from "@/server/lib/auth-middleware";
import Elysia from "elysia";
import { CoursesSSGService } from "./service";
import { CoursesSSGModels } from "./models";

export const coursesSSGController = new Elysia({
  prefix: "/ssg/courses",
  detail: {
    tags: ["SSG", "Courses"],
  },
})
  .use(elysiaDb)
  .use(authMiddleware)
  .get(
    "/",
    async ({ user, session, query }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      return CoursesSSGService.courses(query);
    },
    {
      auth: true,
      query: CoursesSSGModels.listCourseRequestDto,
      response: CoursesSSGModels.listCourseApiResponse,
    },
  );
