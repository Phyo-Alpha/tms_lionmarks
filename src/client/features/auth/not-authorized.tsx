"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { LogoutButton } from "@/client/features/auth/logout-button";
import { authClient } from "@/client/lib/auth-client";
import { LogOut, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

interface NotAuthorizedProps {
  /**
   * Custom title for the not authorized message
   * @default "Access Denied"
   */
  title?: string;
  /**
   * Custom description for the not authorized message
   * @default "You are not authorized to access this page"
   */
  description?: string;
  /**
   * Whether to show the logout button with redirect options
   * @default true
   */
  showLogoutButton?: boolean;
  /**
   * The type of user to determine which login page to redirect to
   */
  role: "user" | "admin";
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * A component that displays when a user doesn't have permission to access a resource
 * Includes a logout button that redirects to the appropriate login page based on user role
 *
 * @example
 * ```tsx
 * <NotAuthorized role="user" />
 *
 * <NotAuthorized
 *   title="Restricted Access"
 *   description="This area is only available to administrators."
 *   role="admin"
 * />
 * ```
 */
export function NotAuthorized({
  title = "Access Denied",
  description = "You are not authorized to access this page",
  showLogoutButton = true,
  role,
  className,
}: NotAuthorizedProps) {
  const router = useRouter();

  const handleLogout = () => {
    authClient.signOut();
    const redirectPath = role === "admin" ? "/admin/login" : "/login";
    router.push(redirectPath);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <Shield className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">{title}</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            {showLogoutButton && (
              <div className="relative">
                <LogoutButton
                  onLogout={handleLogout}
                  variant={role === "admin" ? "outline" : "default"}
                  className="w-full h-12"
                >
                  {`Sign out and login with the proper credentials`}
                </LogoutButton>
                {role === "admin" ? (
                  <Shield className="text-primary-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                ) : (
                  <LogOut className="text-primary-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
