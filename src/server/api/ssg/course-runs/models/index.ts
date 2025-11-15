import z from "zod";
import { createCourseRunRequestDto } from "./dto/create-course-run.dto";
import { updateCourseRunRequestDto } from "./dto/update-course-run.dto";
import { deleteCourseRunRequestDto } from "./dto/delete-course-run.dto";
import { skillFutureResponse } from "../../common/response";
import { getCourseRunByIdResponseDataSchema } from "./entity/course-run-by-id.entity";

export namespace CoursesRunsSSGModels {
  export const createCourseRunDto = createCourseRunRequestDto;
  export type CreateCourseRunRequestDto = z.infer<typeof createCourseRunRequestDto>;

  export const createCourseRunResponse = skillFutureResponse(z.any());
  export type CreateCourseRunResponse = z.infer<typeof createCourseRunResponse>;

  export const getCourseRunByIdResponse = skillFutureResponse(getCourseRunByIdResponseDataSchema);
  export type GetCourseRunByIdResponse = z.infer<typeof getCourseRunByIdResponse>;

  export const updateCourseRunDto = updateCourseRunRequestDto;
  export type UpdateCourseRunRequestDto = z.infer<typeof updateCourseRunRequestDto>;

  export const updateCourseRunResponse = skillFutureResponse(z.any());
  export type UpdateCourseRunResponse = z.infer<typeof updateCourseRunResponse>;

  export const deleteCourseRunDto = deleteCourseRunRequestDto;
  export type DeleteCourseRunRequestDto = z.infer<typeof deleteCourseRunRequestDto>;

  export const deleteCourseRunResponse = skillFutureResponse(z.any());
  export type DeleteCourseRunResponse = z.infer<typeof deleteCourseRunResponse>;
}
