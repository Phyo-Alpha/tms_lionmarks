import { NotAuthorized } from "@/client/features/auth/not-authorized";
import { LayoutProps } from "@/client/types/next";
import { redirect } from "next/navigation";
import { getSession } from "../../../client/lib/get-session";
import AdminHeader from "@/client/features/admin/components/header";
import { AdminSidebar } from "@/client/features/admin/components/admin-sidebar";

export default async function Layout({ children }: LayoutProps) {
  const session = await getSession();
  if (!session.data) {
    return redirect("/admin/login");
  }

  const userRole = session.data?.user.role;

  if (userRole === "waiting_assignment") {
    return redirect("/waiting-assignment");
  }

  if (userRole !== "admin") {
    return <NotAuthorized role="admin" />;
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AdminHeader />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
