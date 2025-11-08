import { db } from "@/server/db";
import Elysia from "elysia";
import { auth } from "./auth";
import { learnersController } from "./learners";
import { coursesController } from "./courses";
import { registrationsController } from "./registrations";

export type Database = typeof db;

export const api = new Elysia({ detail: { tags: ["Elysia API"] } })
  .use(auth)
  .use(learnersController)
  .use(coursesController)
  .use(registrationsController);

export type App = typeof api;
