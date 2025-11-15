import { callSSGAPIWithTLS } from "@/server/api/ssg/lib/ssg-tls-client";
import z from "zod";
import { CoursesSSGModels } from "./models";
import { status } from "@/server/helpers/responseWrapper";

export abstract class CoursesSSGService {
  static async coursesCategories() {
    return status(500, "Not implemented");
  }

  static async courses(query: CoursesSSGModels.ListCourseRequestDto) {
    try {
      const queryParams: Record<string, string | string[]> = {
        ...Object.fromEntries(
          Object.entries(query).map(([key, value]) => [
            key,
            typeof value === "number" ? String(value) : value,
          ]),
        ),
      };

      const response = await callSSGAPIWithTLS<
        z.infer<typeof CoursesSSGModels.listCourseApiResponse>
      >("/courses/directory", {
        method: "GET",
        queryParams,
      });

      return CoursesSSGModels.listCourseApiResponse.parse(response);
    } catch (error) {
      console.log(error);
      throw status(500, "Server error while fetching courses");
    }
  }
}
