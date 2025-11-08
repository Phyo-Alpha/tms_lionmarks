import type { AuthContext, Role } from "../lib/auth-middleware";
import { status } from "@/server/helpers/responseWrapper";

export const roleCheck = (auth: AuthContext, requiredRole: Role = "admin") => {
  if (auth.user.role !== requiredRole) {
    throw status("Unauthorized");
  }
};
