import { authClient } from "@/client/lib/auth-client";
import { eden } from "@/client/lib/eden";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const authQueries = {
  all: () => ["auth"] as const,
  getFullOrganization: (
    params: Parameters<typeof authClient.organization.getFullOrganization>[0],
  ) =>
    queryOptions({
      queryKey: [...authQueries.all(), "getFullOrganization", params],
      queryFn: async () => {
        const result = await authClient.organization.getFullOrganization(params);
        if (result.error) {
          throw new Error(result.error.message || "Failed to fetch organizations");
        }
        return result.data;
      },
    }),
  getActiveMemberRole: (
    params: Parameters<typeof authClient.organization.getActiveMemberRole>[0],
  ) =>
    queryOptions({
      queryKey: [...authQueries.all(), "getActiveMemberRole", params],
      queryFn: async () => {
        const result = await authClient.organization.getActiveMemberRole(params);
        if (result.error) {
          throw new Error(result.error.message || "Failed to fetch active member role");
        }
        return result.data;
      },
    }),
  login: () =>
    mutationOptions({
      mutationFn: async (data: { email: string; password: string }) => {
        const result = await authClient.signIn.email(data);

        if (result.error) {
          throw new Error(result.error.message || "Login failed");
        }

        return result.data;
      },
    }),
  register: () =>
    mutationOptions({
      mutationFn: async (data: { email: string; password: string; name?: string }) => {
        const name = data.name || data.email.split("@")[0] || "User";

        const result = await authClient.signUp.email({
          email: data.email,
          password: data.password,
          callbackURL: "/dashboard",
          name: name,
        });
        if (result.error) {
          throw new Error(result.error.message || "Registration failed");
        }

        return result.data;
      },
    }),
  checkUserExists: () =>
    mutationOptions({
      mutationFn: (params: { email: string }) => {
        return eden.auth["check-user"].post(params);
      },
    }),
  forgotPassword: () =>
    mutationOptions({
      mutationFn: async (data: { email: string; redirectTo?: string }) => {
        const result = await authClient.forgetPassword({
          email: data.email,
          redirectTo: data.redirectTo || "/password-reset",
        });

        if (result.error) {
          throw new Error(result.error.message || "Failed to send reset email");
        }

        return result.data;
      },
    }),
  passwordReset: () =>
    mutationOptions({
      mutationFn: async (data: { token: string; password: string }) => {
        const result = await authClient.resetPassword({
          token: data.token,
          newPassword: data.password,
        });
        if (result.error) {
          throw new Error(result.error.message || "Failed to reset password");
        }

        return result.data;
      },
    }),
  setActiveOrganization: () =>
    mutationOptions({
      mutationFn: async (data: { organizationId: string }) => {
        const result = await authClient.organization.setActive(data);
        if (result.error) {
          throw new Error(result.error.message || "Failed to set active organization");
        }
        return result.data;
      },
    }),
  inviteMember: () =>
    mutationOptions({
      mutationFn: async (data: {
        email: string;
        role: "admin" | "member" | "owner";
        organizationId: string;
      }) => {
        const result = await authClient.organization.inviteMember(data);
        if (result.error) {
          throw new Error(result.error.message || "Failed to invite member");
        }
        return result.data;
      },
    }),
};
