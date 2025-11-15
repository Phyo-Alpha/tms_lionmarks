import { AuthContext, authMiddleware } from "@/server/lib/auth-middleware";
import Elysia from "elysia";
import { z } from "zod";
import { CourseSessionsSSGModels } from "./models";
import { roleCheck } from "@/server/helpers/roleCheck";
import { status } from "@/server/helpers/responseWrapper";
import { CourseSessionsSSGService } from "./services";

export const courseSessionsSSGController = new Elysia({
  prefix: "/course-sessions",
  detail: {
    tags: ["SSG", "Course Sessions"],
  },
})
  .use(authMiddleware)
  .get(
    "/runs/:runId/sessions",
    async ({ params, query, user, session, headers }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      const runId = parseInt(params.runId, 10);
      if (isNaN(runId)) {
        throw status(400, "Invalid runId");
      }

      const apiVersion = headers["x-api-version"] ?? "v1.5";
      if (apiVersion === "v1.4") {
        throw status(400, "API version v1.4 is going to/was decommissioned at  2026-03-30");
      }
      return CourseSessionsSSGService.list(runId, query, apiVersion);
    },
    {
      auth: true,
      params: z.object({
        runId: z.string(),
      }),
      query: CourseSessionsSSGModels.listCourseSessionsDto,
      response: CourseSessionsSSGModels.listCourseSessionsResponse,
    },
  );
