import { AuthContext, authMiddleware } from "@/server/lib/auth-middleware";
import Elysia from "elysia";
import { z } from "zod";
import { TrainerSSGModels } from "./models";
import { roleCheck } from "@/server/helpers/roleCheck";
import { TrainerSSGService } from "./services";

export const trainerSSGController = new Elysia({
  prefix: "/training-providers",
  detail: {
    tags: ["SSG", "Trainer"],
  },
})
  .use(authMiddleware)
  .post(
    "/:uen/trainer",
    async ({ params, body, user, session, headers }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      const apiVersion = headers["x-api-version"];
      return TrainerSSGService.create(params.uen, body, apiVersion);
    },
    {
      auth: true,
      params: z.object({
        uen: z.string(),
      }),
      body: TrainerSSGModels.createTrainerDto,
      response: TrainerSSGModels.createTrainerResponse,
    },
  )
  .get(
    "/:uen/trainers",
    async ({ params, query, user, session, headers }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      const apiVersion = headers["x-api-version"];
      return TrainerSSGService.list(params.uen, query, apiVersion);
    },
    {
      auth: true,
      params: z.object({
        uen: z.string(),
      }),
      query: TrainerSSGModels.listTrainersDto,
      response: TrainerSSGModels.listTrainersResponse,
    },
  )
  .put(
    "/:uen/trainers/:trainerId",
    async ({ params, body, user, session, headers }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      const apiVersion = headers["x-api-version"];
      return TrainerSSGService.update(params.uen, params.trainerId, body, apiVersion);
    },
    {
      auth: true,
      params: z.object({
        uen: z.string(),
        trainerId: z.string(),
      }),
      body: TrainerSSGModels.updateTrainerDto,
      response: TrainerSSGModels.updateTrainerResponse,
    },
  )
  .delete(
    "/:uen/trainers/:trainerId",
    async ({ params, body, user, session, headers }) => {
      roleCheck({ user: user as AuthContext["user"], session }, "admin");
      const apiVersion = headers["x-api-version"];
      return TrainerSSGService.delete(params.uen, params.trainerId, body, apiVersion);
    },
    {
      auth: true,
      params: z.object({
        uen: z.string(),
        trainerId: z.string(),
      }),
      body: TrainerSSGModels.deleteTrainerDto,
      response: TrainerSSGModels.deleteTrainerResponse,
    },
  );
