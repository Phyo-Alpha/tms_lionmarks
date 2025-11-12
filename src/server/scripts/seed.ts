/// <reference types="bun-types" />
import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { learner, course, courseRegistration } from "@/server/db/schema";
import { auth } from "../lib/auth";
import env from "../config/env";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Reset database
    console.log("🗑️  Resetting database...");

    // MySQL truncate syntax - disable foreign key checks, truncate all tables
    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);

    const tables = [
      "course_registration",
      "learner",
      "course",
      "invitation",
      "member",
      "organization",
      "verification",
      "account",
      "session",
      "user",
    ];

    for (const table of tables) {
      await db.execute(sql.raw(`TRUNCATE TABLE ${table}`));
    }

    await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

    // Insert sample data
    console.log("📊 Inserting sample data...");

    await auth.api.createUser({
      body: {
        name: env.ADMIN_USERNAME,
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
        role: "admin",
      },
    });

    await db.transaction(async (tx) => {
      const learnersSeed = [
        {
          id: randomUUID(),
          firstName: "Ava",
          lastName: "Tan",
          email: "ava.tan@example.com",
          phone: "+6590001111",
          organization: "Acme Corp",
          status: "active",
        },
        {
          id: randomUUID(),
          firstName: "Noah",
          lastName: "Lim",
          email: "noah.lim@example.com",
          phone: "+6590002222",
          organization: "Globex",
          status: "active",
        },
        {
          id: randomUUID(),
          firstName: "Emma",
          lastName: "Lee",
          email: "emma.lee@example.com",
          phone: "+6590003333",
          organization: "Innotech",
          status: "inactive",
        },
      ] satisfies Array<typeof learner.$inferInsert>;

      await tx.insert(learner).values(learnersSeed);

      const coursesSeed = [
        {
          id: randomUUID(),
          code: "TMS-101",
          title: "Introduction to Trainee Management",
          description: "Fundamentals of managing trainee cohorts effectively.",
          durationHours: 12,
          capacity: 30,
          isPublished: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        {
          id: randomUUID(),
          code: "TMS-201",
          title: "Advanced Course Scheduling",
          description: "Deep dive into scheduling strategies and analytics.",
          durationHours: 16,
          capacity: 20,
          isPublished: false,
        },
      ] satisfies Array<typeof course.$inferInsert>;

      await tx.insert(course).values(coursesSeed);

      await tx.insert(courseRegistration).values([
        {
          learnerId: learnersSeed[0]?.id,
          courseId: coursesSeed[0]?.id,
          status: "enrolled",
        },
        {
          learnerId: learnersSeed[1]?.id,
          courseId: coursesSeed[0]?.id,
          status: "in_progress",
        },
        {
          learnerId: learnersSeed[2]?.id,
          courseId: coursesSeed[1]?.id,
          status: "withdrawn",
        },
      ]);

      console.log("✅ Database seeding completed successfully!");
      console.log("\n🔐 Admin credentials:");
      console.log(`  Admin: ${env.ADMIN_EMAIL} Password: ${env.ADMIN_PASSWORD}`);
    });
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
if (require.main === module) {
  seed()
    .then(() => {
      console.log("🎉 Seeding process completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    });
}

export { seed };
