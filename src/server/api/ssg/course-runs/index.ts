import { AuthContext, authMiddleware } from "@/server/lib/auth-middleware";
import Elysia from "elysia";
import { z } from "zod";
import { CoursesRunsSSGModels } from "./models";
import { roleCheck } from "@/server/helpers/roleCheck";
import { status } from "@/server/helpers/responseWrapper";
import { CoursesRunsSSGService } from "./service";

export const courseRunsSSGController = new Elysia({
  prefix: "/course-runs",
  detail: {
    tags: ["SSG", "Course Runs"],
  },
})
  .use(authMiddleware)
  .post(
    "/create",
    async ({ body, user, session }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      return CoursesRunsSSGService.create(body);
    },
    {
      auth: true,
      body: CoursesRunsSSGModels.createCourseRunDto,
      response: CoursesRunsSSGModels.createCourseRunResponse,
    },
  )
  .get(
    "/:runId",
    async ({ params, user, session }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      const runId = parseInt(params.runId, 10);
      if (isNaN(runId)) {
        throw status(400, "Invalid runId");
      }
      return CoursesRunsSSGService.getById(runId);
    },
    {
      auth: true,
      params: z.object({
        runId: z.string(),
      }),
      response: CoursesRunsSSGModels.getCourseRunByIdResponse,
    },
  )
  .put(
    "/:courseRunId",
    async ({ params, body, user, session }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      const courseRunId = parseInt(params.courseRunId, 10);
      if (isNaN(courseRunId)) {
        throw status(400, "Invalid courseRunId");
      }
      return CoursesRunsSSGService.update(courseRunId, body);
    },
    {
      auth: true,
      params: z.object({
        courseRunId: z.string(),
      }),
      body: CoursesRunsSSGModels.updateCourseRunDto,
      response: CoursesRunsSSGModels.updateCourseRunResponse,
    },
  )
  .delete(
    "/:courseRunId",
    async ({ params, body, user, session }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      const courseRunId = parseInt(params.courseRunId, 10);
      if (isNaN(courseRunId)) {
        throw status(400, "Invalid courseRunId");
      }
      return CoursesRunsSSGService.delete(courseRunId, body);
    },
    {
      auth: true,
      params: z.object({
        courseRunId: z.string(),
      }),
      body: CoursesRunsSSGModels.deleteCourseRunDto,
      response: CoursesRunsSSGModels.deleteCourseRunResponse,
    },
  );
