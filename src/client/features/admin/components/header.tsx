"use client";

import { LoginContainer } from "@/client/components/login-register/login-container";
import { Popover, PopoverContent, PopoverTrigger } from "@/client/components/ui/popover";
import { LogoutButton } from "@/client/features/auth/logout-button";
import { UserCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/client/lib/utils";
import { authClient } from "@/client/lib/auth-client";

function AdminHeader() {
  const router = useRouter();

  const handleLogout = () => {
    authClient.signOut().then(() => {
      router.push("/admin/login");
    });
  };

  return (
    <LoginContainer
      as="header"
      paddingOnly={true}
      className={cn(
        "flex items-center justify-between py-5 2.5xl:py-6 relative z-10 bg-background",
      )}
    >
      <div />
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="flex items-center justify-center p-2 rounded-full transition-all hover:bg-secondary/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary"
              aria-label="Profile"
            >
              <UserCircle className="w-8 h-8 2.5xl:w-10 2.5xl:h-10 text-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="end">
            <div className="space-y-1">
              <Link
                href="/admin/profile"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary/50"
              >
                <UserCircle className="w-4 h-4" />
                Profile
              </Link>
              <div className="relative">
                <LogoutButton
                  onLogout={handleLogout}
                  variant="ghost"
                  className="w-full justify-start pl-9"
                >
                  Sign out
                </LogoutButton>
                <LogOut className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </LoginContainer>
  );
}

export default AdminHeader;
