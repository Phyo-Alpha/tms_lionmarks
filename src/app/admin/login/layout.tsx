import { getSession } from "@/client/lib/get-session";
import { LayoutProps } from "@/client/types/next";
import { redirect } from "next/navigation";
export default async function Layout({ children }: LayoutProps) {
  const session = await getSession();
  if (session.data) {
    if (session.data.user.role === "admin") {
      return redirect("/admin");
    } else {
      return redirect("/dashboard");
    }
  } else {
    return children;
  }
}
