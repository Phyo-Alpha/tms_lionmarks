import { and, count, eq, inArray, ne } from "drizzle-orm";
import type { Database } from "@/server/api";
import { course, courseRegistration } from "@/server/db/schema/trainee-schema";
import type { RegistrationModel } from "./model";
import { status } from "@/server/helpers/responseWrapper";
import { RegistrationModel as Model } from "./model";
import { z } from "zod";

type RegistrationStatus = "enrolled" | "in_progress" | "completed" | "withdrawn";

const ACTIVE_REGISTRATION_STATUSES = ["enrolled", "in_progress"] as const;
const ACTIVE_STATUS_SET = new Set<RegistrationStatus>(ACTIVE_REGISTRATION_STATUSES);

export abstract class RegistrationService {
  static async list(db: Database, query: RegistrationModel.ListQuery) {
    const { page, limit, order, courseId, learnerId, status: statusFilter } = query;
    const offset = (page - 1) * limit;
    const filters = [];

    if (courseId) {
      filters.push(eq(courseRegistration.courseId, courseId));
    }

    if (learnerId) {
      filters.push(eq(courseRegistration.learnerId, learnerId));
    }

    if (statusFilter) {
      filters.push(eq(courseRegistration.status, statusFilter));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const countPromise = whereClause
      ? db.select({ value: count() }).from(courseRegistration).where(whereClause)
      : db.select({ value: count() }).from(courseRegistration);

    const [data, totalResult] = await Promise.all([
      db.query.courseRegistration.findMany({
        where: whereClause ? () => whereClause : undefined,
        with: {
          learner: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              status: true,
            },
          },
          course: {
            columns: {
              id: true,
              code: true,
              title: true,
              isPublished: true,
              startDate: true,
              endDate: true,
              capacity: true,
            },
          },
        },
        limit,
        offset,
        orderBy: (table, helpers) => [
          order === "asc" ? helpers.asc(table.registeredAt) : helpers.desc(table.registeredAt),
        ],
      }),
      countPromise,
    ]);

    const totalItems = totalResult[0]?.value ?? 0;
    const totalPages = Math.ceil(totalItems / limit) || 1;

    return {
      data: data as z.infer<typeof Model.entity>[],
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    };
  }

  static async getById(db: Database, id: string) {
    const record = await db.query.courseRegistration.findFirst({
      where: (registrationTable, { eq }) => eq(registrationTable.id, id),
      with: {
        learner: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          },
        },
        course: {
          columns: {
            id: true,
            code: true,
            title: true,
            isPublished: true,
            startDate: true,
            endDate: true,
            capacity: true,
          },
        },
      },
    });

    if (!record) {
      throw status("Not Found", { message: "Course registration not found" });
    }

    return record as z.infer<typeof Model.entity>;
  }

  static async create(db: Database, payload: RegistrationModel.CreateBody) {
    const [existingLearner, existingCourse, existingRegistration] = await Promise.all([
      db.query.learner.findFirst({
        where: (learnerTable, { eq }) => eq(learnerTable.id, payload.learnerId),
        columns: { id: true },
      }),
      db.query.course.findFirst({
        where: (courseTable, { eq }) => eq(courseTable.id, payload.courseId),
        columns: {
          id: true,
          capacity: true,
          startDate: true,
          endDate: true,
          title: true,
        },
      }),
      db.query.courseRegistration.findFirst({
        where: (registrationTable, { and, eq }) =>
          and(
            eq(registrationTable.learnerId, payload.learnerId),
            eq(registrationTable.courseId, payload.courseId),
          ),
        columns: { id: true },
      }),
    ]);

    if (!existingLearner) {
      throw status("Bad Request", { message: "Learner not found" });
    }

    if (!existingCourse) {
      throw status("Bad Request", { message: "Course not found" });
    }

    if (existingRegistration) {
      throw status("Conflict", {
        message: "Learner is already registered for this course",
      });
    }

    await this.assertCourseCapacity(db, {
      courseId: payload.courseId,
      capacity: existingCourse.capacity,
      desiredStatus: payload.status as RegistrationStatus,
    });

    await this.assertLearnerSchedule(db, {
      learnerId: payload.learnerId,
      courseId: payload.courseId,
      courseTitle: existingCourse.title ?? "course",
      startDate: existingCourse.startDate,
      endDate: existingCourse.endDate,
      desiredStatus: payload.status as RegistrationStatus,
    });

    const result = await db.insert(courseRegistration).values(payload).$returningId();
    const createdId = Array.isArray(result) && result[0] ? result[0].id : null;

    if (!createdId) {
      throw status("Internal Server Error", {
        message: "Failed to create course registration",
      });
    }

    return this.getById(db, createdId);
  }

  static async update(db: Database, id: string, payload: RegistrationModel.UpdateBody) {
    const registration = await this.getRegistration(db, id);

    const targetLearnerId = payload.learnerId ?? registration.learnerId;
    const targetCourseId = payload.courseId ?? registration.courseId;
    const targetStatus = (payload.status ?? registration.status) as RegistrationStatus;

    if (targetLearnerId !== registration.learnerId || targetCourseId !== registration.courseId) {
      const duplicate = await db.query.courseRegistration.findFirst({
        where: (registrationTable, { and, eq, ne }) =>
          and(
            eq(registrationTable.learnerId, targetLearnerId),
            eq(registrationTable.courseId, targetCourseId),
            ne(registrationTable.id, id),
          ),
        columns: { id: true },
      });

      if (duplicate) {
        throw status("Conflict", {
          message: "Learner is already registered for this course",
        });
      }
    }

    const courseDetails =
      payload.courseId && payload.courseId !== registration.courseId
        ? await db.query.course.findFirst({
            where: (courseTable, { eq }) => eq(courseTable.id, payload.courseId!),
            columns: {
              id: true,
              capacity: true,
              startDate: true,
              endDate: true,
              title: true,
            },
          })
        : {
            id: registration.courseId,
            capacity: registration.course?.capacity ?? null,
            startDate: registration.course?.startDate ?? null,
            endDate: registration.course?.endDate ?? null,
            title: registration.course?.title ?? "course",
          };

    if (!courseDetails) {
      throw status("Bad Request", { message: "Course not found" });
    }

    await this.assertCourseCapacity(db, {
      courseId: courseDetails.id,
      capacity: courseDetails.capacity,
      desiredStatus: targetStatus,
      excludeRegistrationId: id,
    });

    await this.assertLearnerSchedule(db, {
      learnerId: targetLearnerId,
      courseId: courseDetails.id,
      courseTitle: courseDetails.title ?? "course",
      startDate: courseDetails.startDate,
      endDate: courseDetails.endDate,
      desiredStatus: targetStatus,
      excludeRegistrationId: id,
    });

    await db
      .update(courseRegistration)
      .set({
        ...payload,
      })
      .where(eq(courseRegistration.id, id));

    return this.getById(db, id);
  }

  static async remove(db: Database, id: string) {
    const existing = await db.query.courseRegistration.findFirst({
      where: (registrationTable, { eq }) => eq(registrationTable.id, id),
    });

    if (!existing) {
      throw status("Not Found", { message: "Course registration not found" });
    }

    await db.delete(courseRegistration).where(eq(courseRegistration.id, id));

    return existing;
  }

  private static async ensureExists(db: Database, id: string) {
    await this.getRegistration(db, id);
  }

  private static async getRegistration(db: Database, id: string) {
    const registration = await db.query.courseRegistration.findFirst({
      where: (registrationTable, { eq }) => eq(registrationTable.id, id),
      columns: {
        id: true,
        learnerId: true,
        courseId: true,
        status: true,
      },
      with: {
        course: {
          columns: {
            id: true,
            title: true,
            capacity: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    if (!registration) {
      throw status("Not Found", { message: "Course registration not found" });
    }

    return registration;
  }

  private static async assertCourseCapacity(
    db: Database,
    params: {
      courseId: string;
      capacity: number | null | undefined;
      desiredStatus: RegistrationStatus;
      excludeRegistrationId?: string;
    },
  ) {
    if (!params.capacity) return;
    if (!ACTIVE_STATUS_SET.has(params.desiredStatus)) return;

    const conditions = [
      eq(courseRegistration.courseId, params.courseId),
      inArray(courseRegistration.status, ACTIVE_REGISTRATION_STATUSES),
    ];

    if (params.excludeRegistrationId) {
      conditions.push(ne(courseRegistration.id, params.excludeRegistrationId));
    }

    const [{ value: activeCount } = { value: 0 }] = await db
      .select({ value: count() })
      .from(courseRegistration)
      .where(and(...conditions));

    if (activeCount >= params.capacity) {
      throw status("Bad Request", {
        message: "Course capacity has been reached",
      });
    }
  }

  private static async assertLearnerSchedule(
    db: Database,
    params: {
      learnerId: string;
      courseId: string;
      courseTitle: string;
      startDate: Date | null | undefined;
      endDate: Date | null | undefined;
      desiredStatus: RegistrationStatus;
      excludeRegistrationId?: string;
    },
  ) {
    if (!params.startDate || !params.endDate) return;
    if (!ACTIVE_STATUS_SET.has(params.desiredStatus)) return;

    const conditions = [
      eq(courseRegistration.learnerId, params.learnerId),
      inArray(courseRegistration.status, ACTIVE_REGISTRATION_STATUSES),
    ];

    if (params.excludeRegistrationId) {
      conditions.push(ne(courseRegistration.id, params.excludeRegistrationId));
    }

    const existing = await db
      .select({
        id: courseRegistration.id,
        courseId: courseRegistration.courseId,
        title: course.title,
        startDate: course.startDate,
        endDate: course.endDate,
      })
      .from(courseRegistration)
      .innerJoin(course, eq(course.id, courseRegistration.courseId))
      .where(and(...conditions));

    const conflicting = existing.find((registration) => {
      if (!registration.startDate || !registration.endDate) return false;
      if (registration.courseId === params.courseId) return false;

      const startsBeforeEnd = registration.startDate <= params.endDate!;
      const endsAfterStart = registration.endDate >= params.startDate!;
      return startsBeforeEnd && endsAfterStart;
    });

    if (conflicting) {
      throw status("Bad Request", {
        message: "Learner already has an overlapping course",
        details: {
          courseTitle: conflicting.title,
        },
      });
    }
  }
}
