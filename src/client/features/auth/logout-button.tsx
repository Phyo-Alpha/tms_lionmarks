"use client";

import { Button } from "@/client/components/ui/button";
import { authClient } from "@/client/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

interface LogoutButtonProps {
  /**
   * The text to display on the button when not loading
   * @default "Sign out"
   */
  children?: string;

  /**
   * The variant of the button
   * @default "destructive"
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Callback function called after successful logout
   */
  onLogout: () => void;
  /**
   * Callback function called when logout fails
   */
  onError?: (error: Error) => void;
}

/**
 * A reusable logout button component that handles user sign out functionality
 *
 * @example
 * ```tsx
 * <LogoutButton />
 *
 * <LogoutButton
 *   children="Logout"
 *   variant="outline"
 *   onLogout={() => console.log('Logged out successfully')}
 * />
 * ```
 */
export function LogoutButton({
  children = "Sign out",
  variant = "destructive",
  className,
  onLogout,
  onError,
}: LogoutButtonProps) {
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authClient.signOut();
    },
  });

  const handleLogout = () => {
    logoutMutation
      .mutateAsync(undefined, {
        onSuccess: () => {
          onLogout?.();
        },
      })
      .catch((error) => {
        console.error("Logout error:", error);
        onError?.(error as Error);
      });
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      className={className}
      isLoading={logoutMutation.isPending}
    >
      {children}
    </Button>
  );
}
