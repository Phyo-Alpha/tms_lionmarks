import { randomUUID } from "node:crypto";
import { relations } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { z } from "zod";

export const learner = mysqlTable("learner", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  organization: varchar("organization", { length: 255 }),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .defaultNow()
    .notNull(),
  metadata: text("metadata"),
});

export const course = mysqlTable("course", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  code: varchar("code", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  durationHours: int("duration_hours").default(0).notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  capacity: int("capacity"),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .defaultNow()
    .notNull(),
});

export const courseRegistration = mysqlTable("course_registration", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  learnerId: varchar("learner_id", { length: 36 })
    .notNull()
    .references(() => learner.id, { onDelete: "cascade" }),
  courseId: varchar("course_id", { length: 36 })
    .notNull()
    .references(() => course.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 50 }).default("enrolled").notNull(),
  registeredAt: timestamp("registered_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  score: int("score"),
  certificateUrl: varchar("certificate_url", { length: 1000 }),
  notes: text("notes"),
});

export const learnerRelations = relations(learner, ({ many }) => ({
  registrations: many(courseRegistration),
}));

export const courseRelations = relations(course, ({ many }) => ({
  registrations: many(courseRegistration),
}));

export const courseRegistrationRelations = relations(
  courseRegistration,
  ({ one }) => ({
    learner: one(learner, {
      fields: [courseRegistration.learnerId],
      references: [learner.id],
    }),
    course: one(course, {
      fields: [courseRegistration.courseId],
      references: [course.id],
    }),
  }),
);

const learnerBaseSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(3).max(30).optional(),
  organization: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]).default("active"),
  metadata: z.string().optional(),
});

export const insertLearnerSchema = learnerBaseSchema;

export const updateLearnerSchema = learnerBaseSchema.partial();

const courseBaseSchema = z.object({
  code: z
    .string()
    .min(2)
    .regex(/^[A-Z0-9\-]+$/, "Course code must be uppercase alphanumeric"),
  title: z.string().min(3),
  description: z.string().max(10_000).optional(),
  durationHours: z.number().int().min(0).default(0),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  capacity: z.number().int().positive().optional(),
  isPublished: z.boolean().default(false),
});

export const insertCourseSchema = courseBaseSchema.superRefine((val, ctx) => {
  if (val.startDate && val.endDate && val.endDate < val.startDate) {
    ctx.addIssue({
      path: ["endDate"],
      code: z.ZodIssueCode.custom,
      message: "End date must be after start date",
    });
  }
});

export const updateCourseSchema = courseBaseSchema
  .partial()
  .superRefine((val, ctx) => {
    if (val.startDate && val.endDate && val.endDate < val.startDate) {
      ctx.addIssue({
        path: ["endDate"],
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
      });
    }
  });

const courseRegistrationBase = z.object({
  learnerId: z.string().uuid(),
  courseId: z.string().uuid(),
  status: z.enum(["enrolled", "in_progress", "completed", "withdrawn"]),
  registeredAt: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  score: z.number().int().min(0).max(100).optional(),
  certificateUrl: z.string().url().optional(),
  notes: z.string().max(5000).optional(),
});

export const insertCourseRegistrationSchema = courseRegistrationBase.superRefine(
  (value, ctx) => {
    if (value.completedAt && value.status !== "completed") {
      ctx.addIssue({
        path: ["status"],
        code: z.ZodIssueCode.custom,
        message: "Status must be completed when completedAt is provided",
      });
    }
  },
);

export const updateCourseRegistrationSchema = courseRegistrationBase
  .partial()
  .superRefine((value, ctx) => {
    if (value.completedAt && value.status && value.status !== "completed") {
      ctx.addIssue({
        path: ["status"],
        code: z.ZodIssueCode.custom,
        message: "Status must be completed when completedAt is provided",
      });
    }
  });
