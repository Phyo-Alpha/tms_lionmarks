import { randomUUID } from "node:crypto";
import { describe, expect, it } from "bun:test";
import {
  insertLearnerSchema,
  insertCourseSchema,
  insertCourseRegistrationSchema,
  updateCourseRegistrationSchema,
} from "@/server/db/schema/trainee-schema";

describe("Trainee schemas", () => {
  it("accepts a valid learner payload", () => {
    const result = insertLearnerSchema.parse({
      firstName: "Alex",
      lastName: "Tan",
      email: "alex.tan@example.com",
      status: "active",
    });

    expect(result.email).toBe("alex.tan@example.com");
  });

  it("rejects an invalid learner email", () => {
    expect(() =>
      insertLearnerSchema.parse({
        firstName: "Alex",
        lastName: "Tan",
        email: "alex-at-example.com",
        status: "active",
      }),
    ).toThrow();
  });

  it("rejects a course with an end date before the start date", () => {
    expect(() =>
      insertCourseSchema.parse({
        code: "COURSE-1",
        title: "Invalid timing",
        durationHours: 4,
        startDate: new Date("2025-01-10"),
        endDate: new Date("2025-01-01"),
        isPublished: false,
      }),
    ).toThrow("End date must be after start date");
  });

  it("rejects registration completion without completed status", () => {
    expect(() =>
      insertCourseRegistrationSchema.parse({
        learnerId: randomUUID(),
        courseId: randomUUID(),
        status: "in_progress",
        completedAt: new Date(),
      }),
    ).toThrow("Status must be completed when completedAt is provided");
  });

  it("allows updating registration to completed with completion date", () => {
    const result = updateCourseRegistrationSchema.parse({
      status: "completed",
      completedAt: new Date(),
      score: 95,
    });

    expect(result.status).toBe("completed");
    expect(result.score).toBe(95);
  });
});
