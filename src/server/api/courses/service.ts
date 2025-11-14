import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import type { Database } from "@/server/api";
import { course, courseRegistration } from "@/server/db/schema/trainee-schema";
import type { CourseModel } from "./model";
import { status } from "@/server/helpers/responseWrapper";
import { CourseModel as Model } from "./model";
import { z } from "zod";

export abstract class CourseService {
  static async list(db: Database, query: CourseModel.ListQuery) {
    const { page, limit, search, published, sort, order } = query;
    const offset = (page - 1) * limit;
    const filters = [];

    if (search) {
      const likeValue = `%${search}%`;
      filters.push(
        or(
          ilike(course.title, likeValue),
          ilike(course.code, likeValue),
          ilike(course.description, likeValue),
        ),
      );
    }

    if (typeof published === "boolean") {
      filters.push(eq(course.isPublished, published));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const sortColumn = {
      createdAt: course.createdAt,
      title: course.title,
      startDate: course.startDate,
    }[sort];

    const orderBy = order === "asc" ? asc(sortColumn) : desc(sortColumn);

    const dataQuery = whereClause
      ? db.select().from(course).where(whereClause).limit(limit).offset(offset).orderBy(orderBy)
      : db.select().from(course).limit(limit).offset(offset).orderBy(orderBy);

    const countQuery = whereClause
      ? db.select({ value: count() }).from(course).where(whereClause)
      : db.select({ value: count() }).from(course);

    const [data, totalResult] = await Promise.all([dataQuery, countQuery]);

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
    } satisfies z.infer<typeof Model.listResponse>;
  }

  static async getById(db: Database, id: string) {
    const record = await db.query.course.findFirst({
      where: (courseTable, { eq }) => eq(courseTable.id, id),
      with: {
        registrations: {
          with: {
            learner: true,
          },
        },
      },
    });

    if (!record) {
      throw status("Not Found", { message: "Course not found" });
    }

    return record as z.infer<typeof Model.detail>;
  }

  static async create(db: Database, payload: CourseModel.CreateBody) {
    const result = await db.insert(course).values(payload).$returningId();
    const createdId = Array.isArray(result) && result[0] ? result[0].id : null;

    if (!createdId) {
      throw status("Internal Server Error", { message: "Failed to create course" });
    }

    const created = await db.query.course.findFirst({
      where: (courseTable, { eq }) => eq(courseTable.id, createdId),
    });

    if (!created) {
      throw status("Internal Server Error", { message: "Failed to fetch created course" });
    }

    return created as z.infer<typeof Model.entity>;
  }

  static async update(db: Database, id: string, payload: CourseModel.UpdateBody) {
    await this.ensureExists(db, id);

    await db
      .update(course)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(course.id, id));

    const updated = await db.query.course.findFirst({
      where: (courseTable, { eq }) => eq(courseTable.id, id),
    });

    if (!updated) {
      throw status("Internal Server Error", { message: "Failed to update course" });
    }

    return updated as z.infer<typeof Model.entity>;
  }

  static async remove(db: Database, id: string) {
    const existing = await db.query.course.findFirst({
      where: (courseTable, { eq }) => eq(courseTable.id, id),
    });

    if (!existing) {
      throw status("Not Found", { message: "Course not found" });
    }

    const registrations = await db
      .select()
      .from(courseRegistration)
      .where(eq(courseRegistration.courseId, id));

    if (registrations.length > 0) {
      throw status("Bad Request", {
        message: "Cannot delete course with active registrations",
      });
    }

    await db.delete(course).where(eq(course.id, id));

    return existing;
  }

  private static async ensureExists(db: Database, id: string) {
    const exists = await db.query.course.findFirst({
      where: (courseTable, { eq }) => eq(courseTable.id, id),
      columns: {
        id: true,
      },
    });

    if (!exists) {
      throw status("Not Found", { message: "Course not found" });
    }
  }
}
