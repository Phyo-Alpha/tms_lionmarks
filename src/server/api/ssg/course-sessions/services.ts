import { status } from "@/server/helpers/responseWrapper";
import { CourseSessionsSSGModels } from "./models";
import { callSSGAPIWithTLS } from "../lib/ssg-tls-client";
import { handleSkillFutureError } from "../helper/errors";

export abstract class CourseSessionsSSGService {
  static async list(
    runId: number,
    query: CourseSessionsSSGModels.ListCourseSessionsRequestDto,
    apiVersion?: string,
  ) {
    try {
      const queryParams: Record<string, string> = {
        uen: query.uen,
        courseReferenceNumber: encodeURIComponent(query.courseReferenceNumber),
        ...(query.sessionMonth && { sessionMonth: query.sessionMonth }),
        ...(query.includeExpiredCourses !== undefined && {
          includeExpiredCourses: String(query.includeExpiredCourses),
        }),
      };

      const headers: Record<string, string> = {};
      if (apiVersion) {
        headers["x-api-version"] = apiVersion;
      }

      const response = await callSSGAPIWithTLS(`/courses/runs/${runId}/sessions`, {
        method: "GET",
        queryParams,
        headers,
      });

      const parsed = CourseSessionsSSGModels.listCourseSessionsResponse.parse(response);
      handleSkillFutureError(parsed);

      return parsed;
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        throw err;
      }
      console.log(err);
      throw status(500, "Server error while fetching course sessions");
    }
  }
}
