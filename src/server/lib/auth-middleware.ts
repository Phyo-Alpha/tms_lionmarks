import { Elysia } from "elysia";
import type { User, Session } from "better-auth";
import { auth } from "./auth";

export const authMiddleware = new Elysia({ name: "better-auth" }).mount(auth.handler).macro({
  auth: {
    resolve: async ({ request: { headers }, status }) => {
      const session = await auth.api.getSession({
        headers,
      });

      if (!session) return status("Unauthorized");

      return {
        user: session.user,
        session: session.session,
      };
    },
  },
});

export type Role = "admin" | "user" | null;

// Export types from better-auth with custom extensions
export type SessionUser = User & {
  role?: Role;
};

// Custom session type that extends better-auth Session with our custom fields
export type SessionData = Session & {
  activeOrganizationId?: string | null;
};

// Full auth context type (what the middleware returns)
export type AuthContext = {
  user: SessionUser;
  session: SessionData;
};
