import { randomUUID } from "node:crypto";
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const learner = pgTable(
  "learner",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    phone: text("phone"),
    organization: text("organization"),
    status: text("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .defaultNow()
      .notNull(),
    metadata: text("metadata"),
  },
  (table) => ({
    emailIdx: uniqueIndex("learner_email_idx").on(table.email),
  }),
);

export const course = pgTable(
  "course",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    code: text("code").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    durationHours: integer("duration_hours").default(0).notNull(),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    capacity: integer("capacity"),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    codeIdx: uniqueIndex("course_code_idx").on(table.code),
  }),
);

export const courseRegistration = pgTable(
  "course_registration",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    learnerId: text("learner_id")
      .notNull()
      .references(() => learner.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => course.id, { onDelete: "cascade" }),
    status: text("status").default("enrolled").notNull(),
    registeredAt: timestamp("registered_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
    score: integer("score"),
    certificateUrl: text("certificate_url"),
    notes: text("notes"),
  },
  (table) => ({
    uniqueRegistration: uniqueIndex("course_registration_unique").on(
      table.learnerId,
      table.courseId,
    ),
  }),
);

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
