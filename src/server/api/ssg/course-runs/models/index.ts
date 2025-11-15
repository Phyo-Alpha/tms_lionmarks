import z from "zod";
import { createCourseRunRequestDto } from "./dto/create-course-run.dto";
import { skillFutureResponse } from "../../common/response";
import { getCourseRunByIdResponseDataSchema } from "./entity/course-run-by-id.entity";

export namespace CoursesRunsSSGModels {
  export const createCourseRunDto = createCourseRunRequestDto;
  export type CreateCourseRunRequestDto = z.infer<typeof createCourseRunRequestDto>;

  export const createCourseRunResponse = skillFutureResponse(z.any());
  export type CreateCourseRunResponse = z.infer<typeof createCourseRunResponse>;

  export const getCourseRunByIdResponse = skillFutureResponse(getCourseRunByIdResponseDataSchema);
  export type GetCourseRunByIdResponse = z.infer<typeof getCourseRunByIdResponse>;
}
