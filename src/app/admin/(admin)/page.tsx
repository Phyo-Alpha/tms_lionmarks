"use client";
import { authClient } from "@/client/lib/auth-client";
import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    const checkAuth = async () => {
      const session = await authClient.getSession();
      console.log(session);
    };
    checkAuth();
  }, []);
  return <div>Admin Page</div>;
}
