import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";
import type { Database } from "@/server/api";
import { learner, courseRegistration } from "@/server/db/schema/trainee-schema";
import type { LearnerModel } from "./model";
import { status } from "@/server/helpers/responseWrapper";
import { LearnerModel as Model } from "./model";
import { z } from "zod";

export abstract class LearnerService {
  static async list(db: Database, query: LearnerModel.ListQuery) {
    const { page, limit, search, status: learnerStatus, sort, order } = query;
    const offset = (page - 1) * limit;
    const filters = [];

    if (search) {
      const likeValue = `%${search}%`;
      filters.push(
        or(
          ilike(learner.firstName, likeValue),
          ilike(learner.lastName, likeValue),
          ilike(learner.email, likeValue),
          ilike(learner.organization, likeValue),
        ),
      );
    }

    if (learnerStatus) {
      filters.push(eq(learner.status, learnerStatus));
    }

    const whereClause = filters.length > 0 ? and(...filters) : undefined;

    const sortColumn = {
      createdAt: learner.createdAt,
      firstName: learner.firstName,
      lastName: learner.lastName,
    }[sort];

    const orderBy = order === "asc" ? asc(sortColumn) : desc(sortColumn);

    const dataQuery = whereClause
      ? db.select().from(learner).where(whereClause).limit(limit).offset(offset).orderBy(orderBy)
      : db.select().from(learner).limit(limit).offset(offset).orderBy(orderBy);

    const countQuery = whereClause
      ? db.select({ value: count() }).from(learner).where(whereClause)
      : db.select({ value: count() }).from(learner);

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
    const record = await db.query.learner.findFirst({
      where: (learnerTable, { eq }) => eq(learnerTable.id, id),
      with: {
        registrations: true,
      },
    });

    if (!record) {
      throw status("Not Found", { message: "Learner not found" });
    }

    return record as z.infer<typeof Model.detail>;
  }

  static async create(db: Database, payload: LearnerModel.CreateBody) {
    const [created] = await db.insert(learner).values(payload).returning();

    if (!created) {
      throw status("Internal Server Error", { message: "Failed to create learner" });
    }

    return created as z.infer<typeof Model.entity>;
  }

  static async update(db: Database, id: string, payload: LearnerModel.UpdateBody) {
    await this.ensureExists(db, id);

    const [updated] = await db
      .update(learner)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(learner.id, id))
      .returning();

    if (!updated) {
      throw status("Internal Server Error", { message: "Failed to update learner" });
    }

    return updated as z.infer<typeof Model.entity>;
  }

  static async remove(db: Database, id: string) {
    await this.ensureExists(db, id);

    const registrations = await db
      .select()
      .from(courseRegistration)
      .where(eq(courseRegistration.learnerId, id));

    if (registrations.length > 0) {
      throw status("Bad Request", {
        message: "Cannot delete learner with active registrations",
      });
    }

    const [deleted] = await db.delete(learner).where(eq(learner.id, id)).returning();

    if (!deleted) {
      throw status("Internal Server Error", { message: "Failed to delete learner" });
    }

    return deleted;
  }

  private static async ensureExists(db: Database, id: string) {
    const exists = await db.query.learner.findFirst({
      where: (learnerTable, { eq }) => eq(learnerTable.id, id),
      columns: {
        id: true,
      },
    });

    if (!exists) {
      throw status("Not Found", { message: "Learner not found" });
    }
  }
}
