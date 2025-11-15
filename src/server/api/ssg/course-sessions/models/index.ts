import { z } from "zod";
import { listCourseSessionsRequestDto } from "./dto/list-course-session.dto";
import { listCourseSessionsResponseDataSchema } from "./entity/list-course-sessions.entity";
import { skillFutureResponse } from "../../common/response";

export namespace CourseSessionsSSGModels {
  export const listCourseSessionsDto = listCourseSessionsRequestDto;
  export type ListCourseSessionsRequestDto = z.infer<typeof listCourseSessionsRequestDto>;

  export const listCourseSessionsResponse = skillFutureResponse(listCourseSessionsResponseDataSchema);
  export type ListCourseSessionsResponse = z.infer<typeof listCourseSessionsResponse>;
}
