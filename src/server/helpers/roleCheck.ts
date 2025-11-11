import type { AuthContext, Role } from "../lib/auth-middleware";
import { status } from "@/server/helpers/responseWrapper";

export const roleCheck = (auth: AuthContext, requiredRole: Role = "admin") => {
  const userRole = auth.user.role as Role;
  if (userRole !== requiredRole) {
    throw status("Unauthorized");
  }
};
