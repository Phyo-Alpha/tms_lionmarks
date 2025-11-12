CREATE TABLE `account` (
	`id` varchar(255) NOT NULL,
	`account_id` varchar(255) NOT NULL,
	`provider_id` varchar(100) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp,
	`refresh_token_expires_at` timestamp,
	`scope` text,
	`password` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invitation` (
	`id` varchar(255) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`role` varchar(50),
	`status` varchar(50) NOT NULL DEFAULT 'pending',
	`expires_at` timestamp NOT NULL,
	`inviter_id` varchar(255) NOT NULL,
	CONSTRAINT `invitation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` varchar(255) NOT NULL,
	`organization_id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'member',
	`created_at` timestamp NOT NULL,
	`role_in_company` varchar(100),
	CONSTRAINT `member_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` varchar(255) NOT NULL,
	`name` varchar(500) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`logo` varchar(1000),
	`created_at` timestamp NOT NULL,
	`metadata` text,
	`uen` varchar(100) NOT NULL,
	`estimated_turnover` varchar(100),
	`year_in_operation` varchar(50),
	`participated_in_program_last5_years` varchar(50),
	`adequate_support_in_finance` varchar(50),
	CONSTRAINT `organization_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`token` varchar(500) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL,
	`ip_address` varchar(100),
	`user_agent` text,
	`user_id` varchar(255) NOT NULL,
	`impersonated_by` varchar(255),
	`active_organization_id` varchar(255),
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` varchar(1000),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`role` varchar(50),
	`banned` boolean DEFAULT false,
	`ban_reason` text,
	`ban_expires` timestamp,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course` (
	`id` varchar(36) NOT NULL,
	`code` varchar(100) NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`duration_hours` int NOT NULL DEFAULT 0,
	`start_date` timestamp,
	`end_date` timestamp,
	`capacity` int,
	`is_published` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `course_id` PRIMARY KEY(`id`),
	CONSTRAINT `course_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `course_registration` (
	`id` varchar(36) NOT NULL,
	`learner_id` varchar(36) NOT NULL,
	`course_id` varchar(36) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'enrolled',
	`registered_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`score` int,
	`certificate_url` varchar(1000),
	`notes` text,
	CONSTRAINT `course_registration_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learner` (
	`id` varchar(36) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(50),
	`organization` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'active',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`metadata` text,
	CONSTRAINT `learner_id` PRIMARY KEY(`id`),
	CONSTRAINT `learner_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `invitation` ADD CONSTRAINT `invitation_inviter_id_user_id_fk` FOREIGN KEY (`inviter_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `member` ADD CONSTRAINT `member_organization_id_organization_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `member` ADD CONSTRAINT `member_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_registration` ADD CONSTRAINT `course_registration_learner_id_learner_id_fk` FOREIGN KEY (`learner_id`) REFERENCES `learner`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `course_registration` ADD CONSTRAINT `course_registration_course_id_course_id_fk` FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON DELETE cascade ON UPDATE no action;