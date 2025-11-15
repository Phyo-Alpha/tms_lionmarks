import { authMiddleware } from "@/server/lib/auth-middleware";
import Elysia from "elysia";

export const courseSessionAttendanceSSGController = new Elysia({
  prefix: "/course-sessions/runs",
  detail: {
    tags: ["SSG", "Course Session Attendance"],
  },
})
  .use(authMiddleware)
  .get("/:runId/sessions/attendance", async () => {}, {
    auth: true,
  });
