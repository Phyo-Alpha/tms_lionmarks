import z from "zod";
import { GetAllCoursesRequestDto } from "./dto/courses.dto";
import { GetAllCoursesApiResponse } from "./entity/course.entity";

export namespace CoursesSSGModels {
  export const listCourseApiResponse = GetAllCoursesApiResponse;
  export const listCourseRequestDto = GetAllCoursesRequestDto;

  export type ListCourseRequestDto = z.infer<typeof listCourseRequestDto>;
}
