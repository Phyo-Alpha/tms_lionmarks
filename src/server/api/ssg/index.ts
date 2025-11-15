import { authMiddleware } from "@/server/lib/auth-middleware";
import Elysia from "elysia";
import { coursesSSGController } from "./courses";

export const skillsFutureSSGController = new Elysia({
  prefix: "/ssg",
  detail: {
    tags: ["SSG"],
  },
})
  .use(authMiddleware)
  .use(coursesSSGController);
