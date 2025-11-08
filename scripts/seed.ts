import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "../src/server/db";
import { account, user, learner, course, courseRegistration } from "@/server/db/schema";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...");

    // Reset database
    console.log("🗑️  Resetting database...");

    await db.execute(sql`
        DO
        $$
        DECLARE
            tbl text;
        BEGIN
            FOR tbl IN
                SELECT tablename FROM pg_tables WHERE schemaname = 'public'
            LOOP
                EXECUTE 'TRUNCATE TABLE public.' || quote_ident(tbl) || ' RESTART IDENTITY CASCADE';
            END LOOP;
        END
        $$;
        `);

    // Insert sample data
    console.log("📊 Inserting sample data...");

    await db.transaction(async (tx) => {
      await tx.insert(user).values({
        id: "eGSEvDEkKJ8GhH1nJdgXUsRcGL5FHQ9G",
        name: "Admin",
        email: "admin@tms.com",
        emailVerified: false,
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "admin",
        banned: false,
        banReason: null,
        banExpires: null,
      });

      await tx.insert(account).values({
        id: "9hAji7jEqq21X4Gujs9syl7hbdSBi7yR",
        accountId: "eGSEvDEkKJ8GhH1nJdgXUsRcGL5FHQ9G",
        providerId: "credential",
        userId: "eGSEvDEkKJ8GhH1nJdgXUsRcGL5FHQ9G",
        password:
          "6382b1fc56349722b84eca6d1491f7ee:320fd08c329b6b02e97fe83134c8164a568f919d0a3476beb6e4820d4d993a793c01650923e89ca7e52d96e8a4d7cea437d3928edcc216dc1c8f868da1b8a529",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

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
      console.log("\n🔐 Test credentials:");
      console.log("  Admin: admin@tms.com Password: SBFAdmin@123");
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
