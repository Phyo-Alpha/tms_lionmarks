import { mysqlTable, varchar, text, timestamp, boolean } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: varchar("image", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: varchar("role", { length: 50 }),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 255 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 500 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: varchar("ip_address", { length: 100 }),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: varchar("impersonated_by", { length: 255 }),
  activeOrganizationId: varchar("active_organization_id", { length: 255 }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 100 }).notNull(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const organization = mysqlTable("organization", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  logo: varchar("logo", { length: 1000 }),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
  uen: varchar("uen", { length: 100 }).notNull(),
  estimatedTurnover: varchar("estimated_turnover", { length: 100 }),
  yearInOperation: varchar("year_in_operation", { length: 50 }),
  participatedInProgramLast5Years: varchar("participated_in_program_last5_years", { length: 50 }),
  adequateSupportInFinance: varchar("adequate_support_in_finance", { length: 50 }),
});

export const member = mysqlTable("member", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).default("member").notNull(),
  createdAt: timestamp("created_at").notNull(),
  roleInCompany: varchar("role_in_company", { length: 100 }),
});

export const invitation = mysqlTable("invitation", {
  id: varchar("id", { length: 255 }).primaryKey(),
  organizationId: varchar("organization_id", { length: 255 })
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: varchar("inviter_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
