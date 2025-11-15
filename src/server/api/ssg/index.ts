import { authMiddleware } from "@/server/lib/auth-middleware";
import Elysia from "elysia";
import { coursesSSGController } from "./courses";
import { courseRunsSSGController } from "./course-runs";

export const skillsFutureSSGController = new Elysia({
  prefix: "/ssg",
  detail: {
    tags: ["SSG"],
  },
})
  .use(authMiddleware)
  .use(coursesSSGController)
  .use(courseRunsSSGController);
