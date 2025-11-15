import { status } from "@/server/helpers/responseWrapper";
import { CoursesRunsSSGModels } from "./models";
import { callSSGAPIWithTLS } from "../lib/ssg-tls-client";
import { handleSkillFutureError } from "../helper/errors";

export abstract class CoursesRunsSSGService {
  static async create(dto: CoursesRunsSSGModels.CreateCourseRunRequestDto) {
    try {
      const response = await callSSGAPIWithTLS("/courses/courseRuns/publish", {
        method: "POST",
        body: dto,
      });

      const parsed = CoursesRunsSSGModels.createCourseRunResponse.parse(response);
      handleSkillFutureError(parsed);

      return parsed;
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        throw err;
      }
      console.log(err);
      throw status(500, "Server error while creating course run");
    }
  }

  static async getById(runId: number) {
    try {
      const response = await callSSGAPIWithTLS(`/courses/courseRuns/id/${runId}`, {
        method: "GET",
      });

      const parsed = CoursesRunsSSGModels.getCourseRunByIdResponse.parse(response);
      handleSkillFutureError(parsed);

      return parsed;
    } catch (err) {
      if (err && typeof err === "object" && "status" in err) {
        throw err;
      }
      console.log(err);
      throw status(500, "Server error while fetching course run");
    }
  }
}
