import { db } from "@/server/db";
import Elysia from "elysia";
import { auth } from "./auth";
import { learnersController } from "./learners";
import { registrationsController } from "./registrations";
import { publicRegistrationController } from "./public-registration";
import { skillsFutureSSGController } from "./ssg";

export type Database = typeof db;

export const api = new Elysia({ detail: { tags: ["Elysia API"] } })
  .use(auth)
  .use(learnersController)
  .use(registrationsController)
  .use(publicRegistrationController)
  .use(skillsFutureSSGController);

export type App = typeof api;
