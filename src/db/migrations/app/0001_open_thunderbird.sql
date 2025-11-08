CREATE TABLE "course" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"duration_hours" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"capacity" integer,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "course_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "course_registration" (
	"id" text PRIMARY KEY NOT NULL,
	"learner_id" text NOT NULL,
	"course_id" text NOT NULL,
	"status" text DEFAULT 'enrolled' NOT NULL,
	"registered_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"score" integer,
	"certificate_url" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "learner" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"organization" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"metadata" text,
	CONSTRAINT "learner_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "course_registration" ADD CONSTRAINT "course_registration_learner_id_learner_id_fk" FOREIGN KEY ("learner_id") REFERENCES "public"."learner"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_registration" ADD CONSTRAINT "course_registration_course_id_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "course_code_idx" ON "course" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "course_registration_unique" ON "course_registration" USING btree ("learner_id","course_id");--> statement-breakpoint
CREATE UNIQUE INDEX "learner_email_idx" ON "learner" USING btree ("email");