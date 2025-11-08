import { z } from "zod";
import {
  insertLearnerSchema,
  updateLearnerSchema,
  insertCourseSchema,
  updateCourseSchema,
  insertCourseRegistrationSchema,
  updateCourseRegistrationSchema,
} from "@/server/db/schema/trainee-schema";

export const learnerSchemas = {
  create: insertLearnerSchema,
  update: updateLearnerSchema,
};

export type InsertLearnerInput = z.infer<typeof learnerSchemas.create>;
export type UpdateLearnerInput = z.infer<typeof learnerSchemas.update>;

export const courseSchemas = {
  create: insertCourseSchema,
  update: updateCourseSchema,
};

export type InsertCourseInput = z.infer<typeof courseSchemas.create>;
export type UpdateCourseInput = z.infer<typeof courseSchemas.update>;

export const registrationSchemas = {
  create: insertCourseRegistrationSchema,
  update: updateCourseRegistrationSchema,
};

export type InsertRegistrationInput = z.infer<typeof registrationSchemas.create>;
export type UpdateRegistrationInput = z.infer<typeof registrationSchemas.update>;
