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
import { Clock, LogOut, Mail, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function WaitingAssignmentPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          setUser(session.data.user as User);

          // If user role changed from waiting_assignment, redirect appropriately
          if (session.data.user.role === "user") {
            router.push("/dashboard");
          } else if (session.data.user.role === "admin") {
            router.push("/admin");
          } else if (session.data.user.role !== "waiting_assignment") {
            // Any other role should go to login
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Poll for role changes every 30 seconds
    const interval = setInterval(checkAuth, 30000);

    return () => clearInterval(interval);
  }, [router]);

  const handleLogout = () => {
    authClient.signOut();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex w-full">
        <section className="w-full flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 border-2 border-amber-200">
            <Clock className="h-10 w-10 text-amber-600 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">
            Account Pending Assignment
          </CardTitle>
          <CardDescription className="text-base text-slate-600 mt-2">
            Your account has been successfully created and is awaiting administrator approval
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Logged in as:</p>
                <p className="text-sm text-blue-700 mt-1">{user.email}</p>
                {user.name && <p className="text-sm text-blue-700">{user.name}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold text-sm shrink-0">
                1
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Account Created</p>
                <p className="text-sm text-slate-600 mt-1">
                  You&apos;ve successfully signed in with your Microsoft account.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-semibold text-sm shrink-0">
                2
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Pending Administrator Review</p>
                <p className="text-sm text-slate-600 mt-1">
                  An administrator needs to assign you the appropriate role and permissions before
                  you can access the platform.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 font-semibold text-sm shrink-0">
                3
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Access Granted</p>
                <p className="text-sm text-slate-500 mt-1">
                  Once approved, you&apos;ll be able to access your dashboard and all platform
                  features.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-slate-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">What happens next?</p>
                <ul className="text-sm text-slate-600 mt-2 space-y-1 list-disc list-inside">
                  <li>An administrator will review your account</li>
                  <li>You&apos;ll be assigned the appropriate role</li>
                  <li>You may receive an email notification when your account is approved</li>
                  <li>This page will automatically redirect once your role is assigned</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <LogoutButton
              onLogout={handleLogout}
              variant="outline"
              className="w-full h-12 relative"
            >
              Sign out
            </LogoutButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
