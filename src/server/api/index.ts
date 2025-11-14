import { db } from "@/server/db";
import Elysia from "elysia";
import { auth } from "./auth";
import { learnersController } from "./learners";
import { coursesController } from "./courses";
import { registrationsController } from "./registrations";
import { publicRegistrationController } from "./public-registration";
import { publicCoursesController } from "./public-courses";

export type Database = typeof db;

export const api = new Elysia({ detail: { tags: ["Elysia API"] } })
  .use(auth)
  .use(learnersController)
  .use(coursesController)
  .use(registrationsController)
  .use(publicRegistrationController)
  .use(publicCoursesController);

export type App = typeof api;
