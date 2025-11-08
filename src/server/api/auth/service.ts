import { user } from "@/server/db/schema/auth-schema";
import { eq } from "drizzle-orm";
import { Database } from "..";
import type { CheckUserBody, CheckUserResponse } from "./model";

export abstract class Auth {
  static async checkUser(db: Database, body: CheckUserBody): Promise<CheckUserResponse> {
    const normalizedEmail = body.email.toLowerCase().trim();

    const existingUser = await db
      .select({ id: user.id, email: user.email })
      .from(user)
      .where(eq(user.email, normalizedEmail))
      .limit(1);

    const userExists = existingUser.length > 0;

    return {
      exists: userExists,
      email: normalizedEmail,
      message: userExists ? "User found" : "User not found - ready for registration",
    };
  }
}
