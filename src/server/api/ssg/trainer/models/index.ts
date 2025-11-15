import { z } from "zod";
import { createTrainerRequestDto } from "./dto/create-trainer.dto";
import { updateTrainerRequestDto } from "./dto/update-trainer.dto";
import { deleteTrainerRequestDto } from "./dto/delete-trainer.dto";
import { listTrainersRequestDto } from "./dto/list-trainers.dto";
import { listTrainersResponseDataSchema } from "./entity/list-trainers.entity";
import { skillFutureResponse } from "../../common/response";

export namespace TrainerSSGModels {
  export const createTrainerDto = createTrainerRequestDto;
  export type CreateTrainerRequestDto = z.infer<typeof createTrainerRequestDto>;

  export const createTrainerResponse = skillFutureResponse(z.any());
  export type CreateTrainerResponse = z.infer<typeof createTrainerResponse>;

  export const listTrainersDto = listTrainersRequestDto;
  export type ListTrainersRequestDto = z.infer<typeof listTrainersRequestDto>;

  export const listTrainersResponse = skillFutureResponse(listTrainersResponseDataSchema);
  export type ListTrainersResponse = z.infer<typeof listTrainersResponse>;

  export const updateTrainerDto = updateTrainerRequestDto;
  export type UpdateTrainerRequestDto = z.infer<typeof updateTrainerRequestDto>;

  export const updateTrainerResponse = skillFutureResponse(z.any());
  export type UpdateTrainerResponse = z.infer<typeof updateTrainerResponse>;

  export const deleteTrainerDto = deleteTrainerRequestDto;
  export type DeleteTrainerRequestDto = z.infer<typeof deleteTrainerRequestDto>;

  export const deleteTrainerResponse = skillFutureResponse(z.any());
  export type DeleteTrainerResponse = z.infer<typeof deleteTrainerResponse>;
}
